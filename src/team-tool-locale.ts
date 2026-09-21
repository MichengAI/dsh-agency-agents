import type { ToolDefinition } from '@deepseek-ai/dsh-tools'
import { teamText, type TeamLocale } from './team-i18n.js'

/** 宿主保留工具对象；每次生成模型工具说明时读取当前语言，不重注册执行器。 */
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
