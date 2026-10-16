import assert from 'node:assert/strict'
import { test } from 'vitest'
import { antdThemeConfig, antdThemeCss } from '../src/client/antd-theme.js'
import { CARD_SETTINGS_CSS, COMPOSER_CSS, SETTINGS_CSS } from '../src/client/index.js'
import { TEAM_CSS } from '../src/client/team-style.js'
import { DISCOVERY_CSS } from '../src/client/expert-discovery.js'
import { CUSTOM_EDITOR_CSS } from '../src/client/custom-editor.js'

test('Ant Design 隔离命名空间与官方尺度配置', () => {
  assert.deepEqual(antdThemeConfig.cssVar, { key: 'aag-theme', prefix: 'aag-ant' }, 'Ant 变量必须隔离于宿主及其他插件')
  assert.deepEqual(
    [antdThemeConfig.token?.borderRadiusXS, antdThemeConfig.token?.borderRadiusSM, antdThemeConfig.token?.borderRadius, antdThemeConfig.token?.borderRadiusLG],
    [4, 8, 12, 16],
    '兜底圆角显式采用官方尺度，不依赖 Ant 自动派生',
  )
})

test('Ant Design CSS 桥接层不认领第三方皮肤作用域并采用官方半透明浮层令牌', () => {
  assert.ok(!/data-dsh-glass|data-ds-dark-theme/.test(antdThemeCss), '适配层不认领第三方主题作用域，也不新增独立明暗配色')
  assert.ok(antdThemeCss.includes('--dsw-menu-surface-fill') && antdThemeCss.includes('--dsw-elevation-panel'), '浮层材质归宿主主题所有')
  assert.ok(antdThemeCss.includes('--dsw-menu-backdrop-filter'), '支持毛玻璃模糊滤镜')
  assert.ok(antdThemeCss.includes('.aag-theme.ant-modal'), 'Modal 桥接官方 Panel 圆角')
  assert.ok(antdThemeCss.includes('.aag-theme.ant-select-dropdown'), 'Select 浮层桥接官方浮层令牌')
})

test('插件各组件全面接入 DSH 官方圆角体系', () => {
  const combinedCss = COMPOSER_CSS + SETTINGS_CSS + CARD_SETTINGS_CSS + TEAM_CSS + DISCOVERY_CSS + CUSTOM_EDITOR_CSS
  assert.match(CARD_SETTINGS_CSS, /\.aag-expert-card\{[^}]*border-radius:var\(--dsw-radius-md,12px\)/, '专家卡片采用官方 R12 圆角')
  assert.match(CARD_SETTINGS_CSS, /\.aag-expert-card\{[^}]*background:var\(--dsw-alias-bg-layer-1\)/, '专家卡片采用 layer-1 避免实心遮挡')
  assert.match(SETTINGS_CSS, /\.aag-empty\{[^}]*border-radius:var\(--dsw-radius-md,12px\)/, '空状态卡片采用官方 R12 圆角')
  assert.match(DISCOVERY_CSS, /\.aag-discovery input\{[^}]*border-radius:var\(--dsw-radius-sm,8px\)/, '发现输入框采用官方 R8 圆角')
  assert.match(CUSTOM_EDITOR_CSS, /\.aag-custom-badge\{[^}]*border-radius:var\(--dsw-radius-xs,4px\)/, '徽章采用官方 R4 圆角')
  assert.match(TEAM_CSS, /\.agt-dialog input:not\(\.ant-input\)[^}]*border-radius:var\(--dsw-radius-sm,8px\)/, '团队输入框采用官方 R8 圆角')
  assert.ok(!/border-radius:\s*(?:6|7|10|20|24)px/.test(combinedCss), '不再存在未桥接官方阶梯的硬编码圆角')
})

test('Switch 原语对齐官方 36x20 尺寸与深灰/品牌色明暗反差规范', () => {
  assert.match(CARD_SETTINGS_CSS, /\.aag-enable-switch\{[^}]*width:36px;height:20px/, '开关尺寸为官方 36x20')
  assert.match(CARD_SETTINGS_CSS, /\.aag-enable-switch\{[^}]*background:var\(--dsw-alias-border-l3/, '关态为中性深灰底色')
  assert.match(CARD_SETTINGS_CSS, /\.aag-enable-switch\[aria-checked=true\]\{background:var\(--dsw-alias-brand-primary/, '开态为品牌色')
  assert.match(CARD_SETTINGS_CSS, /\.aag-enable-switch-thumb\{[^}]*width:16px;height:16px/, '滑块尺寸为 16x16')
  assert.match(CARD_SETTINGS_CSS, /\.aag-icon-btn\{[^}]*width:28px;height:28px/, '工具栏按钮对齐 skills-manager 28px 图标规范')
})
