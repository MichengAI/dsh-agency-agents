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
 * @module @deepseek-ai/dsh-agency-agents
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import type { SubagentRun } from '@deepseek-ai/dsh-subagent'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

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

/** 额外扫描的源目录：不在标准 division 内、但仍是合法专家的集成（如 mcp-memory）。 */
const EXTRA_SOURCES: ReadonlyArray<{ readonly dir: string; readonly division: string }> = [
  { dir: 'integrations/mcp-memory', division: 'engineering' },
]

/** 描述截断上限，避免无过滤列出全量专家时 token 开销过大。 */
const DESCRIPTION_LIMIT = 120

/** One resolved expert ready to be summoned. */
interface Expert {
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly emoji: string
  readonly division: string
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
  /** 可选的绝对子代理深度上限；未设置时沿用 provider 的默认行为。 */
  maxDepth?: number
}

/** 未在配置中显式提供 `root` 时，先读取该环境变量，再使用随包发布的专家目录。 */
const ROOT_ENV = 'AGENCY_AGENTS_ROOT'
const BUNDLED_ROOT = fileURLToPath(new URL('../assets/agency-agents/', import.meta.url))

export const Config: z<Config> = z.object({
  root: z.string().default(process.env[ROOT_ENV] ?? ''),
  provider: z.string().default('spawn'),
  divisions: z.array(z.string()).default(DEFAULT_DIVISIONS),
  maxDepth: z.natural(),
})

/** 解析专家根目录：显式配置优先，其次使用包内资产。 */
export function resolveCatalogRoot(root: string): string {
  return root.trim() === '' ? BUNDLED_ROOT : root
}

interface Frontmatter {
  name?: string
  description?: string
  emoji?: string
  vibe?: string
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
  return text.length <= limit ? text : `${text.slice(0, limit)}…`
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
  return { name: get('name'), description: get('description'), emoji: get('emoji'), vibe: get('vibe'), body }
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
    throw new Error(`专家目录 root 不存在或无法访问："${root}"。请设置环境变量 ${ROOT_ENV} 或提供正确路径。`)
  }
  if (!info.isDirectory()) {
    throw new Error(`专家目录 root "${root}" 不是目录`)
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
        console.warn(`[agency-agents] 跳过无法读取的专家文件 ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
        return
      }
      const parsed = parseFrontmatter(raw)
      if (parsed === undefined || parsed.name === undefined || parsed.description === undefined) return
      if (map.has(slug)) {
        console.warn(`[agency-agents] 专家 slug 冲突，后加载者覆盖：${slug}`)
      }
      map.set(slug, {
        slug,
        name: parsed.name,
        description: parsed.description,
        emoji: parsed.emoji ?? '',
        division: source.division,
        persona: sanitize(parsed.body),
      })
    })
  }
  if (map.size === 0) {
    throw new Error(`在 root "${root}" 下未发现任何专家（*.md 文件）。请确认路径正确。`)
  }
  return map
}

/** 根据 slug 或名称解析专家；任意多命中都必须要求调用者提供更精确的 slug。 */
export function resolveExpert<T extends { readonly slug: string; readonly name: string }>(experts: readonly T[], query: unknown): T {
  const q = String(query).trim().toLowerCase()
  if (q.length === 0) throw new Error('expert is required')
  const bySlug = experts.find((expert) => expert.slug === q)
  if (bySlug !== undefined) return bySlug
  const exactNames = experts.filter((expert) => expert.name.toLowerCase() === q)
  if (exactNames.length === 1) return exactNames[0]
  const matches = exactNames.length > 1
    ? exactNames
    : experts.filter((expert) => expert.slug.includes(q) || expert.name.toLowerCase().includes(q))
  if (matches.length === 1) return matches[0]
  if (matches.length > 1) {
    const preview = matches.slice(0, 12).map((expert) => expert.slug).join(', ')
    throw new Error(`Ambiguous expert "${String(query)}"; candidates: ${preview}. Use list_experts to pick an exact slug.`)
  }
  throw new Error(`No expert matched "${String(query)}". Call list_experts to see the roster.`)
}

export function apply(ctx: Context, config: Config): void {
  let experts = new Map<string, Expert>()
  let loadError: string | null = null
  const ready = loadCatalog(resolveCatalogRoot(config.root), config.divisions)
    .then((map) => { experts = map })
    .catch((error: unknown) => { loadError = String(error) })

  async function ensureReady(): Promise<void> {
    await ready
    if (loadError !== null) throw new Error(`agency-agents catalog failed to load: ${loadError}`)
  }

  function groupByDivision(withExperts: boolean): Array<{ division: string; count: number; experts?: Array<{ slug: string; name: string; emoji: string; description: string }> }> {
    const groups = new Map<string, Expert[]>()
    for (const expert of experts.values()) {
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
            .map((e) => ({ slug: e.slug, name: e.name, emoji: e.emoji, description: truncate(e.description, DESCRIPTION_LIMIT) })),
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
      render: (_args, value) => {
        const divisions = value.divisions as Array<{ division: string; count: number; experts?: Array<{ slug: string; name: string; emoji: string; description: string }> }>
        if (divisions.length === 0) return [{ type: 'text', text: 'No experts available.' }]
        const lines: string[] = []
        for (const group of divisions) {
          lines.push(`## ${group.division} (${group.count})`)
          for (const expert of group.experts ?? []) {
            lines.push(`- ${expert.emoji ? `${expert.emoji} ` : ''}${expert.name} — \`${expert.slug}\` — ${expert.description}`)
          }
        }
        lines.unshift(`${value.total as number} experts across ${divisions.length} divisions:`)
        return [{ type: 'text', text: lines.join('\n') }]
      },
    },
    async execute(args) {
      await ensureReady()
      const hasFilter = args.division !== undefined && String(args.division).trim() !== ''
      const groups = groupByDivision(hasFilter)
      if (hasFilter) {
        const q = String(args.division).toLowerCase()
        const filtered = groups.filter((g) => {
          const division = g.division.toLowerCase()
          return division === q || division.includes(q)
        })
        return { divisions: filtered, total: filtered.reduce((n, g) => n + g.count, 0) }
      }
      return { divisions: groups, total: experts.size }
    },
  }))

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
      if (exec.agent === undefined) throw new Error('summon_expert requires a calling agent')
      const provider = ctx.subagents.getProvider(config.provider)
      if (provider === undefined) {
        throw new Error(`subagent provider "${config.provider}" is not registered`)
      }
      if (!provider.capabilities.persona) {
        throw new Error(`subagent provider "${config.provider}" does not support expert personas`)
      }
      if (!provider.capabilities.toolFilter) {
        throw new Error(`subagent provider "${config.provider}" cannot prevent recursive expert delegation`)
      }
      if (config.maxDepth !== undefined && !provider.capabilities.depthLimit) {
        throw new Error(`subagent provider "${config.provider}" does not support maxDepth`)
      }
      const expert = resolveExpert([...experts.values()], args.expert)
      const run: SubagentRun = await ctx.subagents.start(config.provider, {
        label: `expert:${expert.slug}`,
        prompt: [{ type: 'text', text: String(args.task) }],
        parent: exec.agent,
        persona: expert.persona,
        toolFilter: { deny: ['summon_expert'] },
        ...config.maxDepth === undefined ? {} : { maxDepth: config.maxDepth },
        signal: exec.signal,
      })
      try {
        const result = await run.result
        const text = textBlocks(result.output)
        if (result.stopReason !== 'completed') {
          const detail = text.length > 0 ? `\nPartial output:\n${text}` : ''
          throw new Error(`expert run ended with "${result.stopReason}"${detail}`)
        }
        return { expert: expert.slug, answer: text }
      } finally {
        await run.dispose()
      }
    },
  }))

  ctx.systemPrompt.section({
    name: 'agency:experts',
    order: 117,
    text: '## Agency expert mode\nYou have a roster of domain experts from The Agency (specialists across 17 divisions). Summon one to delegate a whole task by calling `summon_expert(expert, task)` — the expert runs as a specialist subagent with its own persona and returns the result. Call `list_experts()` to see division names and counts, then call `list_experts(division)` to browse experts and find an exact slug. Prefer summoning an expert when a task clearly belongs to a specialist domain. A summoned expert cannot summon another Agency expert, so keep each delegation self-contained.',
  })
}
