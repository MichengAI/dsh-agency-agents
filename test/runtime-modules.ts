import React from 'react'

/** 浏览器测试把 react-dom/client 指到这里，避免打进宿主的 createRoot。 */
export function createRoot(): { render(node: React.ReactNode): void } {
  return { render: () => {} }
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
