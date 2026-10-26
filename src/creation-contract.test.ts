import { describe, expect, it } from 'vitest'
import {
  creationRequestSchema,
  validateExpertProposal,
  validateTeamProposal,
  type CreationRequest,
} from './creation-contract.js'

describe('creation-contract', () => {
  describe('creationRequestSchema', () => {
    it('validates a basic creation request for expert', () => {
      const request: CreationRequest = {
        kind: 'expert',
        prompt: '创建一个专门审查 Rust 异步并发安全性的专家',
      }
      const parsed = creationRequestSchema.safeParse(request)
      expect(parsed.success).toBe(true)
    })

    it('validates a team creation request with history and previous draft', () => {
      const request: CreationRequest = {
        kind: 'team',
        prompt: '去掉产品角色，增加一名安全审计员',
        messages: [
          { role: 'user', content: '组建一个电商重构团队' },
          { role: 'assistant', content: '已为您推荐4人团队草案' },
        ],
      }
      const parsed = creationRequestSchema.safeParse(request)
      expect(parsed.success).toBe(true)
    })

    it('rejects empty or whitespace-only prompt', () => {
      const parsed = creationRequestSchema.safeParse({
        kind: 'expert',
        prompt: '   ',
      })
      expect(parsed.success).toBe(false)
    })

    it('rejects prompt exceeding character limit', () => {
      const parsed = creationRequestSchema.safeParse({
        kind: 'expert',
        prompt: 'a'.repeat(4001),
      })
      expect(parsed.success).toBe(false)
    })
  })

  describe('validateExpertProposal', () => {
    it('accepts valid expert proposal and normalizes defaults', () => {
      const proposal = {
        name: 'Rust并发安全专家',
        description: '专攻 Tokio 异步运行时死锁排查与取消安全性',
        division: 'engineering',
        emoji: '🦀',
        prompt: '你是一名专业的 Rust 异步并发安全工程师...',
      }
      const result = validateExpertProposal(proposal)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.name).toBe('Rust并发安全专家')
        expect(result.value.emoji).toBe('🦀')
        expect(result.value.avatar).toBe(0)
        expect(result.value.slug).toBeUndefined()
      }
    })

    it('rejects missing or empty required fields', () => {
      const result = validateExpertProposal({
        name: '',
        description: '测试',
        division: 'engineering',
        prompt: '提示词',
      })
      expect(result.ok).toBe(false)
    })

    it('rejects invalid or unknown division', () => {
      const result = validateExpertProposal({
        name: '神秘专家',
        description: '测试分类',
        division: 'invalid_division_xyz',
        prompt: '提示词',
      })
      expect(result.ok).toBe(false)
    })

    it('rejects name or description exceeding length bounds', () => {
      const result = validateExpertProposal({
        name: 'a'.repeat(41),
        description: '正常描述',
        division: 'engineering',
        prompt: '提示词',
      })
      expect(result.ok).toBe(false)
    })
  })

  describe('validateTeamProposal', () => {
    const mockKnownSlugs = new Set([
      'engineering-frontend-developer',
      'engineering-backend-architect',
      'security-code-auditor',
      'testing-qa-engineer',
    ])

    const validTeamProposal = {
      name: '微前端架构重构团',
      description: '负责单体微前端改造与安全审计',
      tags: ['架构重构', '安全审查'],
      goal: '平滑拆解现有单体应用，完成微前端架构改造并确保生产零事故。',
      constraints: '不擅自修改未授权模块，所有变更需具备测试用例。',
      deliveryRequirements: '输出架构演进蓝图、拆分阶段里程碑及安全排查清单。',
      members: [
        {
          expertSlug: 'engineering-frontend-developer',
          duty: '负责子应用加载与沙箱隔离实现',
          instructions: '重点分析样式隔离与全局状态同步方案。',
          reason: '核心前端工程能力',
        },
        {
          expertSlug: 'engineering-backend-architect',
          duty: '负责 BFF 网关与微服务契约对齐',
          instructions: '重点审查跨域鉴权与微服务路由分发。',
          reason: '后端架构设计',
        },
        {
          expertSlug: 'security-code-auditor',
          duty: '负责通信安全与 XSS 防御审计',
          instructions: '检查子应用跨域通信消息通道与敏感 Token 存储。',
          reason: '安全防线保障',
        },
      ],
      examples: ['请评估将主应用拆分为三套独立子应用的可行性与风险。'],
      coordinatorMode: 'template',
      coordinatorTemplateId: 'technical',
      coordinatorTemplateVersion: 1,
      coordinatorPrompt: '',
    }

    it('accepts valid team proposal and keeps member reasons', () => {
      const result = validateTeamProposal(validTeamProposal, mockKnownSlugs)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.name).toBe('微前端架构重构团')
        expect(result.value.members).toHaveLength(3)
        expect(result.memberReasons['engineering-frontend-developer']).toBe('核心前端工程能力')
        expect(result.value.id).toBeUndefined()
        expect(result.value.builtin).toBeUndefined()
      }
    })

    it('resolves member expert by Chinese name or short slug to real slug', () => {
      const mockCatalog = [
        { slug: 'product-manager', name: '产品经理', nameEn: 'Product Manager' },
        { slug: 'engineering-code-reviewer', name: '代码审查工程师', nameEn: 'Code Reviewer' },
        { slug: 'engineering-software-architect', name: '软件架构师', nameEn: 'Software Architect' },
      ]
      const proposalWithNames = {
        ...validTeamProposal,
        members: [
          { expertSlug: '产品经理', duty: '需求逻辑', instructions: '梳理逻辑' },
          { expertSlug: 'code-reviewer', duty: '代码质量', instructions: '审查代码' },
          { expertSlug: 'engineering-software-architect', duty: '架构技术', instructions: '架构评估' },
        ],
      }
      const result = validateTeamProposal(proposalWithNames, mockCatalog)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.members[0].expertSlug).toBe('product-manager')
        expect(result.value.members[1].expertSlug).toBe('engineering-code-reviewer')
        expect(result.value.members[2].expertSlug).toBe('engineering-software-architect')
      }
    })

    it('rejects member with nonexistent slug (hallucinated member)', () => {
      const invalidProposal = {
        ...validTeamProposal,
        members: [
          ...validTeamProposal.members.slice(0, 2),
          {
            expertSlug: 'hallucinated-expert-slug-12345',
            duty: '虚构职责',
            instructions: '虚构分工',
          },
        ],
      }
      const result = validateTeamProposal(invalidProposal, mockKnownSlugs)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toContain('hallucinated-expert-slug-12345')
      }
    })

    it('rejects team with duplicate member slugs', () => {
      const invalidProposal = {
        ...validTeamProposal,
        members: [
          validTeamProposal.members[0],
          validTeamProposal.members[0],
        ],
      }
      const result = validateTeamProposal(invalidProposal, mockKnownSlugs)
      expect(result.ok).toBe(false)
    })

    it('rejects team with fewer than 2 or more than 8 members', () => {
      const singleMemberProposal = {
        ...validTeamProposal,
        members: [validTeamProposal.members[0]],
      }
      expect(validateTeamProposal(singleMemberProposal, mockKnownSlugs).ok).toBe(false)
    })

    it('strips caller-supplied id or builtin flags to guarantee new draft semantics', () => {
      const hijacked = {
        ...validTeamProposal,
        id: 'team-product',
        builtin: true,
      }
      const result = validateTeamProposal(hijacked, mockKnownSlugs)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect((result.value as any).id).toBeUndefined()
        expect((result.value as any).builtin).toBeUndefined()
      }
    })
  })
})
