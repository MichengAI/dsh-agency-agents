import React from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { InputTriggerSource } from '@deepseek-ai/dsh-client-ui-input-trigger/client'
// Type-only: 拉入 api-remotes 的 ctx.remote 合并（client 侧 TypertClientRemote）。
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { PropsLocale, TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
// Type-only: 拉入 ctx.locale 的 Context merge（跨插件协作只走服务，不做值导入）。
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { ZH_NAME, ZH_DIVISION } from '../names.js'
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
  'sales', 'security', 'spatial-computing', 'specialized', 'support', 'testing',
]

interface ExpertView {
  readonly slug: string
  readonly name: string
  readonly nameEn: string
  readonly emoji: string
  readonly division: string
  readonly divisionZh: string
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
    description: e.description,
    descriptionEn: e.descriptionEn,
  }))
  .sort((a, b) => a.division.localeCompare(b.division) || a.slug.localeCompare(b.slug))

function groupByDivision(list: ReadonlyArray<ExpertView>): ExpertGroup[] {
  const groups = new Map<string, ExpertView[]>()
  for (const e of list) {
    const arr = groups.get(e.division) ?? []
    arr.push(e)
    groups.set(e.division, arr)
  }
  return DIVISION_ORDER.filter((d) => groups.has(d)).map((d) => ({
    division: d,
    divisionZh: ZH_DIVISION[d] ?? d,
    experts: (groups.get(d) ?? []).slice().sort((a, b) => a.name.localeCompare(b.name, 'zh')),
  }))
}

/** 按当前 locale 取专家显示名：en 用花名册英文名，其余用中文名。 */
function displayName(e: ExpertView, active: 'zh' | 'en'): string {
  return active === 'en' ? e.nameEn : e.name
}

/** 按当前 locale 取专家简介：en 用原始英文描述（缺失时回退中文），其余用中文描述。 */
function displayDescription(e: ExpertView, active: 'zh' | 'en'): string {
  return active === 'en' && e.descriptionEn !== '' ? e.descriptionEn : e.description
}

// @ 菜单里我注册的分部来源：框架把名字列限死在菜单宽度 40% 并省略号截断
// （MenuView.module.css .itemName），这里放开名字列，让专家名称整行显示，
// 选择器只匹配我的分组（data-source 为分部 key「division.<div>」——MenuView
// 渲染分组标题时用 t(source.name)，但 data-source 属性保持原始 key，故选择器
// 必须与注册的 source.name 一致，不能用翻译后的标题文本），不影响其他来源。
const MENU_NAME_OVERRIDE = DIVISION_ORDER
  .map((d) => `[role="listbox"] div[data-source="division.${d}"] ~ button span:last-child`)
  .join(',')
const CSS = '.aag-btn-wrap{position:relative;order:1;margin-right:-8px}.aag-btn{display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 4px 0 8px;border:none;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px;font-weight:500;cursor:pointer}.aag-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.aag-menu{position:absolute;bottom:calc(100% + 4px);left:0;box-sizing:border-box;padding:4px;display:flex;flex-direction:column;gap:0;width:300px;max-width:360px;max-height:calc(100vh - 24px);overflow-y:auto;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);z-index:10000}.aag-menu-title{padding:8px 10px;font-size:12px;line-height:16px;color:var(--dsw-alias-label-tertiary)}.aag-menu-item{display:flex;align-items:center;gap:8px;width:100%;min-height:40px;padding:8px 10px;border:none;border-radius:10px;background:transparent;cursor:pointer;text-align:left;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary);box-sizing:border-box}.aag-menu-item:hover{background:var(--dsw-alias-interactive-bg-hover)}.aag-emoji{flex:0 0 auto;font-size:16px}.aag-menu-empty{padding:8px 10px;color:var(--dsw-alias-label-secondary);font-size:13px}.aag-settings{box-sizing:border-box;max-width:760px;width:100%;margin:0 auto;padding:0 0 32px}.aag-head{margin:0 0 8px}.aag-title{margin:0;font-size:20px;line-height:28px;font-weight:650;letter-spacing:-.2px}.aag-intro{margin:4px 0 0;max-width:42em;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}.aag-group{margin:0}.aag-group-title{font-size:12px;font-weight:600;color:var(--dsw-alias-label-tertiary);margin:16px 0 0;padding:8px 0 4px}.aag-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px 0;border-top:1px solid var(--dsw-alias-border-l2)}.aag-group .aag-row:first-of-type{border-top:0;padding-top:8px}.aag-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.aag-name{font-size:13px;font-weight:500;color:var(--dsw-alias-label-primary)}.aag-desc{margin:0;font-size:12px;line-height:1.5;color:var(--dsw-alias-label-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.aag-switch{position:relative;width:42px;height:26px;flex:none;border:0;border-radius:999px;background:rgba(120,120,128,.36);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);cursor:pointer}.aag-switch:after{content:\'\';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.28);transition:transform .16s ease}.aag-switch.is-on{background:#34c759}.aag-switch.is-on:after{transform:translateX(16px)}.aag-switch:disabled{opacity:.5;cursor:default}.aag-loading,.aag-empty,.aag-error{padding:20px 0;color:var(--dsw-alias-label-secondary);font-size:13px}[data-composer-card] :has(> button[aria-haspopup="listbox"]) > :nth-child(2){order:2}' + MENU_NAME_OVERRIDE + '{flex:1 1 auto;max-width:none;min-width:0}'

/** 本插件 Remote 命名空间的 client 侧 face（ctx.remote.agencyAgents 的形状）。 */
interface AgencyAgentsRemoteApi {
  getEnabled(): Promise<RemoteResult<AgencyAgentsEnabledState>>
  setEnabled(enabled: string[], expectedRevision: number): Promise<RemoteResult<AgencyAgentsEnabledState>>
}

interface EnabledState {
  readonly enabled: ReadonlySet<string>
  readonly revision: number
}

const SETTINGS_CONFLICT_MESSAGE = '配置已被其他窗口修改，已为您刷新。'

export function writeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.includes('changed since it was read')) return SETTINGS_CONFLICT_MESSAGE
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

function menuItem(e: ExpertView, pick: (slug: string) => void, getActive: () => 'zh' | 'en'): React.ReactElement {
  return React.createElement('button', { key: e.slug, type: 'button', className: 'aag-menu-item', onMouseDown: (ev: React.MouseEvent) => { ev.preventDefault(); pick(e.slug) } },
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

interface InputDraft { readonly draft?: string }
interface InputActions { setDraft(draft: string): void; submit(): void }
type ButtonProps = PropsLocale<'agency'> & {
  readonly input?: InputDraft
  readonly inputActions?: InputActions
  readonly remote: AgencyAgentsRemoteApi
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
      if (current.enabled.size === 0) { openAgentSettings(props.t); return }
      setOpen((prev) => !prev)
    }).catch(() => { setOpen((prev) => !prev) })
  }

  const pick = (slug: string): void => {
    const expert = EXPERTS.find((e) => e.slug === slug)
    const name = expert === undefined ? slug : displayName(expert, props.getActive())
    const draft = props.input !== undefined && typeof props.input.draft === 'string' ? props.input.draft : ''
    const hasTask = draft.trim().length > 0
    // 用完整词条模板生成召唤指令（禁止字符串拼接）；withTask 模板含 {task} 占位，
    // 无任务模板不含该占位，多传的 task 参数不会被使用。
    const instruction = props.t(hasTask ? 'summon.instruction.withTask' : 'summon.instruction', { name, slug, task: draft })
    if (props.inputActions !== undefined) {
      props.inputActions.setDraft(instruction)
      if (hasTask) props.inputActions.submit()
    }
    setOpen(false)
  }

  const groups = groupByDivision(EXPERTS.filter((e) => enabled.has(e.slug)))
  const menu = open
    ? React.createElement('div', { className: 'aag-menu' },
      groups.length === 0
        ? React.createElement('div', { className: 'aag-menu-empty' }, props.t('menu.empty'))
        : groups.map((g) => menuGroup(g, pick, props.t, props.getActive)))
    : null

  return React.createElement('div', { className: 'aag-btn-wrap' },
    React.createElement('button', { type: 'button', className: 'aag-btn', title: props.t('button.title'), onClick }, expertIcon(), React.createElement('span', null, props.t('settings.nav'))),
    menu)
}

function AgentsSettings(props: PropsLocale<'agency'> & { remote: AgencyAgentsRemoteApi; getActive: () => 'zh' | 'en' }): React.ReactElement {
  const [state, setState] = React.useState<EnabledState | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const saving = React.useRef(false)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    let alive = true
    void readEnabled(props.remote).then((current) => {
      if (!alive) return
      setState(current)
    }).catch((err: unknown) => { if (alive) setError(err instanceof Error ? err.message : String(err)) })
    return () => { alive = false }
  }, [props.remote])

  const toggle = (slug: string): void => {
    if (state === null || saving.current) return
    const next = new Set(state.enabled)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    saving.current = true
    setIsSaving(true)
    setState({ enabled: next, revision: state.revision })
    void writeEnabled(props.remote, next, state.revision)
      .then(setState)
      .catch(async (err: unknown) => {
        try {
          setState(await readEnabled(props.remote))
        } catch {
          // 保留当前乐观状态；原始错误仍会显示给用户。
        }
        setError(writeErrorMessage(err))
      })
      .finally(() => {
        saving.current = false
        setIsSaving(false)
      })
  }

  if (error !== null) return React.createElement('div', { className: 'aag-error' }, error)
  if (state === null) return React.createElement('div', { className: 'aag-loading' }, props.t('settings.loading'))
  const groups = groupByDivision(EXPERTS)
  return React.createElement('div', { className: 'aag-settings' },
    React.createElement('header', { className: 'aag-head' },
      React.createElement('h2', { className: 'aag-title' }, props.t('settings.nav')),
      React.createElement('p', { className: 'aag-intro' }, props.t('settings.intro'))),
    groups.map((g) => React.createElement('div', { key: g.division, className: 'aag-group' },
      // 分部名也经 t 翻译：模板 {division} 由内层 t 按当前 locale 求值。
      React.createElement('div', { className: 'aag-group-title' }, props.t('group.count', { division: props.t(`division.${g.division}` as AgencyKey), count: g.experts.length })),
      g.experts.map((e) => React.createElement('div', { key: e.slug, className: 'aag-row' },
        React.createElement('span', { className: 'aag-emoji' }, e.emoji),
        React.createElement('div', { className: 'aag-info' },
          React.createElement('div', { className: 'aag-name' }, displayName(e, props.getActive())),
          React.createElement('div', { className: 'aag-desc' }, displayDescription(e, props.getActive()))),
        React.createElement('button', { type: 'button', role: 'switch', 'aria-checked': state.enabled.has(e.slug), 'aria-label': props.t(state.enabled.has(e.slug) ? 'settings.enabled' : 'settings.disabled'), disabled: isSaving, className: `aag-switch ${state.enabled.has(e.slug) ? 'is-on' : ''}`, onClick: () => toggle(e.slug) }))))))
}

export const inject = ['slots', 'inputTriggers', 'locale', 'remote']

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

  ctx.slots.inject('settings.section', () => ctx.slots.register(
    // label 是 thunk：nav 行每渲染读一次，locale 切换后自动跟随。
    {
      name: 'settings.section', id: 'agency-agents', order: 16, label: () => t('settings.nav'), locale: NS,
      ...({ icon: 'expert' } as Record<string, unknown>),
    },
    (props) => React.createElement(AgentsSettings, { ...props, remote, getActive }),
  ))

  ctx.slots.inject('conversation.input.left', () => ctx.slots.register(
    { name: 'conversation.input.left', id: 'agency-agents', order: 0, locale: NS },
    (props) => React.createElement(AgentsButton, { ...props, remote, getActive }),
  ))

  for (const [i, div] of DIVISION_ORDER.entries()) {
    const source: InputTriggerSource = {
      trigger: '@',
      // source.name 是词条 key：MenuView 用 t(source.name) 渲染分组标题，
      // 未注册的 key 会原样显示（MenuView 开放 key 模式）。
      name: `division.${div}`,
      order: 100 + i,
      candidates: async (_session, req) => {
        const enabled = await readEnabled(remote).then((state) => state.enabled).catch(() => new Set<string>())
        const q = String(req.query ?? '').toLowerCase()
        return EXPERTS
          .filter((e) => e.division === div && enabled.has(e.slug) && (q === '' || e.name.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q) || e.slug.includes(q)))
          .map((e) => ({ name: displayName(e, ctx.locale.getSnapshot().active), icon: e.emoji, hint: e.slug }))
      },
      onPick: (pick) => ({ text: t('summon.instruction', { name: pick.candidate.name, slug: pick.candidate.hint ?? '' }) }),
    }
    ctx.effect(() => ctx.inputTriggers.registerSource(source), `agency-agents: @${div}`)
  }

  return () => { void disposeRemote() }
}
