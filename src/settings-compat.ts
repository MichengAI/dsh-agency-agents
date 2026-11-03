import type { Context } from '@deepseek-ai/cordis'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { createRequire } from 'node:module'
import { existsSync, realpathSync, readFileSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { validateAgencySettings, type AgencySettings } from './expert-library.js'

/** 0.2.x 的命名空间就是校验过的字符串，不再调用已删除的 settingsNamespace()。 */
export function settingsNamespaceCompat(value: string): SettingsNamespace {
  return value as SettingsNamespace
}

function missingHostModule(specifier: string): NodeJS.ErrnoException {
  const error = new Error(`Cannot find module '${specifier}'`) as NodeJS.ErrnoException
  error.code = 'MODULE_NOT_FOUND'
  return error
}

/** 宿主 bin 可能是符号链接，或停在 prefix/bin，模块实际在 prefix/lib/node_modules。 */
function hostModuleAnchors(entry: string): string[] {
  const resolved = resolve(entry)
  const anchors = [resolved]
  try {
    const real = realpathSync(resolved)
    if (real !== resolved) anchors.push(real)
  } catch {
    // 垫片路径不一定是已存在的模块文件，继续按安装布局找。
  }
  const dir = dirname(resolved)
  anchors.push(
    join(dir, '..', 'lib', 'node_modules', '@deepseek-ai', 'dsh', 'package.json'),
    join(dir, 'node_modules', '@deepseek-ai', 'dsh', 'package.json'),
  )
  return anchors
}

/**
 * 宿主入口候选推导：
 * 显式指定 entry 时直接使用；默认未指定时依次尝试 pm2 真实入口（pm_exec_path）、
 * 包装器主模块路径（mainModule.filename）以及标准命令行参数（process.argv[1]）。
 */
function hostEntryCandidates(explicitEntry?: string): string[] {
  if (explicitEntry !== undefined) {
    return explicitEntry.trim() === '' ? [] : [explicitEntry]
  }
  const raw = [
    process.env.pm_exec_path,
    (process as { mainModule?: { filename?: string } }).mainModule?.filename,
    process.argv[1],
  ]
  const seen = new Set<string>()
  const candidates: string[] = []
  for (const item of raw) {
    if (typeof item === 'string' && item.trim() !== '' && !seen.has(item)) {
      seen.add(item)
      candidates.push(item)
    }
  }
  return candidates
}

function hostRequireFor(specifier: string, entry?: string): NodeRequire {
  const candidates = hostEntryCandidates(entry)
  if (candidates.length === 0) throw missingHostModule(specifier)
  let last: unknown = missingHostModule(specifier)
  for (const candidate of candidates) {
    for (const anchor of hostModuleAnchors(candidate)) {
      try {
        const hostRequire = createRequire(anchor)
        hostRequire.resolve(specifier)
        return hostRequire
      } catch (error) {
        last = error
        if ((error as NodeJS.ErrnoException).code !== 'MODULE_NOT_FOUND') throw error
      }
    }
  }
  throw last
}

/** 从当前宿主安装位置加载模块。解析不到时抛出 MODULE_NOT_FOUND，不回退到插件自己的依赖。 */
export function loadHostModule(specifier: string, entry?: string): unknown {
  return hostRequireFor(specifier, entry)(specifier)
}

/** 只确认宿主模块能否解析，不执行包入口。 */
export function resolveHostModule(specifier: string, entry?: string): string {
  return hostRequireFor(specifier, entry).resolve(specifier)
}

/** volatile 配置字段是带 get() 的稳定引用，读取时必须取当前快照。 */
export function isLiveValue(value: unknown): value is { get(): unknown } {
  return value !== null && typeof value === 'object' && typeof (value as { get?: unknown }).get === 'function'
}

function unwrapLive(value: unknown): unknown {
  return isLiveValue(value) ? value.get() : value
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function objectList(value: unknown): unknown[] {
  return Array.isArray(value) ? value.filter((item) => item !== null && typeof item === 'object') : []
}

export function hasAgencySettingsData(value: AgencySettings): boolean {
  return value.enabled.length > 0
    || (value.customExperts?.length ?? 0) > 0
    || (value.customTeams?.length ?? 0) > 0
    || (value.enabledTeams?.length ?? 0) > 0
}

/** 从插件配置读取启用名单。volatile 引用每次调用都重新取值，并复制冻结快照。 */
export function readAgencySettings(config: object, locale: 'zh' | 'en' = 'zh'): AgencySettings {
  const record = config as {
    enabled?: unknown
    customExperts?: unknown
    customTeams?: unknown
    enabledTeams?: unknown
    entryLocation?: unknown
    sidebarEntry?: unknown
    onlineUpdate?: unknown
    composerRecommend?: unknown
  }
  const rawLocation = unwrapLive(record.entryLocation)
  const rawSidebar = unwrapLive(record.sidebarEntry)
  const rawUpdate = unwrapLive(record.onlineUpdate)
  const rawRecommend = unwrapLive(record.composerRecommend)
  const location = (rawLocation === 'both' || rawLocation === 'sidebar' || rawLocation === 'settings')
    ? rawLocation
    : (rawSidebar === true ? 'both' : 'settings')
  const value: AgencySettings = {
    enabled: stringList(unwrapLive(record.enabled)),
    customExperts: objectList(unwrapLive(record.customExperts)) as AgencySettings['customExperts'],
    customTeams: objectList(unwrapLive(record.customTeams)) as AgencySettings['customTeams'],
    enabledTeams: stringList(unwrapLive(record.enabledTeams)),
    entryLocation: location,
    sidebarEntry: typeof rawSidebar === 'boolean' ? rawSidebar : (location !== 'settings'),
    onlineUpdate: typeof rawUpdate === 'boolean' ? rawUpdate : undefined,
    composerRecommend: typeof rawRecommend === 'boolean' ? rawRecommend : undefined,
  }
  validateAgencySettings(value, locale)
  try {
    return structuredClone(value)
  } catch {
    return value
  }
}

/** 从旧 settings.yaml 文档取出本插件区，丢掉宿主无法写入的其他字段。 */
export function agencySettingsFromLegacyDocument(document: unknown): AgencySettings | undefined {
  if (document === null || typeof document !== 'object' || Array.isArray(document)) return undefined
  const section = (document as Record<string, unknown>)['agency-agents']
  if (section === null || typeof section !== 'object' || Array.isArray(section)) return undefined
  const record = section as Record<string, unknown>
  return {
    enabled: stringList(record.enabled),
    customExperts: objectList(record.customExperts) as AgencySettings['customExperts'],
    customTeams: objectList(record.customTeams) as AgencySettings['customTeams'],
    enabledTeams: stringList(record.enabledTeams),
  }
}

export function profileHome(ctx?: Context): string | undefined {
  if (!ctx) return undefined
  try {
    const profile = (ctx as Context & { get?: (name: string) => unknown }).get?.('profileContext') as { home?: unknown } | undefined
    if (typeof profile?.home === 'string' && profile.home.trim() !== '') return profile.home
  } catch {
    // 未注入 profileContext 时 Cordis 会抛错，改走环境变量。
  }
  const fromEnv = process.env.DSH_HOME?.trim()
  return fromEnv === undefined || fromEnv === '' ? undefined : fromEnv
}

function parseHostYaml(text: string): unknown {
  try {
    const yaml = loadHostModule('yaml') as { parse?: (source: string) => unknown }
    return typeof yaml.parse === 'function' ? yaml.parse(text) : undefined
  } catch {
    return undefined
  }
}

type LiveSettingsWriter = {
  describe?: () => ReadonlyArray<{ ns?: unknown; revision?: number }>
  update?: (namespace: string, patch: object, revision?: number) => Promise<void>
  mutate?: (namespace: string, ops: readonly { op: 'set'; path: readonly string[]; value: unknown }[], revision?: number) => Promise<void>
}

type HmrStore = {
  getStore?: () => unknown
  exit?: <T>(callback: () => T) => T
}

function hmrStore(ctx: Context): HmrStore | undefined {
  const scopes = [ctx, (ctx as { root?: Context }).root].filter((scope): scope is Context => scope !== undefined)
  for (const scope of scopes) {
    try {
      const hmr = (scope as { get?: (name: string) => unknown }).get?.('hmr') as { executing?: HmrStore } | undefined
      if (typeof hmr?.executing?.exit === 'function') return hmr.executing
    } catch {
      // 服务未注册时 Cordis 会抛错，继续查看根上下文。
    }
  }
  return undefined
}

/** 启动导入本身就在 HMR 事务里。设置写入会再开一个事务，必须先离开当前事务。 */
async function writeLiveSettings(ctx: Context, write: () => Promise<void>): Promise<void> {
  const store = hmrStore(ctx)
  if (store?.getStore?.()) {
    await store.exit?.(write)
    return
  }
  await write()
}

/**
 * 宿主只把 settings.yaml 导入一次。若那次发生在本插件声明 volatile 字段之前，
 * 数据会留在 settings.yaml.imported。当前配置仍为空时，从该文件补写一次。
 */
export async function recoverImportedAgencySettings(
  ctx: Context,
  namespace: string,
  current: () => AgencySettings,
  isCancelled: () => boolean = () => false,
  parse: (text: string) => unknown = parseHostYaml,
  locale: 'zh' | 'en' = 'zh',
): Promise<void> {
  const loader = (ctx as Context & { root?: { loader?: { await?: () => Promise<unknown> } } }).root?.loader
  try {
    await loader?.await?.()
  } catch {
    // Loader 失败时仍尝试读取已经改名的旧文件。
  }
  if (isCancelled()) return
  const home = profileHome(ctx)
  if (home === undefined) return
  if (existsSync(join(home, 'settings.yaml')) || !existsSync(join(home, 'settings.yaml.imported'))) return
  if (hasAgencySettingsData(current())) return
  let document: unknown
  try {
    document = parse(await readFile(join(home, 'settings.yaml.imported'), 'utf8'))
  } catch (error: unknown) {
    console.warn('[agency-agents] 无法读取 settings.yaml.imported：', error)
    return
  }
  if (isCancelled() || hasAgencySettingsData(current())) return
  const section = agencySettingsFromLegacyDocument(document)
  if (section === undefined || !hasAgencySettingsData(section)) return
  try {
    validateAgencySettings(section, locale)
  } catch (error: unknown) {
    console.warn('[agency-agents] 旧设置未通过校验，已保留在 settings.yaml.imported：', error)
    return
  }
  const settings = ctx.settings as LiveSettingsWriter | undefined
  const revision = settings?.describe?.().find((item) => item.ns === namespace)?.revision
  await writeLiveSettings(ctx, async () => {
    if (typeof settings?.update === 'function') {
      await settings.update(namespace, section, revision)
      return
    }
    await settings?.mutate?.(namespace, [
      { op: 'set', path: ['enabled'], value: section.enabled },
      { op: 'set', path: ['customExperts'], value: section.customExperts ?? [] },
      { op: 'set', path: ['customTeams'], value: section.customTeams ?? [] },
      { op: 'set', path: ['enabledTeams'], value: section.enabledTeams ?? [] },
    ], revision)
  })
}

export type EntryLocation = 'both' | 'sidebar' | 'settings'

interface LocalAgencyState {
  entryLocation?: EntryLocation
  sidebarEntry?: boolean
}

let inMemoryState: LocalAgencyState = {}

function getLocalStateFile(ctx?: Context): string | undefined {
  const home = ctx ? profileHome(ctx) : undefined
  if (!home) return undefined
  return join(home, 'agency-settings.json')
}

export function readLocalAgencyState(ctx?: Context): LocalAgencyState {
  const file = getLocalStateFile(ctx)
  if (file && existsSync(file)) {
    try {
      const parsed = JSON.parse(readFileSync(file, 'utf8')) as LocalAgencyState
      if (parsed && typeof parsed === 'object') {
        inMemoryState = Object.assign({}, inMemoryState, parsed)
      }
    } catch {}
  }
  return inMemoryState
}

export function writeLocalAgencyState(ctx: Context | undefined, state: LocalAgencyState): void {
  inMemoryState = Object.assign({}, inMemoryState, state)
  const file = getLocalStateFile(ctx)
  if (file) {
    try {
      writeFileSync(file, JSON.stringify(inMemoryState, null, 2), 'utf8')
    } catch (err) {
      console.warn('[agency-agents] 写入 agency-settings.json 失败：', err)
    }
  }
}

export function getAgencyEntryLocation(settings?: { entryLocation?: unknown; sidebarEntry?: unknown }, ctx?: Context): EntryLocation {
  const local = readLocalAgencyState(ctx).entryLocation
  if (local === 'both' || local === 'sidebar' || local === 'settings') return local
  const loc = unwrapLive(settings?.entryLocation)
  if (loc === 'both' || loc === 'sidebar' || loc === 'settings') return loc
  const side = unwrapLive(settings?.sidebarEntry)
  return side === true ? 'both' : 'settings'
}

export async function setAgencyEntryLocation(ctx: Context, namespace: string, location: EntryLocation): Promise<EntryLocation> {
  if (location !== 'both' && location !== 'sidebar' && location !== 'settings') {
    throw new TypeError("location must be one of 'both', 'sidebar', or 'settings'")
  }
  const sidebarEnabled = location !== 'settings'
  // 1. 本地存储先行落盘，保证状态永不丢失或回弹
  writeLocalAgencyState(ctx, { entryLocation: location, sidebarEntry: sidebarEnabled })

  // 2. 尽力向宿主 live settings 广播（带安全降级，不阻断主流程）
  try {
    const settings = (ctx as { settings?: LiveSettingsWriter }).settings
    const revision = settings?.describe?.().find((item) => item.ns === namespace)?.revision
    await writeLiveSettings(ctx, async () => {
      if (typeof settings?.mutate === 'function') {
        try {
          await settings.mutate(namespace, [
            { op: 'set', path: ['entryLocation'], value: location },
            { op: 'set', path: ['sidebarEntry'], value: sidebarEnabled },
          ], revision)
        } catch {
          await settings.mutate(namespace, [
            { op: 'set', path: ['sidebarEntry'], value: sidebarEnabled },
          ])
        }
      } else if (typeof settings?.update === 'function') {
        try {
          await settings.update(namespace, { entryLocation: location, sidebarEntry: sidebarEnabled }, revision)
        } catch {
          await settings.update(namespace, { sidebarEntry: sidebarEnabled })
        }
      }
    })
  } catch (err) {
    console.warn('[agency-agents] 宿主 live settings 同步受阻，已通过本地配置持久化保持：', err)
  }
  return location
}

export async function setAgencySidebarEntry(ctx: Context, namespace: string, enabled: boolean): Promise<boolean> {
  if (typeof enabled !== 'boolean') throw new TypeError('enabled must be a boolean')
  await setAgencyEntryLocation(ctx, namespace, enabled ? 'both' : 'settings')
  return enabled
}

export async function setAgencyOnlineUpdate(ctx: Context, namespace: string, enabled: boolean): Promise<boolean> {
  if (typeof enabled !== 'boolean') throw new TypeError('enabled must be a boolean')
  const settings = (ctx as { settings?: LiveSettingsWriter }).settings
  const revision = settings?.describe?.().find((item) => item.ns === namespace)?.revision
  await writeLiveSettings(ctx, async () => {
    if (typeof settings?.mutate === 'function') {
      await settings.mutate(namespace, [{ op: 'set', path: ['onlineUpdate'], value: enabled }], revision)
    } else if (typeof settings?.update === 'function') {
      await settings.update(namespace, { onlineUpdate: enabled }, revision)
    }
  })
  return enabled
}

export async function setAgencyComposerRecommend(ctx: Context, namespace: string, enabled: boolean): Promise<boolean> {
  if (typeof enabled !== 'boolean') throw new TypeError('enabled must be a boolean')
  const settings = (ctx as { settings?: LiveSettingsWriter }).settings
  const revision = settings?.describe?.().find((item) => item.ns === namespace)?.revision
  await writeLiveSettings(ctx, async () => {
    if (typeof settings?.mutate === 'function') {
      await settings.mutate(namespace, [{ op: 'set', path: ['composerRecommend'], value: enabled }], revision)
    } else if (typeof settings?.update === 'function') {
      await settings.update(namespace, { composerRecommend: enabled }, revision)
    }
  })
  return enabled
}
