import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { ROSTER } from './client/roster.js'
import { parseFrontmatter } from './index.js'
import { ZH_NAME } from './names.js'

const HAN_PATTERN = /\p{Script=Han}/u

function isChineseDominant(text: string): boolean {
  const han = [...text.matchAll(/\p{Script=Han}/gu)].length
  const latin = [...text.matchAll(/[A-Za-z]/g)].length
  return han >= 20 && han / (han + latin) >= 0.2
}

async function readPersona(locale: 'en' | 'zh', division: string, slug: string): Promise<string> {
  const root = locale === 'en' ? '../assets/agency-agents/' : '../assets/agency-agents-zh/'
  const raw = await readFile(new URL(`${root}${division}/${slug}.md`, import.meta.url), 'utf8')
  const parsed = parseFrontmatter(raw)
  if (parsed === undefined || parsed.body === '') throw new Error(`${locale}:${division}/${slug} persona 无效`)
  return parsed.body
}

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

  it('321 位专家均有纯英文名称、简介和 persona', async () => {
    const invalidNames = ROSTER.filter((expert) => HAN_PATTERN.test(expert.nameEn)).map((expert) => expert.slug)
    const invalidDescriptions = ROSTER
      .filter((expert) => HAN_PATTERN.test(expert.descriptionEn || expert.description))
      .map((expert) => expert.slug)
    const invalidPersonas: string[] = []
    for (const expert of ROSTER) {
      const body = await readPersona('en', expert.division, expert.slug)
      if (HAN_PATTERN.test(body)) invalidPersonas.push(expert.slug)
    }
    expect(invalidNames).toEqual([])
    expect(invalidDescriptions).toEqual([])
    expect(invalidPersonas).toEqual([])
  })

  it('321 位专家均有中文显示名和中文主导 persona', async () => {
    const invalidNames = ROSTER
      .filter((expert) => !HAN_PATTERN.test(ZH_NAME[expert.slug] ?? ''))
      .map((expert) => expert.slug)
    const invalidPersonas: string[] = []
    for (const expert of ROSTER) {
      const body = await readPersona('zh', expert.division, expert.slug).catch(() => '')
      if (!isChineseDominant(body)) invalidPersonas.push(expert.slug)
    }
    expect(invalidNames).toEqual([])
    expect(invalidPersonas).toEqual([])
  })
})
