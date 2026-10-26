import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CreateActionMenu } from './create-action-menu.js'

describe('CreateActionMenu', () => {
  it('renders button with plus icon and menu trigger attributes', () => {
    const html = renderToStaticMarkup(
      React.createElement(CreateActionMenu, {
        label: '新建专家',
        manualLabel: '人工创建',
        chatLabel: '通过对话创建',
        disabled: false,
        onSelectManual: vi.fn(),
        onSelectChat: vi.fn(),
      })
    )

    expect(html).toContain('新建专家')
    expect(html).toContain('aria-haspopup="menu"')
  })
})
