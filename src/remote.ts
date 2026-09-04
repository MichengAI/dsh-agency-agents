import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { TypertContribution } from '@deepseek-ai/dsh-typert-registry'
import type {} from '@deepseek-ai/dsh-typert-registry'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AGENCY_AGENTS_DESCRIPTORS } from './remote-contract.js'
import { DEFAULT_DIVISIONS, parseFrontmatter, resolveCatalogRoot, stripBom } from './index.js'
import { formatHost, readHostLocale } from './i18n.js'
import { settingsNamespaceCompat } from './settings-compat.js'

const AGENCY_SETTINGS_NAMESPACE = settingsNamespaceCompat('agency-agents')
const EXPERT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DIVISIONS = new Set(DEFAULT_DIVISIONS)
const BUNDLED_CHINESE_ROOT = fileURLToPath(new URL('../assets/agency-agents-zh/', import.meta.url))

/**
 * 只读取内置名册中的 persona 正文。先限制分区与 slug，避免 Remote 参数参与路径穿越。
 * Remote 没有插件 Config 注入，因此与浏览器名册保持一致，使用环境变量或随包目录。
 */
export async function readExpertPrompt(root: string, slug: string, division: string): Promise<{ prompt: string }> {
  if (!DIVISIONS.has(division) || !EXPERT_SLUG_PATTERN.test(slug)) {
    throw new Error('无效的专家提示词请求。')
  }
  let raw: string
  try {
    raw = stripBom(await readFile(join(root, division, `${slug}.md`), 'utf8'))
  } catch {
    throw new Error('未找到专家提示词。')
  }
  const parsed = parseFrontmatter(raw)
  if (parsed === undefined || parsed.name === undefined || parsed.description === undefined || parsed.body === '') {
    throw new Error('专家提示词格式无效。')
  }
  return { prompt: parsed.body }
}

/** 按界面语言读取 persona；中文译文缺失时回退英文原文。 */
export async function readLocalizedExpertPrompt(
  englishRoot: string,
  chineseRoot: string,
  slug: string,
  division: string,
  locale: 'zh' | 'en',
): Promise<{ prompt: string }> {
  if (locale === 'en') return readExpertPrompt(englishRoot, slug, division)
  try {
    return await readExpertPrompt(chineseRoot, slug, division)
  } catch (error: unknown) {
    if (!(error instanceof Error) || error.message !== '未找到专家提示词。') throw error
    return readExpertPrompt(englishRoot, slug, division)
  }
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
    return readLocalizedExpertPrompt(resolveCatalogRoot(''), BUNDLED_CHINESE_ROOT, slug, division, readHostLocale(this.ctx))
  }
}
