import type { Context } from '@deepseek-ai/cordis'
import { describe, expect, it, vi } from 'vitest'
import { apply } from './index.js'
import type { ProposalRegistry } from './creation-tools.js'

type Question = { id: string; question: string; header: string; options: { label: string; description: string }[] }
type Answer = { id: string; selected: string[]; custom?: string }
const expert = { name: 'Rascunho Ñ 专家', division: 'engineering', description: 'Literal description', prompt: 'Literal prompt. '.repeat(10), emoji: '🧩', avatar: 0 }
const team = { name: 'Rascunho Ñ 团队', description: 'Literal description', tags: [], constraints: '', goal: 'Literal goal', deliveryRequirements: 'Literal requirements', examples: ['Literal example'], members: [{ expertSlug: 'one', duty: 'First duty', instructions: 'First task' }, { expertSlug: 'two', duty: 'Second duty', instructions: 'Second task' }], coordinatorMode: 'template' as const, coordinatorTemplateId: 'general' as const, coordinatorTemplateVersion: 1 as const, coordinatorPrompt: '' }
const session = { agent: { session: { id: 'session-a' } } }

function fixture(initial = 'en', interactive = true) {
  let locale = initial
  const ask = vi.fn<(request: { questions: Question[] }) => Promise<{ answers: Answer[] }>>()
  const services = new Map<string, unknown>(interactive ? [['userQuestions', { ask }]] : [])
  const tools = new Map<string, { execute(args: unknown, exec?: unknown): Promise<{ success: boolean; message: string; markdown: string }> }>()
  const ctx = {
    settings: { get: (key: string) => key === 'locale' ? { preference: locale } : undefined, describe: () => [{ ns: 'agency-agents', revision: 0 }] },
    effect: () => () => {}, on: () => () => {}, inject: () => {},
    reflect: { provide: (key: string, value: unknown) => services.set(key, value) },
    get: (key: string) => services.get(key),
    tools: { register: (tool: { name: string; execute: NonNullable<ReturnType<typeof tools.get>>['execute'] }) => tools.set(tool.name, tool) },
    systemPrompt: { section: () => {} },
  } as unknown as Context
  apply(ctx, { root: '', provider: 'spawn', divisions: ['engineering'], enabled: { get: () => [] } } as never)
  return { ask, registry: services.get('agencyProposalRegistry') as ProposalRegistry,
    open: (kind: 'expert' | 'team', exec: unknown = session) => tools.get(kind === 'expert' ? 'open_custom_expert_editor' : 'open_expert_team_editor')!.execute({}, exec),
    preview: () => tools.get('propose_custom_expert')!.execute(expert, session),
    propose: (kind: 'expert' | 'team', args: unknown) => tools.get(kind === 'expert' ? 'propose_custom_expert' : 'propose_expert_team')!.execute(args, session),
    setLocale: (value: string) => { locale = value }, }
}

const labels = [
  ['pt-BR', '✅ Abrir editor agora', 'Prévia do rascunho do especialista'],
  ['es-MX', '✅ Abrir el editor ahora', 'Vista previa del borrador del experto'],
  ['en', '✅ Open editor now', 'Expert draft preview'],
  ['zh', '✅ 立即打开编辑窗口反显写入', '专家草案预览'],
] as const

describe('registered propose tools report localized structured reasons', () => {
  it.each([
    ['pt-BR', 'A área “Ω-division” não existe (division).', 'O especialista “Ω-inexistente” não está no catálogo (members.0.expertSlug).', 'Campo “name” inválido'],
    ['es-MX', 'El área «Ω-division» no existe (division).', 'El experto «Ω-inexistente» no está en el catálogo (members.0.expertSlug).', 'Campo «name» no válido'],
    ['en', 'Division “Ω-division” does not exist (division).', 'Expert “Ω-inexistente” is not in the catalog (members.0.expertSlug).', 'Invalid field “name”'],
    ['zh', '专家分类「Ω-division」不存在（division）。', '专家成员「Ω-inexistente」不存在于当前专家库中（members.0.expertSlug）。', '字段「name」不合法'],
  ])('%s preserves invalid values and paths without untranslated Agency reasons', async (locale, division, member, field) => {
    const f = fixture(locale)
    const outcomes = await Promise.allSettled([
      f.propose('expert', { ...expert, division: 'Ω-division' }),
      f.propose('team', { ...team, constraints: 'Literal constraints', members: [{ ...team.members[0], expertSlug: 'Ω-inexistente' }, team.members[1]] }),
      f.propose('expert', { ...expert, name: '' }),
    ])
    expect(outcomes).toEqual([division, member, field].map(text => ({ status: 'rejected', reason: expect.objectContaining({ message: expect.stringContaining(text) }) })))
    expect(f.registry.getLatest(0, 'session-a')).toBeNull()
  })
})

describe('creation tool confirmation through the registered host tools', () => {
  it.each(labels)('%s freezes the emitted label across a locale change for both kinds', async (locale, label, preview) => {
    const f = fixture(locale)
    expect((await f.preview()).markdown).toContain(preview)
    for (const proposal of [{ kind: 'expert', data: expert }, { kind: 'team', data: team }] as const) {
      f.setLocale(locale)
      const id = f.registry.save(proposal, 'session-a')
      f.ask.mockImplementationOnce(async ({ questions: [q] }) => {
        f.setLocale(locale === 'es-MX' ? 'en' : 'es-MX')
        return { answers: [{ id: q.id, selected: [label] }] }
      })
      const result = await f.open(proposal.kind)
      const q = f.ask.mock.lastCall?.[0].questions[0]
      expect(q?.question).toContain(proposal.data.name)
      expect(q?.options[0]?.label).toBe(label)
      expect(q?.id).toContain(id)
      expect(result).toMatchObject({ success: true })
      expect(f.registry.get(id)?.confirmed).toBe(true)
    }
  })

  it.each(['decline', 'skip', 'other-language', 'other-id', 'multi', 'custom', 'revised', 'revised-then-deleted', 'expired', 'aborted'] as const)('does not confirm on %s', async outcome => {
    const f = fixture()
    const id = f.registry.save({ kind: 'expert', data: expert }, 'session-a')
    let newer: string | undefined
    const abort = new AbortController()
    f.ask.mockImplementationOnce(async ({ questions: [q] }) => {
      if (outcome === 'revised' || outcome === 'revised-then-deleted') {
        newer = f.registry.save({ kind: 'team', data: team }, 'session-a')
        if (outcome === 'revised-then-deleted') f.registry.delete(newer)
      }
      if (outcome === 'expired') f.registry.delete(id)
      if (outcome === 'aborted') abort.abort()
      return { answers: [{ id: outcome === 'other-id' ? 'unrelated' : q.id, selected:
        outcome === 'decline' ? [q.options[1].label] : outcome === 'skip' ? [] : outcome === 'multi' ? q.options.map(o => o.label) :
        outcome === 'other-language' ? ['✅ 立即打开编辑窗口反显写入'] : [q.options[0].label],
        ...(outcome === 'custom' ? { custom: q.options[0].label } : {}), }] }
    })
    expect(await f.open('expert', { ...session, signal: abort.signal })).toMatchObject({ success: false })
    expect(f.registry.get(id)?.confirmed).not.toBe(true)
    expect(newer && f.registry.get(newer)?.confirmed).not.toBe(true)
  })

  it('fails closed without interaction or an exactly matching session', async () => {
    const f = fixture('en', false)
    const id = f.registry.save({ kind: 'expert', data: expert }, 'session-a')
    expect(await f.open('expert')).toMatchObject({ success: false })
    expect(f.registry.get(id)?.confirmed).not.toBe(true)
    const interactive = fixture()
    interactive.registry.save({ kind: 'expert', data: expert }, 'session-b')
    interactive.registry.save({ kind: 'expert', data: expert })
    expect(await interactive.open('expert')).toMatchObject({ success: false })
    expect(await interactive.open('expert', {})).toMatchObject({ success: false })
    expect(interactive.ask).not.toHaveBeenCalled()
  })
})
