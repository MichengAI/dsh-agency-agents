/**
 * 宿主侧用户可见文案。zh 为 key 集真相源；en 用 satisfies 校验完整性。
 * 模板占位符使用 {word}，与客户端 locale 服务约定一致。
 */
import { settingsNamespace, type SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { EN_DIVISION, ZH_DIVISION } from './names.js'

/** 与 DSH locale 插件一致的语言标识。 */
export type LocaleId = 'zh' | 'en'

/** 简体中文宿主文案（key 集真相源）。 */
export const zhHost = {
  'error.rootMissing': '智能体目录 root 不存在或无法访问："{root}"。请设置环境变量 {env} 或提供正确路径。',
  'error.rootNotDir': '智能体目录 root "{root}" 不是目录',
  'error.catalogEmpty': '在 root "{root}" 下未发现任何智能体（*.md 文件）。请确认路径正确。',
  'error.catalogLoad': 'agency-agents 花名册加载失败：{detail}',
  'error.expertRequired': '必须提供专家 slug 或名称',
  'error.expertAmbiguous': '专家 "{query}" 有歧义；候选：{candidates}。请用 list_experts 选择精确 slug。',
  'error.expertMissing': '没有匹配 "{query}" 的专家。请调用 list_experts 查看花名册。',
  'error.expertDisabled': '专家 "{name}" 已停用',
  'error.summonRequiresAgent': 'summon_expert 需要由智能体调用',
  'error.summonManyRequiresAgent': 'summon_experts 需要由智能体调用',
  'error.expertsEmpty': 'experts 必须是非空数组',
  'error.providerMissing': '子代理 provider "{provider}" 未注册',
  'error.providerNoPersona': '子代理 provider "{provider}" 不支持专家人格',
  'error.providerNoToolFilter': '子代理 provider "{provider}" 无法阻止递归专家委派',
  'error.providerNoMaxDepth': '子代理 provider "{provider}" 不支持 maxDepth',
  'error.expertRun': '专家运行以 "{reason}" 结束{detail}',
  'error.partialOutput': '\n部分输出：\n{text}',
  'error.maxDepth': 'agency-agents 配置 maxDepth 必须是正安全整数',
  'error.settingsMissing': 'agency-agents 设置区尚未注册',
  'list.empty': '暂无可用专家。',
  'list.emptyDivision': '没有匹配分区 "{division}" 的专家。',
  'list.heading': '{total} 位专家，覆盖 {count} 个分区：',
  'list.group': '## {division}（{count}）',
} satisfies Record<string, string>

/** 宿主文案 key 联合。 */
export type HostKey = keyof typeof zhHost

/** 英文宿主文案，key 完整性由 satisfies 在编译期保证。 */
export const enHost = {
  'error.rootMissing': 'Agent catalog root is missing or inaccessible: "{root}". Set {env} or provide a valid path.',
  'error.rootNotDir': 'Agent catalog root "{root}" is not a directory',
  'error.catalogEmpty': 'No agents (*.md files) found under root "{root}". Check the path.',
  'error.catalogLoad': 'agency-agents catalog failed to load: {detail}',
  'error.expertRequired': 'expert is required',
  'error.expertAmbiguous': 'Ambiguous expert "{query}"; candidates: {candidates}. Use list_experts to pick an exact slug.',
  'error.expertMissing': 'No expert matched "{query}". Call list_experts to see the roster.',
  'error.expertDisabled': 'expert "{name}" is disabled',
  'error.summonRequiresAgent': 'summon_expert requires a calling agent',
  'error.summonManyRequiresAgent': 'summon_experts requires a calling agent',
  'error.expertsEmpty': 'experts must be a non-empty array',
  'error.providerMissing': 'subagent provider "{provider}" is not registered',
  'error.providerNoPersona': 'subagent provider "{provider}" does not support expert personas',
  'error.providerNoToolFilter': 'subagent provider "{provider}" cannot prevent recursive expert delegation',
  'error.providerNoMaxDepth': 'subagent provider "{provider}" does not support maxDepth',
  'error.expertRun': 'expert run ended with "{reason}"{detail}',
  'error.partialOutput': '\nPartial output:\n{text}',
  'error.maxDepth': 'agency-agents config maxDepth must be a positive safe integer',
  'error.settingsMissing': 'agency-agents settings section is not registered',
  'list.empty': 'No experts available.',
  'list.emptyDivision': 'No experts matched division "{division}".',
  'list.heading': '{total} experts across {count} divisions:',
  'list.group': '## {division} ({count})',
} satisfies Record<HostKey, string>

/** 将未知值收成 zh / en；只有显式 en 才走英文。 */
export function resolveHostLocale(value: unknown): LocaleId {
  return value === 'en' ? 'en' : 'zh'
}

/** 按当前语言格式化宿主文案。 */
export function formatHost(locale: LocaleId, key: HostKey, params?: Record<string, string | number>): string {
  const dict = locale === 'en' ? enHost : zhHost
  let text = dict[key]
  if (params !== undefined) {
    for (const [name, value] of Object.entries(params)) text = text.replaceAll('{' + name + '}', String(value))
  }
  return text
}

/** 从宿主 settings 的 locale.preference 读取语言，缺失或异常时回退 zh。 */
export function readHostLocale(ctx: { settings?: { get?: (ns: SettingsNamespace) => unknown } }): LocaleId {
  try {
    // Cordis 对未注入服务的属性访问会直接抛错，optional chaining 拦不住。
    const section = ctx.settings?.get?.(settingsNamespace('locale')) as { preference?: unknown } | undefined
    return resolveHostLocale(section?.preference)
  } catch {
    return 'zh'
  }
}

/** 分区查询同时认 key、中文名和英文名。 */
export function matchDivision(query: string, division: string): boolean {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return false
  if (division.toLowerCase() === q) return true
  const zh = ZH_DIVISION[division]
  if (zh !== undefined && zh.toLowerCase() === q) return true
  const en = EN_DIVISION[division]
  if (en !== undefined && en.toLowerCase() === q) return true
  return false
}

/** 按当前语言取分区显示名。 */
export function localizedDivision(division: string, locale: LocaleId): string {
  if (locale === 'en') return EN_DIVISION[division] ?? division
  return ZH_DIVISION[division] ?? division
}

/** 按当前语言取专家显示名。 */
export function localizedExpertName(expert: { readonly name: string; readonly nameEn: string }, locale: LocaleId): string {
  return locale === 'en' ? expert.nameEn : expert.name
}

/** 按当前语言取专家简介；英文缺失时回退中文。 */
export function localizedExpertDescription(expert: { readonly description: string; readonly descriptionEn?: string }, locale: LocaleId): string {
  return locale === 'en' && expert.descriptionEn !== undefined && expert.descriptionEn !== ''
    ? expert.descriptionEn
    : expert.description
}

export interface ExpertListGroup {
  readonly division: string
  readonly count: number
  readonly experts?: ReadonlyArray<{ readonly slug: string; readonly name: string; readonly emoji: string; readonly description: string }>
}

/** 渲染 list_experts 的用户可见文本。 */
export function renderExpertList(
  locale: LocaleId,
  args: { readonly division?: unknown },
  value: { readonly divisions: readonly ExpertListGroup[]; readonly total: number },
): string {
  if (value.divisions.length === 0) {
    const division = args.division === undefined ? '' : String(args.division).trim()
    return division === ''
      ? formatHost(locale, 'list.empty')
      : formatHost(locale, 'list.emptyDivision', { division })
  }
  const lines: string[] = []
  for (const group of value.divisions) {
    lines.push(formatHost(locale, 'list.group', {
      division: localizedDivision(group.division, locale),
      count: group.count,
    }))
    for (const expert of group.experts ?? []) {
      const mark = expert.emoji !== '' ? expert.emoji + ' ' : ''
      lines.push('- ' + mark + expert.name + ' — `' + expert.slug + '` — ' + expert.description)
    }
  }
  lines.unshift(formatHost(locale, 'list.heading', { total: value.total, count: value.divisions.length }))
  return lines.join('\n')
}
