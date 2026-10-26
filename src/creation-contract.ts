import { z } from 'zod'
import {
  customExpertInputSchema,
  type CustomExpertInput,
} from './expert-contract.js'
import { teamInputSchema, type TeamInput } from './team-contract.js'
import { ZH_DIVISION } from './names.js'

export type ExpertValidationResult =
  | { ok: true; value: z.output<typeof customExpertInputSchema> }
  | { ok: false; error: string }

export type TeamValidationResult =
  | { ok: true; value: TeamInput; memberReasons: Record<string, string> }
  | { ok: false; error: string }

/**
 * 校验模型生成的专家草案并规范化。
 * 剥离任何尝试伪造的 slug，返回纯净的新建草案。
 */
export function validateExpertProposal(input: unknown): ExpertValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: '专家草案必须是对象结构。' }
  }

  const raw = { ...(input as Record<string, unknown>) }
  // 确保作为新建草案，不携带任何既有 slug
  delete raw.slug

  // 校验 division 是否属于有效内置分区
  if (typeof raw.division === 'string' && !Object.hasOwn(ZH_DIVISION, raw.division)) {
    return { ok: false, error: `专家分类「${raw.division}」不存在。` }
  }

  const parsed = customExpertInputSchema.safeParse(raw)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const path = issue?.path.join('.') ?? ''
    const msg = issue?.message ?? '校验未通过'
    return { ok: false, error: `专家草案字段「${path}」不合法: ${msg}` }
  }

  return { ok: true, value: parsed.data }
}

export interface ExpertMatchCandidate {
  readonly slug: string
  readonly name?: string
  readonly nameEn?: string
}

export function matchExpertSlug(query: string, candidates: readonly ExpertMatchCandidate[]): string | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined

  const exactSlug = candidates.find(c => c.slug.toLowerCase() === q)
  if (exactSlug) return exactSlug.slug

  const exactZh = candidates.find(c => c.name && c.name.trim() === query.trim())
  if (exactZh) return exactZh.slug

  const exactEn = candidates.find(c => c.nameEn && c.nameEn.trim().toLowerCase() === q)
  if (exactEn) return exactEn.slug

  const suffixMatch = candidates.find(c => c.slug.toLowerCase().endsWith(`-${q}`) || c.slug.toLowerCase().endsWith(`_${q}`))
  if (suffixMatch) return suffixMatch.slug

  const zhContains = candidates.find(c => c.name && (c.name.includes(query.trim()) || query.trim().includes(c.name)))
  if (zhContains) return zhContains.slug

  return undefined
}

/**
 * 校验模型生成的专家团草案。
 * 剥离任何尝试伪造的 id 和 builtin，提取成员入选理由，并校验候选专家合法性。
 */
export function validateTeamProposal(
  input: unknown,
  availableExperts?: ReadonlySet<string> | readonly ExpertMatchCandidate[],
): TeamValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: '专家团草案必须是对象结构。' }
  }

  const raw = { ...(input as Record<string, unknown>) }
  delete raw.id
  delete raw.builtin

  const candidates: readonly ExpertMatchCandidate[] = Array.isArray(availableExperts)
    ? availableExperts
    : availableExperts instanceof Set
      ? [...availableExperts].map(slug => ({ slug }))
      : []

  const memberReasons: Record<string, string> = {}
  if (Array.isArray(raw.members)) {
    raw.members = raw.members.map((item: unknown) => {
      if (typeof item === 'object' && item !== null) {
        const m = { ...(item as Record<string, unknown>) }
        const rawSlug = typeof m.expertSlug === 'string' ? m.expertSlug.trim() : ''
        const resolved = candidates.length > 0 ? matchExpertSlug(rawSlug, candidates) : undefined
        const effectiveSlug = resolved ?? rawSlug

        if (typeof m.reason === 'string') {
          memberReasons[effectiveSlug] = m.reason
        }
        delete m.reason
        return { ...m, expertSlug: effectiveSlug }
      }
      return item
    })
  }

  const parsed = teamInputSchema.safeParse(raw)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const path = issue?.path.join('.') ?? ''
    const msg = issue?.message ?? '校验未通过'
    return { ok: false, error: `专家团草案字段「${path}」不合法: ${msg}` }
  }

  const team = parsed.data

  // 严格核验成员 slug 是否存在于真实专家库中
  if (candidates.length > 0) {
    const validSlugs = new Set(candidates.map(c => c.slug))
    for (const member of team.members) {
      if (!validSlugs.has(member.expertSlug)) {
        return {
          ok: false,
          error: `专家成员「${member.expertSlug}」不存在于当前专家库中。`,
        }
      }
    }
  }

  return { ok: true, value: team, memberReasons }
}
