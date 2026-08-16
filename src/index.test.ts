import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import z from '@deepseek-ai/schemastery'
import { Config, apply, loadCatalog, parseFrontmatter, resolveCatalogRoot, resolveExpert, sanitize, stripBom, truncate, unquote } from './index.js'
import AgencyAgentsRemote from './remote.js'
import { AGENCY_AGENTS_DESCRIPTORS } from './remote-contract.js'
import { writeErrorKey, writeErrorMessage, buildSummonInstruction, applyExpertSummon } from './client/index.js'
import { en, zh, type AgencyKey } from './client/locales.js'
import { TYPERT_REMOTE } from './client/remote.js'

describe('Config', () => {
  it('配置 schema 拒绝零 maxDepth，避免设置界面展示为合法值', () => {
    expect(() => z.resolve({ maxDepth: 0 }, Config, {})).toThrow()
  })
})

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

  it('按码点截断，不拆开 emoji 代理对', () => {
    expect(truncate('😀abc', 1)).toBe('😀…')
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

  it('在解析 root 时读取之后设置的环境变量', () => {
    const original = process.env.AGENCY_AGENTS_ROOT
    process.env.AGENCY_AGENTS_ROOT = dir
    try {
      expect(resolveCatalogRoot('')).toBe(dir)
    } finally {
      if (original === undefined) delete process.env.AGENCY_AGENTS_ROOT
      else process.env.AGENCY_AGENTS_ROOT = original
    }
  })
})

describe('resolveExpert', () => {
  const experts = [
    { slug: 'engineering-backend-architect', name: 'Backend Architect' },
    { slug: 'backend-architect-with-memory', name: 'Backend Architect' },
    { slug: 'Unity-Architect', name: 'Unity Architect' },
  ]

  it('精确名称对应多个智能体时抛出歧义并列出 slug', () => {
    expect(() => resolveExpert(experts, 'Backend Architect')).toThrow(/engineering-backend-architect, backend-architect-with-memory/)
  })

  it('按 slug 不区分大小写匹配外部目录中的文件名', () => {
    expect(resolveExpert(experts, 'unity-architect').name).toBe('Unity Architect')
  })

  it('唯一部分匹配时返回智能体，无匹配时给出可操作错误', () => {
    expect(resolveExpert(experts, 'unity').slug).toBe('Unity-Architect')
    expect(() => resolveExpert(experts, 'missing')).toThrow('Call list_experts')
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
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'] })
    const summon = tools.find((tool) => (tool as { name?: string }).name === 'summon_expert') as {
      execute: (args: unknown, exec: unknown) => Promise<unknown>
    }

    await expect(summon.execute({ expert: 'reviewer', task: 'review' }, { agent: {} })).rejects.toThrow('dispose failed')
  })

  it('空 maxDepth 不透传给 provider，且子代理不能浏览或递归召唤花名册', async () => {
    const tools: unknown[] = []
    let startOptions: Record<string, unknown> | undefined
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: {
        getProvider: () => ({ capabilities: { persona: true, toolFilter: true, depthLimit: true } }),
        start: async (_provider: string, options: Record<string, unknown>) => {
          startOptions = options
          return {
            result: Promise.resolve({ output: [{ type: 'text', text: 'done' }], stopReason: 'completed' }),
            dispose: async () => undefined,
          }
        },
      },
      systemPrompt: { section: () => undefined },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'], maxDepth: null as unknown as number })
    const summon = tools.find((tool) => (tool as { name?: string }).name === 'summon_expert') as {
      execute: (args: unknown, exec: unknown) => Promise<unknown>
    }

    await expect(summon.execute({ expert: 'reviewer', task: 'review' }, { agent: {} })).resolves.toEqual({ expert: 'reviewer', answer: 'done' })
    expect(startOptions).toMatchObject({ toolFilter: { deny: ['summon_expert', 'summon_experts', 'list_experts'] } })
    expect(startOptions).not.toHaveProperty('maxDepth')
  })

  it('只向父会话注入花名册协议', () => {
    const tools: unknown[] = []
    const sections: Array<{ name: string; text: string | ((context: unknown) => string) }> = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: { getProvider: () => undefined },
      systemPrompt: { section: (section: { name: string; text: string | ((context: unknown) => string) }) => sections.push(section) },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'] })
    const text = sections.find((section) => section.name === 'agency:experts')?.text
    expect(typeof text).toBe('function')
    if (typeof text !== 'function') throw new Error('agency:experts must be dynamic')

    expect(text({ agent: { session: { header: {} } } })).toContain('parent session')
    expect(text({ agent: { session: { header: { parentSession: 'parent' } } } })).toBe('')
  })

  it('在注册阶段拒绝零 maxDepth，避免第一次委派才失败', () => {
    const ctx = {
      tools: { register: () => undefined },
      subagents: { getProvider: () => undefined },
      systemPrompt: { section: () => undefined },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    expect(() => apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'], maxDepth: 0 })).toThrow('positive safe integer')
  })

  it('分区筛选会去除空白并要求精确 division', async () => {
    const tools: unknown[] = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: { getProvider: () => undefined },
      systemPrompt: { section: () => undefined },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'] })
    const list = tools.find((tool) => (tool as { name?: string }).name === 'list_experts') as {
      execute: (args: unknown) => Promise<{ divisions: Array<{ division: string }>; total: number }>
    }

    await expect(list.execute({ division: ' engineering ' })).resolves.toMatchObject({ divisions: [{ division: 'engineering' }], total: 1 })
    await expect(list.execute({ division: 'en' })).resolves.toEqual({ divisions: [], total: 0 })
  })

  it.each([
    ['expert personas', { persona: false, toolFilter: true, depthLimit: true }, undefined, 'does not support expert personas'],
    ['toolFilter', { persona: true, toolFilter: false, depthLimit: true }, undefined, 'cannot prevent recursive expert delegation'],
    ['maxDepth', { persona: true, toolFilter: true, depthLimit: false }, 1, 'does not support maxDepth'],
  ])('provider 缺少 %s 能力时给出明确错误', async (_capability, capabilities, maxDepth, message) => {
    const tools: unknown[] = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: {
        getProvider: () => ({ capabilities }),
        start: async () => { throw new Error('must not start') },
      },
      systemPrompt: { section: () => undefined },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'], ...(maxDepth === undefined ? {} : { maxDepth }) })
    const summon = tools.find((tool) => (tool as { name?: string }).name === 'summon_expert') as {
      execute: (args: unknown, exec: unknown) => Promise<unknown>
    }

    await expect(summon.execute({ expert: 'reviewer', task: 'review' }, { agent: {} })).rejects.toThrow(message)
  })

  it('非 completed 的专家运行会返回部分输出以便排障', async () => {
    const tools: unknown[] = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: {
        getProvider: () => ({ capabilities: { persona: true, toolFilter: true, depthLimit: true } }),
        start: async () => ({
          result: Promise.resolve({ output: [{ type: 'text', text: 'partial result' }], stopReason: 'cancelled' }),
          dispose: async () => undefined,
        }),
      },
      systemPrompt: { section: () => undefined },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'] })
    const summon = tools.find((tool) => (tool as { name?: string }).name === 'summon_expert') as {
      execute: (args: unknown, exec: unknown) => Promise<unknown>
    }

    await expect(summon.execute({ expert: 'reviewer', task: 'review' }, { agent: {} })).rejects.toThrow('Partial output:\npartial result')
  })
})

describe('AgencyAgentsRemote（Host↔Client 读写链路）', () => {
  it('将 Settings revision 冲突映射到 i18n key，并区分刷新成败', () => {
    const conflict = new Error('settings namespace "agency-agents" changed since it was read (expected revision 0, now 1)')
    expect(writeErrorKey(conflict)).toBe('error.conflict')
    expect(writeErrorKey(conflict, { refreshed: true })).toBe('error.conflict.refreshed')
    expect(writeErrorKey(conflict, { refreshed: false })).toBe('error.conflict.refreshFailed')
    expect(writeErrorMessage(conflict)).toBe(zh['error.conflict'])
    expect(writeErrorMessage(conflict, { refreshed: true })).toBe(zh['error.conflict.refreshed'])
    expect(writeErrorMessage(conflict, { refreshed: false })).toBe(zh['error.conflict.refreshFailed'])
  })

  it('冲突文案走传入的 t，非冲突错误忽略 refreshed 并原样返回', () => {
    const conflict = new Error('settings namespace "agency-agents" changed since it was read (expected revision 0, now 1)')
    const tEn = (key: AgencyKey): string => en[key]
    expect(writeErrorMessage(conflict, { refreshed: true, t: tEn })).toBe(en['error.conflict.refreshed'])
    expect(writeErrorMessage(conflict, { refreshed: false, t: tEn })).toBe(en['error.conflict.refreshFailed'])
    expect(writeErrorKey(new Error('network down'))).toBeNull()
    expect(writeErrorMessage(new Error('network down'), { refreshed: true, t: tEn })).toBe('network down')
    expect(writeErrorMessage('plain')).toBe('plain')
  })

  it('getEnabled/setEnabled 通过 settings 服务读写启用列表', async () => {
    let stored: { enabled: string[] } = { enabled: [] }
    let revision = 0
    const registered: unknown[] = []
    const ctx = {
      reflect: { provide: () => undefined },
      typert: { register: (contribution: unknown) => { registered.push(contribution) } },
      settings: {
        get: () => stored,
        describe: () => [{ ns: 'agency-agents', revision }],
        mutate: async (_ns: unknown, ops: Array<{ op: string; path: readonly string[]; value: unknown }>, expectedRevision?: number) => {
          if (expectedRevision !== revision) throw new Error('stale revision')
          const op = ops[0]
          if (op !== undefined && op.op === 'set' && op.path[0] === 'enabled') {
            stored = { enabled: op.value as string[] }
            revision += 1
          }
        },
      },
    } as unknown as Context

    const remote = new AgencyAgentsRemote(ctx)
    expect(registered).toHaveLength(1)
    expect(remote.getEnabled()).toEqual({ enabled: [], revision: 0 })

    await expect(remote.setEnabled(['reviewer', 'coder'], 0)).resolves.toEqual({ enabled: ['reviewer', 'coder'], revision: 1 })
    await expect(remote.setEnabled(['writer'], 0)).rejects.toThrow('stale revision')
  })

  it('TYPERT_REMOTE 贡献描述符与 host 方法对齐（client $mount 契约）', () => {
    const endpoints = TYPERT_REMOTE.descriptors.map((d) => `${d.namespace}/${d.method}`)
    expect(endpoints).toContain('agencyAgents/getEnabled')
    expect(endpoints).toContain('agencyAgents/setEnabled')
    for (const d of TYPERT_REMOTE.descriptors) {
      expect(d.service).toBe('agencyAgents')
      expect(d.result.mode).toBe('strict')
    }
    const setEnabled = TYPERT_REMOTE.descriptors.find((d) => d.method === 'setEnabled')
    expect(TYPERT_REMOTE.descriptors).toBe(AGENCY_AGENTS_DESCRIPTORS)
    expect(setEnabled?.parameters.map((p) => p.wire)).toEqual(['enabled', 'expectedRevision'])
  })
})

describe('applyExpertSummon（输入框召唤）', () => {
  const t: TranslateNS<'agency'> = (key, params) => {
    let text = Object.hasOwn(zh, key) ? zh[key as AgencyKey] : key
    if (params !== undefined) {
      for (const [name, value] of Object.entries(params)) text = text.replaceAll('{' + name + '}', String(value))
    }
    return text
  }

  it('输入框已有内容时只回填召唤指令，不自动发送', () => {
    const calls: string[] = []
    const inputActions = {
      setDraft(draft: string): void { calls.push('setDraft:' + draft) },
      submit(): void { calls.push('submit') },
    }
    const instruction = buildSummonInstruction(t, '代码审查', 'reviewer', '请审查这段代码')
    applyExpertSummon({ inputActions, instruction })
    expect(instruction).toContain('请审查这段代码')
    expect(calls).toEqual(['setDraft:' + instruction])
    expect(calls).not.toContain('submit')
  })

  it('输入框为空时只回填召唤指令，不发送', () => {
    const calls: string[] = []
    const inputActions = {
      setDraft(draft: string): void { calls.push('setDraft:' + draft) },
      submit(): void { calls.push('submit') },
    }
    const instruction = buildSummonInstruction(t, '代码审查', 'reviewer', '   ')
    applyExpertSummon({ inputActions, instruction })
    expect(instruction).toBe(t('summon.instruction', { name: '代码审查', slug: 'reviewer' }))
    expect(calls).toEqual(['setDraft:' + instruction])
    expect(calls).not.toContain('submit')
  })

  it('没有 inputActions 时只生成指令，不抛错也不发送', () => {
    expect(() => applyExpertSummon({ instruction: t('summon.instruction', { name: '代码审查', slug: 'reviewer' }) })).not.toThrow()
    expect(() => applyExpertSummon({ inputActions: undefined, instruction: 'noop' })).not.toThrow()
  })
})
