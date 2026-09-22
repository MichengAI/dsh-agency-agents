/** DSH Web 在运行时注入的更新按钮依赖，仅用于本插件的编译期类型检查。 */

declare module 'react-dom/client' {
  import type { ReactNode } from 'react'

  export function createRoot(container: Element): {
    unmount(): void
    render(node: ReactNode): void
  }
}

