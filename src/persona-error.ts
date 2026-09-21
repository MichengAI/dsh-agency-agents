import { teamText, type TeamLocale } from './team-i18n.js'

const messages = {
  PERSONA_NOT_FOUND: '未找到专家提示词。',
  PERSONA_READ_FAILED: '无法读取专家提示词。',
} as const

/** 仅文件不存在允许语言回退，不能把权限或文件系统故障当成缺少译文。 */
export class PersonaError extends Error {
  constructor(readonly code: keyof typeof messages, locale: TeamLocale, cause?: unknown) {
    super(teamText(locale, messages[code]), { cause })
    this.name = 'PersonaError'
  }
}
