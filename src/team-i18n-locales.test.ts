import { describe, expect, it } from 'vitest'
import { BUILTIN_TEAMS, COORDINATOR_TEMPLATE_IDS, effectiveCoordinator, teamSchema } from './team-contract.js'
import { teamCollaboration } from './team-collaboration.js'
import { localizeTeam } from './team-content-en.js'
import { TEAM_EN, teamText } from './team-i18n.js'

const cases = [
  { locale: 'pt-BR', memberCount: ' especialistas', names: ['Equipe de avaliação de produto', 'Equipe de revisão técnica', 'Equipe de planejamento de conteúdo', 'Equipe de análise de dados', 'Equipe de pesquisa'], checklist: '## Lista de verificação', step: 'A coordenação prepara um briefing', native: 'aguarde', custom: 'Regras personalizadas', save: 'Salvar' },
  { locale: 'es-419', memberCount: ' especialistas', names: ['Equipo de evaluación de producto', 'Equipo de revisión técnica', 'Equipo de planificación de contenidos', 'Equipo de análisis de datos', 'Equipo de investigación'], checklist: '## Lista de comprobación', step: 'La coordinación prepara un briefing', native: 'espera', custom: 'Reglas personalizadas', save: 'Guardar' },
] as const

describe.each(cases)('Team locale $locale', ({ locale, memberCount, names, checklist, step, native, custom, save }) => {
  it('translates all first-party keys without changing placeholders or interpolated text', () => {
    expect(teamText(locale, '保存')).toBe(save)
    expect(teamText(locale, '{0} 位专家', [3])).toBe(`3${memberCount}`)
    const userText = '  用户 {0} $& \n e\u0301  '
    expect(teamText(locale, '@专家团：{0}\u00a0', [userText])).toContain(userText)
    for (const [key, english] of Object.entries(TEAM_EN)) {
      const translated = teamText(locale, key)
      expect(translated, key).not.toBe(key)
      expect(translated, key).not.toMatch(/[\u3400-\u9fff]/u)
      expect(translated.match(/\{\d+\}/gu)?.sort(), key).toEqual(english.match(/\{\d+\}/gu)?.sort())
    }
    expect(teamText(locale, 'Save')).toBe(save)
    expect(teamText(locale, 'toString')).toBe('toString')
  })

  it('localizes every built-in field while retaining identity and schema validity', () => {
    expect(BUILTIN_TEAMS.map(team => localizeTeam(team, locale).name)).toEqual(names)
    for (const team of BUILTIN_TEAMS) {
      const localized = localizeTeam(team, locale)
      expect(teamSchema.safeParse(localized).success, localized.id).toBe(true)
      const { name, description, goal, constraints, tags, examples, deliveryRequirements, members, ...identity } = localized
      const { name: _name, description: _desc, goal: _goal, constraints: _constraints, tags: _tags, examples: _examples, deliveryRequirements: _delivery, members: _members, ...originalIdentity } = team
      expect(identity).toEqual(originalIdentity)
      expect(members.map(member => member.expertSlug)).toEqual(team.members.map(member => member.expertSlug))
      expect([tags.length, examples.length]).toEqual([team.tags.length, team.examples.length])
      expect(JSON.stringify({ name, description, goal, constraints, tags, examples, deliveryRequirements, members })).not.toMatch(/[\u3400-\u9fff]/u)
      expect(localizeTeam(localized, 'zh')).toEqual(team)
      expect(localizeTeam(localized, 'en')).toEqual(localizeTeam(team, 'en'))
      expect(localizeTeam(localizeTeam(team, 'en'), locale)).toEqual(localized)
    }
  })

  it('uses the same localized methods for every coordinator template and collaboration handoff', () => {
    for (const id of COORDINATOR_TEMPLATE_IDS) {
      const team = { ...BUILTIN_TEAMS[0], coordinatorTemplateId: id }
      const prompt = effectiveCoordinator(team, locale)
      const collaboration = teamCollaboration(team, locale)
      expect(prompt).toContain(checklist)
      expect(prompt).toContain(native)
      expect(prompt).toContain(collaboration.synthesis)
      expect(collaboration.steps[0]).toBe(step)
      for (const text of [...collaboration.preparation, ...collaboration.memberOutput, ...collaboration.reviewChecklist]) expect(prompt).toContain(text)
      expect(prompt).not.toMatch(/[\u3400-\u9fff]/u)
    }
  })

  it('does not rewrite custom fields, duties or prompts even when they match catalog text', () => {
    const userText = '  保存 {0} Produtos\r\nCafe\u0301  '
    const team = { ...BUILTIN_TEAMS[0], builtin: false, name: names[0], deliveryRequirements: userText, goal: userText, examples: [userText], coordinatorMode: 'custom' as const, coordinatorPrompt: userText }
    expect(localizeTeam(team, locale)).toBe(team)
    expect(effectiveCoordinator(team, locale)).toBe(userText)
    const handoff = teamCollaboration(team, locale)
    expect(handoff.deliveryRequirements).toBe(userText)
    expect(handoff.reviewChecklist[0]).toContain(custom)
    expect(handoff.preparation).not.toEqual(teamCollaboration({ ...team, coordinatorMode: 'template' }, locale).preparation)
  })
})

it('uses shared English fallback and preserves explicit Chinese and existing default templates', () => {
  expect(teamText('ja', '保存')).toBe('Save')
  expect(teamText('zh-Hant', 'Save')).toBe('保存')
  expect(localizeTeam(BUILTIN_TEAMS[0], 'unsupported').name).toBe('Product Review Team')
  expect(effectiveCoordinator(BUILTIN_TEAMS[0], 'unsupported')).toContain('## Synthesis')
  expect(effectiveCoordinator(BUILTIN_TEAMS[0])).toContain('任务准备')
})

const ambiguityKey = '专家团名称不明确。请使用以下稳定标识之一：{0}。'

it.each([
  ['pt-BR', 'O nome da equipe é ambíguo. Use um destes IDs estáveis: custom-product, team-product.'],
  ['es-419', 'El nombre del equipo es ambiguo. Usa uno de estos ID estables: custom-product, team-product.'],
  ['en', 'The team name is ambiguous. Use one of these stable IDs: custom-product, team-product.'],
  ['zh', '专家团名称不明确。请使用以下稳定标识之一：custom-product, team-product。'],
])('gives stable IDs for ambiguous team names in %s', (locale, message) => {
  expect(teamText(locale, ambiguityKey, ['custom-product, team-product'])).toBe(message)
})

it.each([
  ['pt-BR', 'Identifique os membros que falharam'],
  ['es-419', 'Indica qué miembros fallaron'],
])('identifies which members failed in the native startup acknowledgement in %s', (locale, phrase) => {
  expect(teamText(locale, '以上仅是启动确认，不是评审结论。使用 team_task_list 查看本次任务，使用 wait_agent 等待成员消息；没有结果时不要结束为最终答复。收到实际成员结论后，按 coordinator 和 collaboration.reviewChecklist 核验并汇总。只处理本次 taskId；失败成员明确标注，不自动重试或追加普通子代理。')).toContain(phrase)
})

it.each([
  ['pt-BR', 'identifique os membros que falharam', 'lacunas de cobertura'],
  ['es-419', 'indica qué miembros fallaron', 'carencias de cobertura'],
])('identifies which members failed and preserves coverage guidance in synthesis in %s', (locale, phrase, coverage) => {
  const synthesis = teamText(locale, '{0}由当前主会话按本次主理人规则、协作验收清单和交付要求综合结果：{1}。逐项核对证据、口径、交接问题及分歧；无法核实的内容标为待验证。标明失败成员及职责覆盖缺口；不自动重试或新增轮次，不编造意见。', ['', 'team deliverables'])
  expect(synthesis).toContain('team deliverables')
  expect(synthesis).toContain(phrase)
  expect(synthesis).toContain(coverage)
})
