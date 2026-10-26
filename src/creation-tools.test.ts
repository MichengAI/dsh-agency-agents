import { describe, expect, it } from 'vitest'
import {
  createProposalRegistry,
  renderExpertProposalMarkdown,
  renderTeamProposalMarkdown,
} from './creation-tools.js'

describe('creation-tools', () => {
  it('stores and retrieves pending proposals by id', () => {
    const registry = createProposalRegistry()
    const proposal = {
      kind: 'expert' as const,
      data: {
        name: 'Rust并发安全专家',
        description: '专攻 Tokio 异步死锁与取消安全',
        division: 'engineering',
        emoji: '🦀',
        prompt: '你是一名专业的 Rust 异步并发安全专家...',
        avatar: 0,
      },
    }

    const id = registry.save(proposal)
    expect(id).toMatch(/^prop-[a-f0-9-]+$/)

    const retrieved = registry.get(id)
    expect(retrieved).toEqual(proposal)

    expect(registry.get('nonexistent-id')).toBeUndefined()
  })

  it('renders expert proposal markdown with preview and action link', () => {
    const md = renderExpertProposalMarkdown('prop-1234', {
      name: 'Rust并发安全专家',
      description: '专攻 Tokio 异步死锁',
      division: 'engineering',
      emoji: '🦀',
      prompt: '系统提示词正文...',
      avatar: 0,
    })

    expect(md).toContain('Rust并发安全专家')
    expect(md).toContain('🦀')
    expect(md).toContain('#dsh-agency:apply-draft?id=prop-1234')
  })

  it('renders team proposal markdown with roster and action link', () => {
    const md = renderTeamProposalMarkdown(
      'prop-5678',
      {
        name: '微前端架构重构团',
        description: '负责单体微前端改造',
        tags: ['架构重构'],
        goal: '平滑拆解单体应用',
        constraints: '不破坏主干',
        deliveryRequirements: '输出重构蓝图',
        members: [
          {
            expertSlug: 'engineering-frontend-developer',
            duty: '子应用加载',
            instructions: '沙箱隔离',
          },
        ],
        examples: ['评估微前端改造'],
        coordinatorMode: 'template',
        coordinatorTemplateId: 'technical',
        coordinatorTemplateVersion: 1,
        coordinatorPrompt: '',
      },
      { 'engineering-frontend-developer': '负责前端工程落地' }
    )

    expect(md).toContain('微前端架构重构团')
    expect(md).toContain('engineering-frontend-developer')
    expect(md).toContain('负责前端工程落地')
    expect(md).toContain('#dsh-agency:apply-draft?id=prop-5678')
  })

  it('tracks latest proposal for auto-popup sensing', () => {
    const registry = createProposalRegistry()
    const proposal = {
      kind: 'expert' as const,
      data: {
        name: '小红书运营专家',
        description: '负责全流程运营',
        division: 'marketing',
        emoji: '📕',
        prompt: '提示词正文...',
        avatar: 0,
      },
    }

    const t0 = Date.now() - 100
    expect(registry.getLatest(t0)).toBeNull()

    const id = registry.save(proposal)
    const latest = registry.getLatest(t0)
    expect(latest).not.toBeNull()
    expect(latest?.id).toBe(id)
    expect(latest?.proposal).toEqual(proposal)
    expect(latest?.timestamp).toBeGreaterThanOrEqual(t0)

    // 查询当前时间戳之后的，应为 null
    expect(registry.getLatest(latest!.timestamp + 1000)).toBeNull()
  })

  it('only returns confirmed proposals via getLatestConfirmed', () => {
    const registry = createProposalRegistry()
    const draft = {
      kind: 'expert' as const,
      data: {
        name: '待打磨专家',
        description: '仍在多轮修改中',
        division: 'marketing',
        emoji: '📕',
        prompt: '正文...',
        avatar: 0,
      },
      confirmed: false,
    }
    const t0 = Date.now() - 100
    registry.save(draft)
    expect(registry.getLatestConfirmed(t0)).toBeNull()

    const confirmedProposal = { ...draft, confirmed: true }
    const id = registry.save(confirmedProposal)
    const latest = registry.getLatestConfirmed(t0)
    expect(latest).not.toBeNull()
    expect(latest?.id).toBe(id)
    expect(latest?.proposal.confirmed).toBe(true)
  })

  it('confirms the latest draft via confirmLatest', () => {
    const registry = createProposalRegistry()
    const draft = {
      kind: 'expert' as const,
      data: {
        name: '待打磨专家',
        description: '多轮对话中',
        division: 'marketing',
        emoji: '📕',
        prompt: '提示词正文...',
        avatar: 0,
      },
      confirmed: false,
    }
    const t0 = Date.now() - 100
    registry.save(draft)
    expect(registry.getLatestConfirmed(t0)).toBeNull()

    const confirmed = registry.confirmLatest()
    expect(confirmed).not.toBeNull()
    expect(confirmed?.proposal.confirmed).toBe(true)

    const latest = registry.getLatestConfirmed(t0)
    expect(latest).not.toBeNull()
    expect(latest?.proposal.confirmed).toBe(true)
  })
})
