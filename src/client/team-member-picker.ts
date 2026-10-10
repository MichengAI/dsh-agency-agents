export type TeamMemberPickerStatus = '' | 'enabled' | 'disabled'

/** 组团选人：默认只看已启用；停用专家在「全部」和「已停用」里仍可加入。 */
export function filterTeamMemberCandidates<T extends {
  slug: string
  name: string
  nameEn: string
  description: string
  custom: boolean
  division: string
  conflict?: boolean
}>(
  experts: readonly T[],
  options: {
    source: 'all' | 'base' | 'custom'
    division: string
    status: TeamMemberPickerStatus
    enabled: readonly string[]
    taken: readonly { expertSlug: string }[]
    replacing: number
    query: string
  },
): T[] {
  const enabled = new Set(options.enabled)
  const needle = options.query.trim().toLowerCase()
  return experts.filter((expert) => {
    if (expert.conflict) return false
    if (options.taken.some((member, index) => member.expertSlug === expert.slug && index !== options.replacing)) return false
    if (options.source !== 'all' && expert.custom !== (options.source === 'custom')) return false
    if (options.division !== '' && expert.division !== options.division) return false
    if (options.status === 'enabled' && !enabled.has(expert.slug)) return false
    if (options.status === 'disabled' && enabled.has(expert.slug)) return false
    if (needle !== '' && !`${expert.name} ${expert.nameEn} ${expert.description}`.toLowerCase().includes(needle)) return false
    return true
  })
}
