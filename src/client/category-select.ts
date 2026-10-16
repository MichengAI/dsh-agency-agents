import React from 'react'
import { Menu, Button, type MenuEntry } from '@deepseek-ai/dsh-client-ui-primitives'

/** 设置筛选和专家编辑共用的分类选择选项。 */
export interface CategoryOption {
  readonly value: string
  readonly label: string
}

/**
 * 宿主官方原语 Menu 规范封装的分类选择器。
 * 1. 触发器：采用官方 Button variant="outline" size="sm"，右侧带向下小箭头；
 * 2. 浮层菜单：直接调用宿主原生 <Menu> 组件（portal 浮层、半透明毛玻璃、发丝线、对勾多选/单选）；
 * 3. 彻底告别 Ant Design Select 及其虚拟列表和多余自绘逻辑。
 */
export function CategorySelect(props: {
  readonly id: string
  readonly value: string
  readonly disabled?: boolean
  readonly label?: string
  readonly options: ReadonlyArray<CategoryOption>
  readonly onChange: (value: string) => void
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)

  const selectedOption = props.options.find((opt) => opt.value === props.value)
  const currentText = selectedOption ? selectedOption.label : (props.label || props.value || '')

  const items = React.useMemo<readonly MenuEntry[]>(() => {
    return props.options.map((opt) => ({
      id: opt.value,
      label: opt.label,
    }))
  }, [props.options])

  return React.createElement('div', { className: 'aag-select-wrap', style: { display: 'inline-block' } },
    React.createElement(Menu, {
      open,
      onClose: () => setOpen(false),
      onSelect: (id: string) => {
        props.onChange(id)
        setOpen(false)
      },
      selectedId: props.value,
      align: 'start',
      portal: true,
      anchor: React.createElement(Button, {
        id: props.id,
        variant: 'outline',
        size: 'sm',
        'aria-label': props.label,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        disabled: props.disabled,
        className: `aag-menu-select-trigger${open ? ' is-open' : ''}`,
        onClick: () => {
          if (!props.disabled) setOpen((prev) => !prev)
        },
        icon: React.createElement('svg', {
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
        }, React.createElement('path', { d: 'm4 6 4 4 4-4' })),
      }, currentText),
      items,
    })
  )
}
