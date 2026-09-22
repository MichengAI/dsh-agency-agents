import { test, expect } from '@playwright/test'
import { join } from 'node:path'
test('五团展示、复制编辑主理人规则、启用成员与删除团队', async ({ page }) => {
  await page.goto('/?teams')
  await expect(page.getByTestId('team-card')).toHaveCount(5)
  await page
    .getByTestId('team-card')
    .filter({ hasText: '产品方案评审团' })
    .getByRole('button', { name: '查看详情' })
    .click()
  await expect(page.getByRole('dialog')).toContainText('团队帮你做')
  await page.getByRole('button', { name: '复制并自定义' }).click()
  await page.getByLabel('团队名称', { exact: true }).fill('我的产品评审团')
  await expect(page.getByRole('heading', { name: '主理人提示词', exact: true })).toBeVisible()
  await page.getByRole('region', { name: '主理人提示词' }).getByRole('button', { name: '自定义', exact: true }).click()
  await page
    .getByLabel('主理人提示词正文')
    .fill('先核对证据，再解释分歧，输出可执行结论。')
  await page.getByRole('button', { name: '保存并启用', exact: true }).click()
  await page.getByRole('button', { name: '启用团队及所需成员' }).click()
  await expect(page.getByTestId('team-card')).toHaveCount(6)
  await expect(
    page
      .getByTestId('team-card')
      .filter({ hasText: '我的产品评审团' })
      .getByRole('switch'),
  ).toBeChecked()
  await page
    .getByTestId('team-card')
    .filter({ hasText: '我的产品评审团' })
    .getByRole('button', { name: '查看详情' })
    .click()
  await page.getByRole('button', { name: '删除专家团', exact: true }).click()
  await page.getByRole('button', { name: '确认删除', exact: true }).click()
  await expect(page.getByTestId('team-card')).toHaveCount(5)
})
test('详情示例选择不发送；关闭弹窗恢复焦点', async ({ page }) => {
  await page.goto('/?teams')
  const button = page
    .getByTestId('team-card')
    .first()
    .getByRole('button', { name: '查看详情' })
  await button.click()
  await page.keyboard.press('Escape')
  await expect(button).toBeFocused()
  await button.click()
  await page.getByRole('button', { name: /评估这份需求/ }).click()
  await page.getByRole('button', { name: '启用团队及所需成员' }).click()
  await expect(page.getByLabel('任务草稿')).toHaveValue(/评估这份需求/)
})
test('未保存修改确认、主理人恢复模板与窄屏无溢出', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?teams')
  await page.getByRole('button', { name: '新建专家团' }).click()
  await page.getByLabel('团队名称', { exact: true }).fill('待保存团队')
  await page.getByRole('button', { name: '取消', exact: true }).click()
  await expect(page.getByRole('button', { name: '继续编辑' })).toBeVisible()
  await page.getByRole('button', { name: '继续编辑' }).click()
  await expect(page.getByLabel('团队名称', { exact: true })).toHaveValue(
    '待保存团队',
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await expect(page.getByRole('heading', { name: '主理人提示词', exact: true })).toBeVisible()
  await page.getByRole('region', { name: '主理人提示词' }).getByRole('button', { name: '自定义', exact: true }).click()
  await page.getByLabel('主理人提示词正文').fill('暂存的自定义规则')
  await page.getByRole('button', { name: '恢复团队模板', exact: true }).click()
  await page.getByRole('button', { name: '确认恢复', exact: true }).click()
  await expect(page.getByLabel('主理人提示词正文')).not.toHaveValue(
    '暂存的自定义规则',
  )
  await expect(page.getByLabel('主理人提示词正文')).toHaveAttribute(
    'readonly',
    '',
  )
})

test('聊天工具栏切换团队、查看详情、启用并填入示例', async ({ page }) => {
  await page.goto('/?teams&menu')
  await page.getByRole('button', { name: '专家', exact: true }).click()
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  await page.getByLabel('搜索专家团').fill('产品')
  await page.getByRole('button', { name: '查看产品方案评审团详情' }).click()
  await expect(
    page.getByRole('dialog', { name: '产品方案评审团详情' }),
  ).toBeVisible()
  await page.getByRole('button', { name: /评估这份需求/ }).click()
  await page.getByRole('button', { name: '启用团队及所需成员' }).click()
  await expect(page.getByLabel('已选专家团')).toHaveText('产品方案评审团')
  await expect(page.getByLabel('任务草稿')).toHaveValue(/评估这份需求/)
})

test('标签逐字输入保留分隔符，超限字段明确反馈且保留草稿', async ({ page }) => {
  await page.goto('/?teams')
  await page.getByTestId('team-card').first().getByRole('button', { name: '查看详情' }).click()
  await page.getByRole('button', { name: '复制并自定义', exact: true }).click()
  const tags = page.getByLabel('场景标签', { exact: true })
  await tags.fill('')
  await tags.pressSequentially('算法，数据')
  await expect(tags).toHaveValue('算法，数据')
  await tags.fill('超'.repeat(17))
  await page.getByRole('button', { name: '保存', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('每个标签最多 16 个字符')
  await expect(tags).toBeFocused()
  await tags.fill('算法，数据')
  await page.getByRole('region', { name: '主理人提示词' }).getByRole('button', { name: '自定义', exact: true }).click()
  await page.getByLabel('主理人提示词正文').fill('规'.repeat(12001))
  await page.getByRole('button', { name: '保存', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('12000')
  await expect(page.getByLabel('主理人提示词正文')).toBeFocused()
  await page.getByLabel('主理人提示词正文').fill('汇总专家结论并列出证据。')
  await page.getByLabel('团队名称', { exact: true }).fill('标签保存回归')
  await page.getByRole('button', { name: '保存', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const saved = await page.evaluate(() => (window as unknown as { teamFixtureState(): { teams: Array<{ name: string; tags: string[] }> } }).teamFixtureState().teams.find(team => team.name === '标签保存回归'))
  expect(saved?.tags).toEqual(['算法', '数据'])
})

test('设计稿同尺寸视觉验收截图', async ({ page }, testInfo) => {
  const output = process.env.AGENCY_VISUAL_OUTPUT
  test.skip(!output, '按需生成本地设计验收证据')
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 1536, height: 1024 })
  // 视觉验收走真实设置面板，避免独立团队夹具缺少宿主主题而误报通过。
  await page.goto('/?teams&settings&visual&theme=dark')
  await page.locator('.ant-segmented-item').filter({ has: page.getByRole('radio', { name: '专家团', exact: true }) }).click()
  await expect(page.getByTestId('team-card')).toHaveCount(5)
  await expect(page.getByTestId('team-card').first()).toHaveCSS('background-color', 'rgb(43, 43, 45)')
  await expect(
    page.getByRole('button', { name: '新建专家团' }),
  ).toBeInViewport()
  await page.screenshot({ path: join(output!, '01-管理页-实现.png') })
  await page.setViewportSize({ width: 1211, height: 1299 })
  await page
    .getByTestId('team-card')
    .first()
    .getByRole('button', { name: '查看详情' })
    .click()
  await page.screenshot({ path: join(output!, '02-详情页-实现.png') })
  await page.getByRole('button', { name: '复制并自定义' }).click()
  await page.getByLabel('团队名称', { exact: true }).fill('我的产品评审团')
  await page.getByRole('button', { name: '保存', exact: true }).click()
  await page
    .getByTestId('team-card')
    .filter({ hasText: '我的产品评审团' })
    .getByRole('button', { name: '查看详情' })
    .click()
  await page.getByRole('button', { name: '编辑专家团', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCSS('background-color', 'rgb(43, 43, 45)')
  await page.setViewportSize({ width: 1536, height: 1024 })
  await expect(page.getByRole('heading', { name: '主理人提示词', exact: true })).toBeVisible()
  await page.getByRole('region', { name: '主理人提示词' }).getByRole('button', { name: '自定义', exact: true }).click()
  await expect(
    page.getByRole('region', { name: '主理人提示词' }).getByRole('button', { name: '自定义', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page
    .getByLabel('主理人提示词正文')
    .fill(
      '你是产品方案评审团的主理人，负责组织专家并交付最终评审。\n\n任务准备\n明确用户目标、方案范围和约束。关键资料不足时先询问。\n\n任务分配\n向每位成员提供必要背景及独立分工，要求给出结论、依据和风险。\n\n处理分歧\n合并重复发现，比较证据与适用条件，不按多数意见直接定结论。\n\n汇总交付\n先给总体建议，再列优先级、关键分歧和下一步行动。\n\n异常处理\n成员失败时说明未覆盖范围，不编造意见，不自动开启新一轮。',
    )
  await page.getByLabel('主理人提示词正文').press('Control+Home')
  await page.getByRole('heading', { name: '编辑专家团', exact: true }).click()
  await expect(
    page.getByRole('button', { name: '团队模板', exact: true }),
  ).toHaveAttribute('aria-pressed', 'false')
  await page.screenshot({ path: join(output!, '03-配置页-实现.png') })
  expect(errors).toEqual([])
  await testInfo.attach('配置页', {
    path: join(output!, '03-配置页-实现.png'),
    contentType: 'image/png',
  })
})
