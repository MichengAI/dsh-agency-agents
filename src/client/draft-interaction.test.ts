import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import {
  isAskConfirmOptionElement,
  isAskConfirmSubmitAction,
  triggerConfirmedProposalFetch,
  withTimeout,
} from './index.js'
import type { AgencyAgentsRemoteApi } from './index.js'
import type { StoredProposal, LatestProposal } from '../creation-tools.js'

describe('草案弹窗触发与零轮询架构 (Issue #34 根治加固)', () => {
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

  it('isAskConfirmOptionElement 必须精准识别单选选项，且不误判包含所有选项的大卡片容器', () => {
    // 1. 真实单选按钮
    const button = {
      closest: (selector: string) => (selector.includes('button') ? button : null),
      textContent: '✅ 立即打开编辑窗口反显写入',
      getAttribute: (name: string) => (name === 'aria-label' ? '✅ 立即打开编辑窗口反显写入' : null),
    } as unknown as Element

    expect(isAskConfirmOptionElement(button)).toBe(true)

    // 2. 包含全部选项的大卡片容器（包含“留在当前对话”）——必须返回 false！
    const cardContainer = {
      closest: (selector: string) => (selector.includes('button') ? cardContainer : null),
      textContent: '✅ 立即打开编辑窗口反显写入\n✏️ 留在当前对话继续修改调整',
      getAttribute: () => null,
    } as unknown as Element

    expect(isAskConfirmOptionElement(cardContainer)).toBe(false)

    // 3. 非确认选项
    const cancelBtn = {
      closest: (selector: string) => (selector.includes('button') ? cancelBtn : null),
      textContent: '✏️ 留在当前对话继续修改调整',
      getAttribute: () => null,
    } as unknown as Element

    expect(isAskConfirmOptionElement(cancelBtn)).toBe(false)
    expect(isAskConfirmOptionElement(null)).toBe(false)
  })

  it('isAskConfirmSubmitAction 必须准确识别已选卡片内的提交动作，且过滤取消与跳过', () => {
    const fakeCard = { id: 'card-1' } as unknown as Element
    const pendingCards = new WeakSet<Element>([fakeCard])

    // 提交按钮
    const submitBtn = {
      closest: (selector: string) => {
        if (selector.includes('data-question-key')) return fakeCard
        if (selector.includes('button')) return submitBtn
        return null
      },
      textContent: '提交',
    } as unknown as Element

    expect(isAskConfirmSubmitAction(submitBtn, pendingCards)).toBe(true)

    // 跳过按钮
    const skipBtn = {
      closest: (selector: string) => {
        if (selector.includes('data-question-key')) return fakeCard
        if (selector.includes('button')) return skipBtn
        return null
      },
      textContent: '跳过',
    } as unknown as Element

    expect(isAskConfirmSubmitAction(skipBtn, pendingCards)).toBe(false)

    // 未标记确认的普通卡片内的按钮
    const otherCard = { id: 'card-2' } as unknown as Element
    const otherBtn = {
      closest: (selector: string) => {
        if (selector.includes('data-question-key')) return otherCard
        if (selector.includes('button')) return otherBtn
        return null
      },
      textContent: '提交',
    } as unknown as Element

    expect(isAskConfirmSubmitAction(otherBtn, pendingCards)).toBe(false)
  })

  it('withTimeout 在超时发生时强行熔断抛出异常，防止网络挂起死锁', async () => {
    const hangingPromise = new Promise((resolve) => setTimeout(() => resolve('ok'), 500))
    await expect(withTimeout(hangingPromise, 50, 'CUSTOM_TIMEOUT')).rejects.toThrow('CUSTOM_TIMEOUT')

    const fastPromise = Promise.resolve('done')
    await expect(withTimeout(fastPromise, 100)).resolves.toBe('done')
  })

  it('triggerConfirmedProposalFetch 在挂起超时后能够正常释放 inFlight 锁，不锁死后续调用', async () => {
    // 模拟一次挂起超过超时的请求
    const hangingFn = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, value: null }), 500))
    )
    const mockRemote = {
      getLatestProposal: hangingFn,
    } as unknown as AgencyAgentsRemoteApi

    const ok1 = await triggerConfirmedProposalFetch({
      remote: mockRemote,
      sessions: {},
      lastHandledTimestamp: 1000,
      onSuccess: vi.fn(),
      delayMs: 5,
      timeoutMs: 30, // 30ms 熔断
      maxAttempts: 1,
    })
    expect(ok1).toBe(false)

    // 超时熔断后，必须已释放锁，第二次正常请求能够立刻执行
    const normalFn = vi.fn().mockResolvedValue({
      ok: true,
      value: {
        id: 'prop-1',
        proposal: { kind: 'expert', data: { name: '正常专家' } },
        timestamp: 2000,
      },
    })
    const normalRemote = {
      getLatestProposal: normalFn,
    } as unknown as AgencyAgentsRemoteApi

    const onSuccess = vi.fn()
    const ok2 = await triggerConfirmedProposalFetch({
      remote: normalRemote,
      sessions: {},
      lastHandledTimestamp: 1000,
      onSuccess,
      delayMs: 5,
      timeoutMs: 100,
      maxAttempts: 1,
    })

    expect(ok2).toBe(true)
    expect(normalFn).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledTimes(1)
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
})
