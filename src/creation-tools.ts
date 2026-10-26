import { z } from 'zod'
import { customExpertInputSchema, type CustomExpertInput } from './expert-contract.js'
import { teamInputSchema, type TeamInput } from './team-contract.js'
import { ZH_DIVISION } from './names.js'

function generateProposalId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `prop-${crypto.randomUUID()}`
  }
  return `prop-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
}

export const storedProposalItemSchema = z.union([
  z.object({
    kind: z.literal('expert'),
    data: customExpertInputSchema,
    confirmed: z.boolean().optional(),
  }),
  z.object({
    kind: z.literal('team'),
    data: teamInputSchema,
    memberReasons: z.record(z.string(), z.string()).optional(),
    confirmed: z.boolean().optional(),
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
  save(proposal: StoredProposal): string
  get(id: string): StoredProposal | undefined
  delete(id: string): boolean
  getLatest(afterTimestamp: number): LatestProposal
  getLatestConfirmed(afterTimestamp: number): LatestProposal
  confirmLatest(): LatestProposal
}

export function createProposalRegistry(): ProposalRegistry {
  const store = new Map<string, { proposal: StoredProposal; expiresAt: number }>()
  let latest: { id: string; proposal: StoredProposal; timestamp: number } | null = null

  // 15 分钟有效期
  const TTL_MS = 15 * 60 * 1000

  const cleanup = () => {
    const now = Date.now()
    for (const [id, item] of store.entries()) {
      if (now > item.expiresAt) store.delete(id)
    }
  }

  return {
    save(proposal: StoredProposal): string {
      cleanup()
      const id = generateProposalId()
      const now = Date.now()
      store.set(id, { proposal, expiresAt: now + TTL_MS })
      latest = { id, proposal, timestamp: now }
      return id
    },
    get(id: string): StoredProposal | undefined {
      cleanup()
      return store.get(id)?.proposal
    },
    delete(id: string): boolean {
      return store.delete(id)
    },
    getLatest(afterTimestamp: number): LatestProposal {
      if (latest && latest.timestamp > afterTimestamp) {
        return latest
      }
      return null
    },
    getLatestConfirmed(afterTimestamp: number): LatestProposal {
      if (latest && latest.proposal.confirmed === true && latest.timestamp > afterTimestamp) {
        return latest
      }
      return null
    },
    confirmLatest(): LatestProposal {
      if (!latest) return null
      latest.proposal.confirmed = true
      latest.timestamp = Date.now()
      store.set(latest.id, { proposal: latest.proposal, expiresAt: Date.now() + TTL_MS })
      return latest
    },
  }
}

export function renderExpertProposalMarkdown(id: string, expert: CustomExpertInput): string {
  const divisionName = ZH_DIVISION[expert.division] ?? expert.division
  return [
    `### 🧩 专家草案预览：${expert.emoji} ${expert.name}`,
    `* **所属分类**：${divisionName}`,
    `* **一句话简介**：${expert.description}`,
    '',
    '<details>',
    '<summary>查看完整系统提示词（点击展开）</summary>',
    '',
    '```markdown',
    expert.prompt,
    '```',
    '</details>',
    '',
    `👉 **[点击直接在弹窗中核对并保存草案](#dsh-agency:apply-draft?id=${id})**`,
    '',
    '> 💬 **这是专家草案预览**。你可以仔细阅读核对：如果需要修改（如调整名字、增删提示词规则），请直接在对话中告诉我；如果你觉得满意，请对我说「**确认**」，我将弹出确认卡片并为您唤起全量填好的编辑抽屉！',
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
): string {
  const tagsStr = team.tags.length > 0 ? ` [${team.tags.join(' / ')}]` : ''
  const membersList = team.members
    .map(m => {
      const info = expertMap[m.expertSlug]
      const name = typeof info === 'object' ? info.name : typeof info === 'string' ? info : m.expertSlug
      const emoji = typeof info === 'object' && info.emoji ? `${info.emoji} ` : ''
      const reason = reasons[m.expertSlug] ? `（*入选理由*：${reasons[m.expertSlug]}）` : ''
      return `* ${emoji}**${name}**（\`${m.expertSlug}\`）：${m.duty}${reason}\n  *分工*：${m.instructions}`
    })
    .join('\n')

  return [
    `### 👥 专家团队草案预览：${team.name}${tagsStr}`,
    `* **定位简介**：${team.description}`,
    `* **团队目标**：${team.goal}`,
    `* **交付要求**：${team.deliveryRequirements}`,
    ...(team.constraints ? [`* **通用约束**：${team.constraints}`] : []),
    '',
    '**团队成员阵容**：',
    membersList,
    '',
    `👉 **[点击直接在弹窗中核对并保存草案](#dsh-agency:apply-draft?id=${id})**`,
    '',
    '> 💬 **这是专家团队草案预览**。你可以仔细阅读核对成员分工与目标：如果需要修改（如增减成员、调整分工），请直接在对话中告诉我；如果你觉得满意，请对我说「**确认**」，我将弹出确认卡片并为您唤起全量填好的编辑弹窗！',
  ].join('\n')
}
