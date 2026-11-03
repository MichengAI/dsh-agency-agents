import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync, copyFileSync } from 'node:fs'
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
  /** 专家正文兜底字段：v1 遗留格式，或冷文件写入失败时的内联降级，读取时迁回冷文件。 */
  experts?: Record<string, string>
}

/** 专家正文文件：单条可达数十 KB、只在出现新专家时写入，属于冷路径载荷。 */
interface PersistedExpertFile {
  version: 1
  experts: Record<string, string>
}

/** 门禁 id 清单：每条仅一个 id，与 128 条配置上限解耦，保证淘汰后重启仍受递归门禁保护。 */
interface PersistedIdFile {
  version: 1
  ids: string[]
}

/** 热文件：只保存「哪个子代理用了哪个专家」的引用，体积与专家正文无关。 */
const CHILDREN_FILE = 'agency-subagents.json'
/** 冷文件：每个专家只保存一份正文，供冷恢复解析。 */
const EXPERT_FILE = 'agency-expert-personas.json'
/** 门禁清单文件：只存 id，允许远大于配置上限的条目数。 */
const IDS_FILE = 'agency-subagent-ids.json'
const MAX_PERSISTED_CHILDREN = 128
const MAX_PERSISTED_IDS = 2048

const expertPersonas = new Map<string, string>()
const childRecords = new Map<string, PersistedChildEntry>()
const managedIds = new Set<string>()

let personasDirty = false
let idsDirty = false
/** 热文件存在却解析失败：此时内存里的 children 不代表真实历史，必须暂停孤儿清理。 */
let childrenUnreadable = false
let flushTimer: NodeJS.Timeout | undefined
let pendingFlushCtx: Context | undefined
/** 缓存最近一次解析成功的 profile 目录：卸载/退出时 profileContext 可能已不可用。 */
let lastHome: string | undefined

function resolveHome(ctx?: Context): string | undefined {
  const home = profileHome(ctx)
  if (home) lastHome = home
  return home ?? lastHome
}

type ReadResult = { state: 'missing' } | { state: 'unreadable' } | { state: 'ok'; value: unknown }

/** 区分「文件不存在」与「存在但读不出来」：前者可以正常清理，后者必须保守处理。 */
function readJsonFile(file: string): ReadResult {
  if (!existsSync(file)) return { state: 'missing' }
  try {
    return { state: 'ok', value: JSON.parse(readFileSync(file, 'utf8')) as unknown }
  } catch (error) {
    console.warn(`[agency-agents] 读取 ${file} 失败：`, error)
    return { state: 'unreadable' }
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
  const expertsRead = readJsonFile(join(home, EXPERT_FILE))
  if (expertsRead.state === 'ok') {
    const doc = expertsRead.value as Partial<PersistedExpertFile> | undefined
    if (doc && typeof doc === 'object' && doc.experts && typeof doc.experts === 'object') {
      for (const [slug, persona] of Object.entries(doc.experts)) {
        if (typeof persona === 'string') expertPersonas.set(slug, persona)
      }
    }
  }

  // 2) 门禁 id 清单：与 128 条配置上限解耦，先于热文件加载，热文件坏了也保留门禁
  const idsRead = readJsonFile(join(home, IDS_FILE))
  if (idsRead.state === 'ok') {
    const doc = idsRead.value as Partial<PersistedIdFile> | undefined
    if (doc && typeof doc === 'object' && Array.isArray(doc.ids)) {
      for (const id of doc.ids) if (typeof id === 'string' && id !== '') managedIds.add(id)
    }
  }

  // 3) 热文件：子代理条目（v2 引用格式 / v1 同文件格式 / 更早的平铺格式）
  const childrenPath = join(home, CHILDREN_FILE)
  const childrenRead = readJsonFile(childrenPath)
  if (childrenRead.state === 'unreadable') {
    // 热文件坏了：内存里 children 为空并不代表历史为空，本进程内暂停孤儿清理
    childrenUnreadable = true
    try {
      const corruptBackup = join(home, `${CHILDREN_FILE}.corrupt`)
      if (!existsSync(corruptBackup) && existsSync(childrenPath)) {
        copyFileSync(childrenPath, corruptBackup)
      }
    } catch {}
    return
  }
  if (childrenRead.state === 'missing') return

  const doc = childrenRead.value as (PersistedChildrenFile & Record<string, unknown>) | Record<string, PersistedSubagentConfig> | undefined
  if (!doc || typeof doc !== 'object') return

  const versioned = (doc as PersistedChildrenFile).version === 1 || (doc as PersistedChildrenFile).version === 2
  const legacyExperts = versioned ? (doc as PersistedChildrenFile).experts : undefined
  if (legacyExperts && typeof legacyExperts === 'object') {
    for (const [slug, persona] of Object.entries(legacyExperts)) {
      if (typeof persona === 'string' && !expertPersonas.has(slug)) expertPersonas.set(slug, persona)
    }
    // 内联正文（v1 遗留或冷写失败降级）：下一次 flush 迁回冷文件
    personasDirty = true
  }

  const rows = versioned
    ? ((doc as PersistedChildrenFile).children ?? {})
    : (doc as Record<string, PersistedSubagentConfig>)
  for (const [id, config] of Object.entries(rows)) adoptChildRecord(id, config)
  // 旧版本没有门禁清单文件：升级后先补写一次，避免重启前的老子代理只靠配置条目保护
  if (idsRead.state !== 'ok' && managedIds.size > 0) idsDirty = true
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

  // 热文件读不出来时，内存里的 children 不完整，清理会把仍有效的正文当孤儿删掉
  if (!childrenUnreadable) pruneUnreferencedExperts()

  // 先写冷文件：保证热文件里的 slug 一定有对应正文
  let expertsSaved = true
  if (personasDirty) {
    const expertsPayload: PersistedExpertFile = { version: 1, experts: Object.fromEntries(expertPersonas.entries()) }
    expertsSaved = writeJsonAtomic(join(home, EXPERT_FILE), expertsPayload)
  }

  // 门禁 id 清单：只存 id，条目数上限远高于配置，淘汰的旧子代理重启后仍受保护
  if (idsDirty) {
    const idsPayload: PersistedIdFile = { version: 1, ids: [...managedIds] }
    if (writeJsonAtomic(join(home, IDS_FILE), idsPayload)) idsDirty = false
  }

  // 再写热文件：只有引用与工具裁剪；冷写失败时把正文内联进来，避免「热有引用、冷无正文」
  const inlineExperts = personasDirty && !expertsSaved
    ? { experts: Object.fromEntries(expertPersonas.entries()) }
    : {}
  const childrenPayload: PersistedChildrenFile = {
    version: 2,
    children: Object.fromEntries(childRecords.entries()),
    ...inlineExperts,
  }
  writeJsonAtomic(join(home, CHILDREN_FILE), childrenPayload)

  // 冷文件写失败时保留 dirty，并靠热文件内联正文兜底，下一次 flush 再迁回
  if (personasDirty && expertsSaved) personasDirty = false
}

export function recordSubagentConfig(
  id: string,
  config: { slug?: string; persona?: string; toolFilter?: { deny: string[] } },
  ctx?: Context,
): void {
  if (!managedIds.has(id)) {
    managedIds.add(id)
    if (managedIds.size > MAX_PERSISTED_IDS) {
      const oldest = managedIds.values().next().value
      if (oldest !== undefined && oldest !== id) managedIds.delete(oldest)
    }
    idsDirty = true
  }

  if (childRecords.size >= MAX_PERSISTED_CHILDREN && !childRecords.has(id)) {
    let oldestKey: string | undefined
    let oldestTime = Infinity
    for (const [key, record] of childRecords.entries()) {
      const time = record.updatedAt ?? 0
      if (time < oldestTime) {
        oldestTime = time
        oldestKey = key
      }
    }
    if (oldestKey !== undefined) {
      childRecords.delete(oldestKey)
    } else {
      const oldest = childRecords.keys().next().value
      if (oldest !== undefined) childRecords.delete(oldest)
    }
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

  scheduleFlush(ctx)
}

/**
 * 撤销一条尚未真正建立的子代理记录：召唤失败时不能让幻影条目占住条目配额或门禁清单。
 * 已经跑过的子代理不受影响（调用方只在创建失败时回滚）。
 */
export function forgetSubagentConfig(id: string, ctx?: Context): void {
  const droppedRecord = childRecords.delete(id)
  const droppedId = managedIds.delete(id)
  if (droppedId) idsDirty = true
  if (!droppedRecord && !droppedId) return
  scheduleFlush(ctx)
}

function scheduleFlush(ctx?: Context): void {
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
  idsDirty = false
  childrenUnreadable = false
  expertPersonas.clear()
  childRecords.clear()
  managedIds.clear()
}
