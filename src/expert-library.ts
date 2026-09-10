import { randomUUID } from 'node:crypto'
import schema from '@deepseek-ai/schemastery'
import type { SettingsPathOp } from '@deepseek-ai/dsh-settings'
import { z } from 'zod'
import { CUSTOM_EXPERT_LIMIT, CUSTOM_EXPERT_SLUG, customError, customExpertInputSchema, customExpertSchema, type CatalogSnapshot, type CustomExpert, type CustomExpertInput, type ExpertSummary } from './expert-contract.js'
import { ZH_DIVISION } from './names.js'

export const AGENCY_LIBRARY_SERVICE = 'agencyAgentsLibrary'
export interface AgencySettings { enabled: string[]; customExperts?: CustomExpert[] }

/** 兼容只有 enabled 的旧配置；内容与启用状态在同一 namespace 原子持久化。 */
export const agencySettingsSchema = schema.object({
  enabled: schema.array(schema.string()).default([]),
  customExperts: schema.array(schema.any()).default([]),
})

export function validateAgencySettings(value: AgencySettings, locale: 'zh' | 'en' = 'zh'): void {
  const records = z.array(customExpertSchema).parse(value.customExperts ?? [])
  if (records.filter(item => !item.deleted).length > CUSTOM_EXPERT_LIMIT) throw customError('limit', locale)
  const ids = new Set<string>()
  const names = new Set<string>()
  for (const expert of value.customExperts ?? []) {
    if (ids.has(expert.slug) || (!expert.deleted && names.has(normalizeName(expert.name)))) throw customError('duplicate', locale)
    ids.add(expert.slug)
    if (!expert.deleted) names.add(normalizeName(expert.name))
  }
}

export interface ExpertSettingsStore {
  read(): AgencySettings
  revision(): number
  mutate(ops: SettingsPathOp[], expectedRevision: number): Promise<void>
}
export interface AgencyExpertLibrary {
  catalog(): Promise<CatalogSnapshot>
  getCustom(slug: string): Promise<CustomExpert>
  saveCustom(input: CustomExpertInput, enabled: boolean, expectedRevision: number): Promise<CatalogSnapshot>
  deleteCustom(slug: string, expectedRevision: number): Promise<CatalogSnapshot>
  setEnabled(enabled: string[], expectedRevision: number): Promise<{ enabled: string[]; revision: number }>
  cleanupDeleted(): Promise<void>
}
export const normalizeName = (value: string): string => value.trim().toLowerCase()

/** 合并只读基础名册与自定义数据；依赖宿主的持久化事务和修订号仲裁。 */
export function createExpertLibrary(
  base: () => Promise<ReadonlyArray<ExpertSummary>>,
  store: ExpertSettingsStore,
  divisions: readonly string[],
  locale: () => 'zh' | 'en',
): AgencyExpertLibrary {
  const read = (): { enabled: string[]; customExperts: CustomExpert[] } => {
    const state = store.read()
    return { enabled: state.enabled, customExperts: z.array(customExpertSchema).parse(state.customExperts ?? []) }
  }
  const checkRevision = (revision: number): void => {
    if (!Number.isSafeInteger(revision) || revision < 0 || revision !== store.revision()) throw customError('conflict', locale())
  }
  const summary = (expert: CustomExpert): ExpertSummary => ({
    slug: expert.slug, name: expert.name, nameEn: expert.name,
    description: expert.description, descriptionEn: '', emoji: expert.emoji,
    division: expert.division, divisionZh: ZH_DIVISION[expert.division] ?? expert.division,
    avatar: expert.avatar, custom: true,
  })
  const overlaps = (a: ExpertSummary, b: ExpertSummary): boolean => a.slug === b.slug || [a.name, a.nameEn].some(name => [b.name, b.nameEn].some(other => normalizeName(name) === normalizeName(other)))
  // 只校验当前编辑对象，其他已有冲突不能阻断逐个修复。
  const assertUnique = (expert: ExpertSummary, others: readonly ExpertSummary[]): void => {
    if (others.some(other => overlaps(expert, other))) throw customError('duplicate', locale())
  }
  const project = (builtins: readonly ExpertSummary[], state: ReturnType<typeof read>): CatalogSnapshot => {
    const custom = state.customExperts.filter(item => !item.deleted).map(summary)
    const experts = [...builtins.map(expert => ({ ...expert, conflict: builtins.some(other => other !== expert && overlaps(expert, other)) })),
      ...custom.map(expert => ({ ...expert, conflict: [...builtins, ...custom.filter(other => other !== expert)].some(other => overlaps(expert, other)) }))]
    const available = new Set(experts.filter(expert => !expert.conflict).map(expert => expert.slug))
    return { experts, enabled: [...new Set(state.enabled.filter(slug => available.has(slug)))], revision: store.revision() }
  }
  const assertWritable = (slug: string): void => {
    if (!CUSTOM_EXPERT_SLUG.test(slug)) throw customError('readonly', locale())
  }
  const activeRecords = (records: CustomExpert[]): CustomExpert[] => records.filter(item => !item.deleted).map(({ deleted: _deleted, wasEnabled: _wasEnabled, ...item }) => item)
  const persist = async (state: ReturnType<typeof read>, revision: number): Promise<CatalogSnapshot> => {
    await store.mutate([
      { op: 'set', path: ['customExperts'], value: activeRecords(state.customExperts) },
      { op: 'set', path: ['enabled'], value: [...new Set(state.enabled)] },
    ], revision)
    return library.catalog()
  }
  const library: AgencyExpertLibrary = {
    async catalog() {
      const builtins = await base()
      const state = read()
      return project(builtins, state)
    },
    async getCustom(slug) {
      assertWritable(slug)
      const expert = read().customExperts.find(item => item.slug === slug && !item.deleted)
      if (expert === undefined) throw customError('missing', locale())
      return expert
    },
    async saveCustom(input, enabled, expectedRevision) {
      const builtins = await base()
      checkRevision(expectedRevision)
      const parsed = customExpertInputSchema.safeParse(input)
      if (!parsed.success || typeof enabled !== 'boolean') throw customError('invalid', locale())
      const value = parsed.data
      if (!divisions.includes(value.division) && !builtins.some(item => item.division === value.division)) throw customError('division', locale())
      const state = read()
      if (value.slug !== undefined && !state.customExperts.some(item => item.slug === value.slug && !item.deleted)) throw customError('missing', locale())
      if (value.slug === undefined && state.customExperts.filter(item => !item.deleted).length >= CUSTOM_EXPERT_LIMIT) throw customError('limit', locale())
      const expert: CustomExpert = { ...value, slug: value.slug ?? `custom-${randomUUID()}` }
      const next = state.customExperts.filter(item => item.slug !== expert.slug)
      next.push(expert)
      assertUnique(summary(expert), [...builtins, ...next.filter(item => !item.deleted && item.slug !== expert.slug).map(summary)])
      return persist({ customExperts: next, enabled: [...state.enabled.filter(slug => slug !== expert.slug), ...(enabled ? [expert.slug] : [])] }, expectedRevision)
    },
    async deleteCustom(slug, expectedRevision) {
      assertWritable(slug)
      checkRevision(expectedRevision)
      const state = read()
      if (!state.customExperts.some(item => item.slug === slug && !item.deleted)) throw customError('missing', locale())
      return persist({
        customExperts: state.customExperts.filter(item => item.slug !== slug),
        enabled: state.enabled.filter(item => item !== slug),
      }, expectedRevision)
    },
    async setEnabled(enabled, expectedRevision) {
      const builtins = await base()
      checkRevision(expectedRevision)
      const state = read()
      const available = new Set(project(builtins, state).experts.filter(expert => !expert.conflict).map(expert => expert.slug))
      if (enabled.some(slug => !available.has(slug))) throw customError('unavailable', locale())
      const next = [...new Set(enabled)]
      await store.mutate([
        { op: 'set', path: ['customExperts'], value: activeRecords(state.customExperts) },
        { op: 'set', path: ['enabled'], value: next },
      ], expectedRevision)
      return { enabled: next, revision: store.revision() }
    },
    async cleanupDeleted() {
      const state = read()
      if (!state.customExperts.some(item => item.deleted !== undefined || item.wasEnabled !== undefined)) return
      // 默认源及卸载回退无需访问设置区；快照与修订号之间没有异步间隙。
      const expectedRevision = store.revision()
      const records = activeRecords(state.customExperts)
      const deleted = new Set(state.customExperts.filter(item => item.deleted).map(item => item.slug))
      await store.mutate([
        { op: 'set', path: ['customExperts'], value: records },
        { op: 'set', path: ['enabled'], value: state.enabled.filter(slug => !deleted.has(slug)) },
      ], expectedRevision)
    },
  }
  return library
}
