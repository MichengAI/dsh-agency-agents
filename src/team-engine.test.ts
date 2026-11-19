import { describe, expect, it, vi } from 'vitest'
import {
  detectTeamEngine,
  resolveTeamEngine,
  dispatchNativeTeam,
  blocksNativeDelegation,
  nativeV2TeamMemberName,
  type V2TeamService,
  type V2SubagentTeamRuntime,
} from './team-engine.js'
import { getSubagentConfig, clearSubagentRegistryForTest } from './subagent-registry.js'
import { BUILTIN_TEAMS } from './team-contract.js'

function nativeV2() {
  const descendants: Array<{ id: string; mode?: string; path?: string }> = []
  const agents = new Map<string, { status: string }>()
  let enabled = true
  const teamService = {
    isEnabled: vi.fn(() => enabled),
    createTask: vi.fn<V2TeamService['createTask']>(async () => ({ id: 't-1', revision: 1 })),
    getTask: vi.fn(() => ({})),
    listTasks: vi.fn(() => []),
    updateTask: vi.fn<V2TeamService['updateTask']>(async (_agent, _req, signal) => {
      signal?.throwIfAborted()
      return {}
    }),
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

describe('专家团运行引擎能力分流', () => {
  it('旧版本不支持时普通执行，不推荐不存在的能力', () => {
    expect(detectTeamEngine(undefined, false)).toMatchObject({ state: 'unsupported', mode: 'subagent', recommendation: '' })
  })
  it('安装能力不代表启用，未挂载时推荐开启但允许普通调用', () => {
    expect(detectTeamEngine(undefined, true)).toMatchObject({ state: 'disabled', mode: 'subagent', recommendation: expect.stringContaining('开启') })
  })
  it('只有兼容的已挂载接口才使用原生模式', () => {
    const v2 = nativeV2()
    expect(detectTeamEngine(v2.teamService, false, true, undefined, 'zh', v2.subagents)).toMatchObject({ state: 'enabled', mode: 'native' })
    expect(detectTeamEngine({}, true).mode).toBe('subagent')
    expect(detectTeamEngine(v2.teamService, true, false, undefined, 'zh', v2.subagents).mode).toBe('subagent')
  })
  it('显式深度限制不能被原生模式静默忽略', () => {
    const v2 = nativeV2()
    expect(detectTeamEngine(v2.teamService, true, true, 2, 'zh', v2.subagents)).toMatchObject({ mode: 'subagent', reason: expect.stringContaining('深度') })
  })
  it('只拦截本插件队友的递归委派，不影响通信和主理人', () => {
    const v2 = nativeV2()
    expect(blocksNativeDelegation(v2.teamService, {}, 'subagent', v2.subagents)).toBe(false)
    v2.subagents.namesOf.mockReturnValue({ self: `agency-reviewer-${'a'.repeat(10)}` })
    expect(blocksNativeDelegation(v2.teamService, {}, 'summon_expert', v2.subagents)).toBe(true)
    expect(blocksNativeDelegation(v2.teamService, {}, 'subagent_fork', v2.subagents)).toBe(true)
    expect(blocksNativeDelegation(v2.teamService, {}, 'send_message', v2.subagents)).toBe(false)
  })
})

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
    expect(firstSpec.prompt[0].text).toContain('新版专家职责正文')
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

    // 启动中取消中断已派发的 childId，且未启动成员的任务在清理时不会传入已 abort 的 signal
    v2.descendants.length = 0
    v2.teamService.updateTask.mockClear()
    const controller = new AbortController()
    let activationCount = 0
    v2.subagents.startActivation.mockImplementation(async (spec) => {
      activationCount++
      if (activationCount === 1) {
        // 第 1 个成功启动，然后触发 abort
        controller.abort()
        return { childId: spec.childId ?? 'c-abort', name: spec.name ?? 'ag' }
      }
      // 第 2 个启动时 signal 已 abort，抛出 abort 错误触发失败清理
      throw controller.signal.reason
    })
    await expect(dispatchNativeTeam({
      ...input(),
      service: v2.teamService,
      subagents: v2.subagents,
      ctx: v2.ctx as never,
      signal: controller.signal,
    })).rejects.toThrow()
    expect(v2.subagents.interrupt).toHaveBeenCalled()
    expect(v2.teamService.updateTask).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ action: 'delete' }),
    )
    expect(v2.teamService.updateTask.mock.calls[0][2]).toBeUndefined()
    clearSubagentRegistryForTest()
  })
})
