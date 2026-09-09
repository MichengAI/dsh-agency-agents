import React from 'react'
import { CategorySelect } from './category-select.js'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import { customExpertInputSchema, DEFAULT_EXPERT_EMOJI, type CatalogSnapshot, type CustomExpertInput, type ExpertSummary } from '../expert-contract.js'
import type { AgencyCatalogRemote } from './remote.js'
import { EXPERT_AVATAR_URLS } from './avatars.js'
import { EN_DIVISION, ZH_DIVISION } from '../names.js'

const h = React.createElement
const EMOJI_CHOICES = ['🧩', '📦', '💻', '🎨', '✍️', '🔎', '📊', '⚖️', '🧠', '🛠️', '💡', '📚']
export interface CustomEditorProps {
  readonly expert?: CustomExpertInput
  readonly enabled: boolean
  readonly revision: number
  readonly experts: readonly ExpertSummary[]
  readonly divisions: readonly string[]
  readonly remote: AgencyCatalogRemote
  readonly t: TranslateNS<'agency'>
  readonly locale: 'zh' | 'en'
  readonly onSaved: (catalog: CatalogSnapshot) => void
  readonly onClose: () => void
}

/** 原生 dialog 负责焦点约束，独立滚动表单和固定底栏适应设置页内的窄视口。 */
export function CustomExpertEditor(props: CustomEditorProps): React.ReactElement {
  const [initial] = React.useState(() => ({
    ...props.expert,
    name: props.expert?.name ?? '', description: props.expert?.description ?? '',
    division: props.expert?.division ?? 'specialized', prompt: props.expert?.prompt ?? '',
    emoji: props.expert?.emoji || DEFAULT_EXPERT_EMOJI, avatar: props.expert?.avatar ?? 0,
  }))
  const [draft, setDraft] = React.useState(initial)
  const [busy, setBusy] = React.useState(false)
  const saving = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)
  const [discard, setDiscard] = React.useState(false)
  const dialog = React.useRef<HTMLDialogElement | null>(null)
  const form = React.useRef<HTMLFormElement | null>(null)
  React.useEffect(() => {
    const node = dialog.current
    const previous = document.activeElement as HTMLElement | null
    node?.showModal()
    return () => { node?.close(); previous?.focus() }
  }, [])
  const close = (): void => {
    if (saving.current) return
    if (JSON.stringify(draft) !== JSON.stringify(initial)) setDiscard(true)
    else props.onClose()
  }
  const set = (key: 'name' | 'description' | 'division' | 'prompt' | 'emoji', value: string): void => {
    setDraft(current => ({ ...current, [key]: value }))
    setError(null)
  }
  const submit = (enabled: boolean): void => {
    if (saving.current || form.current?.reportValidity() !== true) return
    const parsed = customExpertInputSchema.safeParse(draft)
    if (!parsed.success) { setError(props.t('custom.invalid')); return }
    const name = parsed.data.name.trim().toLowerCase()
    if (props.experts.some(expert => expert.slug !== parsed.data.slug && [expert.name, expert.nameEn].some(value => value.trim().toLowerCase() === name))) {
      setError(props.t('custom.duplicate')); return
    }
    saving.current = true
    setBusy(true)
    setError(null)
    void props.remote.saveCustomExpert(parsed.data, enabled, props.revision).then(result => {
      if (!result.ok) throw new Error(result.error.message)
      props.onSaved(result.value)
    }).catch((cause: unknown) => {
      const message = cause instanceof Error ? cause.message : String(cause)
      setError(/changed since it was read|其他窗口|another window/iu.test(message) ? props.t('custom.conflict') : message)
    }).finally(() => { saving.current = false; setBusy(false) })
  }
  const label = (text: string, control: React.ReactNode, required = false): React.ReactElement => h('label', { className: 'aag-custom-field' },
    h('span', null, text, required ? h('small', null, props.t('custom.required')) : null), control)
  const input = (key: 'name' | 'description' | 'emoji', text: string, maxLength: number): React.ReactElement => h('input', {
    className: 'aag-control', value: draft[key], maxLength, required: key !== 'emoji', disabled: busy,
    'aria-label': text, onChange: (event: React.ChangeEvent<HTMLInputElement>) => set(key, event.currentTarget.value),
    ...(key === 'name' ? { placeholder: props.t('custom.namePlaceholder') } : {}),
  })
  return h('dialog', {
    ref: dialog, role: 'dialog', 'aria-modal': true, className: 'aag-custom-dialog', 'aria-label': props.t(draft.slug ? 'custom.edit' : 'custom.new'),
    onCancel: (event: React.SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); if (discard) setDiscard(false); else close() },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      if (discard) setDiscard(false)
      else close()
    },
  },
  h('header', { className: 'aag-custom-head' }, h('h3', null, props.t(draft.slug ? 'custom.edit' : 'custom.new')),
    h('button', { type: 'button', className: 'aag-action', disabled: busy, onClick: close }, props.t('settings.promptClose'))),
  h('form', { ref: form, className: 'aag-custom-body', onSubmit: (event: React.FormEvent) => event.preventDefault(), inert: discard ? '' : undefined },
    h('p', { className: 'aag-note' }, props.t('custom.intro')),
    h('fieldset', { className: 'aag-custom-avatars', disabled: busy }, h('legend', null, props.t('custom.avatar')),
      EXPERT_AVATAR_URLS.map((url, index) => h('button', {
        key: url, type: 'button', 'aria-label': `${props.t('custom.avatar')} ${index + 1}`,
        'aria-pressed': draft.avatar === index, className: draft.avatar === index ? 'is-selected' : '',
        onClick: () => setDraft(current => ({ ...current, avatar: index })),
      }, h('img', { src: url, width: 36, height: 36, alt: '', loading: 'lazy' })))),
    label(props.t('custom.name'), input('name', props.t('custom.name'), 40), true),
    label(props.t('custom.description'), h('textarea', {
      className: 'aag-control', value: draft.description, rows: 2, maxLength: 160, required: true, disabled: busy,
      'aria-label': props.t('custom.description'), placeholder: props.t('custom.descriptionPlaceholder'),
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => set('description', event.currentTarget.value),
    }), true),
    h('div', { className: 'aag-custom-field' },
      h('label', { htmlFor: 'aag-custom-division' }, props.t('custom.division')),
      h(CategorySelect, {
        id: 'aag-custom-division', value: draft.division, disabled: busy, label: props.t('custom.division'),
        onChange: (value: string) => set('division', value),
        options: props.divisions.map(division => ({ value: division, label: (props.locale === 'en' ? EN_DIVISION : ZH_DIVISION)[division] ?? division })),
      })),
    label(props.t('custom.emoji'), input('emoji', props.t('custom.emoji'), 32)),
    h('div', { className: 'aag-custom-emojis' }, EMOJI_CHOICES.map(emoji => h('button', {
      key: emoji, type: 'button', disabled: busy, 'aria-label': `${props.t('custom.emoji')} ${emoji}`,
      'aria-pressed': draft.emoji === emoji, onClick: () => set('emoji', emoji),
    }, emoji))),
    h('p', { className: 'aag-note' }, props.t('custom.emojiHint')),
    h('div', { className: 'aag-custom-preview' }, h('span', null, props.t('custom.preview')),
      h('strong', null, draft.name || props.t('custom.name'))),
    h('div', { className: 'aag-custom-prompt-head' }, h('label', { htmlFor: 'aag-custom-prompt' }, props.t('custom.prompt')),
      draft.prompt === '' ? h('button', { type: 'button', className: 'aag-action', disabled: busy, onClick: () => set('prompt', props.t('custom.templateText')) }, props.t('custom.template')) : null),
    h('textarea', {
      id: 'aag-custom-prompt', className: 'aag-control aag-custom-prompt', value: draft.prompt, required: true, maxLength: 20_000, disabled: busy,
      'aria-label': props.t('custom.prompt'), placeholder: props.t('custom.promptPlaceholder'),
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => set('prompt', event.currentTarget.value),
    }), error === null ? null : h('div', { className: 'aag-error', role: 'alert' }, error)),
  h('footer', { className: 'aag-custom-footer', inert: discard ? '' : undefined },
    h('p', { className: 'aag-note' }, props.t('custom.enableHint')),
    h('div', null, h('button', { type: 'button', className: 'aag-action', disabled: busy, onClick: close }, props.t('custom.cancel')),
      draft.slug ? null : h('button', { type: 'button', className: 'aag-action', disabled: busy, onClick: () => submit(false) }, props.t('custom.save')),
      h('button', { type: 'button', className: 'aag-action aag-custom-primary', disabled: busy, onClick: () => submit(draft.slug ? props.enabled : true) }, props.t(busy ? 'custom.saving' : draft.slug ? 'custom.saveChanges' : 'custom.saveEnable')))),
  discard ? h('section', { className: 'aag-custom-discard', role: 'alert' }, h('h4', null, props.t('custom.discardTitle')),
    h('button', { type: 'button', className: 'aag-action', autoFocus: true, onClick: () => setDiscard(false) }, props.t('custom.keep')),
    h('button', { type: 'button', className: 'aag-action', onClick: props.onClose }, props.t('custom.discard'))) : null)
}

export function CustomDeleteDialog(props: { name: string; busy: boolean; error: string | null; t: TranslateNS<'agency'>; close(): void; confirm(): void }): React.ReactElement {
  const dialog = React.useRef<HTMLDialogElement | null>(null)
  React.useEffect(() => { const node = dialog.current; node?.showModal(); return () => { node?.close() } }, [])
  return h('dialog', { ref: dialog, role: 'dialog', 'aria-modal': true, className: 'aag-custom-delete',
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      if (!props.busy) props.close()
    }, 'aria-label': props.t('custom.deleteTitle'), onCancel: (event: React.SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); if (!props.busy) props.close() } },
    h('h3', null, props.t('custom.deleteTitle')), h('p', null, props.name), h('p', { className: 'aag-note' }, props.t('custom.deleteHint')),
    props.error === null ? null : h('div', { className: 'aag-error', role: 'alert' }, props.error),
    h('div', { className: 'aag-custom-delete-actions' }, h('button', { className: 'aag-action', disabled: props.busy, onClick: props.close }, props.t('custom.cancel')),
      h('button', { className: 'aag-action aag-custom-danger', disabled: props.busy, onClick: props.confirm }, props.t(props.busy ? 'custom.saving' : 'custom.delete'))))
}

export const CUSTOM_EDITOR_CSS = `
.aag-custom-dialog{position:fixed;inset:0 0 0 auto;margin:0;width:min(560px,100vw);height:100dvh;max-width:100vw;max-height:100dvh;border:0;border-left:1px solid var(--dsw-alias-border-standard,#505055);background:var(--dsw-alias-bg-base,#29292b);color:var(--dsw-alias-label-primary,#eee);padding:0;overflow:hidden;font-family:inherit}.aag-custom-dialog[open]{display:flex;flex-direction:column}.aag-custom-dialog::backdrop,.aag-custom-delete::backdrop{background:#0008}.aag-custom-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:20px 24px;border-bottom:1px solid #7774;flex-shrink:0}.aag-custom-head h3{margin:0;font-size:19px}.aag-custom-body{overflow-y:auto;overscroll-behavior:contain;padding:20px 24px;flex:1;min-height:0}.aag-custom-body>.aag-note{margin:0 0 16px}.aag-custom-field{display:block;margin:18px 0;font-size:14px}.aag-custom-field>span,.aag-custom-field>label{display:block;margin-bottom:8px}.aag-custom-field small{font-size:11px;opacity:.65;margin-left:8px}.aag-custom-dialog .aag-control{box-sizing:border-box;width:100%;max-width:100%;font:inherit;background:var(--dsw-alias-bg-base,#29292b);color:inherit;border:1px solid #7778;border-radius:8px;padding:10px 12px;min-height:42px}.aag-custom-dialog textarea{resize:vertical}.aag-custom-avatars{border:0;padding:0;margin:20px 0;display:flex;gap:8px;flex-wrap:wrap;max-height:120px;overflow:auto}.aag-custom-avatars legend{margin-bottom:10px;font-size:13px}.aag-custom-avatars button{padding:3px;border:2px solid transparent;background:transparent;border-radius:12px;cursor:pointer}.aag-custom-avatars img{border-radius:8px;object-fit:cover}.aag-custom-avatars button.is-selected{border-color:#81a3ff}.aag-custom-emojis{display:flex;flex-wrap:wrap;gap:6px;margin-top:-8px;margin-bottom:10px}.aag-custom-emojis button{padding:6px;font:20px 'Segoe UI Emoji','Apple Color Emoji',sans-serif;background:transparent;border:1px solid #7774;border-radius:7px;cursor:pointer}.aag-custom-emojis button[aria-pressed=true]{border-color:#81a3ff;background:#678cfa25}.aag-custom-preview{display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:12px 0;margin:10px 0 20px;font-size:12px}.aag-custom-preview strong{background:#6b8ee52c;color:var(--dsw-alias-label-primary,#d9e4ff);border-radius:5px;padding:4px 9px;font-weight:500;font-family:'Segoe UI Emoji',inherit}.aag-custom-prompt-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px;font-size:14px}.aag-custom-dialog .aag-custom-prompt{min-height:200px;line-height:1.8}.aag-custom-body .aag-error{margin-top:14px}.aag-custom-footer{padding:16px 24px 22px;border-top:1px solid #7774;flex-shrink:0}.aag-custom-footer>div{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}.aag-custom-footer>div>button:first-child{margin-right:auto}.aag-custom-primary{background:#668df6!important;color:#101c38!important;border-color:#668df6!important}.aag-custom-dialog button:focus-visible,.aag-custom-dialog input:focus-visible,.aag-custom-dialog textarea:focus-visible,.aag-custom-dialog select:focus-visible{outline:2px solid #92b2ff;outline-offset:2px}.aag-custom-dialog button:disabled{opacity:.5;cursor:default}.aag-custom-discard{position:absolute;inset:auto 16px 16px;padding:20px;background:var(--dsw-alias-bg-base,#333);border:1px solid #888;border-radius:10px;box-shadow:0 0 0 100vmax #0007}.aag-custom-discard button{margin-right:12px}.aag-custom-delete{max-width:min(440px,calc(100vw - 32px));padding:24px;border:1px solid #7778;border-radius:12px;background:var(--dsw-alias-bg-base,#29292b);color:var(--dsw-alias-label-primary,#eee)}.aag-custom-delete-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.aag-custom-danger{color:#e67777!important}.aag-custom-tabs{display:flex;gap:10px;margin:18px 0;flex-wrap:wrap}.aag-custom-tabs button[aria-pressed=true]{background:var(--dsw-alias-interactive-bg-hover,#424248);border-color:#92a9e1}.aag-custom-badge{display:inline-block;font-size:10px;padding:1px 5px;border:1px solid #8894b680;border-radius:4px;margin-left:6px;color:var(--dsw-alias-label-secondary,#becdf5)}.aag-custom-notice{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:12px 0;font-size:13px;color:var(--dsw-alias-label-primary)}.aag-custom-empty{text-align:center;padding:42px 12px}.aag-custom-empty p{margin:12px 0 22px}.aag-custom-card-emoji{margin-right:5px;font-family:'Segoe UI Emoji','Apple Color Emoji',sans-serif}body:has(.aag-custom-dialog[open]),body:has(.aag-custom-delete[open]){overflow:hidden}
.aag-custom-tabs .aag-action,.aag-custom-dialog .aag-action,.aag-custom-delete .aag-action,.aag-custom-notice .aag-action{border:1px solid var(--dsw-alias-border-l3,#7778);border-radius:6px;background:var(--dsw-alias-bg-layer-2,#333);color:var(--dsw-alias-label-primary,#eee);padding:7px 12px;font:inherit;cursor:pointer}.aag-custom-tabs button[aria-pressed=true]{background:var(--dsw-alias-bg-layer-3,#444);border-color:#92a9e1}.aag-card-actions-with-more{position:relative;padding-right:34px}.aag-card-more{position:absolute;right:0;bottom:0;width:34px;height:47px;border-left:1px solid var(--dsw-alias-border-l2)}.aag-card-more summary{display:flex;align-items:center;justify-content:center;height:100%;list-style:none;cursor:pointer;font-size:20px;color:var(--dsw-alias-label-secondary)}.aag-card-more summary::-webkit-details-marker{display:none}.aag-card-more summary:hover,.aag-card-more[open] summary{background:var(--dsw-alias-interactive-bg-hover)}.aag-card-more summary:focus-visible{outline:2px solid var(--dsw-alias-state-success-primary);outline-offset:-3px}.aag-card-more-panel{position:absolute;right:6px;bottom:43px;min-width:144px;padding:4px;border:1px solid var(--dsw-alias-border-l3);border-radius:6px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3));box-shadow:var(--dsw-shadow-lv3);z-index:2}.aag-card-more-panel button{display:block;width:100%;padding:9px 12px;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;text-align:left;white-space:nowrap;cursor:pointer}.aag-card-more-panel button:hover{background:var(--dsw-alias-interactive-bg-hover)}.aag-card-more-panel button:disabled{opacity:.5;cursor:default}
.aag-custom-dialog .aag-select-trigger{min-height:42px;font-size:14px}
@media(max-width:560px){.aag-custom-body{padding:16px}.aag-custom-head{padding:18px 16px}.aag-custom-footer{padding:14px 16px 20px}.aag-custom-avatars{max-height:112px}.aag-custom-dialog .aag-action{font-size:13px}.aag-custom-prompt-head{flex-wrap:wrap}}
`
