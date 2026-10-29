import assert from 'node:assert/strict'
import { test } from 'vitest'
import { PLUGIN_UI_CSS } from '../src/client/plugin-ui.js'
import { CARD_SETTINGS_CSS, COMPOSER_CSS, RECOMMEND_BAR_CSS, SETTINGS_CSS } from '../src/client/index.js'
import { TEAM_CSS } from '../src/client/team-style.js'
import { DISCOVERY_CSS } from '../src/client/expert-discovery.js'
import { CUSTOM_EDITOR_CSS } from '../src/client/custom-editor.js'

test('危险按钮悬停保持红色，且不再依赖 Ant 皮肤', () => {
  assert.doesNotMatch(PLUGIN_UI_CSS, /\.ant-/, '插件样式不再引用 Ant 类名')
  assert.match(
    PLUGIN_UI_CSS,
    /\.aag-theme \.is-danger\{color:var\(--dsw-alias-state-error-primary,#ef4444\)!important/,
    '危险态采用纯净的语义类名',
  )
  assert.match(PLUGIN_UI_CSS, /\.aag-textarea/, '多行文本框采用官方统一设计规范')
  assert.match(PLUGIN_UI_CSS, /\.aag-menu-select-trigger\{[^}]*height:32px!important[^}]*border:0\.5px solid var\(--dsw-alias-border-l2\)/, '选择触发器对齐归档 32px 密度')
})

test('插件样式不认领第三方皮肤作用域', () => {
  const combined = PLUGIN_UI_CSS + COMPOSER_CSS + SETTINGS_CSS + CARD_SETTINGS_CSS + TEAM_CSS + DISCOVERY_CSS + CUSTOM_EDITOR_CSS
  assert.ok(!/data-dsh-glass|data-ds-dark-theme/.test(combined), '适配层不认领第三方主题作用域')
  assert.ok(!/\.ant-/.test(combined), '源码样式不再包含 Ant 选择器')
})

test('插件各组件全面接入 DSH 官方圆角体系', () => {
  const combinedCss = COMPOSER_CSS + SETTINGS_CSS + CARD_SETTINGS_CSS + TEAM_CSS + DISCOVERY_CSS + CUSTOM_EDITOR_CSS
  assert.match(CARD_SETTINGS_CSS, /\.aag-expert-card\{[^}]*border-radius:var\(--dsw-radius-md,12px\)/, '专家卡片采用官方 R12 圆角')
  assert.match(CARD_SETTINGS_CSS, /\.aag-expert-card\{[^}]*background:var\(--dsw-alias-bg-layer-1\)/, '专家卡片采用 layer-1 避免实心遮挡')
  assert.match(SETTINGS_CSS, /\.aag-empty\{[^}]*border-radius:var\(--dsw-radius-md,12px\)/, '空状态卡片采用官方 R12 圆角')
  assert.match(PLUGIN_UI_CSS, /\.aag-textarea\{[^}]*border-radius:var\(--dsw-radius-sm,8px\)/, '多行文本框采用官方 R8 圆角')
  assert.doesNotMatch(DISCOVERY_CSS, /\.aag-discovery input\{/, '发现搜索不再手写输入框边框')
  assert.match(CUSTOM_EDITOR_CSS, /\.aag-custom-badge\{[^}]*border-radius:var\(--dsw-radius-xs,4px\)/, '徽章采用官方 R4 圆角')
  assert.doesNotMatch(TEAM_CSS, /\.agt-dialog input/, '团队弹窗不再改宿主输入框')
  assert.ok(!/border-radius:\s*(?:6|7|10|20|24)px/.test(combinedCss), '不再存在未桥接官方阶梯的硬编码圆角')
})

test('Switch 开关全面由宿主官方原语接管，彻底清空手写 CSS 规则', () => {
  assert.doesNotMatch(CARD_SETTINGS_CSS, /\.aag-enable-switch\{/, '手写开关规则已彻底移除')
  assert.match(CARD_SETTINGS_CSS, /\.aag-icon-btn\{[^}]*width:22px!important;min-width:22px!important;height:22px!important/, '纯图标按钮对齐技能插件 22px 描边规范')
})

test('输入框专家按钮全面由宿主官方原语 Button 接管，彻底清空手写胶囊 CSS', () => {
  assert.doesNotMatch(COMPOSER_CSS, /\.aag-btn\{/, '手写 .aag-btn 规则已彻底移除')
  assert.doesNotMatch(COMPOSER_CSS, /outline:/, '手写 outline 已移除')
  assert.doesNotMatch(COMPOSER_CSS, /border-radius:\s*999px/, '手写 999px 药丸圆角已移除')
  assert.match(COMPOSER_CSS, /\.aag-btn-wrap button\{[^}]*color:var\(--dsw-alias-label-secondary\)/, '默认文字颜色对齐宿主底栏次级灰')
  assert.match(COMPOSER_CSS, /\.aag-btn-wrap button\{[^}]*font-size:13px/, '字号对齐宿主底栏 13px 规范')
  assert.match(COMPOSER_CSS, /\.aag-btn-wrap button\{[^}]*font-weight:500/, '字重对齐宿主底栏 500 规范')
  assert.match(COMPOSER_CSS, /\.aag-btn-wrap button\{[^}]*padding:0 4px 0 8px/, '内边距对齐宿主底栏带 Chevron 触发器规范')
  assert.match(COMPOSER_CSS, /\.aag-btn-wrap button:hover:not\(:disabled\)[^}]*color:var\(--dsw-alias-label-secondary\)/, '悬浮态保持宿主底栏次级灰色阶，不突变为深色主色')
  assert.match(COMPOSER_CSS, /\.aag-btn-chevron\{[^}]*transition:transform 120ms ease/, 'Chevron 展开具备平滑过渡动效')
  assert.match(COMPOSER_CSS, /transform:rotate\(180deg\)/, '展开态 Chevron 顺滑旋转 180 度')
})

test('专家推荐组件排版、色阶与展开动效全面与宿主模式规范统一', () => {
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-seat\{[^}]*font-size:13px/, '推荐按钮字号对齐 13px 规范')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-seat\{[^}]*font-weight:500/, '推荐按钮字重对齐 500 规范')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-seat\{[^}]*line-height:20px/, '推荐按钮行高对齐 20px 规范')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-seat\{[^}]*padding:0 4px 0 8px/, '推荐按钮内边距对齐 0 4px 0 8px 规范')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-seat\{[^}]*color:var\(--dsw-alias-label-secondary\)/, '推荐按钮文字默认收敛至次级灰')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-seat:hover:not\(:disabled\)[^}]*color:var\(--dsw-alias-label-secondary\)/, '悬停保持次级灰')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-chevron\{[^}]*transition:transform 120ms ease/, '推荐 Chevron 具备过渡动效')
  assert.match(RECOMMEND_BAR_CSS, /transform:rotate\(180deg\)/, '展开态推荐 Chevron 旋转 180 度')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-icon\{color:var\(--dsw-alias-brand,#3b82f6\)/, '保留智能推荐高亮星标特征')
  assert.match(RECOMMEND_BAR_CSS, /\.aag-hero-recommend-badge\{[^}]*border-radius:999px/, '保留智能推荐胶囊数量徽标')
})
