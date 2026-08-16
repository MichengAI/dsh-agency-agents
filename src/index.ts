/**
 * Agency Experts — a summonable specialist roster for DSH.
 *
 * Reads The Agency persona collection (a directory of `<division>/*.md` files
 * with YAML frontmatter) and exposes an "expert mode":
 *
 *   - `list_experts(division?)`    browse the roster grouped by division.
 *   - `summon_expert(expert, task)` delegate a task to a subagent whose
 *     persona is that expert's, through the `ctx.subagents` spawn provider.
 *
 * A summoned expert does NOT replace the parent's persona: the child shadows
 * only its own `deployment:persona` section (the `persona` capability on the
 * in-process spawn/fork providers), so it runs with the expert's identity plus
 * the ordinary DSH tool set.
 *
 * Strict `{{...}}` interpolation runs over every system-prompt section, so any
 * complete brace group inside expert prose would throw at assembly. A
 * zero-width space is inserted between the opening braces so the text stays
 * visually identical while the interpolator no longer sees a `{{`.
 *
 * @module @michengai/dsh-agency-agents
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ToolRunContext } from '@deepseek-ai/dsh-tools'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import type { SubagentRun } from '@deepseek-ai/dsh-subagent'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZH_DIVISION, ZH_NAME } from './names.js'
import { formatHost, localizedExpertDescription, localizedExpertName, matchDivision, readHostLocale, renderExpertList, type LocaleId } from './i18n.js'

export const name = 'agency-agents'
export const inject = ['tools', 'subagents', 'systemPrompt']

const DEFAULT_DIVISIONS = [
  'academic',
  'design',
  'engineering',
  'finance',
  'game-development',
  'gis',
  'healthcare',
  'marketing',
  'paid-media',
  'product',
  'project-management',
  'sales',
  'security',
  'spatial-computing',
  'specialized',
  'support',
  'testing',
]

/** 额外扫描的源目录：不在标准 division 内、但仍是合法智能体的集成（如 mcp-memory）。 */
const EXTRA_SOURCES: ReadonlyArray<{ readonly dir: string; readonly division: string }> = [
  { dir: 'integrations/mcp-memory', division: 'engineering' },
]

/** 描述截断上限，避免无过滤列出全量智能体时 token 开销过大。 */
const DESCRIPTION_LIMIT = 120

/** One resolved expert ready to be summoned. */
interface Expert {
  readonly slug: string
  readonly name: string
  readonly nameEn: string
  readonly description: string
  readonly descriptionEn: string
  readonly emoji: string
  readonly division: string
  readonly divisionZh: string
  readonly persona: string
}

/** Plugin config: the persona root, the subagent provider, and the divisions to scan. */
export interface Config {
  /** Directory holding the `division/*.md` persona files. */
  root: string
  /** `ctx.subagents` provider name (default `spawn`; `fork` also supports `persona`). */
  provider: string
  /** Division directory names to scan under `root`. */
  divisions: string[]
  /** 可选的正整数绝对子代理深度上限；未设置时沿用 provider 的默认行为。 */
  maxDepth?: number
}

/** 未在配置中显式提供 `root` 时，先读取该环境变量，再使用随包发布的智能体目录。 */
const ROOT_ENV = 'AGENCY_AGENTS_ROOT'
const BUNDLED_ROOT = fileURLToPath(new URL('../assets/agency-agents/', import.meta.url))

export const Config: z<Config> = z.object({
  root: z.string().default(''),
  provider: z.string().default('spawn'),
  divisions: z.array(z.string()).default(DEFAULT_DIVISIONS),
  maxDepth: z.natural().min(1),
})

/** 解析智能体根目录：显式配置优先，其次读取环境变量，最后使用包内资产。 */
export function resolveCatalogRoot(root: string): string {
  if (root.trim() !== '') return root
  const environmentRoot = process.env[ROOT_ENV]?.trim()
  return environmentRoot === undefined || environmentRoot === '' ? BUNDLED_ROOT : environmentRoot
}

/** 规范化可选深度上限：配置表单的空值等同于未设置，其他值必须允许至少一层子代理。 */
function normalizeMaxDepth(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
    throw new Error(formatHost('zh', 'error.maxDepth'))
  }
  return value
}

interface Frontmatter {
  name?: string
  description?: string
  descriptionEn?: string
  emoji?: string
  body: string
}

/** Neutralize strict `{{...}}` template interpolation inside expert prose. */
export function sanitize(text: string): string {
  // 逐个匹配「后面紧跟 {」的 {，避免三连花括号 '{{{' 残留 '{{'
  return text.replace(/\{(?=\{)/g, '{\u200B')
}

/** 去除 UTF-8 BOM，避免 `^---` 因文件头部的零宽字符失配。 */
export function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text
}

/** 剥离字段值首尾的成对引号，保留引号内部的 #、冒号等字符。 */
export function unquote(value: string): string {
  const first = value.charAt(0)
  if ((first === '"' || first === "'") && value.length >= 2 && value.endsWith(first)) {
    return value.slice(1, -1)
  }
  return value
}

/** 将超长文本截断到指定长度并追加省略号。 */
export function truncate(text: string, limit: number): string {
  const codePoints = Array.from(text)
  return codePoints.length <= limit ? text : `${codePoints.slice(0, limit).join('')}…`
}

/** Parse the `key: value` frontmatter block of one agency agent file. */
export function parseFrontmatter(raw: string): Frontmatter | undefined {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (match === null) return undefined
  const fm = match[1]
  const body = match[2].trim()
  const get = (key: string): string | undefined => {
    const m = fm.match(new RegExp(`^${key}\\s*:\\s*(.*)$`, 'm'))
    return m === null ? undefined : unquote(m[1].trim())
  }
  return { name: get('name'), description: get('description'), descriptionEn: get('descriptionEn'), emoji: get('emoji'), body }
}

/** Concatenate the text blocks of a subagent output. */
function textBlocks(blocks: readonly ContentBlock[]): string {
  return blocks
    .filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text')
    .map((block) => block.text)
    .join('')
}

/** 校验 root 目录存在且为目录，否则抛出明确错误（避免静默得到空列表）。 */
async function assertDirectory(root: string): Promise<void> {
  const info = await stat(root).catch(() => undefined)
  if (info === undefined) {
    throw new Error(formatHost('zh', 'error.rootMissing', { root, env: ROOT_ENV }))
  }
  if (!info.isDirectory()) {
    throw new Error(formatHost('zh', 'error.rootNotDir', { root }))
  }
}

/** 递归遍历目录下的所有 .md 文件，逐个回调其绝对路径与文件名。 */
async function walkMarkdown(dir: string, onFile: (filePath: string, fileName: string) => Promise<void>): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error: unknown) => {
    console.warn(`[agency-agents] 跳过无法读取的目录 ${dir}: ${error instanceof Error ? error.message : String(error)}`)
    return undefined
  })
  if (entries === undefined) return
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkMarkdown(full, onFile)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      await onFile(full, entry.name)
    }
  }
}

/** Load every `<division>/**\/*.md` persona file (plus extra sources) into a slug-keyed map. Throws when root is invalid or empty. */
export async function loadCatalog(root: string, divisions: readonly string[]): Promise<Map<string, Expert>> {
  await assertDirectory(root)

  const sources: Array<{ dir: string; division: string }> = [
    ...divisions.map((division) => ({ dir: division, division })),
    ...EXTRA_SOURCES.filter((source) => divisions.includes(source.division)),
  ]
  const map = new Map<string, Expert>()
  for (const source of sources) {
    await walkMarkdown(join(root, source.dir), async (filePath, fileName) => {
      const slug = fileName.slice(0, -3)
      let raw: string
      try {
        raw = stripBom(await readFile(filePath, 'utf8'))
      } catch (error: unknown) {
        console.warn(`[agency-agents] 跳过无法读取的智能体文件 ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
        return
      }
      const parsed = parseFrontmatter(raw)
      if (parsed === undefined || parsed.name === undefined || parsed.description === undefined) return
      if (map.has(slug)) {
        console.warn(`[agency-agents] 智能体 slug 冲突，后加载者覆盖：${slug}`)
      }
      map.set(slug, {
        slug,
        name: ZH_NAME[slug] ?? parsed.name,
        nameEn: parsed.name,
        description: parsed.description,
        descriptionEn: parsed.descriptionEn ?? '',
        emoji: parsed.emoji ?? '',
        division: source.division,
        divisionZh: ZH_DIVISION[source.division] ?? source.division,
        persona: sanitize(parsed.body),
      })
    })
  }
  if (map.size === 0) {
    throw new Error(formatHost('zh', 'error.catalogEmpty', { root }))
  }
  return map
}

/** 根据 slug 或名称解析智能体；任意多命中都必须要求调用者提供更精确的 slug。 */
export function resolveExpert<T extends { readonly slug: string; readonly name: string; readonly nameEn?: string }>(experts: readonly T[], query: unknown, locale: LocaleId = 'zh'): T {
  const q = String(query).trim().toLowerCase()
  if (q.length === 0) throw new Error(formatHost(locale, 'error.expertRequired'))
  const bySlug = experts.find((expert) => expert.slug.toLowerCase() === q)
  if (bySlug !== undefined) return bySlug
  const exactNames = experts.filter((expert) => expert.name.toLowerCase() === q || expert.nameEn?.toLowerCase() === q)
  if (exactNames.length === 1) return exactNames[0]
  const matches = exactNames.length > 1
    ? exactNames
    : experts.filter((expert) => expert.slug.toLowerCase().includes(q) || expert.name.toLowerCase().includes(q) || expert.nameEn?.toLowerCase().includes(q))
  if (matches.length === 1) return matches[0]
  if (matches.length > 1) {
    const preview = matches.slice(0, 12).map((expert) => expert.slug).join(', ')
    throw new Error(formatHost(locale, 'error.expertAmbiguous', { query: String(query), candidates: preview }))
  }
  throw new Error(formatHost(locale, 'error.expertMissing', { query: String(query) }))
}

export function apply(ctx: Context, config: Config): void {
  const maxDepth = normalizeMaxDepth(config.maxDepth)
  let enabledSource: () => readonly string[] = () => []
  installSettingsSection(ctx, settingsNamespace('agency-agents'), z.object({ enabled: z.array(z.string()) }), { enabled: [] }, {
    setSource: (current) => { enabledSource = () => current().enabled },
    onChange: () => {},
  })
  const enabledSet = (): ReadonlySet<string> => new Set(enabledSource())
  const activeLocale = (): LocaleId => readHostLocale(ctx)
  let experts = new Map<string, Expert>()
  let loadError: string | null = null
  const ready = loadCatalog(resolveCatalogRoot(config.root), config.divisions)
    .then((map) => { experts = map })
    .catch((error: unknown) => { loadError = String(error) })

  async function ensureReady(): Promise<void> {
    await ready
    if (loadError !== null) throw new Error(formatHost(activeLocale(), 'error.catalogLoad', { detail: loadError }))
  }

  function groupByDivision(withExperts: boolean, locale: LocaleId): Array<{ division: string; count: number; experts?: Array<{ slug: string; name: string; emoji: string; description: string }> }> {
    const groups = new Map<string, Expert[]>()
    const enabled = enabledSet()
    for (const expert of experts.values()) {
      if (!enabled.has(expert.slug)) continue
      const list = groups.get(expert.division) ?? []
      list.push(expert)
      groups.set(expert.division, list)
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([division, list]) => ({
        division,
        count: list.length,
        ...(withExperts ? {
          experts: list
            .slice()
            .sort((a, b) => a.slug.localeCompare(b.slug))
            .map((e) => ({ slug: e.slug, name: localizedExpertName(e, locale), emoji: e.emoji, description: truncate(localizedExpertDescription(e, locale), DESCRIPTION_LIMIT) })),
        } : {}),
      }))
  }

  ctx.tools.register(defineTool({
    name: 'list_experts',
    description: 'List the available Agency domain experts grouped by division. Without a division filter it returns only division names and counts (compact); pass a division to expand it with expert names, slugs, and descriptions. Call this before summon_expert when you need an exact expert slug.',
    parameters: {
      division: { type: 'string', description: 'Optional division key to filter (e.g. engineering, marketing, security, finance, design).' },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: { divisions: { type: 'array', required: true, items: { type: 'json' } }, total: { type: 'number', required: true } } },
      render: (args, value) => {
        const divisions = value.divisions as Array<{ division: string; count: number; experts?: Array<{ slug: string; name: string; emoji: string; description: string }> }>
        return [{ type: 'text', text: renderExpertList(activeLocale(), args, { divisions, total: value.total as number }) }]
      },
    },
    async execute(args) {
      await ensureReady()
      const query = args.division === undefined ? '' : String(args.division).trim()
      const hasFilter = query !== ''
      const locale = activeLocale()
      const groups = groupByDivision(hasFilter, locale)
      if (hasFilter) {
        const filtered = groups.filter((g) => matchDivision(query, g.division))
        return { divisions: filtered, total: filtered.reduce((n, g) => n + g.count, 0) }
      }
      return { divisions: groups, total: experts.size }
    },
  }))

  async function runExpert(query: unknown, task: unknown, exec: ToolRunContext): Promise<{ expert: string; answer: string }> {
    const locale = activeLocale()
    if (exec.agent === undefined) throw new Error(formatHost(locale, 'error.summonRequiresAgent'))
    const provider = ctx.subagents.getProvider(config.provider)
    if (provider === undefined) throw new Error(formatHost(locale, 'error.providerMissing', { provider: config.provider }))
    if (!provider.capabilities.persona) throw new Error(formatHost(locale, 'error.providerNoPersona', { provider: config.provider }))
    if (!provider.capabilities.toolFilter) throw new Error(formatHost(locale, 'error.providerNoToolFilter', { provider: config.provider }))
    if (maxDepth !== undefined && !provider.capabilities.depthLimit) throw new Error(formatHost(locale, 'error.providerNoMaxDepth', { provider: config.provider }))
    const expert = resolveExpert([...experts.values()], query, locale)
    if (!enabledSet().has(expert.slug)) throw new Error(formatHost(locale, 'error.expertDisabled', { name: localizedExpertName(expert, locale) }))
    const run: SubagentRun = await ctx.subagents.start(config.provider, {
      label: `expert:${expert.slug}`,
      prompt: [{ type: 'text', text: String(task) }],
      parent: exec.agent,
      persona: expert.persona,
      toolFilter: { deny: ['summon_expert', 'summon_experts', 'list_experts'] },
      ...(maxDepth === undefined ? {} : { maxDepth }),
      signal: exec.signal,
    })
    try {
      const result = await run.result
      const text = textBlocks(result.output)
      if (result.stopReason !== 'completed') {
        const detail = text.length > 0 ? formatHost(locale, 'error.partialOutput', { text }) : ''
        throw new Error(formatHost(locale, 'error.expertRun', { reason: result.stopReason, detail }))
      }
      return { expert: expert.slug, answer: text }
    } finally {
      await run.dispose()
    }
  }

  ctx.tools.register(defineTool({
    name: 'summon_expert',
    description: "Summon a domain expert from The Agency roster to complete a task: a specialist subagent runs with that expert's full persona and returns its result. Use for tasks that clearly belong to a specialist domain (frontend work, security review, marketing copy, etc.). This call waits for the expert's result. Call list_experts first if you do not know the exact expert slug.",
    parameters: {
      expert: { type: 'string', required: true, description: 'Expert slug or name to summon (e.g. engineering-frontend-developer, or "Frontend Developer").' },
      task: { type: 'string', required: true, description: 'The complete, self-contained task to give the expert. Include all necessary context; fork providers may additionally inherit completed conversation turns.' },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: { expert: { type: 'string', required: true }, answer: { type: 'string', required: true } } },
      render: (_args, value) => [{ type: 'text', text: value.answer as string }],
    },
    async execute(args, exec) {
      await ensureReady()
      return runExpert(args.expert, args.task, exec)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'summon_experts',
    description: 'Summon multiple domain experts in parallel to work on one mission. Each expert gets its own task/role and runs as a specialist subagent with its own persona; results are returned per expert. Use this to assemble a specialist team. This call waits for all experts.',
    parameters: {
      experts: {
        type: 'array',
        required: true,
        description: 'The experts to summon, each with an expert slug/name and its own task.',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            expert: { type: 'string', required: true, description: 'Expert slug or name (e.g. engineering-frontend-developer, or "Frontend Developer").' },
            task: { type: 'string', required: true, description: 'The complete, self-contained task/role for this expert.' },
          },
        },
      },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: { results: { type: 'array', required: true, items: { type: 'json' } } } },
      render: (_args, value) => {
        const parts = (value.results as Array<{ expert: string; answer: string }>).map((r) => `## ${r.expert}\n${r.answer}`)
        return [{ type: 'text', text: parts.join('\n\n') }]
      },
    },
    async execute(args, exec) {
      await ensureReady()
      if (exec.agent === undefined) throw new Error(formatHost(activeLocale(), 'error.summonManyRequiresAgent'))
      const specs = args.experts
      if (!Array.isArray(specs) || specs.length === 0) throw new Error(formatHost(activeLocale(), 'error.expertsEmpty'))
      const results = await Promise.all(specs.map((spec) => runExpert(spec.expert, spec.task, exec)))
      return { results }
    },
  }))

  ctx.systemPrompt.section({
    name: 'agency:experts',
    order: 117,
    text: (context) => {
      const agent = (context as { agent?: { session?: { header?: { parentSession?: unknown } } } }).agent
      if (agent?.session?.header?.parentSession !== undefined) return ''
      return '## Agency expert mode\nThe parent session has a roster of domain experts from The Agency (specialists across 17 divisions, individually enable/disable; ALL are disabled by default, and the user enables some in the Agency settings tab). In the parent session, call `list_experts()` to see enabled division names and counts, then call `list_experts(division)` to browse enabled experts and find an exact slug before using `summon_expert(expert, task)`. A disabled expert cannot be summoned.'
    },
  })
}
