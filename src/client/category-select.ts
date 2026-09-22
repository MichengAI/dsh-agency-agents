import { Select } from './antd-ui.js'
import React from 'react'

/** 设置筛选和专家编辑共用的分类选择。 */
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
  return React.createElement(Select, {
    id: props.id,
    className: 'aag-select',
    'aria-label': props.label,
    disabled: props.disabled,
    value: props.value,
    options: props.options.map((option) => ({ value: option.value, label: option.label })),
    popupMatchSelectWidth: false,
    listHeight: 320,
    onChange: (value: unknown) => props.onChange(String(value)),
  })
}
