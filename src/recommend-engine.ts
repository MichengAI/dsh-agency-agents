import { normalizeExpertQuery, type ExpertSearchable } from './client/index.js'
import type { ExpertTeam } from './team-contract.js'

export interface RecommendCandidate {
  readonly id: string
  readonly name: string
  readonly kind: 'expert' | 'team'
  readonly emoji: string
  readonly division: string
  readonly reason: string
  readonly score: number
  readonly expertSlug?: string
  readonly team?: ExpertTeam
}

export interface RecommendOptions {
  readonly draft: string
  readonly experts: readonly ExpertSearchable[]
  readonly teams: readonly ExpertTeam[]
  readonly enabledExpertSlugs: ReadonlySet<string>
  readonly enabledTeamIds: ReadonlySet<string>
  readonly activeLocale: 'zh' | 'en'
  readonly maxCount?: number
  readonly excludeSlugs?: ReadonlySet<string>
}

/** 常见停用词/无实体特征词汇过滤 */
const STOP_WORDS = new Set([
  '帮我', '我想', '请你', '一下', '这个', '那个', '怎么', '如何', '一个', '能够', '可以', '需要', '进行', '看看',
  'help', 'please', 'want', 'need', 'this', 'that', 'with', 'about', 'how', 'make', 'create', 'check'
])

/**
 * 从用户草稿中快速提炼代表性关键词与短语（零外部依赖，极速纯字符串运算）。
 */
export function extractTaskKeywords(draft: string): string[] {
  const normalized = normalizeExpertQuery(draft)
  if (!normalized) return []

  const terms: string[] = []
  // 提取英文单词 (长度 >= 2)
  const enWords = normalized.match(/[a-z0-9_-]{2,}/gu) ?? []
  for (const w of enWords) {
    if (!STOP_WORDS.has(w)) terms.push(w)
  }

  // 提取中文词块（按标点/空格切分）
  const zhChunks = normalized.replace(/[a-z0-9_\-\s]+/gu, ' ').split(/[\s,，.。!！?？;；:：、/\\|（）()\[\]【】]+/gu).filter(Boolean)
  for (const chunk of zhChunks) {
    if (chunk.length < 2) continue
    if (STOP_WORDS.has(chunk)) continue
    terms.push(chunk)
    // 生成 2~4 字的短语组合切片
    for (let len = 2; len <= Math.min(4, chunk.length - 1); len++) {
      for (let i = 0; i <= chunk.length - len; i++) {
        const sub = chunk.slice(i, i + len)
        if (!STOP_WORDS.has(sub)) terms.push(sub)
      }
    }
  }

  return Array.from(new Set(terms))
}

/**
 * 根据任务草稿本地评估最匹配的专家与专家团。
 * 严格保持纯函数、无副作用、零模型消耗，耗时控制在 < 5ms 内。
 */
export function recommendExpertsForTask(options: RecommendOptions): RecommendCandidate[] {
  const { draft, experts, teams, enabledExpertSlugs, enabledTeamIds, activeLocale, maxCount = 3, excludeSlugs } = options
  const keywords = extractTaskKeywords(draft)
  if (keywords.length === 0) return []

  const candidates: RecommendCandidate[] = []
  const isZh = activeLocale === 'zh'

  // 1. 评估已启用单兵专家
  for (const expert of experts) {
    if (!enabledExpertSlugs.has(expert.slug)) continue
    if (excludeSlugs?.has(expert.slug)) continue

    const name = isZh ? (expert.name || expert.nameEn) : (expert.nameEn || expert.name)
    const desc = isZh ? (expert.description || expert.descriptionEn) : (expert.descriptionEn || expert.description)
    const nameLower = name.toLowerCase()
    const descLower = desc.toLowerCase()
    const slugLower = expert.slug.toLowerCase()

    let score = 0
    const matchedTerms: string[] = []

    for (const kw of keywords) {
      if (nameLower.includes(kw)) {
        score += 25
        matchedTerms.push(kw)
      } else if (slugLower.includes(kw)) {
        score += 20
        matchedTerms.push(kw)
      } else if (descLower.includes(kw)) {
        score += 10
        matchedTerms.push(kw)
      }
    }

    // 置信度阈值：至少命中一个关键词（且分数 >= 10）
    if (score >= 10 && matchedTerms.length > 0) {
      // 理由中优先展示更有信息量的词汇（过滤掉单字重叠碎片，按长度降序展示）
      const sortedTerms = Array.from(new Set(matchedTerms)).sort((a, b) => b.length - a.length)
      const uniqueMatched = sortedTerms.slice(0, 3)
      const reason = isZh
        ? `匹配技能关键词：${uniqueMatched.join('、')}`
        : `Matches keywords: ${uniqueMatched.join(', ')}`

      candidates.push({
        id: expert.slug,
        name,
        kind: 'expert',
        emoji: '🧩',
        division: expert.division,
        reason,
        score,
        expertSlug: expert.slug,
      })
    }
  }

  // 2. 评估已启用专家团
  for (const team of teams) {
    if (!enabledTeamIds.has(team.id)) continue
    if (excludeSlugs?.has(team.id)) continue

    const teamText = `${team.name} ${team.description} ${team.goal} ${(team.tags ?? []).join(' ')}`.toLowerCase()
    let score = 0
    const matchedTerms: string[] = []

    for (const kw of keywords) {
      if (teamText.includes(kw)) {
        score += 12
        matchedTerms.push(kw)
      }
    }

    // 团队若明确匹配用户提到的多角色协作需求，给予适当加权
    if (draft.includes('团队') || draft.includes('team') || draft.includes('评审团') || draft.includes('组队')) {
      score += 15
    }

    if (score >= 15 && matchedTerms.length > 0) {
      const uniqueMatched = Array.from(new Set(matchedTerms)).slice(0, 3)
      const reason = isZh
        ? `团队目标匹配：${uniqueMatched.join('、')} 等多领域协作`
        : `Team goal matches: ${uniqueMatched.join(', ')}`

      candidates.push({
        id: team.id,
        name: team.name,
        kind: 'team',
        emoji: '👥',
        division: 'team',
        reason,
        score,
        team,
      })
    }
  }

  // 按分数降序排列，取 Top-K
  return candidates.sort((a, b) => b.score - a.score).slice(0, maxCount)
}
