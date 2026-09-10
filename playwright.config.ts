import { defineConfig } from '@playwright/test'

const port = Number(process.env.AGENCY_BROWSER_TEST_PORT ?? 18769)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('浏览器测试端口必须在 1–65535 之间')
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './test/browser',
  use: { baseURL, browserName: 'chromium' },
  webServer: { command: 'node scripts/serve-browser-tests.mjs', url: baseURL, reuseExistingServer: false },
  reporter: 'list'
})
