import React from 'react'

/** 浏览器测试把 react-dom/client 指到这里，避免打进宿主的 createRoot。 */
export function createRoot(): { render(node: React.ReactNode): void } {
  return { render: () => {} }
}

export function SegmentedTabs({ items, value, onChange, label, className }: any) {
  return React.createElement('div', { role: 'tablist', 'aria-label': label, className },
    items?.map((item: any) => React.createElement('button', {
      key: item.value,
      type: 'button',
      role: 'tab',
      id: item.id,
      'aria-selected': item.value === value,
      'aria-controls': item.panelId,
      onClick: () => onChange?.(item.value),
    }, item.label)),
  )
}

export function SegmentedControl({ id, value, options, onChange, label, disabled, className }: any) {
  return React.createElement('div', { role: 'tablist', 'aria-label': label, id, className },
    options?.map((option: any) => React.createElement('button', {
      key: option.value,
      type: 'button',
      role: 'tab',
      'aria-selected': option.value === value,
      disabled: disabled || option.disabled,
      onClick: () => { if (option.value !== value) onChange?.(option.value) },
    }, option.label)),
  )
}
export function Button(props: any) {
  const variantClass = props.variant ? `dsh-button-${props.variant}` : ''
  const classes = [props.className, variantClass].filter(Boolean).join(' ')
  return React.createElement('button', { ...props, className: classes || undefined, type: props.type || 'button' }, props.children)
}

export function Menu(props: any) {
  return React.createElement('div', { className: 'dsh-primitives-menu' },
    props.anchor,
    props.open ? React.createElement('div', { role: 'menu' },
      props.items?.map((item: any) =>
        React.createElement('button', {
          key: item.id,
          type: 'button',
          role: 'menuitem',
          'aria-checked': props.selectedId === item.id,
          onClick: () => props.onSelect?.(item.id),
        }, item.label)
      )
    ) : null
  )
}

export function Input({ icon, className, ...props }: any) {
  const classes = ['dsh-primitives-input-wrap', className].filter(Boolean).join(' ')
  return React.createElement('div', { className: classes },
    icon ? React.createElement('span', { className: 'dsh-input-icon' }, icon) : null,
    React.createElement('input', { ...props, className: 'dsh-input-element' })
  )
}

export function Switch({ checked, onChange, disabled, label, className }: any) {
  const classes = ['dsh-primitives-switch', className, checked ? 'is-checked' : ''].filter(Boolean).join(' ')
  return React.createElement('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': !!checked,
    'aria-label': label,
    disabled,
    className: classes,
    onClick: () => { if (!disabled) onChange?.(!checked) },
  }, React.createElement('span', { className: 'dsh-switch-thumb' }))
}

interface StubModalProps {
  open?: boolean
  onClose?: () => void
  title: React.ReactNode
  closeLabel?: string
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  contentClassName?: string
}

export function Modal({ open = true, onClose, title, closeLabel, description, children, footer, className, contentClassName }: StubModalProps) {
  if (!open) return null
  const titleText = typeof title === 'string' ? title : undefined
  return React.createElement('div', {
    className: 'dsh-primitives-modal-backdrop',
    // 对齐宿主 Modal.module.css：根层铺满视口并居中，卡片默认 min(380px,100%)；宽度只靠调用方类名覆盖。
    style: { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(24px, var(--dsh-frame-overlay-top, 24px)) 24px', background: 'rgba(0,0,0,0.45)' },
    onClick: (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose?.() },
  },
    React.createElement('div', {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': titleText,
      className: ['dsh-primitives-modal', className].filter(Boolean).join(' '),
      style: { position: 'relative', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, width: 'min(380px, 100%)', maxHeight: '100%', padding: '0 0 24px', overflow: 'hidden', background: 'var(--dsw-alias-bg-layer-2, #2b2b2d)', borderRadius: 'var(--dsw-radius-panel, 16px)' },
      onClick: (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation(),
    },
      // 宿主结构：dialog > content(header/description/body) + footer，footer 不参与 body 滚动。
      React.createElement('div', {
        className: ['dsh-modal-content', contentClassName].filter(Boolean).join(' '),
        style: { display: 'flex', flexDirection: 'column', width: '100%' },
      },
        React.createElement('div', {
          className: 'dsh-modal-header',
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '22px 14px 12px 24px' },
        },
          React.createElement('h2', { style: { margin: 0, fontSize: 16, lineHeight: '24px', fontWeight: 500 } }, title),
          React.createElement('button', { type: 'button', 'aria-label': closeLabel, className: 'dsh-modal-close', onClick: onClose }, '✕'),
        ),
        description ? React.createElement('p', { className: 'dsh-modal-description' }, description) : null,
        children != null ? React.createElement('div', {
          className: 'dsh-modal-body',
          style: { display: 'flex', flexDirection: 'column', minWidth: 0, marginTop: 20, padding: '0 24px' },
        }, children) : null,
      ),
      footer ? React.createElement('div', {
        className: 'dsh-modal-footer',
        style: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '0 24px' },
      }, footer) : null,
    ),
  )
}
