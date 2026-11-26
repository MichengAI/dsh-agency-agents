import { describe, expect, it, vi } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import type { AgentOptions } from '@deepseek-ai/dsh-agent'
import {
  mergeBatchExpertModelRequest,
  mergeTeamMemberModelRequest,
  readParentAgentOptions,
  resolveChildModelOptions,
  resolveTeamMemberModels,
  type ModelSelectionContext,
} from './model-selection.js'

function createFakeContext(options: {
  capabilities?: { agentOptions?: boolean; depthLimit?: boolean }
  providerObject?: Record<string, unknown>
  allowedRoutes?: () => Array<{ provider: string; model: string }> | undefined
  legacyCurrent?: () => unknown
  resolveCallConfig?: (config: Record<string, unknown>, signal?: AbortSignal) => Promise<Record<string, unknown>>
  routeDiscoveryVisible?: boolean
} = {}) {
  const provider = options.providerObject ?? {
    name: 'spawn',
    capabilities: options.capabilities ?? { agentOptions: true, depthLimit: true },
  }
  const resolveCallConfig = vi.fn(options.resolveCallConfig ?? (async (config) => config))
  const currentMock = vi.fn(options.legacyCurrent ?? (() => {
    throw new Error('private current() must not be called')
  }))
  const subagentModelSelection = options.allowedRoutes !== undefined
    ? { allowedRoutes: vi.fn(options.allowedRoutes), current: currentMock }
    : options.legacyCurrent !== undefined
      ? { current: currentMock }
      : undefined

  const ctx = {
    subagents: {
      getProvider: vi.fn(() => provider),
    },
    tools: {
      get: vi.fn((name: string) => (name === 'list_subagent_models' && options.routeDiscoveryVisible ? { name } : undefined)),
    },
    get: vi.fn((service: string) => {
      if (service === 'llm') return { resolveCallConfig }
      if (service === 'subagentModelSelection') return subagentModelSelection
      return undefined
    }),
  } as unknown as ModelSelectionContext & Context

  return { ctx, provider, resolveCallConfig, currentMock, subagentModelSelection }
}

function createFakeAgent(options: {
  provider?: string
  model?: string
  reasoningEffort?: AgentOptions['reasoningEffort']
  headerConfig?: { provider: string; model: string; reasoningEffort?: AgentOptions['reasoningEffort'] }
  sessionEvents?: Array<{ type: string; data?: unknown }>
} = {}) {
  const events = options.sessionEvents ?? []
  return {
    options: {
      ...(options.provider === undefined ? {} : { provider: options.provider }),
      ...(options.model === undefined ? {} : { model: options.model }),
      ...(options.reasoningEffort === undefined ? {} : { reasoningEffort: options.reasoningEffort }),
    },
    session: {
      requestHeader: () => (options.headerConfig === undefined ? undefined : { config: options.headerConfig }),
      seq: events.length,
      eventAt: (seq: number) => events[seq],
    },
  }
}

describe('子代理独立模型解析与跨版本白名单校验', () => {
  it('省略全部模型字段或仅传空串时走零侵入快速路径，不触碰宿主服务', async () => {
    const { ctx, resolveCallConfig } = createFakeContext({
      capabilities: { agentOptions: false },
    })
    const bareAgent = {}

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent: bareAgent,
      request: { provider: '', model: '   ', reasoning_effort: '' },
      locale: 'zh',
    })).resolves.toBeUndefined()

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent: bareAgent,
      request: {},
      locale: 'en',
    })).resolves.toBeUndefined()

    expect(resolveCallConfig).not.toHaveBeenCalled()
    expect((ctx.get as ReturnType<typeof vi.fn>)).not.toHaveBeenCalled()
  })

  it('provider 与 model 必须成对传入，且单独传 reasoning_effort 会被拒绝', async () => {
    const { ctx } = createFakeContext({ routeDiscoveryVisible: true })
    const agent = createFakeAgent({ provider: 'kimi', model: 'kimi-k3-pro' })

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek' },
      locale: 'zh',
    })).rejects.toThrow(/list_subagent_models/)

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { model: 'deepseek-chat' },
      locale: 'en',
    })).rejects.toThrow(/provider.*model/i)

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { reasoning_effort: 'low' },
      locale: 'en',
    })).rejects.toThrow(/reasoning_effort/i)
  })

  it('list_subagent_models 不可见时，报错不会引导模型去调用不存在的工具', async () => {
    const { ctx } = createFakeContext({ routeDiscoveryVisible: false })
    const agent = createFakeAgent({ provider: 'kimi', model: 'kimi-k3-pro' })

    const err = await resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'zh',
    }).catch((e: Error) => e)

    expect(err).toBeInstanceOf(Error)
    if (!(err instanceof Error)) throw new Error('expected error')
    expect(err.message).not.toContain('list_subagent_models')
  })

  it('provider 不支持 capabilities.agentOptions 时拒绝显式选模', async () => {
    const { ctx } = createFakeContext({ capabilities: { agentOptions: false } })
    const agent = createFakeAgent({ provider: 'kimi', model: 'kimi-k3-pro' })

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'kimi', model: 'kimi-k3-pro' },
      locale: 'zh',
    })).rejects.toThrow(/agentOptions/i)
  })

  it('DSH 0.2.3-alpha.2+ 通过 allowedRoutes() 校验白名单，并在切模型时不继承父 reasoningEffort', async () => {
    const { ctx, resolveCallConfig } = createFakeContext({
      allowedRoutes: () => [{ provider: 'deepseek', model: 'deepseek-chat' }],
      routeDiscoveryVisible: true,
    })
    const agent = createFakeAgent({
      provider: 'kimi',
      model: 'kimi-k3-pro',
      reasoningEffort: 'high' as AgentOptions['reasoningEffort'],
    })

    const resolved = await resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'zh',
    })

    expect(resolved).toEqual({
      provider: 'deepseek',
      model: 'deepseek-chat',
    })
    expect('reasoningEffort' in resolved!).toBe(false)
    expect(resolveCallConfig).toHaveBeenCalledWith({
      provider: 'deepseek',
      model: 'deepseek-chat',
    }, undefined)

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'openai', model: 'gpt-5' },
      locale: 'en',
    })).rejects.toThrow(/list_subagent_models/)
  })

  it('允许在白名单关闭时仅变更当前父会话路线的 reasoning_effort', async () => {
    const { ctx, resolveCallConfig } = createFakeContext({
      allowedRoutes: () => undefined,
    })
    const agent = createFakeAgent({
      provider: 'kimi',
      model: 'kimi-k3-pro',
      headerConfig: { provider: 'deepseek', model: 'deepseek-reasoner', reasoningEffort: 'high' as AgentOptions['reasoningEffort'] },
    })

    expect(readParentAgentOptions(agent)).toEqual({
      provider: 'deepseek',
      model: 'deepseek-reasoner',
      reasoningEffort: 'high',
    })

    const resolved = await resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-reasoner', reasoning_effort: 'low' },
      locale: 'zh',
    })

    expect(resolved).toEqual({
      provider: 'deepseek',
      model: 'deepseek-reasoner',
      reasoningEffort: 'low',
    })
    expect(resolveCallConfig).toHaveBeenCalledWith({
      provider: 'deepseek',
      model: 'deepseek-reasoner',
      reasoningEffort: 'low',
    }, undefined)
  })

  it('DSH 0.2.2-rc.2~rc.5 无 allowedRoutes() 时不调用 private current()，改从 session 日志投影事件读取白名单', async () => {
    const { ctx, currentMock } = createFakeContext({
      legacyCurrent: () => ({ enabled: true, allowedModels: [{ provider: 'openai', model: 'gpt-4o-mini' }] }),
      routeDiscoveryVisible: true,
    })
    const agent = createFakeAgent({
      provider: 'kimi',
      model: 'kimi-k3-pro',
      sessionEvents: [
        { type: 'subagent/model-selection-policy', data: { allowedModels: [{ provider: 'deepseek', model: 'deepseek-chat' }] } },
      ],
    })

    const resolved = await resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'zh',
    })

    expect(resolved).toEqual({ provider: 'deepseek', model: 'deepseek-chat' })
    expect(currentMock).not.toHaveBeenCalled()

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'openai', model: 'gpt-4o-mini' },
      locale: 'zh',
    })).rejects.toThrow(/deepseek-chat|allowed|允许/i)
  })

  it('llm.resolveCallConfig 预检失败或预检期间 provider 被热替换时中止启动', async () => {
    const { ctx } = createFakeContext({
      allowedRoutes: () => [{ provider: 'deepseek', model: 'deepseek-chat' }],
      resolveCallConfig: async () => {
        throw new Error('unsupported reasoning effort')
      },
    })
    const agent = createFakeAgent({ provider: 'kimi', model: 'kimi-k3-pro' })

    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat', reasoning_effort: 'max' },
      locale: 'zh',
    })).rejects.toThrow(/unsupported reasoning effort/)

    const providerA = { name: 'spawn', capabilities: { agentOptions: true } }
    const providerB = { name: 'spawn', capabilities: { agentOptions: true } }
    let currentProvider = providerA
    const ctxChanged = {
      subagents: { getProvider: vi.fn(() => currentProvider) },
      tools: { get: vi.fn(() => undefined) },
      get: vi.fn((service: string) => {
        if (service === 'llm') {
          return {
            resolveCallConfig: async (cfg: Record<string, unknown>) => {
              currentProvider = providerB
              return cfg
            },
          }
        }
        if (service === 'subagentModelSelection') {
          return { allowedRoutes: () => [{ provider: 'deepseek', model: 'deepseek-chat' }] }
        }
        return undefined
      }),
    } as unknown as ModelSelectionContext

    await expect(resolveChildModelOptions({
      ctx: ctxChanged,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'zh',
    })).rejects.toThrow(/重试|retry/i)
  })

  it('批量与团队模型合并规则：单项不传模型时继承顶层，传了半边时不跨层拼接', () => {
    const top = { provider: 'deepseek', model: 'deepseek-chat', reasoning_effort: 'low' }

    expect(mergeBatchExpertModelRequest(top, {})).toEqual(top)
    expect(mergeBatchExpertModelRequest(top, { reasoning_effort: 'medium' })).toEqual({
      provider: 'deepseek',
      model: 'deepseek-chat',
      reasoning_effort: 'medium',
    })
    expect(mergeBatchExpertModelRequest(top, { model: 'other-model' })).toEqual({
      model: 'other-model',
    })
    expect(mergeBatchExpertModelRequest(top, { provider: 'openai', model: 'gpt-4o-mini' })).toEqual({
      provider: 'openai',
      model: 'gpt-4o-mini',
    })

    expect(mergeTeamMemberModelRequest(top, { expert: 'reviewer', reasoning_effort: 'high' })).toEqual({
      provider: 'deepseek',
      model: 'deepseek-chat',
      reasoning_effort: 'high',
    })
    expect(mergeTeamMemberModelRequest(top, { expert: 'reviewer', provider: 'anthropic' })).toEqual({
      provider: 'anthropic',
    })
  })

  it('member_models 非数组时返回明确的类型错误而非第一项缺少标识', async () => {
    const { ctx } = createFakeContext({
      allowedRoutes: () => [{ provider: 'deepseek', model: 'deepseek-chat' }],
    })
    const agent = createFakeAgent({ provider: 'kimi', model: 'kimi-k3-pro' })

    await expect(resolveTeamMemberModels({
      ctx,
      providerName: 'spawn',
      agent,
      targets: [{ slug: 'reviewer', name: '代码审查员', nameEn: 'Reviewer' }],
      teamRequest: {},
      memberModels: { expert: 'reviewer', provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'zh',
      teamLocale: 'zh',
    })).rejects.toThrow('member_models 必须是数组。')

    await expect(resolveTeamMemberModels({
      ctx,
      providerName: 'spawn',
      agent,
      targets: [{ slug: 'reviewer', name: '代码审查员', nameEn: 'Reviewer' }],
      teamRequest: {},
      memberModels: 'reviewer',
      locale: 'en',
      teamLocale: 'en',
    })).rejects.toThrow('member_models must be an array.')
  })

  it('父路线解析直接对齐宿主委托语义，空串头配置不回退 created 且缺失 requestHeader 安全兜底', async () => {
    const overridden = createFakeAgent({
      provider: 'kimi',
      model: 'kimi-k3-pro',
      reasoningEffort: 'high' as AgentOptions['reasoningEffort'],
      headerConfig: { provider: 'deepseek', model: 'deepseek-chat' },
    })
    expect(readParentAgentOptions(overridden)).toEqual({
      provider: 'deepseek',
      model: 'deepseek-chat',
    })

    const blankHeader = createFakeAgent({
      provider: 'kimi',
      model: 'kimi-k3-pro',
      reasoningEffort: 'high' as AgentOptions['reasoningEffort'],
      headerConfig: { provider: '', model: '' },
    })
    // 对齐宿主 parentAgentOptionsForDelegation：存在 requestHeader().config 时不回退 created，空串由父路线校验拦截
    expect(readParentAgentOptions(blankHeader)).toEqual({
      provider: '',
      model: '',
    })

    const { ctx } = createFakeContext({ allowedRoutes: () => undefined })
    await expect(resolveChildModelOptions({
      ctx,
      providerName: 'spawn',
      agent: blankHeader,
      request: { provider: 'kimi', model: 'kimi-k3-pro' },
      locale: 'zh',
    })).rejects.toThrow('当前会话缺少有效父模型路线')

    expect(readParentAgentOptions({ options: { provider: 'kimi', model: 'kimi-k3-pro' } })).toEqual({
      provider: 'kimi',
      model: 'kimi-k3-pro',
    })
    expect(readParentAgentOptions({
      options: { provider: 'kimi', model: 'kimi-k3-pro' },
      session: { requestHeader: () => { throw new Error('broken header') } },
    })).toEqual({
      provider: 'kimi',
      model: 'kimi-k3-pro',
    })
  })

  it('allowedRoutes 抛出 INVALID_MODEL_SELECTION_SETTINGS 时转为本地化错误，未知异常原样透传', async () => {
    const agent = createFakeAgent({ provider: 'kimi', model: 'kimi-k3-pro' })
    const invalidSettingsErr = Object.assign(
      new Error('enabled subagent model selection requires at least one allowed model'),
      { code: 'INVALID_MODEL_SELECTION_SETTINGS' },
    )
    const { ctx: invalidCtx } = createFakeContext({
      allowedRoutes: () => {
        throw invalidSettingsErr
      },
    })

    await expect(resolveChildModelOptions({
      ctx: invalidCtx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'zh',
    })).rejects.toThrow(/宿主子智能体模型选择配置无效.*enabled subagent model selection requires at least one allowed model/)

    await expect(resolveChildModelOptions({
      ctx: invalidCtx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'en',
    })).rejects.toThrow(/Host subagent model selection settings are invalid.*enabled subagent model selection requires at least one allowed model/)

    const { ctx: unexpectedCtx } = createFakeContext({
      allowedRoutes: () => {
        throw new Error('boom-unexpected')
      },
    })
    await expect(resolveChildModelOptions({
      ctx: unexpectedCtx,
      providerName: 'spawn',
      agent,
      request: { provider: 'deepseek', model: 'deepseek-chat' },
      locale: 'zh',
    })).rejects.toThrow('boom-unexpected')
  })
})
