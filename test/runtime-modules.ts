import React from 'react'

export function createRoot(): { render(node: React.ReactNode): void } {
  return { render: () => {} }
}

function icon(): React.ReactElement {
  return React.createElement('svg', { 'aria-hidden': true })
}

export const IconRefreshOutline16 = icon
export const IconDownloadOutline16 = icon
export const IconCopyOutline16 = icon
export const IconCloseOutline16 = icon

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode; variant?: string; size?: string; children?: React.ReactNode }): React.ReactElement {
  const { icon: _icon, variant: _variant, size: _size, children, ...rest } = props
  return React.createElement('button', {
    type: 'button',
    ...rest,
    style: { borderRadius: '14px', background: props.variant === 'primary' ? 'var(--dsw-alias-button-primary-fill, rgb(112, 85, 204))' : 'transparent', ...(rest.style ?? {}) },
  }, children)
}

export function Switch(props: { checked: boolean; onChange: (next: boolean) => void; label: string; disabled?: boolean; title?: string }): React.ReactElement {
  return React.createElement('button', {
    type: 'button', role: 'switch', 'aria-checked': props.checked, 'aria-label': props.label, title: props.title, disabled: props.disabled,
    style: { width: '36px', height: '20px', border: 0, borderRadius: '10px', background: props.checked ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-border-l3)' },
    onClick: () => props.onChange(!props.checked),
  })
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }): React.ReactElement {
  const { icon: _icon, ...rest } = props
  return React.createElement('input', rest)
}

export function Menu(props: {
  open: boolean
  anchor: React.ReactNode
  items?: readonly { id: string; label: React.ReactNode; disabled?: boolean }[]
  onSelect?: (id: string) => void
}): React.ReactElement {
  return React.createElement('div', null,
    props.anchor,
    props.open ? React.createElement('div', { role: 'menu', style: { borderRadius: '16px', background: 'var(--dsw-specific-menu)', backdropFilter: 'var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%))' } }, props.items?.map((item) => React.createElement('button', {
      key: item.id, type: 'button', role: 'menuitem', disabled: item.disabled, onClick: () => props.onSelect?.(item.id),
    }, item.label))) : null)
}

export function Modal(props: { open: boolean; title: string; onClose: () => void; children?: React.ReactNode; footer?: React.ReactNode }): React.ReactElement | null {
  if (!props.open) return null
  return React.createElement('div', { role: 'dialog', 'aria-label': props.title }, props.children, props.footer)
}

export function SegmentedTabs<Value extends string>(props: {
  label: string
  value: Value
  className?: string
  items: readonly { value: Value; label: React.ReactNode; id: string; panelId: string }[]
  onChange: (next: Value) => void
}): React.ReactElement {
  return React.createElement('div', { role: 'tablist', 'aria-label': props.label, className: props.className }, props.items.map((item) => React.createElement('button', {
    key: item.value, type: 'button', role: 'tab', id: item.id, 'aria-controls': item.panelId, 'aria-selected': item.value === props.value,
    style: { height: '34px', border: 0, borderRadius: '8px', background: 'transparent' },
    onClick: () => props.onChange(item.value),
  }, item.label)))
}

export function SegmentedControl<Value extends string>(props: {
  label: string
  value: Value
  options: readonly { value: Value; label: string }[]
  onChange: (next: Value) => void
}): React.ReactElement {
  return React.createElement('div', { role: 'tablist', 'aria-label': props.label }, props.options.map((option) => React.createElement('button', {
    key: option.value, type: 'button', role: 'tab', 'aria-selected': option.value === props.value, onClick: () => props.onChange(option.value),
  }, option.label)))
}
