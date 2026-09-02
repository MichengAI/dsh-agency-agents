import { describe, expect, it } from 'vitest'
import { ROSTER } from './client/roster.js'
import { ZH_NAME } from './names.js'

describe('内置专家名册', () => {
  it('同步上游正式分区的 273 位专家，且不包含 integrations 转换输出', () => {
    const slugs = new Set(ROSTER.map((expert) => expert.slug))
    expect(ROSTER).toHaveLength(273)
    expect(slugs.has('engineering-knowledge-graph-engineer')).toBe(true)
    expect(slugs.has('specialized-master-plan-architect')).toBe(true)
    expect(slugs.has('research-synthesist')).toBe(true)
    expect(slugs.has('backend-architect-with-memory')).toBe(false)
  })

  it('中英文调用名称在名册内唯一', () => {
    const chineseNames = ROSTER.map((expert) => ZH_NAME[expert.slug] ?? expert.nameEn)
    const englishNames = ROSTER.map((expert) => expert.nameEn)
    expect(new Set(chineseNames).size).toBe(chineseNames.length)
    expect(new Set(englishNames).size).toBe(englishNames.length)
  })
})
