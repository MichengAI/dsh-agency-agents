/**
 * 专家管理器在 DSH 设置侧边导航栏中的专属图标。
 *
 * 采用独立 CSS mask span，不改写宿主 svg：
 * 第三方皮肤（如 orca-link / dsh-deep-whale）会按 svg 内部形状识别图标，
 * 给 svg 打标记后用 CSS 隐藏其子节点。直接替换 svg.innerHTML 会与皮肤的
 * 内容级识别机制互相覆盖，最终导致图标整体不可见。
 * 这里只给宿主 svg 打 marker 后用 CSS 隐藏，卸载时完整移除本插件插入的节点。
 */

export const NAV_ICON_MARKER = 'data-aag-nav-icon'
export const NAV_ICON_CLASS = 'aag-nav-icon-expert'
export const NAV_ROW_SELECTOR = '[role="dialog"] nav button'

/** 100% 对齐 dsh-codex-ui 官方的专家/用户专属矢量路径（viewBox: 0 0 16 16） */
export const EXPERT_PATHS = '<circle cx="8" cy="4.8" r="3.2" stroke="currentColor" stroke-width="1.3" fill="none"/>'
  + '<path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>'

/** mask 只取 alpha 通道，因此把 currentColor 固定为黑色即可 */
const EXPERT_ICON_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${EXPERT_PATHS.replace(/currentColor/g, 'black')}</svg>`,
)}")`

const NAV_ICON_STYLE_ID = 'aag-settings-nav-icon-style'
const NAV_ICON_CSS = `[${NAV_ICON_MARKER}="expert"]>svg{display:none!important}.${NAV_ICON_CLASS}{display:inline-block;flex:none;width:16px;height:16px;background:currentColor;-webkit-mask:${EXPERT_ICON_MASK} center/contain no-repeat;mask:${EXPERT_ICON_MASK} center/contain no-repeat}`

/** 注入导航图标样式；重复安装时复用同一个 style 元素 */
function ensureNavIconStyle(doc: Document): void {
  if (doc.getElementById(NAV_ICON_STYLE_ID) !== null) return
  const style = doc.createElement('style')
  style.id = NAV_ICON_STYLE_ID
  style.textContent = NAV_ICON_CSS
  ;(doc.head ?? doc.documentElement).appendChild(style)
}

export function isOwnNavRow(rowText: string | null | undefined, wantedLabel: string | null | undefined): boolean {
  const wanted = String(wantedLabel ?? '').trim()
  if (wanted.length === 0) return false
  const current = String(rowText ?? '').trim()
  return current === wanted || current === '专家' || current === 'Experts' || current === '智能体'
}

/**
 * 用独立 mask 图标覆盖设置导航入口图标。
 * 宿主 svg 保持原样，避免与皮肤的内容级图标识别/隐藏规则互相覆盖。
 */
export function applySettingsNavIcon(button: Element, wantedLabel: () => string): boolean {
  if (!isOwnNavRow(button.textContent, wantedLabel())) return false
  // 只认宿主直接渲染在按钮里的图标；包裹型图标插入额外节点会打乱布局
  if (!button.querySelector(':scope > svg')) return false
  if (button.getAttribute(NAV_ICON_MARKER) === 'expert' && button.querySelector(`.${NAV_ICON_CLASS}`)) return false

  const doc = button.ownerDocument
  if (!doc) return false
  button.setAttribute(NAV_ICON_MARKER, 'expert')
  if (button.querySelector(`.${NAV_ICON_CLASS}`)) return false

  const icon = doc.createElement('span')
  icon.className = NAV_ICON_CLASS
  icon.setAttribute('aria-hidden', 'true')
  button.prepend(icon)
  return true
}

/** 移除本插件添加的图标与标记，宿主 svg 内容始终未被动过 */
export function restoreSettingsNavIcon(button: Element): boolean {
  const marked = button.hasAttribute(NAV_ICON_MARKER)
  const icon = button.querySelector(`.${NAV_ICON_CLASS}`)
  if (!marked && !icon) return false
  button.removeAttribute(NAV_ICON_MARKER)
  icon?.remove()
  return true
}

export interface NavIconContext {
  effect(callback: () => unknown, label?: string): void
}

/**
 * 安装设置导航图标补丁。
 * 通过 MutationObserver 覆盖设置弹窗异步挂载、语言切换和宿主重渲染的场景。
 */
export function installSettingsNavIcon(ctx: NavIconContext): void {
  if (typeof document === 'undefined') return
  ensureNavIconStyle(document)

  ctx.effect(() => {
    let disposed = false
    let scheduled = false

    const sync = () => {
      scheduled = false
      if (disposed) return
      for (const row of document.querySelectorAll(NAV_ROW_SELECTOR)) {
        applySettingsNavIcon(row, () => '专家')
      }
    }

    const schedule = () => {
      if (scheduled || disposed) return
      scheduled = true
      queueMicrotask(sync)
    }

    sync()
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })

    return () => {
      disposed = true
      observer.disconnect()
      for (const row of document.querySelectorAll(`[${NAV_ICON_MARKER}]`)) {
        restoreSettingsNavIcon(row)
      }
    }
  }, 'agency-agents: settings nav icon')
}
