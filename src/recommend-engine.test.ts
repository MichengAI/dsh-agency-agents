import { describe, it, expect } from 'vitest'
import { extractTaskKeywords, recommendExpertsForTask } from './recommend-engine.js'
import { resolveRecommendInputs } from './client/recommend-bar.js'
import type { ExpertSearchable } from './client/index.js'
import type { ExpertTeam } from './team-contract.js'

describe('recommend-engine 本地极速推荐引擎', () => {
  it('应准确提取任务特征词并过滤停用词', () => {
    const draft = '请帮我检查这个 React 系统的登录接口安全与越权问题'
    const kw = extractTaskKeywords(draft)
    expect(kw).toContain('react')
    expect(kw).not.toContain('帮我')
    expect(kw).not.toContain('请你')
    expect(kw.some(k => k.includes('安全') || k.includes('越权') || k.includes('接口'))).toBe(true)
  })

  it('应对匹配的专家打分并返回 Top 候选', () => {
    const mockExperts: ExpertSearchable[] = [
      {
        slug: 'security-appsec-engineer',
        name: '应用安全工程师',
        nameEn: 'AppSec Engineer',
        division: 'security',
        divisionZh: '安全',
        divisionEn: 'Security',
        description: '负责接口安全测试、越权漏洞排查和权限设计审查。',
        descriptionEn: 'Application security testing, IDOR audits and permission review.',
      },
      {
        slug: 'marketing-content-creator',
        name: '内容文案创作者',
        nameEn: 'Content Creator',
        division: 'marketing',
        divisionZh: '市场',
        divisionEn: 'Marketing',
        description: '负责小红书文案、公众号爆款选题与标题策划。',
        descriptionEn: 'Social media copywriting and viral headlines.',
      },
    ]

    const mockTeams: ExpertTeam[] = [
      {
        id: 'team-technical',
        builtin: true,
        name: '技术方案评审团',
        description: '从架构、安全和质量三个角度进行综合技术方案评审。',
        goal: '技术方案评审与安全防线检查',
        tags: ['架构', '安全', '评审'],
        deliveryRequirements: '输出风险清单',
        constraints: '仅评审',
        examples: ['评审方案'],
        members: [
          { expertSlug: 'security-appsec-engineer', duty: '安全', instructions: '检查安全' },
          { expertSlug: 'engineering-software-architect', duty: '架构', instructions: '检查架构' },
        ],
        coordinatorMode: 'template',
        coordinatorTemplateId: 'technical',
        coordinatorTemplateVersion: 1,
        coordinatorPrompt: '',
      },
    ]

    // 场景 1：安全与越权任务 -> 首推应用安全工程师
    const results1 = recommendExpertsForTask({
      draft: '我想排查一下用户管理模块中的越权漏洞与接口安全漏洞',
      experts: mockExperts,
      teams: mockTeams,
      enabledExpertSlugs: new Set(['security-appsec-engineer', 'marketing-content-creator']),
      enabledTeamIds: new Set(['team-technical']),
      activeLocale: 'zh',
    })

    expect(results1.length).toBeGreaterThan(0)
    expect(results1[0].id).toBe('security-appsec-engineer')
    expect(results1[0].kind).toBe('expert')
    expect(results1[0].reason).toContain('安全')

    // 场景 2：电商重构多角色评审团队诉求 -> 推荐技术方案评审团
    const results2 = recommendExpertsForTask({
      draft: '我们需要针对这次技术方案组织一次全面的团队评审',
      experts: mockExperts,
      teams: mockTeams,
      enabledExpertSlugs: new Set(['security-appsec-engineer']),
      enabledTeamIds: new Set(['team-technical']),
      activeLocale: 'zh',
    })

    expect(results2.length).toBeGreaterThan(0)
    expect(results2.some(c => c.id === 'team-technical')).toBe(true)

    // 场景 3：未启用的专家不应出现在推荐中
    const results3 = recommendExpertsForTask({
      draft: '我想写一篇小红书爆款文案',
      experts: mockExperts,
      teams: mockTeams,
      enabledExpertSlugs: new Set(['security-appsec-engineer']), // 故意未启用 marketing-content-creator
      enabledTeamIds: new Set([]),
      activeLocale: 'zh',
    })
    expect(results3.length).toBe(0)

    // 场景 4：已在草稿中引用的专家不重复推荐 (excludeSlugs)
    const results4 = recommendExpertsForTask({
      draft: '排查越权漏洞',
      experts: mockExperts,
      teams: mockTeams,
      enabledExpertSlugs: new Set(['security-appsec-engineer']),
      enabledTeamIds: new Set([]),
      activeLocale: 'zh',
      excludeSlugs: new Set(['security-appsec-engineer']),
    })
    expect(results4.length).toBe(0)

    // 场景 5：测试装配层 resolveRecommendInputs 真正提取的是 ref 字段，确保装配与去重严格守住
    const mockHostProps = {
      sessionId: 'sess-1',
      input: {
        draft: '检查登录接口安全与越权',
        occurrences: [
          { occurrenceId: 1, source: '@michengai/dsh-agency-agents', ref: 'security-appsec-engineer' }
        ]
      }
    }
    const resolved = resolveRecommendInputs(mockHostProps)
    expect(resolved.sessionId).toBe('sess-1')
    expect(resolved.draft).toBe('检查登录接口安全与越权')
    // 关键断言：必须提取出实体 ref（'security-appsec-engineer'），绝不能降级成 source
    expect(resolved.occurrences).toContain('security-appsec-engineer')
    expect(resolved.occurrences).not.toContain('@michengai/dsh-agency-agents')

    const results5 = recommendExpertsForTask({
      draft: resolved.draft,
      experts: mockExperts,
      teams: mockTeams,
      enabledExpertSlugs: new Set(['security-appsec-engineer']),
      enabledTeamIds: new Set([]),
      activeLocale: 'zh',
      excludeSlugs: new Set(resolved.occurrences),
    })
    expect(results5.length).toBe(0)
  })

  it('装配层回退策略：支持从 fallbackTarget 读取 draft 与 occurrences', () => {
    const fallbackTarget = {
      state: {
        getSnapshot: () => ({
          draft: '重构技术方案',
          draftRev: 1,
          occurrences: [{ source: '@michengai/dsh-agency-agents', ref: 'engineering-software-architect', offset: 0 }],
        }),
      },
      insertReference: () => true,
    }
    const resolved = resolveRecommendInputs({}, fallbackTarget as any)
    expect(resolved.draft).toBe('重构技术方案')
    expect(resolved.occurrences).toEqual(['engineering-software-architect'])
  })

  it('任务推荐生成候选结果能准确映射到宿主原生 Menu 数据项结构', () => {
    const mockExperts: ExpertSearchable[] = [
      {
        slug: 'marketing-xiaohongshu-expert',
        name: '小红书增长运营专家',
        nameEn: 'Xiaohongshu Growth Expert',
        division: 'marketing',
        divisionZh: '市场',
        divisionEn: 'Marketing',
        description: '专精小红书爆款笔记结构与流量分发机制。',
        descriptionEn: 'Xiaohongshu viral notes and growth.',
      },
    ]
    const candidates = recommendExpertsForTask({
      draft: '我想做小红书爆款笔记',
      experts: mockExperts,
      teams: [],
      enabledExpertSlugs: new Set(['marketing-xiaohongshu-expert']),
      enabledTeamIds: new Set([]),
      activeLocale: 'zh',
    })
    expect(candidates.length).toBe(1)
    expect(candidates[0].id).toBe('marketing-xiaohongshu-expert')
    expect(candidates[0].name).toBe('小红书增长运营专家')
    expect(candidates[0].reason).toContain('小红书')
  })
})
