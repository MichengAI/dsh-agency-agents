import type { Locale } from 'antd/es/locale/index.js'
import darkAlgorithmImport from 'antd/es/theme/themes/dark/index.js'
import defaultAlgorithmImport from 'antd/es/theme/themes/default/index.js'
import { antdThemeConfig, antdThemeCss } from './antd-theme.js'
import { useHostDark } from './host-theme.js'
import type { ConfigProviderProps } from 'antd/es/config-provider/index.js'
import ConfigProviderImport from 'antd/es/config-provider/index.js'
import type { DrawerProps } from 'antd/es/drawer/index.js'
import DrawerImport from 'antd/es/drawer/index.js'
import type { InputProps } from 'antd/es/input/Input.js'
import InputImport from 'antd/es/input/index.js'
import type { TextAreaProps } from 'antd/es/input/TextArea.js'
import TextAreaImport from 'antd/es/input/TextArea.js'
import type { ModalProps } from 'antd/es/modal/interface.js'
import ModalImport from 'antd/es/modal/index.js'
import type { ProgressProps } from 'antd/es/progress/progress.js'
import ProgressImport from 'antd/es/progress/index.js'
import type { SegmentedProps } from 'antd/es/segmented/index.js'
import SegmentedImport from 'antd/es/segmented/index.js'
import type { ListProps } from 'antd/es/list/index.js'
import ListImport from 'antd/es/list/index.js'
import type { ListItemMetaProps, ListItemProps } from 'antd/es/list/Item.js'
import type { SwitchProps } from 'antd/es/switch/index.js'
import SwitchImport from 'antd/es/switch/index.js'
import { Button as PrimitiveButton, type ButtonVariant } from '@deepseek-ai/dsh-client-ui-primitives'
import React from 'react'

function unwrap<T>(mod: unknown): T {
  const value = mod as { default?: T }
  return value.default ?? (mod as T)
}

const TextArea = unwrap<React.ComponentType<TextAreaProps>>(TextAreaImport)
export const Input = Object.assign(unwrap<React.ComponentType<InputProps>>(InputImport), { TextArea })

export interface UnifiedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant
  type?: 'primary' | 'ghost' | 'outline' | 'default' | 'text' | 'link' | 'button' | 'submit' | 'reset'
  danger?: boolean
  loading?: boolean
  block?: boolean
  size?: 'md' | 'sm' | 'middle' | 'small' | 'large'
  icon?: React.ReactNode
  shape?: string
  href?: string
  target?: string
}

/** 桥接官方宿主原语 Button，自动映射 Antd 常用属性（type="primary", danger, block, etc.） */
export function Button({ variant, type, danger, loading, block, size, shape, className, children, ...props }: UnifiedButtonProps): React.ReactElement {
  let mappedVariant: ButtonVariant = variant ?? 'outline'
  if (danger) mappedVariant = 'outline'
  else if (type === 'primary') mappedVariant = 'primary'
  else if (type === 'text' || type === 'link') mappedVariant = 'ghost'

  const classes = [
    'aag-btn',
    className,
    danger ? 'is-danger' : '',
    block ? 'is-block' : '',
    loading ? 'is-loading' : '',
  ].filter(Boolean).join(' ')

  const mappedSize = (size === 'small' || size === 'sm') ? 'sm' : 'md'

  return React.createElement(PrimitiveButton, {
    ...props,
    variant: mappedVariant,
    size: mappedSize,
    icon: props.icon,
    className: classes || undefined,
    disabled: props.disabled || loading,
  }, children)
}
export const ConfigProvider = unwrap<React.ComponentType<ConfigProviderProps>>(ConfigProviderImport)
export const Drawer = unwrap<React.ComponentType<DrawerProps>>(DrawerImport)
export const Modal = unwrap<React.ComponentType<ModalProps>>(ModalImport)
export const Progress = unwrap<React.ComponentType<ProgressProps>>(ProgressImport)
export const Segmented = unwrap<React.ComponentType<SegmentedProps>>(SegmentedImport)
type AntdList = (<T>(props: ListProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement) & {
  Item: React.ComponentType<ListItemProps> & { Meta: React.ComponentType<ListItemMetaProps> }
}
export const List = unwrap<AntdList>(ListImport)
export const Switch = unwrap<React.ComponentType<SwitchProps>>(SwitchImport)
const darkAlgorithm = unwrap<NonNullable<ConfigProviderProps['theme']> extends { algorithm?: infer Algorithm } ? Algorithm : never>(darkAlgorithmImport)
const defaultAlgorithm = unwrap<NonNullable<ConfigProviderProps['theme']> extends { algorithm?: infer Algorithm } ? Algorithm : never>(defaultAlgorithmImport)

const antdMounted = React.createContext(false)

/** 当前树里是否已经有插件的 Ant Design 主题。 */
export function useAntdMounted(): boolean {
  return React.useContext(antdMounted)
}

/** 按钮不插汉字空格。亮暗跟随宿主，接入官方圆角与主题隔离命名空间。 */
export function AntdProvider(props: { locale?: Locale; children?: React.ReactNode }): React.ReactElement {
  const dark = useHostDark()
  return React.createElement(antdMounted.Provider, { value: true }, React.createElement(ConfigProvider, {
    locale: props.locale,
    button: { autoInsertSpace: false },
    theme: {
      ...antdThemeConfig,
      algorithm: dark ? darkAlgorithm : defaultAlgorithm,
    },
  }, React.createElement('style', { 'data-plugin': '@michengai/dsh-agency-agents' }, antdThemeCss), props.children))
}

/** 设置页已经有主题时不再包一层，独立挂载时才补上。 */
export function MaybeAntdProvider(props: { locale?: Locale; children?: React.ReactNode }): React.ReactElement {
  return useAntdMounted()
    ? React.createElement(React.Fragment, null, props.children)
    : React.createElement(AntdProvider, { locale: props.locale }, props.children)
}
