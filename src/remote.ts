import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { TypertContribution } from '@deepseek-ai/dsh-typert-registry'
import type {} from '@deepseek-ai/dsh-typert-registry'
import { AGENCY_AGENTS_DESCRIPTORS } from './remote-contract.js'
import { AGENCY_PERSONA_SERVICE, createAgencyPersonaSource, DEFAULT_DIVISIONS, resolveCatalogRoot, type AgencyPersonaSource } from './index.js'
import { formatHost, readHostLocale } from './i18n.js'
import { settingsNamespaceCompat } from './settings-compat.js'

export { readExpertPrompt, readLocalizedExpertPrompt } from './index.js'

const AGENCY_SETTINGS_NAMESPACE = settingsNamespaceCompat('agency-agents')

function personaSource(ctx: Context): AgencyPersonaSource {
  try {
    const source = ctx.get(AGENCY_PERSONA_SERVICE) as AgencyPersonaSource | undefined
    if (source !== undefined) return source
  } catch {
    // 主插件尚未挂载时保留内置目录回退，避免加载顺序影响设置页。
  }
  return createAgencyPersonaSource(resolveCatalogRoot(''), DEFAULT_DIVISIONS)
}

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
    const value = this.ctx.settings.get(AGENCY_SETTINGS_NAMESPACE) as { enabled?: unknown } | undefined
    const enabled = value?.enabled
    const descriptor = this.ctx.settings.describe().find((candidate) => candidate.ns === AGENCY_SETTINGS_NAMESPACE)
    if (descriptor === undefined) throw new Error(formatHost('zh', 'error.settingsMissing'))
    return {
      enabled: Array.isArray(enabled) ? enabled.filter((slug): slug is string => typeof slug === 'string') : [],
      revision: descriptor.revision,
    }
  }

  /** 整体替换启用的专家 slug 列表。 */
  @Remote('setEnabled')
  async setEnabled(enabled: string[], expectedRevision: number): Promise<{ enabled: string[]; revision: number }> {
    await this.ctx.settings.mutate(AGENCY_SETTINGS_NAMESPACE, [{ op: 'set', path: ['enabled'], value: enabled }], expectedRevision)
    return this.getEnabled()
  }

  /** 按需读取一位专家的 persona 正文，避免将完整提示词随客户端名册预加载。 */
  @Remote('getPrompt')
  async getPrompt(slug: string, division: string): Promise<{ prompt: string }> {
    return personaSource(this.ctx).getPrompt(slug, division, readHostLocale(this.ctx))
  }
}
