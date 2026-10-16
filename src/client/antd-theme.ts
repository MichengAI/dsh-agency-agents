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
    Select: { controlHeight: 32, colorBgElevated: 'transparent' },
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
.aag-theme.ant-btn{--aag-ant-button-default-bg:var(--dsw-alias-bg-layer-1,transparent);--aag-ant-button-default-border-color:var(--dsw-alias-border-l2);--aag-ant-button-default-color:var(--dsw-alias-label-primary);--aag-ant-button-default-hover-bg:var(--dsw-alias-interactive-bg-hover);--aag-ant-button-default-active-bg:var(--dsw-alias-interactive-bg-active);--aag-ant-button-default-hover-color:var(--dsw-alias-link);--aag-ant-button-default-hover-border-color:var(--dsw-alias-link);--aag-ant-button-default-active-color:var(--dsw-alias-link);--aag-ant-button-default-active-border-color:var(--dsw-alias-link);border:0.5px solid var(--dsw-alias-border-l2)!important}
.aag-theme.ant-btn:not(.ant-btn-primary):not(.ant-btn-text):not(.ant-btn-link){background:var(--dsw-alias-bg-layer-1,transparent)!important;color:var(--dsw-alias-label-primary)!important;box-shadow:none!important}
.aag-theme.ant-btn:not(.ant-btn-primary):not(.ant-btn-text):not(.ant-btn-link):hover{border-color:var(--dsw-alias-border-l3,#555)!important;background:var(--dsw-alias-interactive-bg-hover)!important}
.aag-theme.ant-btn-primary{background:var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary))!important;color:var(--dsw-alias-label-primary-foreground, #fff)!important;border-color:transparent!important}
.aag-theme.ant-btn-primary:not(:disabled):hover{background:var(--dsw-alias-button-primary-hover, var(--dsw-alias-interactive-bg-active))!important;color:var(--dsw-alias-label-primary-foreground, #fff)!important}
.aag-theme.ant-btn-primary:not(:disabled):active{background:var(--dsw-alias-button-primary-hover, var(--dsw-alias-interactive-bg-active))!important;color:var(--dsw-alias-label-primary-foreground, #fff)!important}
.aag-theme.ant-btn-primary:disabled{opacity:.5!important}
.aag-theme.ant-btn-dangerous.ant-btn-primary{background:var(--dsw-alias-state-error-primary, #ef4444)!important;color:#fff!important;border-color:transparent!important}
.aag-theme.ant-btn-dangerous.ant-btn-primary:not(:disabled):hover{background:var(--dsw-alias-state-error-secondary, #f87171)!important;color:#fff!important}
.aag-theme.ant-modal{--aag-ant-border-radius-lg:var(--dsw-radius-panel,28px)}
.aag-theme .ant-modal-container{position:relative;isolation:isolate;border:0;border-radius:var(--dsw-radius-panel,28px);background:transparent;box-shadow:var(--dsw-elevation-panel,none)}
.aag-theme .ant-modal-container::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3));backdrop-filter:var(--dsw-menu-backdrop-filter,none);pointer-events:none}
.aag-theme .ant-drawer-content{position:relative;isolation:isolate;background:transparent}
.aag-theme .ant-drawer-content::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3));backdrop-filter:var(--dsw-menu-backdrop-filter,none);pointer-events:none}
.aag-theme.aag-theme.aag-theme.ant-select,
.aag-theme.aag-theme.aag-theme.ant-select:hover,
.aag-theme.aag-theme.aag-theme.ant-select.ant-select-focused,
.aag-theme.aag-theme.aag-theme.ant-select.ant-select-open{--aag-ant-select-background-color:var(--dsw-alias-bg-layer-1);--ant-select-background-color:var(--dsw-alias-bg-layer-1);background-color:var(--dsw-alias-bg-layer-1)!important}
.aag-theme.aag-theme.aag-theme.ant-select:not(.ant-select-disabled):hover{border-color:var(--dsw-alias-border-l3,#555)!important}
.aag-theme.aag-theme.aag-theme.ant-select:not(.ant-select-disabled).ant-select-focused,
.aag-theme.aag-theme.aag-theme.ant-select:not(.ant-select-disabled).ant-select-open{border-color:var(--dsw-alias-brand-primary)!important;outline:var(--dsw-focus-ring-width,1px) solid var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary))!important;outline-offset:0!important}
.aag-theme.ant-select-dropdown,.aag-theme.ant-dropdown,.aag-select-dropdown.ant-select-dropdown{isolation:isolate}
.aag-theme.ant-select-dropdown,.aag-theme.ant-dropdown .ant-dropdown-menu,.aag-select-dropdown.ant-select-dropdown{border:0.5px solid var(--dsw-alias-border-l2)!important;border-radius:var(--dsw-radius-lg,16px)!important;background:var(--dsw-menu-surface-fill,var(--dsw-specific-menu))!important;backdrop-filter:var(--dsw-menu-backdrop-filter,blur(16px))!important;-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter,blur(16px))!important;--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-elevation-prominent,var(--dsw-elevation-panel,none))!important}
.aag-theme.ant-select-dropdown::before,.aag-theme.ant-dropdown::before,.aag-select-dropdown.ant-select-dropdown::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:var(--dsw-radius-lg,16px);background:transparent;pointer-events:none}
.aag-theme.ant-dropdown .ant-dropdown-menu-item,.aag-theme.ant-select-dropdown .ant-select-item,.aag-select-dropdown .ant-select-item{border-radius:var(--dsw-radius-md,12px)}
.aag-theme.ant-select-dropdown,.aag-select-dropdown{--aag-ant-select-option-selected-bg:var(--dsw-alias-state-business-tertiary);--aag-ant-select-option-selected-color:var(--dsw-alias-label-primary);--aag-ant-select-option-active-bg:var(--dsw-alias-interactive-bg-hover)}
.aag-select-dropdown .rc-virtual-list,.aag-select-dropdown .rc-virtual-list-holder,.aag-select-dropdown .rc-virtual-list-holder-inner,.aag-select-dropdown .ant-select-item{background:transparent!important}
.aag-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled){background:var(--dsw-alias-state-business-tertiary)!important;color:var(--dsw-alias-label-primary)!important;font-weight:600}
.aag-select-dropdown .ant-select-item-option-active:not(.ant-select-item-option-selected){background:var(--dsw-alias-interactive-bg-hover)!important}
.aag-theme.ant-segmented{--aag-ant-segmented-track-bg:var(--dsw-alias-interactive-bg-hover);--aag-ant-segmented-item-selected-bg:var(--dsw-alias-bg-layer-1);--aag-ant-segmented-item-selected-color:var(--dsw-alias-label-primary);--aag-ant-segmented-item-color:var(--dsw-alias-label-secondary);border-radius:var(--dsw-radius-md,12px);padding:4px}
.aag-theme.ant-segmented .ant-segmented-item,.aag-theme.ant-segmented .ant-segmented-thumb{border-radius:var(--dsw-radius-sm,8px)}
`
