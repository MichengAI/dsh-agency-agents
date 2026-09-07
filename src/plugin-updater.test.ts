import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { handlePluginUpdateEscape, manualPluginUpdateCommand } from './client/plugin-update-ui.js'
import { isNewerVersion, isTrustedUpdateRequest, PLUGIN_UPDATE_HEADER } from './plugin-updater.js'

describe('独立插件更新', () => {
  it('只把更高 semver 识别为更新', () => {
    expect(isNewerVersion('0.1.32', '0.1.33')).toBe(true)
    expect(isNewerVersion('0.1.32', '0.1.32')).toBe(false)
    expect(isNewerVersion('0.2.0', '0.1.99')).toBe(false)
  })

  it('自动更新必须同时满足专用请求头与同源约束', () => {
    expect(isTrustedUpdateRequest({ headers: { [PLUGIN_UPDATE_HEADER]: '1', origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' } })).toBe(true)
    expect(isTrustedUpdateRequest({ headers: { origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' } })).toBe(false)
    expect(isTrustedUpdateRequest({ headers: { [PLUGIN_UPDATE_HEADER]: '1', 'sec-fetch-site': 'cross-site' } })).toBe(false)
  })

  it('手工命令锁定当前 profile、包名、版本和官方源', () => {
    expect(manualPluginUpdateCommand('web', '@michengai/dsh-agency-agents', '0.1.33')).toBe(
      'dsh plugin --profile web add @michengai/dsh-agency-agents@0.1.33 --registry=https://registry.npmjs.org/',
    )
  })

  it('ESC 只关闭更新弹窗并阻止事件继续传给设置页', () => {
    const calls: string[] = []
    const handled = handlePluginUpdateEscape({
      key: 'Escape',
      preventDefault: () => { calls.push('prevent') },
      stopPropagation: () => { calls.push('stop') },
      stopImmediatePropagation: () => { calls.push('stopImmediate') },
    }, () => { calls.push('close') })
    expect(handled).toBe(true)
    expect(calls).toEqual(['prevent', 'stop', 'stopImmediate', 'close'])
  })

  it('客户端与 Host 都只绑定专家库自身更新入口', async () => {
    const client = await readFile(new URL('./client/index.ts', import.meta.url), 'utf8')
    const updateUi = await readFile(new URL('./client/plugin-update-ui.ts', import.meta.url), 'utf8')
    const host = await readFile(new URL('./index.ts', import.meta.url), 'utf8')
    expect(client).toContain("packageName: '@michengai/dsh-agency-agents'")
    expect(client).toContain("titleRowSelector: '.aag-title-row'")
    expect(client).toContain("zhName: '专家'")
    expect(client).toContain("enName: 'Experts'")
    expect(client).toContain('createIcon: createPluginUpdateIcon')
    expect(client).toContain('IconRefreshOutline16')
    expect(client).toContain('IconDownloadOutline16')
    expect(client).toContain('IconCopyOutline16')
    expect(client).toContain('IconCloseOutline16')
    expect(updateUi).toContain('data-mpi-label')
    expect(updateUi).toContain("overlay.addEventListener('keydown'")
    expect(updateUi).toContain('<header class="mpi-head"><h2></h2><button type="button" class="mpi-dialog-close" data-action="close"></button></header>')
    expect(updateUi).toContain('<footer class="mpi-actions"><div class="mpi-actions-group">')
    expect(updateUi).toContain('background:var(--dsw-alias-bg-layer-2')
    expect(updateUi).toContain('box-shadow:var(--dsw-shadow-lv3')
    expect(updateUi).toContain('border-radius:14px')
    expect(host).toContain("endpoint: '/api/michengai/dsh-agency-agents/update'")
  })
})
