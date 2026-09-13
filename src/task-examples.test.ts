import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { parseFrontmatter } from './index.js'
import { ROSTER } from './client/roster.js'
import { expertTaskExample, TASK_EXAMPLES } from './client/task-examples.js'

describe('任务示例与专家来源', () => {
  it('真实包内 persona 元数据能够命中对应示例', async () => {
    for (const slug of Object.keys(TASK_EXAMPLES)) {
      const base = ROSTER.find(expert => expert.slug === slug)!
      const text = await readFile(new URL(`../assets/agency-agents/${base.division}/${slug}.md`, import.meta.url), 'utf8')
      const parsed = parseFrontmatter(text)!
      expect(expertTaskExample({ slug, custom: false, nameEn: parsed.name!, description: parsed.description!, descriptionEn: parsed.descriptionEn ?? '' }, 'zh'), slug).toBeDefined()
    }
  })
  it('每个试点角色在名册中存在，且提供完整双语内容', () => {
    for (const slug of Object.keys(TASK_EXAMPLES)) {
      const base = ROSTER.find(expert => expert.slug === slug)
      expect(base, slug).toBeDefined()
      const expert = { ...base!, custom: false }
      expect(expertTaskExample(expert, 'zh')).toMatch(/我提供/)
      expect(expertTaskExample(expert, 'en')).toMatch(/I provide/)
    }
  })
  it('自定义专家和元数据已改变的同名外部专家不借用内置示例', () => {
    const base = ROSTER.find(expert => expert.slug === 'design-ux-researcher')!
    expect(expertTaskExample({ ...base, custom: true }, 'zh')).toBeUndefined()
    expect(expertTaskExample({ ...base, custom: false, description: '外部目录里的其他职责' }, 'zh')).toBeUndefined()
    expect(expertTaskExample({ ...base, custom: false, slug: 'external-unknown' }, 'en')).toBeUndefined()
  })
})
