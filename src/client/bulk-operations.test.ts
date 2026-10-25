import { describe, expect, it } from 'vitest'
import { bulkEnableTargets, bulkDisableTargets } from './index.js'
import { zh, en } from './locales.js'
import { BulkActionMenu } from './bulk-action-menu.js'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

describe('批量启停逻辑 (bulkEnableTargets & bulkDisableTargets)', () => {
  const dummyExperts = [
    { slug: 'engineering-code-reviewer', conflict: false },
    { slug: 'academic-historian', conflict: false },
    { slug: 'design-figma-specialist', conflict: false },
    { slug: 'custom-conflict-expert', conflict: true },
  ]

  it('批量启用将未启用的非冲突目标加入集合，并返回新增数量', () => {
    const current = new Set(['engineering-code-reviewer'])
    const result = bulkEnableTargets(current, dummyExperts)

    expect(result.affectedCount).toBe(2) // academic-historian and design-figma-specialist
    expect(result.nextEnabled.has('engineering-code-reviewer')).toBe(true)
    expect(result.nextEnabled.has('academic-historian')).toBe(true)
    expect(result.nextEnabled.has('design-figma-specialist')).toBe(true)
    expect(result.nextEnabled.has('custom-conflict-expert')).toBe(false)
    expect(current.size).toBe(1) // 保证不可变
  })

  it('全部目标均已启用时，affectedCount 为 0', () => {
    const current = new Set(['engineering-code-reviewer', 'academic-historian', 'design-figma-specialist'])
    const result = bulkEnableTargets(current, dummyExperts)

    expect(result.affectedCount).toBe(0)
    expect(result.nextEnabled.size).toBe(3)
  })

  it('批量停用只移除目标集合中的已启用项，其余已启用专家保持不变', () => {
    const current = new Set(['engineering-code-reviewer', 'academic-historian', 'other-expert'])
    const targets = [{ slug: 'academic-historian' }, { slug: 'design-figma-specialist' }]
    const result = bulkDisableTargets(current, targets)

    expect(result.affectedCount).toBe(1)
    expect(result.nextEnabled.has('engineering-code-reviewer')).toBe(true)
    expect(result.nextEnabled.has('academic-historian')).toBe(false)
    expect(result.nextEnabled.has('other-expert')).toBe(true)
    expect(current.has('academic-historian')).toBe(true) // 保证不可变
  })

  it('停用目标中无已启用项时，affectedCount 为 0', () => {
    const current = new Set(['other-expert'])
    const targets = [{ slug: 'academic-historian' }]
    const result = bulkDisableTargets(current, targets)

    expect(result.affectedCount).toBe(0)
    expect(result.nextEnabled.has('other-expert')).toBe(true)
  })
})

describe('批量操作多语言词条对齐', () => {
  const bulkKeys = [
    'settings.bulk.menu',
    'settings.bulk.enableFiltered',
    'settings.bulk.disableFiltered',
    'settings.bulk.enableAll',
    'settings.bulk.disableAll',
    'settings.bulk.enableFilteredTitle',
    'settings.bulk.disableFilteredTitle',
    'settings.bulk.enableAllTitle',
    'settings.bulk.disableAllTitle',
    'settings.bulk.enableConfirm',
    'settings.bulk.disableConfirm',
    'settings.bulk.confirm',
    'settings.bulk.cancel',
  ] as const

  it('中英文词条均包含批量操作所有 key 且不为空', () => {
    for (const key of bulkKeys) {
      expect(zh[key as keyof typeof zh]).toBeDefined()
      expect(typeof zh[key as keyof typeof zh]).toBe('string')
      expect(zh[key as keyof typeof zh].length).toBeGreaterThan(0)

      expect(en[key as keyof typeof en]).toBeDefined()
      expect(typeof en[key as keyof typeof en]).toBe('string')
      expect(en[key as keyof typeof en].length).toBeGreaterThan(0)
    }
  })

  it('模板占位符 {count} 与 {enabled} 能正常替换且无未替换标记', () => {
    const zhConfirm = zh['settings.bulk.enableConfirm']
      .replace('{count}', '15')
      .replace('{enabled}', '20')
    expect(zhConfirm).toContain('15 位专家')
    expect(zhConfirm).toContain('20 位')
    expect(zhConfirm).not.toContain('{count}')
    expect(zhConfirm).not.toContain('{enabled}')

    const enConfirm = en['settings.bulk.enableConfirm']
      .replace('{count}', '15')
      .replace('{enabled}', '20')
    expect(enConfirm).toContain('15 expert(s)')
    expect(enConfirm).toContain('20 enabled')
    expect(enConfirm).not.toContain('{count}')
    expect(enConfirm).not.toContain('{enabled}')
  })
})

describe('331位专家全量批量处理性能与无冲突保证', () => {
  it('对331位大体量专家进行全量启用与全量停用，耗时应远低于10ms', () => {
    const largeCatalog = Array.from({ length: 331 }, (_, i) => ({
      slug: `expert-${i}`,
      conflict: i % 50 === 0, // 每50个模拟1个冲突
    }))

    const start = performance.now()
    const { nextEnabled, affectedCount } = bulkEnableTargets(new Set<string>(), largeCatalog)
    const elapsedEnable = performance.now() - start

    expect(affectedCount).toBe(331 - 7) // 7个冲突专家被跳过
    expect(nextEnabled.size).toBe(331 - 7)
    expect(elapsedEnable).toBeLessThan(10)

    const startDisable = performance.now()
    const disabledResult = bulkDisableTargets(nextEnabled, largeCatalog)
    const elapsedDisable = performance.now() - startDisable

    expect(disabledResult.affectedCount).toBe(331 - 7)
    expect(disabledResult.nextEnabled.size).toBe(0)
    expect(elapsedDisable).toBeLessThan(10)
  })
})

describe('BulkActionMenu 批量操作下拉菜单组件', () => {
  it('正确渲染批量操作触发按钮与原生结构', () => {
    const html = renderToStaticMarkup(React.createElement(BulkActionMenu, {
      label: '批量操作',
      items: [
        { id: 'enable-filtered', label: '启用筛选 (5)' },
        { id: 'disable-filtered', label: '停用筛选 (2)' },
        { id: 'sep', label: '', separator: true },
        { id: 'disable-all', label: '停用全部', danger: true },
      ],
      onSelect: () => undefined,
    }))
    expect(html).toContain('批量操作')
    expect(html).toContain('aag-menu-select-trigger')
    expect(html).toContain('aag-bulk-trigger')
    expect(html).toContain('aag-select-wrap')
  })
})

describe('并发写入安全与防静默覆盖机制', () => {
  it('打开弹窗后有并发新专家写入时，确认执行基于最新状态重算并保留并发写入', () => {
    // 模拟打开弹窗时的初始状态 (revision 1)
    const initialEnabled = new Set(['expert-0', 'expert-1'])
    const targetsToEnable = [{ slug: 'expert-2' }, { slug: 'expert-3' }]

    // 打开弹窗期间，其他窗口并发写入了 expert-concurrent (revision 2)
    const concurrentLatestEnabled = new Set([...initialEnabled, 'expert-concurrent'])

    // 执行阶段不使用快照 next，而是基于最新的 current.enabled 重算
    const { nextEnabled, affectedCount } = bulkEnableTargets(concurrentLatestEnabled, targetsToEnable)

    expect(affectedCount).toBe(2)
    expect(nextEnabled.has('expert-0')).toBe(true)
    expect(nextEnabled.has('expert-1')).toBe(true)
    expect(nextEnabled.has('expert-2')).toBe(true)
    expect(nextEnabled.has('expert-3')).toBe(true)
    // 关键保证：并发写入的 expert-concurrent 被完整保留，绝不丢失！
    expect(nextEnabled.has('expert-concurrent')).toBe(true)
  })

  it('针对筛选停用时，执行阶段基于最新状态重算，并发启用的无关专家不被误停用', () => {
    const initialEnabled = new Set(['expert-0', 'expert-filter-1', 'expert-filter-2'])
    const filterTargets = [{ slug: 'expert-filter-1' }, { slug: 'expert-filter-2' }]

    // 弹窗期间并发启用了 expert-concurrent
    const concurrentLatestEnabled = new Set([...initialEnabled, 'expert-concurrent'])

    const { nextEnabled, affectedCount } = bulkDisableTargets(concurrentLatestEnabled, filterTargets)

    expect(affectedCount).toBe(2)
    expect(nextEnabled.has('expert-0')).toBe(true)
    expect(nextEnabled.has('expert-filter-1')).toBe(false)
    expect(nextEnabled.has('expert-filter-2')).toBe(false)
    // 关键保证：并发写入的 expert-concurrent 完整保留！
    expect(nextEnabled.has('expert-concurrent')).toBe(true)
  })
})
