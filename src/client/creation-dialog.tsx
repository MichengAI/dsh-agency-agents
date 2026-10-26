import React from 'react'
import { Button, Modal } from './plugin-ui.js'
import { useEscapeLayer } from './escape-layer.js'
import type { CustomExpertInput } from '../expert-contract.js'
import type { TeamInput } from '../team-contract.js'
import type { AgencyCreationRemote } from './remote.js'
import { EN_DIVISION, ZH_DIVISION } from '../names.js'

export interface CreationDialogProps {
  readonly kind: 'expert' | 'team'
  readonly locale: 'zh' | 'en'
  readonly remote: AgencyCreationRemote
  t(key: any, values?: any): string
  onApplyExpert(draft: CustomExpertInput): void
  onApplyTeam(draft: TeamInput, reasons?: Record<string, string>): void
  onClose(): void
}

export function CreationDialog(props: CreationDialogProps): React.ReactElement {
  const [prompt, setPrompt] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [expertDraft, setExpertDraft] = React.useState<CustomExpertInput | null>(null)
  const [teamDraft, setTeamDraft] = React.useState<TeamInput | null>(null)
  const [memberReasons, setMemberReasons] = React.useState<Record<string, string>>({})

  useEscapeLayer(true, () => {
    if (!busy) props.onClose()
  })

  const hasDraft = Boolean(expertDraft || teamDraft)

  const handleGenerate = async () => {
    const text = prompt.trim()
    if (!text || busy) return

    setBusy(true)
    setError(null)

    try {
      const res = await props.remote.generateDraft({
        kind: props.kind,
        prompt: text,
        messages,
      })

      if (!res.ok) {
        throw new Error(res.error.message)
      }

      const val = res.value
      if (!val.ok) {
        throw new Error(val.error ?? props.t('error.operationFailed'))
      }

      if (props.kind === 'expert' && val.expertDraft) {
        setExpertDraft(val.expertDraft)
        setMessages(prev => [
          ...prev,
          { role: 'user', content: text },
          { role: 'assistant', content: props.t('creation.generatedReply') },
        ])
        setPrompt('')
      } else if (props.kind === 'team' && val.teamDraft) {
        setTeamDraft(val.teamDraft)
        if (val.memberReasons) {
          setMemberReasons(val.memberReasons)
        }
        setMessages(prev => [
          ...prev,
          { role: 'user', content: text },
          { role: 'assistant', content: props.t('creation.generatedReply') },
        ])
        setPrompt('')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  const handleApply = () => {
    if (props.kind === 'expert' && expertDraft) {
      props.onApplyExpert(expertDraft)
    } else if (props.kind === 'team' && teamDraft) {
      props.onApplyTeam(teamDraft, memberReasons)
    }
  }

  const title = props.kind === 'expert'
    ? props.t('creation.titleExpert')
    : props.t('creation.titleTeam')

  const placeholder = props.kind === 'expert'
    ? props.t('creation.promptPlaceholderExpert')
    : props.t('creation.promptPlaceholderTeam')

  const divisionName = (key: string): string => {
    const dict = props.locale === 'en' ? EN_DIVISION : ZH_DIVISION
    return dict[key] ?? key
  }

  return (
    <Modal
      open
      title={title}
      className="aag-editor-modal"
      contentClassName="aag-editor-modal-content"
      onCancel={() => { if (!busy) props.onClose() }}
      footer={[
        <Button key="cancel" variant="outline" disabled={busy} onClick={props.onClose}>
          {props.t('creation.discard')}
        </Button>,
        <Button
          key="apply"
          variant="primary"
          disabled={!hasDraft || busy}
          onClick={handleApply}
        >
          {props.t('creation.useDraft')}
        </Button>,
      ]}
    >
      <div className="aag-custom-body">
        <p className="aag-editor-intro" style={{ marginBottom: 12 }}>
          {props.t('creation.tokenNotice')}
        </p>

        <div className="aag-custom-field">
          <label htmlFor="creation-user-prompt">
            <span>{hasDraft ? props.t('creation.refinePrompt') : props.t('creation.inputPrompt')}</span>
          </label>
          <textarea
            id="creation-user-prompt"
            className="aag-creation-textarea"
            style={{
              width: '100%',
              minHeight: 88,
              padding: '8px 10px',
              boxSizing: 'border-box',
              borderRadius: 'var(--dsw-radius-md, 6px)',
              background: 'var(--dsw-alias-input-bg, transparent)',
              border: '1px solid var(--dsw-alias-input-border, rgba(255,255,255,0.15))',
              color: 'var(--dsw-alias-label-primary, currentColor)',
              fontFamily: 'inherit',
              fontSize: 13,
              lineHeight: 1.5,
              resize: 'vertical',
            }}
            placeholder={placeholder}
            value={prompt}
            disabled={busy}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                void handleGenerate()
              }
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button
            variant="outline"
            disabled={!prompt.trim() || busy}
            loading={busy}
            onClick={() => void handleGenerate()}
          >
            {hasDraft ? props.t('creation.retry') : props.t('creation.generate')}
          </Button>
        </div>

        {error && (
          <div className="aag-error" role="alert" style={{ marginTop: 10 }}>
            {error}
          </div>
        )}

        {hasDraft && (
          <div
            className="aag-creation-preview"
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 'var(--dsw-radius-md, 8px)',
              background: 'var(--dsw-alias-bg-layer-1, rgba(255,255,255,0.04))',
              border: '1px solid var(--dsw-alias-border-l2, rgba(255,255,255,0.1))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>{props.t('creation.draftPreview')}</strong>
              <small style={{ color: 'var(--dsw-alias-label-tertiary, #888)' }}>
                {props.t('creation.adjustHint')}
              </small>
            </div>

            {props.kind === 'expert' && expertDraft && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{expertDraft.emoji}</span>
                  <strong>{expertDraft.name}</strong>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'var(--dsw-alias-bg-layer-2, rgba(255,255,255,0.08))',
                    }}
                  >
                    {divisionName(expertDraft.division)}
                  </span>
                </div>
                <p style={{ margin: '4px 0 8px', fontSize: 13, color: 'var(--dsw-alias-label-secondary, #aaa)' }}>
                  {expertDraft.description}
                </p>
                <details>
                  <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--dsw-alias-link, #4176e6)' }}>
                    {props.t('creation.viewPromptFull')}
                  </summary>
                  <pre
                    style={{
                      marginTop: 8,
                      padding: 8,
                      maxHeight: 160,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      fontSize: 12,
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 4,
                    }}
                  >
                    {expertDraft.prompt}
                  </pre>
                </details>
              </div>
            )}

            {props.kind === 'team' && teamDraft && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <strong>{teamDraft.name}</strong>
                  {teamDraft.tags.map(t => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'var(--dsw-alias-bg-layer-2, rgba(255,255,255,0.08))',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p style={{ margin: '4px 0 8px', fontSize: 13, color: 'var(--dsw-alias-label-secondary, #aaa)' }}>
                  {teamDraft.description}
                </p>
                <div style={{ marginTop: 8 }}>
                  <strong style={{ fontSize: 12 }}>
                    {props.t('creation.membersCover')} ({teamDraft.members.length}):
                  </strong>
                  <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12 }}>
                    {teamDraft.members.map(m => (
                      <li key={m.expertSlug} style={{ marginBottom: 4 }}>
                        <code>{m.expertSlug}</code>: {m.duty}
                        {memberReasons[m.expertSlug] && (
                          <span style={{ color: 'var(--dsw-alias-label-tertiary, #888)', marginLeft: 6 }}>
                            ({props.t('creation.reason')}: {memberReasons[m.expertSlug]})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
