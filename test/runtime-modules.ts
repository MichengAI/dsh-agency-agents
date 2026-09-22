import React from 'react'

/** 浏览器测试把 react-dom/client 指到这里，避免打进宿主的 createRoot。 */
export function createRoot(): { render(node: React.ReactNode): void } {
  return { render: () => {} }
}
