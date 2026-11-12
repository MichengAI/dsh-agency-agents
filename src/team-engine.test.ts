import { describe, expect, it, vi } from 'vitest'
import {
  detectTeamEngine,
  resolveTeamEngine,
  dispatchNativeTeam,
  blocksNativeDelegation,
  nativeV2TeamMemberName,
  type NativeTeamService,
  type V2TeamService,
  type V2SubagentTeamRuntime,
} from './team-engine.js'
import { getSubagentConfig, clearSubagentRegistryForTest } from './subagent-registry.js'
import { BUILTIN_TEAMS } from './team-contract.js'

function native() {
  const members: { name: string; status: string }[] = []
  const service = {
    tryMembership: vi.fn(() => ({ role: 'lead', name: 'lead' })),
    listMembers: vi.fn(() => members),
    spawnTeammate: vi.fn<NativeTeamService['spawnTeammate']>(async (_agent, request) => {
      const member = { name: request.name, status: 'running' }
      members.push(member)
      return { member }
    }),
    sendMessage: vi.fn(async () => ({})),
    createTask: vi.fn<NativeTeamService['createTask']>(async () => ({ id: '1', revision: 1 })),
    updateTask: vi.fn(async () => ({})),
    waitForChange: vi.fn(async () => ({})),
    interrupt: vi.fn(),
  } satisfies NativeTeamService
  return { service, members }
}

describe('专家团运行引擎能力分流', () => {
  it('旧版本不支持时普通执行，不推荐不存在的能力', () => {
    expect(detectTeamEngine(undefined, false)).toMatchObject({ state: 'unsupported', mode: 'subagent', recommendation: '' })
  })
  it('安装能力不代表启用，未挂载时推荐开启但允许普通调用', () => {
    expect(detectTeamEngine(undefined, true)).toMatchObject({ state: 'disabled', mode: 'subagent', recommendation: expect.stringContaining('开启') })
  })
  it('只有兼容的已挂载接口才使用原生模式', () => {
    const { service } = native()
    expect(detectTeamEngine(service, false)).toMatchObject({ state: 'enabled', mode: 'native' })
    expect(detectTeamEngine({}, true).mode).toBe('subagent')
    expect(detectTeamEngine(service, true, false).mode).toBe('subagent')
  })
  it('显式深度限制不能被原生模式静默忽略', () => {
    expect(detectTeamEngine(native().service, true, true, 2)).toMatchObject({ mode: 'subagent', reason: expect.stringContaining('深度') })
  })
  it('只拦截本插件队友的递归委派，不影响通信和主理人', () => {
    const { service } = native()
    expect(blocksNativeDelegation(service, {}, 'subagent')).toBe(false)
    service.tryMembership.mockReturnValue({ role: 'teammate', name: `agency-reviewer-${'a'.repeat(10)}` })
    expect(blocksNativeDelegation(service, {}, 'summon_expert')).toBe(true)
    expect(blocksNativeDelegation(service, {}, 'subagent_fork')).toBe(true)
    expect(blocksNativeDelegation(service, {}, 'send_message')).toBe(false)
  })
  it('按当前智能体作用域检测工具，不能误读全局工具表', () => {
    const { service } = native()
    const get = vi.fn((_name: string, scope?: unknown) => scope === agent ? {} : undefined)
    const agent = { ctx: { tools: { get } } }
    const ctx = { get: () => service }
    expect(resolveTeamEngine(ctx as never, agent as never).status.mode).toBe('native')
    expect(get).toHaveBeenCalledWith('spawn_teammate', agent)
  })
})

describe('原生专家团启动语义', () => {
  const team = BUILTIN_TEAMS[0]
  const input = () => ({
    team, revision: 1, task: '评审现有方案', enabled: team.members.map(m => m.expertSlug),
    experts: team.members.map(m => ({ slug: m.expertSlug, name: m.expertSlug, nameEn: m.expertSlug, division: 'engineering', divisionZh: '工程', description: '', descriptionEn: '', emoji: '', custom: false })),
    readPersona: async () => '专家职责正文', agent: {}, provider: 'spawn', signal: new AbortController().signal,
  })
  it('英文环境使用英文显示名，同时保留稳定队友标识', async () => {
    const { service } = native()
    const args = input()
    args.experts = args.experts.map(expert => ({ ...expert, name: '中文专家', nameEn: 'Expert' }))
    const report = await dispatchNativeTeam({ ...args, service, locale: 'en' })
    expect(service.spawnTeammate.mock.calls[0][1].description).toBe('Expert')
    expect(service.spawnTeammate.mock.calls[0][1].name).toMatch(/^agency-[a-z0-9-]+-[0-9a-f]{10}$/u)
    expect(report.dispatch.members[0].expert).toBe('Expert')
    expect(JSON.stringify(report)).not.toMatch(/[\u3400-\u9fff]/u)
    expect(service.createTask.mock.calls[0][1].subject).toContain('Product Review Team')
  })
  it('创建队友与任务，报告启动状态而非虚构完成结果', async () => {
    const { service } = native()
    const result = await dispatchNativeTeam({ ...input(), service })
    expect(service.spawnTeammate).toHaveBeenCalledTimes(3)
    expect(service.createTask).toHaveBeenCalledTimes(3)
    expect(result.dispatch.started).toBe(3)
    expect(result).not.toHaveProperty('coverage')
    expect(result).not.toHaveProperty('results')
    expect(service.spawnTeammate.mock.calls[0][1].prompt[0].text).toContain('专家职责正文')
    expect(result.instruction).toContain('wait_agent')
  })
  it('创建失败只报告失败，不重复走普通路径', async () => {
    const { service } = native()
    service.spawnTeammate.mockRejectedValue(new Error('名额已满'))
    const result = await dispatchNativeTeam({ ...input(), service })
    expect(result.dispatch.started).toBe(0)
    expect(result.dispatch.members.every(m => m.error?.includes('名额已满'))).toBe(true)
    expect(service.updateTask).toHaveBeenCalledTimes(3)
    expect(result.dispatch.members.every(m => m.taskId === undefined)).toBe(true)
  })
  it('同一专家队友空闲时复用，运行中不重复派发', async () => {
    const { service, members } = native()
    const args = { ...input(), service }
    await dispatchNativeTeam(args)
    const busy = await dispatchNativeTeam(args)
    expect(busy.dispatch.started).toBe(0)
    members.forEach(m => { m.status = 'idle' })
    const reused = await dispatchNativeTeam(args)
    expect(reused.dispatch.started).toBe(3)
    expect(service.spawnTeammate).toHaveBeenCalledTimes(3)
    expect(service.sendMessage).toHaveBeenCalledTimes(3)
  })
  it('清理失败时保留任务编号，方便用户定位任务板', async () => {
    const { service } = native()
    service.spawnTeammate.mockRejectedValue(new Error('创建失败'))
    service.updateTask.mockRejectedValue(new Error('清理失败'))
    const result = await dispatchNativeTeam({ ...input(), service })
    expect(result.dispatch.members.every(member => member.status === 'failed' && member.taskId === '1' && member.error?.includes('清理失败'))).toBe(true)
  })
  it('启动前取消不创建任何队友', async () => {
    const { service } = native()
    await expect(dispatchNativeTeam({ ...input(), service, signal: AbortSignal.abort() })).rejects.toThrow()
    expect(service.spawnTeammate).not.toHaveBeenCalled()
  })
  it('启动中取消会等待在途调用收敛并中断已启动队友', async () => {
    const { service } = native()
    const controller = new AbortController()
    service.spawnTeammate.mockImplementation(async (_agent, request) => {
      await Promise.resolve()
      controller.abort()
      return { member: { name: request.name, status: 'running' } }
    })
    await expect(dispatchNativeTeam({ ...input(), service, signal: controller.signal })).rejects.toThrow()
    expect(service.interrupt.mock.calls.length).toBe(service.spawnTeammate.mock.calls.length)
    expect(service.interrupt).toHaveBeenCalled()
  })
})

function nativeV2() {
  const descendants: Array<{ id: string; mode?: string; path?: string }> = []
  const agents = new Map<string, { status: string }>()
  let enabled = true
  const teamService = {
    isEnabled: vi.fn(() => enabled),
    createTask: vi.fn<V2TeamService['createTask']>(async () => ({ id: 't-1', revision: 1 })),
    getTask: vi.fn(() => ({})),
    listTasks: vi.fn(() => []),
    updateTask: vi.fn(async () => ({})),
  } satisfies V2TeamService
  const subagents = {
    startActivation: vi.fn<V2SubagentTeamRuntime['startActivation']>(async (spec) => {
      const id = spec.childId ?? `child-${descendants.length + 1}`
      descendants.push({ id, mode: 'continuable', path: spec.name })
      agents.set(id, { status: 'running' })
      return { childId: id, name: spec.name ?? 'agent-1' }
    }),
    rootOf: vi.fn(() => ({ id: 'root-1' })),
    namesOf: vi.fn(() => ({ self: 'lead' })),
    listDescendants: vi.fn(async () => [...descendants]),
    sendMessage: vi.fn(async () => ({})),
    interrupt: vi.fn(),
    getProvider: vi.fn(() => ({ prepareContinuable: () => ({}) })),
  } satisfies V2SubagentTeamRuntime
  const ctx = {
    get: (key: string) => {
      if (key === 'agentTeams') return teamService
      if (key === 'subagents') return subagents
      if (key === 'agents') return { get: (id: string) => agents.get(id) }
      return undefined
    },
  }
  return {
    teamService,
    subagents,
    descendants,
    agents,
    ctx,
    setEnabled: (next: boolean) => { enabled = next },
  }
}

describe('0.2.2-rc.2+ 新版内置 Agent Team 协同适配', () => {
  const team = BUILTIN_TEAMS[0]
  const input = () => ({
    team,
    revision: 1,
    task: '评审新版团队架构',
    enabled: team.members.map(m => m.expertSlug),
    experts: team.members.map(m => ({
      slug: m.expertSlug,
      name: m.expertSlug,
      nameEn: m.expertSlug,
      division: 'engineering',
      divisionZh: '工程',
      description: '',
      descriptionEn: '',
      emoji: '',
      custom: false,
    })),
    readPersona: async () => '新版专家职责正文',
    agent: { id: 'root-1' },
    provider: 'spawn',
    signal: new AbortController().signal,
  })

  it('v2 队友命名始终满足 32 字符上限且保留稳定前缀与哈希格式', () => {
    const longSlug = 'very-long-specialized-engineering-enterprise-security-auditor-expert'
    const name = nativeV2TeamMemberName('team-1', longSlug)
    expect(name.length).toBeLessThanOrEqual(32)
    expect(name).toMatch(/^agency-[a-z0-9-]+-[0-9a-f]{10}$/u)
    expect(name).toBe(nativeV2TeamMemberName('team-1', longSlug))
  })

  it('按会话开关与 v2 控制工具状态决定是否进入原生模式', () => {
    const v2 = nativeV2()
    const get = vi.fn((_name: string, scope?: unknown) => scope === agent ? {} : undefined)
    const agent = { ctx: { tools: { get } } }
    expect(resolveTeamEngine(v2.ctx as never, agent as never).status.mode).toBe('native')
    expect(get).toHaveBeenCalledWith('list_agents', agent)
    expect(get).toHaveBeenCalledWith('team_task_create', agent)
    expect(get).not.toHaveBeenCalledWith('spawn_teammate', agent)

    v2.setEnabled(false)
    expect(resolveTeamEngine(v2.ctx as never, agent as never).status).toMatchObject({
      state: 'disabled',
      mode: 'subagent',
    })
  })

  it('v2 模式下仅拦截本插件队友的递归委派，放行通信工具', () => {
    const v2 = nativeV2()
    expect(blocksNativeDelegation(v2.teamService, {}, 'summon_expert', v2.subagents)).toBe(false)
    v2.subagents.namesOf.mockReturnValue({ self: `agency-reviewer-${'a'.repeat(10)}` })
    expect(blocksNativeDelegation(v2.teamService, {}, 'summon_expert', v2.subagents)).toBe(true)
    expect(blocksNativeDelegation(v2.teamService, {}, 'subagent', v2.subagents)).toBe(true)
    expect(blocksNativeDelegation(v2.teamService, {}, 'subagent_fork', v2.subagents)).toBe(true)
    expect(blocksNativeDelegation(v2.teamService, {}, 'send_message', v2.subagents)).toBe(false)
  })

  it('v2 原生派发使用扁平 startActivation + 注册表人格注入，空闲复用、失败清理且取消可中断', async () => {
    clearSubagentRegistryForTest()
    const v2 = nativeV2()
    const report = await dispatchNativeTeam({
      ...input(),
      service: v2.teamService,
      subagents: v2.subagents,
      ctx: v2.ctx as never,
    })
    expect(report.dispatch.started).toBe(3)
    expect(v2.subagents.startActivation).toHaveBeenCalledTimes(3)
    const firstSpec = v2.subagents.startActivation.mock.calls[0][0]
    expect(firstSpec.delivery).toBe('parent')
    expect(firstSpec.name!.length).toBeLessThanOrEqual(32)
    expect(firstSpec).not.toHaveProperty('request')
    expect(getSubagentConfig(firstSpec.childId!)?.persona).toBe('新版专家职责正文')

    // 运行中不重复派发
    const busy = await dispatchNativeTeam({
      ...input(),
      service: v2.teamService,
      subagents: v2.subagents,
      ctx: v2.ctx as never,
    })
    expect(busy.dispatch.started).toBe(0)

    // 变为空闲后通过 sendMessage 唤醒复用
    for (const val of v2.agents.values()) val.status = 'idle'
    const reused = await dispatchNativeTeam({
      ...input(),
      service: v2.teamService,
      subagents: v2.subagents,
      ctx: v2.ctx as never,
    })
    expect(reused.dispatch.started).toBe(3)
    expect(v2.subagents.sendMessage).toHaveBeenCalledTimes(3)

    // 启动失败时撤回注册表记录与共享任务
    clearSubagentRegistryForTest()
    v2.descendants.length = 0
    v2.subagents.startActivation.mockRejectedValueOnce(new Error('activation failed'))
    const partial = await dispatchNativeTeam({
      ...input(),
      service: v2.teamService,
      subagents: v2.subagents,
      ctx: v2.ctx as never,
    })
    expect(partial.dispatch.started).toBe(2)
    expect(v2.teamService.updateTask).toHaveBeenCalledTimes(1)

    // 启动中取消中断已派发的 childId
    v2.descendants.length = 0
    const controller = new AbortController()
    v2.subagents.startActivation.mockImplementationOnce(async (spec) => {
      await Promise.resolve()
      controller.abort()
      return { childId: spec.childId ?? 'c-abort', name: spec.name ?? 'ag' }
    })
    await expect(dispatchNativeTeam({
      ...input(),
      service: v2.teamService,
      subagents: v2.subagents,
      ctx: v2.ctx as never,
      signal: controller.signal,
    })).rejects.toThrow()
    expect(v2.subagents.interrupt).toHaveBeenCalled()
    clearSubagentRegistryForTest()
  })
})
