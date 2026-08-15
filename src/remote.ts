import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { TypertContribution } from '@deepseek-ai/dsh-typert-registry'
import type {} from '@deepseek-ai/dsh-typert-registry'
import { AGENCY_AGENTS_DESCRIPTORS } from './remote-contract.js'

/**
 * Host 严格描述符。Gateway 优先读取它，避免启动期间的 SRC 扫描缓存遗漏
 * 后加载的外部插件服务。
 */
const TYPERT = {
  package: '@michengai/dsh-agency-agents',
  face: 'host',
  schemas: [],
  model: { services: [], events: [], objects: [] },
  invocations: AGENCY_AGENTS_DESCRIPTORS,
} satisfies TypertContribution

/** 供客户端读取和保存已启用专家的顶层 Host Remote 服务。 */
export default class AgencyAgentsRemote extends TypertRemoteService {
  static inject = ['settings', 'typert']

  constructor(ctx: Context) {
    super(ctx, 'agencyAgents')
    this.ctx.typert.register(TYPERT)
  }

  /** 读取当前启用的专家 slug 列表。 */
  @Remote('getEnabled')
  getEnabled(): { enabled: string[]; revision: number } {
    const value = this.ctx.settings.get(settingsNamespace('agency-agents')) as { enabled?: unknown } | undefined
    const enabled = value?.enabled
    const descriptor = this.ctx.settings.describe().find((candidate) => candidate.ns === settingsNamespace('agency-agents'))
    if (descriptor === undefined) throw new Error('agency-agents 设置区尚未注册')
    return {
      enabled: Array.isArray(enabled) ? enabled.filter((slug): slug is string => typeof slug === 'string') : [],
      revision: descriptor.revision,
    }
  }

  /** 整体替换启用的专家 slug 列表。 */
  @Remote('setEnabled')
  async setEnabled(enabled: string[], expectedRevision: number): Promise<{ enabled: string[]; revision: number }> {
    await this.ctx.settings.mutate(settingsNamespace('agency-agents'), [{ op: 'set', path: ['enabled'], value: enabled }], expectedRevision)
    return this.getEnabled()
  }
}
