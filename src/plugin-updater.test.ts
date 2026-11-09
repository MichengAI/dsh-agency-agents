import { readFile } from 'node:fs/promises'
import { describe, expect, it, vi } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import { registerPluginUpdater, isDshCliEntry, isNewerVersion, isTrustedUpdateRequest, PLUGIN_UPDATE_HEADER, resolveUpdateRuntime, shouldNotifyParent } from './plugin-updater.js'

describe('独立插件更新', () => {
  it('英文宿主中的配置错误和请求拒绝不会泄漏中文', async () => {
    let handler!: (request: unknown, response: unknown) => Promise<void>
    let invalid = true
    const ctx = {
      settings: { get: () => ({ preference: 'en' }) },
      get: (name: string) => name === 'desktopProfiles' ? { current: { name: 'web', dir: invalid ? '' : process.cwd() } } : undefined,
      webServer: { register: (route: { handler: typeof handler }) => { handler = route.handler; return () => {} } },
      logger: { warn: vi.fn() },
    } as unknown as Context
    registerPluginUpdater(ctx, { endpoint: '/test', packageName: 'test', manifestUrl: new URL('../package.json', import.meta.url) })
    const response = { writeHead: vi.fn(), end: vi.fn() }
    await handler({ method: 'GET' }, response)
    expect(JSON.parse(response.end.mock.lastCall![0]).error).not.toMatch(/[\u3400-\u9fff]/u)
    invalid = false
    await handler({ method: 'POST' }, response)
    expect(JSON.parse(response.end.mock.lastCall![0]).error).not.toMatch(/[\u3400-\u9fff]/u)
    expect(response.writeHead).toHaveBeenLastCalledWith(403, expect.any(Object))
  })
  it('只把更高 semver 识别为更新', () => {
    expect(isNewerVersion('0.1.32', '0.1.33')).toBe(true)
    expect(isNewerVersion('0.1.32', '0.1.32')).toBe(false)
    expect(isNewerVersion('0.2.0', '0.1.99')).toBe(false)
    expect(isNewerVersion('0.1.0-rc.2', '0.1.0-rc.10')).toBe(true)
    expect(isNewerVersion('0.1.0-rc.10', '0.1.0-rc.2')).toBe(false)
  })

  it('自动更新必须同时满足专用请求头与同源约束', () => {
    expect(isTrustedUpdateRequest({ headers: { [PLUGIN_UPDATE_HEADER]: '1', origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' }, socket: { remoteAddress: '127.0.0.1' } })).toBe(true)
    expect(isTrustedUpdateRequest({ headers: { origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' } })).toBe(false)
    expect(isTrustedUpdateRequest({ headers: { [PLUGIN_UPDATE_HEADER]: '1', 'sec-fetch-site': 'cross-site' } })).toBe(false)
    expect(isTrustedUpdateRequest({ headers: { [PLUGIN_UPDATE_HEADER]: '1', host: '127.0.0.1:19387' }, socket: { remoteAddress: '127.0.0.1' } })).toBe(true)
    expect(isTrustedUpdateRequest({ headers: { [PLUGIN_UPDATE_HEADER]: '1', host: 'example.com' }, socket: { remoteAddress: '127.0.0.1' } })).toBe(false)
    expect(isTrustedUpdateRequest({ headers: { [PLUGIN_UPDATE_HEADER]: '1', origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' }, socket: { remoteAddress: '192.168.1.8' } })).toBe(false)
  })

  it('只把 DSH 自身声明的 CLI 入口视为自动更新能力', () => {
    const packageRoot = 'C:/tools/dsh'
    const entry = 'C:/tools/dsh/lib/bin.js'
    expect(isDshCliEntry(entry, { name: '@deepseek-ai/dsh', bin: { dsh: 'lib/bin.js' } }, packageRoot)).toBe(true)
    expect(isDshCliEntry(entry, { name: '@deepseek-ai/dsh', bin: 'lib/bin.js' }, packageRoot)).toBe(true)
    expect(isDshCliEntry(entry, { name: '@deepseek-ai/dsh', bin: { dsh: 'lib/other.js' } }, packageRoot)).toBe(false)
    expect(isDshCliEntry(entry, { name: 'other-cli', bin: { dsh: 'lib/bin.js' } }, packageRoot)).toBe(false)
  })

  it('Host 端声明标准更新端点', async () => {
    const host = await readFile(new URL('./index.ts', import.meta.url), 'utf8')
    expect(host).toMatch(/endpoint:\s*["']\/api\/michengai\/dsh-agency-agents\/update["']/)
    expect(await readFile(new URL('./plugin-updater.ts', import.meta.url), 'utf8')).toContain('const notifyParent = shouldNotifyParent(target)')
    expect(await readFile(new URL('./plugin-updater.ts', import.meta.url), 'utf8')).toContain('isDshCliEntry')
  })

  it('官方 Desktop 在线更新指向 desktop profile，且不通知父进程', () => {
    const runtime = resolveUpdateRuntime({
      get(name: string) {
        if (name === 'profileContext') return {
          name: 'desktop',
          dir: 'D:\\profile\\desktop',
          packageManager: { command: 'D:/Tools/DeepSeek Harness/DeepSeek Harness.exe', args: ['--expose-internals', 'D:/runtime/pnpm.mjs'], env: { ELECTRON_RUN_AS_NODE: '1' } },
        }
        return undefined
      },
    }, {
      argv: ['node', 'D:/app/dsh/node_modules/@deepseek-ai/dsh-desktop-host/lib/index.js', 'D:/runtime', 'D:/profile/desktop'],
      env: {},
      cwd: 'D:\\profile\\desktop',
      homeDir: 'C:\\Users\\YUJIYU',
    })
    expect(runtime.profileName).toBe('desktop')
    expect(runtime.officialDesktop).toBe(true)
    expect(runtime.canAutoUpdate).toBe(true)
    expect(shouldNotifyParent(runtime, () => {})).toBe(false)
  })
})


it('查询版本期间拒绝第二次更新，失败后允许重试', async () => {
  let handler!: (request: unknown, response: unknown) => Promise<void>
  let release!: (response: Response) => void
  const version = new Promise<Response>(resolve => { release = resolve })
  const fetchMock = vi.fn(() => version)
  vi.stubGlobal('fetch', fetchMock)
  const runPlugin = vi.fn(() => ({ done: Promise.resolve({ exitCode: 0, signal: null }), cancel() {} }))
  const ctx = {
    get: (name: string) => name === 'desktopProfiles'
      ? { current: { name: 'web', dir: process.cwd() } } : { runPlugin },
    webServer: { register: (route: { handler: typeof handler }) => { handler = route.handler; return () => {} } },
    logger: { warn: vi.fn() },
  } as unknown as Context
  registerPluginUpdater(ctx, { endpoint: '/test', packageName: 'review-update-lock', manifestUrl: new URL('../package.json', import.meta.url) })
  const request = { method: 'POST', headers: { [PLUGIN_UPDATE_HEADER]: '1', origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' }, socket: { remoteAddress: '127.0.0.1' } }
  const response = () => ({ writeHead: vi.fn(), end: vi.fn() })
  const firstResponse = response(), secondResponse = response()
  const first = handler(request, firstResponse)
  let second: Promise<void> | undefined
  try {
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    second = handler(request, secondResponse)
    await vi.waitFor(() => expect(secondResponse.writeHead).toHaveBeenCalledWith(409, expect.any(Object)))
    expect(runPlugin).not.toHaveBeenCalled()
  } finally {
    release(new Response('{}', { status: 503 }))
    await Promise.all([first, second])
    vi.unstubAllGlobals()
  }
  expect(firstResponse.writeHead).toHaveBeenCalledWith(503, expect.any(Object))
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ version: '99.0.0' }))))
  try {
    const retried = response()
    await handler(request, retried)
    expect(retried.writeHead).toHaveBeenCalledWith(200, expect.any(Object))
    expect(runPlugin).toHaveBeenCalledTimes(1)
  } finally { vi.unstubAllGlobals() }
})

it('isEnabled 返回 false 时拦截 GET 与 POST 请求并返回 403', async () => {
  let handler!: (request: unknown, response: unknown) => Promise<void>
  const ctx = {
    get: () => undefined,
    webServer: { register: (route: { handler: typeof handler }) => { handler = route.handler; return () => {} } },
    logger: { warn: vi.fn() },
  } as unknown as Context
  registerPluginUpdater(ctx, {
    endpoint: '/test-disabled',
    packageName: 'test-package',
    manifestUrl: new URL('../package.json', import.meta.url),
    isEnabled: () => false,
  })
  const response = () => ({ writeHead: vi.fn(), end: vi.fn() })
  const getRes = response()
  await handler({ method: 'GET' }, getRes)
  expect(getRes.writeHead).toHaveBeenCalledWith(403, expect.any(Object))

  const postRes = response()
  await handler({ method: 'POST', headers: { [PLUGIN_UPDATE_HEADER]: '1' } }, postRes)
  expect(postRes.writeHead).toHaveBeenCalledWith(403, expect.any(Object))
})
