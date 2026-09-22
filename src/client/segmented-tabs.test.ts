import { describe, expect, it } from 'vitest'
import { FallbackSwitch, resolveSwitch } from './host-switch.js'
import { FallbackSegmentedControl, FallbackSegmentedTabs, resolveSegmentedControl, resolveSegmentedTabs } from './segmented-tabs.js'

describe('缺官方组件时使用同款本地实现', () => {
  it('宿主有导出时用官方组件', () => {
    const tabs = (() => null) as unknown as typeof FallbackSegmentedTabs
    const control = (() => null) as unknown as typeof FallbackSegmentedControl
    const toggle = (() => null) as unknown as typeof FallbackSwitch
    expect(resolveSegmentedTabs({ SegmentedTabs: tabs })).toBe(tabs)
    expect(resolveSegmentedControl({ SegmentedControl: control })).toBe(control)
    expect(resolveSwitch({ Switch: toggle })).toBe(toggle)
  })

  it('0.1.6 没有分段页签、0.1.0 没有开关时回退', () => {
    expect(resolveSegmentedTabs({})).toBe(FallbackSegmentedTabs)
    expect(resolveSegmentedControl({})).toBe(FallbackSegmentedControl)
    expect(resolveSwitch({})).toBe(FallbackSwitch)
  })
})
