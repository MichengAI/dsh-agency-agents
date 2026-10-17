import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Input, Modal } from './plugin-ui.js'
import { LibraryCard } from './library-ui.js'
import { TeamDialog } from './team-shared.js'
import { TEAM_CSS } from './team-style.js'

test('搜索框有清除按钮，且不把 allowClear 传给宿主 input', () => {
  const html = renderToStaticMarkup(React.createElement(Input, {
    value: 'review',
    allowClear: { clearIcon: React.createElement('span', { 'aria-label': '清除搜索' }) },
    onChange: () => undefined,
  }))
  assert.match(html, /aria-label="清除搜索"/)
  assert.doesNotMatch(html, /allowClear/)
  assert.match(html, /<button[^>]*aria-label="清除搜索"/)
})

test('弹窗关闭按钮使用调用方文案，不再接收宿主没有的宽度和遮罩参数', () => {
  const html = renderToStaticMarkup(React.createElement(Modal, {
    open: true,
    title: '编辑专家',
    closeLabel: '关闭',
    onClose: () => undefined,
  }))
  assert.match(html, /class="[^"]*dsh-modal-close[^"]*"[^>]*aria-label="关闭"|aria-label="关闭"[^>]*class="[^"]*dsh-modal-close/)
  const sources = ['plugin-ui.ts', 'library-ui.tsx', 'prompt-dialog.ts', 'plugin-update-ui.ts', 'custom-editor.ts', 'team-shared.tsx']
    .map((name) => readFileSync(new URL(`./${name}`, import.meta.url), 'utf8'))
    .join('\n')
  assert.doesNotMatch(sources, /\b(zIndex|maskClosable|keyboard)\s*[:=]/)
  assert.doesNotMatch(sources, /\bclosable\s*[:=]/)
  assert.doesNotMatch(sources, /\bwidth:\s*['"]min\(/)
})

test('专家开关把名称交给宿主 label，读屏能读到专家名', () => {
  const html = renderToStaticMarkup(React.createElement(LibraryCard, {
    name: '评审专家',
    avatar: null,
    metadata: '工程',
    description: '说明',
    enabled: true,
    enabledLabel: '已启用',
    disabledLabel: '未启用',
    toggle: () => undefined,
    actions: null,
    moreItems: [],
  }))
  assert.match(html, /role="switch"[^>]*aria-label="评审专家：已启用"|aria-label="评审专家：已启用"[^>]*role="switch"/)
})

test('团队弹窗内容样式不改宿主关闭按钮，也不给宿主输入内层再加边框', () => {
  const html = renderToStaticMarkup(React.createElement(TeamDialog, {
    title: '编辑专家团',
    close: () => undefined,
    className: 'agt-editor',
    children: '正文',
  }))
  const closeAt = html.indexOf('dsh-modal-close')
  assert.ok(closeAt > 0)
  assert.equal(html.slice(0, closeAt).includes('agt-dialog'), false)
  assert.match(html, /agt-dialog/)
  assert.match(TEAM_CSS, /\.agt-dialog \.aag-host-input input\{[^}]*border:0/)
})
