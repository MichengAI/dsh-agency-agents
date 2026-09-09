import type { Context } from '@deepseek-ai/cordis'
import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PLUGIN_UPDATE_HEADER = 'x-michengai-plugin-update'
export const PLUGIN_UPDATE_IPC = 'apply-plugin-updates'

type HostRequest = { method?: string; url?: string; headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }
type HostResponse = { writeHead(status: number, headers?: Record<string, string>): void; end(body?: string): void }
type WebServer = { register(route: { kind: 'exact'; path: string; handler(request: HostRequest, response: HostResponse): Promise<void> }): () => void }
type DesktopPnpmHandle = { done: Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }>; cancel(): void }
type DesktopPnpm = { runPlugin(args: readonly string[], invokingDir: string, signal?: AbortSignal): DesktopPnpmHandle }
type UpdateContext = Context & { webServer: WebServer; get?(name: string): unknown }

export type PluginUpdaterOptions = { readonly endpoint: string; readonly packageName: string; readonly manifestUrl: URL }

type Runtime = { profileName: string; profileDir: string; desktopPnpm?: DesktopPnpm; cliEntry?: string }
type VersionPayload = {
  packageName: string
  currentVersion: string
  latestVersion?: string
  latestCheckFailed: boolean
  updateAvailable: boolean
  profileName: string
  canAutoUpdate: boolean
}

function header(request: HostRequest, name: string): string | undefined {
  const value = request.headers?.[name]
  return Array.isArray(value) ? value[0] : value
}

function isLoopbackAddress(value: string | undefined): boolean {
  const address = value?.toLowerCase().replace(/^\[|\]$/g, '')
  return address === 'localhost' || address === 'localhost.' || address === '::1'
    || address?.startsWith('127.') === true || address?.startsWith('::ffff:127.') === true
}

export function isTrustedUpdateRequest(request: HostRequest): boolean {
  if (header(request, PLUGIN_UPDATE_HEADER) !== '1') return false
  if (!isLoopbackAddress(request.socket?.remoteAddress)) return false
  const site = header(request, 'sec-fetch-site')
  if (site !== undefined && site !== 'same-origin') return false
  const origin = header(request, 'origin')
  const host = header(request, 'host')
  if (origin === undefined || host === undefined) return false
  try {
    const url = new URL(origin)
    return (url.protocol === 'http:' || url.protocol === 'https:') && isLoopbackAddress(url.hostname) && url.host === host
  } catch { return false }
}

function validProfileName(value: unknown): value is string {
  return typeof value === 'string' && value !== '' && value !== '.' && value !== '..'
    && !value.includes('/') && !value.includes('\\') && !/[\0-\x1f\x7f]/.test(value)
}

function profileNameFromArgv(argv: readonly string[]): string | undefined {
  for (let index = 2; index < argv.length; index += 1) {
    if (argv[index] === '--profile') return argv[index + 1]
    if (argv[index]?.startsWith('--profile=')) return argv[index]!.slice('--profile='.length)
  }
  return argv[2] === 'web' ? 'web' : undefined
}

export function isDshCliEntry(entry: string, manifest: unknown, packageRoot: string): boolean {
  if (typeof manifest !== 'object' || manifest === null) return false
  const value = manifest as { name?: unknown; bin?: unknown }
  if (value.name !== '@deepseek-ai/dsh') return false
  const bin = typeof value.bin === 'string'
    ? value.bin
    : typeof value.bin === 'object' && value.bin !== null
      ? (value.bin as { dsh?: unknown }).dsh
      : undefined
  return typeof bin === 'string' && bin !== '' && !isAbsolute(bin) && resolve(packageRoot, bin) === resolve(entry)
}

function cliEntry(): string | undefined {
  const value = process.argv[1]
  if (value === undefined || value === '') return undefined
  const entry = value.startsWith('file:') ? fileURLToPath(value) : resolve(process.cwd(), value)
  if (!existsSync(entry)) return undefined
  for (let directory = dirname(entry); ;) {
    const manifestPath = resolve(directory, 'package.json')
    if (existsSync(manifestPath)) {
      try {
        if (isDshCliEntry(entry, JSON.parse(readFileSync(manifestPath, 'utf8')), directory)) return entry
      } catch {
        // Keep searching parent directories when a package manifest is unreadable.
      }
    }
    const parent = dirname(directory)
    if (parent === directory) return undefined
    directory = parent
  }
}

function runtime(ctx: UpdateContext): Runtime {
  const profiles = ctx.get?.('desktopProfiles') as { current?: { name?: unknown; dir?: unknown } } | undefined
  const desktopPnpm = ctx.get?.('desktopPnpm') as DesktopPnpm | undefined
  if (profiles?.current !== undefined) {
    const current = profiles.current
    if (!validProfileName(current.name) || typeof current.dir !== 'string' || !isAbsolute(current.dir)) {
      throw new Error('当前 Desktop Profile 信息无效，请重启后重试。')
    }
    return { profileName: current.name, profileDir: resolve(current.dir), ...(typeof desktopPnpm?.runPlugin === 'function' ? { desktopPnpm } : {}) }
  }
  const profileDir = resolve(process.env.DSH_PROFILE_DIR ?? resolve(homedir(), '.dsh', 'profiles', 'web'))
  const selected = profileNameFromArgv(process.argv)
  const profileName = validProfileName(selected) ? selected : validProfileName(basename(profileDir)) ? basename(profileDir) : 'web'
  const entry = cliEntry()
  return { profileName, profileDir, ...(entry === undefined ? {} : { cliEntry: entry }) }
}

type Semver = { core: readonly [number, number, number]; prerelease: readonly string[] }
function parseSemver(value: string): Semver | undefined {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value)
  if (match === null) return undefined
  return { core: [Number(match[1]), Number(match[2]), Number(match[3])], prerelease: match[4]?.split('.') ?? [] }
}

export function isNewerVersion(currentValue: string, candidateValue: string): boolean {
  const current = parseSemver(currentValue)
  const candidate = parseSemver(candidateValue)
  if (current === undefined || candidate === undefined) return false
  for (let index = 0; index < 3; index += 1) {
    if (candidate.core[index] !== current.core[index]) return candidate.core[index]! > current.core[index]!
  }
  return comparePrerelease(candidate.prerelease, current.prerelease) > 0
}

function comparePrerelease(left: readonly string[], right: readonly string[]): number {
  if (left.length === 0 || right.length === 0) return left.length === right.length ? 0 : left.length === 0 ? 1 : -1
  const length = Math.max(left.length, right.length)
  for (let index = 0; index < length; index += 1) {
    const a = left[index]
    const b = right[index]
    if (a === undefined || b === undefined) return a === b ? 0 : a === undefined ? -1 : 1
    if (a === b) continue
    const aNumeric = /^\d+$/.test(a)
    const bNumeric = /^\d+$/.test(b)
    if (aNumeric && bNumeric) {
      const aNumber = BigInt(a)
      const bNumber = BigInt(b)
      if (aNumber !== bNumber) return aNumber > bNumber ? 1 : -1
      continue
    }
    if (aNumeric !== bNumeric) return aNumeric ? -1 : 1
    return a > b ? 1 : -1
  }
  return 0
}

let latestCache: { packageName: string; version: string; expiresAt: number } | undefined
async function latestVersion(packageName: string): Promise<string | undefined> {
  if (latestCache?.packageName === packageName && Date.now() < latestCache.expiresAt) return latestCache.version
  try {
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`, { signal: AbortSignal.timeout(8_000) })
    if (!response.ok) return undefined
    const value = await response.json() as { version?: unknown }
    if (typeof value.version !== 'string' || value.version === '') return undefined
    latestCache = { packageName, version: value.version, expiresAt: Date.now() + 5 * 60_000 }
    return value.version
  } catch { return undefined }
}

async function currentVersion(manifestUrl: URL): Promise<string> {
  const value = JSON.parse(await readFile(manifestUrl, 'utf8')) as { version?: unknown }
  if (typeof value.version !== 'string' || value.version === '') throw new Error('无法读取当前插件版本。')
  return value.version
}

async function status(options: PluginUpdaterOptions, target: Runtime): Promise<VersionPayload> {
  const current = await currentVersion(options.manifestUrl)
  const latest = await latestVersion(options.packageName)
  return {
    packageName: options.packageName,
    currentVersion: current,
    ...(latest === undefined ? {} : { latestVersion: latest }),
    latestCheckFailed: latest === undefined,
    updateAvailable: latest !== undefined && isNewerVersion(current, latest),
    profileName: target.profileName,
    canAutoUpdate: target.desktopPnpm !== undefined || target.cliEntry !== undefined,
  }
}

async function runCliInstall(target: Runtime, packageSpec: string): Promise<void> {
  if (target.cliEntry === undefined) throw new Error('当前环境不支持自动更新，请使用手工更新命令。')
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(process.execPath, [target.cliEntry!, 'plugin', '--profile', target.profileName, 'add', '--config.minimumReleaseAge=0', packageSpec, '--registry=https://registry.npmjs.org/'], {
      cwd: target.profileDir, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, NO_COLOR: '1' },
    })
    let detail = ''
    child.stdout?.on('data', chunk => { detail = (detail + String(chunk)).slice(-4_000) })
    child.stderr?.on('data', chunk => { detail = (detail + String(chunk)).slice(-4_000) })
    const timer = setTimeout(() => { child.kill(); reject(new Error('更新超时，请改用手工更新。')) }, 10 * 60_000)
    child.once('error', error => { clearTimeout(timer); reject(error) })
    child.once('exit', code => {
      clearTimeout(timer)
      if (code === 0) resolvePromise()
      else reject(new Error(detail.trim() || `更新进程退出码 ${String(code)}`))
    })
  })
}

async function install(target: Runtime, packageSpec: string): Promise<void> {
  if (target.desktopPnpm === undefined) return runCliInstall(target, packageSpec)
  const handle = target.desktopPnpm.runPlugin(['add', '--config.minimumReleaseAge=0', packageSpec, '--registry=https://registry.npmjs.org/'], target.profileDir)
  const result = await handle.done
  if (result.exitCode !== 0) throw new Error(`更新进程退出码 ${String(result.exitCode)}。`)
}

function json(response: HostResponse, statusCode: number, value: unknown): void {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  response.end(JSON.stringify(value))
}

function publicError(error: unknown): string {
  const message = error instanceof Error ? error.message : '更新暂不可用。'
  return /[A-Za-z]:[\\/]|\/(?:home|root|Users|var|tmp)\//.test(message) ? '更新失败，请查看服务端日志。' : message
}

export function registerPluginUpdater(ctx: Context, options: PluginUpdaterOptions): () => void {
  const host = ctx as UpdateContext
  let installing = false
  return host.webServer.register({
    kind: 'exact', path: options.endpoint,
    handler: async (request, response) => {
      try {
        const target = runtime(host)
        if (request.method === 'GET' || request.method === 'HEAD') {
          const payload = await status(options, target)
          response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          response.end(request.method === 'HEAD' ? undefined : JSON.stringify(payload))
          return
        }
        if (request.method !== 'POST') { response.writeHead(405, { allow: 'GET, HEAD, POST' }); response.end(); return }
        if (!isTrustedUpdateRequest(request)) { json(response, 403, { error: '已拒绝非本机同源更新请求。' }); return }
        if (installing) { json(response, 409, { error: '当前插件正在更新，请稍候。' }); return }
        // 查询版本也属于更新事务；先占锁，避免多窗口同时进入安装。
        installing = true
        try {
          const before = await status(options, target)
          if (before.latestVersion === undefined) { json(response, 503, { error: '暂时无法获取最新版本。' }); return }
          if (!before.updateAvailable) { json(response, 200, before); return }
          await install(target, `${options.packageName}@${before.latestVersion}`)
          const notifyParent = target.desktopPnpm === undefined && typeof process.send === 'function'
          const autoReload = target.desktopPnpm !== undefined || notifyParent
          json(response, 200, { ...before, updatedVersion: before.latestVersion, restartRequired: true, autoReload })
          if (notifyParent) setTimeout(() => { process.send?.(PLUGIN_UPDATE_IPC) }, 150).unref?.()
        } finally { installing = false }
      } catch (error) {
        ctx.logger.warn(`plugin updater failed: ${String(error)}`)
        json(response, 503, { error: publicError(error) })
      }
    },
  })
}
