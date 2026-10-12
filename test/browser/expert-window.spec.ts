import { expect, test } from '@playwright/test'

interface ListSample {
  windowHeight: string
  row: string
  cardHeights: number[]
  nameHeights: number[]
  overlap: number
}

async function readList(page: import('@playwright/test').Page): Promise<ListSample> {
  return page.evaluate(() => {
    const win = document.querySelector('.aag-expert-window') as HTMLElement
    const grid = win.querySelector('.aag-expert-grid') as HTMLElement
    const cards = [...win.querySelectorAll('.aag-expert-card')] as HTMLElement[]
    const row = Number.parseFloat(grid.style.gridAutoRows)
    const cardHeights = [...new Set(cards.map((card) => card.offsetHeight))]
    const nameHeights = [...new Set(cards.map((card) => (card.querySelector('.aag-card-name') as HTMLElement).offsetHeight))]
    const overlap = cards.reduce((max, card) => Math.max(max, card.offsetHeight - row), 0)
    return { windowHeight: win.style.height, row: grid.style.gridAutoRows, cardHeights, nameHeights, overlap }
  })
}

test('专家列表滚动时行高不变，短标题也预留两行', async ({ page }) => {
  await page.setViewportSize({ width: 910, height: 887 })
  await page.goto('/?teams&settings')
  await expect(page.locator('.aag-expert-window .aag-expert-card').first()).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const scroller = page.locator('.settings-window')
  const max = await scroller.evaluate((node) => node.scrollHeight - node.clientHeight)
  expect(max).toBeGreaterThan(10_000)
  const samples: ListSample[] = []
  for (const top of [0, 1, 4_000, 12_000, 11_999, Math.floor(max / 2), Math.max(0, max - 1)]) {
    await scroller.evaluate((node, value) => { node.scrollTop = value }, top)
    await page.evaluate(() => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)))
    }))
    samples.push(await readList(page))
  }
  const detail = JSON.stringify(samples)
  expect(new Set(samples.map((sample) => sample.windowHeight)).size, detail).toBe(1)
  expect(new Set(samples.map((sample) => sample.row)).size, detail).toBe(1)
  for (const sample of samples) {
    expect(sample.cardHeights, detail).toEqual([Number.parseFloat(sample.row)])
    expect(sample.overlap, detail).toBeLessThanOrEqual(0)
    expect(sample.nameHeights.every((height) => height >= 44), detail).toBe(true)
  }
})

test('单张卡片变高不会改写专家列表行高', async ({ page }) => {
  await page.setViewportSize({ width: 910, height: 887 })
  await page.goto('/?teams&settings')
  await expect(page.locator('.aag-expert-window .aag-expert-card').first()).toBeVisible()
  const before = await readList(page)
  await page.evaluate(() => {
    const card = document.querySelector('.aag-expert-window .aag-expert-card') as HTMLElement
    card.style.boxSizing = 'border-box'
    card.style.height = '280px'
    const scroller = document.querySelector('.settings-window') as HTMLElement
    scroller.scrollTop += 1
  })
  await page.evaluate(() => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)))
  }))
  const after = await readList(page)
  expect(after.row).toBe(before.row)
  expect(after.windowHeight).toBe(before.windowHeight)
})
