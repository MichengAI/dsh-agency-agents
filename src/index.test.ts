import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { apply, loadCatalog, parseFrontmatter, resolveCatalogRoot, resolveExpert, sanitize, stripBom, truncate, unquote } from './index.js'

describe('sanitize', () => {
  it('转义双花括号，避免模板插值', () => {
    expect(sanitize('{{x}}')).toBe('{\u200B{x}}')
  })

  it('三连花括号不残留 {{', () => {
    expect(sanitize('{{{x}}}')).toBe('{\u200B{\u200B{x}}}')
  })

  it('无花括号的文本原样返回', () => {
    expect(sanitize('no braces')).toBe('no braces')
  })
})

describe('stripBom', () => {
  it('去除 UTF-8 BOM', () => {
    expect(stripBom('\uFEFF---')).toBe('---')
  })

  it('无 BOM 原样返回', () => {
    expect(stripBom('---')).toBe('---')
  })
})

describe('unquote', () => {
  it('剥离双引号', () => {
    expect(unquote('"📘"')).toBe('📘')
  })

  it('剥离单引号', () => {
    expect(unquote("'x'")).toBe('x')
  })

  it('无引号原样返回', () => {
    expect(unquote('abc')).toBe('abc')
  })
})

describe('truncate', () => {
  it('超长截断并追加省略号', () => {
    expect(truncate('abcdef', 3)).toBe('abc…')
  })

  it('不超长原样返回', () => {
    expect(truncate('abc', 3)).toBe('abc')
  })
})

describe('parseFrontmatter', () => {
  it('解析带引号的 emoji', () => {
    const parsed = parseFrontmatter('---\nname: X\ndescription: D\nemoji: "📘"\n---\nbody')
    expect(parsed?.name).toBe('X')
    expect(parsed?.description).toBe('D')
    expect(parsed?.emoji).toBe('📘')
    expect(parsed?.body).toBe('body')
  })

  it('无 frontmatter 返回 undefined', () => {
    expect(parseFrontmatter('just body')).toBeUndefined()
  })
})

describe('loadCatalog', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'aag-'))
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('递归加载 division 子目录中的智能体', async () => {
    await mkdir(join(dir, 'game-development', 'unity'), { recursive: true })
    await writeFile(join(dir, 'game-development', 'economy-designer.md'), '---\nname: E\ndescription: d\n---\nbody', 'utf8')
    await writeFile(join(dir, 'game-development', 'unity', 'unity-architect.md'), '---\nname: U\ndescription: d\n---\nbody', 'utf8')
    const map = await loadCatalog(dir, ['game-development'])
    expect(map.has('economy-designer')).toBe(true)
    expect(map.has('unity-architect')).toBe(true)
    expect(map.get('unity-architect')?.division).toBe('game-development')
  })

  it('加载 integrations/mcp-memory 额外源并归入 engineering', async () => {
    await mkdir(join(dir, 'integrations', 'mcp-memory'), { recursive: true })
    await writeFile(join(dir, 'integrations', 'mcp-memory', 'backend-architect-with-memory.md'), '---\nname: Backend Architect\ndescription: d\n---\nbody', 'utf8')
    const map = await loadCatalog(dir, ['engineering'])
    expect(map.get('backend-architect-with-memory')?.division).toBe('engineering')
  })

  it('未选择 engineering 时不加载 mcp-memory 额外源', async () => {
    await mkdir(join(dir, 'marketing'), { recursive: true })
    await mkdir(join(dir, 'integrations', 'mcp-memory'), { recursive: true })
    await writeFile(join(dir, 'marketing', 'marketing-specialist.md'), '---\nname: Marketing Specialist\ndescription: d\n---\nbody', 'utf8')
    await writeFile(join(dir, 'integrations', 'mcp-memory', 'backend-architect-with-memory.md'), '---\nname: Backend Architect\ndescription: d\n---\nbody', 'utf8')

    const map = await loadCatalog(dir, ['marketing'])

    expect(map.has('marketing-specialist')).toBe(true)
    expect(map.has('backend-architect-with-memory')).toBe(false)
  })

  it('root 不存在时抛出', async () => {
    await expect(loadCatalog(join(dir, 'nope'), ['engineering'])).rejects.toThrow()
  })

  it('root 存在但无任何智能体时抛出', async () => {
    await mkdir(join(dir, 'empty'), { recursive: true })
    await expect(loadCatalog(join(dir, 'empty'), ['engineering'])).rejects.toThrow()
  })

  it('未配置 root 时加载随包发布的智能体目录', async () => {
    const map = await loadCatalog(resolveCatalogRoot(''), ['academic'])
    expect(map.size).toBeGreaterThan(0)
  })
})

describe('resolveExpert', () => {
  it('精确名称对应多个智能体时抛出歧义并列出 slug', () => {
    const experts = [
      { slug: 'engineering-backend-architect', name: 'Backend Architect' },
      { slug: 'backend-architect-with-memory', name: 'Backend Architect' },
    ]

    expect(() => resolveExpert(experts, 'Backend Architect')).toThrow(/engineering-backend-architect, backend-architect-with-memory/)
  })
})

describe('summon_expert', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'aag-'))
    await mkdir(join(dir, 'engineering'), { recursive: true })
    await mkdir(join(dir, 'integrations', 'mcp-memory'), { recursive: true })
    await writeFile(join(dir, 'engineering', 'reviewer.md'), '---\nname: Reviewer\ndescription: d\n---\nbody', 'utf8')
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('资源释放失败时向调用方抛出异常', async () => {
    const tools: unknown[] = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: {
        getProvider: () => ({ capabilities: { persona: true, toolFilter: true, depthLimit: true } }),
        start: async () => ({
          result: Promise.resolve({ output: [{ type: 'text', text: 'done' }], stopReason: 'completed' }),
          dispose: async () => { throw new Error('dispose failed') },
        }),
      },
      systemPrompt: { section: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'] })
    const summon = tools.find((tool) => (tool as { name?: string }).name === 'summon_expert') as {
      execute: (args: unknown, exec: unknown) => Promise<unknown>
    }

    await expect(summon.execute({ expert: 'reviewer', task: 'review' }, { agent: {} })).rejects.toThrow('dispose failed')
  })
})
