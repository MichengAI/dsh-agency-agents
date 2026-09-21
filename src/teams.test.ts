import { describe, it, expect, vi } from 'vitest'
import {
  BUILTIN_TEAMS,
  teamInputSchema,
  effectiveCoordinator,
} from './team-contract.js'
import { createTeamLibrary } from './team-library.js'
import { executeTeam } from './team-runtime.js'
import {
  validateAgencySettings,
  type AgencySettings,
} from './expert-library.js'
import type { ExpertSummary } from './expert-contract.js'

const experts: ExpertSummary[] = [
  ...new Set(BUILTIN_TEAMS.flatMap((t) => t.members.map((m) => m.expertSlug))),
].map((slug) => ({
  slug,
  name: slug,
  nameEn: slug,
  description: '',
  descriptionEn: '',
  emoji: '🧩',
  division: 'engineering',
  divisionZh: '工程',
  custom: false,
}))
function setup() {
  let state: AgencySettings = { enabled: [], customExperts: [] }
  let revision = 0
  const store = {
    read: () => structuredClone(state),
    revision: () => revision,
    mutate: async (
      ops: { path: readonly string[]; value?: unknown }[],
      expected: number,
    ) => {
      if (expected !== revision) throw new Error('配置已更新')
      for (const op of ops)
        (state as unknown as Record<string, unknown>)[op.path[0]] =
          structuredClone(op.value)
      revision++
    },
  }
  const library = createTeamLibrary(
    async () => ({ experts, enabled: state.enabled, revision }),
    store,
  )
  return { library, store }
}
const draft = () => {
  const { id: _id, builtin: _builtin, ...value } = BUILTIN_TEAMS[0]
  return { ...value, name: '我的评审团' }
}
describe('专家团配置与执行', () => {
  it('服务错误按当前语言返回，不依赖客户端二次翻译', async () => {
    const { store } = setup()
    let locale: 'zh' | 'en' = 'zh'
    const library = createTeamLibrary(async () => ({ experts, enabled: [], revision: store.revision() }), store, () => locale)
    await expect(library.get('missing')).rejects.toThrow('专家团不存在')
    locale = 'en'
    await expect(library.get('missing')).rejects.toThrow('Team not found')
    await expect(library.save({ ...draft(), name: 'Product Review Team' }, false, 0)).rejects.toThrow('already')
    await expect(library.setEnabled(BUILTIN_TEAMS[0].id, true, 9)).rejects.toThrow('Settings changed')
  })
  it.each(['save', 'enable'] as const)('%s 保留名册暂不可用的原始启用记录', async (action) => {
    const { store } = setup()
    const retained = ['temporarily-conflicted', 'outside-current-divisions']
    await store.mutate([{ path: ['enabled'], value: retained }], 0)
    const library = createTeamLibrary(async () => ({ experts, enabled: [], revision: store.revision() }), store)
    if (action === 'save') await library.save(draft(), true, 1)
    else await library.setEnabled(BUILTIN_TEAMS[0].id, true, 1)
    expect(store.read().enabled).toEqual([...retained, ...draft().members.map(member => member.expertSlug)])
  })
  it('自定义团队不能与内置团队的英文名称冲突', async () => {
    const { library } = setup()
    await expect(library.save({ ...draft(), name: 'Product Review Team' }, false, 0)).rejects.toThrow('团队名称已被使用')
  })
  it('不把旧名册与新团队配置拼成同一个快照', async () => {
    const { store } = setup()
    await store.mutate([{ path: ['enabledTeams'], value: [] }], 0)
    const library = createTeamLibrary(async () => ({ experts, enabled: [], revision: 0 }), store)
    await expect(library.snapshot()).rejects.toThrow('配置已更新')
  })
  it('持久化拒绝冒充内置团队、重复标识和名称', () => {
    const team = {
      ...draft(),
      id: 'team-custom-12345678-1234-4234-8234-123456789012',
      builtin: false,
    }
    expect(() =>
      validateAgencySettings({ enabled: [], customTeams: [BUILTIN_TEAMS[0]] }),
    ).toThrow()
    expect(() =>
      validateAgencySettings({ enabled: [], customTeams: [team, team] }),
    ).toThrow()
    expect(() =>
      validateAgencySettings({
        enabled: [],
        customTeams: [{ ...team, name: BUILTIN_TEAMS[0].name }],
      }),
    ).toThrow()
  })
  it('包含五个三人团队，主理人模板各自完整且成员不重复', () => {
    expect(BUILTIN_TEAMS).toHaveLength(5)
    for (const team of BUILTIN_TEAMS) {
      expect(team.members).toHaveLength(3)
      expect(teamInputSchema.safeParse(team).success).toBe(true)
      expect(effectiveCoordinator(team)).toContain('处理分歧')
    }
  })
  it('拒绝重复成员、空自定义提示词和多于八人', () => {
    expect(
      teamInputSchema.safeParse({
        ...draft(),
        members: [draft().members[0], draft().members[0]],
      }).success,
    ).toBe(false)
    expect(
      teamInputSchema.safeParse({
        ...draft(),
        coordinatorMode: 'custom',
        coordinatorPrompt: ' ',
      }).success,
    ).toBe(false)
    expect(
      teamInputSchema.safeParse({
        ...draft(),
        members: Array.from({ length: 9 }, (_, i) => ({ ...draft().members[0], expertSlug: `expert-${i}` })),
      }).success,
    ).toBe(false)
  })
  it('模板和自定义只生效一份', () => {
    expect(
      effectiveCoordinator({
        ...BUILTIN_TEAMS[0],
        coordinatorMode: 'custom',
        coordinatorPrompt: '仅输出决策依据',
      }),
    ).toBe('仅输出决策依据')
  })
  it('启用团队与成员原子写入；停用团队保留成员；拒绝过期写入', async () => {
    const { library } = setup()
    const enabled = await library.setEnabled(BUILTIN_TEAMS[0].id, true, 0)
    expect(enabled.enabledTeams).toContain(BUILTIN_TEAMS[0].id)
    expect(enabled.enabledExperts).toEqual(
      BUILTIN_TEAMS[0].members.map((m) => m.expertSlug),
    )
    await expect(
      library.setEnabled(BUILTIN_TEAMS[1].id, true, 0),
    ).rejects.toThrow()
    const disabled = await library.setEnabled(BUILTIN_TEAMS[0].id, false, 1)
    expect(disabled.enabledTeams).toEqual([])
    expect(disabled.enabledExperts).toEqual(enabled.enabledExperts)
  })
  it('自定义持久化、名称唯一、内置只读及删除不删成员', async () => {
    const { library } = setup()
    const saved = await library.save(draft(), true, 0)
    const team = saved.teams.find((t) => !t.builtin)!
    expect(team.id).toMatch(/^team-custom-/)
    await expect(library.save(draft(), false, 1)).rejects.toThrow('名称')
    await expect(
      library.save({ ...draft(), id: BUILTIN_TEAMS[0].id }, false, 1),
    ).rejects.toThrow()
    const removed = await library.remove(team.id, 1)
    expect(removed.teams).toHaveLength(5)
    expect(removed.enabledExperts).toHaveLength(3)
  })
  it('冻结分工与提示词，保留部分失败，不自动重试', async () => {
    const team = structuredClone(BUILTIN_TEAMS[0])
    const run = vi.fn(
      async (member: { name: string; prompt: string; persona: string }) => {
        if (member.name === team.members[1].expertSlug)
          throw new Error('成员失败')
        expect(member.prompt).toContain('评审这份需求')
        expect(member.persona).toBe('原始专家提示词')
        return '结论和依据'
      },
    )
    const pending = executeTeam({
      team,
      experts,
      enabled: team.members.map((m) => m.expertSlug),
      task: '评审这份需求',
      revision: 2,
      readPersona: async () => '原始专家提示词',
      run,
    })
    team.deliveryRequirements = '运行中被修改'
    const result = await pending
    expect(result.results.filter((r) => r.ok)).toHaveLength(2)
    expect(result.team.deliveryRequirements).not.toBe('运行中被修改')
    expect(result.coordinator).toContain('处理分歧')
    expect(run).toHaveBeenCalledTimes(3)
  })
  it('停用或失效成员不得悄悄运行，取消后不得新建任务', async () => {
    const run = vi.fn(async () => '结果')
    const args = {
      team: BUILTIN_TEAMS[0],
      experts,
      enabled: [] as string[],
      task: '任务',
      revision: 0,
      readPersona: async () => '提示词',
      run,
    }
    await expect(executeTeam(args)).rejects.toThrow()
    const controller = new AbortController()
    controller.abort()
    await expect(
      executeTeam({
        ...args,
        enabled: experts.map((e) => e.slug),
        signal: controller.signal,
      }),
    ).rejects.toThrow()
    expect(run).not.toHaveBeenCalled()
  })
  it('八人团队最多四人同时执行，取消后不启动排队成员', async () => {
    const team = {
      ...structuredClone(BUILTIN_TEAMS[0]),
      members: experts
        .slice(0, 8)
        .map((e) => ({
          expertSlug: e.slug,
          duty: '分析',
          instructions: '给出依据',
        })),
    }
    const controller = new AbortController()
    const releases: (() => void)[] = []
    const run = vi.fn(
      () =>
        new Promise<string>((resolve) => releases.push(() => resolve('结果'))),
    )
    const pending = executeTeam({
      team,
      experts,
      enabled: experts.map((e) => e.slug),
      task: '任务',
      revision: 0,
      signal: controller.signal,
      readPersona: async () => '提示词',
      run,
    })
    const rejected = expect(pending).rejects.toThrow()
    await vi.waitFor(() => expect(run).toHaveBeenCalledTimes(4))
    controller.abort()
    releases.forEach((release) => release())
    await rejected
    expect(run).toHaveBeenCalledTimes(4)
  })
})
