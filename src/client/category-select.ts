import React from 'react'
import { Menu } from '@deepseek-ai/dsh-client-ui-primitives'

/** 设置筛选和专家编辑共用的主题分类选择器。 */
interface CategoryOption {
  readonly value: string
  readonly label: string
}

const optionId = (value: string): string => value === '' ? '__all' : value

export function CategorySelect(props: {
  readonly id: string
  readonly value: string
  readonly disabled?: boolean
  readonly label?: string
  readonly options: ReadonlyArray<CategoryOption>
  readonly onChange: (value: string) => void
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const selected = props.options.find((option) => option.value === props.value) ?? props.options[0]
  return React.createElement(Menu, {
    open,
    onClose: () => setOpen(false),
    selectedId: optionId(props.value),
    onSelect: (id: string) => {
      props.onChange(id === '__all' ? '' : id)
      setOpen(false)
    },
    items: props.options.map((option) => ({
      id: optionId(option.value),
      label: option.label,
      disabled: props.disabled,
    })),
    anchor: React.createElement('button', {
      id: props.id,
      disabled: props.disabled,
      'aria-label': props.label,
      type: 'button',
      className: 'aag-select-trigger',
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      onClick: () => setOpen((current) => !current),
    },
      React.createElement('span', { className: 'aag-select-value' }, selected === undefined ? '' : selected.label),
      React.createElement('svg', { className: 'aag-select-caret', viewBox: '0 0 12 12', 'aria-hidden': true, focusable: false },
        React.createElement('path', { d: 'M2.5 4.5L6 8l3.5-3.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }))),
  })
}
