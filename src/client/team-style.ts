/** 团队仅补充成员和主理人字段布局；基础控件统一复用专家页 aag 样式。 */
export const TEAM_CSS = `
.aag-team-grid .aag-card-description{min-height:80px;-webkit-line-clamp:unset}
.aag-library-navigation{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--dsw-alias-border-l2)}.aag-library-summary{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end;font-size:12px}.aag-library-navigation>.aag-library-tabs{border-bottom:0}.aag-library-shell>.aag-section,.aag-library-shell>div>.aag-section{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center}.aag-library-shell>.aag-section>*,.aag-library-shell>div>.aag-section>*{grid-column:1/-1}.aag-library-shell .aag-section>.aag-toolbar{grid-column:2;grid-row:1}.aag-library-shell .aag-section>.aag-custom-tabs{grid-column:1;grid-row:1}.aag-library-shell .aag-section>.aag-custom-tabs{gap:8px}@container(max-width:420px){.aag-library-shell .aag-section>.aag-toolbar{grid-column:1/-1;grid-row:2;justify-content:flex-end}.aag-library-shell .aag-section>.aag-custom-tabs{grid-column:1/-1}.aag-library-summary{gap:4px 8px}}
.aag-library-tabs{display:flex;align-items:stretch;gap:24px;min-height:40px;border-bottom:1px solid var(--dsw-alias-border-l2);margin:0}
.aag-library-tabs button{appearance:none;position:relative;margin:0 0 -1px;padding:8px 2px 10px;border:0;border-bottom:2px solid transparent;border-radius:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:14px;line-height:20px;cursor:pointer}
.aag-library-tabs button[aria-selected=true]{border-bottom-color:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary);font-weight:600}
.aag-library-tabs button:hover{color:var(--dsw-alias-label-primary)}
.aag-library-tabs button:focus-visible{outline:2px solid var(--dsw-alias-button-primary-fill);outline-offset:3px}
.aag-library-shell>.aag-section,.aag-library-shell>div>.aag-section{padding-bottom:0}.aag-library-shell .aag-custom-tabs{margin:0}
.aag-team-avatar{width:44px;height:44px;position:relative}
.agt-stack{display:flex;align-items:center;flex-shrink:0}
.agt-stack img{object-fit:cover;border-radius:50%;width:44px;height:44px}
.agt-stack img+img{margin-left:-14px}
.aag-team-avatar .agt-stack{position:relative;width:44px;height:44px}
.aag-team-avatar .agt-stack img{position:absolute;width:27px;height:27px;left:0;top:2px;margin:0}
.aag-team-avatar .agt-stack img:nth-child(2){left:17px}
.aag-team-avatar .agt-stack img:nth-child(3){left:9px;top:18px}
.agt-avatar{object-fit:cover;border-radius:50%;flex-shrink:0}
.agt-dialog{font-family:inherit;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary)}
.agt-dialog *{box-sizing:border-box}
.agt-dialog.aag-prompt-modal[open]{display:block;overflow:auto}
.agt-dialog>.aag-modal-head{position:sticky;top:0;z-index:1;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2))}
.agt-dialog>.aag-custom-head{flex-shrink:0}
.agt-dialog button:not(.aag-action){display:inline-flex;align-items:center;justify-content:center;gap:4px;min-height:32px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer}
.agt-dialog button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.agt-dialog button:disabled{opacity:.5;cursor:default}
.agt-dialog button:focus-visible,.agt-dialog input:focus-visible,.agt-dialog textarea:focus-visible,.agt-dialog summary:focus-visible{outline:2px solid var(--dsw-alias-label-secondary);outline-offset:2px}
.agt-dialog input:focus-visible,.agt-dialog textarea:focus-visible{outline:none;border-color:var(--dsw-alias-label-tertiary)}
.agt-dialog button.agt-primary{background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);border-color:transparent}
.agt-dialog button.agt-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover);color:var(--dsw-alias-label-primary-foreground)}
.agt-dialog svg{width:18px;height:18px;flex:none;stroke-width:1.7}
.agt-dialog h2{font-size:18px;line-height:26px;margin:0 0 8px}
.agt-dialog h3{font-size:15px;line-height:22px;margin:0}
.agt-editor>.aag-custom-head h3{font-size:19px;line-height:26px}
.agt-dialog h4{font-size:14px;line-height:22px;margin:0 0 12px}
.agt-dialog p:not(.aag-note){margin:8px 0 12px}
.agt-dialog input,.agt-dialog textarea{width:100%;min-width:0;font:inherit;background:var(--dsw-alias-bg-layer-3,var(--dsw-alias-button-elevated-fill));color:inherit;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px 8px;min-height:32px}
.agt-dialog textarea{resize:vertical;line-height:1.6}
.agt-dialog .agt-help,.agt-dialog small{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.agt-dialog .agt-tag{display:inline-block;font-size:11px;line-height:18px;padding:1px 6px;border:1px solid var(--dsw-alias-border-l3);border-radius:4px;color:var(--dsw-alias-label-secondary)}
.agt-tags,.agt-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.agt-detail>.agt-detail-head,.agt-detail>.agt-description,.agt-detail>.agt-tags,.agt-detail>section{margin:16px}
.agt-detail-head{display:flex;align-items:center;gap:16px}
.agt-detail-head .agt-row{margin-top:12px}
.agt-detail>section{border-top:1px solid var(--dsw-alias-border-l2);padding-top:16px}
.agt-detail section h3{display:flex;gap:8px;align-items:center;margin-bottom:12px}
.agt-member-list{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}
.agt-member{display:flex;gap:10px;align-items:center;min-width:0}
.agt-member strong,.agt-member small{display:block;overflow-wrap:anywhere}
.agt-member img{width:36px;height:36px}
.agt-examples{display:grid;gap:8px}
.agt-examples button{justify-content:space-between;text-align:left;width:100%}
.agt-read-prompt{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.65 ui-monospace,Consolas,monospace;padding:12px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:6px}
.agt-danger{color:var(--dsw-alias-state-error-primary)!important;margin:0 16px 16px}
.agt-editor form{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}
.agt-editor-scroll{flex:1;min-height:0}
.agt-editor-fields fieldset{border:0;padding:0;margin:0;min-width:0}
.agt-section{border-bottom:1px solid var(--dsw-alias-border-l2);padding:0 0 20px;margin-bottom:20px}
.agt-section:last-child{border:0;margin-bottom:0}
.agt-editor .agt-prompt{display:block;width:100%;min-height:300px;margin:12px 0 8px;font-size:13px;line-height:1.6}
.agt-segment{display:flex;gap:8px;flex-wrap:wrap}
.agt-segment button[aria-pressed=true]{border-color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-layer-3)}
.agt-count{float:right;font-size:12px}
.agt-edit-member{padding:12px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}
.agt-edit-member .agt-row strong{margin-right:auto}
.agt-editor .aag-custom-footer{flex-shrink:0}
.agt-editor .aag-custom-footer>span{display:block;font-size:12px;color:var(--dsw-alias-label-secondary);margin-bottom:8px}
.agt-picker>input,.agt-picker>h2{margin:16px;width:calc(100% - 32px)}
.agt-picker-list{display:grid;max-height:55vh;overflow:auto;padding:0 16px 16px}
.agt-picker-list button{justify-content:flex-start;text-align:left;border:0;border-bottom:1px solid var(--dsw-alias-border-l2);border-radius:0;padding:12px 0}
.agt-picker-list small{display:block}
.agt-picker-list strong{font-size:14px}
.agt-composer-tabs{display:flex;gap:8px;padding:4px 8px}
.agt-composer-tabs button{flex:1;padding:6px;border:0;border-radius:5px;background:transparent;color:inherit;cursor:pointer}
.agt-composer-tabs button[aria-pressed=true]{background:var(--dsw-alias-interactive-bg-hover)}
.agt-compact-list{overflow:auto;max-height:250px}
.agt-compact-row{display:flex;align-items:center;padding:4px 8px}
.agt-compact-row>button:first-child{flex:1;text-align:left;border:0;background:transparent;color:inherit;cursor:pointer;padding:8px}
.agt-compact-row small{margin-left:8px;opacity:.65}
.agt-compact-row>button:last-child{background:transparent;border:0;color:inherit;cursor:pointer}
.agt-compact input{width:calc(100% - 16px);margin:8px;padding:8px;box-sizing:border-box;background:transparent;color:inherit;border:1px solid var(--dsw-alias-border-l2);border-radius:6px}
@media(max-width:560px){.agt-member-list{grid-template-columns:1fr}.agt-detail-head{align-items:flex-start;flex-wrap:wrap}.agt-dialog.aag-prompt-modal{width:calc(100vw - 32px)}.agt-editor .agt-prompt{min-height:240px}}
@media(prefers-reduced-motion:reduce){.agt-dialog *{transition:none!important}}
`
