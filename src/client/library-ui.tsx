import { Button, MaybeAntdProvider, Modal } from './antd-ui.js'
import { documentAntdLocale } from './antd-locale.js'
import { useEscapeLayer } from './escape-layer.js'
import React from 'react'

export interface LibraryMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
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
        <Button disabled={props.busy} onClick={props.close}>{props.cancelLabel}</Button>
        {!props.editing && (
          <Button disabled={props.busy || props.blocked} onClick={props.save}>{props.saveLabel}</Button>
        )}
        <Button type="primary" disabled={props.busy || props.blocked} onClick={props.primary}>{props.primaryLabel}</Button>
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
  testId?: string
}) {
  return (
    <article className="aag-expert-card" data-testid={props.testId}>
      <div className="aag-card-body">
        <div className="aag-card-header">
          {props.avatar}
          <div className="aag-card-identity">
            <div className="aag-card-name" title={props.name}>
              {props.name}
            </div>
            <div className="aag-card-division">{props.metadata}</div>
          </div>
          <div className="aag-switch">
            <button
              type="button"
              role="switch"
              aria-checked={props.enabled}
              disabled={props.disabled}
              aria-label={`${props.name}：${props.enabled ? props.enabledLabel : props.disabledLabel}`}
              title={props.enabled ? props.enabledLabel : props.disabledLabel}
              className="aag-enable-switch"
              onClick={(event) => {
                if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
                props.toggle()
              }}
            >
              <span className="aag-enable-switch-thumb" aria-hidden="true" />
            </button>
            <span className="aag-switch-state">
              {props.enabled ? props.enabledLabel : props.disabledLabel}
            </span>
          </div>
        </div>
        <div className="aag-card-description" title={props.description}>
          {props.description}
        </div>
      </div>
      <div className="aag-card-actions">
        {props.actions}
        {props.moreItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.danger ? 'aag-card-action aag-card-action-danger' : 'aag-card-action'}
            disabled={item.disabled}
            title={item.label}
            aria-label={item.label}
            onClick={() => item.onSelect()}
          >
            {item.icon}
            <span className="aag-card-action-text">{item.label}</span>
          </button>
        ))}
      </div>
    </article>
  )
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
  useEscapeLayer(true, () => { if (!props.busy) props.close() })
  return (
    <MaybeAntdProvider locale={documentAntdLocale()}>
    <Modal
      open
      zIndex={1300}
      keyboard={false}
      title={props.title}
      onCancel={() => { if (!props.busy) props.close() }}
      maskClosable={!props.busy}
      closable={!props.busy}
      footer={[
        <Button key="cancel" autoFocus disabled={props.busy} onClick={() => { if (!props.busy) props.close() }}>{props.cancelLabel}</Button>,
        <Button key="confirm" type="primary" danger={props.title.includes('放弃') || props.title.includes('删除')} disabled={props.busy} loading={props.busy} onClick={props.confirm}>{props.confirmLabel}</Button>,
      ]}
    >
      {props.children}
      {props.error && (
        <p className="aag-error" role="alert">
          {props.error}
        </p>
      )}
    </Modal>
    </MaybeAntdProvider>
  )
}
