import { expect, test } from '@playwright/test'

for (const strict of [false, true]) {
  for (const close of ['Escape', '按钮', '遮罩']) {
    test(`${strict ? 'StrictMode' : '常规'}：${close} 关闭并恢复原按钮焦点`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto(strict ? '/?strict' : '/')
      // 连续使用不同触发器，避免错误恢复到第一次打开的按钮。
      for (const name of ['专家甲', '专家乙']) {
        const trigger = page.getByRole('button', { name })
        await trigger.click()
        const dialog = page.getByRole('dialog')
        await expect(dialog).toBeVisible()
        await expect(dialog.getByRole('button', { name: '关闭' })).toBeFocused()
        if (close === 'Escape') await page.keyboard.press('Escape')
        else if (close === '按钮') await dialog.getByRole('button', { name: '关闭' }).click()
        else await page.mouse.click(5, 5)
        await expect(dialog).toHaveCount(0)
        await expect(trigger).toBeFocused()
      }
      expect(errors).toEqual([])
    })
  }
}
