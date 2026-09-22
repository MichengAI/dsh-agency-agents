import React from 'react'

interface EscapeLayer {
  readonly close: () => void
}

const layers: EscapeLayer[] = []
let listening = false

function onKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing || layers.length === 0) return
  event.preventDefault()
  event.stopPropagation()
  layers[layers.length - 1]?.close()
}

function listen(): void {
  if (listening) return
  window.addEventListener('keydown', onKeyDown, true)
  listening = true
}

function unlisten(): void {
  if (!listening || layers.length > 0) return
  window.removeEventListener('keydown', onKeyDown, true)
  listening = false
}

/** 只关闭最后打开的一层，并拦住 Esc，避免宿主设置页一起关掉。 */
export function useEscapeLayer(active: boolean, close: () => void): void {
  const closeRef = React.useRef(close)
  closeRef.current = close
  React.useEffect(() => {
    if (!active) return
    const layer: EscapeLayer = { close: () => closeRef.current() }
    layers.push(layer)
    listen()
    return () => {
      const index = layers.indexOf(layer)
      if (index >= 0) layers.splice(index, 1)
      unlisten()
    }
  }, [active])
}
