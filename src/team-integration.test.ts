import { describe, it, expect, vi } from 'vitest'
import type { NativeTeamService } from './team-engine.js'
import { Context } from '@deepseek-ai/cordis'
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

    // 断言 2：队友在 agent/created 时被注入 tools.restrict（裁掉 6 个专家工具和 spawn_teammate）
    expect(injectedRestrictions).toHaveLength(3)
    for (const filter of injectedRestrictions) {
      expect(filter).toEqual({
        deny: ['summon_expert', 'summon_experts', 'list_experts', 'list_expert_teams', 'get_expert_team', 'summon_expert_team', 'spawn_teammate'],
      })
    }

    // 断言 3：队友在 agent/created 时被注入专家人设 section
    expect(injectedSections).toHaveLength(3)
    for (const sec of injectedSections) {
      expect(sec).toMatchObject({ name: 'deployment:persona-prefix' })
      expect(sec.text).toEqual(expect.any(String))
    }
  })
})
