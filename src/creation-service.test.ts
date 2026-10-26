import { describe, expect, it, vi } from 'vitest'
import { createCreationService } from './creation-service.js'
import type { CatalogSnapshot } from './expert-contract.js'

describe('creation-service', () => {
  const mockCatalog: CatalogSnapshot = {
    revision: 1,
    enabled: ['engineering-frontend-developer', 'security-code-auditor'],
    experts: [
      {
        slug: 'engineering-frontend-developer',
        name: '前端开发专家',
        nameEn: 'Frontend Developer',
        division: 'engineering',
        divisionZh: '工程',
        description: '负责前端组件架构与交互开发',
        descriptionEn: 'Frontend engineering',
        emoji: '💻',
        custom: false,
      },
      {
        slug: 'security-code-auditor',
        name: '代码安全审计师',
        nameEn: 'Code Auditor',
        division: 'security',
        divisionZh: '安全',
        description: '负责漏洞挖掘与安全审查',
        descriptionEn: 'Security audit',
        emoji: '🛡️',
        custom: false,
      },
    ],
  }

  const getCatalog = vi.fn(async () => mockCatalog)

  it('returns graceful error when llm runtime is not available', async () => {
    const service = createCreationService({
      getCatalog,
      getLlmRuntime: () => undefined,
    })

    const result = await service.generateDraft({
      kind: 'expert',
      prompt: '创建一个前端专家',
    })

    expect(result.ok).toBe(false)
    expect(result.error).toContain('模型服务不可用')
  })

  it('successfully generates expert draft with mock llm response', async () => {
    const mockLlm = {
      listProviders: () => [{ id: 'mock-provider', name: 'Mock' }],
      listModels: async () => [{ id: 'mock-model', name: 'Mock Model' }],
      prepareCall: async () => ({
        stream: async function* () {
          yield {
            type: 'content',
            delta: JSON.stringify({
              name: 'React 性能优化专家',
              description: '专注大体积单页应用渲染性能优化',
              division: 'engineering',
              emoji: '⚡',
              prompt: '你是一位顶尖的 React 性能优化工程师...',
            }),
          }
        },
      }),
    }

    const service = createCreationService({
      getCatalog,
      getLlmRuntime: () => mockLlm as any,
    })

    const result = await service.generateDraft({
      kind: 'expert',
      prompt: '需要一位优化 React 渲染耗时的专家',
    })

    expect(result.ok).toBe(true)
    expect(result.expertDraft?.name).toBe('React 性能优化专家')
    expect(result.expertDraft?.division).toBe('engineering')
    expect(result.expertDraft?.prompt).toContain('React 性能优化')
  })

  it('successfully generates team draft with member reasons and real slugs', async () => {
    const mockLlm = {
      listProviders: () => [{ id: 'mock-provider', name: 'Mock' }],
      listModels: async () => [{ id: 'mock-model', name: 'Mock Model' }],
      prepareCall: async () => ({
        stream: async function* () {
          yield {
            type: 'content',
            delta: JSON.stringify({
              name: '前端与安全联调团',
              description: '负责前端研发与安全防御审计',
              tags: ['前端', '安全'],
              goal: '保障前端上线质量与防御 XSS 攻击。',
              constraints: '不引入未授权外部依赖。',
              deliveryRequirements: '输出组件实现与安全审计报告。',
              members: [
                {
                  expertSlug: 'engineering-frontend-developer',
                  duty: '组件实现',
                  instructions: '编写高质量 React 组件。',
                  reason: '负责 UI 开发',
                },
                {
                  expertSlug: 'security-code-auditor',
                  duty: '安全检查',
                  instructions: '审查是否存在危险 DOM 操作。',
                  reason: '负责安全防线',
                },
              ],
              examples: ['审查新版登录组件'],
              coordinatorMode: 'template',
              coordinatorTemplateId: 'technical',
              coordinatorTemplateVersion: 1,
              coordinatorPrompt: '',
            }),
          }
        },
      }),
    }

    const service = createCreationService({
      getCatalog,
      getLlmRuntime: () => mockLlm as any,
    })

    const result = await service.generateDraft({
      kind: 'team',
      prompt: '需要前端和安全专家组建联调组',
    })

    expect(result.ok).toBe(true)
    expect(result.teamDraft?.name).toBe('前端与安全联调团')
    expect(result.teamDraft?.members).toHaveLength(2)
    expect(result.memberReasons?.['engineering-frontend-developer']).toBe('负责 UI 开发')
  })

  it('fails gracefully when llm hallucinates nonexistent expert slug in team', async () => {
    const mockLlm = {
      listProviders: () => [{ id: 'mock-provider', name: 'Mock' }],
      listModels: async () => [{ id: 'mock-model', name: 'Mock Model' }],
      prepareCall: async () => ({
        stream: async function* () {
          yield {
            type: 'content',
            delta: JSON.stringify({
              name: '虚构专家团',
              description: '测试虚构成员',
              tags: ['测试'],
              goal: '测试目标',
              constraints: '测试约束',
              deliveryRequirements: '测试交付',
              members: [
                {
                  expertSlug: 'engineering-frontend-developer',
                  duty: '前端',
                  instructions: '前端分工',
                },
                {
                  expertSlug: 'nonexistent-alien-slug',
                  duty: '虚构',
                  instructions: '虚构分工',
                },
              ],
              examples: ['测试示例'],
              coordinatorMode: 'template',
              coordinatorTemplateId: 'technical',
              coordinatorTemplateVersion: 1,
              coordinatorPrompt: '',
            }),
          }
        },
      }),
    }

    const service = createCreationService({
      getCatalog,
      getLlmRuntime: () => mockLlm as any,
    })

    const result = await service.generateDraft({
      kind: 'team',
      prompt: '组建团队',
    })

    expect(result.ok).toBe(false)
    expect(result.error).toContain('nonexistent-alien-slug')
  })
})
