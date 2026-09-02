import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import z from '@deepseek-ai/schemastery'
import { Config, SUMMON_EXPERTS_CONCURRENCY, SUMMON_EXPERTS_MAX, SUMMON_TASK_MAX_CHARS, apply, inject, loadCatalog, mapPool, parseFrontmatter, resolveCatalogRoot, resolveExpert, sanitize, stripBom, toSummonItemResult, truncate, unquote, validateSummonSpecs } from './index.js'
import AgencyAgentsRemote from './remote.js'
import { AGENCY_AGENTS_DESCRIPTORS } from './remote-contract.js'
import { buildExpertMentionLexicon, buildExpertReference, compareExpertName, filterExperts, formatExpertMention, formatExpertMentionInsertion, inject as clientInject, inputTriggerCandidateName, inputTriggerPickName, inputTriggerSourceId, inputTriggerSourceName, insertExpertReference, keepComposerFocus, matchExpertQuery, normalizeExpertQuery, resolveReferenceInsertionTarget, writeErrorKey, writeErrorMessage, buildSummonInstruction, applyExpertSummon } from './client/index.js'
import { en, zh, type AgencyKey } from './client/locales.js'
import { enHost, formatHost, matchDivision, readHostLocale, renderExpertList, renderSummonResults, resolveHostLocale, zhHost } from './i18n.js'
import { TYPERT_REMOTE } from './client/remote.js'
import { installSettingsSectionCompat, settingsNamespaceCompat } from './settings-compat.js'

describe('Config', () => {
  it('配置 schema 拒绝零 maxDepth，避免设置界面展示为合法值', () => {
    expect(() => z.resolve({ maxDepth: 0 }, Config, {})).toThrow()
  })

  it('配置 schema 允许缺省 maxDepth，解析结果不含该字段', () => {
    const resolved = z.resolve({}, Config, {})[0] as Record<string, unknown>
    expect(resolved).not.toHaveProperty('maxDepth')
  })

  it('默认加载 research 分区', () => {
    const resolved = z.resolve({}, Config, {})[0] as { divisions: string[] }
    expect(resolved.divisions).toContain('research')
  })

  it('宿主插件声明 settings 依赖，避免工具读取 locale 时被 Cordis 拒绝', () => {
    expect(inject).toEqual(['tools', 'subagents', 'systemPrompt', 'settings'])
  })

  it('客户端声明会话与会话输入服务，允许工具栏在 session slot 内插入引用', () => {
    expect(clientInject).toContain('sessions')
    expect(clientInject).toContain('conversation')
  })
})

describe('DSH settings 兼容层', () => {
  it('RC 使用旧模块 helper 与 branded namespace', () => {
    const calls: unknown[][] = []
    const namespace = settingsNamespaceCompat('agency-agents', {
      settingsNamespace: (value: string) => `legacy:${value}`,
    })
    const ctx = {} as Context
    const schema = {}
    const entry = { enabled: [] as string[] }
    const hooks = { setSource: () => {}, onChange: () => {} }
    installSettingsSectionCompat(ctx, namespace, schema, entry, hooks, {
      installSettingsSection: (...args: unknown[]) => { calls.push(args) },
    })

    expect(namespace).toBe('legacy:agency-agents')
    expect(calls).toEqual([[ctx, namespace, schema, entry, hooks]])
  })

  it('alpha.2 使用纯字符串 namespace 与 settings.installSection', () => {
    const calls: unknown[][] = []
    const namespace = settingsNamespaceCompat('agency-agents', {})
    const ctx = {
      settings: { installSection: (...args: unknown[]) => { calls.push(args) } },
    } as unknown as Context
    const schema = {}
    const entry = { enabled: [] as string[] }
    const hooks = { setSource: () => {}, onChange: () => {} }
    installSettingsSectionCompat(ctx, namespace, schema, entry, hooks, {})

    expect(namespace).toBe('agency-agents')
    expect(calls).toEqual([[ctx, namespace, schema, entry, hooks]])
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
    const parsed = parseFrontmatter('---\nname: X\ndescription: D\ndescriptionEn: E\nemoji: "📘"\n---\nbody')
    expect(parsed?.name).toBe('X')
    expect(parsed?.description).toBe('D')
    expect(parsed?.descriptionEn).toBe('E')
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
    await writeFile(join(dir, 'game-development', 'economy-designer.md'), '---\nname: E\ndescription: 中文简介\ndescriptionEn: English intro\n---\nbody', 'utf8')
    await writeFile(join(dir, 'game-development', 'unity', 'unity-architect.md'), '---\nname: U\ndescription: d\n---\nbody', 'utf8')
    const map = await loadCatalog(dir, ['game-development'])
    expect(map.has('economy-designer')).toBe(true)
    expect(map.get('economy-designer')?.descriptionEn).toBe('English intro')
    expect(map.has('unity-architect')).toBe(true)
    expect(map.get('unity-architect')?.division).toBe('game-development')
  })

  it('不将 integrations/mcp-memory 转换输出作为工程专家加载', async () => {
    await mkdir(join(dir, 'engineering'), { recursive: true })
    await mkdir(join(dir, 'integrations', 'mcp-memory'), { recursive: true })
    await writeFile(join(dir, 'engineering', 'engineering-backend-architect.md'), '---\nname: Backend Architect\ndescription: d\n---\nbody', 'utf8')
    await writeFile(join(dir, 'integrations', 'mcp-memory', 'backend-architect-with-memory.md'), '---\nname: Backend Architect\ndescription: d\n---\nbody', 'utf8')
    const map = await loadCatalog(dir, ['engineering'])
    expect(map.has('engineering-backend-architect')).toBe(true)
    expect(map.has('backend-architect-with-memory')).toBe(false)
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

  it('同 slug 冲突时按文件名排序确定覆盖顺序', async () => {
    await mkdir(join(dir, 'engineering', 'z-sub'), { recursive: true })
    await writeFile(join(dir, 'engineering', 'reviewer.md'), '---\nname: Root\ndescription: d\n---\nbody', 'utf8')
    await writeFile(join(dir, 'engineering', 'z-sub', 'reviewer.md'), '---\nname: Sub\ndescription: d\n---\nbody', 'utf8')
    // 'reviewer.md' 按文件名排在 'z-sub' 之前，子目录中的同名文件后加载并覆盖
    const map = await loadCatalog(dir, ['engineering'])
    expect(map.get('reviewer')?.name).toBe('Sub')
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
    expect(() => resolveExpert(experts, 'missing')).toThrow(formatHost('zh', 'error.expertMissing', { query: 'missing' }))
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
    expect(text({ agent: { session: { header: {} } } })).toContain('summon_experts')
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

    expect(() => apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'], maxDepth: 0 })).toThrow(formatHost('zh', 'error.maxDepth'))
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
    ['expert personas', { persona: false, toolFilter: true, depthLimit: true }, undefined, formatHost('zh', 'error.providerNoPersona', { provider: 'spawn' })],
    ['toolFilter', { persona: true, toolFilter: false, depthLimit: true }, undefined, formatHost('zh', 'error.providerNoToolFilter', { provider: 'spawn' })],
    ['maxDepth', { persona: true, toolFilter: true, depthLimit: false }, 1, formatHost('zh', 'error.providerNoMaxDepth', { provider: 'spawn' })],
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

  it('单条召唤拒绝空任务与超长任务，与批量上限一致', async () => {
    const tools: unknown[] = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: {
        getProvider: () => ({ capabilities: { persona: true, toolFilter: true, depthLimit: true } }),
        start: async () => { throw new Error('must not start') },
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

    await expect(summon.execute({ expert: 'reviewer', task: '   ' }, { agent: {} })).rejects.toThrow(formatHost('zh', 'error.taskRequired'))
    const longTask = '汉'.repeat(SUMMON_TASK_MAX_CHARS + 1)
    await expect(summon.execute({ expert: 'reviewer', task: longTask }, { agent: {} })).rejects.toThrow(formatHost('zh', 'error.taskLimit', { length: SUMMON_TASK_MAX_CHARS + 1, max: SUMMON_TASK_MAX_CHARS }))
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

    await expect(summon.execute({ expert: 'reviewer', task: 'review' }, { agent: {} })).rejects.toThrow(formatHost('zh', 'error.expertRun', { reason: 'cancelled', detail: formatHost('zh', 'error.partialOutput', { text: 'partial result' }) }))
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
    const instruction = buildSummonInstruction(t, '代码审查专家', '请审查这段代码')
    applyExpertSummon({ inputActions, instruction })
    expect(instruction).toBe('@代码审查专家\n\n请审查这段代码')
    expect(instruction).not.toContain('reviewer')
    expect(calls).toEqual(['setDraft:' + instruction])
    expect(calls).not.toContain('submit')
  })

  it('输入框为空时只回填召唤指令，不发送', () => {
    const calls: string[] = []
    const inputActions = {
      setDraft(draft: string): void { calls.push('setDraft:' + draft) },
      submit(): void { calls.push('submit') },
    }
    const instruction = buildSummonInstruction(t, '代码审查专家', '   ')
    applyExpertSummon({ inputActions, instruction })
    expect(instruction).toBe(t('summon.instruction', { name: '@代码审查专家' }))
    expect(calls).toEqual(['setDraft:' + instruction])
    expect(calls).not.toContain('submit')
  })

  it('没有 inputActions 时只生成指令，不抛错也不发送', () => {
    expect(() => applyExpertSummon({ instruction: t('summon.instruction', { name: '代码审查专家' }) })).not.toThrow()
    expect(() => applyExpertSummon({ inputActions: undefined, instruction: 'noop' })).not.toThrow()
  })
})
describe('宿主 i18n', () => {
  it('zh/en 词条 key 对齐，且只有显式 en 才切换语言', () => {
    expect(Object.keys(zh).sort()).toEqual(Object.keys(en).sort())
    expect(Object.keys(zhHost).sort()).toEqual(Object.keys(enHost).sort())
    expect(Object.hasOwn(zh, 'group.count')).toBe(false)
    expect(resolveHostLocale('en')).toBe('en')
    expect(resolveHostLocale('zh')).toBe('zh')
    expect(resolveHostLocale('en-US')).toBe('zh')
    expect(readHostLocale({})).toBe('zh')
    expect(readHostLocale({ settings: { get: () => ({ preference: 'en' }) } })).toBe('en')
    expect(readHostLocale({ settings: { get: () => { throw new Error('missing') } } })).toBe('zh')
    expect(readHostLocale({
      get settings(): never {
        throw new Error('cannot get property "settings" without inject')
      },
    })).toBe('zh')
  })

  it('中英词条占位符一致，筛选空态跟随「全部」译文', () => {
    const placeholders = (text: string): string[] => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? '').sort()
    for (const key of Object.keys(zh) as AgencyKey[]) {
      expect(placeholders(en[key]), key).toEqual(placeholders(zh[key]))
    }
    for (const key of Object.keys(zhHost) as Array<keyof typeof zhHost>) {
      expect(placeholders(enHost[key]), key).toEqual(placeholders(zhHost[key]))
    }
    expect(zh['settings.empty']).toContain('{all}')
    expect(en['settings.empty']).toContain('{all}')
    expect(en['settings.filter.showing.one']).toBe('Showing {count} expert')
    expect(en['settings.filter.showing.other']).toBe('Showing {count} experts')
  })

  it('分区查询同时认 key、中文名和英文名', () => {
    expect(matchDivision('engineering', 'engineering')).toBe(true)
    expect(matchDivision(' 工程 ', 'engineering')).toBe(true)
    expect(matchDivision('Game Development', 'game-development')).toBe(true)
    expect(matchDivision('en', 'engineering')).toBe(false)
  })

  it('list_experts 渲染按语言切换分区名和外壳句子', () => {
    const value = {
      divisions: [{
        division: 'engineering',
        count: 1,
        experts: [{ slug: 'engineering-code-reviewer', name: '代码审查工程师', emoji: '🔍', description: '中文简介' }],
      }],
      total: 1,
    }
    expect(renderExpertList('zh', {}, value)).toContain('1 位专家，覆盖 1 个分区：')
    expect(renderExpertList('zh', {}, value)).toContain('## 工程（1）')
    expect(renderExpertList('en', {}, value)).toContain('1 experts across 1 divisions:')
    expect(renderExpertList('en', {}, value)).toContain('## Engineering (1)')
    expect(renderExpertList('zh', {}, { divisions: [], total: 0 })).toBe(formatHost('zh', 'list.empty'))
    expect(renderExpertList('en', { division: 'security' }, { divisions: [], total: 0 })).toBe(formatHost('en', 'list.emptyDivision', { division: 'security' }))
  })

  it('resolveExpert 缺省中文报错，显式 en 走英文', () => {
    const experts = [
      { slug: 'a', name: '后端架构师', nameEn: 'Backend Architect' },
      { slug: 'b', name: '后端架构师', nameEn: 'Backend Architect' },
    ]
    expect(() => resolveExpert(experts, '')).toThrow(formatHost('zh', 'error.expertRequired'))
    expect(() => resolveExpert(experts, '', 'en')).toThrow(formatHost('en', 'error.expertRequired'))
    expect(() => resolveExpert(experts, '后端架构师')).toThrow(formatHost('zh', 'error.expertAmbiguous', { query: '后端架构师', candidates: 'a, b' }))
    expect(() => resolveExpert(experts, 'missing', 'en')).toThrow(formatHost('en', 'error.expertMissing', { query: 'missing' }))
  })
})

describe('compareExpertName', () => {
  const a = { name: '安全工程师', nameEn: 'ZZZ Security' }
  const b = { name: '测试工程师', nameEn: 'AAA Test' }

  it('中文界面按中文名排序，英文界面按英文名排序', () => {
    expect(compareExpertName(a, b, 'zh')).toBeLessThan(0)
    expect(compareExpertName(a, b, 'en')).toBeGreaterThan(0)
  })
})

describe('filterExperts', () => {
  const experts = [
    {
      slug: 'engineering-code-reviewer',
      name: '代码审查工程师',
      nameEn: 'Code Reviewer',
      division: 'engineering',
      divisionZh: '工程',
      divisionEn: 'Engineering',
      description: '审查代码并按严重程度列出问题',
      descriptionEn: 'Review code and rank findings by severity',
    },
    {
      slug: 'academic-historian',
      name: '历史学家',
      nameEn: 'Historian',
      division: 'academic',
      divisionZh: '学术',
      divisionEn: 'Academic',
      description: '梳理历史分期与史料',
      descriptionEn: 'Trace historical periods and sources',
    },
  ]

  it('空检索返回全部专家', () => {
    expect(normalizeExpertQuery('  UI  ')).toBe('ui')
    expect(filterExperts(experts, { query: '   ' })).toHaveLength(2)
  })

  it('按中文名、英文名和简介匹配', () => {
    expect(matchExpertQuery(experts[0]!, '审查')).toBe(true)
    expect(filterExperts(experts, { query: 'Historian' }).map((item) => item.slug)).toEqual(['academic-historian'])
    expect(filterExperts(experts, { query: 'engineering-code' })).toEqual([])
    expect(filterExperts(experts, { query: 'severity' }).map((item) => item.slug)).toEqual(['engineering-code-reviewer'])
  })

  it('中英分区名都能检索到对应专家', () => {
    expect(filterExperts(experts, { query: '工程' }).map((item) => item.slug)).toEqual(['engineering-code-reviewer'])
    expect(filterExperts(experts, { query: 'Engineering' }).map((item) => item.slug)).toEqual(['engineering-code-reviewer'])
    expect(filterExperts(experts, { query: 'Academic' }).map((item) => item.slug)).toEqual(['academic-historian'])
  })

  it('分类与检索同时生效，无匹配时返回空列表', () => {
    expect(filterExperts(experts, { division: 'academic' }).map((item) => item.slug)).toEqual(['academic-historian'])
    expect(filterExperts(experts, { division: 'academic', query: 'review' })).toEqual([])
    expect(filterExperts(experts, { division: 'engineering', query: 'CODE' }).map((item) => item.slug)).toEqual(['engineering-code-reviewer'])
  })
})
describe('@ 菜单分组标题本地化', () => {
  it('按当前语言返回分区显示名，未知分区回退原值', () => {
    expect(inputTriggerSourceName('design', 'zh')).toBe('设计')
    expect(inputTriggerSourceName('design', 'en')).toBe('Design')
    expect(inputTriggerSourceName('custom', 'zh')).toBe('custom')
  })

  it('把 emoji 合并到可见名称，并在选中时恢复纯专家名', () => {
    const expert = { name: '代码审查工程师', nameEn: 'Code Reviewer', emoji: '🔍' }
    expect(inputTriggerCandidateName(expert, 'zh')).toBe('🔍 代码审查工程师')
    expect(inputTriggerCandidateName(expert, 'en')).toBe('🔍 Code Reviewer')
    expect(inputTriggerPickName('engineering-code-reviewer', '🔍 代码审查工程师', 'zh')).toBe('代码审查工程师')
    expect(inputTriggerPickName('engineering-code-reviewer', '🔍 Code Reviewer', 'en')).toBe('Code Reviewer')
    expect(inputTriggerPickName('missing', '未知专家', 'zh')).toBe('未知专家')
  })

  it('将专家名称格式化为 @ 提及，并只把已启用专家加入输入框词典', () => {
    const experts = [
      { slug: 'engineering-code-reviewer', name: '代码审查工程师', nameEn: 'Code Reviewer' },
      { slug: 'design-creative-designer', name: '创意设计师', nameEn: 'Creative Designer' },
    ]

    expect(formatExpertMention('创意设计师')).toBe('@创意设计师')
    expect(formatExpertMention('@创意设计师')).toBe('@创意设计师')
    expect(formatExpertMentionInsertion('创意设计师')).toBe('@创意设计师 ')
    expect(buildExpertMentionLexicon(experts, new Set(['design-creative-designer']), 'zh')).toEqual(['创意设计师'])
    expect(buildExpertMentionLexicon(experts, new Set(['design-creative-designer']), 'en')).toEqual(['Creative Designer'])
  })

  it('将专家插入投影为带图标的原生引用 chip，内部 ID 不泄露到文本', () => {
    const expert = {
      slug: 'engineering-code-reviewer',
      name: '代码审查工程师',
      nameEn: 'Code Reviewer',
      emoji: '🔍',
      division: 'engineering',
    }

    expect(inputTriggerSourceId('engineering')).toBe('@michengai/dsh-agency-agents:engineering')
    expect(buildExpertReference(expert, 'zh')).toEqual({
      source: '@michengai/dsh-agency-agents:engineering',
      ref: 'engineering-code-reviewer',
      label: '代码审查工程师',
      appearance: 'session',
      clipboardText: '@代码审查工程师',
    })
    expect(buildExpertReference(expert, 'en')).toMatchObject({
      source: '@michengai/dsh-agency-agents:engineering',
      label: 'Code Reviewer',
      appearance: 'session',
      clipboardText: '@Code Reviewer',
    })
  })

  it('工具栏选择专家时直接插入原生引用，不写入会再次触发菜单的普通 @ 文本', () => {
    const calls: unknown[] = []
    const reference = {
      source: '@michengai/dsh-agency-agents:engineering',
      ref: 'engineering-code-reviewer',
      label: '代码审查工程师',
      appearance: 'session' as const,
      clipboardText: '@代码审查工程师',
    }
    const target = {
      state: { getSnapshot: () => ({ draftRev: 42 }) },
      insertReference: (value: unknown, span: unknown): boolean => {
        calls.push(value, span)
        return true
      },
    }

    expect(insertExpertReference(target, reference)).toBe(true)
    expect(calls).toEqual([reference, { start: 0, end: 0, draftRev: 42 }])
    expect(insertExpertReference(undefined, reference)).toBe(false)
  })

  it('slot 未提供 sessionId 时回退解析当前会话输入机', () => {
    const actx = {} as Context
    const target = {
      state: { getSnapshot: () => ({ draftRev: 1 }) },
      insertReference: (): boolean => true,
    }
    const calls: string[] = []

    const resolved = resolveReferenceInsertionTarget({
      list: { getSnapshot: () => ({ current: 'current-session' as SessionId }) },
      binding: (id: string) => {
        calls.push(id)
        return { ctx: actx }
      },
    }, {
      input: { for: (context: Context) => context === actx ? target : undefined },
    })

    expect(resolved).toBe(target)
    expect(calls).toEqual(['current-session'])
  })

  it('打开专家菜单时保持编辑器焦点，保证候选项可定位 chip 插入位置', () => {
    let prevented = false

    keepComposerFocus({ preventDefault: () => { prevented = true } })

    expect(prevented).toBe(true)
  })
})

describe('list_experts 语言切换', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'aag-'))
    await mkdir(join(dir, 'engineering'), { recursive: true })
    await writeFile(join(dir, 'engineering', 'engineering-code-reviewer.md'), '---\nname: Code Reviewer\ndescription: 中文简介\ndescriptionEn: English intro\nemoji: "🔍"\n---\nbody', 'utf8')
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  function install(locale?: 'zh' | 'en'): {
    list: {
      execute: (args: unknown) => Promise<{ divisions: Array<{ division: string; count: number; experts?: Array<{ slug: string; name: string; description: string }> }>; total: number }>
      output: { render: (args: unknown, value: unknown) => Array<{ type: string; text: string }> }
    }
  } {
    const tools: unknown[] = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: { getProvider: () => undefined },
      systemPrompt: { section: () => undefined },
      settings: locale === undefined ? undefined : { get: (ns: string) => ns === 'locale' ? { preference: locale } : undefined },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['engineering-code-reviewer'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context
    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'] })
    const list = tools.find((tool) => (tool as { name?: string }).name === 'list_experts') as {
      execute: (args: unknown) => Promise<{ divisions: Array<{ division: string; count: number; experts?: Array<{ slug: string; name: string; description: string }> }>; total: number }>
      output: { render: (args: unknown, value: unknown) => Array<{ type: string; text: string }> }
    }
    return { list }
  }

  it('默认中文：可用中文分区名筛选，并返回中文名和简介', async () => {
    const { list } = install()
    const result = await list.execute({ division: '工程' })
    expect(result).toMatchObject({
      divisions: [{
        division: 'engineering',
        experts: [{ slug: 'engineering-code-reviewer', name: '代码审查工程师', description: '中文简介' }],
      }],
      total: 1,
    })
    expect(list.output.render({ division: '工程' }, result)[0]?.text).toContain('## 工程（1）')
  })

  it('settings locale=en 时返回英文名和简介，分区标题用英文', async () => {
    const { list } = install('en')
    const result = await list.execute({ division: 'engineering' })
    expect(result.divisions[0]?.experts).toEqual([
      { slug: 'engineering-code-reviewer', name: 'Code Reviewer', emoji: '🔍', description: 'English intro' },
    ])
    expect(list.output.render({ division: 'engineering' }, result)[0]?.text).toContain('## Engineering (1)')
  })
})


describe('validateSummonSpecs', () => {
  it('拒绝空数组、超量专家、空任务和超长任务', () => {
    expect(() => validateSummonSpecs([], 'zh')).toThrow(formatHost('zh', 'error.expertsEmpty'))
    const tooMany = Array.from({ length: SUMMON_EXPERTS_MAX + 1 }, (_, index) => ({ expert: `e${index}`, task: 'do' }))
    expect(() => validateSummonSpecs(tooMany, 'zh')).toThrow(formatHost('zh', 'error.expertsTooMany', { max: SUMMON_EXPERTS_MAX, count: SUMMON_EXPERTS_MAX + 1 }))
    expect(() => validateSummonSpecs([{ expert: 'reviewer', task: '   ' }], 'zh')).toThrow(formatHost('zh', 'error.taskEmpty', { index: 1 }))
    const longTask = '汉'.repeat(SUMMON_TASK_MAX_CHARS + 1)
    expect(() => validateSummonSpecs([{ expert: 'reviewer', task: longTask }], 'en')).toThrow(formatHost('en', 'error.taskTooLong', { index: 1, length: SUMMON_TASK_MAX_CHARS + 1, max: SUMMON_TASK_MAX_CHARS }))
  })

  it('拒绝缺失或空白的专家名', () => {
    expect(() => validateSummonSpecs([{ task: 'do' }], 'zh')).toThrow(formatHost('zh', 'error.expertEmpty', { index: 1 }))
    expect(() => validateSummonSpecs([{ expert: '   ', task: 'do' }], 'zh')).toThrow(formatHost('zh', 'error.expertEmpty', { index: 1 }))
    expect(() => validateSummonSpecs([{ expert: 'reviewer', task: 'do' }, { expert: null, task: 'do' }], 'en')).toThrow(formatHost('en', 'error.expertEmpty', { index: 2 }))
  })

  it('接受上限数量的合法任务', () => {
    const specs = Array.from({ length: SUMMON_EXPERTS_MAX }, (_, index) => ({ expert: `e${index}`, task: 'review' }))
    expect(validateSummonSpecs(specs, 'zh')).toHaveLength(SUMMON_EXPERTS_MAX)
  })
})

describe('mapPool', () => {
  it('并发不超过上限，且保持输入顺序', async () => {
    let inflight = 0
    let peak = 0
    const values = await mapPool([1, 2, 3, 4, 5], 2, async (item) => {
      inflight += 1
      peak = Math.max(peak, inflight)
      await new Promise((resolve) => setTimeout(resolve, 20))
      inflight -= 1
      return item * 10
    })
    expect(values).toEqual([10, 20, 30, 40, 50])
    expect(peak).toBeLessThanOrEqual(2)
    expect(SUMMON_EXPERTS_CONCURRENCY).toBe(4)
  })
})

describe('toSummonItemResult / renderSummonResults', () => {
  it('成功项保留答案，失败项走失败词条', () => {
    const ok = toSummonItemResult('reviewer', { expert: 'reviewer', answer: 'done' })
    const failed = toSummonItemResult('historian', new Error('boom'))
    expect(ok).toEqual({ expert: 'reviewer', ok: true, answer: 'done' })
    expect(failed).toEqual({ expert: 'historian', ok: false, answer: '', error: 'boom' })
    const text = renderSummonResults('zh', [ok, failed])
    expect(text).toContain('## reviewer\ndone')
    expect(text).toContain(formatHost('zh', 'list.expertFailed', { error: 'boom' }))
  })
})

describe('summon_experts', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'aag-'))
    await mkdir(join(dir, 'engineering'), { recursive: true })
    await writeFile(join(dir, 'engineering', 'reviewer.md'), '---\nname: Reviewer\ndescription: d\n---\nbody', 'utf8')
    await writeFile(join(dir, 'engineering', 'historian.md'), '---\nname: Historian\ndescription: d\n---\nbody', 'utf8')
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('一名专家失败时仍返回其余成功结果', async () => {
    const tools: unknown[] = []
    const ctx = {
      tools: { register: (tool: unknown) => tools.push(tool) },
      subagents: {
        getProvider: () => ({ capabilities: { persona: true, toolFilter: true, depthLimit: true } }),
        start: async (_provider: string, options: { label?: string }) => {
          if (options.label === 'expert:historian') {
            return {
              result: Promise.resolve({ output: [{ type: 'text', text: 'partial' }], stopReason: 'cancelled' }),
              dispose: async () => undefined,
            }
          }
          return {
            result: Promise.resolve({ output: [{ type: 'text', text: 'ok-review' }], stopReason: 'completed' }),
            dispose: async () => undefined,
          }
        },
      },
      systemPrompt: { section: () => undefined },
      inject: (_deps: unknown, cb: (sctx: unknown) => void) => {
        cb({ settings: { register: () => ({ get: () => ({ enabled: ['reviewer', 'historian'] }), watch: () => () => {} }) }, effect: () => () => {} })
      },
      reflect: { provide: () => undefined },
    } as unknown as Context

    apply(ctx, { root: dir, provider: 'spawn', divisions: ['engineering'] })
    const summon = tools.find((tool) => (tool as { name?: string }).name === 'summon_experts') as {
      execute: (args: unknown, exec: unknown) => Promise<{ results: Array<{ expert: string; ok: boolean; answer: string; error?: string }> }>
      output: { render: (args: unknown, value: unknown) => Array<{ type: string; text: string }> }
    }

    const value = await summon.execute({
      experts: [
        { expert: 'reviewer', task: 'review' },
        { expert: 'historian', task: 'summarize' },
      ],
    }, { agent: {} })
    expect(value.results).toEqual([
      { expert: 'reviewer', ok: true, answer: 'ok-review' },
      { expert: 'historian', ok: false, answer: '', error: formatHost('zh', 'error.expertRun', { reason: 'cancelled', detail: formatHost('zh', 'error.partialOutput', { text: 'partial' }) }) },
    ])
    expect(summon.output.render({}, value)[0]?.text).toContain('ok-review')
    expect(summon.output.render({}, value)[0]?.text).toContain('失败')
  })
})
