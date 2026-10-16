import type { ThemeConfig } from 'antd/es/config-provider/context.js'

/** 仅为本插件生成独立变量命名空间；不改变宿主或其他插件的 Ant 主题。 */
export const antdThemeConfig: ThemeConfig = {
  cssVar: { key: 'aag-theme', prefix: 'aag-ant' },
  token: {
    borderRadius: 12,
    borderRadiusSM: 8,
    borderRadiusXS: 4,
    borderRadiusLG: 16,
    controlHeight: 36,
    controlHeightSM: 28,
    controlHeightLG: 40,
    lineWidth: 0.5,
  },
  components: {
    Input: { controlHeight: 32 },
    Button: { defaultShadow: 'none', primaryShadow: 'none', dangerShadow: 'none' },
    Modal: { headerBg: 'transparent', footerBg: 'transparent' },
  },
}

// 色板算法需要具体颜色。这里在算法执行后以 CSS 变量桥接，保留 color-mix、透明度和主题实时更新。
const variables: Record<string, string> = {
  'font-family': 'var(--dsw-font-family, system-ui)',
  'border-radius-xs': 'var(--dsw-radius-xs, 4px)',
  'border-radius-sm': 'var(--dsw-radius-sm, 8px)',
  'border-radius': 'var(--dsw-radius-md, 12px)',
  'border-radius-lg': 'var(--dsw-radius-lg, 16px)',
  'color-text': 'var(--dsw-alias-label-primary)',
  'color-text-heading': 'var(--dsw-alias-label-primary)',
  'color-text-secondary': 'var(--dsw-alias-label-secondary)',
  'color-text-description': 'var(--dsw-alias-label-tertiary)',
  'color-text-tertiary': 'var(--dsw-alias-label-tertiary)',
  'color-text-quaternary': 'var(--dsw-alias-label-tertiary)',
  'color-text-placeholder': 'var(--dsw-alias-label-tertiary)',
  'color-text-disabled': 'var(--dsw-alias-label-tertiary)',
  'color-text-light-solid': 'var(--dsw-alias-label-primary-foreground)',
  'color-icon': 'var(--dsw-alias-label-secondary)',
  'color-icon-hover': 'var(--dsw-alias-label-primary)',
  'color-primary': 'var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary))',
  'color-primary-hover': 'var(--dsw-alias-button-primary-hover, var(--dsw-alias-interactive-bg-active))',
  'color-primary-active': 'var(--dsw-alias-button-primary-hover, var(--dsw-alias-interactive-bg-active))',
  'color-primary-bg': 'var(--dsw-alias-state-business-tertiary)',
  'color-primary-bg-hover': 'var(--dsw-alias-state-business-tertiary)',
  'color-primary-border': 'var(--dsw-alias-link)',
  'color-primary-border-hover': 'var(--dsw-alias-link)',
  'color-primary-text': 'var(--dsw-alias-link)',
  'color-primary-text-hover': 'var(--dsw-alias-link)',
  'color-primary-text-active': 'var(--dsw-alias-link)',
  'color-link': 'var(--dsw-alias-link)',
  'color-link-hover': 'var(--dsw-alias-link)',
  'color-link-active': 'var(--dsw-alias-link)',
  'color-error': 'var(--dsw-alias-state-error-primary)',
  'color-error-hover': 'var(--dsw-alias-state-error-primary)',
  'color-error-active': 'var(--dsw-alias-state-error-primary)',
  'color-success': 'var(--dsw-alias-state-success-primary)',
  'color-warning': 'var(--dsw-alias-state-warn-primary)',
  'color-info': 'var(--dsw-alias-link)',
  'color-border': 'var(--dsw-alias-border-l2)',
  'color-border-secondary': 'var(--dsw-alias-border-l1)',
  'color-border-disabled': 'var(--dsw-alias-border-l1)',
  'color-split': 'var(--dsw-alias-border-l1)',
  'color-bg-container': 'var(--dsw-alias-bg-layer-1)',
  'select-selector-bg': 'var(--dsw-alias-bg-layer-1)',
  'select-active-outline-color': 'var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary))',
  'control-outline': 'var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary))',
  'control-outline-width': 'var(--dsw-focus-ring-width, 1px)',
  'color-bg-elevated': 'var(--dsw-specific-menu, var(--dsw-alias-bg-layer-3))',
  'color-bg-container-disabled': 'var(--dsw-alias-interactive-bg-hover)',
  'color-bg-mask': 'var(--dsw-alias-bg-mask-1)',
  'color-fill': 'var(--dsw-alias-interactive-bg-active)',
  'color-fill-secondary': 'var(--dsw-alias-interactive-bg-hover)',
  'color-fill-tertiary': 'var(--dsw-alias-interactive-bg-hover)',
  'color-fill-quaternary': 'var(--dsw-alias-interactive-bg-hover)',
  'color-fill-alter': 'var(--dsw-alias-interactive-bg-hover)',
  'color-bg-text-hover': 'var(--dsw-alias-interactive-bg-hover)',
  'color-bg-text-active': 'var(--dsw-alias-interactive-bg-active)',
  'control-item-bg-hover': 'var(--dsw-alias-interactive-bg-hover)',
  'control-item-bg-active': 'var(--dsw-alias-state-business-tertiary)',
  'control-item-bg-active-hover': 'var(--dsw-alias-state-business-tertiary)',
  'box-shadow': 'var(--dsw-elevation-panel, none)',
  'box-shadow-secondary': 'var(--dsw-elevation-panel, none)',
}

/** 同一命名空间自动覆盖 body portal；仅覆盖变量，不把弹层搬到会裁剪内容的祖先。 */
export const antdThemeCss = `
.aag-theme.aag-theme.aag-theme{${Object.entries(variables).map(([name, value]) => `--aag-ant-${name}:${value}`).join(';')}}
.aag-theme.ant-modal{--aag-ant-border-radius-lg:var(--dsw-radius-panel,28px)}
.aag-theme .ant-modal-container{position:relative;isolation:isolate;border:0;border-radius:var(--dsw-radius-panel,28px);background:transparent;box-shadow:var(--dsw-elevation-panel,none)}
.aag-theme .ant-modal-container::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3));backdrop-filter:var(--dsw-menu-backdrop-filter,none);pointer-events:none}
.aag-theme .ant-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:10px}
.aag-theme .ant-modal-footer>*{margin:0!important}
.aag-theme .ant-drawer-content{position:relative;isolation:isolate;background:transparent}
.aag-theme .ant-drawer-content::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3));backdrop-filter:var(--dsw-menu-backdrop-filter,none);pointer-events:none}
.aag-menu-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;gap:6px;height:32px;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;user-select:none;transition:border-color 120ms ease,background 120ms ease}
.aag-menu-select-trigger:hover:not(:disabled){border-color:var(--dsw-alias-border-l3,#555)}
.aag-menu-select-trigger.is-open{border-color:var(--dsw-alias-brand-primary);outline:none}
.aag-menu-select-trigger:disabled{opacity:.5;cursor:default}
.aag-native-select-arrow{color:var(--dsw-alias-label-secondary);flex-shrink:0}
.aag-theme button.is-danger,.aag-theme a.is-danger{color:var(--dsw-alias-state-error-primary,#ef4444)!important;border:0.5px solid var(--dsw-alias-state-error-primary,#ef4444)!important;background:transparent!important}
.aag-theme button.is-danger:hover:not(:disabled),.aag-theme a.is-danger:hover:not(:disabled){background:var(--dsw-alias-state-error-tertiary,rgba(239,68,68,0.15))!important;color:var(--dsw-alias-state-error-primary,#ef4444)!important;border-color:var(--dsw-alias-state-error-primary,#ef4444)!important}
.aag-theme button.is-block{display:flex!important;width:100%!important}
.aag-theme button.is-loading{position:relative;pointer-events:none;color:transparent!important}
.aag-theme button.is-loading::after{content:"";position:absolute;width:14px;height:14px;top:50%;left:50%;margin:-7px 0 0 -7px;border:1.5px solid currentColor;border-top-color:transparent;border-radius:50%;animation:aag-spin .6s linear infinite;color:var(--dsw-alias-label-primary)}
@keyframes aag-spin{to{transform:rotate(360deg)}}
.aag-theme button.is-danger.is-loading::after{color:var(--dsw-alias-state-error-primary,#ef4444)}
.aag-theme.ant-segmented{--aag-ant-segmented-track-bg:var(--dsw-alias-interactive-bg-hover);--aag-ant-segmented-item-selected-bg:var(--dsw-alias-bg-layer-1);--aag-ant-segmented-item-selected-color:var(--dsw-alias-label-primary);--aag-ant-segmented-item-color:var(--dsw-alias-label-secondary);border-radius:var(--dsw-radius-md,12px);padding:4px}
.aag-theme.ant-segmented .ant-segmented-item,.aag-theme.ant-segmented .ant-segmented-thumb{border-radius:var(--dsw-radius-sm,8px)}
`
