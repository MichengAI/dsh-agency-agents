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

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** agency-agents 客户端词条命名空间。 */
    agency: AgencyKey
  }
}

