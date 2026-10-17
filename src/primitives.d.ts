/**
 * Ambient types for @deepseek-ai/dsh-client-ui-primitives — provided at
 * runtime by the host's frozen platform module table.
 */
declare module '@deepseek-ai/dsh-client-ui-primitives' {
  import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode } from 'react'

  export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'toolbar'
  export function Button(props: {
    variant?: ButtonVariant
    size?: 'md' | 'sm'
    icon?: ReactNode
    className?: string | undefined
    children?: ReactNode
  } & ButtonHTMLAttributes<HTMLButtonElement>): ReactElement

  export function Input(props: {
    icon?: ReactNode
    className?: string
  } & InputHTMLAttributes<HTMLInputElement>): ReactElement

  export function Modal(props: {
    open: boolean
    onClose: () => void
    title: string
    closeLabel: string
    description?: string
    children?: ReactNode
    footer?: ReactNode
    className?: string
    contentClassName?: string
    headless?: boolean
  }): ReactElement | null

  export function SegmentedTabs<Value extends string>(props: {
    items: readonly { value: Value; label: ReactNode; id: string; panelId: string }[]
    value: Value
    onChange: (value: Value) => void
    label: string
    className?: string
  }): ReactElement

  export function SegmentedControl<Value extends string>(props: {
    id: string
    value: Value
    options: readonly { value: Value; label: string; disabled?: boolean; title?: string }[]
    onChange: (value: Value) => void
    label: string
    disabled?: boolean
    className?: string
  }): ReactElement

  export function Switch(props: {
    checked: boolean
    onChange: (next: boolean) => void
    label: string
    disabled?: boolean
    title?: string
    className?: string
  }): ReactElement

  export interface MenuItem {
    id: string
    label: ReactNode
    disabled?: boolean
    icon?: ReactNode
    danger?: boolean
    submenu?: readonly MenuItem[]
  }
  export interface MenuSeparator { type: 'separator'; id: string }
  export interface MenuLabel { type: 'label'; id: string; text: string }
  export type MenuEntry = MenuItem | MenuSeparator | MenuLabel

  export function Menu(props: {
    open: boolean
    anchor: ReactNode
    items: readonly MenuEntry[]
    footer?: readonly MenuEntry[]
    selectedId?: string | undefined
    selectedIds?: readonly string[] | undefined
    onSelect: (id: string) => void
    onClose: () => void
    align?: 'start' | 'end'
    side?: 'bottom' | 'top' | 'right'
    portal?: boolean
    closeOnPointerLeave?: boolean
    dense?: boolean
    compact?: boolean
    className?: string
  }): ReactElement
}
