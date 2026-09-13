import { ROSTER } from './roster.js'
import type { ExpertSummary } from '../expert-contract.js'

/** 少量人工维护的任务示例；仅指导交代需求，不代表额外工具授权。 */
export const TASK_EXAMPLES: Readonly<Record<string, { readonly zh: string; readonly en: string }>> = {
  'engineering-code-reviewer': {
    zh: '审查我提供的代码改动，优先找出会导致错误行为的缺陷。每项说明触发条件、影响和修复建议；没有足够证据的问题不要列为确定缺陷。',
    en: 'Review the code changes I provide for defects that cause incorrect behavior. For each finding, explain the trigger, impact and suggested fix. Do not present unsupported suspicions as confirmed defects.',
  },
  'design-ux-researcher': {
    zh: '根据我提供的注册流程和用户反馈，分析用户可能在哪一步放弃。区分已有证据与待验证假设，提出三个访谈问题和一个可用性测试任务。',
    en: 'Use the registration flow and user feedback I provide to identify where users may abandon it. Separate evidence from hypotheses, and propose three interview questions and one usability test task.',
  },
  'design-ui-designer': {
    zh: '评估我提供的页面截图，检查信息层级、排版、间距和视觉一致性。沿用现有设计风格，给出按优先级排列的具体调整建议。',
    en: 'Review the page screenshots I provide for hierarchy, typography, spacing and visual consistency. Preserve the existing design language and prioritize specific improvements.',
  },
  'design-ux-architect': {
    zh: '根据我提供的产品需求，梳理页面层级和核心操作流程，列出关键组件及加载、空白、错误状态，形成开发团队可执行的交互说明。',
    en: 'Turn the product requirements I provide into a page hierarchy and core user flow. Identify key components and loading, empty and error states, and write actionable interaction guidance for developers.',
  },
  'product-manager': {
    zh: '根据我提供的用户问题和业务目标，明确目标用户、核心场景、第一版范围及暂缓事项，并为核心能力制定可观察的验收标准。',
    en: 'Use the user problems and business goals I provide to define the target users, core scenario, first-release scope and deferred work. Set observable acceptance criteria for the core capabilities.',
  },
  'engineering-technical-writer': {
    zh: '根据我提供的接口定义和使用示例，编写一份快速上手文档，包含前置条件、最短操作路径、预期结果和常见错误；缺失的信息请明确标出。',
    en: 'Write a quick-start guide from the API definitions and usage examples I provide. Include prerequisites, the shortest working path, expected results and common errors. Explicitly flag missing information.',
  },
  'research-synthesist': {
    zh: '整理我提供的资料，围绕研究问题归纳共识、分歧和证据缺口。为每个关键结论标注资料来源，并说明哪些结论还需要进一步验证。',
    en: 'Synthesize the materials I provide around my research question. Identify agreement, disagreement and evidence gaps. Attribute each key conclusion to its source and state what still needs verification.',
  },
  'marketing-xiaohongshu-operator': {
    zh: '根据我提供的账号定位、目标受众和近期笔记数据，提出三个小红书选题。分别说明用户需求、内容角度、开头思路和发布后应观察的数据。',
    en: 'Use the account positioning, target audience and recent post data I provide to propose three Xiaohongshu topics. Explain the user need, content angle, opening and post-publication metrics for each.',
  },
}

/** 自定义或同名但元数据不同的外部专家不套用内置角色示例。 */
export function expertTaskExample(expert: Pick<ExpertSummary, 'slug' | 'custom' | 'nameEn' | 'description' | 'descriptionEn'>, locale: 'zh' | 'en'): string | undefined {
  if (expert.custom) return undefined
  const base = ROSTER.find(item => item.slug === expert.slug)
  if (base === undefined || base.nameEn !== expert.nameEn || base.description !== expert.description || base.descriptionEn !== expert.descriptionEn) return undefined
  return TASK_EXAMPLES[expert.slug]?.[locale]
}
