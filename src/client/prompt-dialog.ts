import { AntdProvider, Button, Input, Modal } from './antd-ui.js'
import { useEscapeLayer } from './escape-layer.js'
import React from 'react'

/** 提示词预览。关闭后把焦点还给打开它的按钮。 */
export function PromptDialog(props: {
  readonly value: { name: string; prompt: string }
  readonly title: string
  readonly closeLabel: string
  readonly returnFocus: HTMLElement
  readonly onClose: () => void
}): React.ReactElement {
  const close = (): void => {
    props.onClose()
    queueMicrotask(() => {
      if (props.returnFocus.isConnected) props.returnFocus.focus({ preventScroll: true })
    })
  }
  useEscapeLayer(true, close)
  return React.createElement(AntdProvider, null, React.createElement(Modal, {
    open: true,
    title: props.title,
    width: 760,
    keyboard: false,
    closable: false,
    maskClosable: true,
    onCancel: close,
    footer: [
      React.createElement(Button, { key: 'close', type: 'primary', autoFocus: true, onClick: close }, props.closeLabel),
    ],
  }, React.createElement(Input.TextArea, {
    className: 'aag-prompt-body',
    readOnly: true,
    value: props.value.prompt,
    'aria-label': props.title,
    style: { height: 'min(560px, calc(100vh - 220px))', minHeight: 240, resize: 'none', overflow: 'auto' },
  })))
}
