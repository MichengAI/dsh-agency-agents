import React from 'react'

/** 浏览器测试把 react-dom/client 指到这里，避免打进宿主的 createRoot。 */
export function createRoot(): { render(node: React.ReactNode): void } {
  return { render: () => {} }
}

export function Button(props: any) {
  return React.createElement('button', { ...props, type: props.type || 'button' }, props.children)
}

export function Menu(props: any) {
  return React.createElement('div', { className: 'dsh-primitives-menu' },
    props.anchor,
    props.open ? React.createElement('div', { role: 'listbox' },
      props.items?.map((item: any) =>
        React.createElement('div', {
          key: item.id,
          role: 'option',
          'aria-selected': props.selectedId === item.id,
          onClick: () => props.onSelect?.(item.id),
        }, item.label)
      )
    ) : null
  )
}
