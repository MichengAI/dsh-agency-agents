import React from 'react'
import type { Context as CordisClientContext } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-client-connection/client'
import type { InputTriggerSource, ReferenceInsert, TokenSpan } from '@deepseek-ai/dsh-client-ui-input-trigger/client'
// Type-only: 拉入 api-remotes 的 ctx.remote 合并（client 侧 TypertClientRemote）。
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { PropsLocale, SlotCore, SlotMap, TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
// Type-only: 拉入 ctx.locale 的 Context merge（跨插件协作只走服务，不做值导入）。
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { ZH_NAME, ZH_DIVISION, EN_DIVISION } from '../names.js'
import { ROSTER } from './roster.js'
import { zh, en, type AgencyKey } from './locales.js'
import { TYPERT_REMOTE, type AgencyAgentsEnabledState } from './remote.js'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** agency-agents 客户端词条命名空间。 */
    agency: AgencyKey
  }
}

const PLUGIN_ID = '@michengai/dsh-agency-agents'
/** 本插件客户端词条字典命名空间。 */
const NS = 'agency'

/**
 * RC Runtime 与 alpha UI 包会各自解析 dsh-client-ui-slots 的类型副本。
 * 仅收窄本插件实际使用的服务面，避免旧 Runtime 声明覆盖 alpha 槽位表。
 */
type ClientSlots = Pick<SlotCore, 'register'> & {
  inject(key: keyof SlotMap & string, callback: () => () => void): () => void
}

type ClientContext = CordisClientContext & {
  readonly slots: ClientSlots
  readonly sessions: unknown
}

/** 设置页标题旁的公开项目入口，和归档管理器保持一致。 */
export const SETTINGS_GITHUB_LINKS = [
  {
    href: 'https://github.com/MichengAI/dsh-agency-agents',
    labelKey: 'settings.viewProject',
    icon: 'github',
  },
  {
    href: 'https://github.com/MichengAI/dsh-agency-agents/issues',
    labelKey: 'settings.feedback',
    icon: 'feedback',
  },
] as const satisfies ReadonlyArray<{
  readonly href: string
  readonly labelKey: AgencyKey
  readonly icon: 'github' | 'feedback'
}>

const DIVISION_ORDER = [
  'academic', 'design', 'engineering', 'finance', 'game-development', 'gis',
  'healthcare', 'marketing', 'paid-media', 'product', 'project-management',
  'research', 'sales', 'security', 'spatial-computing', 'specialized', 'support', 'testing',
]

interface ExpertView {
  readonly slug: string
  readonly name: string
  readonly nameEn: string
  readonly emoji: string
  readonly division: string
  readonly divisionZh: string
  readonly divisionEn: string
  readonly description: string
  readonly descriptionEn: string
}

interface ExpertGroup {
  readonly division: string
  readonly divisionZh: string
  readonly experts: ExpertView[]
}

const EXPERTS: ReadonlyArray<ExpertView> = ROSTER
  .map((e) => ({
    slug: e.slug,
    name: ZH_NAME[e.slug] ?? e.nameEn,
    nameEn: e.nameEn,
    emoji: e.emoji,
    division: e.division,
    divisionZh: ZH_DIVISION[e.division] ?? e.division,
    divisionEn: EN_DIVISION[e.division] ?? e.division,
    description: e.description,
    descriptionEn: e.descriptionEn,
  }))
  .sort((a, b) => a.division.localeCompare(b.division) || a.slug.localeCompare(b.slug))

/** 按当前语言比较专家显示名，供设置页和菜单分组排序。 */
export function compareExpertName(
  a: { readonly name: string; readonly nameEn: string },
  b: { readonly name: string; readonly nameEn: string },
  active: 'zh' | 'en',
): number {
  const left = active === 'en' ? a.nameEn : a.name
  const right = active === 'en' ? b.nameEn : b.name
  return left.localeCompare(right, active === 'en' ? 'en' : 'zh')
}

function groupByDivision(list: ReadonlyArray<ExpertView>, active: 'zh' | 'en'): ExpertGroup[] {
  const groups = new Map<string, ExpertView[]>()
  for (const e of list) {
    const arr = groups.get(e.division) ?? []
    arr.push(e)
    groups.set(e.division, arr)
  }
  return DIVISION_ORDER.filter((d) => groups.has(d)).map((d) => ({
    division: d,
    divisionZh: ZH_DIVISION[d] ?? d,
    experts: (groups.get(d) ?? []).slice().sort((a, b) => compareExpertName(a, b, active)),
  }))
}

/** 设置页检索用的专家字段，避免把完整视图类型泄漏到筛选逻辑。 */
export interface ExpertSearchable {
  readonly slug: string
  readonly name: string
  readonly nameEn: string
  readonly division: string
  readonly divisionZh: string
  readonly divisionEn: string
  readonly description: string
  readonly descriptionEn: string
}

/** 规范化检索词：去首尾空白并转小写，便于中英文统一匹配。 */
export function normalizeExpertQuery(query: string): string {
  return query.trim().toLowerCase()
}

/** 按名称、分区或简介做包含匹配；空检索视为全部命中。 */
export function matchExpertQuery(expert: ExpertSearchable, query: string): boolean {
  const q = normalizeExpertQuery(query)
  if (q === '') return true
  return [
    expert.name,
    expert.nameEn,
    expert.division,
    expert.divisionZh,
    expert.divisionEn,
    expert.description,
    expert.descriptionEn,
  ].some((field) => field.toLowerCase().includes(q))
}

/** 先按分区收窄，再按检索词过滤。division 为空表示全部分类。 */
export function filterExperts<T extends ExpertSearchable>(
  list: ReadonlyArray<T>,
  options: { readonly query?: string; readonly division?: string },
): T[] {
  const division = options.division ?? ''
  return list.filter((expert) => (division === '' || expert.division === division) && matchExpertQuery(expert, options.query ?? ''))
}

const DIVISION_COUNTS: Readonly<Record<string, number>> = Object.fromEntries(
  DIVISION_ORDER.map((division) => [division, EXPERTS.filter((expert) => expert.division === division).length]),
)

/** 按当前 locale 取专家显示名：en 用花名册英文名，其余用中文名。 */
function displayName(e: ExpertView, active: 'zh' | 'en'): string {
  return active === 'en' ? e.nameEn : e.name
}

/** 把 emoji 放进宿主稳定渲染的名称节点，避免依赖可能丢失文本的独立图标槽。 */
export function inputTriggerCandidateName(
  expert: Pick<ExpertView, 'name' | 'nameEn' | 'emoji'>,
  active: 'zh' | 'en',
): string {
  const name = active === 'en' ? expert.nameEn : expert.name
  return expert.emoji === '' ? name : `${expert.emoji} ${name}`
}

/** 选中候选后按内部标识还原纯专家名，防止展示用 emoji 进入召唤标签。 */
export function inputTriggerPickName(slug: string, fallbackName: string, active: 'zh' | 'en'): string {
  const expert = EXPERTS.find((item) => item.slug === slug)
  return expert === undefined ? fallbackName : displayName(expert, active)
}

/** 统一生成宿主可识别的专家提及文本，避免重复 @ 或将展示 emoji 写入草稿。 */
export function formatExpertMention(name: string): string {
  return `@${name.trim().replace(/^@+/, '')}`
}

/** 使用不换行空格分隔专家引用，避免消息渲染层折叠相邻 chip 的普通空格。 */
export function formatExpertMentionInsertion(name: string): string {
  return `${formatExpertMention(name)}\u00A0`
}

/** 仅公开已启用专家的本地化名称，供宿主扫描并装饰 @名称 纯文本引用。 */
export function buildExpertMentionLexicon(
  experts: ReadonlyArray<{ readonly slug: string; readonly name: string; readonly nameEn: string }>,
  enabled: ReadonlySet<string>,
  active: 'zh' | 'en',
): string[] {
  return experts
    .filter((expert) => enabled.has(expert.slug))
    .map((expert) => active === 'en' ? expert.nameEn : expert.name)
}

/** 按当前 locale 取 @ 菜单分组标题；未知分区保留原值，便于扩展来源安全降级。 */
export function inputTriggerSourceName(division: string, active: 'zh' | 'en'): string {
  const divisions = active === 'en' ? EN_DIVISION : ZH_DIVISION
  return divisions[division] ?? division
}

/** 引用所有者必须跨语言稳定，避免草稿中的 chip 在切换界面语言后失去序列化器。 */
export function inputTriggerSourceId(division: string): string {
  return `${PLUGIN_ID}:${division}`
}

/** 专家引用在新版宿主采用内置代理图标；旧宿主会忽略 appearance 并保留默认 @ 标记。 */
export interface ExpertReference extends ReferenceInsert {
  readonly appearance: 'session'
}

/** 将专家投影为宿主的原子引用；slug 仅作为内部 ref，不进入标签、剪贴板或模型文本。 */
export function buildExpertReference(
  expert: Pick<ExpertView, 'slug' | 'name' | 'nameEn' | 'emoji' | 'division'>,
  active: 'zh' | 'en',
): ExpertReference {
  const name = active === 'en' ? expert.nameEn : expert.name
  return {
    source: inputTriggerSourceId(expert.division),
    ref: expert.slug,
    label: name,
    // dsh-client-ui-input-trigger RC.6 尚未声明该运行时字段；新版宿主将其渲染为内置代理图标。
    appearance: 'session',
    clipboardText: formatExpertMentionInsertion(name),
  }
}

/** 名册更新后仍可发送旧草稿，但不向用户或模型泄露已失效的内部标识。 */
export function expertMentionFromReference(slug: string, active: 'zh' | 'en'): string {
  const expert = EXPERTS.find((item) => item.slug === slug)
  if (expert === undefined) {
    return active === 'en'
      ? '@Removed expert (please reselect)\u00A0'
      : '@已移除专家（请重新选择）\u00A0'
  }
  return formatExpertMentionInsertion(displayName(expert, active))
}

/** 按当前 locale 取专家简介：en 用原始英文描述（缺失时回退中文），其余用中文描述。 */
function displayDescription(e: ExpertView, active: 'zh' | 'en'): string {
  return active === 'en' && e.descriptionEn !== '' ? e.descriptionEn : e.description
}

// @ 菜单里使用稳定分区 ID；这里放开名称列，让带图标的专家名称整行显示。
const EXPERT_MENU_ITEM_SELECTORS = DIVISION_ORDER
  .map((division) => inputTriggerSourceId(division))
  .map((name) => `[role="listbox"] div[data-source=${JSON.stringify(name)}] ~ button`)
const MENU_NAME_OVERRIDE = EXPERT_MENU_ITEM_SELECTORS
  .map((selector) => `${selector} span:last-child`)
  .join(',')
/** Windows 优先使用彩色 emoji 字体，名称中的普通文字由后续字体安全回退。 */
const EXPERT_MENU_NAME_STYLE = 'flex:1 1 auto;max-width:none;min-width:0;font-family:"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif!important;font-variant-emoji:emoji!important'
const COMPOSER_CSS = '.aag-btn-wrap{position:relative;order:1;margin-right:-8px}.aag-btn{display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 4px 0 8px;border:none;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;font-weight:500;cursor:pointer}.aag-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.aag-menu{position:absolute;bottom:calc(100% + 4px);left:0;box-sizing:border-box;padding:4px;display:flex;flex-direction:column;gap:0;width:300px;max-width:360px;max-height:calc(100vh - 24px);overflow-y:auto;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);z-index:10000}.aag-menu-title{padding:8px 10px;font-size:12px;line-height:16px;color:var(--dsw-alias-label-tertiary)}.aag-menu-item{display:flex;align-items:center;gap:8px;width:100%;min-height:40px;padding:8px 10px;border:none;border-radius:10px;background:transparent;cursor:pointer;text-align:left;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary);box-sizing:border-box}.aag-menu-item:hover{background:var(--dsw-alias-interactive-bg-hover)}.aag-emoji{flex:0 0 auto;font-size:16px}.aag-menu-empty{padding:8px 10px;color:var(--dsw-alias-label-secondary);font-size:13px}[data-composer-card] :has(> button[aria-haspopup="listbox"]) > :nth-child(2){order:2}'
// 设置页版式对齐 dsh-skills-manager：工具栏 + 汇总条 + 分组卡片 + 行内启停按钮。
const SETTINGS_CSS = `
.aag-section{box-sizing:border-box;display:flex;min-width:0;max-width:760px;width:100%;margin:0 auto;flex-direction:column;gap:16px;padding:0 0 32px;color:var(--dsw-alias-label-primary)}
.aag-toolbar{display:flex;align-items:flex-start;gap:16px;padding-bottom:12px}
.aag-title-row{display:flex;align-items:center;gap:8px;min-width:0}.aag-settings-links{display:flex;align-items:center;gap:4px}.aag-settings-link{display:inline-flex;align-items:center;gap:5px;min-height:28px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500;line-height:18px;text-decoration:none;white-space:nowrap}.aag-settings-link:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.aag-settings-link:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}.aag-settings-link svg{flex:none}
.aag-title{margin:0;font-size:20px;line-height:28px;font-weight:650;letter-spacing:-.2px}
.aag-desc{margin:4px 0 0;max-width:42em;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}
.aag-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.aag-action{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 12px;border:1px solid transparent;border-radius:8px;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);font:inherit;font-size:13px;font-weight:550;cursor:pointer;transition:opacity 180ms ease,background 180ms ease,border-color 180ms ease}
.aag-action:hover:not(:disabled){opacity:.9}.aag-action:disabled{opacity:.5;cursor:default}
.aag-action-secondary{background:transparent;border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.aag-action:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-summary{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-2)}
.aag-summary-count{font-size:18px;font-weight:650}.aag-summary-label{color:var(--dsw-alias-label-secondary);font-size:12px}.aag-summary-separator{width:1px;height:24px;background:var(--dsw-alias-border-l2)}
.aag-group{display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-2)}
.aag-group-head{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.aag-group-title{margin:0;font-size:14px;font-weight:600}.aag-count{color:var(--dsw-alias-label-tertiary);font-size:12px}
.aag-row{display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.aag-row:last-child{border-bottom:0}
.aag-row-main{display:flex;min-width:0;flex:1;flex-direction:column;gap:3px}
.aag-row-id{display:flex;align-items:center;gap:7px;min-width:0}
.aag-row-name{overflow:hidden;font-size:13px;font-weight:500;line-height:20px;text-overflow:ellipsis;white-space:nowrap}
.aag-tag{flex:none;padding:1px 6px;border:1px solid var(--dsw-alias-border-l3);border-radius:4px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.aag-tag-on{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.aag-tag-off{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}
.aag-note{overflow:hidden;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;text-overflow:ellipsis;white-space:nowrap}
.aag-error{color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:20px}
.aag-filters{display:flex;align-items:flex-end;gap:10px}
.aag-field{display:flex;min-width:0;flex:1;flex-direction:column;gap:6px}
.aag-field-category{flex:0 1 220px}
.aag-field-search{flex:1 1 240px}
.aag-label{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px}
.aag-control{box-sizing:border-box;width:100%;min-height:32px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.aag-control:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-select{position:relative}
.aag-select-trigger{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:32px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.aag-select-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}
.aag-select-trigger:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-select-trigger[aria-expanded="true"]{border-color:var(--dsw-alias-state-success-primary)}
.aag-select-value{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aag-select-caret{flex:none;width:12px;height:12px;color:var(--dsw-alias-label-tertiary)}
.aag-select-menu{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:30;box-sizing:border-box;max-height:280px;overflow:auto;padding:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2));box-shadow:var(--dsw-shadow-lv3)}
.aag-select-option{box-sizing:border-box;display:flex;align-items:center;width:100%;min-height:32px;padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.aag-select-option:hover,.aag-select-option[data-active="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.aag-select-option[aria-selected="true"]{color:var(--dsw-alias-state-success-primary)}
.aag-search-wrap{position:relative;display:flex;align-items:center}
.aag-search{padding-right:32px}.aag-search::-webkit-search-cancel-button,.aag-search::-webkit-search-decoration{-webkit-appearance:none;appearance:none}
.aag-search-clear{position:absolute;right:4px;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:16px;line-height:1;cursor:pointer}
.aag-search-clear:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.aag-search-clear:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:2px}
.aag-empty{display:flex;flex-direction:column;align-items:center;gap:12px;padding:28px 16px;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;text-align:center}
.aag-filter-meta{margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:12px}
@media (max-width:560px){.aag-toolbar,.aag-title-row{flex-wrap:wrap}.aag-actions{margin-left:0}.aag-filters{flex-direction:column;align-items:stretch}.aag-field-category,.aag-field-search{flex:none}.aag-row{align-items:flex-start;flex-wrap:wrap}.aag-row>.aag-action{margin-left:auto}.aag-filter-meta{margin-left:0}}
@media (prefers-reduced-motion:reduce){.aag-action{transition:none}}
`
const CSS = COMPOSER_CSS + SETTINGS_CSS
  + MENU_NAME_OVERRIDE + `{${EXPERT_MENU_NAME_STYLE}}`

/** 本插件 Remote 命名空间的 client 侧 face（ctx.remote.agencyAgents 的形状）。 */
interface AgencyAgentsRemoteApi {
  getEnabled(): Promise<RemoteResult<AgencyAgentsEnabledState>>
  setEnabled(enabled: string[], expectedRevision: number): Promise<RemoteResult<AgencyAgentsEnabledState>>
}

interface EnabledState {
  readonly enabled: ReadonlySet<string>
  readonly revision: number
}

/** 将写失败映射到 agency 词条；非冲突错误返回 null，由调用方展示原始消息。 */
export function writeErrorKey(error: unknown, options?: { readonly refreshed?: boolean }): AgencyKey | null {
  if (error instanceof Error && error.message.includes('changed since it was read')) {
    if (options?.refreshed === true) return 'error.conflict.refreshed'
    if (options?.refreshed === false) return 'error.conflict.refreshFailed'
    return 'error.conflict'
  }
  return null
}

/** 写失败时的用户可见文案。冲突场景必须显式传入 refreshed；传入 t 时按当前语言翻译。 */
export function writeErrorMessage(
  error: unknown,
  options?: { readonly refreshed?: boolean; readonly t?: (key: AgencyKey) => string },
): string {
  const key = writeErrorKey(error, options)
  if (key !== null) return (options?.t ?? ((item: AgencyKey) => zh[item]))(key)
  return error instanceof Error ? error.message : String(error)
}

async function readEnabled(remote: AgencyAgentsRemoteApi): Promise<EnabledState> {
  const result = await remote.getEnabled()
  if (!result.ok) throw new Error(result.error.message)
  return { enabled: new Set(result.value.enabled), revision: result.value.revision }
}

async function writeEnabled(remote: AgencyAgentsRemoteApi, enabled: ReadonlySet<string>, expectedRevision: number): Promise<EnabledState> {
  const result = await remote.setEnabled([...enabled], expectedRevision)
  if (!result.ok) throw new Error(result.error.message)
  return { enabled: new Set(result.value.enabled), revision: result.value.revision }
}

function expertIcon(): React.ReactElement {
  return React.createElement('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
    React.createElement('path', { d: 'M8 2.5l1.15 2.35 2.35 1.15-2.35 1.15L8 9.5l-1.15-2.35L4.5 6l2.35-1.15z' }),
    React.createElement('path', { d: 'M12.75 10.25l.55 1.2 1.2.55-1.2.55-.55 1.2-.55-1.2-1.2-.55 1.2-.55z' }))
}

/** GitHub 品牌标识未由宿主图标库提供，内联以保持离线可用和主题适配。 */
function githubMark16(): React.ReactElement {
  return React.createElement('svg', { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': true, focusable: false },
    React.createElement('path', { fill: 'currentColor', d: 'M8 0a8 8 0 0 0-2.53 15.59c.4.074.547-.173.547-.385 0-.19-.007-.693-.01-1.36-2.226.484-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.726-.496.055-.486.055-.486.803.056 1.225.824 1.225.824.714 1.223 1.872.87 2.328.665.072-.517.28-.87.508-1.07-1.777-.202-3.645-.888-3.645-3.956 0-.874.31-1.588.823-2.148-.083-.202-.357-1.017.078-2.12 0 0 .672-.215 2.2.82A7.65 7.65 0 0 1 8 4.8c.68.003 1.365.092 2.004.27 1.527-1.035 2.197-.82 2.197-.82.437 1.103.162 1.918.08 2.12.513.56.822 1.274.822 2.148 0 3.076-1.872 3.752-3.654 3.95.288.248.544.735.544 1.482 0 1.07-.01 1.932-.01 2.195 0 .214.144.463.55.384A8.001 8.001 0 0 0 8 0Z' }))
}

/** 与归档插件的 IconListPenOutline16 保持相同的矢量路径，避免引入整包 CSS。 */
function feedbackMark16(): React.ReactElement {
  return React.createElement('svg', { viewBox: '0 0 16 16', width: 16, height: 16, fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true, focusable: false },
    React.createElement('path', { d: 'M10.8239 3.54733V4.78443H4.63437V3.54733H10.8239Z', fill: 'currentColor' }),
    React.createElement('path', { d: 'M10.8239 6.12629V7.36338H4.63437V6.12629H10.8239Z', fill: 'currentColor' }),
    React.createElement('path', { d: 'M9.073 8.70524V9.94234H4.63437V8.70524H9.073Z', fill: 'currentColor' }),
    React.createElement('path', { d: 'M9.13321 0.573526C10.0076 0.573525 10.7179 0.572522 11.285 0.63397C11.8645 0.696791 12.3743 0.831648 12.8193 1.1548C13.0776 1.34246 13.3056 1.57047 13.4933 1.82875C13.8164 2.2737 13.9513 2.7836 14.0141 3.36303C14.0755 3.93015 14.0745 4.64049 14.0745 5.51485V6.1757L12.7327 7.5629V5.51485C12.7327 4.61092 12.732 3.9862 12.6803 3.5081C12.6298 3.0427 12.5379 2.79497 12.4083 2.61654C12.3033 2.47211 12.176 2.34472 12.0315 2.23977C11.8531 2.11016 11.6054 2.01823 11.14 1.96777C10.6618 1.91601 10.0372 1.91539 9.13321 1.91539H6.32658C5.42262 1.91539 4.79796 1.91604 4.31983 1.96777C3.85451 2.01819 3.60672 2.11029 3.42827 2.23977C3.28392 2.34465 3.15643 2.47223 3.0515 2.61654C2.9219 2.79496 2.82997 3.04274 2.7795 3.5081C2.72774 3.9862 2.72712 4.61092 2.72712 5.51485V10.023C2.72712 10.9273 2.72773 11.5525 2.7795 12.0307C2.82992 12.4959 2.92205 12.7429 3.0515 12.9213C3.15645 13.0657 3.28384 13.1931 3.42827 13.2981C3.60676 13.4277 3.85408 13.5206 4.31983 13.5711C4.79797 13.6228 5.42259 13.6234 6.32658 13.6234H6.87057L5.57707 14.9593C5.03527 14.9556 4.57031 14.9467 4.17476 14.9039C3.59508 14.841 3.08558 14.7063 2.64048 14.383C2.38215 14.1953 2.15422 13.9684 1.96653 13.7101C1.64319 13.2649 1.50851 12.7546 1.4457 12.1748C1.38432 11.6076 1.38525 10.8974 1.38525 10.023V5.51485C1.38525 4.64049 1.38426 3.93015 1.4457 3.36303C1.50853 2.78363 1.64341 2.27368 1.96653 1.82875C2.15417 1.57059 2.38228 1.34239 2.64048 1.1548C3.08544 0.831805 3.59533 0.696762 4.17476 0.63397C4.74193 0.572552 5.45218 0.573525 6.32658 0.573526H9.13321Z', fill: 'currentColor' }),
    React.createElement('path', { d: 'M14.2193 14.9553H10.0124L11.3744 13.6134H14.2193V14.9553Z', fill: 'currentColor' }),
    React.createElement('path', { d: 'M8.24493 13.3711L7.49015 14.8806C7.40148 15.058 7.58961 15.2461 7.76695 15.1574L9.27651 14.4027L14.6147 9.09934L13.5832 8.06775L8.24493 13.3711Z', fill: 'currentColor' }))
}

function settingsGithubLinks(t: TranslateNS<'agency'>): React.ReactElement {
  return React.createElement('div', { className: 'aag-settings-links' }, SETTINGS_GITHUB_LINKS.map((link) => React.createElement('a', {
    key: link.href,
    className: 'aag-settings-link',
    href: link.href,
    target: '_blank',
    rel: 'noreferrer',
    'aria-label': t(link.labelKey),
  }, link.icon === 'github' ? githubMark16() : feedbackMark16(), t(link.labelKey))))
}

/** 工具栏菜单不能接管焦点，否则 Lexical 无法按检测坐标插入原子引用。 */
export function keepComposerFocus(event: { preventDefault(): void }): void {
  event.preventDefault()
}

function menuItem(e: ExpertView, pick: (slug: string) => void, getActive: () => 'zh' | 'en'): React.ReactElement {
  return React.createElement('button', { key: e.slug, type: 'button', className: 'aag-menu-item', onMouseDown: (ev: React.MouseEvent) => { keepComposerFocus(ev); pick(e.slug) } },
    React.createElement('span', { className: 'aag-emoji' }, e.emoji),
    React.createElement('span', null, displayName(e, getActive())))
}

function menuGroup(g: ExpertGroup, pick: (slug: string) => void, t: TranslateNS<'agency'>, getActive: () => 'zh' | 'en'): React.ReactElement {
  return React.createElement('div', { key: g.division },
    // 开放 key 查找：division key 全部注册在 agency 词条里（MenuView 同款
    // cast 模式），未注册的 key 会原样显示为 key 本身。
    React.createElement('div', { className: 'aag-menu-title' }, t(`division.${g.division}` as AgencyKey)),
    g.experts.map((e) => menuItem(e, pick, getActive)))
}

export type ExpertToolbarAction = 'menu' | 'settings'

/** 没有可召唤专家时打开设置页，否则打开本地菜单。 */
export function resolveExpertToolbarClick(enabledCount: number): ExpertToolbarAction {
  return enabledCount === 0 ? 'settings' : 'menu'
}

const SETTINGS_TRIGGER_LABELS = new Set(['设置', 'Settings'])
const COMPOSER_TRIGGER_SCOPE = '[data-composer-card], .aag-btn-wrap'

export function isSettingsTriggerLabel(label: string): boolean {
  return SETTINGS_TRIGGER_LABELS.has(label.trim())
}

export interface SettingsTriggerCandidate {
  readonly label: string
  readonly inComposer: boolean
  readonly hasDialogPopup: boolean
}

/** 只认明确的设置按钮；输入区里的「+」和其他弹窗一律排除。 */
export function pickHostSettingsTrigger<T extends SettingsTriggerCandidate>(
  candidates: ReadonlyArray<T>,
): T | undefined {
  const labeled = candidates.filter((item) => !item.inComposer && isSettingsTriggerLabel(item.label))
  if (labeled.length === 1) return labeled[0]
  if (labeled.length > 1) return undefined
  const dialogs = candidates.filter((item) => !item.inComposer && item.hasDialogPopup)
  return dialogs.length === 1 ? dialogs[0] : undefined
}

function buttonAccessibleLabel(button: Element): string {
  return (button.getAttribute('aria-label') ?? button.textContent ?? '').trim()
}

function collectSettingsTriggerCandidates(
  root: ParentNode,
): Array<SettingsTriggerCandidate & { readonly button: HTMLElement }> {
  const result: Array<SettingsTriggerCandidate & { readonly button: HTMLElement }> = []
  for (const node of root.querySelectorAll('button')) {
    if (!(node instanceof HTMLElement)) continue
    result.push({
      button: node,
      label: buttonAccessibleLabel(node),
      inComposer: node.closest(COMPOSER_TRIGGER_SCOPE) !== null,
      hasDialogPopup: node.getAttribute('aria-haspopup') === 'dialog',
    })
  }
  return result
}

export function findHostSettingsTrigger(root: ParentNode): HTMLElement | undefined {
  return pickHostSettingsTrigger(collectSettingsTriggerCandidates(root))?.button
}

export function findExpertSettingsNavButton(root: ParentNode, navLabel: string): HTMLElement | undefined {
  for (const dialog of root.querySelectorAll('[role="dialog"]')) {
    for (const button of dialog.querySelectorAll('nav button')) {
      if (button instanceof HTMLElement && (button.textContent ?? '').trim() === navLabel) return button
    }
  }
  return undefined
}

function queueSettingsNav(work: () => void): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => { requestAnimationFrame(work) })
    return
  }
  work()
}

/** 打开宿主设置并选中专家分区；找不到唯一设置入口时返回 false，由调用方回退到本地菜单。 */
export function openAgentSettings(
  navLabel: string,
  root: ParentNode = document,
  schedule: (work: () => void) => void = queueSettingsNav,
): boolean {
  const existing = findExpertSettingsNavButton(root, navLabel)
  if (existing !== undefined) {
    existing.click()
    return true
  }
  const trigger = findHostSettingsTrigger(root)
  if (trigger === undefined) return false
  trigger.click()
  schedule(() => { findExpertSettingsNavButton(root, navLabel)?.click() })
  return true
}

/** 输入机暴露给工具栏的最小原子引用写入面，避免依赖 slot 的非标准 owner 参数。 */
export interface ReferenceInsertionTarget {
  readonly state: {
    getSnapshot(): {
      readonly draft: string
      readonly draftRev: number
      readonly occurrences?: ReadonlyArray<{ readonly source: string; readonly offset: number }>
    }
  }
  insertReference(reference: ReferenceInsert, span: TokenSpan): boolean
}

/** 从当前或指定会话取得输入机；兼容未向工具栏 slot 注入 sessionId 的宿主版本。 */
export interface ReferenceSessionAccess {
  readonly list?: {
    getSnapshot(): { readonly current?: SessionId }
  }
  scope?(id: SessionId): CordisClientContext | undefined
  binding?(id: SessionId): { readonly ctx: CordisClientContext } | undefined
}

export interface ReferenceConversationAccess {
  readonly input: { for(actx: CordisClientContext): ReferenceInsertionTarget | undefined }
}

export function resolveReferenceInsertionTarget(
  sessions: ReferenceSessionAccess,
  sessionId?: SessionId,
  getConversation?: (actx: CordisClientContext) => ReferenceConversationAccess | undefined,
): ReferenceInsertionTarget | undefined {
  const targetSessionId = sessionId ?? sessions.list?.getSnapshot().current
  if (targetSessionId === undefined) return undefined
  const actx = sessions.scope?.(targetSessionId) ?? sessions.binding?.(targetSessionId)?.ctx
  return actx === undefined ? undefined : getConversation?.(actx)?.input.for(actx)
}

/** 返回草稿开头原生引用前缀的末端，避免来源字段差异使连续 chip 漏算。 */
function expertReferencePrefixEnd(snapshot: ReturnType<ReferenceInsertionTarget['state']['getSnapshot']>): number {
  const expertOffsets = new Set((snapshot.occurrences ?? []).map((occurrence) => occurrence.offset))
  let end = 0
  while (expertOffsets.has(end)) {
    end += 1
    if (snapshot.draft[end] === ' ') end += 1
  }
  // 兼容未公开 occurrence 的旧版宿主。
  while (snapshot.draft[end] === '\uFFFC') {
    end += 1
    if (snapshot.draft[end] === ' ') end += 1
  }
  return end
}

/** 通过当前会话的输入机插入 chip；新增专家始终追加在已有专家之后。 */
export function insertExpertReference(
  target: ReferenceInsertionTarget | undefined,
  reference: ReferenceInsert,
): boolean {
  if (target === undefined) return false
  const snapshot = target.state.getSnapshot()
  const offset = expertReferencePrefixEnd(snapshot)
  const inserted = target.insertReference(reference, {
    start: offset,
    end: offset,
    draftRev: snapshot.draftRev,
  })
  return inserted
}

/** 工具栏只能写入原生 chip；返回 false 供界面保留菜单并提示失败原因。 */
export function insertSelectedExpert(
  slug: string,
  active: 'zh' | 'en',
  insertReference: ((reference: ReferenceInsert) => boolean) | undefined,
): boolean {
  const expert = EXPERTS.find((item) => item.slug === slug)
  return expert !== undefined && insertReference?.(buildExpertReference(expert, active)) === true
}

type ButtonProps = PropsLocale<'agency'> & {
  readonly remote: AgencyAgentsRemoteApi
  readonly onEnabledChange?: (enabled: ReadonlySet<string>) => void
  /** 由 session slot 的 inject 回调注入，永远绑定当前编辑器所属会话。 */
  readonly insertReference?: (reference: ReferenceInsert) => boolean
  /** 当前 locale 读取器（locale 切换后框架以新 t 重渲染，名称随之刷新）。 */
  readonly getActive: () => 'zh' | 'en'
}

function AgentsButton(props: ButtonProps): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const [enabled, setEnabled] = React.useState<ReadonlySet<string>>(new Set())
  const [insertError, setInsertError] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (ev: PointerEvent): void => {
      const target = ev.target
      if (target instanceof Element && (target.closest('.aag-menu') !== null || target.closest('.aag-btn-wrap') !== null)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const onClick = (): void => {
    void readEnabled(props.remote).then((current) => {
      setEnabled(current.enabled)
      props.onEnabledChange?.(current.enabled)
      if (resolveExpertToolbarClick(current.enabled.size) === 'settings') {
        if (openAgentSettings(props.t('settings.nav'))) {
          setOpen(false)
          return
        }
      }
      setInsertError(null)
      setOpen((prev) => !prev)
    }).catch(() => { setOpen((prev) => !prev) })
  }

  const pick = (slug: string): void => {
    if (!insertSelectedExpert(slug, props.getActive(), props.insertReference)) {
      setInsertError(props.t('error.insertFailed'))
      return
    }
    setInsertError(null)
    setOpen(false)
  }

  const groups = groupByDivision(EXPERTS.filter((e) => enabled.has(e.slug)), props.getActive())
  const menu = open
    ? React.createElement('div', { className: 'aag-menu' },
      insertError === null ? null : React.createElement('div', { className: 'aag-error', role: 'alert' }, insertError),
      groups.length === 0
        ? React.createElement('div', { className: 'aag-menu-empty' }, props.t('menu.empty'))
        : groups.map((g) => menuGroup(g, pick, props.t, props.getActive)))
    : null

  return React.createElement('div', { className: 'aag-btn-wrap' },
    React.createElement('button', { type: 'button', className: 'aag-btn', title: props.t('button.title'), onMouseDown: keepComposerFocus, onClick }, expertIcon(), React.createElement('span', null, props.t('settings.nav'))),
    menu)
}

interface CategoryOption {
  readonly value: string
  readonly label: string
}

function CategorySelect(props: {
  readonly id: string
  readonly value: string
  readonly options: ReadonlyArray<CategoryOption>
  readonly onChange: (value: string) => void
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const selectedIndex = Math.max(0, props.options.findIndex((option) => option.value === props.value))
  const [active, setActive] = React.useState(selectedIndex)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const wasOpen = React.useRef(false)
  const selected = props.options[selectedIndex]

  React.useEffect(() => {
    if (!open) return
    setActive(selectedIndex)
    const onPointerDown = (ev: PointerEvent): void => {
      const target = ev.target
      if (target instanceof Node && rootRef.current?.contains(target) === true) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, selectedIndex])

  React.useEffect(() => {
    if (open) {
      listRef.current?.focus()
      wasOpen.current = true
      return
    }
    if (wasOpen.current) {
      triggerRef.current?.focus()
      wasOpen.current = false
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    document.getElementById(props.id + '-opt-' + String(active))?.scrollIntoView({ block: 'nearest' })
  }, [active, open, props.id])

  const choose = (value: string): void => {
    props.onChange(value)
    setOpen(false)
  }

  const move = (next: number): void => {
    if (props.options.length === 0) return
    setActive(Math.min(props.options.length - 1, Math.max(0, next)))
  }

  const onTriggerKeyDown = (ev: React.KeyboardEvent): void => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      setOpen(true)
    }
  }

  const onListKeyDown = (ev: React.KeyboardEvent): void => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); move(active + 1); return }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); move(active - 1); return }
    if (ev.key === 'Home') { ev.preventDefault(); move(0); return }
    if (ev.key === 'End') { ev.preventDefault(); move(props.options.length - 1); return }
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      const option = props.options[active]
      if (option !== undefined) choose(option.value)
      return
    }
    if (ev.key === 'Escape' || ev.key === 'Tab') setOpen(false)
  }

  return React.createElement('div', { className: 'aag-select', ref: rootRef },
    React.createElement('button', {
      id: props.id,
      ref: triggerRef,
      type: 'button',
      className: 'aag-select-trigger',
      'aria-haspopup': 'listbox',
      'aria-expanded': open,
      'aria-controls': props.id + '-list',
      onClick: () => setOpen((current) => !current),
      onKeyDown: onTriggerKeyDown,
    },
      React.createElement('span', { className: 'aag-select-value' }, selected === undefined ? '' : selected.label),
      React.createElement('svg', { className: 'aag-select-caret', viewBox: '0 0 12 12', 'aria-hidden': true, focusable: false },
        React.createElement('path', { d: 'M2.5 4.5L6 8l3.5-3.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }))),
    open
      ? React.createElement('div', {
        id: props.id + '-list',
        ref: listRef,
        className: 'aag-select-menu',
        role: 'listbox',
        tabIndex: 0,
        'aria-activedescendant': props.id + '-opt-' + String(active),
        onKeyDown: onListKeyDown,
      }, props.options.map((option, index) => React.createElement('button', {
        key: option.value === '' ? 'all' : option.value,
        id: props.id + '-opt-' + String(index),
        type: 'button',
        role: 'option',
        className: 'aag-select-option',
        'aria-selected': option.value === props.value,
        'data-active': index === active,
        onMouseEnter: () => setActive(index),
        onClick: () => choose(option.value),
      }, option.label)))
      : null)
}

function AgentsSettings(props: PropsLocale<'agency'> & {
  remote: AgencyAgentsRemoteApi
  getActive: () => 'zh' | 'en'
  onEnabledChange?: (enabled: ReadonlySet<string>) => void
}): React.ReactElement {
  const [state, setState] = React.useState<EnabledState | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')
  const [division, setDivision] = React.useState('')
  const saving = React.useRef(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const load = React.useCallback((): void => {
    void readEnabled(props.remote).then((current) => {
      setState(current)
      setError(null)
      props.onEnabledChange?.(current.enabled)
    }).catch((err: unknown) => { setError(err instanceof Error ? err.message : String(err)) })
  }, [props.onEnabledChange, props.remote])

  React.useEffect(() => {
    let alive = true
    void readEnabled(props.remote).then((current) => {
      if (!alive) return
      setState(current)
      props.onEnabledChange?.(current.enabled)
    }).catch((err: unknown) => { if (alive) setError(err instanceof Error ? err.message : String(err)) })
    return () => { alive = false }
  }, [props.onEnabledChange, props.remote])

  const toggle = (slug: string): void => {
    if (state === null || saving.current) return
    const previous = state
    const next = new Set(state.enabled)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    saving.current = true
    setIsSaving(true)
    setState({ enabled: next, revision: state.revision })
    props.onEnabledChange?.(next)
    void writeEnabled(props.remote, next, state.revision)
      .then((current) => {
        setState(current)
        setError(null)
        props.onEnabledChange?.(current.enabled)
      })
      .catch(async (err: unknown) => {
        try {
          const refreshed = await readEnabled(props.remote)
          setState(refreshed)
          props.onEnabledChange?.(refreshed.enabled)
          setError(writeErrorMessage(err, { refreshed: true, t: props.t }))
        } catch {
          // 读也失败时回滚乐观态，避免界面显示未落盘的开关结果。
          setState(previous)
          props.onEnabledChange?.(previous.enabled)
          setError(writeErrorMessage(err, { refreshed: false, t: props.t }))
        }
      })
      .finally(() => {
        saving.current = false
        setIsSaving(false)
      })
  }

  const nodes: React.ReactNode[] = []
  if (error !== null) nodes.push(React.createElement('div', { key: 'error', className: 'aag-error', role: 'alert' }, error))
  if (state === null) {
    nodes.push(React.createElement('div', { key: 'loading', className: 'aag-note' }, props.t('settings.loading')))
  } else {
    const filtered = filterExperts(EXPERTS, { query, division })
    const groups = groupByDivision(filtered, props.getActive())
    const enabledCount = [...state.enabled].filter((slug) => EXPERTS.some((e) => e.slug === slug)).length
    const total = EXPERTS.length
    const filteredCount = filtered.length
    const hasFilter = normalizeExpertQuery(query) !== '' || division !== ''
    const resetFilters = (): void => { setQuery(''); setDivision('') }
    nodes.push(React.createElement('div', { key: 'toolbar', className: 'aag-toolbar' },
      React.createElement('div', null,
        React.createElement('div', { className: 'aag-title-row' },
          React.createElement('h2', { className: 'aag-title' }, props.t('settings.nav')),
          settingsGithubLinks(props.t)),
        React.createElement('p', { className: 'aag-desc' }, props.t('settings.intro'))),
      React.createElement('div', { className: 'aag-actions' },
        React.createElement('button', { type: 'button', className: 'aag-action aag-action-secondary', disabled: isSaving, onClick: load }, props.t('btn.refresh')))))
    nodes.push(React.createElement('div', { key: 'summary', className: 'aag-summary' },
      React.createElement('span', { className: 'aag-summary-count' }, total),
      React.createElement('span', { className: 'aag-summary-label' }, props.t(total === 1 ? 'summary.total.one' : 'summary.total.other', { count: total })),
      React.createElement('span', { className: 'aag-summary-separator' }),
      React.createElement('span', { className: 'aag-summary-count' }, enabledCount),
      React.createElement('span', { className: 'aag-summary-label' }, props.t(enabledCount === 1 ? 'summary.enabled.one' : 'summary.enabled.other', { count: enabledCount })),
      hasFilter ? React.createElement('span', { className: 'aag-filter-meta', 'aria-live': 'polite' }, props.t(filteredCount === 1 ? 'settings.filter.showing.one' : 'settings.filter.showing.other', { count: filteredCount })) : null))
    nodes.push(React.createElement('div', { key: 'filters', className: 'aag-filters' },
      React.createElement('div', { className: 'aag-field aag-field-category' },
        React.createElement('label', { className: 'aag-label', htmlFor: 'aag-filter-category' }, props.t('settings.filter.category')),
        React.createElement(CategorySelect, {
          id: 'aag-filter-category',
          value: division,
          onChange: setDivision,
          options: [
            { value: '', label: props.t('settings.filter.option', { name: props.t('settings.filter.all'), count: total }) },
            ...DIVISION_ORDER.map((key) => ({
              value: key,
              label: props.t('settings.filter.option', { name: props.t(`division.${key}` as AgencyKey), count: DIVISION_COUNTS[key] ?? 0 }),
            })),
          ],
        })),
      React.createElement('div', { className: 'aag-field aag-field-search' },
        React.createElement('label', { className: 'aag-label', htmlFor: 'aag-filter-search' }, props.t('settings.search')),
        React.createElement('div', { className: 'aag-search-wrap' },
          React.createElement('input', {
            id: 'aag-filter-search',
            className: 'aag-control aag-search',
            type: 'search',
            value: query,
            autoComplete: 'off',
            spellCheck: false,
            placeholder: props.t('settings.search.placeholder'),
            onChange: (ev: { currentTarget: { value: string } }) => setQuery(ev.currentTarget.value),
          }),
          query !== '' ? React.createElement('button', { type: 'button', className: 'aag-search-clear', 'aria-label': props.t('settings.search.clear'), onClick: () => setQuery('') }, '×') : null))))
    if (groups.length === 0) {
      nodes.push(React.createElement('div', { key: 'empty', className: 'aag-empty' },
        React.createElement('div', null, props.t('settings.empty', { all: props.t('settings.filter.all') })),
        React.createElement('button', { type: 'button', className: 'aag-action aag-action-secondary', onClick: resetFilters }, props.t('settings.empty.reset'))))
    }
    for (const g of groups) {
      nodes.push(React.createElement('div', { key: g.division, className: 'aag-group' },
        React.createElement('div', { className: 'aag-group-head' },
          React.createElement('h3', { className: 'aag-group-title' }, props.t(`division.${g.division}` as AgencyKey)),
          React.createElement('span', { className: 'aag-count' }, props.t('summary.group', { count: g.experts.length }))),
        g.experts.map((e) => {
          const on = state.enabled.has(e.slug)
          return React.createElement('div', { key: e.slug, className: 'aag-row' },
            React.createElement('div', { className: 'aag-row-main' },
              React.createElement('div', { className: 'aag-row-id' },
                React.createElement('span', { className: 'aag-row-name' }, displayName(e, props.getActive())),
                React.createElement('span', { className: `aag-tag ${on ? 'aag-tag-on' : 'aag-tag-off'}` }, props.t(on ? 'settings.enabled' : 'settings.disabled'))),
              React.createElement('div', { className: 'aag-note', title: displayDescription(e, props.getActive()) }, displayDescription(e, props.getActive()))),
            React.createElement('button', { type: 'button', className: 'aag-action aag-action-secondary', disabled: isSaving, onClick: () => toggle(e.slug) }, props.t(on ? 'btn.disable' : 'btn.enable')))
        })))
    }
  }
  return React.createElement('section', { className: 'aag-section' }, nodes)
}

export const inject = ['slots', 'inputTriggers', 'locale', 'remote', 'sessions', 'conversation']

export async function apply(ctx: ClientContext): Promise<() => void> {
  ctx.effect(() => {
    const tag = document.createElement('style')
    tag.dataset.plugin = PLUGIN_ID
    tag.textContent = CSS
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, 'agency-agents: style')

  // 注册双语词条；t 为稳定引用（调用时读取当前 locale），locale 切换由
  // framework 以 (namespace, revision) 重新派生注入的 t 并触发重渲染。
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'agency-agents: dictionaries')
  const t = ctx.locale.bind(NS)
  const getActive = (): 'zh' | 'en' => ctx.locale.getSnapshot().active === 'en' ? 'en' : 'zh'

  // 挂载本插件的 Typert Remote：host 端由 gateway 的 SRC 自动发现（@Remote
  // markers）。namespace 是独立的 Cordis 服务，必须在挂载后通过 ctx.get()
  // 获取；直接读取 ctx.remote.agencyAgents 会要求预先注入该服务并导致死锁。
  const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)
  const remote = ctx.get('remote.agencyAgents') as AgencyAgentsRemoteApi | undefined
  if (remote === undefined) throw new Error('agency-agents Remote 挂载后不可用')

  let enabledForMentions: ReadonlySet<string> | undefined
  const lexiconListeners = new Set<() => void>()
  const updateEnabledForMentions = (enabled: ReadonlySet<string>): void => {
    const unchanged = enabledForMentions !== undefined
      && enabledForMentions.size === enabled.size
      && [...enabled].every((slug) => enabledForMentions?.has(slug) === true)
    if (unchanged) return
    enabledForMentions = new Set(enabled)
    for (const listener of lexiconListeners) listener()
  }
  const refreshEnabledForMentions = (): void => {
    void readEnabled(remote).then((current) => updateEnabledForMentions(current.enabled)).catch(() => undefined)
  }
  const bindExpertInsertion = (sessionId?: SessionId): {
    readonly insertReference: (reference: ReferenceInsert) => boolean
  } => {
    const target = (): ReferenceInsertionTarget | undefined => resolveReferenceInsertionTarget(
      ctx.sessions as unknown as ReferenceSessionAccess,
      sessionId,
      (actx) => actx.get('conversation') as ReferenceConversationAccess | undefined,
    )
    return { insertReference: (reference) => insertExpertReference(target(), reference) }
  }

  ctx.slots.inject('settings.section', () => ctx.slots.register(
    // label 是 thunk：nav 行每渲染读一次，locale 切换后自动跟随。
    {
      name: 'settings.section', id: 'agency-agents', order: 16, label: () => t('settings.nav'), locale: NS,
      ...({ icon: 'expert' } as Record<string, unknown>),
    },
    (props) => React.createElement(AgentsSettings, { ...props, remote, getActive, onEnabledChange: updateEnabledForMentions }),
  ))

  ctx.slots.inject('conversation.input.left', () => ctx.slots.register(
    {
      name: 'conversation.input.left', id: 'agency-agents', order: 0, locale: NS,
      ...({ inject: bindExpertInsertion } as Record<string, unknown>),
    },
    (props) => React.createElement(AgentsButton, { ...props, remote, getActive, onEnabledChange: updateEnabledForMentions }),
  ))

  const registerInputTriggerSources = (active: 'zh' | 'en'): (() => void) => {
    const disposers: Array<() => void> = []
    try {
      for (const [i, div] of DIVISION_ORDER.entries()) {
        const source = {
          trigger: '@',
          name: inputTriggerSourceId(div),
          order: 100 + i,
          showGroupTitle: false,
          candidates: async (_session, req) => {
            const current = await readEnabled(remote).catch(() => undefined)
            if (current === undefined) return []
            const enabled = current.enabled
            updateEnabledForMentions(enabled)
            const q = String(req.query ?? '').toLowerCase()
            return EXPERTS
              .filter((e) => e.division === div && enabled.has(e.slug) && (q === '' || e.name.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q)))
              .map((e) => ({
                name: inputTriggerCandidateName(e, getActive()),
                hint: e.slug,
                section: inputTriggerSourceName(div, getActive()),
              }))
          },
          onPick: (pick) => {
            const slug = pick.candidate.hint ?? ''
            const expert = EXPERTS.find((item) => item.slug === slug)
            return expert === undefined ? undefined : { insert: buildExpertReference(expert, getActive()) }
          },
          ...(i === 0 ? { warm: () => refreshEnabledForMentions() } : {}),
          lexicon: () => enabledForMentions === undefined
            ? undefined
            : buildExpertMentionLexicon(EXPERTS.filter((expert) => expert.division === div), enabledForMentions, getActive()),
          subscribeLexicon: (_session, listener) => {
            lexiconListeners.add(listener)
            return () => { lexiconListeners.delete(listener) }
          },
          codec: {
            clipboardText: (slug) => expertMentionFromReference(slug, getActive()),
            serialize: async (slug) => expertMentionFromReference(slug, getActive()),
          },
        } as InputTriggerSource & { readonly showGroupTitle?: boolean }
        disposers.push(ctx.inputTriggers.registerSource(source))
      }
    } catch (error) {
      for (const dispose of disposers.reverse()) dispose()
      throw error
    }
    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  }

  ctx.effect(() => {
    let active = getActive()
    let disposeSources = registerInputTriggerSources(active)
    const unsubscribe = ctx.locale.subscribe(() => {
      const next = getActive()
      if (next === active) return

      disposeSources()
      try {
        disposeSources = registerInputTriggerSources(next)
        active = next
      } catch (error) {
        disposeSources = registerInputTriggerSources(active)
        console.error('[agency-agents] @ 菜单分组语言切换失败，已恢复原语言来源：', error)
      }
    })
    return () => {
      unsubscribe()
      disposeSources()
    }
  }, 'agency-agents: @ menu sources')

  return () => { void disposeRemote() }
}
