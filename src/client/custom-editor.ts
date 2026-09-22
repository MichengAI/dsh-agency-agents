import { LibraryConfirm, LibraryEditorFooter } from './library-ui.js'
import { Button, Drawer, Input } from './antd-ui.js'
import { useEscapeLayer } from './escape-layer.js'
import React from 'react'
import { CategorySelect } from './category-select.js'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import { customExpertInputSchema, DEFAULT_EXPERT_EMOJI, type CatalogSnapshot, type CustomExpertInput } from '../expert-contract.js'
import type { AgencyCatalogRemote } from './remote.js'
import { EXPERT_AVATAR_URLS } from './avatars.js'
import { EN_DIVISION, ZH_DIVISION } from '../names.js'

import { loadEditorReview, continueEditorReview, type EditorReview } from "./editor-review.js";

const h = React.createElement
export interface CustomEditorProps {
  readonly expert?: CustomExpertInput
  readonly enabled: boolean
  readonly revision: number
  readonly divisions: readonly string[]
  readonly remote: AgencyCatalogRemote
  readonly t: TranslateNS<'agency'>
  readonly locale: 'zh' | 'en'
  readonly onSaved: (catalog: CatalogSnapshot) => void
  readonly onClose: () => void
}

/** 右侧抽屉承载表单，确认层用独立弹窗，避免被抽屉挡住。 */
export function CustomExpertEditor(props: CustomEditorProps): React.ReactElement {
  const [initial, setInitial] = React.useState(() => ({
    ...props.expert,
    name: props.expert?.name ?? '', description: props.expert?.description ?? '',
    division: props.expert?.division ?? 'specialized', prompt: props.expert?.prompt ?? '',
    emoji: props.expert?.emoji || DEFAULT_EXPERT_EMOJI, avatar: props.expert?.avatar ?? 0,
  }))
  const [draft, setDraft] = React.useState(initial)
  const [revision, setRevision] = React.useState(props.revision);
  const [enabled, setEnabled] = React.useState(props.enabled);
  const [needsReview, setNeedsReview] = React.useState(false);
  const [review, setReview] = React.useState<EditorReview | null>(null);
  const [busy, setBusy] = React.useState(false)
  const saving = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)
  const [discard, setDiscard] = React.useState(false)
  const form = React.useRef<HTMLFormElement | null>(null)
  const close = (): void => {
    if (saving.current) return
    if (JSON.stringify(draft) !== JSON.stringify(initial)) setDiscard(true)
    else props.onClose()
  }
  useEscapeLayer(true, () => { if (discard) setDiscard(false); else close() })
  const set = (key: 'name' | 'description' | 'division' | 'prompt', value: string): void => {
    setDraft(current => ({ ...current, [key]: value }))
    setError(null)
  }
  const refreshReview = (): void => {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    setReview(null);
    void loadEditorReview(props.remote, draft.slug, props.locale)
      .then(setReview)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : String(cause)))
      .finally(() => { saving.current = false; setBusy(false); });
  };
  const continueReview = (useLatest: boolean): void => {
    if (review === null) return;
    const next = continueEditorReview(review, draft, useLatest);
    setDraft({ ...next.expert, emoji: next.expert.emoji ?? DEFAULT_EXPERT_EMOJI, avatar: next.expert.avatar ?? 0 });
    if (review.expert !== undefined) setInitial(customExpertInputSchema.parse(review.expert));
    setRevision(next.revision);
    setEnabled(next.enabled);
    setReview(null);
    setNeedsReview(false);
    setError(null);
  };
  const submit = (enabled: boolean): void => {
    if (saving.current || needsReview || form.current?.reportValidity() !== true) return
    const parsed = customExpertInputSchema.safeParse(draft)
    if (!parsed.success) { setError(props.t('custom.invalid')); return }
    // 名称以 Host 当前名册为准；旧本地名册不能拦截已被其他窗口释放的名称。
    saving.current = true
    setBusy(true)
    setError(null)
    void props.remote.saveCustomExpert(parsed.data, enabled, revision).then(result => {
      if (!result.ok) throw new Error(result.error.message)
      props.onSaved(result.value)
    }).catch((cause: unknown) => {
      const message = cause instanceof Error ? cause.message : String(cause)
      const conflict = /changed since it was read|其他窗口|another window/iu.test(message);
      setNeedsReview(conflict);
      if (conflict) setReview(null);
      setError(conflict ? props.t("custom.conflict") : message);
    }).finally(() => { saving.current = false; setBusy(false) })
  }
  const label = (text: string, control: React.ReactNode, required = false): React.ReactElement => h('label', { className: 'aag-custom-field' },
    h('span', null, text, required ? h('small', null, props.t('custom.required')) : null), control)
  const input = (key: 'name' | 'description', text: string, maxLength: number): React.ReactElement => h(Input, {
    value: draft[key], maxLength, required: true, disabled: busy,
    'aria-label': text, onChange: (event: React.ChangeEvent<HTMLInputElement>) => set(key, event.currentTarget.value),
    ...(key === 'name' ? { placeholder: props.t('custom.namePlaceholder') } : {}),
  })
  return h(Drawer, {
    open: true, keyboard: false, placement: 'right', size: 'min(560px, 100vw)', destroyOnHidden: true,
    rootClassName: 'aag-editor-drawer', styles: { body: { padding: 0 } }, title: props.t(draft.slug ? 'custom.edit' : 'custom.new'),
    onClose: () => { if (discard) setDiscard(false); else close() },
  },
  h('form', { ref: form, className: 'aag-custom-body', onSubmit: (event: React.FormEvent) => event.preventDefault(), inert: discard ? '' : undefined },
    h('p', { className: 'aag-editor-intro' }, props.t('custom.intro')),
    h('fieldset', { className: 'aag-custom-avatars', disabled: busy }, h('legend', null, props.t('custom.avatar')),
      EXPERT_AVATAR_URLS.map((url, index) => h('button', {
        key: url, type: 'button', 'aria-label': `${props.t('custom.avatar')} ${index + 1}`,
        'aria-pressed': draft.avatar === index, className: draft.avatar === index ? 'is-selected' : '',
        onClick: () => setDraft(current => ({ ...current, avatar: index })),
      }, h('img', { src: url, width: 36, height: 36, alt: '', loading: 'lazy' })))),
    label(props.t('custom.name'), input('name', props.t('custom.name'), 40), true),
    label(props.t('custom.description'), h(Input.TextArea, {
      value: draft.description, rows: 2, maxLength: 160, required: true, disabled: busy,
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
    h('div', { className: 'aag-custom-prompt-head' }, h('label', { htmlFor: 'aag-custom-prompt' }, props.t('custom.prompt')),
      draft.prompt === '' ? h(Button, { disabled: busy, onClick: () => set('prompt', props.t('custom.templateText')) }, props.t('custom.template')) : null),
    h(Input.TextArea, {
      id: 'aag-custom-prompt', className: 'aag-custom-prompt', value: draft.prompt, rows: 8, required: true, maxLength: 20_000, disabled: busy,
      'aria-label': props.t('custom.prompt'), placeholder: props.t('custom.promptPlaceholder'),
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => set('prompt', event.currentTarget.value),
    }), error === null ? null : h('div', { className: 'aag-error', role: 'alert' }, error),
      needsReview ? h("section", { className: "aag-custom-review" },
        h(Button, { disabled: busy, onClick: refreshReview }, props.t("custom.reviewLatest")),
        review === null ? null : h(React.Fragment, null,
          h("h4", null, props.t("custom.latestContent")),
          review.expert === undefined
            ? h("p", null, props.t(draft.slug ? "custom.reviewDeleted" : "custom.reviewNew"))
            : h(React.Fragment, null,
                h("p", null, review.expert.name),
                h("p", null, review.expert.description),
                h("p", null, props.locale === "zh" ? ZH_DIVISION[review.expert.division] ?? review.expert.division : EN_DIVISION[review.expert.division] ?? review.expert.division),
                h("img", { src: EXPERT_AVATAR_URLS[review.expert.avatar ?? 0], width: 36, height: 36, alt: props.t("custom.avatar") }),
                h(Input.TextArea, { readOnly: true, value: review.expert.prompt, "aria-label": props.t("custom.latestContent"), rows: 8 }),
              ),
          h("p", null, props.t("custom.reviewHint")),
          h("div", { className: "aag-custom-review-actions" },
            h(Button, { disabled: busy, onClick: () => continueReview(false) }, props.t(draft.slug && review.expert === undefined ? "custom.continueAsNew" : "custom.keepDraft")),
            review.expert === undefined ? null : h(Button, { disabled: busy, onClick: () => continueReview(true) }, props.t("custom.useLatest")),
          ),
        ),
      ) : null,
  ),
  h(LibraryEditorFooter, {
    editing: !!draft.slug, busy, blocked: needsReview, inert: discard,
    help: props.t('custom.enableHint'), cancelLabel: props.t('custom.cancel'), saveLabel: props.t('custom.save'),
    primaryLabel: props.t(busy ? 'custom.saving' : draft.slug ? 'custom.saveChanges' : 'custom.saveEnable'),
    close, save: () => submit(false), primary: () => submit(draft.slug ? enabled : true),
  }),  discard ? h(LibraryConfirm, { title: props.t('custom.discardTitle'), cancelLabel: props.t('custom.keep'), confirmLabel: props.t('custom.discard'), close: () => setDiscard(false), confirm: props.onClose }, h('p', null, props.t('custom.discardTitle'))) : null)
}

export function CustomDeleteDialog(props: { name: string; busy: boolean; error: string | null; t: TranslateNS<'agency'>; close(): void; confirm(): void }): React.ReactElement {
  return h(LibraryConfirm, { title: props.t('custom.deleteTitle'), busy: props.busy, error: props.error, cancelLabel: props.t('custom.cancel'), confirmLabel: props.t('custom.delete'), close: props.close, confirm: props.confirm },
    h('p', null, props.name), h('p', { className: 'aag-note' }, props.t('custom.deleteHint')))
}
export const CUSTOM_EDITOR_CSS = `
.aag-editor-drawer .ant-drawer-body{padding:0}
.aag-custom-body{overflow-y:auto;overscroll-behavior:contain;padding:20px 24px;flex:1;min-height:0}
.aag-editor-intro{margin:0 0 16px;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:22px}
.aag-custom-field{display:block;margin:18px 0;font-size:14px}
.aag-custom-field>span,.aag-custom-field>label{display:block;margin-bottom:8px}
.aag-custom-field small{font-size:11px;opacity:.65;margin-left:8px}
.aag-custom-avatars{border:0;padding:0;margin:20px 0;display:flex;gap:8px;flex-wrap:wrap}
.aag-custom-avatars legend{margin-bottom:10px;font-size:13px}
.aag-custom-avatars button{padding:3px;border:2px solid transparent;background:transparent;border-radius:12px;cursor:pointer}
.aag-custom-avatars img{border-radius:8px;object-fit:cover}
.aag-custom-avatars button.is-selected{border-color:var(--dsw-alias-label-tertiary)}
.aag-custom-prompt-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px;font-size:14px}
.aag-editor-drawer .aag-custom-prompt{min-height:220px;line-height:1.8}
.aag-custom-body .aag-error{margin-top:14px}
.aag-custom-footer{padding:16px 24px 22px;border-top:1px solid var(--dsw-alias-border-l2);flex-shrink:0}
.aag-custom-footer>div{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}
.aag-custom-footer>div>button:first-child{margin-right:auto}
.aag-editor-drawer input:focus-visible,.aag-editor-drawer textarea:focus-visible,.aag-editor-drawer .ant-input:focus,.aag-editor-drawer .ant-input:focus-visible,.ant-modal input:focus-visible,.ant-modal textarea:focus-visible{outline:none}
.aag-custom-badge{display:inline-block;font-size:10px;padding:1px 5px;border:1px solid var(--dsw-alias-border-l3);border-radius:4px;margin-left:6px;color:var(--dsw-alias-label-secondary)}
.aag-custom-notice{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:12px 0;font-size:13px;color:var(--dsw-alias-label-primary)}
.aag-custom-review{margin-top:16px;padding:14px;border:1px solid var(--dsw-alias-brand-primary);border-radius:8px}
.aag-custom-review-actions{display:flex;flex-wrap:wrap;gap:8px}
.aag-custom-review p{overflow-wrap:anywhere}
@media(max-width:560px){.aag-custom-body{padding:16px}.aag-custom-footer{padding:14px 16px 20px}.aag-custom-prompt-head{flex-wrap:wrap}}
`
