import { z } from 'zod'
import { TEAM_PROMPTS_EN } from './team-prompts-en.js'
import { TEAM_PROMPTS } from './team-prompts.js'
export { TEAM_PROMPTS }
const text = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .refine((value) => Array.from(value).length <= max)
export const TEAM_CUSTOM_ID =
  /^team-custom-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u
export const teamMemberSchema = z
  .object({ expertSlug: text(128), duty: text(100), instructions: text(2000) })
  .strict()
export const teamInputSchema = z
  .object({
    id: z
      .string()
      .regex(/^team-(?:[a-z]+|custom-[0-9a-f-]+)$/u)
      .optional(),
    builtin: z.boolean().optional(),
    name: text(40).refine((value) => !/[@\r\n\u0000-\u001f]/u.test(value)),
    description: text(160),
    tags: z.array(text(16)).max(3),
    goal: text(2000),
    constraints: z.string().trim().max(2000),
    deliveryRequirements: text(2000),
    members: z
      .array(teamMemberSchema)
      .min(2)
      .max(8)
      .refine(
        (items) =>
          new Set(items.map((item) => item.expertSlug)).size === items.length,
      ),
    examples: z.array(text(1000)).min(1).max(3),
    coordinatorMode: z.enum(['template', 'custom']),
    coordinatorTemplateId: z.enum([
      'general',
      'product',
      'technical',
      'content',
      'data',
      'research',
    ]),
    coordinatorTemplateVersion: z.literal(1),
    coordinatorPrompt: z
      .string()
      .refine((value) => Array.from(value).length <= 12000),
  })
  .strict()
  .refine(
    (value) =>
      value.coordinatorMode !== 'custom' ||
      value.coordinatorPrompt.trim().length > 0,
  )
export type TeamInput = z.infer<typeof teamInputSchema>
export type ExpertTeam = TeamInput & { id: string; builtin: boolean }
export const teamSchema = teamInputSchema.and(
  z.object({ id: z.string(), builtin: z.boolean() }),
)
export const teamEngineStatusSchema = z.object({
  state: z.enum(['unsupported', 'disabled', 'enabled']),
  mode: z.enum(['subagent', 'native']),
  reason: z.string(),
  recommendation: z.string(),
})
export type TeamEngineStatus = z.infer<typeof teamEngineStatusSchema>
export const teamSnapshotSchema = z.object({
  teams: z.array(teamSchema),
  enabledTeams: z.array(z.string()),
  enabledExperts: z.array(z.string()),
  revision: z.number().int().min(0),
  engine: teamEngineStatusSchema.optional(),
  nativeMembers: z.record(z.string(), z.string()).optional(),
})
export type TeamSnapshot = z.infer<typeof teamSnapshotSchema>
export const effectiveCoordinator = (team: TeamInput, locale: 'zh' | 'en' = 'zh'): string =>
  team.coordinatorMode === 'custom'
    ? team.coordinatorPrompt
    : (locale === 'en' ? TEAM_PROMPTS_EN : TEAM_PROMPTS)[team.coordinatorTemplateId]
const member = (expertSlug: string, duty: string, instructions: string) => ({
  expertSlug,
  duty,
  instructions,
})
const TEAM_DESCRIPTIONS = {
  product: '适合需求评审、方案比较与迭代规划。结合用户价值、使用体验和实现成本，明确首版范围、功能优先级及下一步行动。',
  technical: '适合架构设计评审与交付前检查。从架构、安全和质量三个角度定位风险，给出最小修改建议与可执行的验收清单。',
  content: '适合选题规划与内容方向筛选。结合受众需求、平台传播特点和素材依据，提出选题、标题与大纲，标明需要补充的事实材料。',
  data: '适合指标复盘、异常排查与报表分析。先核对数据质量和统计口径，再解释业务变化，给出分析结论、图表方案及待验证问题。',
  research: '适合专题调研、趋势判断与方案决策。梳理可信来源、变化因素和不同方案的利弊，形成有依据的建议，并说明争议与适用条件。',
} satisfies Record<Exclude<TeamInput['coordinatorTemplateId'], 'general'>, string>
const define = (
  id: keyof typeof TEAM_DESCRIPTIONS,
  name: string,
  goal: string,
  tags: string[],
  members: TeamInput['members'],
  deliveryRequirements: string,
  examples: string[],
): ExpertTeam => ({
  id: `team-${id}`,
  builtin: true,
  name,
  description: TEAM_DESCRIPTIONS[id],
  tags,
  members,
  goal,
  constraints: '仅进行分析评审；依据不足时明确说明，不擅自修改或发布。',
  deliveryRequirements,
  examples,
  coordinatorMode: 'template',
  coordinatorTemplateId: id,
  coordinatorTemplateVersion: 1,
  coordinatorPrompt: '',
})
export const BUILTIN_TEAMS: readonly ExpertTeam[] = [
  define(
    'product',
    '产品方案评审团',
    '从价值、体验和可行性评估产品方案。',
    ['需求评审', '方案比较', '迭代规划'],
    [
      member(
        'product-manager',
        '需求价值与优先级',
        '检查目标用户、核心问题和需求范围，按同一需求项列出必须做、建议做和暂缓事项、价值依据及成功指标。区分反馈与假设；将体验证据缺口交给主理人对照研究意见，将成本未知项对照架构意见，不代替队友判断。',
      ),
      member(
        'design-ux-researcher',
        '用户需求与体验障碍',
        '按用户完成任务的实际步骤定位体验障碍，说明受影响人群、已有反馈及未经验证的假设。为每个障碍给出低成本验证方法和验收信号；将影响需求优先级的问题交接给主理人，不替代产品排期和技术估算。',
      ),
      member(
        'engineering-software-architect',
        '实现成本与技术约束',
        '按需求项分析实现范围、已有能力、外部依赖和技术约束，提出最小交付路径及备选方案。说明成本判断依据与未知项，不编造工期；交接可能改变需求范围或用户流程的技术限制。',
      ),
    ],
    '优先级与行动清单',
    [
      '评估这份需求，明确首版必须做和可以暂缓的功能。',
      '比较两个产品方案，给出价值、体验和成本上的取舍。',
      '根据现有功能和用户反馈，制定下一阶段迭代计划。',
    ],
  ),
  define(
    'technical',
    '技术方案评审团',
    '检查架构、安全风险与验收边界。',
    ['架构评审', '安全风险', '交付验收'],
    [
      member(
        'engineering-software-architect',
        '架构与扩展性',
        '沿组件、接口和数据流检查职责边界、依赖、兼容性及可维护性。每个发现给出位置、触发条件、影响和最小修改方案；标记需主理人对照安全意见与回归用例的变更点，不宣称未执行的测试通过。',
      ),
      member(
        'security-appsec-engineer',
        '权限与安全风险',
        '沿输入入口、权限检查和敏感数据流识别风险，给出位置、攻击前提、影响及最小修复建议。区分已验证漏洞、设计风险和材料缺口；交接应阻断放行的条件及需要质量角色覆盖的验证场景。',
      ),
      member(
        'testing-reality-checker',
        '验收边界与质量',
        '依据现有方案独立列出正常、异常、边界、兼容与回滚场景，逐项写明前置条件、操作和预期结果。区分实际执行结果与建议用例；交接需主理人结合架构和安全发现补充的覆盖点，不假设已经拿到队友报告。',
      ),
    ],
    '风险与验收清单',
    [
      '评审这份技术方案，指出阻断交付的风险及最小修改建议。',
      '检查接口与权限设计，列出需要补充的验证。',
      '为这次改动制定清晰、可执行的验收清单。',
    ],
  ),
  define(
    'content',
    '内容选题策划团',
    '找到值得写、适合传播的内容方向。',
    ['内容策划', '传播策略', '事实核验'],
    [
      member(
        'marketing-content-creator',
        '选题角度与表达',
        '围绕同一主题及已提供的候选方向，按目标受众价值提出有区分度的选题、标题、大纲和开头。每个核心论点关联已有素材或标记待补；交接需核实的事实及需要传播意见确认的平台表达，不编造案例。',
      ),
      member(
        'marketing-growth-hacker',
        '人群与传播策略',
        '围绕已提供的主题或候选方向分析目标人群、平台使用场景、点击与分享动机，给出包装建议和可观察指标。说明推荐依据及平台限制，不承诺流量；将夸大标题或素材不足的风险交给主理人核对。',
      ),
      member(
        'research-synthesist',
        '素材依据与事实缺口',
        '为已提供主题、素材及核心论点建立事实—出处对应表，检查来源、日期、引用语境和可用范围。区分已支持、待核实与不宜使用的论点，列出补证方向；没有收到创作结果时不要声称已核验其新标题或大纲。',
      ),
    ],
    '选题与内容大纲',
    [
      '根据账号定位和已有素材，提出三个值得写的选题。',
      '评估这些内容方向，按受众价值和素材可用性排序。',
      '把这个主题拆成适合目标平台的内容大纲，标明待补素材。',
    ],
  ),
  define(
    'data',
    '数据分析诊断团',
    '核对数据口径，发现问题并解释结果。',
    ['数据质量', '业务分析', '图表表达'],
    [
      member(
        'engineering-data-engineer',
        '数据质量与统计口径',
        '检查字段、时间窗口、单位、样本、缺失值、重复记录和指标分母，输出可供主理人核对的口径表及质量问题。说明问题对哪些指标有影响、哪些比较不能成立；材料不足时列出所需字段，不虚构清洗或查询结果。',
      ),
      member(
        'support-analytics-reporter',
        '业务指标与异常',
        '围绕业务问题分析指标与异常，每个关键数值附数据来源、时间、单位、分母及计算方式。明确质量假设和替代解释，不把相关性当因果性；交接需主理人对照质量报告确认的口径，未核实前使用条件性结论。',
      ),
      member(
        'engineering-data-visualization-engineer',
        '图表与结果表达',
        '依据实际可用字段与业务问题提出图表方案，明确横纵轴、单位、聚合方式、对比基准和必要标注。说明可能误读的尺度或样本问题；未收到已核验数值时只提供方案，不编造图表数据，将口径依赖交接给主理人。',
      ),
    ],
    '分析结论与图表建议',
    [
      '分析这份数据，先核对口径，再解释主要异常。',
      '比较这两期业务指标，区分真实变化与统计口径差异。',
      '根据这些字段提出图表方案，并说明能支持哪些结论。',
    ],
  ),
  define(
    'research',
    '专题研究专家团',
    '梳理证据、趋势与不同方案的取舍。',
    ['证据梳理', '趋势分析', '方案比较'],
    [
      member(
        'research-synthesist',
        '证据可信度与来源',
        '围绕研究问题建立论点—来源—日期—适用范围证据表，优先一手资料，区分同源转述和独立来源。指出冲突、过时信息与尚无依据的判断；交接趋势或方案比较应遵守的证据边界，无法检索时明确资料范围。',
      ),
      member(
        'product-trend-researcher',
        '变化与驱动因素',
        '分析指定时间与地区内的变化方向、驱动因素和替代解释，区分事实、趋势推断及情景假设。每项判断关联证据并给出反证或失效条件；交接需要主理人核查的时效和口径，不凭同源重复报道增强确信。',
      ),
      member(
        'specialized-strategy-duel-agent',
        '竞争方案与取舍',
        '基于用户决策目标使用一致维度比较备选方案，说明适用条件、收益、成本、风险及可逆性。给出推荐及可能推翻它的证据，不编造精确评分；将关键假设交接给主理人对照来源与趋势意见。',
      ),
    ],
    '研究结论与证据来源',
    [
      '围绕这个问题整理可信证据，说明可以确认和仍有争议的内容。',
      '比较这些解决方案，给出适用条件与取舍建议。',
      '分析这个领域的趋势、驱动因素及可能推翻判断的反证。',
    ],
  ),
]
