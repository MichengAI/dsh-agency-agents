import { expect, test } from '@playwright/test'

for (const shell of ['region', 'dialog']) {
  test(`无可用专家时跳转到异步挂载的设置专家页：${shell}`, async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => 'openAgentSettings' in window)
    await page.evaluate((shell) => {
      document.body.innerHTML = '<button aria-label="设置">设置</button><div data-composer-card><button id="experts">专家</button></div>'
      document.querySelector('button')!.onclick = () => {
        setTimeout(() => {
          const section = document.createElement('section')
          section.setAttribute('role', shell)
          if (shell === 'region') section.setAttribute('data-dcu-settings-page', '')
          section.innerHTML = '<nav><button>专家</button></nav><main>通用设置</main>'
          section.querySelector('button')!.onclick = () => { section.querySelector('main')!.textContent = '专家设置' }
          document.body.append(section)
        }, 100)
      }
      document.getElementById('experts')!.onclick = () => {
        (window as unknown as { openAgentSettings(label: string): boolean }).openAgentSettings('专家')
      }
    }, shell)
    await page.locator('#experts').click()
    await expect(page.locator('main')).toHaveText('专家设置')
  })
}

test('Codex UI 优先通过分区事件直接打开专家，不点击通用设置', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => 'openAgentSettings' in window)
  const result = await page.evaluate(() => {
    document.body.innerHTML = '<button data-dcu-settings-trigger aria-label="设置">设置</button>'
    const trigger = document.querySelector('button')!
    let clicks = 0
    let labels: string[] = []
    trigger.onclick = () => { clicks++ }
    trigger.addEventListener('dcu-settings-open-section', event => {
      labels = (event as CustomEvent<{ labels: string[] }>).detail.labels
      event.preventDefault()
    })
    const opened = (window as unknown as { openAgentSettings(label: string): boolean }).openAgentSettings('专家')
    return { opened, clicks, labels }
  })
  expect(result).toEqual({ opened: true, clicks: 0, labels: ['专家'] })
})
