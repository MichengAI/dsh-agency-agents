import type { Context } from '@deepseek-ai/cordis'
import * as dshSettings from '@deepseek-ai/dsh-settings'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'

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

/**
 * RC releases expose installSettingsSection as a module helper. Alpha.2 moved
 * the same owner-scoped lifecycle wiring onto ctx.settings.installSection.
 */
export function installSettingsSectionCompat<T>(
  ctx: Context,
  namespace: SettingsNamespace,
  schema: unknown,
  entry: T,
  hooks: SettingsSectionHooks<T>,
  module: object = dshSettings,
): void {
  const legacy = moduleExport(module, 'installSettingsSection')
  if (typeof legacy === 'function') {
    ;(legacy as NonNullable<LegacySettingsModule['installSettingsSection']>)(ctx, namespace, schema, entry, hooks)
    return
  }

  const settings = (ctx as Context & { settings?: AlphaSettingsService }).settings
  if (settings === undefined || typeof settings.installSection !== 'function') {
    throw new Error('当前 DSH settings 服务不支持 installSection。')
  }
  settings.installSection(ctx, namespace, schema, entry, hooks)
}
