import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

/** 发布包的 d.ts 再导出未随包发布的 tsx，NodeNext 解析不到这些组件。这里补上类型；运行时仍加载真实包。 */
declare module '@deepseek-ai/dsh-client-ui-primitives' {
  export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'toolbar'
  export function Button(props: {
    variant?: ButtonVariant
    size?: 'md' | 'sm'
    icon?: ReactNode
    className?: string
    children?: ReactNode
  } & ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element

  export function Switch(props: {
    checked: boolean
    onChange: (next: boolean) => void
    label: string
    disabled?: boolean
    title?: string
    className?: string
  }): JSX.Element

  export function Input(props: {
    icon?: ReactNode
    className?: string
  } & InputHTMLAttributes<HTMLInputElement>): JSX.Element

  export interface MenuItem {
    id: string
    label: ReactNode
    disabled?: boolean
    danger?: boolean
  }
  export function Menu(props: {
    open: boolean
    anchor: ReactNode
    items?: readonly MenuItem[]
    onSelect?: (id: string) => void
    onClose: () => void
    align?: 'start' | 'end'
    side?: 'bottom' | 'top' | 'right'
    portal?: boolean
    compact?: boolean
    selectedId?: string
    className?: string
  }): JSX.Element

  export function Modal(props: {
    open: boolean
    onClose: () => void
    title: string
    closeLabel: string
    children?: ReactNode
    footer?: ReactNode
  }): JSX.Element

  export interface SegmentedControlOption<Value extends string> {
    value: Value
    label: string
    disabled?: boolean
  }
  export interface SegmentedTab<Value extends string = string> {
    value: Value
    label: ReactNode
    id: string
    panelId: string
  }
  export function SegmentedTabs<Value extends string>(props: {
    items: readonly [SegmentedTab<Value>, ...SegmentedTab<Value>[]]
    value: Value
    onChange: (value: Value) => void
    label: string
    className?: string
  }): JSX.Element

  export function SegmentedControl<Value extends string>(props: {
    id: string
    value: Value
    options: readonly SegmentedControlOption<Value>[]
    onChange: (next: Value) => void
    label: string
    disabled?: boolean
    className?: string
  }): JSX.Element
}
