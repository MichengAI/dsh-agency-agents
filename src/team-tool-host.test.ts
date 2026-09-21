import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import { localizeTeamTool } from './team-tool-locale.js'

// 可指定实际 DSH 的 package.json，直接运行安装目录中的服务，而非 mock 注册器。
const hostRequire = createRequire(process.env.AGENCY_DSH_MANIFEST ?? import.meta.url)
const { Context } = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/cordis')).href) as typeof import('@deepseek-ai/cordis')
const { ToolRuntime, defineTool } = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/dsh-tools')).href) as typeof import('@deepseek-ai/dsh-tools')
const { SystemPrompt } = await import(pathToFileURL(hostRequire.resolve('@deepseek-ai/dsh-system-prompt')).href) as typeof import('@deepseek-ai/dsh-system-prompt')

describe('真实宿主工具注册与模型提示组装', () => {
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
