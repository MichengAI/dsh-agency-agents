import type { Context } from '@deepseek-ai/cordis'
import * as dshSettings from '@deepseek-ai/dsh-settings'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { validateAgencySettings, type AgencySettings } from './expert-library.js'

type SettingsSectionHooks<T> = {
  setSource(current: () => T): void
  onChange(): void
  validate?: (value: T) => void
}

type LegacySettingsModule = {
  settingsNamespace?: (value: string) => SettingsNamespace
  installSettingsSection?: <T>(
    ctx: Context,
    namespace: SettingsNamespace,
    schema: unknown,
    entry: T,
    hooks: SettingsSectionHooks<T>,
  ) => void
}

type AlphaSettingsService = {
  installSection<T>(
    owner: Context,
    namespace: SettingsNamespace,
    schema: unknown,
    entry: T,
    hooks: SettingsSectionHooks<T>,
  ): void
}

function moduleExport(module: object, name: string): unknown {
  return (module as Record<string, unknown>)[name]
}

/**
 * DSH 0.1.2-alpha.2 accepts validated plain namespace strings and removed the
 * legacy settingsNamespace export. Keep one runtime bridge so the same package
 * can still run on the current RC line.
 */
export function settingsNamespaceCompat(value: string, module: object = dshSettings): SettingsNamespace {
  const legacy = moduleExport(module, 'settingsNamespace')
  return typeof legacy === 'function'
    ? (legacy as (candidate: string) => SettingsNamespace)(value)
    : value as SettingsNamespace
}

let hostSettingsModule: object | undefined

/** 旧 RC 的模块助手必须从宿主入口解析。插件自己的依赖可能更旧，不能用来判断当前宿主。 */
function settingsModuleFromHost(): object {
  if (hostSettingsModule !== undefined) return hostSettingsModule
  const entry = process.argv[1]
  if (entry === undefined || entry === '') return hostSettingsModule = {}
  try {
    hostSettingsModule = createRequire(resolve(entry))('@deepseek-ai/dsh-settings') as object
  } catch {
    hostSettingsModule = {}
  }
  return hostSettingsModule
}

function installSectionMissing(locale: 'zh' | 'en'): string {
  return locale === 'en'
    ? 'This DSH settings service has no installSection.'
    : '当前 DSH settings 服务不支持 installSection。'
}

/**
 * RC releases expose installSettingsSection as a module helper. Alpha.2 moved
 * the same owner-scoped lifecycle wiring onto ctx.settings.installSection.
 * The running host context decides; a helper found only in this package does not.
 */
export function installSettingsSectionCompat<T>(
  ctx: Context,
  namespace: SettingsNamespace,
  schema: unknown,
  entry: T,
  hooks: SettingsSectionHooks<T>,
  module: object = settingsModuleFromHost(),
  locale: 'zh' | 'en' = 'zh',
): void {
  const settings = (ctx as Context & { settings?: AlphaSettingsService }).settings
  if (typeof settings?.installSection === 'function') {
    settings.installSection(ctx, namespace, schema, entry, hooks)
    return
  }
  const legacy = moduleExport(module, 'installSettingsSection')
  if (typeof legacy === 'function') {
    ;(legacy as NonNullable<LegacySettingsModule['installSettingsSection']>)(ctx, namespace, schema, entry, hooks)
    return
  }
  throw new Error(installSectionMissing(locale))
}

/** 0.1.6 及更早宿主仍通过 installSection 保存启用名单；0.1.7 已移除该接口。 */
export function hasLegacySettingsInstall(ctx: Context, module: object = settingsModuleFromHost()): boolean {
  const settings = (ctx as Context & { settings?: { installSection?: unknown } }).settings
  if (typeof settings?.installSection === 'function') return true
  return typeof moduleExport(module, 'installSettingsSection') === 'function'
}

/** 0.1.7 的 volatile 配置字段是带 get() 的稳定引用，读取时必须取当前快照。 */
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
export function readAgencySettings(config: object): AgencySettings {
  const record = config as {
    enabled?: unknown
    customExperts?: unknown
    customTeams?: unknown
    enabledTeams?: unknown
  }
  const value: AgencySettings = {
    enabled: stringList(unwrapLive(record.enabled)),
    customExperts: objectList(unwrapLive(record.customExperts)) as AgencySettings['customExperts'],
    customTeams: objectList(unwrapLive(record.customTeams)) as AgencySettings['customTeams'],
    enabledTeams: stringList(unwrapLive(record.enabledTeams)),
  }
  validateAgencySettings(value)
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

function profileHome(ctx: Context): string | undefined {
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
  const entry = process.argv[1]
  if (entry === undefined || entry === '') return undefined
  try {
    const yaml = createRequire(resolve(entry))('yaml') as { parse?: (source: string) => unknown }
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
    validateAgencySettings(section)
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
