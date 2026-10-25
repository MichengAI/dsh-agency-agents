import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { bulkEnableTargets, bulkDisableTargets, resolveBulkNextEnabled, performBulkCommit, type BulkOperationPlan } from './index.js'
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

describe('并发写入安全与防静默覆盖机制 (差分验证与防退化)', () => {
  it('组件代码防退化：bulkConfirm 状态严禁冻结 next 快照，且 executeBulkAction 必须基于 resolveBulkNextEnabled 动态计算', () => {
    const clientIndex = readFileSync(new URL('./index.ts', import.meta.url), 'utf8')
    // 1. 状态定义防退化：bulkConfirm 状态类型严禁包含 next 集合
    expect(clientIndex).not.toMatch(/bulkConfirm[^{]*\{[^}]*next:\s*(Set|ReadonlySet)/s)
    // 2. 调度赋值防退化：handleSelectBulkAction 严禁向 bulkConfirm 写入 next 字段
    expect(clientIndex).not.toMatch(/setBulkConfirm\(\{[^}]*next:/s)
    // 3. 执行时动态重算：executeBulkAction 必须调用 resolveBulkNextEnabled(current.enabled, bulkConfirm.plan)
    expect(clientIndex).toMatch(/resolveBulkNextEnabled\(\s*current\.enabled\s*,\s*bulkConfirm\.plan\s*\)/)
  })

  it('差分证明：resolveBulkNextEnabled 基于最新基线计算，有效消除旧快照导致的并发写入丢失', () => {
    const staleSnapshotEnabled = new Set(['expert-0', 'expert-1'])
    const plan: BulkOperationPlan = {
      type: 'enable',
      targets: [{ slug: 'expert-2' }, { slug: 'expert-3' }],
    }

    // 假设像旧代码那样在打开弹窗时预先算好并冻结快照：
    const staleFrozenNext = resolveBulkNextEnabled(staleSnapshotEnabled, plan)

    // 弹窗停留期间，其他窗口并发写入了 expert-concurrent：
    const concurrentLatestEnabled = new Set([...staleSnapshotEnabled, 'expert-concurrent'])

    // 差分对比 1：如果提交旧快照，并发写入必然丢失（证明旧 bug 存在）：
    expect(staleFrozenNext.has('expert-concurrent')).toBe(false)

    // 差分对比 2：通过修复后的动态重算，新结果完整保留了并发写入：
    const freshResolvedNext = resolveBulkNextEnabled(concurrentLatestEnabled, plan)
    expect(freshResolvedNext.has('expert-0')).toBe(true)
    expect(freshResolvedNext.has('expert-1')).toBe(true)
    expect(freshResolvedNext.has('expert-2')).toBe(true)
    expect(freshResolvedNext.has('expert-3')).toBe(true)
    expect(freshResolvedNext.has('expert-concurrent')).toBe(true)
  })

  it('performBulkCommit 调度行为差分测试：验证并发新写入被真实提交至远程接口，而不是被旧快照丢弃', async () => {
    const staleState = {
      revision: 1,
      enabled: new Set(['expert-0', 'expert-1']),
      experts: [],
    }
    const plan: BulkOperationPlan = {
      type: 'enable',
      targets: [{ slug: 'expert-2' }, { slug: 'expert-3' }],
    }

    const concurrentLatestState = {
      revision: 2,
      enabled: new Set(['expert-0', 'expert-1', 'expert-concurrent']),
      experts: [],
    }

    let submittedNext!: ReadonlySet<string>
    let submittedRevision!: number
    const mockWrite = async (next: ReadonlySet<string>, revision: number) => {
      submittedNext = next
      submittedRevision = revision
      return { revision, enabled: next, experts: [] }
    }

    await performBulkCommit(() => concurrentLatestState, plan, mockWrite)

    expect(submittedRevision).toBe(2)
    expect(submittedNext.has('expert-0')).toBe(true)
    expect(submittedNext.has('expert-1')).toBe(true)
    expect(submittedNext.has('expert-2')).toBe(true)
    expect(submittedNext.has('expert-3')).toBe(true)
    expect(submittedNext.has('expert-concurrent')).toBe(true)

    // 差分对比证明：若按旧实现的调度逻辑提交打开弹窗时的旧快照，并发写入必定丢失
    const simulatedStaleWriteNext = resolveBulkNextEnabled(staleState.enabled, plan)
    expect(simulatedStaleWriteNext.has('expert-concurrent')).toBe(false)
  })

  it('resolveBulkNextEnabled 覆盖停用筛选与停用全部模式', () => {
    const concurrentLatest = new Set(['expert-0', 'expert-f1', 'expert-f2', 'expert-other'])
    // 停用筛选
    const filterDisablePlan: BulkOperationPlan = {
      type: 'disable-targets',
      targets: [{ slug: 'expert-f1' }, { slug: 'expert-f2' }],
    }
    const filterResult = resolveBulkNextEnabled(concurrentLatest, filterDisablePlan)
    expect(filterResult.has('expert-0')).toBe(true)
    expect(filterResult.has('expert-other')).toBe(true)
    expect(filterResult.has('expert-f1')).toBe(false)
    expect(filterResult.has('expert-f2')).toBe(false)

    // 停用全部
    const disableAllPlan: BulkOperationPlan = {
      type: 'disable-all',
    }
    const disableAllResult = resolveBulkNextEnabled(concurrentLatest, disableAllPlan)
    expect(disableAllResult.size).toBe(0)
  })
})
