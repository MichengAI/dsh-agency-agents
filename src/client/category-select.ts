import React from 'react'

/** 设置筛选和专家编辑共用的主题分类选择器。 */
interface CategoryOption {
  readonly value: string
  readonly label: string
}

export function CategorySelect(props: {
  readonly id: string
  readonly value: string
  readonly disabled?: boolean
  readonly label?: string
  readonly options: ReadonlyArray<CategoryOption>
  readonly onChange: (value: string) => void
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const selectedIndex = Math.max(0, props.options.findIndex((option) => option.value === props.value))
  const [active, setActive] = React.useState(selectedIndex)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const wasOpen = React.useRef(false)
  const selected = props.options[selectedIndex]

  React.useEffect(() => {
    if (!open) return
    setActive(selectedIndex)
    const onPointerDown = (ev: PointerEvent): void => {
      const target = ev.target
      if (target instanceof Node && rootRef.current?.contains(target) === true) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, selectedIndex])

  React.useEffect(() => {
    if (open) {
      listRef.current?.focus()
      wasOpen.current = true
      return
    }
    if (wasOpen.current) {
      triggerRef.current?.focus()
      wasOpen.current = false
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    document.getElementById(props.id + '-opt-' + String(active))?.scrollIntoView({ block: 'nearest' })
  }, [active, open, props.id])

  const choose = (value: string): void => {
    props.onChange(value)
    setOpen(false)
  }

  const move = (next: number): void => {
    if (props.options.length === 0) return
    setActive(Math.min(props.options.length - 1, Math.max(0, next)))
  }

  const onTriggerKeyDown = (ev: React.KeyboardEvent): void => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      setOpen(true)
    }
  }

  const onListKeyDown = (ev: React.KeyboardEvent): void => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); move(active + 1); return }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); move(active - 1); return }
    if (ev.key === 'Home') { ev.preventDefault(); move(0); return }
    if (ev.key === 'End') { ev.preventDefault(); move(props.options.length - 1); return }
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      const option = props.options[active]
      if (option !== undefined) choose(option.value)
      return
    }
    if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); setOpen(false); return }
    if (ev.key === 'Tab') setOpen(false)
  }

  return React.createElement('div', { className: 'aag-select', ref: rootRef },
    React.createElement('button', {
      id: props.id,
      disabled: props.disabled,
      'aria-label': props.label,
      ref: triggerRef,
      type: 'button',
      className: 'aag-select-trigger',
      'aria-haspopup': 'listbox',
      'aria-expanded': open,
      'aria-controls': props.id + '-list',
      onClick: () => setOpen((current) => !current),
      onKeyDown: onTriggerKeyDown,
    },
      React.createElement('span', { className: 'aag-select-value' }, selected === undefined ? '' : selected.label),
      React.createElement('svg', { className: 'aag-select-caret', viewBox: '0 0 12 12', 'aria-hidden': true, focusable: false },
        React.createElement('path', { d: 'M2.5 4.5L6 8l3.5-3.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }))),
    open
      ? React.createElement('div', {
        id: props.id + '-list',
        ref: listRef,
        className: 'aag-select-menu',
        role: 'listbox',
        'aria-labelledby': props.id,
        tabIndex: 0,
        'aria-activedescendant': props.id + '-opt-' + String(active),
        onKeyDown: onListKeyDown,
      }, props.options.map((option, index) => React.createElement('button', {
        key: option.value === '' ? 'all' : option.value,
        id: props.id + '-opt-' + String(index),
        type: 'button',
        role: 'option',
        tabIndex: -1,
        className: 'aag-select-option',
        'aria-selected': option.value === props.value,
        'data-active': index === active,
        onMouseEnter: () => setActive(index),
        onClick: () => choose(option.value),
      }, option.label)))
      : null)
}
