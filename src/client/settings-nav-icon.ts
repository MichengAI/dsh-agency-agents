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
export const NAV_ROW_SELECTOR = '[role="dialog"] nav button'

/** 100% 对齐 dsh-codex-ui 官方的专家/用户专属矢量路径（viewBox: 0 0 16 16） */
export const EXPERT_PATHS = '<circle cx="8" cy="4.8" r="3.2" stroke="currentColor" stroke-width="1.3" fill="none"/>'
  + '<path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>'

/** mask 只取 alpha 通道，因此把 currentColor 固定为黑色即可 */
const EXPERT_ICON_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${EXPERT_PATHS.replace(/currentColor/g, 'black')}</svg>`,
)}")`

const NAV_ICON_STYLE_ID = 'aag-settings-nav-icon-style'
const NAV_ICON_CSS = [
  `[${NAV_ICON_MARKER}] > svg { display: none !important; }`,
  `[${NAV_ICON_MARKER}]::before {`,
  `  content: '';`,
  `  flex: none;`,
  `  width: 16px;`,
  `  height: 16px;`,
  `  background-color: currentColor;`,
  `  -webkit-mask: ${EXPERT_ICON_MASK} center / contain no-repeat;`,
  `  mask: ${EXPERT_ICON_MASK} center / contain no-repeat;`,
  `  -webkit-mask-repeat: no-repeat;`,
  `  mask-repeat: no-repeat;`,
  `  -webkit-mask-position: center;`,
  `  mask-position: center;`,
  `  -webkit-mask-size: 16px 16px;`,
  `  mask-size: 16px 16px;`,
  `}`,
].join('\n')

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
 * 100% 对齐 dshmarket：用纯属性标记控制 ::before 伪元素渲染图标。
 * 不修改任何 DOM 节点，避免移动端列表项排版下与文字重叠冲突。
 */
export function applySettingsNavIcon(button: Element, wantedLabel: () => string): boolean {
  const isOwn = isOwnNavRow(button.textContent, wantedLabel())
  if (isOwn) {
    if (button.getAttribute(NAV_ICON_MARKER) === '') return false
    button.setAttribute(NAV_ICON_MARKER, '')
    return true
  }
  if (button.hasAttribute(NAV_ICON_MARKER)) {
    button.removeAttribute(NAV_ICON_MARKER)
    return true
  }
  return false
}

/** 移除本插件添加的标记，宿主 svg 恢复显示 */
export function restoreSettingsNavIcon(button: Element): boolean {
  if (!button.hasAttribute(NAV_ICON_MARKER)) return false
  button.removeAttribute(NAV_ICON_MARKER)
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
