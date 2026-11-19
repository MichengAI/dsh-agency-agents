import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

const source = readFileSync(new URL('./client/index.ts', import.meta.url), 'utf8')

it('unmountSettingsSection 连线必须成对释放正文与图标注销句柄', () => {
  expect(source).toMatch(/offSettingsIcon\s*=\s*offIcon/)
  expect(source).toMatch(/offSettingsSection\(\)/)
  expect(source).toMatch(/offSettingsIcon\(\)|offSettingsIcon\?\.\(\)/)
})

it('专家设置分区固定为 order 20，避免和插件配置的 16 撞号', () => {
  const registration = source.match(/id:\s*'agency-agents',\s*order:\s*(\d+)/)
  expect(registration?.[1]).toBe('20')
})

it('registerSettingsSection 正确对接真实宿主门面（仅暴露 spec，无 specDynamic）', async () => {
  const { registerSettingsSection } = await import('./client/index.js')
  const calls: string[] = []
  const registered = new Set<string>()

  const modernFacade = {
    spec: (key: string) => key === 'settings.section.icon' || key === 'settings.section' ? { kind: 'list' } : undefined,
    register: (opts: any) => {
      calls.push(opts.name)
      registered.add(opts.name)
      return () => registered.delete(opts.name)
    },
  }

  const result = registerSettingsSection(modernFacade, {
    label: () => '专家',
    locale: 'agency',
    renderPanel: () => null as any,
    renderIcon: () => null as any,
  })

  // 1. 验证注册顺序：必须正文 settings.section 优先，随后才是 settings.section.icon
  expect(calls).toEqual(['settings.section', 'settings.section.icon'])
  expect(result.offSection).not.toBeNull()
  expect(result.offIcon).not.toBeNull()
  expect(registered.has('settings.section')).toBe(true)
  expect(registered.has('settings.section.icon')).toBe(true)

  // 2. 验证成对注销：释放后注册表清空
  result.offSection?.()
  result.offIcon?.()
  expect(registered.size).toBe(0)
}, 20000)

it('registerSettingsSection 在老宿主（未声明 icon）跳过图标注册，正文依然正常挂载', async () => {
  const { registerSettingsSection } = await import('./client/index.js')
  const registered = new Set<string>()
  const legacyFacade = {
    spec: (key: string) => key === 'settings.section' ? { kind: 'list' } : undefined,
    register: (opts: any) => {
      registered.add(opts.name)
      return () => registered.delete(opts.name)
    },
  }

  const result = registerSettingsSection(legacyFacade, {
    label: () => '专家',
    locale: 'agency',
    renderPanel: () => null as any,
    renderIcon: () => null as any,
  })

  expect(result.offSection).not.toBeNull()
  expect(result.offIcon).toBeNull()
  expect(registered.has('settings.section')).toBe(true)
  expect(registered.has('settings.section.icon')).toBe(false)
}, 20000)

it('registerSettingsSection 兼顾回退仅暴露 specDynamic 的测试/实验环境', async () => {
  const { registerSettingsSection } = await import('./client/index.js')
  const registered = new Set<string>()
  const coreOnly = {
    specDynamic: (key: string) => key === 'settings.section.icon' || key === 'settings.section' ? { kind: 'list' } : undefined,
    register: (opts: any) => {
      registered.add(opts.name)
      return () => registered.delete(opts.name)
    },
  }

  const result = registerSettingsSection(coreOnly, {
    label: () => '专家',
    locale: 'agency',
    renderPanel: () => null as any,
    renderIcon: () => null as any,
  })

  expect(result.offSection).not.toBeNull()
  expect(result.offIcon).not.toBeNull()
  expect(registered.has('settings.section.icon')).toBe(true)
}, 20000)

it('applySettingsNavIcon 在老宿主带 aria-hidden 图标容器下正常打上 marker，在新宿主带 navIcon 时自动清除 marker', async () => {
  const { applySettingsNavIcon, NAV_ICON_MARKER, NAV_ICON_CSS } = await import('./client/settings-nav-icon.js')

  // 防御检查：样式规则严禁包含未限定 marker 的裸 .dcu-sb-row::before，防止破坏 Codex UI 的拖拽与状态线
  expect(NAV_ICON_CSS).toContain(`.dcu-sb-row[${NAV_ICON_MARKER}]::before`)
  expect(NAV_ICON_CSS).not.toMatch(/(^|[^[])\.dcu-sb-row::before/)

  // 1. 老宿主：按钮包含原生齿轮 span（带 aria-hidden="true"），不得误判为已有插槽图标
  const oldHostIconSpan = {
    tagName: 'SPAN',
    className: '',
    getAttribute: (attr: string) => attr === 'aria-hidden' ? 'true' : null,
  }
  const textSpan = {
    tagName: 'SPAN',
    className: '',
    textContent: '专家',
    getAttribute: () => null,
  }
  const attributes = new Map<string, string>()
  const oldHostButton = {
    textContent: '专家',
    children: [oldHostIconSpan, textSpan],
    querySelector: () => null,
    hasAttribute: (name: string) => attributes.has(name),
    getAttribute: (name: string) => attributes.get(name) ?? null,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
  } as unknown as Element

  expect(applySettingsNavIcon(oldHostButton, () => '专家')).toBe(true)
  expect(oldHostButton.hasAttribute(NAV_ICON_MARKER)).toBe(true)
  // 二次调用幂等
  expect(applySettingsNavIcon(oldHostButton, () => '专家')).toBe(false)

  // 2. 新宿主：带 navIcon 类的插槽容器存在，必须自动移除 marker
  const newHostIconSpan = {
    tagName: 'SPAN',
    className: 'navIcon dcu-nav-icon',
    getAttribute: () => null,
  }
  const newHostButton = {
    textContent: '专家',
    children: [newHostIconSpan, textSpan],
    querySelector: (sel: string) => sel.includes('navIcon') ? newHostIconSpan : null,
    hasAttribute: (name: string) => attributes.has(name),
    getAttribute: (name: string) => attributes.get(name) ?? null,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
  } as unknown as Element

  expect(applySettingsNavIcon(newHostButton, () => '专家')).toBe(true)
  expect(newHostButton.hasAttribute(NAV_ICON_MARKER)).toBe(false)

  // 3. 移动端抽屉/侧栏入口防御：在移动端 role="dialog" 抽屉下，侧栏按钮绝不能被打上 marker，且已有残留必须自愈清理
  const sidebarGlyph = {
    tagName: 'SPAN',
    className: 'dcu-sb-glyph',
    getAttribute(name: string) { return name === 'aria-hidden' ? 'true' : null },
  }
  const sidebarTitle = { textContent: '专家' }
  const sidebarAttributes = new Map([['data-aag-nav-icon', '']])
  const mobileSidebarButton = {
    className: 'dcu-sb-row dcu-sb-more-item',
    textContent: '专家',
    children: [sidebarGlyph, sidebarTitle],
    closest(selector: string) {
      if (selector.includes('.dcu-sb-root') || selector.includes('.dcu-sidebar-nav-root')) return {}
      return null
    },
    matches(selector: string) {
      return selector.includes('.dcu-sb-row')
    },
    querySelector(selector: string) {
      if (selector === 'span') return sidebarTitle
      if (selector.includes('glyph') || selector.includes('dcu-sb-glyph')) return sidebarGlyph
      return null
    },
    hasAttribute(name: string) { return sidebarAttributes.has(name) },
    getAttribute(name: string) { return sidebarAttributes.get(name) ?? null },
    setAttribute(name: string, value: string) { sidebarAttributes.set(name, String(value)) },
    removeAttribute(name: string) { sidebarAttributes.delete(name) },
  } as unknown as Element

  expect(applySettingsNavIcon(mobileSidebarButton, () => '专家')).toBe(true)
  expect(mobileSidebarButton.hasAttribute(NAV_ICON_MARKER)).toBe(false)
  expect(applySettingsNavIcon(mobileSidebarButton, () => '专家')).toBe(false)
  expect(mobileSidebarButton.hasAttribute(NAV_ICON_MARKER)).toBe(false)
})
