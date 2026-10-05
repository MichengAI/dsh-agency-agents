import type { ToolDefinition } from '@deepseek-ai/dsh-tools'
import { teamText, type TeamLocale } from './team-i18n.js'

/** 每次生成模型工具说明时读取语言快照；locale 不应调用全局配置投影。 */
export function localizeTeamTool(tool: ToolDefinition, locale: () => TeamLocale): ToolDefinition {
  const { description, parameters } = tool
  return {
    ...tool,
    get description() { return teamText(locale(), description) },
    get parameters() {
      // 只翻译说明，不修改参数键、约束或用户内容。
      const active = locale()
      return JSON.parse(JSON.stringify(parameters, (key, value: unknown) =>
        key === 'description' && typeof value === 'string' ? teamText(active, value) : value,
      )) as ToolDefinition['parameters']
    },
  }
}
