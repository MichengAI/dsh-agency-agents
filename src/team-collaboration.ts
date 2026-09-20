import type { TeamInput } from './team-contract.js'
import { TEAM_METHODS_EN, MEMBER_HANDOFF_EN } from './team-collaboration-en.js'

/** 专属方法只定义业务输入与验收，不声明宿主不存在的工具或多轮能力。 */
export const TEAM_METHODS = {
  general: {
    preparation: [
      '要解决的问题与最终决策',
      '已有资料及可访问位置',
      '范围、约束、输出形式和未知项',
    ],
    reviewChecklist: [
      '结论是否对应用户目标，并有可定位的依据',
      '是否区分事实、假设、建议和未覆盖范围',
      '行动是否明确优先级、执行条件及验收方式',
    ],
    synthesis: '交付总体结论、依据与限制、必要分歧、优先级行动及待确认事项。',
  },
  product: {
    preparation: [
      '目标用户、核心场景和待解决问题',
      '现有方案、用户反馈与需求证据',
      '首版边界、资源约束及成功指标',
    ],
    reviewChecklist: [
      '必须做、建议做、暂缓是否有用户价值和实施约束依据',
      '体验问题是否对应具体使用步骤，反馈与假设是否分开',
      '推荐范围是否形成可验收的最小交付方案，是否标出成本未知项',
    ],
    synthesis:
      '以同一需求项对齐价值、体验和可行性；交付首版范围表（需求、优先级、依据、代价、验收指标），说明保留和暂缓理由。价值高但成本未知时建议先验证，不编造排期。',
  },
  technical: {
    preparation: [
      '改动目标、现有架构及接口/数据流材料',
      '部署环境、权限边界和依赖约束',
      '兼容性、性能目标与可运行的测试条件',
    ],
    reviewChecklist: [
      '风险是否给出位置、触发条件、影响和验证方式',
      '是否区分已复现问题、潜在风险和未验证项',
      '每项阻断风险是否有最小修复建议和对应回归用例',
    ],
    synthesis:
      '按同一组件或接口关联架构问题、安全风险和验收用例；交付风险清单（严重度、位置、触发条件、影响、修复、验证）及放行条件。未经执行的测试只能列为计划。',
  },
  content: {
    preparation: [
      '目标受众、平台、账号定位与内容目标',
      '主题、已知事实、可用素材及出处',
      '篇幅/形式、风格、时间范围和不可涉及的内容',
    ],
    reviewChecklist: [
      '每个选题是否有明确受众价值、独特角度及可用证据',
      '标题与核心论点是否得到素材支持，缺口是否标记',
      '推荐是否包含平台适配、可执行大纲和可观察的效果指标',
    ],
    synthesis:
      '按同一选题对齐内容角度、传播理由和证据状态；交付选题排序表、推荐标题与大纲、素材缺口和发布后观察指标。不以传播潜力替代事实核验，不承诺流量。',
  },
  data: {
    preparation: [
      '业务问题、数据来源及可读取的文件/表',
      '字段、单位、时间窗口、样本、去重规则和指标分母',
      '对比基准、已知质量问题及期望交付形式',
    ],
    reviewChecklist: [
      '比较结论是否使用一致的时间、单位、样本和分母',
      '关键数字是否可由来源、计算过程或查询复核',
      '图表是否使用已验证字段和数值，是否标记质量限制及相关性边界',
    ],
    synthesis:
      '先核对质量与统计口径，再采纳业务结论和图表建议。成员口径不一致时不能平均数值或强行合并；交付口径说明、关键指标与异常、可复核依据、图表方案及行动。数据不够时仅给分析计划。',
  },
  research: {
    preparation: [
      '研究问题、决策用途及比较对象',
      '地区、时间范围、比较维度和可用来源',
      '已有判断、关键假设以及希望验证的反证',
    ],
    reviewChecklist: [
      '来源是否可追溯，日期和口径是否适用，同源转述是否去重',
      '趋势推断是否有驱动因素、反证和成立条件',
      '方案是否按一致维度比较，推荐是否说明代价与可推翻条件',
    ],
    synthesis:
      '建立来源—论点对应关系，再对齐趋势判断和方案取舍；交付核心结论、证据表、方案比较、反证与待研究问题。不把多次转述算独立验证，不用虚假的精确概率掩盖不确定性。',
  },
} as const

export const MEMBER_HANDOFF = [
  '结论：只回答自己的分工问题；需要决策时给出明确建议。',
  '证据与定位：列出资料路径、段落、来源或计算方法；没有执行的检索和测试必须注明。',
  '风险与条件：说明影响、触发条件、假设和可能推翻结论的证据。',
  '建议与验收：给出可执行行动、优先级及完成标准。',
  '交接给主理人：列出需与其他职责核对的具体问题、缺失资料和未覆盖内容；没有则明确说明。',
] as const

/** 准备与交接规范既用于委派，也返回给主会话；自定义模式不暗中叠加专属模板。 */
export function teamCollaboration(team: TeamInput, locale: 'zh' | 'en' = 'zh') {
  if (locale === 'en') {
    const method = TEAM_METHODS_EN[team.coordinatorMode === 'custom' ? 'general' : team.coordinatorTemplateId]
    return {
      steps: ['Coordinator prepares a task brief', 'Members analyze independently in parallel', 'Members return conclusions and evidence', 'Coordinator verifies handoffs and disagreements', 'Deliver one result with explicit coverage'],
      preparation: [...method.preparation], memberOutput: [...MEMBER_HANDOFF_EN],
      reviewChecklist: team.coordinatorMode === 'custom' ? ['Verify against the custom coordinator rules and deliverables; do not apply a previous team template.', ...method.reviewChecklist] : [...method.reviewChecklist],
      synthesis: team.coordinatorMode === 'custom' ? 'Synthesize according to the custom coordinator rules and deliverables.' : method.synthesis,
      deliveryRequirements: team.deliveryRequirements,
    }
  }
  const method =
    TEAM_METHODS[
      team.coordinatorMode === 'custom' ? 'general' : team.coordinatorTemplateId
    ]
  return {
    steps: [
      '主理人整理任务简报',
      '成员独立并行分析',
      '成员回传结论与依据',
      '主理人核验交接与分歧',
      '统一交付并说明覆盖范围',
    ],
    preparation: [...method.preparation],
    memberOutput: [...MEMBER_HANDOFF],
    reviewChecklist:
      team.coordinatorMode === 'custom'
        ? [
            '按自定义主理人规则和本团交付要求核验，不套用旧团队专属模板。',
            ...TEAM_METHODS.general.reviewChecklist,
          ]
        : [...method.reviewChecklist],
    synthesis:
      team.coordinatorMode === 'custom'
        ? '按自定义主理人规则及交付要求汇总。'
        : method.synthesis,
    deliveryRequirements: team.deliveryRequirements,
  }
}
