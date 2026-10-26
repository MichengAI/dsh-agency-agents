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

  // 1. 优先检测 DSH Lexical contenteditable 输入区
  const editable =
    document.querySelector<HTMLElement>('[data-composer-seat] [contenteditable="true"]') ??
    document.querySelector<HTMLElement>('[data-composer-card] [contenteditable="true"]') ??
    document.querySelector<HTMLElement>('.dsh-composer [contenteditable="true"]') ??
    document.querySelector<HTMLElement>('[contenteditable="true"]:not([aria-label*="提示词"]):not(.agt-prompt)')

  if (editable) {
    editable.focus()
    try {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(editable)
      selection?.removeAllRanges()
      selection?.addRange(range)
      document.execCommand('insertText', false, text)
    } catch {
      editable.textContent = text
      editable.dispatchEvent(new InputEvent('input', { bubbles: true }))
    }
    return true
  }

  // 2. 检测原生 textarea 输入区
  const seat =
    document.querySelector('[data-composer-seat] textarea') ??
    document.querySelector('[data-composer-card] textarea') ??
    document.querySelector('.dsh-composer textarea') ??
    document.querySelector('[data-chat-input] textarea') ??
    document.querySelector('textarea:not(.aag-textarea):not(.agt-prompt)') ??
    document.querySelector('textarea')

  if (seat instanceof HTMLTextAreaElement) {
    seat.focus()
    const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
    descriptor?.set?.call(seat, text)
    seat.dispatchEvent(new InputEvent('input', { bubbles: true }))
    seat.dispatchEvent(new Event('change', { bubbles: true }))
    try {
      seat.selectionStart = seat.selectionEnd = text.length
    } catch {}
    return true
  }

  return false
}

export function triggerChatCreation(text: string, closeSettings?: () => void): void {
  setChatPrefill(text)

  // 1. 如果传入了关闭回调（例如关闭设置页或 layout.selectPanel(null)），直接执行
  if (typeof closeSettings === 'function') {
    try {
      closeSettings()
    } catch {}
  }

  if (typeof document !== 'undefined') {
    // 2. 查找 Codex UI 设置页返回按钮 (button.dcu-settings-back)
    const codexBackBtn = document.querySelector<HTMLElement>(
      'button.dcu-settings-back, [data-dcu-settings-page] .dcu-settings-back'
    )
    if (codexBackBtn) {
      try {
        codexBackBtn.click()
      } catch {}
    }

    // 3. 查找常规对话框关闭按钮
    const closeBtn = document.querySelector<HTMLElement>(
      '[role="dialog"] button[aria-label*="关闭"], [role="dialog"] button[aria-label*="Close"], [role="dialog"] .ant-modal-close'
    )
    if (closeBtn) {
      try {
        closeBtn.click()
      } catch {}
    }

    // 4. 派发 Escape 键盘事件，让可能阻挡的弹窗或设置页关闭
    try {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          bubbles: true,
          cancelable: true,
        })
      )
    } catch {}

    // 5. 点击侧栏会话以激活主聊天视图
    const sessionItem = document.querySelector<HTMLElement>(
      '[data-session-id], .dsh-session-item, [role="tab"][aria-label*="会话"], [role="tab"][aria-label*="Chat"]'
    )
    if (sessionItem) {
      try {
        sessionItem.click()
      } catch {}
    }
  }

  // 6. 梯次重试填入并聚焦输入框（30ms, 120ms, 300ms, 600ms）
  if (typeof setTimeout !== 'undefined') {
    setTimeout(() => {
      applyPrefillToDom(text)
    }, 30)
    setTimeout(() => {
      applyPrefillToDom(text)
    }, 120)
    setTimeout(() => {
      applyPrefillToDom(text)
    }, 300)
    setTimeout(() => {
      applyPrefillToDom(text)
    }, 600)
  }
}
