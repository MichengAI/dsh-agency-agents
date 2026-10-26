import { describe, it, expect, vi } from 'vitest'
import { apply } from './index.js'
import type { Context } from '@deepseek-ai/cordis'

describe('agency-agents HTTP 管理路由 (sidebar-entry & online-update)', () => {
  function setupHarness(configOverrides: Record<string, unknown> = {}, extraCtx: Record<string, unknown> = {}) {
    const routes = new Map<string, (req: any, res: any) => Promise<void>>()
    const mockSettingsState: Record<string, any> = {
      enabled: [],
      customExperts: [],
      customTeams: [],
      enabledTeams: [],
    }

    const VOLATILE_PATHS = new Set(['enabled', 'customExperts', 'customTeams', 'enabledTeams', 'sidebarEntry', 'onlineUpdate', 'composerRecommend'])

    const mockCtx = {
      webServer: {
        register: vi.fn((route: { path: string; handler: (req: any, res: any) => Promise<void> }) => {
          routes.set(route.path, route.handler)
          return () => { routes.delete(route.path) }
        }),
      },
      settings: {
        describe: () => [{ ns: 'agency-agents', revision: 1 }],
        mutate: vi.fn(async (_ns: string, ops: any[]) => {
          for (const op of ops) {
            if (op.op === 'set') {
              const field = op.path[0]
              if (!VOLATILE_PATHS.has(field)) {
                throw new Error(`Host rejected mutation on non-volatile path: ${field}`)
              }
              mockSettingsState[field] = op.value
            }
          }
        }),
        configure: vi.fn(),
      },
      subagents: {},
      systemPrompt: { section: vi.fn() },
      tools: { register: vi.fn() },
      reflect: { provide: vi.fn() },
      effect: vi.fn((fn: () => any) => fn()),
      on: vi.fn(),
      get: vi.fn((name: string) => (extraCtx as any)[name]),
      logger: { warn: vi.fn() },
    } as unknown as Context

    const config = {
      root: '',
      provider: 'spawn',
      divisions: [],
      enabled: { get: () => mockSettingsState.enabled },
      customExperts: { get: () => mockSettingsState.customExperts },
      customTeams: { get: () => mockSettingsState.customTeams },
      enabledTeams: { get: () => mockSettingsState.enabledTeams },
      sidebarEntry: { get: () => mockSettingsState.sidebarEntry },
      onlineUpdate: { get: () => mockSettingsState.onlineUpdate },
      composerRecommend: { get: () => mockSettingsState.composerRecommend },
      ...configOverrides,
    }

    apply(mockCtx, config as any)

    return { routes, mockSettingsState, mockCtx }
  }

  function mockRequest(method: string, bodyObj?: unknown, headers: Record<string, string> = {}) {
    const bodyStr = bodyObj !== undefined ? (typeof bodyObj === 'string' ? bodyObj : JSON.stringify(bodyObj)) : ''
    const defaultHeaders = method === 'POST' ? {
      'x-michengai-client': '1',
      'content-type': 'application/json',
    } : {}
    const listeners: Record<string, Function[]> = {}
    return {
      method,
      headers: { ...defaultHeaders, ...headers },
      resume: vi.fn(),
      destroy: vi.fn(() => {
        for (const cb of listeners['close'] ?? []) cb()
      }),
      on: (event: string, cb: Function) => {
        listeners[event] = listeners[event] ?? []
        listeners[event].push(cb)
        if (event === 'data' && bodyStr) cb(Buffer.from(bodyStr))
        if (event === 'end') cb()
      },
    }
  }

  function mockResponse() {
    let status = 0
    let headers: Record<string, string> = {}
    let body = ''
    return {
      writeHead: (s: number, h?: Record<string, string>) => {
        status = s
        if (h) headers = { ...headers, ...h }
      },
      end: (b?: string) => {
        if (b) body = b
      },
      get status() { return status },
      get body() { return body },
      get json() { return body ? JSON.parse(body) : null },
    }
  }

  it('sidebar-entry GET 与 POST 正常更新持久化', async () => {
    const { routes, mockSettingsState } = setupHarness()
    const handler = routes.get('/api/michengai/dsh-agency-agents/sidebar-entry')
    expect(handler).toBeDefined()

    // 1. GET 默认状态
    const getRes = mockResponse()
    await handler!(mockRequest('GET'), getRes)
    expect(getRes.status).toBe(200)
    expect(getRes.json).toEqual({ ok: true, enabled: false })

    // 2. POST 开启
    const postRes1 = mockResponse()
    await handler!(mockRequest('POST', { enabled: true }), postRes1)
    expect(postRes1.status).toBe(200)
    expect(postRes1.json).toEqual({ ok: true, enabled: true })
    expect(mockSettingsState.sidebarEntry).toBe(true)

    // 3. POST 非法参数校验
    const postResInvalid = mockResponse()
    await handler!(mockRequest('POST', { enabled: 'invalid' }), postResInvalid)
    expect(postResInvalid.status).toBe(400)

    // 4. GET 确认最新值
    const getRes2 = mockResponse()
    await handler!(mockRequest('GET'), getRes2)
    expect(getRes2.json).toEqual({ ok: true, enabled: true })
  })

  it('online-update GET 与 POST 正常更新持久化', async () => {
    const { routes, mockSettingsState } = setupHarness()
    const handler = routes.get('/api/michengai/dsh-agency-agents/online-update')
    expect(handler).toBeDefined()

    // 1. GET 默认状态
    const getRes = mockResponse()
    await handler!(mockRequest('GET'), getRes)
    expect(getRes.status).toBe(200)
    expect(getRes.json).toEqual({ ok: true, enabled: true, locked: false })

    // 2. POST 关闭
    const postRes1 = mockResponse()
    await handler!(mockRequest('POST', { enabled: false }), postRes1)
    expect(postRes1.status).toBe(200)
    expect(postRes1.json).toEqual({ ok: true, enabled: false })
    expect(mockSettingsState.onlineUpdate).toBe(false)

    // 3. GET 确认最新值
    const getRes2 = mockResponse()
    await handler!(mockRequest('GET'), getRes2)
    expect(getRes2.json).toEqual({ ok: true, enabled: false, locked: false })
  })

  it('安全防护：缺少 x-michengai-client 标记头应返回 403，非法 Content-Type 返回 415，超限返回 413', async () => {
    const { routes } = setupHarness()
    const handler = routes.get('/api/michengai/dsh-agency-agents/sidebar-entry')

    // 缺少 x-michengai-client
    const resNoHeader = mockResponse()
    await handler!(mockRequest('POST', { enabled: true }, { 'x-michengai-client': '' }), resNoHeader)
    expect(resNoHeader.status).toBe(403)

    // 非法 Content-Type
    const resBadType = mockResponse()
    await handler!(mockRequest('POST', { enabled: true }, { 'content-type': 'text/plain' }), resBadType)
    expect(resBadType.status).toBe(415)

    // 超限 body (>64KB)
    const bigPayload = 'x'.repeat(65 * 1024)
    const resOversized = mockResponse()
    await handler!(mockRequest('POST', bigPayload), resOversized)
    expect(resOversized.status).toBe(413)
  })

  it('宿主 connection.requestRejection 认证拦截测试', async () => {
    const { routes } = setupHarness({}, {
      connection: { requestRejection: () => 401 },
    })
    const handler = routes.get('/api/michengai/dsh-agency-agents/sidebar-entry')

    const res = mockResponse()
    await handler!(mockRequest('GET'), res)
    expect(res.status).toBe(401)
  })

  it('宿主配置锁定 updater: false 时，online-update 拒绝修改并返回 403', async () => {
    const { routes } = setupHarness({ updater: false })
    const handler = routes.get('/api/michengai/dsh-agency-agents/online-update')
    expect(handler).toBeDefined()

    // 1. GET 提示 locked: true
    const getRes = mockResponse()
    await handler!(mockRequest('GET'), getRes)
    expect(getRes.status).toBe(200)
    expect(getRes.json).toEqual({ ok: true, enabled: false, locked: true })

    // 2. POST 尝试修改返回 403
    const postRes = mockResponse()
    await handler!(mockRequest('POST', { enabled: true }), postRes)
    expect(postRes.status).toBe(403)
    expect(postRes.json.ok).toBe(false)
  })

  it('composer-recommend GET 与 POST 默认关闭并支持持久化更新', async () => {
    const { routes, mockSettingsState } = setupHarness()
    const handler = routes.get('/api/michengai/dsh-agency-agents/composer-recommend')
    expect(handler).toBeDefined()

    // 1. GET 默认返回 enabled: false
    const getRes = mockResponse()
    await handler!(mockRequest('GET'), getRes)
    expect(getRes.status).toBe(200)
    expect(getRes.json).toEqual({ ok: true, enabled: false })

    // 2. POST 开启 composerRecommend
    const postRes = mockResponse()
    await handler!(mockRequest('POST', { enabled: true }), postRes)
    expect(postRes.status).toBe(200)
    expect(postRes.json).toEqual({ ok: true, enabled: true })
    expect(mockSettingsState.composerRecommend).toBe(true)

    // 3. 再次 GET 验证已更新为 true
    const getRes2 = mockResponse()
    await handler!(mockRequest('GET'), getRes2)
    expect(getRes2.status).toBe(200)
    expect(getRes2.json).toEqual({ ok: true, enabled: true })
  })

  it('请求流中途异常 close 时立即终止不挂起', async () => {
    const { routes } = setupHarness()
    const handler = routes.get('/api/michengai/dsh-agency-agents/sidebar-entry')
    const listeners: Record<string, Function[]> = {}
    const abortingReq = {
      method: 'POST',
      headers: { 'x-michengai-client': '1', 'content-type': 'application/json' },
      on: (event: string, cb: Function) => {
        listeners[event] = listeners[event] ?? []
        listeners[event].push(cb)
      },
    }
    const res = mockResponse()
    const promise = handler!(abortingReq, res)
    for (const cb of listeners['close'] ?? []) cb()
    await promise
    expect(res.status).toBe(400)
    expect(res.json.error).toBe('connection closed')
  })
})
