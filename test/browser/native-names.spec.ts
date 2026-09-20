import { test, expect } from '@playwright/test'

test('原生成员显示本地化名，语言切换和宿主刷新保留身份，卸载恢复', async ({ page }) => {
  await page.goto('/?nativeNames')
  const names = page.locator('.host_memberText > span')
  await expect(names.first()).toHaveText('软件架构师')
  await expect(names.nth(1)).toHaveText('lead')
  await expect(names.nth(2)).toHaveText('agency-unknown-0123456789')
  await page.getByRole('button', { name: '软件架构师' }).click()
  await expect(page.locator('output')).toHaveText('agency-engineering-software-architect-8a70fbbd93')
  await expect(page.getByTestId('正文')).toHaveText('agency-engineering-software-architect-8a70fbbd93')
  await page.getByText('切换语言', { exact: true }).click()
  await expect(names.first()).toHaveText('Software Architect')
  await expect(names.nth(3)).toHaveText('我的评审专家')
  await page.getByText('宿主刷新', { exact: true }).click()
  await expect(names.first()).toHaveText('Software Architect')
  await page.getByText('卸载适配', { exact: true }).click()
  await expect(names.first()).toHaveText('agency-engineering-software-architect-8a70fbbd93')
})
