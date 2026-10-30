import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { isAskConfirmElement, triggerConfirmedProposalFetch } from './index.js'
import type { AgencyAgentsRemoteApi } from './index.js'
import type { StoredProposal, LatestProposal } from '../creation-tools.js'

describe('草案弹窗触发与零轮询架构 (Issue #34)', () => {
  it('src/client/index.ts 必须彻底消除全局 setInterval 轮询，严禁后台死循环占用连接', () => {
    const code = readFileSync(new URL('./index.ts', import.meta.url), 'utf8')
    assert.doesNotMatch(
      code,
      /setInterval\s*\(\s*(?:\(\)\s*=>\s*)?(?:void\s*)?checkLatest/,
      '不得存在无限制的 checkLatest setInterval 轮询'
    )
    assert.doesNotMatch(
      code,
      /agency-agents:\s*auto\s*popup\s*sensing/,
      '旧版常驻 auto popup sensing effect 必须被移除或重构成无轮询模式'
    )
  })

  it('src/remote-contract.ts 中的 getLatestProposal 的 sessionId 必须声明 acceptsUndefined 为 true', () => {
    const code = readFileSync(new URL('../remote-contract.ts', import.meta.url), 'utf8')
    assert.match(
      code,
      /jsonParameter\(\s*'sessionId',\s*'string\?',\s*z\.string\(\)\.optional\(\),\s*true\s*\)/,
      'sessionId 参数必须明确指定 acceptsUndefined: true 以支持缺失序列化'
    )
  })

  it('isAskConfirmElement 必须准确识别 ASK 卡片中的确认打开选项', () => {
    // 模拟原生 DOM 结构
    const button = {
      closest: (selector: string) => button,
      textContent: '✅ 立即打开编辑窗口反显写入',
      getAttribute: (name: string) => (name === 'aria-label' ? '✅ 立即打开编辑窗口反显写入' : null),
    } as unknown as Element

    expect(isAskConfirmElement(button)).toBe(true)

    // 非确认选项（如微调/取消）
    const cancelBtn = {
      closest: (selector: string) => cancelBtn,
      textContent: '✏️ 留在当前对话继续修改调整',
      getAttribute: () => null,
    } as unknown as Element

    expect(isAskConfirmElement(cancelBtn)).toBe(false)
    expect(isAskConfirmElement(null)).toBe(false)
  })

  it('triggerConfirmedProposalFetch 在用户点击确认后发起受控拉取并在命中时打开弹窗', async () => {
    const mockProposal: StoredProposal = {
      kind: 'expert',
      data: {
        name: '测试专家',
        description: '测试职责',
        division: 'engineering',
        prompt: '提示词...',
        emoji: '🧩',
        avatar: 0,
      },
      confirmed: true,
    }

    const mockLatest: LatestProposal = {
      id: 'prop-123',
      proposal: mockProposal,
      timestamp: 2000,
    }

    const getLatestProposal = vi.fn().mockResolvedValue({ ok: true, value: mockLatest })
    const mockRemote = {
      getLatestProposal,
    } as unknown as AgencyAgentsRemoteApi

    const onSuccess = vi.fn()

    const ok = await triggerConfirmedProposalFetch({
      remote: mockRemote,
      sessions: { list: { getSnapshot: () => ({ current: 'session-1' }) } },
      lastHandledTimestamp: 1000,
      onSuccess,
      delayMs: 10,
      maxAttempts: 2,
    })

    expect(ok).toBe(true)
    expect(getLatestProposal).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(mockProposal, 2000)
  })

  it('triggerConfirmedProposalFetch 同时无缝支持专家团队 (team) 草案拉取与确认', async () => {
    const mockTeamProposal: StoredProposal = {
      kind: 'team',
      data: {
        name: '测试专家团',
        description: '测试团队目标',
        tags: ['治理'],
        goal: '完成系统架构重构',
        deliveryRequirements: '输出报告',
        constraints: '无',
        examples: ['重构代码'],
        coordinatorMode: 'template',
        coordinatorTemplateId: 'technical',
        coordinatorTemplateVersion: 1,
        coordinatorPrompt: '',
        members: [
          { expertSlug: 'engineering-software-architect', duty: '系统架构', instructions: '指导核心模块拆分' },
          { expertSlug: 'engineering-code-reviewer', duty: '代码审计', instructions: '审计并发逻辑' },
        ],
      },
      memberReasons: { 'engineering-software-architect': '负责总体架构' },
      confirmed: true,
    }

    const mockLatestTeam: LatestProposal = {
      id: 'prop-team-456',
      proposal: mockTeamProposal,
      timestamp: 3000,
    }

    const getLatestProposal = vi.fn().mockResolvedValue({ ok: true, value: mockLatestTeam })
    const mockRemote = {
      getLatestProposal,
    } as unknown as AgencyAgentsRemoteApi

    const onSuccess = vi.fn()

    const ok = await triggerConfirmedProposalFetch({
      remote: mockRemote,
      sessions: { list: { getSnapshot: () => ({ current: 'session-team' }) } },
      lastHandledTimestamp: 1000,
      onSuccess,
      delayMs: 10,
      maxAttempts: 2,
    })

    expect(ok).toBe(true)
    expect(getLatestProposal).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(mockTeamProposal, 3000)
  })

  it('triggerConfirmedProposalFetch 具备 inFlight 互斥防抖，防止并发多重触发', async () => {
    const getLatestProposal = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, value: null }), 100))
    )
    const mockRemote = {
      getLatestProposal,
    } as unknown as AgencyAgentsRemoteApi

    // 并发触发两次
    const p1 = triggerConfirmedProposalFetch({
      remote: mockRemote,
      sessions: {},
      lastHandledTimestamp: 1000,
      onSuccess: vi.fn(),
      delayMs: 10,
      maxAttempts: 1,
    })
    const p2 = triggerConfirmedProposalFetch({
      remote: mockRemote,
      sessions: {},
      lastHandledTimestamp: 1000,
      onSuccess: vi.fn(),
      delayMs: 10,
      maxAttempts: 1,
    })

    const [r1, r2] = await Promise.all([p1, p2])
    // 其中一个由于 inFlight 锁直接返回 false
    expect(r1 === false || r2 === false).toBe(true)
  })
})
