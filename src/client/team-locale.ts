import React from 'react'
import { teamText, type TeamLocale } from '../team-i18n.js'
import type { ExpertSummary } from '../expert-contract.js'
import { personaLocale } from '../agency-locale.js'
import { EN_DIVISION, ZH_DIVISION } from '../names.js'
import { ES_DIVISION, PT_DIVISION } from '../host-locales.js'
export { localizeTeam } from '../team-content-en.js'
export function localizedExperts(experts: readonly ExpertSummary[], locale: TeamLocale): ExpertSummary[] {
  return experts.map(expert => localizeTeamExpert(expert, locale))
}

export function localizeTeamExpert(expert: ExpertSummary, locale: TeamLocale): ExpertSummary {
  if (expert.custom || personaLocale(locale) === 'zh') return expert
  return { ...expert, name: expert.nameEn, description: expert.descriptionEn || expert.description }
}

const divisions = { zh: ZH_DIVISION, en: EN_DIVISION, pt: PT_DIVISION, es: ES_DIVISION }
export function teamDivisionName(division: string, locale: TeamLocale): string {
  return Object.hasOwn(divisions[locale], division) ? divisions[locale][division] : division
}

export const teamMemberSeparator = (locale: TeamLocale): string => locale === 'zh' ? '、' : ', '
export const teamColon = (locale: TeamLocale): string => locale === 'zh' ? '：' : ': '
const STALE_TEAM_REVISION = '配置已更新，请读取最新内容后重试。'
const staleMessages = new Set([
  ...(['zh', 'en', 'pt', 'es'] as const).map(locale => teamText(locale, STALE_TEAM_REVISION)),
  '配置已更新，请刷新。',
  'Configuration changed since it was read',
])

/** Existing Remotes may expose only a message. Match exact known conflicts, not generic words. */
export function isStaleTeamRevision(cause: unknown): boolean {
  if (typeof cause !== 'object' || cause === null) return false
  if ('code' in cause && cause.code === 'SETTINGS_CONFLICT') return true
  if (!('message' in cause) || typeof cause.message !== 'string') return false
  return staleMessages.has(cause.message)
    || /^settings namespace "agency-agents" changed since it was read \(expected revision \d+, now \d+\)$/u.test(cause.message)
}

export function teamErrorText(locale: TeamLocale, cause: unknown, fallback: string): string {
  if (isStaleTeamRevision(cause)) return teamText(locale, STALE_TEAM_REVISION)
  return teamText(locale, cause instanceof Error ? cause.message : fallback)
}

export const TeamLocaleContext = React.createContext<TeamLocale>('zh')
export function useTeamLocale() {
  const locale = React.useContext(TeamLocaleContext)
  // 含 {0} 的词条必须传入 values。缺值时 teamText 会原样留下占位符。
  return { locale, tx: (key: string, values?: readonly unknown[]) => teamText(locale, key, values) }
}
