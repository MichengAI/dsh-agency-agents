import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { localizeTeamTool } from './team-tool-locale.js'
import { createHostLocaleReader } from './i18n.js'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'

// 可指定实际 DSH 的 package.json，直接运行安装目录中的服务，而非 mock 注册器。
const hostRequire = createRequire(process.env.AGENCY_DSH_MANIFEST ?? import.meta.url)
const { Context } = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/cordis')).href) as typeof import('@deepseek-ai/cordis')
const { ToolRuntime, defineTool } = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/dsh-tools')).href) as typeof import('@deepseek-ai/dsh-tools')
const { SystemPrompt } = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/dsh-system-prompt')).href) as typeof import('@deepseek-ai/dsh-system-prompt')

describe('真实宿主工具注册与模型提示组装', () => {
  it('批量 schema 扫描不重新投影设置，语言事件合并刷新并避免同步重入', async () => {
    const ctx = new Context()
    new SystemPrompt(ctx, { includeHarnessIdentity: false, includeRuntimeContext: false })
    const runtime = new ToolRuntime(ctx)
    let preference = 'en'
    const describeSettings = vi.fn(() => {
      // 宿主 describe 可能发出通知，刷新期间不能再次触发自己。
      ctx.emit('settings/document-updated', 'locale' as SettingsNamespace, 1)
      return [{ ns: 'locale', value: { preference } }]
    })
    let disposeLocale: () => unknown = () => {}
    const localeCtx = {
      settings: { describe: describeSettings },
      on: ctx.on.bind(ctx),
      effect: (setup: () => () => void) => {
        disposeLocale = ctx.effect(setup)
        return disposeLocale
      },
    } as unknown as typeof ctx
    const locale = createHostLocaleReader(localeCtx)
    const disposers = ['list_expert_teams', 'get_expert_team', 'summon_expert_team'].map(name =>
      runtime.register(localizeTeamTool(defineTool({
        name, description: '专家团只能在主会话中召唤。',
        parameters: { team: { type: 'string', description: '专家团稳定标识或完整名称。' } },
        output: { schema: { type: 'string' }, render: () => [] }, execute: async () => '',
      }), locale)),
    )
    try {
      for (let i = 0; i < 76; i++) runtime.schemas()
      expect(describeSettings).toHaveBeenCalledTimes(1)
      const english = JSON.stringify(runtime.schemas())
      expect(english).not.toMatch(/[\u3400-\u9fff]/u)
      ctx.emit('settings/document-updated', 'agency-agents' as SettingsNamespace, 2)
      await Promise.resolve()
      expect(describeSettings).toHaveBeenCalledTimes(1)

      preference = 'zh'
      for (let i = 0; i < 10; i++) ctx.emit('settings/document-updated', 'locale' as SettingsNamespace, 2)
      // 即使通知来自 schema 扫描栈，也只读取快照，不同步重算。
      expect(JSON.stringify(runtime.schemas())).toBe(english)
      await Promise.resolve()
      await Promise.resolve()
      expect(describeSettings).toHaveBeenCalledTimes(2)
      expect(JSON.stringify(runtime.schemas())).toContain('专家团稳定标识或完整名称。')

      preference = 'en'
      ctx.emit('settings/document-updated', 'locale' as SettingsNamespace, 3)
      await Promise.resolve()
      expect(JSON.stringify(runtime.schemas())).toBe(english)
      expect(describeSettings).toHaveBeenCalledTimes(3)

      ctx.emit('settings/document-updated', 'locale' as SettingsNamespace, 4)
      await disposeLocale()
      await Promise.resolve()
      expect(describeSettings).toHaveBeenCalledTimes(3)
    } finally {
      for (const dispose of disposers) dispose()
      await ctx.fiber.dispose()
    }
  })

  it('同一注册工具在中英切换后刷新模型可见工具与参数说明', async () => {
    const ctx = new Context()
    const prompt = new SystemPrompt(ctx, { includeHarnessIdentity: false, includeRuntimeContext: false })
    const runtime = new ToolRuntime(ctx)
    let locale: 'zh' | 'en' = 'zh'
    const dispose = runtime.register(localizeTeamTool(defineTool({
      name: 'get_expert_team', description: '专家团只能在主会话中召唤。',
      parameters: { team: { type: 'string', required: true, description: '专家团稳定标识或完整名称。' } },
      output: { schema: { type: 'string' }, render: () => [] },
      execute: async () => '',
    }), () => locale))
    try {
      const chinese = await prompt.assemble()
      expect(JSON.stringify(chinese.tools)).toContain('专家团只能在主会话中召唤。')
      locale = 'en'
      const english = await prompt.assemble()
      expect(JSON.stringify(english.tools)).toContain('Expert teams can only')
      expect(JSON.stringify(english.tools)).not.toMatch(/[\u3400-\u9fff]/u)
      expect(JSON.stringify(runtime.schemas())).not.toMatch(/[\u3400-\u9fff]/u)
      locale = 'zh'
      expect(JSON.stringify((await prompt.assemble()).tools)).toContain('专家团稳定标识或完整名称。')
      expect(JSON.stringify(chinese.tools)).toContain('专家团只能在主会话中召唤。')
    } finally {
      dispose()
      await ctx.fiber.dispose()
    }
  })
})
