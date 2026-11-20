import { expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TeamLocaleContext, localizedExperts, isStaleTeamRevision, teamErrorText } from './team-locale.js'
import { MemberList } from './team-shared.js'
import { TeamEditor } from './team-editor.js'
import { unwrap } from './team-ui.js'
import { BUILTIN_TEAMS } from '../team-contract.js'
import { teamText } from '../team-i18n.js'

const team = BUILTIN_TEAMS[0]
const expert = { slug: team.members[0].expertSlug, name: '中文专家', nameEn: 'English Stock Expert', description: '中文简介', descriptionEn: 'English asset bio', division: 'engineering', divisionZh: '工程', emoji: '', custom: false }

it.each(['pt', 'es'] as const)('shows stock EN fallback and preserves custom name and description in the Team editor (%s)', (locale) => {
  const custom = { ...expert, custom: true, name: 'Manual Name', description: 'Manual intro' }
  expect(localizedExperts([expert, custom], locale)).toMatchObject([
    { name: expert.nameEn, description: expert.descriptionEn },
    { name: custom.name, description: custom.description },
  ])
  const markup = renderToStaticMarkup(React.createElement(TeamLocaleContext.Provider, { value: locale }, React.createElement(MemberList, { team, experts: [expert] })))
  expect(markup).toContain(expert.nameEn)
  expect(markup).not.toContain(expert.name)
})

it.each(['pt', 'es'] as const)('localizes editor shell and defaults without rewriting a manual example (%s)', (locale) => {
  const render = (initial?: typeof team) => renderToStaticMarkup(React.createElement(TeamLocaleContext.Provider, { value: locale }, React.createElement(TeamEditor, {
    initial, experts: [expert], enabled: false, enabledExperts: [], save: async () => {}, close() {}, refresh: async () => ({ teams: [], enabledTeams: [], enabledExperts: [], revision: 1 }),
  })))
  expect(render()).toContain(teamText(locale, '请根据我提供的资料，给出有依据的结论与下一步建议。'))
  expect(render({ ...team, examples: ['Entirely manual 中文 {0}'] })).toContain('Entirely manual 中文 {0}')
})

it('shows a PT host revision conflict in the ES editor without guessing from unrelated text', async () => {
  const key = '配置已更新，请读取最新内容后重试。'
  const failure = { message: teamText('pt', key) }
  const thrown = await unwrap(Promise.resolve({ ok: false, error: failure })).catch(cause => cause)
  expect(isStaleTeamRevision(thrown)).toBe(true)
  expect(teamErrorText('es', thrown, '保存失败，请重试。')).toBe(teamText('es', key))
  const unrelated = new Error('Use a different team name in another window')
  expect(isStaleTeamRevision(unrelated)).toBe(false)
  expect(teamErrorText('es', unrelated, '保存失败，请重试。')).toBe(unrelated.message)
})
