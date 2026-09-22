import React from 'react'
import { Button, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import { Switch } from './host-switch.js'

export interface LibraryMenuItem {
  id: string
  label: string
  disabled?: boolean
  danger?: boolean
  onSelect(): void
}

/** 创建可选择保存或保存并启用；编辑只保存修改并保留当前启用状态。 */
export function LibraryEditorFooter(props: {
  editing: boolean
  busy: boolean
  blocked?: boolean
  help: string
  cancelLabel: string
  saveLabel: string
  primaryLabel: string
  close(): void
  save(): void
  primary(): void
  inert?: boolean
}) {
  return (
    <footer
      className="aag-custom-footer"
      {...(props.inert ? { inert: '' } : {})}
    >
      <p className="aag-note">{props.help}</p>
      <div>
        <Button variant="outline" size="sm" disabled={props.busy} onClick={props.close}>{props.cancelLabel}</Button>
        {!props.editing && (
          <Button variant="outline" size="sm" disabled={props.busy || props.blocked} onClick={props.save}>{props.saveLabel}</Button>
        )}
        <Button variant="primary" size="sm" disabled={props.busy || props.blocked} onClick={props.primary}>{props.primaryLabel}</Button>
      </div>
    </footer>
  )
}

/** 专家与专家团共享卡片结构，业务差异仅由内容和操作传入。 */
export function LibraryCard(props: {
  name: string
  avatar: React.ReactNode
  metadata: React.ReactNode
  description: string
  enabled: boolean
  disabled?: boolean
  enabledLabel: string
  disabledLabel: string
  toggle(): void
  actions: React.ReactNode
  moreItems: readonly LibraryMenuItem[]
  moreLabel: string
  testId?: string
}) {
  const [moreOpen, setMoreOpen] = React.useState(false)
  return (
    <article className="aag-expert-card" data-testid={props.testId}>
      <div className="aag-card-body">
        {props.avatar}
        <div className="aag-card-identity">
          <div className="aag-card-name" title={props.name}>
            {props.name}
          </div>
          <div className="aag-card-division">{props.metadata}</div>
        </div>
        <div className="aag-card-description" title={props.description}>
          {props.description}
        </div>
        <div className="aag-switch">
          <Switch
            checked={props.enabled}
            disabled={props.disabled}
            label={`${props.name}：${props.enabled ? props.enabledLabel : props.disabledLabel}`}
            title={props.enabled ? props.enabledLabel : props.disabledLabel}
            onChange={() => props.toggle()}
          />
          <span className="aag-switch-state">
            {props.enabled ? props.enabledLabel : props.disabledLabel}
          </span>
        </div>
      </div>
      <div className="aag-card-actions aag-card-actions-with-more">
        <Menu
          className="aag-card-more-anchor"
          open={moreOpen}
          side="top"
          align="end"
          portal
          compact
          onClose={() => setMoreOpen(false)}
          onSelect={(id) => {
            setMoreOpen(false)
            props.moreItems.find((item) => item.id === id)?.onSelect()
          }}
          items={props.moreItems.map((item) => ({
            id: item.id,
            label: item.label,
            disabled: item.disabled,
            danger: item.danger,
          }))}
          anchor={(
            <button
              type="button"
              className="aag-card-more"
              aria-label={`${props.name} · ${props.moreLabel}`}
              aria-expanded={moreOpen}
              title={props.moreLabel}
              onClick={() => setMoreOpen((current) => !current)}
            >
              ⋯
            </button>
          )}
        />
        {props.actions}
      </div>
    </article>
  )
}

/** 原生弹窗统一恢复触发控件，兼容弹窗嵌套与异步打开。 */
export function useLibraryDialog(
  ref: React.RefObject<HTMLDialogElement>,
  target?: HTMLElement,
) {
  React.useLayoutEffect(() => {
    const node = ref.current
    const previous =
      target ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null)
    node?.showModal()
    return () => {
      node?.close()
      queueMicrotask(() => {
        if (previous?.isConnected) previous.focus({ preventScroll: true })
      })
    }
  }, [ref, target])
}

/** 删除、放弃修改及启用依赖使用同一种确认弹窗。 */
export function LibraryConfirm(props: {
  title: string
  children?: React.ReactNode
  confirmLabel: string
  cancelLabel: string
  busy?: boolean
  error?: string | null
  confirm(): void
  close(): void
}) {
  const ref = React.useRef<HTMLDialogElement>(null)
  useLibraryDialog(ref)
  const close = () => {
    if (!props.busy) props.close()
  }
  return (
    <dialog
      ref={ref}
      className="aag-custom-delete"
      aria-label={props.title}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        close()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          close()
        }
      }}
    >
      <h3>{props.title}</h3>
      {props.children}
      {props.error && (
        <p className="aag-error" role="alert">
          {props.error}
        </p>
      )}
      <div className="aag-custom-delete-actions">
        <Button variant="outline" size="sm" autoFocus disabled={props.busy} onClick={close}>{props.cancelLabel}</Button>
        <Button variant="primary" size="sm" disabled={props.busy} onClick={props.confirm}>{props.confirmLabel}</Button>
      </div>
    </dialog>
  )
}
