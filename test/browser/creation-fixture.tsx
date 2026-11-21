import React from 'react'
import { installDraftInteractions } from '../../src/client/index'
import type { AgencyAgentsRemoteApi } from '../../src/client/index'
import { renderExpertProposalMarkdown, renderTeamProposalMarkdown, type StoredProposal } from '../../src/creation-tools'
import { MarkdownText } from './creation-markdown-fixture'
const markdownLabels = { code: { copyLabel: 'Copy', copiedLabel: 'Copied' }, footnotes: 'Footnotes' }
import { en, es, pt, zh } from '../../src/client/locales'

const positive = { pt: '✅ Abrir editor agora', es: '✅ Abrir el editor ahora', en: '✅ Open editor now', zh: '✅ 立即打开编辑窗口反显写入' }
const negative = { pt: '✏️ Continuar editando na conversa', es: '✏️ Seguir editando en la conversación', en: '✏️ Keep editing in chat', zh: '✏️ 留在当前对话继续修改调整' }
const draftId = 'prop-0123456789abcdefghij_-'
const expert = { name: 'Unchanged Ñ 资料', division: 'engineering', description: 'Unchanged brief', prompt: 'Unchanged prompt. '.repeat(10), emoji: '🧩', avatar: 0 }
const team = { name: expert.name, description: expert.description, tags: [], constraints: '', goal: 'Unchanged goal', deliveryRequirements: 'Unchanged requirements', examples: ['Unchanged example'], members: [{ expertSlug: 'one', duty: 'One duty', instructions: 'One task' }, { expertSlug: 'two', duty: 'Two duty', instructions: 'Two task' }], coordinatorMode: 'template' as const, coordinatorTemplateId: 'general' as const, coordinatorTemplateVersion: 1 as const, coordinatorPrompt: '' }

export function CreationFixture() {
  const params = new URLSearchParams(location.search)
  const locale = (params.get('locale') ?? 'en') as keyof typeof positive
  const kind = params.get('kind') === 'team' ? 'team' : 'expert'
  const answer = React.useRef<string | null>(null)
  const replaced = React.useRef(false)
  const current = React.useRef('session-a')
  const listeners = React.useRef(new Set<() => void>())
  const changeSession = (id: string) => {
    current.current = id
    for (const listener of listeners.current) listener()
  }
  const [gate] = React.useState(() => {
    if (!params.has('deferred')) return undefined
    let release!: () => void
    const promise = new Promise<void>(resolve => { release = resolve })
    return { promise, release }
  })
  const [loads, setLoads] = React.useState(0)
  const [released, setReleased] = React.useState(false)
  const [selection, setSelection] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [saved, setSaved] = React.useState('')
  const [requests, setRequests] = React.useState(0)
  const proposal: StoredProposal = { ...(kind === 'expert' ? { kind, data: expert } : { kind, data: team }), sessionId: params.has('foreign') ? 'session-b' : 'session-a' }
  const dictionaries = { en, es, pt, zh }
  const dict = dictionaries[locale] as Record<string, string>
  React.useEffect(() => {
    const ok = <T,>(value: T) => ({ ok: true as const, value })
    const experts = ['one', 'two'].map(slug => ({ slug, name: slug, nameEn: slug, description: '', descriptionEn: '', division: 'engineering', divisionZh: '工程', emoji: '🧩', custom: false }))
    const catalog = { revision: 3, experts, enabled: ['one', 'two'] }
    const remote = {
      async getPendingProposal(id: string) {
        setRequests(n => n + 1)
        return ok(id === draftId && !replaced.current ? { ...proposal, confirmed: answer.current === positive[locale] && !params.has('stale') } : null)
      },
      async getCatalog() { setLoads(n => n + 1); await gate?.promise; setReleased(true); return ok(catalog) },
      async getTeams() { return ok({ revision: 7, teams: [], enabledTeams: [], enabledExperts: ['one', 'two'] }) },
      async saveCustomExpert(value: unknown, enabled: boolean, revision: number) { setSaved(JSON.stringify({ value, enabled, revision })); return ok(catalog) },
      async saveTeam(value: unknown, enabled: boolean, revision: number) { setSaved(JSON.stringify({ value, enabled, revision })); return ok(null) },
    } as unknown as AgencyAgentsRemoteApi
    return installDraftInteractions({ remote, getSessionId: () => current.current, subscribeSession: listener => { listeners.current.add(listener); return () => { listeners.current.delete(listener) } }, getLocale: () => locale, t: key => dict[key] ?? key })
  }, [])
  const submit = (label: string | null) => {
    answer.current = label
    if (params.has('switch')) changeSession('session-c')
    setSubmitted(true)
  }
  return <>
    {params.has('markdown') ? <MarkdownText labels={markdownLabels} text={kind === 'expert' ? renderExpertProposalMarkdown(draftId, expert, locale) : renderTeamProposalMarkdown(draftId, team, {}, {}, locale)} /> : <a href={`dsh-agency:apply-draft?id=${draftId}`}>Manual preview</a>}
    <button onClick={() => { changeSession('session-b') }}>Other session</button>
    <button onClick={() => { changeSession('session-a') }}>Original session</button>
    <button onClick={() => { replaced.current = true }}>Replace draft</button>
    <button onClick={() => gate?.release()}>Release catalog</button>
    <output aria-label="Catalog loads">{loads}</output>
    <output aria-label="Catalog released">{String(released)}</output>
    {!submitted && <div data-question-key="fixture-key"><section aria-labelledby="question-fixture-key-0">
      <h2 id="question-fixture-key-0">Fixture question</h2>
      {!params.has('unrelated') && <p><code>{`Agency:${kind}:${draftId}`}</code></p>}
      <div role="radiogroup">{[positive[locale], negative[locale]].map(label => <div data-option-row key={label}>
        <button role="radio" aria-label={label} aria-checked={selection === label} onClick={() => setSelection(label)} onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); if (selection) submit(selection) } }}>{label}</button>
        <button aria-expanded="false" type="button">Details</button>
      </div>)}</div>
      <footer><div><button onClick={() => submit(null)}>Skip fixture</button><button onClick={() => submit(selection)} disabled={!selection}>Submit fixture</button></div></footer>
    </section></div>}
    <output aria-label="Confirmed read calls">{requests}</output>
    <output aria-label="Saved draft">{saved}</output>
  </>
}
