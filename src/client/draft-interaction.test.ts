import { describe, expect, it, vi } from 'vitest'
import { fetchConfirmedDraft, withTimeout } from './index.js'
import type { StoredProposal } from '../creation-tools.js'

const proposal: StoredProposal = { kind: 'expert', sessionId: 'session-a', confirmed: true, data: { name: 'Exact draft', description: 'Description', division: 'engineering', emoji: '🧩', avatar: 0, prompt: 'Prompt' } }
const ok = <T>(value: T) => ({ ok: true as const, value })
const options = { sessionId: 'session-a', kind: 'expert' as const, isCurrent: () => true, delayMs: 0, timeoutMs: 10 }

describe('bounded exact proposal read after card submit', () => {
  it('times out hung remote calls, then allows a later confirmation', async () => {
    const hung = new Promise<never>(() => {})
    await expect(withTimeout(hung, 10, 'timeout')).rejects.toThrow('timeout')
    const read = vi.fn<() => Promise<ReturnType<typeof ok<StoredProposal | null>>>>().mockReturnValue(hung)
    expect(await fetchConfirmedDraft({ ...options, read, maxAttempts: 2 })).toBeUndefined()
    expect(read).toHaveBeenCalledTimes(2)
    read.mockResolvedValue(ok(proposal))
    expect(await fetchConfirmedDraft({ ...options, read })).toEqual(proposal)
  })

  it('waits for server confirmation and never returns an unconfirmed draft', async () => {
    const read = vi.fn().mockResolvedValue(ok({ ...proposal, confirmed: false }))
    expect(await fetchConfirmedDraft({ ...options, read })).toBeUndefined()
    expect(read).toHaveBeenCalledTimes(4)
    read.mockResolvedValueOnce(ok(null)).mockResolvedValueOnce(ok(proposal))
    expect(await fetchConfirmedDraft({ ...options, read })).toEqual(proposal)
  })

  it('rejects a different session, kind or navigation during the read', async () => {
    const foreign = vi.fn(async () => ok({ ...proposal, sessionId: 'session-b' }))
    expect(await fetchConfirmedDraft({ ...options, read: foreign })).toBeUndefined()
    expect(foreign).toHaveBeenCalledTimes(1)
    const wrongKind = vi.fn(async () => ok(proposal))
    expect(await fetchConfirmedDraft({ ...options, kind: 'team', read: wrongKind })).toBeUndefined()
    let current = true
    const read = vi.fn(async () => { current = false; return ok(proposal) })
    expect(await fetchConfirmedDraft({ ...options, read, isCurrent: () => current })).toBeUndefined()
    expect(read).toHaveBeenCalledTimes(1)
  })
})
