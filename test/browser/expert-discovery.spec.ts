import { expect, test } from '@playwright/test'

test('UI 搜索按英文词匹配，名称优先且结果不超过八位', async ({ page }) => {
  await page.goto('/?discovery&blank')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await page.getByRole('searchbox').fill('UI')
  const rows = page.locator('.aag-discovery-row')
  await expect(rows.first()).toContainText('UI 设计师')
  expect(await rows.count()).toBeLessThanOrEqual(8)
  await rows.first().click()
  await expect(page.getByLabel('任务草稿')).not.toBeEmpty()
})

for (const width of [375, 1280]) {
  test(`${width}px 视口长列表限制高度，搜索栏固定且结果可滚动`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/?discovery&all')
    await page.getByRole('button', { name: '专家', exact: true }).click()
    const menu = await page.getByRole('dialog').boundingBox()
    expect(menu!.height).toBeLessThanOrEqual(360)
    await expect(page.getByRole('searchbox')).toBeVisible()
    const results = page.locator('.aag-discovery-results')
    expect(await results.evaluate(e => e.scrollHeight > e.clientHeight)).toBe(true)
    await page.locator('.aag-discovery-row').last().scrollIntoViewIfNeeded()
    await expect(page.getByRole('searchbox')).toBeVisible()
    await page.getByRole('searchbox').fill('engineering')
    await expect(page.locator('.aag-discovery-row')).toHaveCount(8)
  })
}

test('搜索未启用专家并启用选择，保留草稿及附件', async ({ page }) => {
  await page.goto('/?discovery')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  const search = page.getByRole('searchbox')
  await expect(search).toBeFocused()
  await expect(page.getByRole('button', { name: '浏览全部', exact: true })).toHaveCount(0)
  await expect(page.locator('.aag-discovery-row .aag-emoji')).toHaveCount(1)
  await search.fill('UX Researcher')
  await page.getByRole('button', { name: /UX 研究员.*启用并选择/ }).click()
  await expect(page.getByLabel('已选专家')).not.toBeEmpty()
  await expect(page.getByLabel('任务草稿')).toHaveValue('保留已有需求')
  await expect(page.getByLabel('任务草稿')).toBeFocused()
  await expect(page.getByText('附件：需求.md')).toBeVisible()
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await expect(page.getByText('UX Researcher', { exact: true })).toHaveCount(0)
  await expect(page.locator('.aag-discovery-row')).toHaveCount(2)
})

test('名册读取失败可原地刷新恢复', async ({ page }) => {
  await page.goto('/?discovery&load-fail')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('名册连接暂时不可用')
  await page.getByRole('button', { name: '刷新', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.locator('.aag-discovery-row')).toHaveCount(1)
})

test('启用期间关闭面板不再向草稿插入标签', async ({ page }) => {
  await page.goto('/?discovery&slow')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await page.getByRole('searchbox').fill('UX Researcher')
  await page.getByRole('button', { name: /UX 研究员.*启用并选择/ }).click()
  await page.getByRole('searchbox').press('Escape')
  await expect.poll(() => page.evaluate(() => (window as unknown as {
    discoveryState(): { snapshot: { revision: number } }
  }).discoveryState().snapshot.revision)).toBe(1)
  await expect(page.getByLabel('已选专家')).toBeEmpty()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('启用冲突刷新后可重试，不覆盖其他窗口的启用项', async ({ page }) => {
  await page.goto('/?discovery&conflict')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await page.getByRole('searchbox').fill('UX Researcher')
  await page.getByRole('button', { name: /UX 研究员.*启用并选择/ }).click()
  await expect(page.getByRole('alert')).toContainText('已为您刷新')
  await expect(page.getByLabel('已选专家')).toBeEmpty()
  await expect(page.getByRole('searchbox')).toHaveValue('UX Researcher')
  await page.getByRole('button', { name: /UX 研究员.*启用并选择/ }).click()
  await expect(page.getByLabel('已选专家')).not.toBeEmpty()
  const enabled = await page.evaluate(() => (window as unknown as {
    discoveryState(): { snapshot: { enabled: string[] } }
  }).discoveryState().snapshot.enabled)
  expect(enabled).toEqual(expect.arrayContaining(['engineering-code-reviewer', 'design-ui-designer', 'design-ux-researcher']))
})

test('启用成功但插入失败时准确反馈，重试不重复写入', async ({ page }) => {
  await page.goto('/?discovery&empty&insert-fail')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await page.getByRole('searchbox').fill('UX Researcher')
  await page.getByRole('button', { name: /UX 研究员.*启用并选择/ }).click()
  await expect(page.getByRole('alert')).toContainText('已启用，但未能插入')
  await page.getByRole('button', { name: 'UX 研究员', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('未能插入')
  expect(await page.evaluate(() => (window as unknown as { discoveryState(): { writes: number } }).discoveryState().writes)).toBe(1)
})

test('空白正文选择专家后自动填入示例，原生标签及附件保留', async ({ page }) => {
  await page.goto('/?discovery&empty&blank')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await expect(page.locator('.aag-discovery-row')).toHaveCount(0)
  await page.getByRole('searchbox').fill('UX Researcher')
  await expect(page.getByRole('button', { name: '复制示例' })).toHaveCount(0)
  await page.getByRole('button', { name: /UX 研究员.*启用并选择/ }).click()
  await expect(page.getByLabel('任务草稿')).toHaveValue(/用户反馈/)
  await expect(page.getByLabel('已选专家')).toContainText('UX 研究员')
  await expect(page.getByText('附件：需求.md')).toBeVisible()
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await page.getByRole('searchbox').press('Escape')
  await expect(page.getByRole('button', { name: '专家', exact: true })).toBeFocused()
})

test('手机英文入口保持紧凑并处理无结果', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/?discovery&en')
  await page.getByRole('button', { name: 'Experts', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Browse all', exact: true })).toHaveCount(0)
  await expect(page.locator('.aag-discovery-row')).toHaveCount(1)
  const bounds = await page.getByRole('dialog').boundingBox()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(375)
  await page.getByRole('searchbox').fill('no-matching-expert-xyz')
  await expect(page.getByText('No matching experts. Try a different keyword.')).toBeVisible()
})
