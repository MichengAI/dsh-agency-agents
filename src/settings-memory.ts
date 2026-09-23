import type { SettingsPathOp } from '@deepseek-ai/dsh-settings'

type SettingsSchema = (value: any) => unknown
type SettingsValidate = (value: any) => void

interface Registration {
  schema: SettingsSchema
  base?: unknown
  validate?: SettingsValidate
  resolved: unknown
  revision: number
}

interface SectionHooks {
  setSource(current: () => unknown): void
  onChange(): void
  validate?: SettingsValidate
}

/** 0.1.7 已移除 SettingsProvider。测试只保留插件实际依赖的注册、修订号和持久化语义。 */
export class MemorySettings {
  readonly writable = true
  disk: Record<string, unknown> = {}
  fail = false
  private document: Record<string, unknown> = {}
  private readonly registrations = new Map<string, Registration>()
  private readonly queues = new Map<string, Promise<void>>()

  constructor(ctx?: object) {
    if (ctx !== undefined) {
      Object.defineProperty(ctx, 'settings', { value: this, configurable: true, writable: true })
    }
  }

  restore(document: Record<string, unknown>): void {
    this.document = structuredClone(document)
    for (const [ns, registration] of this.registrations) {
      registration.resolved = this.resolve(registration, this.section(ns))
    }
  }

  register(ns: string, schema: SettingsSchema, options?: { base?: unknown; validate?: SettingsValidate }): void {
    const registration: Registration = {
      schema,
      base: options?.base,
      validate: options?.validate,
      resolved: undefined,
      revision: 0,
    }
    registration.resolved = this.resolve(registration, this.section(ns))
    this.registrations.set(ns, registration)
  }

  installSection(_owner: unknown, ns: string, schema: SettingsSchema, entry: unknown, hooks: SectionHooks): void {
    this.register(ns, schema, { base: entry, validate: hooks.validate })
    hooks.setSource(() => this.get(ns))
    hooks.onChange()
  }

  get(ns: string): unknown {
    return this.registrations.get(ns)?.resolved
  }

  describe(): Array<{ ns: string; revision: number }> {
    return [...this.registrations.entries()].map(([ns, registration]) => ({ ns, revision: registration.revision }))
  }

  mutate(ns: string, ops: readonly SettingsPathOp[], expectedRevision?: number): Promise<void> {
    const previous = this.queues.get(ns) ?? Promise.resolve()
    const run = previous.catch(() => undefined).then(async () => {
      const registration = this.registrations.get(ns)
      if (registration === undefined) throw new Error(`settings namespace "${ns}" is not registered`)
      if (expectedRevision !== undefined && expectedRevision !== registration.revision) {
        throw new Error(`settings conflict: expected ${expectedRevision}, actual ${registration.revision}`)
      }
      const section = { ...(this.section(ns) ?? {}) }
      for (const op of ops) applyPath(section, op)
      const next = this.resolve(registration, section)
      await this.persist(ns, section)
      this.document[ns] = section
      registration.resolved = next
      registration.revision += 1
    })
    this.queues.set(ns, run)
    return run
  }

  protected async persist(ns: string, section: Record<string, unknown>): Promise<void> {
    if (this.fail) throw new Error('disk full')
    this.disk[ns] = structuredClone(section)
  }

  private section(ns: string): Record<string, unknown> | undefined {
    const section = this.document[ns]
    if (section === undefined) return undefined
    if (section === null || typeof section !== 'object' || Array.isArray(section)) {
      throw new TypeError(`settings section "${ns}" must be an object`)
    }
    return section as Record<string, unknown>
  }

  private resolve(registration: Registration, section: Record<string, unknown> | undefined): unknown {
    const value = registration.schema({ ...(registration.base as object ?? {}), ...(section ?? {}) })
    registration.validate?.(value)
    return value
  }
}

function applyPath(section: Record<string, unknown>, op: SettingsPathOp): void {
  const [head, ...rest] = op.path
  if (head === undefined) return
  if (rest.length === 0) {
    if (op.op === 'unset') delete section[head]
    else section[head] = op.value
    return
  }
  const child = section[head]
  const next = child !== null && typeof child === 'object' && !Array.isArray(child)
    ? child as Record<string, unknown>
    : {}
  section[head] = next
  applyPath(next, { ...op, path: rest })
}
