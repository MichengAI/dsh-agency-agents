import { existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import { profileHome } from './settings-compat.js'

export interface PersistedSubagentConfig {
  persona?: string
  toolFilter?: { deny: string[] }
  updatedAt?: number
}

const MAX_PERSISTED_RECORDS = 128
const memoryConfigs = new Map<string, PersistedSubagentConfig>()
const managedIds = new Set<string>()

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
    const parsed = JSON.parse(raw) as Record<string, PersistedSubagentConfig>
    if (parsed && typeof parsed === 'object') {
      for (const [id, config] of Object.entries(parsed)) {
        if (!config || typeof config !== 'object') continue
        memoryConfigs.set(id, {
          persona: typeof config.persona === 'string' ? config.persona : undefined,
          toolFilter: Array.isArray(config.toolFilter?.deny) ? { deny: config.toolFilter.deny } : undefined,
          updatedAt: typeof config.updatedAt === 'number' ? config.updatedAt : Date.now(),
        })
        managedIds.add(id)
      }
    }
  } catch (error) {
    console.warn('[agency-agents] 读取 agency-subagents.json 失败：', error)
  }
}

export function recordSubagentConfig(
  id: string,
  config: { persona?: string; toolFilter?: { deny: string[] } },
  ctx?: Context,
): void {
  managedIds.add(id)
  if (memoryConfigs.size >= MAX_PERSISTED_RECORDS) {
    const oldest = memoryConfigs.keys().next().value
    if (oldest !== undefined) memoryConfigs.delete(oldest)
  }
  memoryConfigs.set(id, {
    persona: config.persona,
    toolFilter: config.toolFilter,
    updatedAt: Date.now(),
  })

  const file = getSubagentsFile(ctx)
  if (file) {
    try {
      const payload: Record<string, PersistedSubagentConfig> = {}
      for (const [key, value] of memoryConfigs.entries()) {
        payload[key] = value
      }
      const tmpFile = `${file}.${randomUUID()}.tmp`
      writeFileSync(tmpFile, JSON.stringify(payload, null, 2), 'utf8')
      renameSync(tmpFile, file)
    } catch (error) {
      console.warn('[agency-agents] 写入 agency-subagents.json 失败：', error)
    }
  }
}

export function getSubagentConfig(id: string): PersistedSubagentConfig | undefined {
  return memoryConfigs.get(id)
}

export function isManagedSubagentId(id: string): boolean {
  return managedIds.has(id)
}

export function clearSubagentRegistryForTest(): void {
  memoryConfigs.clear()
  managedIds.clear()
}
