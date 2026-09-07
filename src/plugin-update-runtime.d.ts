/** DSH Web 在运行时注入的更新按钮依赖，仅用于本插件的编译期类型检查。 */

declare module 'react-dom/client' {
  import type { ReactNode } from 'react'

  export function createRoot(container: Element): {
    render(node: ReactNode): void
  }
}

declare module '@deepseek-ai/dsh-client-ui-primitives' {
  export function IconRefreshOutline16(props: { readonly size?: number }): JSX.Element
  export function IconDownloadOutline16(props: { readonly size?: number }): JSX.Element
  export function IconCopyOutline16(props: { readonly size?: number }): JSX.Element
  export function IconCloseOutline16(props: { readonly size?: number }): JSX.Element
}
