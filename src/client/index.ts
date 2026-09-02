import React from 'react'
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type { InputTriggerSource, ReferenceInsert, TokenSpan } from '@deepseek-ai/dsh-client-ui-input-trigger/client'
// Type-only: 拉入 api-remotes 的 ctx.remote 合并（client 侧 TypertClientRemote）。
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { PropsLocale, TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
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

/** 菜单选中后补一个分隔空格，避免新插入的 @名称立即再次触发候选菜单。 */
export function formatExpertMentionInsertion(name: string): string {
  return `${formatExpertMention(name)} `
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
    clipboardText: formatExpertMention(name),
  }
}

function expertMentionFromReference(slug: string, active: 'zh' | 'en'): string {
  const expert = EXPERTS.find((item) => item.slug === slug)
  if (expert === undefined) throw new Error('专家引用已失效')
  return formatExpertMention(displayName(expert, active))
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
@media (max-width:560px){.aag-toolbar{flex-wrap:wrap}.aag-actions{margin-left:0}.aag-filters{flex-direction:column;align-items:stretch}.aag-field-category,.aag-field-search{flex:none}.aag-row{align-items:flex-start;flex-wrap:wrap}.aag-row>.aag-action{margin-left:auto}.aag-filter-meta{margin-left:0}}
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

function openAgentSettings(t: TranslateNS<'agency'>): void {
  if (document.querySelector('[role="dialog"]') === null) {
    const trigger = document.querySelector('button[aria-haspopup="dialog"]')
    if (trigger instanceof HTMLElement) trigger.click()
  }
  const select = (): void => {
    const buttons = document.querySelectorAll('[role="dialog"] nav button')
    for (const button of buttons) {
      if (button.textContent !== null && button.textContent.trim() === t('settings.nav')) { (button as HTMLElement).click(); return }
    }
  }
  window.requestAnimationFrame(() => { window.requestAnimationFrame(select) })
}

interface InputActions {
  setDraft(draft: string): void
  submit(): void
}

/** 输入机暴露给工具栏的最小原子引用写入面，避免依赖 slot 的非标准 owner 参数。 */
export interface ReferenceInsertionTarget {
  readonly state: { getSnapshot(): { readonly draftRev: number } }
  insertReference(reference: ReferenceInsert, span: TokenSpan): boolean
}

/** 从当前或指定会话取得输入机；兼容未向工具栏 slot 注入 sessionId 的宿主版本。 */
export interface ReferenceSessionAccess {
  readonly list?: { getSnapshot(): { readonly current?: SessionId } }
  scope?(id: SessionId): ClientContext | undefined
  binding?(id: SessionId): { readonly ctx: ClientContext } | undefined
}

export interface ReferenceConversationAccess {
  readonly input: { for(actx: ClientContext): ReferenceInsertionTarget | undefined }
}

export function resolveReferenceInsertionTarget(
  sessions: ReferenceSessionAccess,
  conversation: ReferenceConversationAccess,
  sessionId?: SessionId,
): ReferenceInsertionTarget | undefined {
  const targetSessionId = sessionId ?? sessions.list?.getSnapshot().current
  if (targetSessionId === undefined) return undefined
  const actx = sessions.scope?.(targetSessionId) ?? sessions.binding?.(targetSessionId)?.ctx
  return actx === undefined ? undefined : conversation.input.for(actx)
}

/** 通过当前会话的输入机插入 chip；工具栏绝不能降级写入普通 @ 文本。 */
export function insertExpertReference(
  target: ReferenceInsertionTarget | undefined,
  reference: ReferenceInsert,
): boolean {
  if (target === undefined) return false
  return target.insertReference(reference, {
    start: 0,
    end: 0,
    draftRev: target.state.getSnapshot().draftRev,
  })
}

/** 根据当前草稿生成简短、可本地化的专家名称标签，任务内容另起一段。 */
export function buildSummonInstruction(
  t: TranslateNS<'agency'>,
  name: string,
  draft: string,
): string {
  const hasTask = draft.trim().length > 0
  return t(hasTask ? 'summon.instruction.withTask' : 'summon.instruction', { name: formatExpertMention(name), task: draft })
}

/** 将召唤指令写入输入框。有草稿时也不自动发送，留给用户确认后再提交。 */
export function applyExpertSummon(options: {
  readonly inputActions?: InputActions
  readonly instruction: string
}): void {
  if (options.inputActions !== undefined) {
    options.inputActions.setDraft(options.instruction)
  }
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
      if (current.enabled.size === 0) { openAgentSettings(props.t); return }
      setOpen((prev) => !prev)
    }).catch(() => { setOpen((prev) => !prev) })
  }

  const pick = (slug: string): void => {
    const expert = EXPERTS.find((e) => e.slug === slug)
    if (expert !== undefined) props.insertReference?.(buildExpertReference(expert, props.getActive()))
    setOpen(false)
  }

  const groups = groupByDivision(EXPERTS.filter((e) => enabled.has(e.slug)), props.getActive())
  const menu = open
    ? React.createElement('div', { className: 'aag-menu' },
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
        React.createElement('h2', { className: 'aag-title' }, props.t('settings.nav')),
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
  const getActive = (): 'zh' | 'en' => ctx.locale.getSnapshot().active

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
  const bindExpertInsertion = (sessionId: SessionId): { readonly insertReference: (reference: ReferenceInsert) => boolean } => {
    // 必须在 slot 注入时绑定 session scope。根上下文读取 sessions 会被 Cordis 拒绝，
    // 且不能保证对应屏幕上的编辑器。
    const sessions = ctx.sessions as unknown as ReferenceSessionAccess
    const actx = sessions.scope?.(sessionId) ?? sessions.binding?.(sessionId)?.ctx
    const conversation = actx?.get('conversation') as ReferenceConversationAccess | undefined
    return {
      insertReference: (reference) => insertExpertReference(
        actx === undefined ? undefined : conversation?.input.for(actx),
        reference,
      ),
    }
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
                name: inputTriggerCandidateName(e, ctx.locale.getSnapshot().active),
                hint: e.slug,
                section: inputTriggerSourceName(div, ctx.locale.getSnapshot().active),
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
