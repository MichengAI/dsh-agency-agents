import { describe, expect, it } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import { SettingsConflictError } from '@deepseek-ai/dsh-settings'
import AgencyAgentsRemote from './remote.js'
import { AGENCY_PERSONA_SERVICE } from './index.js'
import { AGENCY_TEAM_SERVICE, createTeamLibrary } from './team-library.js'
import { BUILTIN_TEAMS } from './team-contract.js'
import { resolveTeamEngine } from './team-engine.js'
import { executeTeam } from './team-runtime.js'
import { PersonaError } from './persona-error.js'
import { teamText } from './team-i18n.js'
import { settingsNamespaceCompat } from './settings-compat.js'

const first = BUILTIN_TEAMS[0]
const member = { slug: first.members[0].expertSlug, name: '中文专家', nameEn: 'Stock expert', description: '中文简介', descriptionEn: 'English bio', division: 'engineering', divisionZh: '工程', emoji: '', custom: false }
const stale = '配置已更新，请读取最新内容后重试。'
function fakeContext(preference: string, services = new Map<unknown, unknown>()) {
  return { settings: { get: () => ({ preference }) }, get: (name: unknown) => services.get(name), typert: { register() {} }, reflect: { provide() {} } } as unknown as Context
}

describe('Agency Team locale and persona boundary', () => {
  it.each([['pt', 'pt-BR', 'en'], ['es', 'es-MX', 'en'], ['en', 'en-GB', 'en'], ['zh', 'zh-CN', 'zh']] as const)('uses %s workflow errors and %s host settings without translating persona assets', async (locale, preference, expectedPersona) => {
    const ctx = fakeContext(preference, new Map([[AGENCY_PERSONA_SERVICE, { getPrompt: async (_slug: string, _division: string, loc: string) => ({ prompt: loc }) }]]))
    const remote = new AgencyAgentsRemote(ctx)
    expect(await remote.getPrompt(member.slug, member.division)).toEqual({ prompt: expectedPersona })
    await expect(remote.getTeams()).rejects.toThrow(teamText(locale, '专家团服务不可用，请重新加载插件。'))
    expect(resolveTeamEngine(ctx).status.reason).toBe(teamText(locale, '当前宿主未检测到兼容的 Agent Team 能力，使用普通子代理。'))
  })

  it.each(['pt', 'es'] as const)('relocalizes only known persona failures and leaves custom team data and stable IDs intact (%s)', async (locale) => {
    const team = { ...first, builtin: false, id: 'team-custom-0a2d3ca9-41fe-4251-851b-a0f555fa5831', name: 'My exact title', coordinatorMode: 'custom' as const, coordinatorPrompt: '我的 prompt {0}' }
    const experts = team.members.map(({ expertSlug }, index) => ({ ...member, slug: expertSlug, ...(index === 0 ? { custom: true, name: 'Meu nome', nameEn: 'do not substitute' } : {}) }))
    const output = await executeTeam({ team, locale, experts, enabled: experts.map(e => e.slug), revision: 8, task: 'My exact task {0}',
      readPersona: async (_expert, assetLocale) => { throw new PersonaError('PERSONA_NOT_FOUND', assetLocale) }, run: async () => 'unused',
    })
    expect(output.team).toEqual(team)
    expect(output.coordinator).toBe(team.coordinatorPrompt)
    expect(output.results[0]).toMatchObject({ slug: experts[0].slug, expert: 'Meu nome', error: teamText(locale, '未找到专家提示词。') })
    expect(output.results[1]).toMatchObject({ slug: experts[1].slug, expert: 'Stock expert' })
  })

  it.each(['pt', 'es'] as const)('sends localized brief with unchanged task and EN persona (%s)', async (locale) => {
    const experts = first.members.map(({ expertSlug }) => ({ ...member, slug: expertSlug }))
    const seen: { prompt: string; persona: string }[] = []
    const result = await executeTeam({ team: first, locale, experts, enabled: experts.map(e => e.slug), revision: 8, task: 'Manual {0} 中文',
      readPersona: async (_expert, assetLocale) => `exact persona ${assetLocale}`, run: async (input) => { seen.push(input); return 'Exact answer' },
    })
    expect(result.coverage.status).toBe('complete')
    expect(result.team.id).toBe(first.id)
    expect(seen[0].persona).toBe('exact persona en')
    expect(seen[0].prompt).toContain(teamText(locale, '任务简报：\n{0}', ['Manual {0} 中文']))
  })

  it.each(['pt', 'es'] as const)('preserves library display errors and host-native settings conflict metadata (%s)', async (locale) => {
    const store = { revision: () => 2, read: () => ({ enabled: [] }), mutate: async () => { throw new SettingsConflictError(settingsNamespaceCompat('agency-agents'), 2, 3) } }
    const library = createTeamLibrary(async () => ({ experts: [], enabled: [], revision: 2 }), store, () => locale)
    const remote = new AgencyAgentsRemote(fakeContext(locale, new Map([[AGENCY_TEAM_SERVICE, library]])))
    await expect(remote.setTeamEnabled(first.id, false, 1)).rejects.toThrow(teamText(locale, stale))
    await expect(remote.setTeamEnabled(first.id, false, 2)).rejects.toMatchObject({ code: 'SETTINGS_CONFLICT', expected: 2, actual: 3 })
    await expect(remote.deleteTeam(first.id, 2)).rejects.toThrow(teamText(locale, '只能删除已有的自定义专家团。'))
  })
})
