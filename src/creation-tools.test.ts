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
})
