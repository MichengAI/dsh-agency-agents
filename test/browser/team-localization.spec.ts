import { test, expect } from '@playwright/test'

// The Teams fixture mounts real Agency components with an in-memory Remote and a draft stub.
// It does not exercise the installed DSH locale service, RPC, persistence, or real composer insertion.
test('settings keeps the open team editor and its unsaved text across PT-to-ES switch', async ({ page }) => {
  await page.goto('/?teams&settings&lang=pt-BR')
  const teamsTab = page.getByRole('tab', { name: 'Equipes de especialistas', exact: true })
  await expect(teamsTab).toBeVisible()
  await teamsTab.click()
  await page.getByRole('button', { name: 'Nova equipe', exact: true }).click()
  await page.getByRole('menuitem', { name: 'Manual', exact: true }).click()
  const typedName = 'Minha equipe — 保留 {0}'
  await page.getByLabel('Nome da equipe', { exact: true }).fill(typedName)

  await page.evaluate(() => (window as unknown as { teamFixtureLocale(value: string): void }).teamFixtureLocale('es-419'))
  await expect(page.getByLabel('Nombre del equipo', { exact: true })).toHaveValue(typedName)
})

test('composer team menu updates in place and inserts the example in the current locale', async ({ page }) => {
  await page.goto('/?teams&menu&lang=pt-BR')
  await page.getByRole('button', { name: 'Especialistas', exact: true }).click()
  const teamsTab = page.getByRole('tab', { name: 'Equipes de especialistas', exact: true })
  await expect(teamsTab).toBeVisible()
  await teamsTab.click()
  const ptSearch = page.getByLabel('Buscar equipes', { exact: true })
  await ptSearch.fill('produto')
  await expect(page.getByRole('button', { name: 'Ver detalhes de Equipe de avaliação de produto', exact: true })).toBeVisible()

  await page.evaluate(() => (window as unknown as { teamFixtureLocale(value: string): void }).teamFixtureLocale('es-419'))
  const esSearch = page.getByLabel('Buscar equipos', { exact: true })
  await expect(esSearch).toHaveValue('produto')
  await esSearch.fill('producto')
  await page.getByRole('button', { name: 'Ver detalles de Equipo de evaluación de producto', exact: true }).click()
  const example = 'Revisa estos requisitos y separa lo esencial para la primera versión de lo que puede esperar.'
  await page.getByRole('button', { name: `«${example}»`, exact: true }).click()
  await page.getByRole('button', { name: 'Activar equipo y especialistas requeridos', exact: true }).click()
  await expect(page.getByLabel('已选专家团')).toHaveText('Equipo de evaluación de producto')
  await expect(page.getByLabel('任务草稿')).toHaveValue(example)
})
