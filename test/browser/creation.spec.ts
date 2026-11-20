import { expect, test } from '@playwright/test'

const locales = [
  ['pt', '✅ Abrir editor agora', '✏️ Continuar editando na conversa', 'Guardar e ativar', 'Salvar e ativar'],
  ['es', '✅ Abrir el editor ahora', '✏️ Seguir editando en la conversación', 'Guardar y habilitar', 'Guardar y activar'],
  ['en', '✅ Open editor now', '✏️ Keep editing in chat', 'Save and enable', 'Save and enable'],
  ['zh', '✅ 立即打开编辑窗口反显写入', '✏️ 留在当前对话继续修改调整', '保存并启用', '保存并启用'],
] as const

for (const [locale, positive, negative, expertSave, teamSave] of locales) {
  for (const kind of ['expert', 'team']) {
    test(`${locale} ${kind}: opens and saves only after positive submit`, async ({ page }) => {
      await page.goto(`/?creation&locale=${locale}&kind=${kind}`)
      const option = page.getByRole('radio', { name: positive, exact: true })
      if (kind === 'team') { await option.focus(); await option.press('Space') } else await option.click()
      await expect(page.getByRole('dialog')).toHaveCount(0)
      await expect(page.getByLabel('Confirmed read calls')).toHaveText('0')
      if (kind === 'team') await option.press('Enter')
      else await page.getByRole('button', { name: 'Submit fixture' }).click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toHaveCount(1)
      await expect(page.getByLabel('Confirmed read calls')).toHaveText('2')
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('input[value="Unchanged Ñ 资料"]')).toBeVisible()
      const save = dialog.getByRole('button', { name: kind === 'expert' ? expertSave : teamSave, exact: true })
      await save.click()
      await expect(page.getByLabel('Saved draft')).toContainText('"enabled":true')
      await expect(page.getByLabel('Saved draft')).toContainText('Unchanged Ñ 资料')
      await expect(dialog).toHaveCount(0)
    })
  }

  test(`${locale}: switching to decline and skipping after selection do not fetch`, async ({ page }) => {
    for (const skip of [false, true]) {
      await page.goto(`/?creation&locale=${locale}`)
      await page.getByRole('radio', { name: positive, exact: true }).click()
      if (!skip) await page.getByRole('radio', { name: negative, exact: true }).click()
      await page.getByRole('button', { name: skip ? 'Skip fixture' : 'Submit fixture' }).click()
      await expect(page.getByLabel('Confirmed read calls')).toHaveText('0')
      await expect(page.getByRole('dialog')).toHaveCount(0)
    }
  })
}

for (const condition of ['foreign', 'stale', 'unrelated', 'switch']) {
  test(`does not open an editor on ${condition}`, async ({ page }) => {
    await page.goto(`/?creation&${condition}`)
    await page.getByRole('radio', { name: locales[2][1], exact: true }).click()
    await page.getByRole('button', { name: 'Submit fixture' }).click()
    if (condition === 'foreign' || condition === 'stale') await expect(page.getByLabel('Confirmed read calls')).not.toHaveText('0')
    else await expect(page.getByLabel('Confirmed read calls')).toHaveText('0')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
}

for (const kind of ['expert', 'team']) {
  test(`${kind}: the host Markdown preview opens an unconfirmed draft without navigating`, async ({ page }) => {
    const errors: Error[] = []
    page.on('pageerror', error => errors.push(error))
    await page.goto(`/?creation&markdown&kind=${kind}`)
    const url = page.url()
    const link = page.locator('a').filter({ hasText: 'Review and save draft in the editor' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', /^dsh-agency:apply-draft\?id=prop-[A-Za-z0-9_-]{22}$/)
    await link.press('Enter')
    await expect(page.getByRole('dialog').locator('input[value="Unchanged Ñ 资料"]')).toBeVisible()
    await expect(page.getByLabel('Saved draft')).toBeEmpty()
    expect(page.url()).toBe(url)
    expect(errors).toEqual([])
  })

  for (const entry of ['manual', 'confirmation']) {
    test(`${kind}: ${entry} refuses replacement during deferred catalog load`, async ({ page }) => {
      await page.goto(`/?creation&deferred&kind=${kind}`)
      if (entry === 'manual') await page.getByRole('link', { name: 'Manual preview' }).click()
      else {
        await page.getByRole('radio', { name: '✅ Open editor now', exact: true }).click()
        await page.getByRole('button', { name: 'Submit fixture' }).click()
      }
      await expect(page.getByLabel('Catalog loads')).toHaveText('1')
      await page.getByRole('button', { name: 'Replace draft' }).click()
      await page.getByRole('button', { name: 'Release catalog' }).click()
      await expect(page.getByLabel('Catalog released')).toHaveText('true')
      await expect(page.locator('.aag-global-draft-root')).toHaveCount(0)
      await expect(page.getByLabel('Confirmed read calls')).toHaveText('2')
      await expect(page.getByLabel('Saved draft')).toBeEmpty()
    })
  }

  test(`${kind}: no old editor appears after leaving during deferred catalog load`, async ({ page }) => {
    await page.goto(`/?creation&deferred&kind=${kind}`)
    await page.getByRole('link', { name: 'Manual preview' }).click()
    await expect(page.getByLabel('Catalog loads')).toHaveText('1')
    await page.getByRole('button', { name: 'Other session' }).click()
    await page.getByRole('button', { name: 'Release catalog' }).click()
    await expect(page.getByLabel('Catalog released')).toHaveText('true')
    await expect(page.locator('.aag-global-draft-root')).toHaveCount(0)
    await page.getByRole('button', { name: 'Original session' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
}
