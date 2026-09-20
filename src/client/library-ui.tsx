import React from 'react'

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
        <button
          type="button"
          className="aag-action"
          disabled={props.busy}
          onClick={props.close}
        >
          {props.cancelLabel}
        </button>
        {!props.editing && (
          <button
            type="button"
            className="aag-action"
            disabled={props.busy || props.blocked}
            onClick={props.save}
          >
            {props.saveLabel}
          </button>
        )}
        <button
          type="button"
          className="aag-action aag-custom-primary"
          disabled={props.busy || props.blocked}
          onClick={props.primary}
        >
          {props.primaryLabel}
        </button>
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
  more: React.ReactNode
  moreLabel: string
  testId?: string
}) {
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
        <label
          className="aag-switch"
          title={props.enabled ? props.enabledLabel : props.disabledLabel}
        >
          <input
            type="checkbox"
            className="aag-switch-input"
            checked={props.enabled}
            disabled={props.disabled}
            onChange={props.toggle}
            aria-label={`${props.name}：${props.enabled ? props.enabledLabel : props.disabledLabel}`}
          />
          <span className="aag-switch-track" aria-hidden="true" />
          <span className="aag-switch-state">
            {props.enabled ? props.enabledLabel : props.disabledLabel}
          </span>
        </label>
      </div>
      <div className="aag-card-actions aag-card-actions-with-more">
        <details
          className="aag-card-more"
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              event.currentTarget.open = false
          }}
        >
          <summary
            aria-label={`${props.name} · ${props.moreLabel}`}
            title={props.moreLabel}
          >
            ⋯
          </summary>
          <div
            className="aag-card-more-panel"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('button')) {
                const menu = event.currentTarget.closest('details')
                menu?.removeAttribute('open')
                menu?.querySelector('summary')?.focus()
              }
            }}
          >
            {props.more}
          </div>
        </details>
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
        <button
          type="button"
          className="aag-action aag-action-secondary"
          autoFocus
          disabled={props.busy}
          onClick={close}
        >
          {props.cancelLabel}
        </button>
        <button
          type="button"
          className="aag-action aag-custom-primary"
          disabled={props.busy}
          onClick={props.confirm}
        >
          {props.confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
