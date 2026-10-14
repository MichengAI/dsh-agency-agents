import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

const source = readFileSync(new URL('./client/index.ts', import.meta.url), 'utf8')

it('专家设置分区固定为 order 20，避免和插件配置的 16 撞号', () => {
  const registration = source.match(/id:\s*'agency-agents',\s*order:\s*(\d+)/)
  expect(registration?.[1]).toBe('20')
})
