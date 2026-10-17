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

export function Modal({ open = true, onClose, title, closeLabel, children, footer, className }: any) {
  if (!open) return null
  const titleText = typeof title === 'string' ? title : undefined
  return React.createElement('div', {
    className: 'dsh-primitives-modal-backdrop',
    onClick: (e: any) => { if (e.target === e.currentTarget) onClose?.() },
  },
    React.createElement('div', {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': titleText,
      className: ['dsh-primitives-modal', className].filter(Boolean).join(' '),
      onClick: (e: any) => e.stopPropagation(),
    },
      React.createElement('button', { type: 'button', 'aria-label': closeLabel, className: 'dsh-modal-close', onClick: onClose }, '✕'),
      React.createElement('div', { className: 'dsh-modal-body' }, children),
      footer ? React.createElement('div', { className: 'dsh-modal-footer' }, footer) : null,
    ),
  )
}
