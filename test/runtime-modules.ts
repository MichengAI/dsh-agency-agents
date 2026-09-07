import React from 'react'

export function createRoot(): { render(node: React.ReactNode): void } {
  return { render: () => {} }
}

function icon(): React.ReactElement {
  return React.createElement('svg', { 'aria-hidden': true })
}

export const IconRefreshOutline16 = icon
export const IconDownloadOutline16 = icon
export const IconCopyOutline16 = icon
export const IconCloseOutline16 = icon
