import { describe, it, expect, vi } from 'vitest'
import { createProposalRegistry, renderExpertProposalMarkdown, renderTeamProposalMarkdown } from './creation-tools.js'
import { validateExpertProposal, validateTeamProposal } from './creation-contract.js'
import { ZH_DIVISION } from './names.js'

describe('端到端真机时序回归测试 (E2E Creation Probe)', () => {
  it('E2E-1: 自定义专家完整心流（预览 → 多轮修改 → 确认Ask把关 → 客户端感知与会话隔离）', async () => {
    const registry = createProposalRegistry()
    const sessionA = 'session-window-A'
    const sessionB = 'session-window-B'

    // 1. 第一轮提需求：propose_custom_expert
    const input1 = {
      name: 'Rust 并发安全专家',
      description: '专注排查 Tokio 异步死锁',
      division: 'engineering',
      emoji: '🦀',
      prompt: '你是一名专业的 Rust 异步并发安全专家，具备十年高性能底层系统经验...'.repeat(5),
      avatar: 0,
    }
    const val1 = validateExpertProposal(input1)
    expect(val1.ok).toBe(true)
    if (!val1.ok) return

    const propId1 = registry.save({ kind: 'expert', data: val1.value, confirmed: false }, sessionA)
    const md1 = renderExpertProposalMarkdown(propId1, val1.value)

    // 验证 Markdown 格式与引导语
    expect(md1).toContain('### 🧩 专家草案预览：🦀 Rust 并发安全专家')
    expect(md1).toContain('* **所属分类**：工程')
    expect(md1).toContain('<summary>查看完整系统提示词（点击展开）</summary>')
    expect(md1).toContain('请对我说「**确认**」，我将弹出确认卡片并为您唤起全量填好的编辑抽屉！')

    // 验证草案打磨期，客户端绝对不弹窗
    const t0 = Date.now() - 500
    expect(registry.getLatestConfirmed(t0, sessionA)).toBeNull()
    expect(registry.getLatestConfirmed(t0, sessionB)).toBeNull()

    // 2. 多轮对话微调：用户要求修改简介
    const input2 = {
      ...input1,
      description: '专注排查 Tokio 异步死锁与内存屏障安全',
    }
    const val2 = validateExpertProposal(input2)
    expect(val2.ok).toBe(true)
    if (!val2.ok) return

    const propId2 = registry.save({ kind: 'expert', data: val2.value, confirmed: false }, sessionA)
    const latestDraft = registry.getLatest(t0, sessionA)
    expect(latestDraft?.id).toBe(propId2)
    expect(latestDraft?.proposal.data.description).toBe('专注排查 Tokio 异步死锁与内存屏障安全')

    // 3. 用户在对话中回复“确认”：模拟 open_custom_expert_editor 内部执行
    // 模拟 userQuestions.ask
    const mockUserQuestions = {
      ask: vi.fn(async () => ({
        answers: [{ id: 'confirm-open-expert-dialog', selected: ['✅ 立即打开编辑窗口反显写入'] }],
      })),
    }

    // 触发 ask
    const askRes = await mockUserQuestions.ask()
    expect(askRes.answers[0].selected[0]).toBe('✅ 立即打开编辑窗口反显写入')

    // 确认激活
    const confirmed = registry.confirmLatest(sessionA)
    expect(confirmed).not.toBeNull()
    expect(confirmed?.proposal.confirmed).toBe(true)

    // 4. 客户端感知与会话隔离验证
    const clientPollA = registry.getLatestConfirmed(t0, sessionA)
    const clientPollB = registry.getLatestConfirmed(t0, sessionB)

    // 窗口 A 准确感知到草案，触发 openGlobalDraftEditor
    expect(clientPollA).not.toBeNull()
    expect(clientPollA?.proposal.data.name).toBe('Rust 并发安全专家')

    // 窗口 B 严格过滤，绝对不串台弹窗！
    expect(clientPollB).toBeNull()
  })

  it('E2E-2: 专家团队完整心流（智能模糊别名匹配 → i18n团队预览 → 确认落地）', async () => {
    const registry = createProposalRegistry()
    const sessionTeam = 'session-team-window'

    // 模拟专家库（含真实 slug、中文名、英文名）
    const mockCatalogExperts = [
      { slug: 'product-manager', name: '产品经理', nameEn: 'Product Manager', emoji: '🎭' },
      { slug: 'engineering-code-reviewer', name: '代码审查工程师', nameEn: 'Code Reviewer', emoji: '🕵️' },
      { slug: 'engineering-software-architect', name: '软件架构师', nameEn: 'Software Architect', emoji: '🏛️' },
      { slug: 'security-security-engineer', name: '安全工程师', nameEn: 'Security Engineer', emoji: '🛡️' },
      { slug: 'testing-test-results-analyzer', name: '测试结果分析师', nameEn: 'Test Results Analyzer', emoji: '📊' },
    ]

    // 1. 模拟大模型传入的原始团队：混杂中文名与短英文 slug
    const rawTeamInput = {
      name: '项目全方位审查专家团',
      description: '覆盖需求、代码、架构、安全与测试五个维度的独立审查',
      tags: ['质量保障', '架构治理'],
      goal: '全面审查项目健康度，输出 P0-P2 缺陷报告',
      deliveryRequirements: '提供只读凭据与代码行号',
      constraints: '只读审查，不直接修改业务源码',
      examples: ['对当前仓库执行全面体检'],
      coordinatorMode: 'template',
      coordinatorTemplateId: 'technical',
      coordinatorTemplateVersion: 1,
      coordinatorPrompt: '',
      members: [
        { expertSlug: '产品经理', duty: '需求逻辑与产品边界', instructions: '核对 PRD 与实现偏差' },
        { expertSlug: 'code-reviewer', duty: '代码质量与工程规范', instructions: '检查坏味道与复杂度' },
        { expertSlug: '软件架构师', duty: '系统架构与解耦', instructions: '分析模块依赖与并发安全' },
        { expertSlug: 'security-security-engineer', duty: '安全漏洞排查', instructions: '核验注入与越权' },
      ],
    }

    // 2. 校验与别名解析
    const validation = validateTeamProposal(rawTeamInput, mockCatalogExperts)
    expect(validation.ok).toBe(true)
    if (!validation.ok) return

    // 验证所有非标准名称均被正确解析为唯一的库内真实 slug！
    expect(validation.value.members[0].expertSlug).toBe('product-manager')
    expect(validation.value.members[1].expertSlug).toBe('engineering-code-reviewer')
    expect(validation.value.members[2].expertSlug).toBe('engineering-software-architect')
    expect(validation.value.members[3].expertSlug).toBe('security-security-engineer')

    // 3. 本地化 Markdown 预览生成
    const expertMap: Record<string, { name: string; emoji?: string }> = {}
    for (const e of mockCatalogExperts) {
      expertMap[e.slug] = { name: e.name, emoji: e.emoji }
    }

    const propId = registry.save({ kind: 'team', data: validation.value, memberReasons: {}, confirmed: false }, sessionTeam)
    const teamMd = renderTeamProposalMarkdown(propId, validation.value, {}, expertMap)

    // 验证团队 Markdown 格式：中文名、Emoji、规范字段
    expect(teamMd).toContain('### 👥 专家团队草案预览：项目全方位审查专家团 [质量保障 / 架构治理]')
    expect(teamMd).toContain('* 🎭 **产品经理**（`product-manager`）：需求逻辑与产品边界')
    expect(teamMd).toContain('* 🕵️ **代码审查工程师**（`engineering-code-reviewer`）：代码质量与工程规范')
    expect(teamMd).toContain('* 🏛️ **软件架构师**（`engineering-software-architect`）：系统架构与解耦')
    expect(teamMd).toContain('* 🛡️ **安全工程师**（`security-security-engineer`）：安全漏洞排查')
    expect(teamMd).toContain('请对我说「**确认**」，我将弹出确认卡片并为您唤起全量填好的编辑弹窗！')

    // 4. 模拟确认
    registry.confirmLatest(sessionTeam)
    const polledTeam = registry.getLatestConfirmed(0, sessionTeam)
    expect(polledTeam).not.toBeNull()
    expect(polledTeam?.proposal.data.name).toBe('项目全方位审查专家团')
  })

  it('E2E-3: 分类白名单与原型链安全性深度校验', () => {
    // 验证所有 22 个真实内置分类均能通过校验
    for (const division of Object.keys(ZH_DIVISION)) {
      const res = validateExpertProposal({
        name: `测试专家-${division}`,
        description: '有效简介',
        division,
        emoji: '🧪',
        prompt: '正文提示词...'.repeat(15),
      })
      expect(res.ok).toBe(true)
    }

    // 验证非法分类及原型链属性均被拦截
    const invalidDivisions = ['data', 'devops', 'qa', 'constructor', 'toString', '__proto__']
    for (const div of invalidDivisions) {
      const res = validateExpertProposal({
        name: '非法分类专家',
        description: '测试简介',
        division: div,
        emoji: '❌',
        prompt: '正文提示词...'.repeat(15),
      })
      expect(res.ok).toBe(false)
    }
  })
})
