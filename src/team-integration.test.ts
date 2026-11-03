import { describe, it, expect, vi } from 'vitest'
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import ToolRuntime, { defineTool } from '@deepseek-ai/dsh-tools'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { createScope } from '@deepseek-ai/dsh-scope'
import type { NativeTeamService } from './team-engine.js'
import { EXPERT_TOOL_DENY } from './team-engine.js'
import { Context } from '@deepseek-ai/cordis'
import {
  clearSubagentRegistryForTest,
  recordSubagentConfig,
  flushSubagentRegistrySync,
  getSubagentConfig,
  initSubagentRegistry,
} from './subagent-registry.js'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { apply, DEFAULT_DIVISIONS } from './index.js'
import AgencyAgentsRemote from './remote.js'
import { BUILTIN_TEAMS } from './team-contract.js'
import { MemorySettings } from './settings-memory.js'
class TestSettings extends MemorySettings {
  protected async persist(
    _ns: SettingsNamespace,
    _section: Record<string, unknown>,
  ): Promise<void> {}
}

function volatileConfig(settings: TestSettings) {
  settings.register('agency-agents', (value) => value)
  const read = () => (settings.get('agency-agents') ?? {}) as {
    enabled?: string[]
    customExperts?: unknown[]
    customTeams?: unknown[]
    enabledTeams?: string[]
  }
  return {
    enabled: { get: () => read().enabled ?? [] },
    customExperts: { get: () => read().customExperts ?? [] },
    customTeams: { get: () => read().customTeams ?? [] },
    enabledTeams: { get: () => read().enabledTeams ?? [] },
  }
}
describe('专家团宿主与远端集成', () => {
  it('五团名册、启用、主理人规则、三人委派、子会话隔离与停用', async () => {
    const settings = new TestSettings(new Context())
    // 这个用例断言中文主理人规则，因此显式选择 zh；未选择时宿主按 DSH 约定回退 en。
    settings.register('locale', (value) => value)
    settings.restore({ 'agency-agents': { enabled: [] }, locale: { preference: 'zh' } })
    const services = new Map<string, unknown>()
    const tools = new Map<
      string,
      { execute(args: unknown, exec?: unknown): Promise<unknown> }
    >()
    const starts: Record<string, unknown>[] = []
    const ctx = {
      settings,
      effect: () => () => {},
      inject: (_deps: unknown, callback: (ctx: unknown) => void) =>
        callback(ctx),
      reflect: {
        provide: (key: string, value: unknown) => services.set(key, value),
      },
      get: (key: string) => services.get(key),
      typert: { register: () => {} },
      tools: {
        register: (tool: {
          name: string
          execute(args: unknown, exec?: unknown): Promise<unknown>
        }) => tools.set(tool.name, tool),
      },
      systemPrompt: { section: () => {} },
      on: () => () => undefined,
      subagents: {
        getProvider: () => ({
          capabilities: { persona: true, toolFilter: true },
        }),
        start: async (_provider: string, options: Record<string, unknown>) => {
          starts.push(options)
          return {
            result: Promise.resolve({
              output: [{ type: 'text', text: '租赁建议' }],
              stopReason: 'completed',
            }),
            dispose: async () => {},
          }
        },
      },
    } as unknown as Context
    apply(ctx, { root: '', provider: 'spawn', divisions: DEFAULT_DIVISIONS, ...volatileConfig(settings) } as never)
    const remote = new AgencyAgentsRemote(ctx)
    const initial = await remote.getTeams()
    expect(initial.teams).toHaveLength(5)
    expect(Object.values(initial.nativeMembers ?? {})).toEqual(initial.teams.flatMap(group => group.members.map(member => member.expertSlug)))
    const catalog = await remote.getCatalog()
    for (const group of initial.teams) {
      for (const member of group.members) {
        expect(catalog.experts.some(expert => expert.slug === member.expertSlug && !expert.conflict)).toBe(true)
      }
    }
    const team = BUILTIN_TEAMS[0]
    const enabled = await remote.setTeamEnabled(team.id, true, initial.revision)
    expect(enabled.enabledExperts).toEqual(
      expect.arrayContaining(team.members.map((m) => m.expertSlug)),
    )
    const invoke = async (
      name: string,
      args: unknown,
      exec: unknown = { agent: {} },
    ) => {
      const result = (await tools.get(name)!.execute(args, exec)) as {
        report: string
      }
      return JSON.parse(result.report)
    }
    expect(await invoke('list_expert_teams', {})).toHaveLength(1)
    expect(await invoke('get_expert_team', { team: team.id })).toMatchObject({
      id: team.id,
      coordinator: expect.stringContaining('处理分歧'),
      collaboration: { preparation: expect.any(Array), reviewChecklist: expect.any(Array) },
    })
    const report = await invoke('summon_expert_team', {
      team: team.id,
      task: '评审当前需求的价值与实现边界',
    })
    expect(report.results).toHaveLength(3)
    expect(report.coverage).toMatchObject({ status: 'complete', completed: 3, total: 3 })
    expect(report.results.every((result: { ok: boolean }) => result.ok)).toBe(
      true,
    )
    expect(starts).toHaveLength(3)
    expect(starts.map(start => start.label)).toEqual(team.members.map(member => catalog.experts.find(expert => expert.slug === member.expertSlug)!.name))
    for (const start of starts) {
      expect(start.persona).toEqual(expect.any(String))
      expect(start.prompt).toEqual([{ type: 'text', text: expect.stringContaining('交接给主理人') }])
      expect(start.toolFilter).toMatchObject({
        deny: expect.arrayContaining([
          'summon_expert_team',
          'summon_expert',
          'summon_experts',
        ]),
      })
    }
    await expect(
      invoke(
        'summon_expert_team',
        { team: team.id, task: '递归' },
        { agent: { session: { header: { parentSession: 'parent' } } } },
      ),
    ).rejects.toThrow('专家成员')
    await expect(
      remote.setTeamEnabled(team.id, false, initial.revision),
    ).rejects.toThrow()
    await remote.setTeamEnabled(team.id, false, enabled.revision)
    await expect(
      invoke('summon_expert_team', { team: team.id, task: '再次运行' }),
    ).rejects.toThrow('未启用')
    expect(starts).toHaveLength(3)
    const { id: _id, builtin: _builtin, ...draft } = team
    const before = await remote.getTeams()
    const custom = await remote.saveTeam({ ...draft, name: '自定义验收团', coordinatorMode: 'custom', coordinatorPrompt: '优先输出反证和待确认事项。' }, true, before.revision)
    const saved = custom.teams.find(group => !group.builtin)!
    const customReport = await invoke('summon_expert_team', { team: saved.id, task: '评审配置变更' })
    expect(customReport.coordinator).toBe('优先输出反证和待确认事项。')
    expect(customReport.results).toHaveLength(3)
    const deleted = await remote.deleteTeam(saved.id, custom.revision)
    expect(deleted.enabledExperts).toEqual(custom.enabledExperts)
    await expect(invoke('get_expert_team', { team: saved.id })).rejects.toThrow('未启用')
    const latest = await remote.getTeams()
    await remote.setTeamEnabled(team.id, true, latest.revision)
    const native: NativeTeamService = {
      tryMembership: () => ({ role: 'lead', name: 'lead' }),
      listMembers: () => [],
      spawnTeammate: vi.fn(async (_agent, request) => ({ member: { name: request.name, status: 'running' } })),
      sendMessage: async () => ({}),
      createTask: async () => ({ id: '1', revision: 1 }),
      updateTask: async () => ({}), waitForChange: async () => ({}), interrupt: () => {},
    }
    services.set('agentTeams', native)
    expect((await remote.getTeams()).engine).toMatchObject({ state: 'enabled', mode: 'native' })
    const notReady = await invoke('get_expert_team', { team: team.id })
    expect(notReady.engine).toMatchObject({ state: 'disabled', mode: 'subagent', recommendation: expect.stringContaining('开启') })
    const priorStarts = starts.length
    const nativeReport = await invoke('summon_expert_team', { team: team.id, task: '评审整体方案' }, {
      agent: { ctx: { tools: { get: () => ({}) } } }, signal: new AbortController().signal,
    })
    expect(nativeReport.engine).toMatchObject({ state: 'enabled', mode: 'native' })
    expect(nativeReport.dispatch.started).toBe(3)
    expect(nativeReport).not.toHaveProperty('coverage')
    expect(starts).toHaveLength(priorStarts)
    expect(native.spawnTeammate).toHaveBeenCalledTimes(3)
  })

  it('Native Agent Team 模式生成的队友在 prompt 中强化防递归，并在 agent/created 时注入人格与工具裁剪', async () => {
    const settings = new TestSettings(new Context())
    settings.register('locale', (value) => value)
    settings.restore({ 'agency-agents': { enabled: [] }, locale: { preference: 'zh' } })
    const services = new Map<string, unknown>()
    const tools = new Map<string, { execute(args: unknown, exec?: unknown): Promise<unknown> }>()
    const teamListeners: Array<(event: any) => any> = []
    const teammateCalls: Array<{ name: string; text: string }> = []
    const injectedSections: any[] = []
    const injectedRestrictions: any[] = []

    const native: NativeTeamService = {
      tryMembership: (agent: any) => {
        if (agent?.id && String(agent.id).startsWith('teammate-')) {
          return { role: 'teammate', name: agent.mockName }
        }
        return { role: 'lead', name: 'lead' }
      },
      listMembers: () => [],
      spawnTeammate: vi.fn(async (_agent, request) => {
        teammateCalls.push({ name: request.name, text: request.prompt[0].text })
        // 模拟宿主底层创建 Agent 触发 agent/created
        const childCtx = {
          systemPrompt: {
            getSectionOrder: () => 100,
            section: (sec: any) => { injectedSections.push(sec) },
          },
          tools: {
            restrict: (filter: any) => { injectedRestrictions.push(filter) },
          },
        }
        const fakeAgent = { id: `teammate-${request.name}`, mockName: request.name, ctx: childCtx }
        for (const listener of teamListeners) {
          listener({ agent: fakeAgent, source: 'startup' })
        }
        return { member: { name: request.name, status: 'running' } }
      }),
      sendMessage: async () => ({}),
      createTask: async () => ({ id: '1', revision: 1 }),
      updateTask: async () => ({}),
      waitForChange: async () => ({}),
      interrupt: () => {},
    }
    services.set('agentTeams', native)

    const ctx = {
      settings,
      effect: () => () => {},
      inject: (_deps: unknown, callback: (ctx: unknown) => void) => callback(ctx),
      reflect: { provide: (key: string, value: unknown) => services.set(key, value) },
      get: (key: string) => services.get(key),
      typert: { register: () => {} },
      tools: {
        register: (tool: { name: string; execute: (args: unknown, exec?: unknown) => Promise<unknown> }) =>
          tools.set(tool.name, tool),
      },
      systemPrompt: { section: () => {} },
      on: (event: string, cb: any) => {
        if (event === 'agent/created') teamListeners.push(cb)
        return () => {
          const idx = teamListeners.indexOf(cb)
          if (idx >= 0) teamListeners.splice(idx, 1)
        }
      },
      subagents: {
        getProvider: () => ({ capabilities: { persona: true, toolFilter: true } }),
        start: async () => ({ result: Promise.resolve({ output: [], stopReason: 'completed' }), dispose: async () => {} }),
      },
    } as unknown as Context

    apply(ctx, { root: '', provider: 'spawn', divisions: DEFAULT_DIVISIONS, ...volatileConfig(settings) } as never)
    const remote = new AgencyAgentsRemote(ctx)
    const team = BUILTIN_TEAMS[0]
    const initial = await remote.getTeams()
    await remote.setTeamEnabled(team.id, true, initial.revision)

    const result = (await tools.get('summon_expert_team')!.execute(
      { team: team.id, task: 'Native 路径防递归与工具裁剪验证' },
      { agent: { ctx: { tools: { get: () => ({}) } } }, signal: new AbortController().signal },
    )) as { report: string }
    const report = JSON.parse(result.report)
    expect(report.engine).toMatchObject({ state: 'enabled', mode: 'native' })
    expect(report.dispatch.started).toBe(3)

    // 断言 1：队友收到的 prompt 明确包含严禁使用召唤工具的说明
    expect(teammateCalls).toHaveLength(3)
    for (const call of teammateCalls) {
      expect(call.text).toContain('严禁使用任何专家召唤工具')
    }

    // 断言 2：队友在 agent/created 时被注入 tools.restrict（严格裁掉 6 个全局召唤工具，坚决排除自身的 spawn_teammate）
    expect(injectedRestrictions).toHaveLength(3)
    for (const filter of injectedRestrictions) {
      expect(filter).toEqual({
        deny: ['summon_expert', 'summon_experts', 'list_experts', 'list_expert_teams', 'get_expert_team', 'summon_expert_team'],
      })
    }

    // 断言 3：队友的人设已完整且持久地嵌入首条任务 Prompt 中，不再重复叠加入易失的 systemPrompt.section 以免 Token 翻倍
    expect(injectedSections).toHaveLength(0)
  })

  it('队友 tools.restrict 遇到未知工具抛错时会被静默安全隔离，不向外中断创建广播', async () => {
    const settings = new TestSettings(new Context())
    settings.register('locale', (value) => value)
    settings.restore({ 'agency-agents': { enabled: [] }, locale: { preference: 'zh' } })
    const services = new Map<string, unknown>()
    const tools = new Map<string, { execute(args: unknown, exec?: unknown): Promise<unknown> }>()
    let createdListener: ((event: any) => any) | undefined

    const native: NativeTeamService = {
      tryMembership: (agent: any) => ({ role: 'teammate', name: agent.mockName }),
      listMembers: () => [],
      spawnTeammate: vi.fn(async () => ({ member: { name: 'agency-pm-1234567890', status: 'running' } })),
      sendMessage: async () => ({}),
      createTask: async () => ({ id: '1', revision: 1 }),
      updateTask: async () => ({}),
      waitForChange: async () => ({}),
      interrupt: () => {},
    }
    services.set('agentTeams', native)

    const ctx = {
      settings,
      effect: () => () => {},
      inject: (_deps: unknown, callback: (ctx: unknown) => void) => callback(ctx),
      reflect: { provide: (key: string, value: unknown) => services.set(key, value) },
      get: (key: string) => services.get(key),
      typert: { register: () => {} },
      tools: {
        register: (tool: { name: string; execute: (args: unknown, exec?: unknown) => Promise<unknown> }) =>
          tools.set(tool.name, tool),
      },
      systemPrompt: { section: () => {} },
      on: (event: string, cb: any) => {
        if (event === 'agent/created') createdListener = cb
        return () => {}
      },
      subagents: {
        getProvider: () => ({ capabilities: { persona: true, toolFilter: true } }),
        start: async () => ({ result: Promise.resolve({ output: [], stopReason: 'completed' }), dispose: async () => {} }),
      },
    } as unknown as Context

    apply(ctx, { root: '', provider: 'spawn', divisions: DEFAULT_DIVISIONS, ...volatileConfig(settings) } as never)
    expect(createdListener).toBeDefined()

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // 模拟子代理的 tools.restrict 抛出类似于 unknown global tool 的异常
    const brokenChildCtx = {
      tools: {
        restrict: () => {
          throw new Error('tools.restrict() names unknown global tool "spawn_teammate"')
        },
      },
    }
    const fakeAgent = { id: 'child-err', mockName: 'agency-test-1234567890', ctx: brokenChildCtx }

    // 必须安全返回 undefined，绝不把异常抛出
    expect(() => createdListener!({ agent: fakeAgent, source: 'startup' })).not.toThrow()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[agency-agents] tools.restrict failed for agent %s:'),
      'child-err',
      expect.any(Error),
    )
    warnSpy.mockRestore()
  })

  it('验证 EXPERT_TOOL_DENY 在真实 dsh-tools 作用域下可成功 restrict 且阻断未知工具', async () => {
    const root = new Context()
    await root.plugin(SystemPrompt, {}).await()
    await root.plugin(ToolRuntime, {}).await()
    await new Promise((r) => setTimeout(r, 60))
    const box: Record<string, any> = {}
    // 冻结真实生产环境中注册在全局的工具名（独立字面量，不从 EXPERT_TOOL_DENY 派生，杜绝同义反复与假绿）
    const PRODUCTION_GLOBAL_TOOLS = [
      'summon_expert',
      'summon_experts',
      'list_experts',
      'list_expert_teams',
      'get_expert_team',
      'summon_expert_team',
      'read_file',
    ] as const
    await root
      .plugin({
        inject: ['tools', 'systemPrompt'],
        apply(c: any) {
          for (const name of PRODUCTION_GLOBAL_TOOLS) {
            c.tools.register(
              defineTool({
                name,
                description: name,
                parameters: {},
                output: { schema: { type: 'object', additionalProperties: false, properties: {} }, render: () => [] },
                execute: async () => ({}),
              }),
            )
          }
          const fakeTeammate = { id: 'agent-contract-check' }
          const scoped = createScope(c, fakeTeammate)
          box.teammate = scoped.ctx
          scoped.ctx.tools.register(
            defineTool({
              name: 'send_message',
              description: 'send_message',
              parameters: {},
              output: { schema: { type: 'object', additionalProperties: false, properties: {} }, render: () => [] },
              execute: async () => ({}),
            }),
          )
        },
      })
      .await()

    await new Promise((r) => setTimeout(r, 50))
    expect(box.teammate).toBeDefined()

    // 正向断言：生产常量中的 6 个工具执行 restrict 不抛错
    expect(() => {
      box.teammate.tools.restrict({ deny: [...EXPERT_TOOL_DENY] })
    }).not.toThrow()

    // 哨兵断言：如果把 own 作用域工具混入 deny，真实 dsh-tools 必须直接抛错
    expect(() => {
      box.teammate.tools.restrict({ deny: [...EXPERT_TOOL_DENY, 'send_message'] })
    }).toThrow(/names unknown global tool "send_message"/)
  })

  it('受管专家子代理调用召唤工具会被 tools/pre-execute 门禁双重拦截', async () => {
    const tempHome = await mkdtemp(join(tmpdir(), 'aag-team-home-'))
    try {
      const settings = new TestSettings(new Context())
      settings.register('locale', (value) => value)
      settings.restore({ 'agency-agents': { enabled: ['engineering-code-reviewer'] }, locale: { preference: 'zh' } })
      const services = new Map<string, unknown>()
      const tools = new Map<string, { execute(args: unknown, exec?: unknown): Promise<unknown> }>()
      let preExecuteHook: ((exec: any, next: () => any) => Promise<any>) | undefined
      let createdListener: ((event: any) => any) | undefined
      let spawnedChildId: string | undefined

      const ctx = {
        settings,
        effect: () => () => {},
        inject: (_deps: unknown, callback: (ctx: unknown) => void) => callback(ctx),
        reflect: { provide: (key: string, value: unknown) => services.set(key, value) },
        get: (key: string) => key === 'profileContext' ? { home: tempHome } : services.get(key),
        typert: { register: () => {} },
        tools: {
          register: (tool: { name: string; execute: (args: unknown, exec?: unknown) => Promise<unknown> }) =>
            tools.set(tool.name, tool),
        },
        systemPrompt: { section: () => {} },
        on: (event: string, cb: any) => {
          if (event === 'tools/pre-execute') preExecuteHook = cb
          if (event === 'agent/created') createdListener = cb
          return () => {}
        },
        subagents: {
          getProvider: () => ({ capabilities: { depthLimit: true } }),
          startActivation: async (spec: any) => {
            spawnedChildId = spec.childId
            createdListener?.({ agent: { id: spec.childId, ctx: { tools: { restrict: () => {} } } }, source: 'startup' })
            return {
              childId: spec.childId,
              result: Promise.resolve({ output: [{ type: 'text', text: 'done' }], stopReason: 'completed' }),
              dispose: async () => {},
            }
          },
        },
      } as unknown as Context

      apply(ctx, { root: '', provider: 'spawn', divisions: DEFAULT_DIVISIONS, ...volatileConfig(settings) } as never)
      expect(preExecuteHook).toBeDefined()

      // 正常主会话执行召唤工具：放行
      const nextFn = vi.fn(async () => ({ kind: 'pass' }))
      const parentExec = { agent: { id: 'parent-session' }, name: 'summon_expert' }
      await expect(preExecuteHook!(parentExec, nextFn)).resolves.toEqual({ kind: 'pass' })
      expect(nextFn).toHaveBeenCalledTimes(1)

      // 启动一个专家子代理
      await tools.get('summon_expert')!.execute({ expert: '代码审查工程师', task: 'check' }, { agent: {} })
      expect(spawnedChildId).toBeDefined()

      // 该受管专家子代理在执行层尝试调用 summon_expert，pre-execute 拦截
      const childExec = { agent: { id: spawnedChildId }, name: 'summon_expert' }
      const blockedNext = vi.fn()
      const result = await preExecuteHook!(childExec, blockedNext)
      expect(result).toMatchObject({ kind: 'deny', reason: '专家成员不能继续召唤专家团。' })
      expect(blockedNext).not.toHaveBeenCalled()

      // 验证即使超过 256 次调用淘汰最老条目的人设配置，基于 managedSubagentIds 的门禁依然坚不可摧
      for (let i = 0; i < 260; i++) {
        await tools.get('summon_expert')!.execute({ expert: '代码审查工程师', task: `check-${i}` }, { agent: {} })
      }
      const overflowBlockedNext = vi.fn()
      const overflowResult = await preExecuteHook!(childExec, overflowBlockedNext)
      expect(overflowResult).toMatchObject({ kind: 'deny', reason: '专家成员不能继续召唤专家团。' })
      expect(overflowBlockedNext).not.toHaveBeenCalled()
    } finally {
      clearSubagentRegistryForTest()
      await rm(tempHome, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 })
    }
  })

  it('子代理持久化注册表具备去重压缩与临时文件故障清理能力', async () => {
    const tempHome = await mkdtemp(join(tmpdir(), 'aag-reg-unit-'))
    try {
      const fakeCtx = { get: (name: string) => name === 'profileContext' ? { home: tempHome } : undefined } as unknown as Context
      clearSubagentRegistryForTest()
      const largePersona = 'A'.repeat(10000)
      for (let i = 0; i < 50; i++) {
        recordSubagentConfig(`child-${i}`, { slug: 'reviewer', persona: largePersona, toolFilter: { deny: ['summon_expert'] } }, fakeCtx)
      }
      flushSubagentRegistrySync(fakeCtx)
      const dataFile = join(tempHome, 'agency-subagents.json')
      const expertsFile = join(tempHome, 'agency-expert-personas.json')
      const raw = await readFile(dataFile, 'utf8')
      const parsed = JSON.parse(raw)
      const expertsDoc = JSON.parse(await readFile(expertsFile, 'utf8'))
      // 热文件只留引用：不带专家正文，体积与 persona 长度无关
      expect(parsed.version).toBe(2)
      expect(parsed.experts).toBeUndefined()
      expect(Object.keys(parsed.children)).toHaveLength(50)
      expect(raw.length).toBeLessThan(12000)
      // 冷文件按专家去重：50 次同一专家只存一份正文
      expect(Object.keys(expertsDoc.experts)).toEqual(['reviewer'])
      expect(expertsDoc.experts.reviewer).toBe(largePersona)

      // 验证跨进程重启恢复
      clearSubagentRegistryForTest()
      initSubagentRegistry(fakeCtx)
      expect(getSubagentConfig('child-0')?.persona).toBe(largePersona)

      // 128 个「不同」专家：热文件必须仍然很小（这是本轮修掉的写放大残留）
      clearSubagentRegistryForTest()
      for (let i = 0; i < 128; i++) {
        recordSubagentConfig(`distinct-${i}`, { slug: `expert-${i}`, persona: largePersona }, fakeCtx)
      }
      flushSubagentRegistrySync(fakeCtx)
      const distinctRaw = await readFile(dataFile, 'utf8')
      expect(distinctRaw.length).toBeLessThan(30000)
      expect(Object.keys(JSON.parse(distinctRaw).children)).toHaveLength(128)

      // 验证写入失败时临时文件绝不残留
      const badDir = join(tempHome, 'fail-target')
      await mkdir(badDir, { recursive: true })
      const badCtx = { get: (name: string) => name === 'profileContext' ? { home: badDir } : undefined } as unknown as Context
      // 把同名路径创建为非空目录，使得 renameSync 必定失败
      await mkdir(join(badDir, 'agency-subagents.json'), { recursive: true })
      await writeFile(join(badDir, 'agency-subagents.json', 'blocker.txt'), 'block', 'utf8')
      recordSubagentConfig('child-fail', { persona: 'test' }, badCtx)
      flushSubagentRegistrySync(badCtx)
      const badDirFiles = await readdir(badDir)
      const tmpFiles = badDirFiles.filter(f => f.endsWith('.tmp'))
      expect(tmpFiles).toHaveLength(0)
    } finally {
      clearSubagentRegistryForTest()
      await rm(tempHome, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 })
    }
  })
})
