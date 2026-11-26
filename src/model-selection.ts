/**
 * 子代理独立模型与推理强度解析模块。
 *
 * 严格遵循宿主授权边界（@deepseek-ai/dsh-tool-subagent）：
 * - 未显式传递任何模型参数（或仅为空串）时走零侵入快速路径，返回 undefined；
 * - 显式选模时依次校验：provider.capabilities.agentOptions、provider+model 成对约束、
 *   跨版本白名单授权（0.2.3-alpha.2+ allowedRoutes() / 0.2.2-rc.2~rc.5 会话投影事件）、
 *   llm.resolveCallConfig 适配器预检与预检期间的热替换检测。
 */

import type { AgentOptions } from '@deepseek-ai/dsh-agent'
import { parentAgentOptionsForDelegation } from '@deepseek-ai/dsh-subagent'
import { formatHost, localizedExpertName, type AgencyLocale } from './i18n.js'
import { teamText, type TeamLocale } from './team-i18n.js'

/** 模型工具侧的原始路线参数。 */
export interface DelegationModelRequest {
  readonly provider?: unknown
  readonly model?: unknown
  readonly reasoning_effort?: unknown
}

/** 归一化后的非空模型参数。 */
export interface NormalizedModelRequest {
  readonly provider?: string
  readonly model?: string
  readonly reasoning_effort?: string
}

/** 团队成员级模型覆盖请求。 */
export interface TeamMemberModelOverride extends DelegationModelRequest {
  readonly expert: unknown
}

/** 宿主授权白名单条目。 */
export interface AllowedModelRoute {
  readonly provider: string
  readonly model: string
}

interface SubagentProviderLike {
  readonly capabilities?: {
    readonly agentOptions?: boolean
  }
}

interface LlmRuntimeLike {
  resolveCallConfig(
    config: { provider: string; model: string; reasoningEffort?: AgentOptions['reasoningEffort'] },
    signal?: AbortSignal,
  ): Promise<unknown>
}

interface ModelSelectionServiceLike {
  allowedRoutes?: () => AllowedModelRoute[] | undefined
}

interface SessionLike {
  requestHeader?: () => { config?: { provider?: string; model?: string; reasoningEffort?: AgentOptions['reasoningEffort'] } } | undefined
  seq?: number
  eventAt?: (seq: number) => { type?: unknown; data?: unknown } | undefined
}

interface AgentLike {
  readonly options?: AgentOptions
  readonly session?: SessionLike
  readonly ctx?: {
    readonly tools?: {
      get?: (name: string, agent?: unknown, toolSet?: unknown) => unknown
    }
  }
}

/** 本模块所需的最小宿主上下文契约，兼容测试轻量化 mock。 */
export interface ModelSelectionContext {
  readonly subagents?: {
    getProvider?: (name: string) => SubagentProviderLike | undefined
  }
  readonly tools?: {
    get?: (name: string, agent?: unknown, toolSet?: unknown) => unknown
  }
  readonly get?: (name: never, required?: boolean) => unknown
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  return value.trim() === '' ? undefined : value
}

/** 归一化可选模型入参，将空串或非字符串空白视作未传。 */
export function normalizeModelRequest(raw: DelegationModelRequest): NormalizedModelRequest {
  const provider = asNonEmptyString(raw.provider)
  const model = asNonEmptyString(raw.model)
  const reasoningEffort = asNonEmptyString(raw.reasoning_effort)
  return {
    ...(provider === undefined ? {} : { provider }),
    ...(model === undefined ? {} : { model }),
    ...(reasoningEffort === undefined ? {} : { reasoning_effort: reasoningEffort }),
  }
}

/** 判断调用方是否显式指定了任意模型或推理强度字段。 */
export function hasModelSelectionRequest(request: NormalizedModelRequest): boolean {
  return request.provider !== undefined
    || request.model !== undefined
    || request.reasoning_effort !== undefined
}

/**
 * 合并 `summon_experts` 顶层默认模型与单项成员请求。
 * 只要单项显式传了 `provider` 或 `model` 之一，就不再继承顶层的半边路线，避免跨提供方误拼。
 */
export function mergeBatchExpertModelRequest(
  topRaw: DelegationModelRequest,
  itemRaw: DelegationModelRequest,
): NormalizedModelRequest {
  const top = normalizeModelRequest(topRaw)
  const item = normalizeModelRequest(itemRaw)
  if (item.provider !== undefined || item.model !== undefined) return item
  const reasoning = item.reasoning_effort ?? top.reasoning_effort
  return {
    ...(top.provider === undefined ? {} : { provider: top.provider }),
    ...(top.model === undefined ? {} : { model: top.model }),
    ...(reasoning === undefined ? {} : { reasoning_effort: reasoning }),
  }
}

/** 合并团队默认模型与 `member_models` 成员覆盖配置。 */
export function mergeTeamMemberModelRequest(
  teamRaw: DelegationModelRequest,
  overrideRaw: TeamMemberModelOverride | undefined,
): NormalizedModelRequest {
  if (overrideRaw === undefined) return normalizeModelRequest(teamRaw)
  return mergeBatchExpertModelRequest(teamRaw, overrideRaw)
}

/** 检测当前会话是否可见宿主提供的 `list_subagent_models` 工具。 */
export function hasRouteDiscoveryTool(
  ctx: ModelSelectionContext | undefined,
  agent: unknown,
  toolSet?: unknown,
): boolean {
  if (agent === undefined || agent === null) return false
  try {
    if (typeof ctx?.tools?.get === 'function') {
      return ctx.tools.get('list_subagent_models', agent, toolSet) !== undefined
    }
    const agentTools = (agent as AgentLike).ctx?.tools
    if (typeof agentTools?.get === 'function') {
      return agentTools.get('list_subagent_models', agent, toolSet) !== undefined
    }
  } catch {
    return false
  }
  return false
}

/**
 * 读取当前父会话的有效模型选项。
 * 直接复用宿主 `parentAgentOptionsForDelegation`，并在轻量级对象缺失 `session.requestHeader` 或抛错时安全回退 `agent.options`。
 */
export function readParentAgentOptions(agent: unknown): AgentOptions {
  if (agent === undefined || agent === null || typeof agent !== 'object') return {}
  const record = agent as AgentLike
  const created = record.options ?? {}
  if (typeof record.session?.requestHeader === 'function') {
    try {
      return parentAgentOptionsForDelegation({
        ...record,
        options: created,
        session: record.session,
      } as unknown as Parameters<typeof parentAgentOptionsForDelegation>[0])
    } catch {
      return { ...created }
    }
  }
  return { ...created }
}

function isAllowedRouteList(value: unknown): value is AllowedModelRoute[] {
  return Array.isArray(value) && value.length > 0 && value.every(entry =>
    entry !== null
    && typeof entry === 'object'
    && typeof (entry as { provider?: unknown }).provider === 'string'
    && (entry as { provider: string }).provider.length > 0
    && typeof (entry as { model?: unknown }).model === 'string'
    && (entry as { model: string }).model.length > 0)
}

/**
 * 在 DSH 0.2.2-rc.2 ~ 0.2.2-rc.5（无 `allowedRoutes()`）上，
 * 从 `session` 日志只读提取第一条 `subagent/model-selection-policy` 事件，避免触发旧版 private `current()`。
 */
function readLegacySessionModelPolicy(session: SessionLike | undefined): { readonly routes: readonly AllowedModelRoute[] } | undefined {
  if (session === undefined) return undefined
  const inspectEvent = (event: { type?: unknown; data?: unknown } | undefined): { readonly routes: readonly AllowedModelRoute[] } | undefined => {
    if (event?.type !== 'subagent/model-selection-policy') return undefined
    const allowedModels = (event.data as { allowedModels?: unknown } | undefined)?.allowedModels
    return isAllowedRouteList(allowedModels) ? { routes: allowedModels } : undefined
  }

  if (typeof session.seq === 'number' && typeof session.eventAt === 'function') {
    for (let i = 0; i < session.seq; i += 1) {
      const found = inspectEvent(session.eventAt(i))
      if (found !== undefined) return found
    }
  }
  return undefined
}

function readAuthorizedModelPolicy(
  ctx: ModelSelectionContext,
  agent: unknown,
  locale: AgencyLocale,
): { readonly routes: readonly AllowedModelRoute[] } | undefined {
  const selection = ctx.get?.('subagentModelSelection' as never, false) as ModelSelectionServiceLike | undefined
  if (typeof selection?.allowedRoutes === 'function') {
    let routes: AllowedModelRoute[] | undefined
    try {
      routes = selection.allowedRoutes()
    } catch (error) {
      const code = (error as { code?: unknown } | null | undefined)?.code
      if (code === 'INVALID_MODEL_SELECTION_SETTINGS') {
        const detail = error instanceof Error ? error.message : String(error)
        throw new Error(formatHost(locale, 'error.invalidModelSelectionSettings', { detail }))
      }
      throw error
    }
    return routes === undefined ? undefined : { routes }
  }
  return readLegacySessionModelPolicy((agent as AgentLike | undefined)?.session)
}

function assertAuthorizedRoute(
  policy: { readonly routes: readonly AllowedModelRoute[] } | undefined,
  parentOptions: AgentOptions,
  route: AllowedModelRoute,
  locale: AgencyLocale,
  discoveryVisible: boolean,
): void {
  const hint = discoveryVisible ? formatHost(locale, 'error.routeDiscoveryHint') : ''
  if (policy === undefined) {
    const parentProvider = asNonEmptyString(parentOptions.provider)
    const parentModel = asNonEmptyString(parentOptions.model)
    if (parentProvider === undefined || parentModel === undefined) {
      throw new Error(formatHost(locale, 'error.parentRouteMissing'))
    }
    if (route.provider === parentProvider && route.model === parentModel) return
    throw new Error(formatHost(locale, 'error.modelRouteNotAllowed', {
      provider: route.provider,
      model: route.model,
      detail: formatHost(locale, 'error.modelRouteParentOnlyDetail'),
      hint,
    }))
  }

  if (policy.routes.some(entry => entry.provider === route.provider && entry.model === route.model)) return
  throw new Error(formatHost(locale, 'error.modelRouteNotAllowed', {
    provider: route.provider,
    model: route.model,
    detail: '',
    hint,
  }))
}

/**
 * 解析并预检单次子代理调用的 `AgentOptions`。
 * 未显式指定任何模型参数时立即返回 undefined，不触碰宿主服务或能力标志。
 */
export async function resolveChildModelOptions(params: {
  readonly ctx: ModelSelectionContext
  readonly providerName: string
  readonly agent: unknown
  readonly request: DelegationModelRequest
  readonly locale: AgencyLocale
  readonly signal?: AbortSignal
  readonly toolSet?: unknown
}): Promise<AgentOptions | undefined> {
  const request = normalizeModelRequest(params.request)
  if (!hasModelSelectionRequest(request)) return undefined

  const { ctx, providerName, agent, locale, signal, toolSet } = params
  const provider = ctx.subagents?.getProvider?.(providerName)
  if (provider === undefined) {
    throw new Error(formatHost(locale, 'error.providerMissing', { provider: providerName }))
  }
  if (!provider.capabilities?.agentOptions) {
    throw new Error(formatHost(locale, 'error.providerNoAgentOptions', { provider: providerName }))
  }

  const discoveryVisible = hasRouteDiscoveryTool(ctx, agent, toolSet)
  const hint = discoveryVisible ? formatHost(locale, 'error.routeDiscoveryHint') : ''
  if (request.provider === undefined || request.model === undefined) {
    throw new Error(formatHost(
      locale,
      request.reasoning_effort === undefined ? 'error.modelPairRequired' : 'error.reasoningRequiresRoute',
      { hint },
    ))
  }

  const parentOptions = readParentAgentOptions(agent)
  const policy = readAuthorizedModelPolicy(ctx, agent, locale)
  assertAuthorizedRoute(policy, parentOptions, { provider: request.provider, model: request.model }, locale, discoveryVisible)

  const llm = ctx.get?.('llm' as never, false) as LlmRuntimeLike | undefined
  if (llm === undefined || typeof llm.resolveCallConfig !== 'function') {
    throw new Error(formatHost(locale, 'error.llmUnavailableForModel'))
  }

  const reasoningEffort = request.reasoning_effort as AgentOptions['reasoningEffort'] | undefined
  await llm.resolveCallConfig({
    provider: request.provider,
    model: request.model,
    ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
  }, signal)

  if (ctx.subagents?.getProvider?.(providerName) !== provider) {
    throw new Error(formatHost(locale, 'error.providerChangedDuringPreflight', { provider: providerName }))
  }

  return {
    provider: request.provider,
    model: request.model,
    ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
  }
}

/**
 * 批量或团队场景下按模型路线缓存预检 Promise，避免同路线并发调用重复触发 `resolveCallConfig`。
 */
export function resolveChildModelOptionsCached(
  params: Parameters<typeof resolveChildModelOptions>[0],
  cache?: Map<string, Promise<AgentOptions | undefined>>,
): Promise<AgentOptions | undefined> {
  const request = normalizeModelRequest(params.request)
  if (!hasModelSelectionRequest(request)) return Promise.resolve(undefined)
  if (cache === undefined) return resolveChildModelOptions({ ...params, request })
  const key = `${request.provider ?? ''}\0${request.model ?? ''}\0${request.reasoning_effort ?? ''}`
  let pending = cache.get(key)
  if (pending === undefined) {
    pending = resolveChildModelOptions({ ...params, request })
    cache.set(key, pending)
  }
  return pending
}

/** 团队成员匹配信息，用于校验与解析 member_models 覆盖项。 */
export interface TeamMemberModelTarget {
  readonly slug: string
  readonly name: string
  readonly nameEn?: string
}

function matchTeamMemberSlug(
  query: string,
  targets: readonly TeamMemberModelTarget[],
  locale: AgencyLocale,
): string | undefined {
  const normalized = query.trim().toLowerCase()
  if (normalized === '') return undefined
  const exactSlug = targets.find(item => item.slug.toLowerCase() === normalized)
  if (exactSlug !== undefined) return exactSlug.slug
  const matches = targets.filter((item) => {
    const localized = localizedExpertName({ name: item.name, nameEn: item.nameEn ?? item.name }, locale).toLowerCase()
    return item.name.toLowerCase() === normalized
      || (item.nameEn !== undefined && item.nameEn.toLowerCase() === normalized)
      || localized === normalized
  })
  return matches.length === 1 ? matches[0]?.slug : undefined
}

/**
 * 在启动任何团队任务或成员前，统一解析团队级模型与 `member_models` 覆盖项并完成预检。
 * 未指定任何模型参数时立即返回空 Map，不触碰宿主服务。
 */
export async function resolveTeamMemberModels(params: {
  readonly ctx: ModelSelectionContext
  readonly providerName: string
  readonly agent: unknown
  readonly targets: readonly TeamMemberModelTarget[]
  readonly teamRequest: DelegationModelRequest
  readonly memberModels: unknown
  readonly locale: AgencyLocale
  readonly teamLocale: TeamLocale
  readonly signal?: AbortSignal
  readonly toolSet?: unknown
}): Promise<Map<string, AgentOptions>> {
  const { ctx, providerName, agent, targets, teamRequest, memberModels, locale, teamLocale, signal, toolSet } = params
  const result = new Map<string, AgentOptions>()
  const normalizedTeam = normalizeModelRequest(teamRequest)
  const overrides = new Map<string, TeamMemberModelOverride>()

  if (memberModels !== undefined) {
    if (!Array.isArray(memberModels)) {
      throw new Error(teamText(teamLocale, 'member_models 必须是数组。'))
    }
    memberModels.forEach((entry, index) => {
      const record = entry as Partial<TeamMemberModelOverride> | null | undefined
      const rawExpert = record?.expert
      const expertText = typeof rawExpert === 'string' ? rawExpert.trim() : ''
      if (expertText === '') {
        throw new Error(teamText(teamLocale, 'member_models 的第 {0} 项必须提供专家标识。', [index + 1]))
      }
      const slug = matchTeamMemberSlug(expertText, targets, locale)
      if (slug === undefined) {
        throw new Error(teamText(teamLocale, 'member_models 中的专家 "{0}" 不在当前专家团成员列表中。', [expertText]))
      }
      if (overrides.has(slug)) {
        throw new Error(teamText(teamLocale, 'member_models 中存在重复的专家配置："{0}"。', [expertText]))
      }
      overrides.set(slug, {
        expert: slug,
        provider: record?.provider,
        model: record?.model,
        reasoning_effort: record?.reasoning_effort,
      })
    })
  }

  // 先检查团队级本身是否只传了半边参数，避免被全员覆盖掩盖掉无效团队参数
  if (hasModelSelectionRequest(normalizedTeam) && (normalizedTeam.provider === undefined || normalizedTeam.model === undefined)) {
    const hint = hasRouteDiscoveryTool(ctx, agent, toolSet) ? formatHost(locale, 'error.routeDiscoveryHint') : ''
    throw new Error(formatHost(
      locale,
      normalizedTeam.reasoning_effort === undefined ? 'error.modelPairRequired' : 'error.reasoningRequiresRoute',
      { hint },
    ))
  }

  const perMember = targets.map(target => ({
    slug: target.slug,
    request: mergeTeamMemberModelRequest(normalizedTeam, overrides.get(target.slug)),
  }))

  if (perMember.every(item => !hasModelSelectionRequest(item.request))) {
    return result
  }

  // 相同路线的预检共享同一个 Promise，避免多名成员同模型时重复触发 resolveCallConfig
  const cache = new Map<string, Promise<AgentOptions | undefined>>()
  for (const item of perMember) {
    if (!hasModelSelectionRequest(item.request)) continue
    const resolved = await resolveChildModelOptionsCached({
      ctx,
      providerName,
      agent,
      request: item.request,
      locale,
      signal,
      toolSet,
    }, cache)
    if (resolved !== undefined) result.set(item.slug, resolved)
  }

  return result
}
