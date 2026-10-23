import { describe, it, expect, vi } from 'vitest'
import { setupSidebarEntry } from './client/bundle-config.js'

describe('setupSidebarEntry 侧边栏与更新开关生命周期', () => {
  function createMockCtx() {
    const slotsMap = new Map<string, { meta: any; component: any }>()
    const injectCallbacks: Record<string, Function> = {}

    const ctx = {
      locale: {
        bind: () => (key: string) => key,
      },
      slots: {
        register: vi.fn((meta: any, component: any) => {
          const key = meta.name
          slotsMap.set(key, { meta, component })
          return () => {
            slotsMap.delete(key)
          }
        }),
        inject: vi.fn((slotName: string, cb: Function) => {
          injectCallbacks[slotName] = cb
        }),
      },
      inject: vi.fn((deps: string[], cb: Function) => {
        if (deps.includes('layout')) {
          cb({ layout: mockLayout })
        }
      }),
    }

    const mockLayout = {
      panelInfo: {
        getSnapshot: vi.fn(() => ({ activePanelId: 'agency-agents' })),
      },
      selectPanel: vi.fn(),
    }

    return { ctx, slotsMap, injectCallbacks, mockLayout }
  }

  it('初始状态拉取 API 并同步开关', async () => {
    const { ctx, slotsMap, injectCallbacks } = createMockCtx()
    let serverSidebar = false
    let serverUpdate = true

    const callApi = vi.fn(async (path: string, options?: any) => {
      if (path === '/api/michengai/dsh-agency-agents/sidebar-entry') {
        if (options?.method === 'POST') {
          serverSidebar = JSON.parse(options.body).enabled
          return { ok: true, enabled: serverSidebar }
        }
        return { ok: true, enabled: serverSidebar }
      }
      if (path === '/api/michengai/dsh-agency-agents/online-update') {
        if (options?.method === 'POST') {
          serverUpdate = JSON.parse(options.body).enabled
          return { ok: true, enabled: serverUpdate }
        }
        return { ok: true, enabled: serverUpdate, locked: false }
      }
      throw new Error(`Unexpected path: ${path}`)
    })

    const controller = setupSidebarEntry(ctx as any, {
      callApi,
      renderPanel: () => null,
      ns: 'agency',
    })

    // 默认关闭
    expect(controller.isEnabled()).toBe(false)
    expect(controller.isOnlineUpdateEnabled()).toBe(true)
    expect(controller.isOnlineUpdateLocked()).toBe(false)

    // 模拟 slots 注入通知
    if (injectCallbacks['plugins.bundle.config']) {
      injectCallbacks['plugins.bundle.config']()
    }
    expect(slotsMap.has('plugins.bundle.config')).toBe(true)

    // 开启侧边栏入口
    if (injectCallbacks['sidebar.panellist']) {
      injectCallbacks['sidebar.panellist']()
    }
    await controller.setEnabled(true)
    expect(controller.isEnabled()).toBe(true)
    expect(slotsMap.has('sidebar.panellist')).toBe(true)
    expect(slotsMap.has('main')).toBe(true)

    // 关闭侧边栏入口，验证防白屏切回默认视图
    await controller.setEnabled(false)
    expect(controller.isEnabled()).toBe(false)
    expect(slotsMap.has('sidebar.panellist')).toBe(false)
    expect(slotsMap.has('main')).toBe(false)

    controller.destroy()
  })

  it('感知宿主锁定更新状态并拒绝修改', async () => {
    const { ctx } = createMockCtx()
    const callApi = vi.fn(async (path: string) => {
      if (path === '/api/michengai/dsh-agency-agents/sidebar-entry') return { ok: true, enabled: false }
      if (path === '/api/michengai/dsh-agency-agents/online-update') return { ok: true, enabled: false, locked: true }
      return {}
    })

    const controller = setupSidebarEntry(ctx as any, {
      callApi,
      renderPanel: () => null,
      ns: 'agency',
    })

    await vi.waitFor(() => expect(controller.isOnlineUpdateLocked()).toBe(true))
    expect(controller.isOnlineUpdateEnabled()).toBe(false)

    // 尝试开启，因 locked 保持 false 且不发起 POST 请求
    await controller.setOnlineUpdate(true)
    expect(controller.isOnlineUpdateEnabled()).toBe(false)
    expect(callApi).not.toHaveBeenCalledWith(
      '/api/michengai/dsh-agency-agents/online-update',
      expect.objectContaining({ method: 'POST' }),
    )

    controller.destroy()
  })
})
