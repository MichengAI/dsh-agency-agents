import React from 'react'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'

interface SegmentedTab<Value extends string> {
  value: Value
  label: React.ReactNode
  id: string
  panelId: string
}

interface SegmentedTabsProps<Value extends string> {
  items: readonly SegmentedTab<Value>[]
  value: Value
  onChange: (value: Value) => void
  label: string
  className?: string
}

interface SegmentedOption<Value extends string> {
  value: Value
  label: string
  disabled?: boolean
  title?: string
}

interface SegmentedControlProps<Value extends string> {
  id: string
  value: Value
  options: readonly SegmentedOption<Value>[]
  onChange: (next: Value) => void
  label: string
  disabled?: boolean
  className?: string
}

type SegmentedTabsComponent = <Value extends string>(props: SegmentedTabsProps<Value>) => React.ReactElement
type SegmentedControlComponent = <Value extends string>(props: SegmentedControlProps<Value>) => React.ReactElement

function nextTabIndex(key: string, index: number, length: number): number | undefined {
  if (key === 'ArrowLeft') return (index + length - 1) % length
  if (key === 'ArrowRight') return (index + 1) % length
  if (key === 'Home') return 0
  if (key === 'End') return length - 1
  return undefined
}

/** 对齐 0.1.7 SegmentedTabs：等宽轨道、滑动选中块、方向键切换。 */
export function FallbackSegmentedTabs<Value extends string>(props: SegmentedTabsProps<Value>): React.ReactElement {
  const selected = Math.max(0, props.items.findIndex((item) => item.value === props.value))
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = nextTabIndex(event.key, index, props.items.length)
    if (next === undefined) return
    event.preventDefault()
    event.stopPropagation()
    const tablist = event.currentTarget.parentElement
    const nextItem = props.items[next]
    if (tablist === null || nextItem === undefined) return
    tablist.querySelectorAll<HTMLElement>('[role="tab"]').item(next)?.focus()
    props.onChange(nextItem.value)
  }
  return React.createElement('div', {
    role: 'tablist',
    'aria-label': props.label,
    className: ['aag-segmented-tabs', props.className].filter(Boolean).join(' '),
    style: { gridTemplateColumns: `repeat(${props.items.length}, minmax(0, 1fr))` },
  },
  React.createElement('span', {
    className: 'aag-segmented-tabs-indicator',
    'aria-hidden': true,
    style: {
      width: `calc((100% - 8px) / ${props.items.length})`,
      transform: `translateX(${selected * 100}%)`,
    },
  }),
  props.items.map((item, index) => React.createElement('button', {
    key: item.value,
    type: 'button',
    role: 'tab',
    id: item.id,
    'aria-controls': item.panelId,
    'aria-selected': item.value === props.value,
    tabIndex: item.value === props.value ? 0 : -1,
    onClick: () => props.onChange(item.value),
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => onKeyDown(event, index),
  }, item.label)))
}

function walkOption<Value extends string>(options: readonly SegmentedOption<Value>[], from: number, key: string): SegmentedOption<Value> | undefined {
  const enabled = options.filter((option) => option.disabled !== true)
  if (key === 'Home') return enabled[0]
  if (key === 'End') return enabled[enabled.length - 1]
  const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1
  const count = options.length
  for (let offset = 1; offset < count; offset += 1) {
    const candidate = options[((from + step * offset) % count + count) % count]
    if (candidate !== undefined && candidate.disabled !== true) return candidate
  }
  return undefined
}

/** 对齐 0.1.7 SegmentedControl：悬停底、抬起的选中块、跳过禁用项。 */
export function FallbackSegmentedControl<Value extends string>(props: SegmentedControlProps<Value>): React.ReactElement {
  const list = React.useRef<HTMLDivElement>(null)
  const selected = props.options.findIndex((option) => option.value === props.value)
  React.useEffect(() => {
    const root = list.current
    if (root === null || !root.contains(document.activeElement)) return
    root.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus()
  }, [props.value])
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const target = walkOption(props.options, selected, event.key)
    if (target !== undefined && target.value !== props.value) props.onChange(target.value)
  }
  return React.createElement('div', {
    ref: list,
    role: 'tablist',
    'aria-label': props.label,
    className: ['aag-segmented-control', props.className].filter(Boolean).join(' '),
    style: {
      '--dsh-segment-count': String(props.options.length),
      '--dsh-segment-index': String(selected),
    } as React.CSSProperties,
  },
  React.createElement('span', { 'aria-hidden': true, className: 'aag-segmented-control-indicator' }),
  props.options.map((option) => {
    const active = option.value === props.value
    return React.createElement('button', {
      key: option.value,
      id: `${props.id}-${option.value}`,
      type: 'button',
      role: 'tab',
      'aria-selected': active,
      'aria-controls': `${props.id}-${option.value}-panel`,
      tabIndex: active ? 0 : -1,
      disabled: props.disabled || option.disabled === true,
      title: option.title,
      onClick: () => { if (!active) props.onChange(option.value) },
      onKeyDown,
    }, option.label)
  }))
}

export function resolveSegmentedTabs(source: { SegmentedTabs?: SegmentedTabsComponent }): SegmentedTabsComponent {
  return source.SegmentedTabs ?? FallbackSegmentedTabs
}

export function resolveSegmentedControl(source: { SegmentedControl?: SegmentedControlComponent }): SegmentedControlComponent {
  return source.SegmentedControl ?? FallbackSegmentedControl
}

export const SegmentedTabs = resolveSegmentedTabs(primitives as unknown as { SegmentedTabs?: SegmentedTabsComponent })
export const SegmentedControl = resolveSegmentedControl(primitives as unknown as { SegmentedControl?: SegmentedControlComponent })
