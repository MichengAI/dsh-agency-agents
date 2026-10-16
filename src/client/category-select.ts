import React from 'react'

/** 设置筛选和专家编辑共用的分类选择选项。 */
export interface CategoryOption {
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
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = props.options.find((opt) => opt.value === props.value) ?? props.options[0]
  const currentText = selectedOption ? selectedOption.label : (props.label || '')

  React.useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDocClick, true)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('click', onDocClick, true)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open])

  return React.createElement('div', {
    ref: containerRef,
    className: 'aag-native-select-wrap ant-select',
    style: { position: 'relative', display: 'inline-block' },
  },
    React.createElement('button', {
      id: props.id,
      type: 'button',
      role: 'combobox',
      className: `aag-native-select-trigger ant-select-selector${open ? ' is-open' : ''}`,
      'aria-label': props.label,
      'aria-haspopup': 'listbox',
      'aria-expanded': open,
      disabled: props.disabled,
      onClick: () => {
        if (!props.disabled) setOpen((prev) => !prev)
      },
    },
      React.createElement('span', { className: 'aag-native-select-label' }, currentText),
      React.createElement('svg', {
        className: 'aag-native-select-arrow',
        viewBox: '0 0 16 16',
        width: 12,
        height: 12,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        style: { transition: 'transform 150ms ease', transform: open ? 'rotate(180deg)' : 'none' },
      }, React.createElement('path', { d: 'm4 6 4 4 4-4' }))
    ),
    open ? React.createElement('div', {
      className: 'aag-native-select-dropdown',
      role: 'listbox',
      'aria-label': props.label,
    },
      props.options.map((opt) => {
        const isSelected = opt.value === props.value
        return React.createElement('div', {
          key: opt.value,
          role: 'option',
          'aria-selected': isSelected,
          className: `aag-native-select-item${isSelected ? ' is-selected' : ''}`,
          onClick: () => {
            props.onChange(opt.value)
            setOpen(false)
          },
        },
          React.createElement('span', { className: 'aag-native-select-item-text' }, opt.label),
          isSelected ? React.createElement('svg', {
            className: 'aag-native-select-item-check',
            viewBox: '0 0 16 16',
            width: 14,
            height: 14,
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }, React.createElement('path', { d: 'm3.5 8.5 3 3 6-6' })) : null
        )
      })
    ) : null
  )
}
