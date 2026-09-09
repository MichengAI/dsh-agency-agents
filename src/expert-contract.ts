import { z } from 'zod'

/** Host 与 Client 共用的自定义专家数据契约，不包含运行时服务依赖。 */
export const DEFAULT_EXPERT_EMOJI = '🧩'
export const CUSTOM_EXPERT_LIMIT = 200
export const CUSTOM_EXPERT_SLUG = /^custom-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/** 允许一个完整 Emoji（含肤色、旗帜和 ZWJ 组合），拒绝普通文本和多图标。 */
export function isExpertEmoji(value: string): boolean {
  return value.length <= 32 && [...segmenter.segment(value)].length === 1
    && /\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Presentation}|[0-9#*]\uFE0F?\u20E3/u.test(value)
}

const nameSchema = z.string().trim().min(1).max(40).refine(value => !/[@\r\n\u0000-\u001f\u007f]/u.test(value))
export const customExpertInputSchema = z.object({
  slug: z.string().regex(CUSTOM_EXPERT_SLUG).optional(),
  name: nameSchema,
  description: z.string().trim().min(1).max(160),
  division: z.string().regex(/^[a-z][a-z0-9-]{0,63}$/u),
  emoji: z.string().trim().default(DEFAULT_EXPERT_EMOJI).transform(value => value || DEFAULT_EXPERT_EMOJI).refine(isExpertEmoji),
  avatar: z.number().int().min(0).max(35).default(0),
  prompt: z.string().trim().min(1).max(20_000),
}).strict()

export const customExpertSchema = customExpertInputSchema.extend({
  slug: z.string().regex(CUSTOM_EXPERT_SLUG),
  deleted: z.boolean().optional(),
  wasEnabled: z.boolean().optional(),
})
export type CustomExpertInput = z.input<typeof customExpertInputSchema>
export type CustomExpert = z.output<typeof customExpertSchema>

export const expertSummarySchema = z.object({
  slug: z.string(), name: z.string(), nameEn: z.string(),
  description: z.string(), descriptionEn: z.string(),
  emoji: z.string(), division: z.string(), divisionZh: z.string(),
  conflict: z.boolean().optional(),
  custom: z.boolean().default(false), avatar: z.number().int().min(0).max(35).optional(),
})
export type ExpertSummary = z.infer<typeof expertSummarySchema>
export const catalogSnapshotSchema = z.object({
  experts: z.array(expertSummarySchema),
  enabled: z.array(z.string()), revision: z.number().int().min(0),
})
export type CatalogSnapshot = z.infer<typeof catalogSnapshotSchema>
export const expertEditSchema = customExpertSchema.omit({ deleted: true, wasEnabled: true })

const messages = {
  invalid: ['请检查名称、简介、分类和提示词；召唤图标必须是一个 Emoji。', 'Check the name, description, category and prompt; the summon icon must be one emoji.'],
  duplicate: ['专家名称已被使用，请换一个名称。', 'This expert name is already in use. Choose another name.'],
  unavailable: ['所选专家不存在、已删除或名称冲突，请刷新后重新选择。', 'An expert is missing, deleted or has a name conflict. Refresh and choose again.'],
  missing: ['自定义专家不存在或已删除，请刷新后重试。', 'The custom expert is missing or deleted. Refresh and try again.'],
  readonly: ['内置或外部目录专家不可直接编辑，请复制为自定义专家。', 'Built-in and external experts are read-only. Create a custom copy instead.'],
  division: ['请选择有效的专家分类。', 'Choose a valid expert category.'],
  limit: ['自定义专家数量已达到上限（200 位），请先删除不再使用的专家。', 'The limit of 200 custom experts has been reached. Delete an unused expert first.'],
  conflict: ['专家配置已被其他窗口修改，请刷新后重试。', 'Expert settings were changed in another window. Refresh and try again.'],
} as const
export type CustomErrorKey = keyof typeof messages
export function customError(key: CustomErrorKey, locale: 'zh' | 'en'): Error {
  return new Error(messages[key][locale === 'en' ? 1 : 0])
}
