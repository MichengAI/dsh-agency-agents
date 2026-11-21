import { z } from 'zod'
import { customExpertInputSchema, type CustomExpertInput } from './expert-contract.js'
import { teamInputSchema, type TeamInput } from './team-contract.js'
import type { AgencyLocale } from './agency-locale.js'
import { ZH_DIVISION, EN_DIVISION } from './names.js'
import { ES_DIVISION, PT_DIVISION } from './host-locales.js'
import { draftActionLink, draftCopy } from './creation-locale.js'

function generateProposalId(): string {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
  return `prop-${btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')}`
}

export const storedProposalItemSchema = z.union([
  z.object({
    kind: z.literal('expert'),
    data: customExpertInputSchema,
    confirmed: z.boolean().optional(),
    sessionId: z.string().optional(),
  }),
  z.object({
    kind: z.literal('team'),
    data: teamInputSchema,
    memberReasons: z.record(z.string(), z.string()).optional(),
    confirmed: z.boolean().optional(),
    sessionId: z.string().optional(),
  }),
])

export const storedProposalSchema = storedProposalItemSchema.nullable()

export type StoredProposal = z.infer<typeof storedProposalItemSchema>

export const latestProposalSchema = z.object({
  id: z.string(),
  proposal: storedProposalItemSchema,
  timestamp: z.number(),
}).nullable()

export type LatestProposal = z.infer<typeof latestProposalSchema>

export interface ProposalRegistry {
  save(proposal: StoredProposal, sessionId?: string): string
  get(id: string): StoredProposal | undefined
  delete(id: string): boolean
  getLatest(afterTimestamp: number, sessionId?: string): LatestProposal
  getLatestConfirmed(afterTimestamp: number, sessionId?: string): LatestProposal
  confirmLatest(sessionId?: string): LatestProposal
  confirm(id: string, sessionId: string): boolean
}

interface ProposalEntry {
  readonly id: string
  readonly proposal: StoredProposal
  timestamp: number
  expiresAt: number
  superseded?: true
}

export function createProposalRegistry(): ProposalRegistry {
  const store = new Map<string, ProposalEntry>()

  // 15 分钟有效期
  const TTL_MS = 15 * 60 * 1000

  const cleanup = () => {
    const now = Date.now()
    for (const [id, item] of store.entries()) {
      if (now > item.expiresAt) store.delete(id)
    }
  }

  const matchSession = (entry: ProposalEntry, sessionId?: string): boolean => {
    return entry.proposal.sessionId === sessionId
  }

  return {
    save(proposal: StoredProposal, sessionId?: string): string {
      cleanup()
      const id = generateProposalId()
      const now = Date.now()
      if (sessionId) {
        for (const entry of store.values()) {
          if (matchSession(entry, sessionId)) {
            entry.superseded = true
            entry.proposal.confirmed = false
          }
        }
      }
      store.set(id, { id, proposal: { ...proposal, ...(sessionId ? { sessionId } : {}) }, timestamp: now, expiresAt: now + TTL_MS })
      return id
    },
    get(id: string): StoredProposal | undefined {
      cleanup()
      const entry = store.get(id)
      return entry?.superseded ? undefined : entry?.proposal
    },
    delete(id: string): boolean {
      return store.delete(id)
    },
    getLatest(afterTimestamp: number, sessionId?: string): LatestProposal {
      cleanup()
      let best: ProposalEntry | null = null
      for (const entry of store.values()) {
        if (!entry.superseded && entry.timestamp > afterTimestamp && matchSession(entry, sessionId)) {
          if (!best || entry.timestamp >= best.timestamp) {
            best = entry
          }
        }
      }
      return best ? { id: best.id, proposal: best.proposal, timestamp: best.timestamp } : null
    },
    getLatestConfirmed(afterTimestamp: number, sessionId?: string): LatestProposal {
      cleanup()
      let best: ProposalEntry | null = null
      for (const entry of store.values()) {
        if (entry.proposal.confirmed === true && entry.timestamp > afterTimestamp && matchSession(entry, sessionId)) {
          if (!best || entry.timestamp >= best.timestamp) {
            best = entry
          }
        }
      }
      return best ? { id: best.id, proposal: best.proposal, timestamp: best.timestamp } : null
    },
    confirm(id: string, sessionId: string): boolean {
      const latest = this.getLatest(0, sessionId)
      if (!latest || latest.id !== id || latest.proposal.confirmed === true) return false
      latest.proposal.confirmed = true
      return true
    },
    confirmLatest(sessionId?: string): LatestProposal {
      cleanup()
      let best: ProposalEntry | null = null
      for (const entry of store.values()) {
        if (!entry.superseded && matchSession(entry, sessionId)) {
          if (!best || entry.timestamp >= best.timestamp) {
            best = entry
          }
        }
      }
      if (!best) return null
      best.proposal.confirmed = true
      best.timestamp = Date.now()
      best.expiresAt = best.timestamp + TTL_MS
      return { id: best.id, proposal: best.proposal, timestamp: best.timestamp }
    },
  }
}

export function renderExpertProposalMarkdown(id: string, expert: CustomExpertInput, locale: AgencyLocale = 'zh'): string {
  const copy = draftCopy(locale)
  const labels: Readonly<Record<string, string>> = { zh: ZH_DIVISION, en: EN_DIVISION, pt: PT_DIVISION, es: ES_DIVISION }[locale]
  const divisionName = Object.hasOwn(labels, expert.division) ? labels[expert.division] : expert.division
  const colon = locale === 'zh' ? '：' : ': '
  return [
    `### 🧩 ${copy.expertPreview}${colon}${expert.emoji} ${expert.name}`,
    `* **${copy.division}**${colon}${divisionName}`,
    `* **${copy.summary}**${colon}${expert.description}`,
    '',
    '<details>',
    `<summary>${copy.prompt}</summary>`,
    '',
    '```markdown',
    expert.prompt,
    '```',
    '</details>',
    '',
    `👉 **[${copy.previewLink}](${draftActionLink(id)})**`,
    '',
    `> 💬 ${copy.previewHelp}`,
  ].join('\n')
}

export interface LocalizedExpertInfo {
  readonly name: string
  readonly emoji?: string
}

export function renderTeamProposalMarkdown(
  id: string,
  team: TeamInput,
  reasons: Record<string, string> = {},
  expertMap: Record<string, LocalizedExpertInfo | string> = {},
  locale: AgencyLocale = 'zh',
): string {
  const copy = draftCopy(locale)
  const [left, right, colon] = locale === 'zh' ? ['（', '）', '：'] : [' (', ')', ': ']
  const tagsStr = team.tags.length > 0 ? ` [${team.tags.join(' / ')}]` : ''
  const membersList = team.members
    .map(m => {
      const info = expertMap[m.expertSlug]
      const name = typeof info === 'object' ? info.name : typeof info === 'string' ? info : m.expertSlug
      const emoji = typeof info === 'object' && info.emoji ? `${info.emoji} ` : ''
      const reason = reasons[m.expertSlug] ? `${left}*${copy.reason}*${colon}${reasons[m.expertSlug]}${right}` : ''
      return `* ${emoji}**${name}**${left}\`${m.expertSlug}\`${right}${colon}${m.duty}${reason}\n  *${copy.assignment}*${colon}${m.instructions}`
    })
    .join('\n')

  return [
    `### 👥 ${copy.teamPreview}${colon}${team.name}${tagsStr}`,
    `* **${copy.description}**${colon}${team.description}`,
    `* **${copy.goal}**${colon}${team.goal}`,
    `* **${copy.delivery}**${colon}${team.deliveryRequirements}`,
    ...(team.constraints ? [`* **${copy.constraints}**${colon}${team.constraints}`] : []),
    '',
    `**${copy.members}**${colon.trimEnd()}`,
    membersList,
    '',
    `👉 **[${copy.previewLink}](${draftActionLink(id)})**`,
    '',
    `> 💬 ${copy.previewHelp}`,
  ].join('\n')
}
