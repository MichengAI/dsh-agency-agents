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
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import type { SubagentRun } from '@deepseek-ai/dsh-subagent'
import type {} from '@deepseek-ai/dsh-system-prompt'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZH_DIVISION, ZH_NAME } from './names.js'
export { ZH_NAME }
import { formatHost, localizedExpertDescription, localizedExpertName, matchDivision, readHostLocale, renderExpertList, renderSummonResults, type LocaleId } from './i18n.js'
import { installSettingsSectionCompat, settingsNamespaceCompat } from './settings-compat.js'

export const name = 'agency-agents'
export const inject = ['tools', 'subagents', 'systemPrompt', 'settings']

export const DEFAULT_DIVISIONS = [
  'academic',
  'company',
  'design',
  'engineering',
  'finance',
  'game-development',
  'gis',
  'healthcare',
  'hr',
  'legal',
  'marketing',
  'paid-media',
  'product',
  'project-management',
  'research',
  'sales',
  'security',
  'spatial-computing',
  'specialized',
  'support',
  'supply-chain',
  'testing',
]

/** 描述截断上限，避免无过滤列出全量智能体时 token 开销过大。 */
const DESCRIPTION_LIMIT = 120

/** 一次批量召唤的专家数量上限，避免无界并行拖垮宿主。 */
export const SUMMON_EXPERTS_MAX = 8
/** 批量召唤的并发上限。 */
export const SUMMON_EXPERTS_CONCURRENCY = 4
/** 单条任务的 Unicode 码点上限。 */
export const SUMMON_TASK_MAX_CHARS = 8000

/** 已校验的批量召唤条目。 */
export interface SummonExpertSpec {
  readonly expert: unknown
  readonly task: string
}

/** 批量召唤中单个专家的结果。 */
export interface SummonExpertItemResult {
  readonly expert: string
  readonly ok: boolean
  readonly answer: string
  readonly error?: string
}

/**
 * 校验并规范化任务文本：非空且不超过码点上限。
 * index 存在时使用带序号的批量文案，否则使用单条召唤文案；返回规范化后的字符串。
 */
function normalizeTask(task: unknown, locale: LocaleId, index?: number): string {
  const text = task === undefined || task === null ? '' : String(task)
  const length = Array.from(text).length
  if (text.trim() === '') {
    throw new Error(index === undefined
      ? formatHost(locale, 'error.taskRequired')
      : formatHost(locale, 'error.taskEmpty', { index }))
  }
  if (length > SUMMON_TASK_MAX_CHARS) {
    throw new Error(index === undefined
      ? formatHost(locale, 'error.taskLimit', { length, max: SUMMON_TASK_MAX_CHARS })
      : formatHost(locale, 'error.taskTooLong', { index, length, max: SUMMON_TASK_MAX_CHARS }))
  }
  return text
}

/** 校验批量召唤入参：非空、数量上限、专家名非空、任务非空且不超过码点上限。 */
export function validateSummonSpecs(specs: unknown, locale: LocaleId): SummonExpertSpec[] {
  if (!Array.isArray(specs) || specs.length === 0) {
    throw new Error(formatHost(locale, 'error.expertsEmpty'))
  }
  if (specs.length > SUMMON_EXPERTS_MAX) {
    throw new Error(formatHost(locale, 'error.expertsTooMany', { max: SUMMON_EXPERTS_MAX, count: specs.length }))
  }
  return specs.map((item, index) => {
    const record = item as { expert?: unknown; task?: unknown } | null | undefined
    const expert = record === null || record === undefined ? undefined : record.expert
    if (expert === undefined || expert === null || String(expert).trim() === '') {
      throw new Error(formatHost(locale, 'error.expertEmpty', { index: index + 1 }))
    }
    const task = normalizeTask(record?.task, locale, index + 1)
    return { expert, task }
  })
}

/** 受限并发地映射异步任务，结果顺序与输入一致。 */
export async function mapPool<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return []
  const limit = Math.max(1, Math.min(concurrency, items.length))
  const results = new Array<R>(items.length)
  let next = 0
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const index = next
      next += 1
      if (index >= items.length) return
      results[index] = await mapper(items[index]!, index)
    }
  })
  await Promise.all(workers)
  return results
}

/** 把单次专家运行结果收成批量条目；失败时保留原始查询作为专家名。 */
export function toSummonItemResult(query: unknown, result: { expert: string; answer: string } | Error): SummonExpertItemResult {
  if (result instanceof Error) {
    const expert = String(query ?? '').trim()
    return { expert: expert === '' ? 'unknown' : expert, ok: false, answer: '', error: result.message }
  }
  return { expert: result.expert, ok: true, answer: result.answer }
}
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
const BUNDLED_CHINESE_ROOT = fileURLToPath(new URL('../assets/agency-agents-zh/', import.meta.url))
export const AGENCY_PERSONA_SERVICE = 'agencyAgentsPersona'

export const Config: z<Config> = z.object({
  root: z.string().default(''),
  provider: z.string().default('spawn'),
  divisions: z.array(z.string()).default(DEFAULT_DIVISIONS),
  // schemastery 没有 .optional()：未调用 .required() 的字段本身即可选，缺省不参与校验
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

const EXPERT_PATH_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** 读取一个受允许分区约束的 persona 正文，拒绝路径穿越和无效文档。 */
export async function readExpertPrompt(
  root: string,
  slug: string,
  division: string,
  divisions: readonly string[] = DEFAULT_DIVISIONS,
): Promise<{ prompt: string }> {
  if (!divisions.includes(division) || !EXPERT_PATH_SEGMENT_PATTERN.test(slug)) {
    throw new Error('无效的专家提示词请求。')
  }
  let raw: string
  try {
    raw = stripBom(await readFile(join(root, division, `${slug}.md`), 'utf8'))
  } catch {
    throw new Error('未找到专家提示词。')
  }
  const parsed = parseFrontmatter(raw)
  if (parsed === undefined || parsed.name === undefined || parsed.description === undefined || parsed.body === '') {
    throw new Error('专家提示词格式无效。')
  }
  return { prompt: parsed.body }
}

/** 按界面语言读取 persona；没有中文目录或中文译文时回退主目录正文。 */
export async function readLocalizedExpertPrompt(
  root: string,
  chineseRoot: string | undefined,
  slug: string,
  division: string,
  locale: LocaleId,
  divisions: readonly string[] = DEFAULT_DIVISIONS,
): Promise<{ prompt: string }> {
  if (locale === 'en' || chineseRoot === undefined) return readExpertPrompt(root, slug, division, divisions)
  try {
    return await readExpertPrompt(chineseRoot, slug, division, divisions)
  } catch (error: unknown) {
    if (!(error instanceof Error) || error.message !== '未找到专家提示词。') throw error
    return readExpertPrompt(root, slug, division, divisions)
  }
}

export interface AgencyPersonaSource {
  getPrompt(slug: string, division: string, locale: LocaleId): Promise<{ prompt: string }>
}

/** 创建展示与召唤共用的 persona 来源；外部目录不会混入内置中文翻译。 */
export function createAgencyPersonaSource(root: string, divisions: readonly string[]): AgencyPersonaSource {
  const chineseRoot = resolve(root) === resolve(BUNDLED_ROOT) ? BUNDLED_CHINESE_ROOT : undefined
  return {
    getPrompt: (slug, division, locale) => readLocalizedExpertPrompt(root, chineseRoot, slug, division, locale, divisions),
  }
}

/** Concatenate the text blocks of a subagent output. */
function textBlocks(blocks: readonly ContentBlock[]): string {
  return blocks
    .filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text')
    .map((block) => block.text)
    .join('')
}

/** 校验 root 目录存在且为目录，否则抛出明确错误（避免静默得到空列表）。 */
async function assertDirectory(root: string, locale: LocaleId): Promise<void> {
  const info = await stat(root).catch(() => undefined)
  if (info === undefined) {
    throw new Error(formatHost(locale, 'error.rootMissing', { root, env: ROOT_ENV }))
  }
  if (!info.isDirectory()) {
    throw new Error(formatHost(locale, 'error.rootNotDir', { root }))
  }
}

/** 递归遍历目录下的所有 .md 文件，逐个回调其绝对路径与文件名。 */
async function walkMarkdown(dir: string, onFile: (filePath: string, fileName: string) => Promise<void>): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error: unknown) => {
    console.warn(`[agency-agents] 跳过无法读取的目录 ${dir}: ${error instanceof Error ? error.message : String(error)}`)
    return undefined
  })
  if (entries === undefined) return
  // 排序让 slug 冲突时「后加载者覆盖」的顺序确定，不依赖 readdir 的返回顺序
  entries.sort((a, b) => a.name.localeCompare(b.name))
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkMarkdown(full, onFile)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      await onFile(full, entry.name)
    }
  }
}

/** 加载已配置分区中的所有 persona，按 slug 建立索引；目录无效或为空时抛出明确错误。 */
export async function loadCatalog(root: string, divisions: readonly string[], locale: LocaleId = 'zh'): Promise<Map<string, Expert>> {
  await assertDirectory(root, locale)

  const sources = divisions.map((division) => ({ dir: division, division }))
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
    throw new Error(formatHost(locale, 'error.catalogEmpty', { root }))
  }
  const nameOwners = new Map<string, Expert>()
  for (const expert of map.values()) {
    for (const name of [expert.name, expert.nameEn]) {
      const normalized = normalizeExpertName(name)
      if (normalized === '') continue
      const owner = nameOwners.get(normalized)
      if (owner !== undefined && owner.slug !== expert.slug) {
        throw new Error(formatHost(locale, 'error.catalogDuplicateName', { name }))
      }
      nameOwners.set(normalized, expert)
    }
  }
  return map
}

/** 统一专家名称的比较规则，避免名册校验和运行时查询出现不一致。 */
function normalizeExpertName(value: unknown): string {
  return String(value ?? '').trim().toLowerCase()
}

/** 仅按本地化名称解析智能体；名称重名时拒绝调用，防止召唤到错误角色。 */
export function resolveExpert<T extends { readonly slug: string; readonly name: string; readonly nameEn?: string }>(experts: readonly T[], query: unknown, locale: LocaleId = 'zh'): T {
  const q = normalizeExpertName(query)
  if (q.length === 0) throw new Error(formatHost(locale, 'error.expertRequired'))
  const exactNames = experts.filter((expert) => normalizeExpertName(expert.name) === q || normalizeExpertName(expert.nameEn) === q)
  if (exactNames.length === 1) return exactNames[0]
  const matches = exactNames.length > 1
    ? exactNames
    : experts.filter((expert) => normalizeExpertName(expert.name).includes(q) || normalizeExpertName(expert.nameEn).includes(q))
  if (matches.length === 1) return matches[0]
  if (matches.length > 1) {
    const preview = [...new Set(matches
      .map((expert) => locale === 'en' ? expert.nameEn ?? expert.name : expert.name))]
      .slice(0, 12)
      .join(', ')
    throw new Error(formatHost(locale, 'error.expertAmbiguous', { query: String(query), candidates: preview }))
  }
  throw new Error(formatHost(locale, 'error.expertMissing', { query: String(query) }))
}

export function apply(ctx: Context, config: Config): void {
  const maxDepth = normalizeMaxDepth(config.maxDepth)
  let enabledSource: () => readonly string[] = () => []
  installSettingsSectionCompat(ctx, settingsNamespaceCompat('agency-agents'), z.object({ enabled: z.array(z.string()) }), { enabled: [] }, {
    setSource: (current) => { enabledSource = () => current().enabled },
    onChange: () => {},
  })
  const enabledSet = (): ReadonlySet<string> => new Set(enabledSource())
  const activeLocale = (): LocaleId => readHostLocale(ctx)
  const catalogRoot = resolveCatalogRoot(config.root)
  const personaSource = createAgencyPersonaSource(catalogRoot, config.divisions)
  ctx.reflect.provide(AGENCY_PERSONA_SERVICE, personaSource)
  let experts = new Map<string, Expert>()
  let loadError: string | null = null
  const ready = loadCatalog(catalogRoot, config.divisions, activeLocale())
    .then((map) => { experts = map })
    .catch((error: unknown) => { loadError = String(error) })

  async function ensureReady(): Promise<void> {
    await ready
    if (loadError !== null) throw new Error(formatHost(activeLocale(), 'error.catalogLoad', { detail: loadError }))
  }

  function groupByDivision(withExperts: boolean, locale: LocaleId): Array<{ division: string; count: number; experts?: Array<{ name: string; emoji: string; description: string }> }> {
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
            .map((e) => ({ name: localizedExpertName(e, locale), emoji: e.emoji, description: truncate(localizedExpertDescription(e, locale), DESCRIPTION_LIMIT) })),
        } : {}),
      }))
  }

  ctx.tools.register(defineTool({
    name: 'list_experts',
    description: 'List the available Agency domain experts grouped by division. Without a division filter it returns only division names and counts (compact); pass a division to expand it with expert names and descriptions. Call this before summon_expert when you need to choose an expert by name.',
    parameters: {
      division: { type: 'string', description: 'Optional division key to filter (e.g. engineering, marketing, security, finance, design).' },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: { divisions: { type: 'array', required: true, items: { type: 'json' } }, total: { type: 'number', required: true } } },
      render: (args, value) => {
        const divisions = value.divisions as Array<{ division: string; count: number; experts?: Array<{ name: string; emoji: string; description: string }> }>
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
    // 单条与批量召唤共用同一套任务校验，避免单条路径绕过码点上限
    const taskText = normalizeTask(task, locale)
    if (exec.agent === undefined) throw new Error(formatHost(locale, 'error.summonRequiresAgent'))
    const provider = ctx.subagents.getProvider(config.provider)
    if (provider === undefined) throw new Error(formatHost(locale, 'error.providerMissing', { provider: config.provider }))
    if (!provider.capabilities.persona) throw new Error(formatHost(locale, 'error.providerNoPersona', { provider: config.provider }))
    if (!provider.capabilities.toolFilter) throw new Error(formatHost(locale, 'error.providerNoToolFilter', { provider: config.provider }))
    if (maxDepth !== undefined && !provider.capabilities.depthLimit) throw new Error(formatHost(locale, 'error.providerNoMaxDepth', { provider: config.provider }))
    const expert = resolveExpert([...experts.values()], query, locale)
    if (!enabledSet().has(expert.slug)) throw new Error(formatHost(locale, 'error.expertDisabled', { name: localizedExpertName(expert, locale) }))
    const { prompt: persona } = await personaSource.getPrompt(expert.slug, expert.division, locale)
    const run: SubagentRun = await ctx.subagents.start(config.provider, {
      label: `expert:${expert.slug}`,
      prompt: [{ type: 'text', text: taskText }],
      parent: exec.agent,
      persona: sanitize(persona),
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
      return { expert: localizedExpertName(expert, locale), answer: text }
    } finally {
      await run.dispose()
    }
  }

  ctx.tools.register(defineTool({
    name: 'summon_expert',
    description: "Summon a domain expert from The Agency roster to complete a task: a specialist subagent runs with that expert's full persona and returns its result. Use for tasks that clearly belong to a specialist domain (frontend work, security review, marketing copy, etc.). This call waits for the expert's result. Call list_experts first if you do not know the expert name.",
    parameters: {
      expert: { type: 'string', required: true, description: 'Expert name to summon (e.g. "Frontend Developer").' },
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
    description: 'Summon multiple domain experts in parallel to work on one mission. Each expert gets its own task/role and runs as a specialist subagent with its own persona. At most 8 experts run with concurrency 4; if some fail, successful answers are still returned. Use this to assemble a specialist team.',
    parameters: {
      experts: {
        type: 'array',
        required: true,
        description: 'The experts to summon, each with an expert name and its own task.',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            expert: { type: 'string', required: true, description: 'Expert name (e.g. "Frontend Developer").' },
            task: { type: 'string', required: true, description: 'The complete, self-contained task/role for this expert.' },
          },
        },
      },
    },
    output: {
      schema: { type: 'object', additionalProperties: false, properties: { results: { type: 'array', required: true, items: { type: 'json' } } } },
      render: (_args, value) => {
        const results = value.results as Array<{ expert: string; ok: boolean; answer: string; error?: string }>
        return [{ type: 'text', text: renderSummonResults(activeLocale(), results) }]
      },
    },
    async execute(args, exec) {
      await ensureReady()
      const locale = activeLocale()
      if (exec.agent === undefined) throw new Error(formatHost(locale, 'error.summonManyRequiresAgent'))
      const specs = validateSummonSpecs(args.experts, locale)
      const results = await mapPool(specs, SUMMON_EXPERTS_CONCURRENCY, async (spec) => {
        try {
          return toSummonItemResult(spec.expert, await runExpert(spec.expert, spec.task, exec))
        } catch (error) {
          return toSummonItemResult(spec.expert, error instanceof Error ? error : new Error(String(error)))
        }
      })
      return {
        results: results.map((item) => ({
          expert: item.expert,
          ok: item.ok,
          answer: item.answer,
          ...(item.error === undefined ? {} : { error: item.error }),
        })),
      }
    },
  }))

  ctx.systemPrompt.section({
    name: 'agency:experts',
    order: 117,
    text: (context) => {
      const agent = (context as { agent?: { session?: { header?: { parentSession?: unknown } } } }).agent
      if (agent?.session?.header?.parentSession !== undefined) return ''
      return '## Agency expert mode\nThe parent session has a roster of domain experts from The Agency (specialists across 22 divisions, individually enable/disable; ALL are disabled by default, and the user enables some in the Agency settings tab). A composer selection inserts one enabled expert as a native reference chip; all remaining draft text is that expert\'s task. In the parent session, call `list_experts()` to see enabled division names and counts, then call `list_experts(division)` to browse enabled experts and select a unique name before using `summon_expert(expert, task)` or `summon_experts` for a small parallel team (at most 8; partial results if some fail). A disabled expert cannot be summoned.'
    },
  })
}
