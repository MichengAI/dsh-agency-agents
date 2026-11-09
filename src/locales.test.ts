import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { de, en, es, fr, ja, pt, ru, zh } from './client/locales.js'

describe('多语言 i18n 完整性门禁', () => {
  const languages = { zh, en, ja, es, fr, de, ru, pt } as const
  const langKeys = Object.keys(languages) as Array<keyof typeof languages>
  const baselineKeys = Object.keys(zh).sort()

  it('官方全部 8 门语言完整导出且键集严格一致', () => {
    expect(baselineKeys.length).toBe(137)
    for (const lang of langKeys) {
      const currentDict = languages[lang]
      const currentKeys = Object.keys(currentDict).sort()
      expect(currentKeys).toEqual(baselineKeys)
    }
  })

  it('关键占位符在 8 门语言中均完整保留且未破坏', () => {
    const placeholderKeys = [
      'settings.promptTitle',
      'settings.empty',
      'settings.bulk.enableFiltered',
      'settings.bulk.disableFiltered',
      'settings.bulk.enableAll',
      'settings.bulk.enableConfirm',
      'settings.bulk.disableConfirm',
    ]

    for (const key of placeholderKeys) {
      const zhVal = zh[key as keyof typeof zh]
      const placeholders = (zhVal.match(/\{(\w+)\}/gu) ?? []).sort()
      expect(placeholders.length).toBeGreaterThan(0)

      for (const lang of langKeys) {
        const val = languages[lang][key as keyof typeof zh]
        const langPlaceholders = (val.match(/\{(\w+)\}/gu) ?? []).sort()
        expect(langPlaceholders, `语言 ${lang} 的 ${key} 占位符不匹配`).toEqual(placeholders)
      }
    }
  })

  it('元数据 JSON 文件 8 门语言全量对齐', () => {
    for (const lang of langKeys) {
      const rootPath = `locale/${lang}.json`
      expect(existsSync(rootPath), `${rootPath} 应该存在`).toBe(true)
      const rootJson = JSON.parse(readFileSync(rootPath, 'utf8'))
      expect(rootJson.meta.title).toBeTruthy()
      expect(rootJson.meta.description).toBeTruthy()
      expect(rootJson.meta.detail).toBe(`README.${lang === 'zh' ? 'zh-CN' : lang}.md`)

      const remotePath = `locale/remote/${lang}.json`
      expect(existsSync(remotePath), `${remotePath} 应该存在`).toBe(true)
      const remoteJson = JSON.parse(readFileSync(remotePath, 'utf8'))
      expect(remoteJson.meta.title).toBeTruthy()
      expect(remoteJson.meta.description).toBeTruthy()
    }
  })

  it('全部 8 门语言 README 均存在且包含统一导航条', () => {
    const navText = '[简体中文](README.zh-CN.md) · [English](README.en.md) · [日本語](README.ja.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)'

    const readmeFiles = [
      'README.md',
      'README.zh-CN.md',
      'README.en.md',
      'README.ja.md',
      'README.es.md',
      'README.fr.md',
      'README.de.md',
      'README.ru.md',
      'README.pt.md',
    ]

    for (const file of readmeFiles) {
      expect(existsSync(file), `${file} 应该存在`).toBe(true)
      const content = readFileSync(file, 'utf8')
      expect(content).toContain(navText)
    }
  })
})
