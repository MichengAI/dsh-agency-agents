/** 团队仅补充成员和主理人字段布局；基础控件统一复用专家页 aag 样式。 */
export const TEAM_CSS = `
.aag-team-grid .aag-card-description{min-height:80px;-webkit-line-clamp:unset}
.aag-library-navigation{display:flex;align-items:center;justify-content:space-between;gap:16px}.aag-library-navigation>.aag-library-tabs{flex:1;width:100%;min-width:0;height:32px;box-sizing:border-box;border-bottom:0;background:color-mix(in srgb,var(--dsw-alias-label-primary,currentColor) 3%,transparent)!important;border-radius:var(--dsw-radius-sm,8px)!important;border:0.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.05))!important;padding:2px!important}
.aag-library-tabs>span{inset:2px auto 2px 2px!important;border-radius:calc(var(--dsw-radius-sm,8px) - 2px)!important;border:0.5px solid color-mix(in srgb,var(--dsw-alias-label-primary,currentColor) 12%,transparent)!important;background:color-mix(in srgb,var(--dsw-alias-label-primary,currentColor) 8%,transparent)!important;box-shadow:none!important}
.aag-library-tabs [role=tab]{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;width:100%!important;height:26px!important;padding:0 10px!important;font-size:13px!important;line-height:18px!important;border-radius:calc(var(--dsw-radius-sm,8px) - 2px)!important;color:var(--dsw-alias-label-secondary,#8b8f98);text-align:center!important}
.aag-library-tabs [role=tab]>*{display:inline-flex!important;align-items:center!important;justify-content:center!important}
.aag-library-tabs [role=tab] svg{width:14px;height:14px;flex:none}
.aag-library-tabs [role=tab]:hover{color:var(--dsw-alias-label-primary,inherit)}
.aag-library-tabs [role=tab][aria-selected=true]{color:var(--dsw-alias-label-primary,inherit)!important;font-weight:600}
.aag-library-tabs .aag-tab-count{display:inline-flex;align-items:baseline;gap:3px;margin-left:6px;color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;line-height:18px;white-space:nowrap}.aag-library-tabs .aag-tab-count strong{color:var(--dsw-alias-label-primary);font-weight:600}
.aag-library-shell>.aag-section,.aag-library-shell>div>.aag-section{padding-bottom:0;min-width:0}
.aag-team-avatar{width:44px;height:44px;position:relative}
.agt-stack{display:flex;align-items:center;flex-shrink:0}
.agt-stack img{object-fit:cover;border-radius:50%;width:44px;height:44px;box-shadow:0 0 0 1.5px var(--dsw-alias-bg-layer-1)}
.agt-stack img+img{margin-left:-14px}
.aag-team-avatar .agt-stack{position:relative;width:44px;height:44px}
.aag-team-avatar .agt-stack img{position:absolute;width:27px;height:27px;left:0;top:2px;margin:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--dsw-alias-bg-layer-1)}
.aag-team-avatar .agt-stack img:nth-child(2){left:17px;z-index:2}
.aag-team-avatar .agt-stack img:nth-child(3){left:9px;top:18px;z-index:3}
.agt-avatar{object-fit:cover;border-radius:50%;flex-shrink:0}
.agt-dialog{font-family:inherit;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary)}
.agt-dialog *{box-sizing:border-box}
.agt-dialog button.agt-plain-btn{display:inline-flex;align-items:center;justify-content:center;gap:4px;min-height:32px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,8px);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer}
.agt-dialog button.agt-plain-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.agt-dialog button.agt-plain-btn:disabled{opacity:.5;cursor:default}
.agt-dialog button.agt-plain-btn:focus-visible,.agt-dialog summary:focus-visible{outline:2px solid var(--dsw-alias-label-secondary);outline-offset:2px}
.agt-dialog h3 svg,.agt-dialog button.agt-plain-btn svg{width:18px;height:18px;flex:none;stroke-width:1.7}
.agt-dialog h2{font-size:18px;line-height:26px;margin:0 0 8px}
.agt-dialog h3{font-size:15px;line-height:22px;margin:0}
.agt-dialog h4{font-size:14px;line-height:22px;margin:0 0 12px}
.agt-dialog p:not(.aag-note){margin:8px 0 12px}
.agt-dialog .agt-help,.agt-dialog small{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.agt-dialog .agt-tag{display:inline-block;font-size:11px;line-height:18px;padding:1px 6px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-xs,4px);color:var(--dsw-alias-label-secondary)}
.agt-tags,.agt-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.agt-detail>.agt-detail-head,.agt-detail>.agt-description,.agt-detail>.agt-tags,.agt-detail>section{margin:16px}
.agt-detail-head{display:flex;align-items:center;gap:16px}
.agt-name-line{display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px}
.agt-name-line h2{margin:0}
.agt-detail-head .agt-row{margin-top:12px}
.agt-detail>section{border-top:0.5px solid var(--dsw-alias-border-l2);padding-top:16px}
.agt-detail section h3{display:flex;gap:8px;align-items:center;margin-bottom:12px}
.agt-member-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:0;padding:0;list-style:none}
.agt-member-list li{display:flex;align-items:center;gap:8px;min-width:0}
.agt-member-list strong,.agt-member-list small{display:block;overflow-wrap:anywhere}
.agt-examples{display:grid;gap:8px}
.agt-read-prompt{white-space:pre-wrap;overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;line-height:1.65}
.agt-editor-modal{display:flex;flex-direction:column;max-height:calc(100vh - 120px)}
.agt-editor-modal .agt-dialog{display:flex;flex-direction:column;max-height:calc(100vh - 120px)}
.agt-editor form{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;max-height:calc(100vh - 180px)}
.agt-editor-scroll{flex:1;min-height:0;overflow:auto;padding-right:4px}
.agt-editor-fields fieldset{border:0;padding:0;margin:0;min-width:0}
.agt-section{border-bottom:0.5px solid var(--dsw-alias-border-l2);padding:0 0 20px;margin-bottom:20px}
.agt-section:last-child{border:0;margin-bottom:0}
.agt-editor .agt-prompt{display:block;width:100%;min-height:300px;margin:12px 0 8px;font-size:13px;line-height:1.6}
.agt-count{float:right;font-size:12px}
.agt-edit-member{padding:14px;margin-top:10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,12px);background:var(--dsw-alias-bg-layer-1)}
.agt-edit-member:first-of-type{border-left:3px solid var(--dsw-alias-brand-primary)}
.agt-edit-member .agt-row strong{margin-right:auto;font-size:14px}
.agt-edit-member details{margin-top:8px}
.agt-edit-member summary{cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:12px;user-select:none}
.agt-edit-member summary:hover{color:var(--dsw-alias-label-primary)}
.agt-editor .aag-custom-footer{flex-shrink:0}
.agt-editor .aag-custom-footer>span{display:block;font-size:12px;color:var(--dsw-alias-label-secondary);margin-bottom:8px}
.agt-picker-tools{flex:none;margin:0}
.agt-picker-note{margin:8px 0 0}
.agt-dialog.agt-picker .agt-picker-list{flex:none;height:min(480px,calc(100vh - 328px));min-height:240px;max-height:none;overflow:auto;padding:8px 0 0}
.agt-dialog.agt-picker .agt-picker-row{display:flex;align-items:center;justify-content:flex-start;gap:12px;width:100%;min-height:0;margin:0;padding:8px 12px;overflow:hidden;border:0;border-bottom:0.5px solid var(--dsw-alias-border-l2);border-radius:0;background:var(--dsw-alias-bg-base,var(--dsw-alias-bg-layer-1));color:inherit;text-align:left;box-shadow:none;cursor:pointer}
.agt-dialog.agt-picker .agt-picker-row:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.agt-dialog.agt-picker .agt-picker-list span{display:flex;min-width:0;flex-direction:column}
.agt-dialog.agt-picker .agt-picker-list small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.agt-dialog.agt-picker .agt-picker-list strong{font-size:14px}
.agt-compact-list{overflow:auto;max-height:250px}
.agt-compact-row{display:flex;align-items:center;padding:4px 8px}
.agt-compact-row>button:first-child{flex:1;display:flex;align-items:center;gap:8px;min-width:0;text-align:left;border:0;background:transparent;color:inherit;cursor:pointer;padding:8px}
.agt-compact-row .agt-stack img{width:22px;height:22px;object-position:center 20%;border:2px solid var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2))}
.agt-compact-row .agt-stack img+img{margin-left:-8px}
.agt-compact-row>button:first-child>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.agt-compact-row small{margin-left:8px;opacity:.65}
.agt-compact-row>button:last-child{background:transparent;border:0;color:inherit;cursor:pointer}
.agt-compact>.aag-host-input{box-sizing:border-box;width:calc(100% - 16px);margin:8px}
.agt-compact .aag-host-input{box-sizing:border-box;width:calc(100% - 16px);margin:8px}
@media(max-width:560px){.agt-detail-head{align-items:flex-start;flex-wrap:wrap}.agt-editor .agt-prompt{min-height:240px}}
@media(prefers-reduced-motion:reduce){.agt-dialog *{transition:none!important}}
`
