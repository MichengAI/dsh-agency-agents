import {
  Button as PrimitiveButton,
  Input as PrimitiveInput,
  Modal as PrimitiveModal,
  type ButtonVariant,
} from '@deepseek-ai/dsh-client-ui-primitives'
import React from 'react'

/** 宿主没有多行输入。令牌对齐单行 Input，不桥接成 Ant TextArea。 */
export function TextArea({ rows = 3, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>): React.ReactElement {
  const classes = ['aag-textarea', className].filter(Boolean).join(' ')
  return React.createElement('textarea', { ...props, rows, className: classes })
}

export interface UnifiedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  icon?: React.ReactNode
  prefix?: React.ReactNode
  allowClear?: boolean | { clearIcon?: React.ReactNode }
}

/** 单行直接用宿主 Input，多行挂本插件的 TextArea。不手写清除按钮，保持宿主原生行为与 DOM 结构稳定。 */
export function Input({ prefix, icon, className, allowClear: _allowClear, ...props }: UnifiedInputProps): React.ReactElement {
  const classes = ['aag-host-input', className].filter(Boolean).join(' ')
  return React.createElement(PrimitiveInput, {
    ...props,
    className: classes,
    icon: icon || prefix,
  })
}
Input.TextArea = TextArea

/**
 * 调用方仍可传 onCancel。宿主只认 onClose、title 和 closeLabel，不认宽度、层级和遮罩开关。
 * closeLabel 只用于右上角的 ×：必须是「关闭弹窗」这类独立文案，复用例文会和页脚动作重名。
 */
export function Modal({
  open = true,
  title,
  description,
  children,
  footer,
  onCancel,
  onClose,
  className,
  closeLabel,
}: {
  open?: boolean
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  onCancel?: () => void
  onClose?: () => void
  className?: string
  closeLabel?: string
}): React.ReactElement | null {
  return React.createElement(PrimitiveModal, {
    open,
    title,
    description,
    footer,
    closeLabel: closeLabel ?? (documentUiLocale() === 'en' ? 'Close dialog' : '关闭弹窗'),
    className: ['aag-theme', 'aag-host-modal', className].filter(Boolean).join(' '),
    onClose: onClose || onCancel || (() => undefined),
  }, children)
}

export interface UnifiedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant
  type?: 'primary' | 'ghost' | 'outline' | 'default' | 'text' | 'link' | 'button' | 'submit' | 'reset'
  danger?: boolean
  loading?: boolean
  block?: boolean
  size?: 'md' | 'sm' | 'middle' | 'small' | 'large'
  icon?: React.ReactNode
  href?: string
  target?: string
}

/** 把旧的 type/danger/loading 映射到宿主 Button，不再经过 Ant。 */
export function Button({ variant, type, danger, loading, block, size, className, children, href, target, rel, icon, ...props }: UnifiedButtonProps): React.ReactElement {
  let mappedVariant: ButtonVariant = variant ?? 'outline'
  if (type === 'primary') mappedVariant = 'primary'
  else if (type === 'text' || type === 'link') mappedVariant = 'ghost'
  const classes = [
    'aag-host-btn',
    'aag-theme',
    href ? 'aag-link-btn' : '',
    className,
    mappedVariant === 'primary' ? 'is-primary' : '',
    danger ? 'is-danger' : '',
    block ? 'is-block' : '',
    loading ? 'is-loading' : '',
  ].filter(Boolean).join(' ')
  const mappedSize = (size === 'small' || size === 'sm') ? 'sm' : 'md'
  const hasChildren = children !== undefined && children !== null && children !== false
  const content = [
    icon ? React.createElement('span', {
      key: 'icon',
      className: 'aag-btn-icon',
      style: { display: 'inline-flex', alignItems: 'center', marginRight: hasChildren && !href ? 6 : undefined },
    }, icon) : null,
    children,
  ]
  if (href) {
    return React.createElement('a', {
      ...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>),
      href,
      target,
      rel: rel || (target === '_blank' ? 'noreferrer' : undefined),
      className: classes,
      style: Object.assign({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }, props.style),
    }, content)
  }
  return React.createElement(PrimitiveButton, {
    ...props,
    variant: mappedVariant,
    size: mappedSize,
    className: classes,
    disabled: props.disabled || loading,
  }, content)
}

/** 独立挂载的界面按页面语言选择中英文。 */
export function documentUiLocale(): 'zh' | 'en' {
  const lang = typeof document === 'undefined' ? '' : document.documentElement.lang.toLowerCase()
  return lang.startsWith('en') ? 'en' : 'zh'
}

/** 宿主原语接不住的少量版式。确认框保持宿主 380px，长表单只加宽自己的类。 */
export const PLUGIN_UI_CSS = `
.aag-theme .is-danger{color:var(--dsw-alias-state-error-primary,#ef4444)!important;border:0.5px solid var(--dsw-alias-state-error-primary,#ef4444)!important;background:transparent!important}
.aag-theme .is-danger:hover:not(:disabled){background:var(--dsw-alias-state-error-tertiary,rgba(239,68,68,0.15))!important;color:var(--dsw-alias-state-error-primary,#ef4444)!important;border-color:var(--dsw-alias-state-error-primary,#ef4444)!important}
.aag-host-input{box-sizing:border-box}
.aag-textarea{box-sizing:border-box;width:100%;min-width:0;padding:8px 12px;font:inherit;font-size:13px;line-height:20px;border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-layer-1);border:0.5px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);resize:vertical;transition:border-color 120ms ease}
.aag-textarea:focus,.aag-textarea:focus-visible{outline:var(--dsw-focus-ring-width,1px) solid var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary));outline-offset:0;border-color:var(--dsw-alias-brand-primary)}
.aag-host-modal.aag-editor-modal,.aag-host-modal.agt-editor-modal,.aag-host-modal.agt-picker,.aag-host-modal.agt-detail{width:min(760px,100%)!important;max-height:100%!important}
.aag-menu-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;gap:6px;height:32px;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;user-select:none}
.aag-menu-select-trigger:hover:not(:disabled){border-color:var(--dsw-alias-border-l3,#555)}
.aag-menu-select-trigger.is-open{border-color:var(--dsw-alias-brand-primary)}
.aag-menu-select-trigger:disabled{opacity:.5;cursor:default}
.aag-native-select-arrow{color:var(--dsw-alias-label-secondary);flex-shrink:0}
.aag-theme button.is-block{display:flex!important;width:100%!important}
.aag-theme button.is-loading{position:relative;pointer-events:none;color:transparent!important}
.aag-theme button.is-loading::after{content:"";position:absolute;width:14px;height:14px;top:50%;left:50%;margin:-7px 0 0 -7px;border:1.5px solid currentColor;border-top-color:transparent;border-radius:50%;animation:aag-spin .6s linear infinite;color:var(--dsw-alias-label-primary)}
@keyframes aag-spin{to{transform:rotate(360deg)}}
.aag-theme button.is-danger.is-loading::after{color:var(--dsw-alias-state-error-primary,#ef4444)}
.mpi-busy{height:2px;margin:8px 0 0;border-radius:999px;background:var(--dsw-alias-brand-primary);animation:aag-spin 1s linear infinite}
`
