import type { CatalogSnapshot } from './expert-contract.js'
import {
  validateExpertProposal,
  validateTeamProposal,
  type CreationRequest,
  type CreationResponse,
} from './creation-contract.js'
import { ZH_DIVISION } from './names.js'

export type { CreationResponse }

export interface CreationServiceOptions {
  getCatalog: () => Promise<CatalogSnapshot>
  getLlmRuntime: () => any
  locale?: () => 'zh' | 'en'
}

export interface CreationService {
  generateDraft(request: CreationRequest): Promise<CreationResponse>
}

function extractJsonBlock(text: string): string {
  const match = /```(?:json)?\s*([\s\S]*?)\s*```/u.exec(text)
  if (match?.[1]) {
    return match[1].trim()
  }
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1).trim()
  }
  return text.trim()
}

export function createCreationService(options: CreationServiceOptions): CreationService {
  return {
    async generateDraft(request: CreationRequest): Promise<CreationResponse> {
      const llm = options.getLlmRuntime()
      if (!llm) {
        return {
          ok: false,
          error: '宿主大模型服务不可用，请在设置中配置模型或改用人工创建。',
        }
      }

      const catalog = await options.getCatalog()
      const availableSlugs = new Set(catalog.experts.map(e => e.slug))

      // 确定调用的 provider 与 model
      let targetProvider: string | undefined
      let targetModel: string | undefined

      try {
        const providers = typeof llm.listProviders === 'function' ? llm.listProviders() : []
        for (const p of providers) {
          const models = typeof llm.listModels === 'function' ? await llm.listModels(p.id) : []
          if (models.length > 0) {
            targetProvider = p.id
            targetModel = models[0].id
            break
          }
        }
      } catch (cause) {
        return {
          ok: false,
          error: `获取模型列表失败: ${cause instanceof Error ? cause.message : String(cause)}`,
        }
      }

      if (!targetProvider || !targetModel) {
        return {
          ok: false,
          error: '未检测到可用的 LLM 模型路线，请先在宿主设置中启用大模型提供方。',
        }
      }

      // 构建系统提示词
      let systemPrompt = ''
      if (request.kind === 'expert') {
        const divisionsList = Object.entries(ZH_DIVISION)
          .map(([key, name]) => `${key}（${name}）`)
          .join(', ')
        systemPrompt = [
          '你是一名专业智能体角色架构师。请根据用户的任务或岗位需求，设计一个专业智能体专家设定。',
          '你必须严格返回一个 JSON 对象（不要输出任何额外问候或 Markdown 以外的废话），字段如下：',
          '- name: 专家名称（1~40字，不要包含@或特殊控制字符）',
          '- description: 一句话定位与核心职责（1~160字）',
          `- division: 所在分类，必须从以下键名中选择一个：[${divisionsList}]`,
          '- emoji: 一个符合角色特性的单一原生 Emoji（如 💻, 🛡️, 📊）',
          '- prompt: 专家系统提示词正文（详细定义角色定位、专业技能、执行规范、边界约束，100~4000字）',
        ].join('\n')
      } else {
        const candidateSummary = catalog.experts
          .map(e => `- [${e.slug}] ${e.name}（${e.divisionZh || e.division}）：${e.description}`)
          .join('\n')

        systemPrompt = [
          '你是一名团队协作架构师。请根据用户的任务需求，从已有的真实专家名册中挑选 2~5 位最合适的专家组成专家团，并设计分工。',
          '【非常重要】：团队成员的 expertSlug 必须严格从下列提供的真实专家名单中挑选，绝对禁止虚构不存在的 slug！',
          '候选专家名单：',
          candidateSummary,
          '',
          '你必须严格返回一个 JSON 对象，字段如下：',
          '- name: 专家团名称（1~40字）',
          '- description: 一句话简介（1~160字）',
          '- tags: 场景标签数组（最多3个，每个标签不超过16字）',
          '- goal: 团队总目标（1~2000字）',
          '- constraints: 通用约束（选填，如不擅自修改代码等，不超过2000字）',
          '- deliveryRequirements: 最终交付要求（如结论报告、清单、分析等，1~2000字）',
          '- members: 成员数组（2~8人），每个成员包含：',
          '  - expertSlug: 必须是上述名单里的真实 slug',
          '  - duty: 职责摘要（不超过100字）',
          '  - instructions: 详细分工与指引（不超过2000字）',
          '  - reason: 入选理由（简要说明为什么选他，不超过100字）',
          '- examples: 任务示例数组（1~3条）',
          '- coordinatorMode: "template"',
          '- coordinatorTemplateId: 可选 "general" | "product" | "technical" | "content" | "data" | "research"',
          '- coordinatorTemplateVersion: 1',
          '- coordinatorPrompt: ""',
        ].join('\n')
      }

      const messages: Array<{ role: string; content: string }> = [
        { role: 'system', content: systemPrompt },
      ]

      if (request.messages && request.messages.length > 0) {
        for (const m of request.messages) {
          messages.push({ role: m.role, content: m.content })
        }
      }

      messages.push({ role: 'user', content: request.prompt })

      let fullContent = ''
      try {
        const call = await llm.prepareCall(targetProvider, targetModel)
        const stream = call.stream({
          provider: targetProvider,
          model: targetModel,
          messages,
        })

        for await (const chunk of stream) {
          if (chunk.type === 'content' && typeof chunk.delta === 'string') {
            fullContent += chunk.delta
          } else if (chunk.type === 'text' && typeof chunk.text === 'string') {
            fullContent += chunk.text
          }
        }
      } catch (cause) {
        return {
          ok: false,
          error: `模型生成调用失败: ${cause instanceof Error ? cause.message : String(cause)}`,
        }
      }

      let parsedJson: unknown
      try {
        const jsonStr = extractJsonBlock(fullContent)
        parsedJson = JSON.parse(jsonStr)
      } catch {
        return {
          ok: false,
          error: '模型返回的内容不是有效的 JSON 结构，请重试或补充更明确的描述。',
        }
      }

      if (request.kind === 'expert') {
        const validation = validateExpertProposal(parsedJson)
        if (!validation.ok) {
          return { ok: false, error: validation.error }
        }
        return { ok: true, expertDraft: validation.value }
      } else {
        const validation = validateTeamProposal(parsedJson, availableSlugs)
        if (!validation.ok) {
          return { ok: false, error: validation.error }
        }
        return {
          ok: true,
          teamDraft: validation.value,
          memberReasons: validation.memberReasons,
        }
      }
    },
  }
}
