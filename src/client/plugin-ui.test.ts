import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Input, Modal } from './plugin-ui.js'
import { LibraryCard, LibraryConfirm } from './library-ui.js'
import { PromptDialog } from './prompt-dialog.js'
import { TeamDialog } from './team-shared.js'
import { TEAM_CSS } from './team-style.js'

test('团队弹窗不会把搜索清除按钮改成 32px 描边，文字也不会压到清除钮', () => {
  assert.doesNotMatch(TEAM_CSS, /\.agt-dialog button:not\(/)
  assert.match(TEAM_CSS, /\.agt-dialog button\.agt-plain-btn\{/)
  assert.match(TEAM_CSS, /\.agt-picker-row\{[^}]*border-radius:0/)
  assert.match(TEAM_CSS, /\.agt-picker-row\{[^}]*overflow:hidden/)
  assert.doesNotMatch(TEAM_CSS, /aria-pressed=true/)
  assert.match(TEAM_CSS, /\.agt-dialog \.aag-input-clearable \.aag-host-input input\{[^}]*padding-right:28px/)
  assert.doesNotMatch(TEAM_CSS, /\.agt-dialog input/)
  assert.doesNotMatch(TEAM_CSS, /\.agt-dialog textarea/)
  assert.match(TEAM_CSS, /\.agt-compact>\.aag-host-input\{/)
})

test('宿主输入框与清除包装层声明 border-box，避免 width: 100% 溢出容器', async () => {
  const { PLUGIN_UI_CSS } = await import('./plugin-ui.js')
  const { DISCOVERY_CSS } = await import('./expert-discovery.js')
  assert.match(PLUGIN_UI_CSS, /\.aag-host-input\{[^}]*box-sizing:border-box/)
  assert.match(PLUGIN_UI_CSS, /\.aag-input-clearable\{[^}]*box-sizing:border-box/)
  assert.match(DISCOVERY_CSS, /\.aag-discovery-tools\{[^}]*box-sizing:border-box/)
  assert.match(DISCOVERY_CSS, /\.aag-discovery-tools \.aag-host-input\{[^}]*box-sizing:border-box/)
})

test('专家选择浮层使用宿主模态窗口标准层级背景与面板圆角', async () => {
  const { COMPOSER_CSS } = await import('./index.js')
  assert.match(COMPOSER_CSS, /\.aag-menu\{[^}]*background:var\(--dsw-alias-bg-layer-2\)/)
  assert.match(COMPOSER_CSS, /\.aag-menu\{[^}]*border-radius:var\(--dsw-radius-panel/)
  assert.match(COMPOSER_CSS, /\.aag-menu\{[^}]*--dsw-elevation-stroke-color:var\(--dsw-alias-border-l1\)/)
  assert.doesNotMatch(COMPOSER_CSS, /\.aag-menu\{[^}]*backdrop-filter:/)
  const clientIndex = readFileSync(new URL('./index.ts', import.meta.url), 'utf8')
  assert.match(clientIndex, /className:\s*'aag-menu aag-discovery'[^}]*role:\s*'dialog'[^}]*'aria-modal':\s*'true'/)
})

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
  assert.doesNotMatch(sources, /width:min\(680px/)
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

test('弹窗右上角的关闭按钮与页脚动作不同名，避免同名二义', () => {
  // 宿主把 closeLabel 直接作为 × 的 aria-label；复用例文会让一个可访问名对应两个按钮。
  const nameCount = (html: string, name: string): number =>
    (html.match(new RegExp(`aria-label="${name}"`, 'g')) ?? []).length
    + (html.match(new RegExp(`>${name}</button>`, 'g')) ?? []).length
  const confirm = renderToStaticMarkup(React.createElement(LibraryConfirm, {
    title: '放弃修改',
    confirmLabel: '放弃',
    cancelLabel: '继续编辑',
    confirm: () => undefined,
    close: () => undefined,
  }))
  assert.equal(nameCount(confirm, '继续编辑'), 1, '× 不应复用取消文案')
  assert.match(confirm, /aria-label="关闭弹窗"/)
  const described = renderToStaticMarkup(React.createElement(LibraryConfirm, {
    title: '删除专家',
    description: '删除后不能恢复。',
    confirmLabel: '删除',
    cancelLabel: '取消',
    confirm: () => undefined,
    close: () => undefined,
  }))
  assert.match(described, /class="dsh-modal-description">删除后不能恢复。/)
  assert.doesNotMatch(described, /dsh-modal-body/)
  assert.match(described, /dsh-button-primary/)
  assert.doesNotMatch(described, /is-danger/)
  const prompt = renderToStaticMarkup(React.createElement(PromptDialog, {
    value: { name: '专家', prompt: '正文' },
    title: '提示词',
    closeLabel: '关闭',
    returnFocus: undefined as unknown as HTMLElement,
    onClose: () => undefined,
  }))
  assert.equal(nameCount(prompt, '关闭'), 1, '× 不应复用页脚关闭文案')
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
  assert.doesNotMatch(TEAM_CSS, /\.agt-dialog input,/)
})
