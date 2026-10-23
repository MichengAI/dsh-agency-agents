import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { resolveApiUrl } from './api-base.js'

describe('resolveApiUrl (API 基址反代解析)', () => {
  const originalDocument = Object.prototype.hasOwnProperty.call(globalThis, 'document')
    ? (globalThis as unknown as { document?: unknown }).document
    : undefined

  function setDocumentBase(baseURI: string | undefined): void {
    if (baseURI === undefined) {
      delete (globalThis as unknown as { document?: unknown }).document
    } else {
      (globalThis as unknown as { document: { baseURI: string } }).document = { baseURI }
    }
  }

  afterEach(() => {
    if (originalDocument === undefined) {
      delete (globalThis as unknown as { document?: unknown }).document
    } else {
      (globalThis as unknown as { document: unknown }).document = originalDocument
    }
  })

  it('无 document 环境下原样返回路径', () => {
    setDocumentBase(undefined)
    expect(resolveApiUrl('/api/michengai/dsh-agency-agents/update')).toBe('/api/michengai/dsh-agency-agents/update')
  })

  it('站点根路径 (https://domain.com/) 下正确解析为绝对 URL', () => {
    setDocumentBase('https://domain.com/')
    expect(resolveApiUrl('/api/michengai/dsh-agency-agents/update')).toBe('https://domain.com/api/michengai/dsh-agency-agents/update')
  })

  it('反向代理子路径带斜杠 (https://domain.com/app/dsh/) 下保留前缀', () => {
    setDocumentBase('https://domain.com/app/dsh/')
    expect(resolveApiUrl('/api/michengai/dsh-agency-agents/update')).toBe('https://domain.com/app/dsh/api/michengai/dsh-agency-agents/update')
  })

  it('反向代理子路径无斜杠 (https://domain.com/app/dsh) 自动补齐斜杠并保留前缀', () => {
    setDocumentBase('https://domain.com/app/dsh')
    expect(resolveApiUrl('/api/michengai/dsh-agency-agents/update')).toBe('https://domain.com/app/dsh/api/michengai/dsh-agency-agents/update')
  })

  it('相对路径、完整 URL 与协议相对 URL 原样返回', () => {
    setDocumentBase('https://domain.com/app/dsh/')
    expect(resolveApiUrl('api/update')).toBe('api/update')
    expect(resolveApiUrl('https://other.com/api/test')).toBe('https://other.com/api/test')
    expect(resolveApiUrl('//cdn.example.com/asset.js')).toBe('//cdn.example.com/asset.js')
  })

  it('baseURI 非法时原样返回', () => {
    setDocumentBase('not-a-valid-url')
    expect(resolveApiUrl('/api/test')).toBe('/api/test')
  })
})
