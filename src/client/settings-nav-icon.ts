/**
 * 专家管理器在 DSH 设置侧边导航栏中的专属图标。
 * 
 * 机制对齐 dsh-skills-manager 与 dshmarket：
 * 宿主 settings.section 插槽未暴露 icon 字段，默认第三方降级为齿轮。
 * 通过 MutationObserver 识别当前插件并打标，使用 CSS mask-image 配合 currentColor 呈现专属图标。
 */

export const NAV_ICON_MARKER = 'data-aag-nav-icon'
export const NAV_ROW_SELECTOR = '[role="dialog"] nav button'
export const NAV_ICON_SIZE = 16

/** 专属专家团/代理图标（对齐 Codex UI / Host 的 IconUserOutline16 风格） */
export function agencyMaskSvg(): string {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="#000" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">'
    + '<circle cx="8" cy="5" r="3.2"/>'
    + '<path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>'
    + '</svg>'
}

export function agencyMaskUrl(svg: string = agencyMaskSvg()): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function isOwnNavRow(rowText: string | null | undefined, wantedLabel: string | null | undefined): boolean {
  const wanted = String(wantedLabel ?? '').trim()
  if (wanted.length === 0) return false
  return String(rowText ?? '').trim() === wanted
}

export function navIconCss(maskUrl: string): string {
  return [
    `[${NAV_ICON_MARKER}] > svg { display: none !important; }`,
    `[${NAV_ICON_MARKER}]::before {`,
    '  content: "";',
    '  flex: none;',
    `  width: ${NAV_ICON_SIZE}px;`,
    `  height: ${NAV_ICON_SIZE}px;`,
    '  background-color: currentColor;',
    `  -webkit-mask-image: url("${maskUrl}");`,
    `  mask-image: url("${maskUrl}");`,
    '  -webkit-mask-repeat: no-repeat;',
    '  mask-repeat: no-repeat;',
    '  -webkit-mask-position: center;',
    '  mask-position: center;',
    `  -webkit-mask-size: ${NAV_ICON_SIZE}px ${NAV_ICON_SIZE}px;`,
    `  mask-size: ${NAV_ICON_SIZE}px ${NAV_ICON_SIZE}px;`,
    '}',
  ].join('\n')
}

export interface NavIconContext {
  effect(callback: () => unknown, label?: string): void
}

export function installSettingsNavIcon(ctx: NavIconContext, resolveLabel: () => string): void {
  if (typeof document === 'undefined') return

  ctx.effect(() => {
    const tag = document.createElement('style')
    tag.dataset.plugin = '@michengai/dsh-agency-agents'
    tag.dataset.pluginCss = 'dsh-agency-agents/settings-nav-icon'
    tag.textContent = navIconCss(agencyMaskUrl())
    document.head.appendChild(tag)

    let disposed = false
    let timer: number | null = null

    const tagNavButtons = (): void => {
      if (disposed) return
      const buttons = document.querySelectorAll(NAV_ROW_SELECTOR)
      const label = resolveLabel()
      buttons.forEach((btn) => {
        const text = btn.textContent ?? ''
        if (isOwnNavRow(text, label)) {
          btn.setAttribute(NAV_ICON_MARKER, 'true')
        } else if (btn.hasAttribute(NAV_ICON_MARKER)) {
          btn.removeAttribute(NAV_ICON_MARKER)
        }
      })
    }

    const observer = new MutationObserver(() => {
      tagNavButtons()
    })

    observer.observe(document.body, { childList: true, subtree: true })
    tagNavButtons()

    return () => {
      disposed = true
      observer.disconnect()
      if (timer !== null) window.clearTimeout(timer)
      tag.remove()
      document.querySelectorAll(`[${NAV_ICON_MARKER}]`).forEach((el) => {
        el.removeAttribute(NAV_ICON_MARKER)
      })
    }
  }, 'agency-agents: settings nav icon')
}
