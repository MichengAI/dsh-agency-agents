import type { ToolDefinition } from '@deepseek-ai/dsh-tools'
import { teamText, type TeamLocale } from './team-i18n.js'

/** 每次生成模型工具说明时读取语言快照；locale 不应调用全局配置投影。
 * values 对该工具的全部说明生效，必须与文案里的 {0} 同源。漏传时 teamText 会原样留下占位符。
 */
export function localizeTeamTool(tool: ToolDefinition, locale: () => TeamLocale, values: readonly unknown[] = []): ToolDefinition {
  const { description, parameters } = tool
  return {
    ...tool,
    get description() { return teamText(locale(), description, values) },
    get parameters() {
      // 只翻译说明，不修改参数键、约束或用户内容。
      const active = locale()
      return JSON.parse(JSON.stringify(parameters, (key, value: unknown) =>
        key === 'description' && typeof value === 'string' ? teamText(active, value, values) : value,
      )) as ToolDefinition['parameters']
    },
  }
}
