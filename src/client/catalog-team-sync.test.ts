import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { acceptCatalog, catalogState, subscribeCatalog } from './catalog.js'
import { acceptTeams, teamState, subscribeTeams } from './team-cache.js'
import type { AgencyCatalogRemote, AgencyTeamsRemote } from './remote.js'
import type { CatalogSnapshot } from '../expert-contract.js'

describe('专家库与专家团名册缓存联动 (Issue #33)', () => {
  it('team-ui.tsx 必须订阅 subscribeCatalog 并实时同步专家名册与已启用成员', () => {
    const code = readFileSync(new URL('./team-ui.tsx', import.meta.url), 'utf8')
    assert.match(code, /subscribeCatalog/, 'TeamsPanel 必须导入并使用 subscribeCatalog')
    assert.match(code, /subscribeCatalog\(\s*props\.remote/, 'TeamsPanel 必须在生命周期中监听 catalog 变更')
    assert.match(code, /setExperts\(/, 'TeamsPanel 收到名册变更时必须调用 setExperts 更新候选人')
  })

  it('team-composer.tsx 必须在 TeamMenu 中订阅 subscribeCatalog 同步最新专家', () => {
    const code = readFileSync(new URL('./team-composer.tsx', import.meta.url), 'utf8')
    assert.match(code, /subscribeCatalog/, 'TeamMenu 必须导入并使用 subscribeCatalog')
    assert.match(code, /subscribeCatalog\(\s*props\.remote/, 'TeamMenu 必须在生命周期中监听 catalog 变更')
  })

  it('global-draft-dialog.tsx 在草案弹窗保存自定义专家后必须调用 acceptCatalog 推动热同步', () => {
    const code = readFileSync(new URL('./global-draft-dialog.tsx', import.meta.url), 'utf8')
    assert.match(code, /acceptCatalog/, '草案弹窗保存后必须调用 acceptCatalog')
    assert.match(code, /acceptCatalog\(\s*options\.remote/, 'CustomExpertEditor 保存后必须将返回的名册写入 acceptCatalog')
  })

  it('运行时联动：acceptCatalog 写入新专家后，subscribeCatalog 能实时收到新自定义专家并感知启用状态', () => {
    const mockRemote = {} as AgencyCatalogRemote & AgencyTeamsRemote

    // 初始名册
    const initialCatalog: CatalogSnapshot = {
      experts: [
        {
          slug: 'base-expert-1',
          name: '内置专家1',
          nameEn: 'Base 1',
          description: '内置职责',
          descriptionEn: 'Base duty',
          emoji: '🧩',
          division: 'engineering',
          divisionZh: '工程',
          custom: false,
        },
      ],
      enabled: ['base-expert-1'],
      revision: 1,
    }

    acceptCatalog(mockRemote, initialCatalog)
    expect(catalogState(mockRemote).experts).toHaveLength(1)

    let updatedExpertsCount = 0
    let updatedEnabledCount = 0

    const unsubscribe = subscribeCatalog(mockRemote, () => {
      const state = catalogState(mockRemote)
      updatedExpertsCount = state.experts.length
      updatedEnabledCount = state.enabled.size
    })

    // 新增自定义专家
    const nextCatalog: CatalogSnapshot = {
      experts: [
        ...initialCatalog.experts,
        {
          slug: 'custom-expert-abc',
          name: '我的自定义专家',
          nameEn: 'My Custom Expert',
          description: '自定义业务分析',
          descriptionEn: '',
          emoji: '🎯',
          division: 'product',
          divisionZh: '产品',
          custom: true,
        },
      ],
      enabled: ['base-expert-1', 'custom-expert-abc'],
      revision: 2,
    }

    acceptCatalog(mockRemote, nextCatalog)

    expect(updatedExpertsCount).toBe(2)
    expect(updatedEnabledCount).toBe(2)
    expect(catalogState(mockRemote).experts.some(e => e.slug === 'custom-expert-abc')).toBe(true)

    unsubscribe()
  })
})
