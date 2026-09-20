import React from 'react'
import { teamText, type TeamLocale } from '../team-i18n.js'
import type { ExpertSummary } from '../expert-contract.js'
export { localizeTeam } from '../team-content-en.js'
export function localizedExperts(experts: readonly ExpertSummary[], locale: TeamLocale): ExpertSummary[] {
  return experts.map(expert => locale === 'en' ? { ...expert, name: expert.nameEn, description: expert.descriptionEn } : expert)
}
export const TeamLocaleContext = React.createContext<TeamLocale>('zh')
export function useTeamLocale() {
  const locale = React.useContext(TeamLocaleContext)
  return { locale, tx: (key: string, values?: readonly unknown[]) => teamText(locale, key, values) }
}
