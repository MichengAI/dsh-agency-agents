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

    const callApi = vi.fn(async (path: string, options?: any) => {
      if (path === '/api/michengai/dsh-agency-agents/sidebar-entry') {
        if (options?.method === 'POST') {
          serverSidebar = JSON.parse(options.body).enabled
          return { ok: true, enabled: serverSidebar }
        }
        return { ok: true, enabled: serverSidebar }
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

    // 模拟 slots 注入通知
    if (injectCallbacks['plugins.bundle.config']) {
      injectCallbacks['plugins.bundle.config']()
    }
    expect(slotsMap.has('plugins.bundle.config')).toBe(true)

    // 开启侧边栏入口
    if (injectCallbacks['main']) {
      injectCallbacks['main']()
    }
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

  it('宿主重载或重建插槽时正确复位并重新注册', async () => {
    const { ctx, slotsMap, injectCallbacks } = createMockCtx()
    const callApi = vi.fn(async (path: string, options?: any) => {
      if (path === '/api/michengai/dsh-agency-agents/sidebar-entry') {
        if (options?.method === 'POST') return { ok: true, enabled: JSON.parse(options.body).enabled }
        return { ok: true, enabled: true }
      }
      return { ok: true, enabled: true }
    })

    const controller = setupSidebarEntry(ctx as any, {
      callApi,
      renderPanel: () => null,
      ns: 'agency',
    })

    // 启用状态下声明 main 和 sidebar.panellist
    let cleanupMain: Function | undefined
    let cleanupSidebar: Function | undefined
    if (injectCallbacks['main']) cleanupMain = injectCallbacks['main']()
    if (injectCallbacks['sidebar.panellist']) cleanupSidebar = injectCallbacks['sidebar.panellist']()

    await vi.waitFor(() => expect(controller.isEnabled()).toBe(true))
    expect(slotsMap.has('sidebar.panellist')).toBe(true)
    expect(slotsMap.has('main')).toBe(true)

    // 宿主触发撤销（例如切 profile 或重载）
    cleanupSidebar?.()
    expect(slotsMap.has('sidebar.panellist')).toBe(false)

    // 宿主重新声明 sidebar.panellist，验证入口正常恢复注册
    injectCallbacks['sidebar.panellist']?.()
    expect(slotsMap.has('sidebar.panellist')).toBe(true)

    cleanupMain?.()
    expect(slotsMap.has('main')).toBe(false)

    controller.destroy()
  })
})
