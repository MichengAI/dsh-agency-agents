import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './test/browser',
  use: { baseURL: 'http://127.0.0.1:18769', browserName: 'chromium' },
  webServer: { command: 'node scripts/serve-browser-tests.mjs', url: 'http://127.0.0.1:18769', reuseExistingServer: false },
  reporter: 'list'
})
