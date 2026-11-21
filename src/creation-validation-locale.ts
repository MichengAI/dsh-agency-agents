import { en, es, pt, zhCN } from 'zod/locales'
import type { AgencyLocale } from './agency-locale.js'
import type { DraftValidationReason } from './creation-contract.js'
import { draftCopy, formatDraft } from './creation-locale.js'

const COPY = {
  zh: {
    notObject: "草案必须是对象。",
    unknownDivision: "专家分类「{value}」不存在（{path}）。",
    unknownMember: "专家成员「{value}」不存在于当前专家库中（{path}）。",
    invalidField: "字段「{path}」不合法",
    root: "根对象",
    schema: zhCN().localeError,
  },
  en: {
    notObject: "Draft must be an object.",
    unknownDivision: "Division “{value}” does not exist ({path}).",
    unknownMember: "Expert “{value}” is not in the catalog ({path}).",
    invalidField: "Invalid field “{path}”",
    root: "root object",
    schema: en().localeError,
  },
  pt: {
    notObject: "O rascunho deve ser um objeto.",
    unknownDivision: "A área “{value}” não existe ({path}).",
    unknownMember: "O especialista “{value}” não está no catálogo ({path}).",
    invalidField: "Campo “{path}” inválido",
    root: "objeto raiz",
    schema: pt().localeError,
  },
  es: {
    notObject: "El borrador debe ser un objeto.",
    unknownDivision: "El área «{value}» no existe ({path}).",
    unknownMember: "El experto «{value}» no está en el catálogo ({path}).",
    invalidField: "Campo «{path}» no válido",
    root: "objeto raíz",
    schema: es().localeError,
  },
} satisfies Record<AgencyLocale, object>

export function formatDraftValidation(locale: AgencyLocale, reason: DraftValidationReason): string {
  const copy = COPY[locale]
  let detail: string
  if (reason.code === 'notObject') detail = copy.notObject
  else if (reason.code === 'invalidField') {
    detail = formatDraft(copy.invalidField, { path: reason.path || copy.root })
    // Use the locale map directly, never Zod global configuration or preformatted issue.message.
    // Finalized issues retain the original code/metadata; reportInput keeps the raw input.
    const issue = reason.issue
    const error = issue && copy.schema({ ...issue, input: issue.input } as Parameters<typeof copy.schema>[0])
    if (error) detail += `: ${typeof error === 'string' ? error : error.message}`
  } else detail = formatDraft(copy[reason.code], reason)
  return `${draftCopy(locale).invalid}: ${detail}`
}
