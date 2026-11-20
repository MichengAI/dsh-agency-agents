/** Locales supported by Agency's first-party host workflows. */
export type AgencyLocale = 'zh' | 'en' | 'pt' | 'es'

/** Normalize explicit language tags; missing or unsupported preferences use English. */
export function normalizeAgencyLocale(value: unknown): AgencyLocale {
  if (typeof value !== 'string') return 'en'
  const tag = value.trim().toLowerCase()
  const [language] = tag.split('-', 1)
  if (language !== 'zh' && language !== 'pt' && language !== 'es' && language !== 'en') return 'en'
  if (language === tag) return language
  try {
    Intl.getCanonicalLocales(tag)
    return language
  } catch {
    return 'en'
  }
}

/** PT/ES host text is localized, but bundled persona assets are still EN/ZH. */
export function personaLocale(locale: AgencyLocale): 'zh' | 'en' {
  return locale === 'zh' ? 'zh' : 'en'
}
