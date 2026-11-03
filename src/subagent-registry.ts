import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import { profileHome } from './settings-compat.js'

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

interface PersistedRegistryFile {
  version: 1
  experts?: Record<string, string>
  children?: Record<string, PersistedChildEntry>
}

const MAX_PERSISTED_CHILDREN = 128
const expertPersonas = new Map<string, string>()
const childRecords = new Map<string, PersistedChildEntry>()
const managedIds = new Set<string>()

let flushTimer: NodeJS.Timeout | undefined
let pendingFlushCtx: Context | undefined

function getSubagentsFile(ctx?: Context): string | undefined {
  const home = profileHome(ctx)
  if (!home) return undefined
  return join(home, 'agency-subagents.json')
}

export function initSubagentRegistry(ctx?: Context): void {
  const file = getSubagentsFile(ctx)
  if (!file || !existsSync(file)) return
  try {
    const raw = readFileSync(file, 'utf8')
    const parsed = JSON.parse(raw) as PersistedRegistryFile | Record<string, PersistedSubagentConfig>
    if (!parsed || typeof parsed !== 'object') return

    // 格式分支 1：version 1 去重规范格式
    if ('version' in parsed && parsed.version === 1) {
      if (parsed.experts && typeof parsed.experts === 'object') {
        for (const [slug, persona] of Object.entries(parsed.experts)) {
          if (typeof persona === 'string') expertPersonas.set(slug, persona)
        }
      }
      if (parsed.children && typeof parsed.children === 'object') {
        for (const [id, child] of Object.entries(parsed.children)) {
          if (!child || typeof child !== 'object') continue
          childRecords.set(id, {
            slug: typeof child.slug === 'string' ? child.slug : undefined,
            persona: typeof child.persona === 'string' ? child.persona : undefined,
            toolFilter: Array.isArray(child.toolFilter?.deny) ? { deny: child.toolFilter.deny } : undefined,
            updatedAt: typeof child.updatedAt === 'number' ? child.updatedAt : Date.now(),
          })
          managedIds.add(id)
        }
      }
      return
    }

    // 格式分支 2：平滑兼容平铺旧格式
    for (const [id, config] of Object.entries(parsed)) {
      if (!config || typeof config !== 'object') continue
      childRecords.set(id, {
        persona: typeof config.persona === 'string' ? config.persona : undefined,
        toolFilter: Array.isArray(config.toolFilter?.deny) ? { deny: config.toolFilter.deny } : undefined,
        updatedAt: typeof config.updatedAt === 'number' ? config.updatedAt : Date.now(),
      })
      managedIds.add(id)
    }
  } catch (error) {
    console.warn('[agency-agents] 读取 agency-subagents.json 失败：', error)
  }
}

export function flushSubagentRegistrySync(ctx?: Context): void {
  if (flushTimer !== undefined) {
    clearTimeout(flushTimer)
    flushTimer = undefined
  }
  const targetCtx = ctx ?? pendingFlushCtx
  pendingFlushCtx = undefined
  const file = getSubagentsFile(targetCtx)
  if (!file) return

  // 清理不再被任何 child 引用的孤立 expert 文本
  const referencedSlugs = new Set<string>()
  for (const child of childRecords.values()) {
    if (child.slug) referencedSlugs.add(child.slug)
  }
  for (const slug of expertPersonas.keys()) {
    if (!referencedSlugs.has(slug)) expertPersonas.delete(slug)
  }

  const payload: PersistedRegistryFile = {
    version: 1,
    experts: Object.fromEntries(expertPersonas.entries()),
    children: Object.fromEntries(childRecords.entries()),
  }

  let tmpFile: string | undefined
  try {
    tmpFile = `${file}.${randomUUID()}.tmp`
    writeFileSync(tmpFile, JSON.stringify(payload, null, 2), 'utf8')
    renameSync(tmpFile, file)
    tmpFile = undefined
  } catch (error) {
    console.warn('[agency-agents] 写入 agency-subagents.json 失败：', error)
  } finally {
    if (tmpFile && existsSync(tmpFile)) {
      try {
        unlinkSync(tmpFile)
      } catch {}
    }
  }
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
    expertPersonas.set(config.slug, config.persona)
    childRecords.set(id, {
      slug: config.slug,
      toolFilter: config.toolFilter,
      updatedAt: Date.now(),
    })
  } else {
    childRecords.set(id, {
      persona: config.persona,
      toolFilter: config.toolFilter,
      updatedAt: Date.now(),
    })
  }

  pendingFlushCtx = ctx
  // 50ms 批量写入防抖，避免高频并发召唤引起磁盘连续全量覆写
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
  expertPersonas.clear()
  childRecords.clear()
  managedIds.clear()
}
