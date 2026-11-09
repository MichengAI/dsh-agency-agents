import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { zh } from './locales/zh.js'
import { en } from './locales/en.js'
import { ja } from './locales/ja.js'
import { es } from './locales/es.js'
import { fr } from './locales/fr.js'
import { de } from './locales/de.js'
import { ru } from './locales/ru.js'
import { pt } from './locales/pt.js'

/** 本插件独占的界面文案命名空间。 */
export const NS = 'agency'

export { zh, en, ja, es, fr, de, ru, pt }

export type AgencyKey = keyof typeof zh

/**
 * 根据语言与数量解析专家总数统计的国际化词条键（支持俄语等多重复数规则）。
 */
export function resolveSummaryTotalKey(count: number, locale = 'en'): AgencyKey {
  try {
    const plural = new Intl.PluralRules(locale).select(count)
    if (plural === 'one') return 'summary.total.one'
    if (plural === 'few') return 'summary.total.few'
    return 'summary.total.other'
  } catch {
    return count === 1 ? 'summary.total.one' : 'summary.total.other'
  }
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** agency-agents 客户端词条命名空间。 */
    agency: AgencyKey
  }
}

