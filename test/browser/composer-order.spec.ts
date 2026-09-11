import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const source = readFileSync(new URL('../../src/client/index.ts', import.meta.url), 'utf8')
const css = source.match(/const COMPOSER_CSS = '([^'\r\n]+)'/)?.[1]
if (!css) throw new Error('未找到专家输入栏样式')

for (const attachment of [false, true]) {
  test(`专家样式保留宿主按钮顺序：${attachment ? '含附件' : '旧版无附件'}`, async ({ page }) => {
    // 模拟宿主工具栏的直接子元素，使用真实插件 CSS 验证最终视觉顺序。
    await page.setContent(`<style>${css}</style><div data-composer-card>
      <div style="display:flex;gap:8px">
        <button aria-haspopup="listbox">+</button>
        ${attachment ? '<button>附件</button><input type="file" hidden>' : ''}
        <div>权限</div><div class="aag-btn-wrap"><button>专家</button></div>
      </div></div>`)
    const labels = attachment ? ['+', '附件', '权限', '专家'] : ['+', '权限', '专家']
    const positions = []
    for (const label of labels) {
      const box = await page.getByText(label, { exact: true }).boundingBox()
      expect(box).not.toBeNull()
      positions.push(box!.x)
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })
}
