import { ROSTER } from '../../src/client/roster'
import { BUILTIN_TEAMS } from '../../src/team-contract'
import { test, expect } from '@playwright/test'

test('支持但未启用原生团队时建议开启，不阻断专家团操作', async ({ page }) => {
  await page.goto('/?teams&settings&teamDisabled')
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  await expect(page.getByRole('note')).toContainText('建议在插件页开启 Agent Team 的 Host 与 Web 层')
  await page.getByRole('button', { name: '新建专家团', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('团队编辑保留停用状态，配置冲突先核对再保存', async ({ page }) => {
  await page.goto('/?teams&settings&deleteFailure')
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  const first = page.getByTestId('team-card').first()
  await first.getByRole('button', { name: '复制并自定义', exact: true }).click()
  await page.getByLabel('团队名称', { exact: true }).fill('流程验收团')
  await page.getByRole('button', { name: '保存', exact: true }).click()
  const card = page.getByTestId('team-card').filter({ hasText: '流程验收团' })
  await expect(card.getByRole('switch')).not.toBeChecked()
  await card.getByRole('button', { name: '编辑专家团', exact: true }).click()
  await page.getByLabel('一句话简介', { exact: true }).fill('我的草稿简介')
  await page.evaluate(() =>
    (
      window as unknown as { teamFixtureConflict(): void }
    ).teamFixtureConflict(),
  )
  await page.getByRole('button', { name: '保存修改', exact: true }).click()
  await expect(
    page.getByRole('button', { name: '保存修改', exact: true }),
  ).toBeDisabled()
  await page.getByRole('button', { name: '读取最新配置', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('其他窗口更新的简介')
  await expect(page.getByLabel('一句话简介', { exact: true })).toHaveValue(
    '我的草稿简介',
  )
  await page.getByRole('button', { name: '保留我的草稿' }).click()
  await page.getByRole('button', { name: '保存修改', exact: true }).click()
  await expect(card).toContainText('我的草稿简介')
  await expect(card.getByRole('switch')).not.toBeChecked()
  await card.getByRole('button', { name: '删除专家团', exact: true }).click()
  const confirmation = page.getByRole('dialog', { name: '删除专家团？' })
  await confirmation.getByRole('button', { name: '确认删除' }).click()
  await expect(confirmation.getByRole('alert')).toContainText('删除失败')
  await confirmation.getByRole('button', { name: '确认删除' }).click()
  await expect(confirmation).toHaveCount(0)
  await expect(card).toHaveCount(0)
})

test('专家团复用专家的筛选、卡片操作和编辑抽屉', async ({ page }) => {
  await page.setViewportSize({ width: 910, height: 887 })
  await page.goto('/?teams&settings')
  await page.getByRole('button', { name: '新建专家', exact: true }).click()
  const expertDrawer = await page.getByRole('dialog').boundingBox()
  await page.screenshot({ path: 'test-results/expert-editor-unified.png' })
  await page.keyboard.press('Escape')
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  await expect(
    page.getByRole('button', { name: '新建专家团', exact: true }),
  ).toBeVisible()
  const card = page.getByTestId('team-card').first()
  await expect(card.getByRole('switch')).toBeVisible()
  await expect(
    card.getByRole('button', { name: '复制提示词', exact: true }),
  ).toBeVisible()
  await card.getByRole('button', { name: '复制并自定义', exact: true }).click()
  const teamDrawer = await page.getByRole('dialog').boundingBox()
  expect(teamDrawer!.width).toBe(expertDrawer!.width)
  expect(teamDrawer!.x).toBe(expertDrawer!.x)
  await page.getByLabel('团队名称', { exact: true }).fill('统一交互测试')
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('dialog', { name: '放弃未保存修改？' }),
  ).toBeVisible()
  await page.getByRole('button', { name: '继续编辑' }).click()
  await expect(page.getByLabel('团队名称', { exact: true })).toHaveValue(
    '统一交互测试',
  )
  await page.screenshot({ path: 'test-results/team-editor-unified.png' })
})

test('专家保留原标题工具栏与来源筛选，专家团采用同一结构', async ({
  page,
}) => {
  await page.setViewportSize({ width: 910, height: 887 })
  await page.goto('/?teams&settings')
  const tabs = page.locator('main .aag-card-filters:visible')
  const title = page.locator('main section:visible .aag-title').first()
  await expect(title).toBeVisible()
  await expect(page.locator('main section:visible .aag-toolbar .aag-title')).toBeVisible()
  await expect(page.locator('main').locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) })).toBeVisible()
  await expect(page.locator('aside').getByRole('button', { name: '专家团', exact: true })).toHaveCount(0)
  await expect(page.locator('.aag-expert-card').first()).toBeVisible()
  await page.screenshot({ path: 'test-results/experts-unified.png' })
  expect((await title.boundingBox())!.y).toBeLessThan(
    (await tabs.boundingBox())!.y,
  )
  const primary = await page
    .getByRole('button', { name: '新建专家', exact: true })
    .evaluate((el) => ({
      background: getComputedStyle(el).backgroundColor,
      height: el.getBoundingClientRect().height,
    }))
  const card = await page
    .locator('.aag-expert-card')
    .first()
    .evaluate((el) => ({
      background: getComputedStyle(el).backgroundColor,
      radius: getComputedStyle(el).borderRadius,
    }))
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  await expect(page.getByTestId('team-card')).toHaveCount(5)
  expect((await title.boundingBox())!.y).toBeLessThan(
    (await tabs.boundingBox())!.y,
  )
  expect(
    await page
      .getByRole('button', { name: '新建专家团', exact: true })
      .evaluate((el) => ({
        background: getComputedStyle(el).backgroundColor,
        height: el.getBoundingClientRect().height,
      })),
  ).toEqual(primary)
  expect(
    await page
      .getByTestId('team-card')
      .first()
      .evaluate((el) => ({
        background: getComputedStyle(el).backgroundColor,
        radius: getComputedStyle(el).borderRadius,
      })),
  ).toEqual(card)
  const cards = page.getByTestId('team-card')
  expect((await cards.nth(0).boundingBox())!.y).toBe(
    (await cards.nth(1).boundingBox())!.y,
  )
  await page.screenshot({ path: 'test-results/settings-teams.png' })
  await page.setViewportSize({ width: 375, height: 812 })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375)
})


test('切换专家团后保留专家搜索和来源筛选', async ({ page }) => {
  await page.goto('/?teams&settings')
  await page.locator('#aag-filter-source').click()
  await page.getByRole('option', { name: '内置', exact: true }).click()
  await page.locator('#aag-filter-search').fill('人类学')
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家', exact: true }) }).click()
  await expect(page.locator('#aag-filter-search')).toHaveValue('人类学')
  await expect(page.locator('#aag-filter-source')).toContainText('内置')
  await expect(page.locator('.aag-expert-card:visible')).toHaveCount(1)
})

test('一级页签使用官方分段页签，与来源筛选保持紧凑层级', async ({ page }) => {
  await page.setViewportSize({ width: 910, height: 887 })
  await page.goto('/?teams&settings')
    await expect(page.getByRole('radio', { name: '专家', exact: true })).toBeChecked()
  const navigation = await page.locator('main .aag-library-navigation').boundingBox()
  const filters = await page.locator('main .aag-card-filters:visible').boundingBox()
  expect(filters!.y - navigation!.y - navigation!.height).toBeLessThanOrEqual(24)
})

test('切换团队保留同一个公共头部及宿主注入内容', async ({ page }) => {
  await page.route('**/api/plugin-update', route => route.fulfill({ json: { packageName: '@michengai/dsh-agency-agents', currentVersion: '1.0.0', latestVersion: '1.0.1', updateAvailable: true, latestCheckFailed: false, profileName: 'test', canAutoUpdate: false } }))
  await page.goto('/?teams&settings&updateUI')
  const header = page.locator('main .aag-title-row').first()
  await expect(header.locator('.mpi-version')).toHaveText('v1.0.0')
  await expect(header.locator('[data-mpi-check]')).toBeVisible()
  const before = await header.boundingBox()
  const tabsBefore = await page.getByRole('radiogroup', { name: '专家库类型' }).boundingBox()
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  await expect(header.locator('.mpi-version')).toHaveText('v1.0.0')
  await expect(header.locator('[data-mpi-check]')).toBeVisible()
  await expect(page.locator('main .aag-title-row')).toHaveCount(1)
  expect(await header.boundingBox()).toEqual(before)
  expect(await page.getByRole('radiogroup', { name: '专家库类型' }).boundingBox()).toEqual(tabsBefore)
  await expect(page.getByRole('button', { name: '新建专家团', exact: true })).toBeVisible()
  await header.locator('[data-mpi-check]').click()
  await expect(page.getByRole('dialog', { name: '专家 更新' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: '专家 更新' })).toHaveCount(0)
})

test('数量写在对应页签上，来源选项与新建同行', async ({ page }) => {
  await page.setViewportSize({ width: 910, height: 887 })
  await page.goto('/?teams&settings')
  for (const [tabName, createName, total] of [['专家', '新建专家', String(ROSTER.length)], ['专家团', '新建专家团', String(BUILTIN_TEAMS.length)]]) {
    const tab = page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: tabName, exact: true }) })
    await tab.click()
    await expect(tab).toContainText(total)
    await expect(tab).toContainText('已启用')
    const source = page.locator('#aag-filter-source:visible, #aag-team-source:visible')
    const status = page.locator('#aag-filter-status:visible, #aag-team-status:visible')
    await expect(source).toContainText('全部')
    const sourceBox = await source.boundingBox()
    const statusBox = await status.boundingBox()
    expect(sourceBox!.x).toBeLessThan(statusBox!.x)
    expect(Math.abs(sourceBox!.y + sourceBox!.height / 2 - statusBox!.y - statusBox!.height / 2)).toBeLessThanOrEqual(8)
    await expect(page.getByRole('button', { name: createName, exact: true })).toBeVisible()
  }
  await expect(page.getByText('内置 / 外部', { exact: true })).toHaveCount(0)
})
