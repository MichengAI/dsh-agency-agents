import type { TeamSnapshot } from '../team-contract.js'
import type { AgencyTeamsRemote } from './remote.js'

interface TeamCache {
  value: TeamSnapshot | null
  listeners: Set<() => void>
  pending?: Promise<TeamSnapshot>
  generation: number
}

const caches = new WeakMap<AgencyTeamsRemote, TeamCache>()

function cache(remote: AgencyTeamsRemote): TeamCache {
  let value = caches.get(remote)
  if (value === undefined) {
    value = { value: null, listeners: new Set(), generation: 0 }
    caches.set(remote, value)
  }
  return value
}

function sameSnapshot(current: TeamSnapshot, next: TeamSnapshot): boolean {
  return current.revision === next.revision
    && JSON.stringify(current.teams) === JSON.stringify(next.teams)
    && JSON.stringify(current.enabledTeams) === JSON.stringify(next.enabledTeams)
    && JSON.stringify(current.enabledExperts) === JSON.stringify(next.enabledExperts)
    && JSON.stringify(current.engine ?? null) === JSON.stringify(next.engine ?? null)
    && JSON.stringify(current.nativeMembers ?? null) === JSON.stringify(next.nativeMembers ?? null)
}

export function teamState(remote: AgencyTeamsRemote): TeamSnapshot | null {
  return cache(remote).value
}

export function subscribeTeams(remote: AgencyTeamsRemote, listener: () => void): () => void {
  const entry = cache(remote)
  entry.listeners.add(listener)
  return () => { entry.listeners.delete(listener) }
}

function publishTeams(remote: AgencyTeamsRemote, value: TeamSnapshot): TeamSnapshot {
  const entry = cache(remote)
  entry.generation += 1
  if (entry.value !== null && sameSnapshot(entry.value, value)) return entry.value
  entry.value = value
  for (const listener of entry.listeners) listener()
  return entry.value
}

/** 写入回执优先于更早发出的查询；过期修订号不能把界面退回旧团队。 */
export function acceptTeams(remote: AgencyTeamsRemote, value: TeamSnapshot): TeamSnapshot {
  const entry = cache(remote)
  if (entry.value !== null && value.revision < entry.value.revision) return entry.value
  entry.pending = undefined
  return publishTeams(remote, value)
}

/** 菜单、设置页和 @ 候选共用一次请求，已有结果时先显示再后台刷新。 */
export function refreshTeams(remote: AgencyTeamsRemote): Promise<TeamSnapshot> {
  const entry = cache(remote)
  if (entry.pending !== undefined) return entry.pending
  const generation = entry.generation
  const pending = remote.getTeams().then(result => {
    if (!result.ok) throw new Error(result.error.message)
    if (generation !== entry.generation && entry.value !== null) return entry.value
    return publishTeams(remote, result.value)
  }).finally(() => { if (entry.pending === pending) entry.pending = undefined })
  entry.pending = pending
  return pending
}
