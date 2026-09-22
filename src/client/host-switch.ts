import React from 'react'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'

interface SwitchProps {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  disabled?: boolean
  title?: string
  className?: string
}

type SwitchComponent = (props: SwitchProps) => React.ReactElement

/** 对齐 0.1.5 起的官方开关。0.1.0 没有这个导出。 */
export function FallbackSwitch(props: SwitchProps): React.ReactElement {
  return React.createElement('button', {
    type: 'button',
    role: 'switch',
    className: ['aag-switch-fallback', props.className].filter(Boolean).join(' '),
    'aria-checked': props.checked,
    'aria-label': props.label,
    title: props.title,
    disabled: props.disabled,
    onClick: () => props.onChange(!props.checked),
  }, React.createElement('span', { className: 'aag-switch-fallback-thumb' }))
}

export function resolveSwitch(source: { Switch?: SwitchComponent }): SwitchComponent {
  return source.Switch ?? FallbackSwitch
}

export const Switch = resolveSwitch(primitives as unknown as { Switch?: SwitchComponent })
