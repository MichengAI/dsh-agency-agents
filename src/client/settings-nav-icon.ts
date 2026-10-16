/**
 * 专家管理器在 DSH 设置侧边导航栏中的专属图标。
 * 
 * 机制 100% 对齐 dsh-skills-manager 与 dsh-codex-ui:
 * 1. 采用与 codex-ui 完全相同的用户/专家专属矢量路径 (EXPERT_PATHS) (IconUserOutline16);
 * 2. 采用 DOM SVG 内容直替机制 (svg.innerHTML = EXPERT_PATHS, viewBox 0 0 16 16);
 * 3. 继承宿主原生 SVG 的精确对齐、尺寸 (16x16)、currentColor 色彩继承与悬停/高亮动画;
 * 4. 独立自包含，无论宿主是否安装 codex-ui，专家设置项均能呈现与 codex-ui 100% 统一的图标。
 */

export const NAV_ICON_MARKER = 'data-aag-nav-icon'
export const NAV_ROW_SELECTOR = '[role="dialog"] nav button'

/** 100% 对齐 dsh-codex-ui 官方的专家/用户专属矢量路径（viewBox: 0 0 16 16） */
export const EXPERT_PATHS = '<circle cx="8" cy="4.8" r="3.2" stroke="currentColor" stroke-width="1.3" fill="none"/>'
  + '<path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>'

export function isOwnNavRow(rowText: string | null | undefined, wantedLabel: string | null | undefined): boolean {
  const wanted = String(wantedLabel ?? '').trim()
  if (wanted.length === 0) return false
  const current = String(rowText ?? '').trim()
  return current === wanted || current === '专家' || current === 'Experts' || current === '智能体'
}

export function applySettingsNavIcon(button: Element, wantedLabel: () => string): boolean {
  if (!isOwnNavRow(button.textContent, wantedLabel())) return false
  const svg = button.querySelector('svg')
  if (!svg) return false
  if (svg.getAttribute('data-aag-nav-icon') === 'expert') return false

  svg.setAttribute('data-aag-nav-icon', 'expert')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('fill', 'none')
  svg.innerHTML = EXPERT_PATHS
  button.setAttribute(NAV_ICON_MARKER, '')
  return true
}

export interface NavIconContext {
  effect(callback: () => unknown, label?: string): void
}

export function installSettingsNavIcon(ctx: NavIconContext): void {
  if (typeof document === 'undefined') return

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
        row.removeAttribute(NAV_ICON_MARKER)
      }
    }
  }, 'agency-agents: settings nav icon')
}
