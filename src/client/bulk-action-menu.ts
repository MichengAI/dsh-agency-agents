import React from 'react'
import { Menu, Button, type MenuEntry } from '@deepseek-ai/dsh-client-ui-primitives'

export interface BulkActionMenuItem {
  readonly id: string
  readonly label: string
  readonly disabled?: boolean
  readonly danger?: boolean
  readonly separator?: boolean
}

export function BulkActionMenu(props: {
  readonly label: string
  readonly disabled?: boolean
  readonly items: ReadonlyArray<BulkActionMenuItem>
  readonly onSelect: (id: string) => void
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)

  const entries = React.useMemo<readonly MenuEntry[]>(() => {
    return props.items.map((item) => {
      if (item.separator) {
        return { type: 'separator', id: item.id }
      }
      return {
        id: item.id,
        label: item.label,
        disabled: item.disabled,
        danger: item.danger,
      }
    })
  }, [props.items])

  return React.createElement('div', { className: 'aag-select-wrap aag-bulk-menu-wrap', style: { display: 'inline-block' } },
    React.createElement(Menu, {
      open,
      onClose: () => setOpen(false),
      onSelect: (id: string) => {
        setOpen(false)
        props.onSelect(id)
      },
      align: 'end',
      portal: true,
      dense: true,
      anchor: React.createElement(Button, {
        variant: 'outline',
        size: 'sm',
        'aria-label': props.label,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        disabled: props.disabled,
        className: 'aag-menu-select-trigger aag-bulk-trigger',
        onClick: () => {
          if (!props.disabled) setOpen((prev) => !prev)
        },
      },
      React.createElement('span', { className: 'aag-select-label' }, props.label),
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
        style: { flex: 'none', marginLeft: 4, transition: 'transform 150ms ease', transform: open ? 'rotate(180deg)' : 'none' },
      }, React.createElement('path', { d: 'm4 6 4 4 4-4' }))),
      items: entries,
    })
  )
}
