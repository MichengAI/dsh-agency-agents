import { Context } from '@deepseek-ai/cordis'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { describe, expect, it, vi } from 'vitest'
import * as host from './i18n.js'
import { enHost, formatHost, localizedDivision, localizedExpertDescription, localizedExpertName, matchDivision, renderExpertList, renderSummonResults, resolveHostLocale } from './i18n.js'
import { EN_DIVISION } from './names.js'

describe('Agency host locale', () => {
  it.each([
    ['pt', 'pt'], [' PT-br ', 'pt'], ['pt-PT', 'pt'], ['es', 'es'], ['es-419', 'es'],
    ['zh-Hant-TW', 'zh'], ['en-GB', 'en'], ['ptx', 'en'], ['es-', 'en'], ['pt--BR', 'en'],
    ['zh-汉字', 'en'], ['fr-FR', 'en'], ['', 'en'], [undefined, 'en'], [42, 'en'],
  ])('normalizes %s to %s', (value, expected) => {
    expect(resolveHostLocale(value)).toBe(expected)
  })

  it('reads wide settings with an English fallback and retains the legacy projection', () => {
    expect(host.readAgencyLocale).toBeTypeOf('function')
    expect(host.readAgencyLocale({ settings: { get: () => ({ preference: 'pt-BR' }) } })).toBe('pt')
    expect(host.readAgencyLocale({ settings: { get: () => undefined, describe: () => [
      { ns: 'other', value: { preference: 'zh' } }, { ns: 'locale', value: { preference: 'es-MX' } },
    ] } })).toBe('es')
    expect(host.readAgencyLocale({ settings: { get: () => null } })).toBe('en')
    expect(host.readAgencyLocale({ settings: { get: () => { throw new Error('missing') } } })).toBe('en')
    expect(host.readHostLocale({ settings: { get: () => ({ preference: 'pt-BR' }) } })).toBe('en')
  })

  it('updates the wide runtime snapshot without projecting settings on each read', async () => {
    expect(host.createAgencyLocaleReader).toBeTypeOf('function')
    const ctx = new Context()
    let preference = 'pt-BR'
    let fastPreference: string | undefined
    const notify = () => ctx.emit('settings/document-updated', 'locale' as SettingsNamespace, 1)
    const describeSettings = vi.fn(() => {
      notify() // describe can itself emit updates; the reader must not re-enter.
      return [{ ns: 'locale', value: { preference } }]
    })
    try {
      const read = host.createAgencyLocaleReader({
        settings: { get: () => fastPreference === undefined ? undefined : { preference: fastPreference }, describe: describeSettings },
        on: ctx.on.bind(ctx), effect: ctx.effect.bind(ctx),
      } as unknown as typeof ctx)
      expect([read(), read(), read()]).toEqual(['pt', 'pt', 'pt'])
      expect(describeSettings).toHaveBeenCalledTimes(1)
      preference = 'es-419'
      notify()
      notify()
      expect(read()).toBe('pt')
      await Promise.resolve()
      expect(read()).toBe('es')
      expect(describeSettings).toHaveBeenCalledTimes(2)
      fastPreference = 'zh-CN'
      expect(read()).toBe('zh')
      expect(describeSettings).toHaveBeenCalledTimes(2)
    } finally {
      await ctx.fiber.dispose()
    }
  })

  it.each([['pt', 'Engenharia'], ['es', 'Ingeniería']] as const)('shows %s division labels', (locale, label) => {
    expect(localizedDivision('engineering', locale)).toBe(label)
    expect(localizedDivision('my-own-division', locale)).toBe('my-own-division')
    expect(localizedDivision('constructor', locale)).toBe('constructor')
    expect(matchDivision(' ' + label.toUpperCase() + ' ', 'engineering')).toBe(true)
  })

  it.each(['pt', 'es'] as const)('covers every host message and division in %s', (locale) => {
    for (const key of Object.keys(enHost) as (keyof typeof enHost)[]) {
      const text = formatHost(locale, key)
      expect(text, key).not.toMatch(/[\u3400-\u9fff]/u)
      expect(text.match(/\{\w+\}/g)?.sort() ?? [], key).toEqual(enHost[key].match(/\{\w+\}/g)?.sort() ?? [])
      if (key !== 'list.group') expect(text, key).not.toBe(enHost[key])
    }
    for (const division of Object.keys(EN_DIVISION)) expect(localizedDivision(division, locale), division).not.toBe(division)
  })

  it('renders localized grouping and keeps a custom name and description unchanged', () => {
    const expert = { name: 'Revisora de código', emoji: '🧩', description: 'Texto original {count} $&' }
    expect(renderExpertList('pt', {}, { divisions: [{ division: 'engineering', count: 1, experts: [expert] }], total: 1 }))
      .toBe('Especialistas: 1 · Áreas: 1\n## Engenharia (1)\n- 🧩 Revisora de código — Texto original {count} $&')
  })

  it('renders the Spanish failure wrapper without translating answer or error data', () => {
    expect(renderSummonResults('es', [
      { expert: 'Rui', ok: true, answer: '答案 $&' },
      { expert: 'Ana', ok: false, answer: '', error: 'Falha {error} $&' },
    ])).toBe('## Rui\n答案 $&\n\n## Ana\nError: Falha {error} $&')
  })

  it('only interpolates template tokens and preserves replacement syntax in supplied data', () => {
    expect(formatHost('en', 'error.rootMissing', { root: '$& {env}', env: 'AGENCY_ROOT' }))
      .toContain('missing or inaccessible: "$& {env}". Set AGENCY_ROOT')
    expect(formatHost('en', 'list.heading', { total: 0 })).toBe('0 experts across {count} divisions:')
  })

  it.each(['en', 'pt', 'es'] as const)('uses the English persona display fields for %s when provided', (locale) => {
    const stock = { name: '工程师', nameEn: 'Engineer', description: '原文', descriptionEn: 'English summary' }
    expect(localizedExpertName(stock, locale)).toBe('Engineer')
    expect(localizedExpertDescription(stock, locale)).toBe('English summary')
    expect(localizedExpertDescription({ ...stock, descriptionEn: '' }, locale)).toBe('原文')
    expect(localizedExpertDescription({ description: '原文' }, locale)).toBe('原文')
  })

  it('keeps the existing Chinese persona fields', () => {
    expect(localizedExpertName({ name: '工程师', nameEn: 'Engineer' }, 'zh')).toBe('工程师')
    expect(localizedExpertDescription({ description: '原文', descriptionEn: 'English summary' }, 'zh')).toBe('原文')
  })

  it.each(['zh', 'en', 'pt', 'es'] as const)('preserves custom persona data in %s', (locale) => {
    const custom = { name: 'Análise técnica', nameEn: 'Análise técnica', description: 'Não alterar $&', descriptionEn: '' }
    expect(localizedExpertName(custom, locale)).toBe(custom.name)
    expect(localizedExpertDescription(custom, locale)).toBe(custom.description)
  })
})
