import { describe, expect, it } from 'vitest'
import { ROSTER } from './client/roster.js'
import { ZH_NAME } from './names.js'

describe('内置专家名册', () => {
  it('融合参考库中的 321 位正式专家，且不包含文档与流程模板', () => {
    const slugs = new Set(ROSTER.map((expert) => expert.slug))
    expect(ROSTER).toHaveLength(321)
    expect(slugs.has('engineering-knowledge-graph-engineer')).toBe(true)
    expect(slugs.has('specialized-master-plan-architect')).toBe(true)
    expect(slugs.has('research-synthesist')).toBe(true)
    expect(slugs.has('engineering-dingtalk-integration-developer')).toBe(true)
    expect(slugs.has('marketing-wechat-operator')).toBe(true)
    expect(slugs.has('specialized-meeting-assistant')).toBe(true)
    expect(slugs.has('chief-executive-officer')).toBe(true)
    expect(slugs.has('chief-technology-officer')).toBe(true)
    expect(slugs.has('hr-recruiter')).toBe(true)
    expect(slugs.has('legal-contract-reviewer')).toBe(true)
    expect(slugs.has('supply-chain-route-optimizer')).toBe(true)
    expect(slugs.has('backend-architect-with-memory')).toBe(false)
    expect(slugs.has('phase-0-discovery')).toBe(false)
  })

  it('中英文调用名称在名册内唯一', () => {
    const chineseNames = ROSTER.map((expert) => ZH_NAME[expert.slug] ?? expert.nameEn)
    const englishNames = ROSTER.map((expert) => expert.nameEn)
    expect(new Set(chineseNames).size).toBe(chineseNames.length)
    expect(new Set(englishNames).size).toBe(englishNames.length)
  })
})
