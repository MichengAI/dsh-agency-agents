import { randomUUID } from 'node:crypto'
import schema from '@deepseek-ai/schemastery'
import type { SettingsPathOp } from '@deepseek-ai/dsh-settings'
import { z } from 'zod'
import { CUSTOM_EXPERT_LIMIT, customError, customExpertInputSchema, customExpertSchema, type CatalogSnapshot, type CustomExpert, type CustomExpertInput, type ExpertSummary } from './expert-contract.js'
import { ZH_DIVISION } from './names.js'

export const AGENCY_LIBRARY_SERVICE = 'agencyAgentsLibrary'
export interface AgencySettings { enabled: string[]; customExperts?: CustomExpert[] }

/** 兼容只有 enabled 的旧配置；内容与启用状态在同一 namespace 原子持久化。 */
export const agencySettingsSchema = schema.object({
  enabled: schema.array(schema.string()).default([]),
  customExperts: schema.array(schema.any()).default([]),
})

export function validateAgencySettings(value: AgencySettings): void {
  z.array(customExpertSchema).max(CUSTOM_EXPERT_LIMIT).parse(value.customExperts ?? [])
  const ids = new Set<string>()
  const names = new Set<string>()
  for (const expert of value.customExperts ?? []) {
    if (ids.has(expert.slug) || (!expert.deleted && names.has(normalizeName(expert.name)))) throw customError('duplicate', 'zh')
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
  restoreCustom(slug: string, expectedRevision: number): Promise<CatalogSnapshot>
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
  const assertUnique = (items: readonly ExpertSummary[]): void => {
    const owners = new Map<string, string>()
    const slugs = new Set<string>()
    for (const expert of items) {
      if (slugs.has(expert.slug)) throw customError('duplicate', locale())
      slugs.add(expert.slug)
      for (const name of [expert.name, expert.nameEn]) {
        const key = normalizeName(name)
        const owner = owners.get(key)
        if (owner !== undefined && owner !== expert.slug) throw customError('duplicate', locale())
        owners.set(key, expert.slug)
      }
    }
  }
  const assertWritable = (slug: string): void => {
    if (!/^custom-[0-9a-f-]{36}$/u.test(slug)) throw customError('readonly', locale())
  }
  const persist = async (state: ReturnType<typeof read>, revision: number): Promise<CatalogSnapshot> => {
    await store.mutate([
      { op: 'set', path: ['customExperts'], value: state.customExperts },
      { op: 'set', path: ['enabled'], value: [...new Set(state.enabled)] },
    ], revision)
    return library.catalog()
  }
  const library: AgencyExpertLibrary = {
    async catalog() {
      const builtins = await base()
      const state = read()
      const experts = [...builtins, ...state.customExperts.filter(item => !item.deleted).map(summary)]
      assertUnique(experts)
      const available = new Set(experts.map(expert => expert.slug))
      return { experts, enabled: state.enabled.filter(slug => available.has(slug)), revision: store.revision() }
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
      if (value.slug === undefined && state.customExperts.length >= CUSTOM_EXPERT_LIMIT) throw customError('limit', locale())
      const expert: CustomExpert = { ...value, slug: value.slug ?? `custom-${randomUUID()}`, deleted: false, wasEnabled: false }
      const next = state.customExperts.filter(item => item.slug !== expert.slug)
      next.push(expert)
      assertUnique([...builtins, ...next.filter(item => !item.deleted).map(summary)])
      return persist({ customExperts: next, enabled: [...state.enabled.filter(slug => slug !== expert.slug), ...(enabled ? [expert.slug] : [])] }, expectedRevision)
    },
    async deleteCustom(slug, expectedRevision) {
      assertWritable(slug)
      checkRevision(expectedRevision)
      const state = read()
      if (!state.customExperts.some(item => item.slug === slug && !item.deleted)) throw customError('missing', locale())
      return persist({
        customExperts: state.customExperts.map(item => item.slug === slug ? { ...item, deleted: true, wasEnabled: state.enabled.includes(slug) } : item),
        enabled: state.enabled.filter(item => item !== slug),
      }, expectedRevision)
    },
    async restoreCustom(slug, expectedRevision) {
      const builtins = await base()
      assertWritable(slug)
      checkRevision(expectedRevision)
      const state = read()
      const expert = state.customExperts.find(item => item.slug === slug && item.deleted)
      if (expert === undefined) throw customError('missing', locale())
      const next = state.customExperts.map(item => item.slug === slug ? { ...item, deleted: false } : item)
      assertUnique([...builtins, ...next.filter(item => !item.deleted).map(summary)])
      return persist({ customExperts: next, enabled: [...state.enabled, ...(expert.wasEnabled ? [slug] : [])] }, expectedRevision)
    },
  }
  return library
}
