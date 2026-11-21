import { normalizeAgencyLocale } from './agency-locale.js'
import { localizeTeam } from './team-content-en.js'
import type { ExpertTeam } from './team-contract.js'

interface TeamSelectionSnapshot {
  readonly teams: readonly ExpertTeam[]
  readonly enabledTeams: readonly string[]
}

export type TeamSelection =
  | { kind: 'found'; team: ExpertTeam }
  | { kind: 'unavailable' }
  | { kind: 'ambiguous'; ids: readonly string[] }

/** Resolve an exact ID before considering exact full names among enabled teams. */
export function selectTeam(snapshot: TeamSelectionSnapshot, selector: string, locale: string): TeamSelection {
  const active = normalizeAgencyLocale(locale)
  const exactId = snapshot.teams.find(team => team.id === selector)
  if (exactId) {
    return snapshot.enabledTeams.includes(exactId.id)
      ? { kind: 'found', team: localizeTeam(exactId, active) }
      : { kind: 'unavailable' }
  }

  const enabled = new Set(snapshot.enabledTeams)
  const matches = new Map<string, ExpertTeam>()
  for (const team of snapshot.teams) {
    if (!enabled.has(team.id)) continue
    const localized = localizeTeam(team, active)
    if (team.name === selector || localized.name === selector || (team.builtin && (
      (active !== 'en' && localizeTeam(team, 'en').name === selector) ||
      (active !== 'zh' && localizeTeam(team, 'zh').name === selector)
    ))) matches.set(team.id, localized)
  }

  if (matches.size > 1) return { kind: 'ambiguous', ids: [...matches.keys()].sort() }
  const [team] = matches.values()
  return team ? { kind: 'found', team } : { kind: 'unavailable' }
}
