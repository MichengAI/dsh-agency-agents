/** 设置页「通过对话创建」交给会话输入框的待填草稿。对齐 dsh-automation 实现。 */

let pending: string | null = null
const listeners = new Set<(text: string | null) => void>()

export function setChatPrefill(text: string): void {
  pending = text
  for (const listener of [...listeners]) listener(pending)
}

export function takeChatPrefill(): string | null {
  const value = pending
  pending = null
  return value
}

export function peekChatPrefill(): string | null {
  return pending
}

export function subscribeChatPrefill(listener: (text: string | null) => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function applyPrefillToDom(text: string): boolean {
  if (typeof document === 'undefined') return false
  const seat =
    document.querySelector('[data-composer-seat] textarea') ??
    document.querySelector('[data-composer-card] textarea') ??
    document.querySelector('.dsh-composer textarea') ??
    document.querySelector('textarea')

  if (!(seat instanceof HTMLTextAreaElement)) return false

  const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
  descriptor?.set?.call(seat, text)
  seat.dispatchEvent(new InputEvent('input', { bubbles: true }))
  seat.focus()
  return true
}

export function triggerChatCreation(text: string, closeSettings?: () => void): void {
  setChatPrefill(text)

  if (typeof closeSettings === 'function') {
    try {
      closeSettings()
    } catch {}
  } else if (typeof document !== 'undefined') {
    const closeBtn = document.querySelector<HTMLElement>(
      '[role="dialog"] button[aria-label*="关闭"], [role="dialog"] button[aria-label*="Close"]'
    )
    closeBtn?.click()
  }

  if (typeof setTimeout !== 'undefined') {
    setTimeout(() => {
      applyPrefillToDom(text)
    }, 50)
  }
}
