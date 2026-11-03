import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import { profileHome } from './settings-compat.js'

/** 一份受管子代理的配置快照；persona 可由专家缓存按 slug 解析，或沿旧格式内联保留。 */
export interface PersistedSubagentConfig {
  slug?: string
  persona?: string
  toolFilter?: { deny: string[] }
  updatedAt?: number
}

interface PersistedChildEntry {
  slug?: string
  persona?: string
  toolFilter?: { deny: string[] }
  updatedAt: number
}

/** 子代理条目文件：每条约百字节、每次召唤都可能变化，属于热路径载荷。 */
interface PersistedChildrenFile {
  version: 2 | 1
  children?: Record<string, PersistedChildEntry>
  /** v1 遗留字段：专家正文曾与条目同文件，读取时迁移到冷文件。 */
  experts?: Record<string, string>
}

/** 专家正文文件：单条可达数十 KB、只在出现新专家时写入，属于冷路径载荷。 */
interface PersistedExpertFile {
  version: 1
  experts: Record<string, string>
}

/** 热文件：只保存「哪个子代理用了哪个专家」的引用，体积与专家正文无关。 */
const CHILDREN_FILE = 'agency-subagents.json'
/** 冷文件：每个专家只保存一份正文，供冷恢复解析。 */
const EXPERT_FILE = 'agency-expert-personas.json'
const MAX_PERSISTED_CHILDREN = 128

const expertPersonas = new Map<string, string>()
const childRecords = new Map<string, PersistedChildEntry>()
const managedIds = new Set<string>()

let personasDirty = false
let flushTimer: NodeJS.Timeout | undefined
let pendingFlushCtx: Context | undefined
/** 缓存最近一次解析成功的 profile 目录：卸载/退出时 profileContext 可能已不可用。 */
let lastHome: string | undefined

function resolveHome(ctx?: Context): string | undefined {
  const home = profileHome(ctx)
  if (home) lastHome = home
  return home ?? lastHome
}

function readJsonFile(file: string): unknown | undefined {
  if (!existsSync(file)) return undefined
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as unknown
  } catch (error) {
    console.warn(`[agency-agents] 读取 ${file} 失败：`, error)
    return undefined
  }
}

/** 临时文件 + rename 原子替换；失败时清掉临时文件，绝不留残缺目标文件。 */
function writeJsonAtomic(file: string, payload: unknown): boolean {
  let tmpFile: string | undefined
  try {
    tmpFile = `${file}.${randomUUID()}.tmp`
    writeFileSync(tmpFile, JSON.stringify(payload, null, 2), 'utf8')
    renameSync(tmpFile, file)
    tmpFile = undefined
    return true
  } catch (error) {
    console.warn(`[agency-agents] 写入 ${file} 失败：`, error)
    return false
  } finally {
    if (tmpFile !== undefined && existsSync(tmpFile)) {
      try {
        unlinkSync(tmpFile)
      } catch {}
    }
  }
}

function adoptChildRecord(id: string, config: PersistedSubagentConfig): void {
  if (!config || typeof config !== 'object') return
  childRecords.set(id, {
    slug: typeof config.slug === 'string' ? config.slug : undefined,
    persona: typeof config.persona === 'string' ? config.persona : undefined,
    toolFilter: Array.isArray(config.toolFilter?.deny) ? { deny: config.toolFilter.deny } : undefined,
    updatedAt: typeof config.updatedAt === 'number' ? config.updatedAt : Date.now(),
  })
  managedIds.add(id)
}

export function initSubagentRegistry(ctx?: Context): void {
  const home = resolveHome(ctx)
  if (!home) return

  // 1) 冷文件：专家正文缓存
  const expertsDoc = readJsonFile(join(home, EXPERT_FILE)) as Partial<PersistedExpertFile> | undefined
  if (expertsDoc && typeof expertsDoc === 'object' && expertsDoc.experts && typeof expertsDoc.experts === 'object') {
    for (const [slug, persona] of Object.entries(expertsDoc.experts)) {
      if (typeof persona === 'string') expertPersonas.set(slug, persona)
    }
  }

  // 2) 热文件：子代理条目（v2 引用格式 / v1 同文件格式 / 更早的平铺格式）
  const doc = readJsonFile(join(home, CHILDREN_FILE)) as
    | (PersistedChildrenFile & Record<string, unknown>)
    | Record<string, PersistedSubagentConfig>
    | undefined
  if (!doc || typeof doc !== 'object') return

  const versioned = (doc as PersistedChildrenFile).version === 1 || (doc as PersistedChildrenFile).version === 2
  const legacyExperts = versioned ? (doc as PersistedChildrenFile).experts : undefined
  if (legacyExperts && typeof legacyExperts === 'object') {
    for (const [slug, persona] of Object.entries(legacyExperts)) {
      if (typeof persona === 'string' && !expertPersonas.has(slug)) expertPersonas.set(slug, persona)
    }
    // v1 把专家正文塞在热文件里：下一次 flush 把它迁到冷文件
    personasDirty = true
  }

  const rows = versioned
    ? ((doc as PersistedChildrenFile).children ?? {})
    : (doc as Record<string, PersistedSubagentConfig>)
  for (const [id, config] of Object.entries(rows)) adoptChildRecord(id, config)
}

/** 丢弃不再被任何子代理引用的专家正文，避免冷文件随历史召唤无限增长。 */
function pruneUnreferencedExperts(): void {
  const referenced = new Set<string>()
  for (const child of childRecords.values()) {
    if (child.slug) referenced.add(child.slug)
  }
  for (const slug of [...expertPersonas.keys()]) {
    if (referenced.has(slug)) continue
    expertPersonas.delete(slug)
    personasDirty = true
  }
}

export function flushSubagentRegistrySync(ctx?: Context): void {
  if (flushTimer !== undefined) {
    clearTimeout(flushTimer)
    flushTimer = undefined
  }
  const targetCtx = ctx ?? pendingFlushCtx
  pendingFlushCtx = undefined
  const home = resolveHome(targetCtx)
  if (!home) return

  pruneUnreferencedExperts()

  // 先写冷文件：保证热文件里的 slug 一定有对应正文
  let expertsSaved = true
  if (personasDirty) {
    const expertsPayload: PersistedExpertFile = { version: 1, experts: Object.fromEntries(expertPersonas.entries()) }
    expertsSaved = writeJsonAtomic(join(home, EXPERT_FILE), expertsPayload)
  }

  // 再写热文件：只有引用与工具裁剪，体积不再随专家正文膨胀
  const childrenPayload: PersistedChildrenFile = { version: 2, children: Object.fromEntries(childRecords.entries()) }
  writeJsonAtomic(join(home, CHILDREN_FILE), childrenPayload)

  // 冷文件写失败时保留 dirty，下一次 flush 重试
  if (personasDirty && expertsSaved) personasDirty = false
}

export function recordSubagentConfig(
  id: string,
  config: { slug?: string; persona?: string; toolFilter?: { deny: string[] } },
  ctx?: Context,
): void {
  managedIds.add(id)

  if (childRecords.size >= MAX_PERSISTED_CHILDREN) {
    const oldest = childRecords.keys().next().value
    if (oldest !== undefined) childRecords.delete(oldest)
  }

  if (config.slug && config.persona) {
    if (expertPersonas.get(config.slug) !== config.persona) {
      expertPersonas.set(config.slug, config.persona)
      personasDirty = true
    }
    childRecords.set(id, { slug: config.slug, toolFilter: config.toolFilter, updatedAt: Date.now() })
  } else {
    childRecords.set(id, { persona: config.persona, toolFilter: config.toolFilter, updatedAt: Date.now() })
  }

  pendingFlushCtx = ctx
  // 50ms 批量写入防抖，避免高频并发召唤引起磁盘连续覆写
  if (flushTimer === undefined) {
    flushTimer = setTimeout(() => {
      flushTimer = undefined
      flushSubagentRegistrySync()
    }, 50)
  }
}

export function getSubagentConfig(id: string): PersistedSubagentConfig | undefined {
  const child = childRecords.get(id)
  if (!child) return undefined
  const persona = (child.slug ? expertPersonas.get(child.slug) : undefined) ?? child.persona
  return {
    slug: child.slug,
    persona,
    toolFilter: child.toolFilter,
    updatedAt: child.updatedAt,
  }
}

export function isManagedSubagentId(id: string): boolean {
  return managedIds.has(id)
}

export function clearSubagentRegistryForTest(): void {
  if (flushTimer !== undefined) {
    clearTimeout(flushTimer)
    flushTimer = undefined
  }
  pendingFlushCtx = undefined
  lastHome = undefined
  personasDirty = false
  expertPersonas.clear()
  childRecords.clear()
  managedIds.clear()
}
