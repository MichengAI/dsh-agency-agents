import { z } from 'zod'
import {
  customExpertInputSchema,
  type CustomExpertInput,
} from './expert-contract.js'
import { teamInputSchema, type TeamInput } from './team-contract.js'
import { ZH_DIVISION } from './names.js'

export const creationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
})
export type CreationMessage = z.infer<typeof creationMessageSchema>

export const creationRequestSchema = z.object({
  kind: z.enum(['expert', 'team']),
  prompt: z.string().trim().min(1).max(4000),
  messages: z.array(creationMessageSchema).max(20).optional(),
})
export type CreationRequest = z.infer<typeof creationRequestSchema>

export const creationResponseSchema = z.object({
  ok: z.boolean(),
  error: z.string().optional(),
  expertDraft: customExpertInputSchema.optional(),
  teamDraft: teamInputSchema.optional(),
  memberReasons: z.record(z.string(), z.string()).optional(),
})
export type CreationResponse = z.output<typeof creationResponseSchema>

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
  if (typeof raw.division === 'string' && !(raw.division in ZH_DIVISION)) {
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

/**
 * 校验模型生成的专家团草案。
 * 剥离任何尝试伪造的 id 和 builtin，提取成员入选理由，并校验候选专家合法性。
 */
export function validateTeamProposal(
  input: unknown,
  availableSlugs?: ReadonlySet<string>,
): TeamValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: '专家团草案必须是对象结构。' }
  }

  const raw = { ...(input as Record<string, unknown>) }
  delete raw.id
  delete raw.builtin

  const memberReasons: Record<string, string> = {}
  if (Array.isArray(raw.members)) {
    raw.members = raw.members.map((item: unknown) => {
      if (typeof item === 'object' && item !== null) {
        const m = { ...(item as Record<string, unknown>) }
        if (typeof m.expertSlug === 'string' && typeof m.reason === 'string') {
          memberReasons[m.expertSlug] = m.reason
        }
        delete m.reason
        return m
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
  if (availableSlugs) {
    for (const member of team.members) {
      if (!availableSlugs.has(member.expertSlug)) {
        return {
          ok: false,
          error: `专家成员「${member.expertSlug}」不存在于当前专家库中。`,
        }
      }
    }
  }

  return { ok: true, value: team, memberReasons }
}
