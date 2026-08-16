/**
 * Agency 客户端词条字典。zh 为 key 集真相源；en 用 satisfies 校验 key 与 zh
 * 完全一致（缺 key 或多余 key 均为编译错误）。模板占位符使用平台约定的
 * {word} 形式（locale 服务 translate 以 /\{(\w+)\}/g 替换）。
 */
import { ZH_DIVISION } from '../names.js'

/** 简体中文词条（key 集真相源）。 */
export const zh = {
  'settings.nav': '专家',
  'button.title': '召唤专家',
  'menu.empty': '暂无可召唤的专家',
  'settings.loading': '正在加载专家…',
  'settings.intro': '选择对话里可以召唤的专家。关闭后不会出现在 @ 菜单中。',
  'settings.enabled': '已启用',
  'settings.disabled': '已停用',
  'group.count': '{division}（{count}）',
  'summon.instruction': '召唤专家「{name}」（{slug}）处理以下任务：',
  'summon.instruction.withTask': '召唤专家「{name}」（{slug}）处理以下任务：\n{task}',
  'division.academic': ZH_DIVISION.academic,
  'division.design': ZH_DIVISION.design,
  'division.engineering': ZH_DIVISION.engineering,
  'division.finance': ZH_DIVISION.finance,
  'division.game-development': ZH_DIVISION['game-development'],
  'division.gis': ZH_DIVISION.gis,
  'division.healthcare': ZH_DIVISION.healthcare,
  'division.marketing': ZH_DIVISION.marketing,
  'division.paid-media': ZH_DIVISION['paid-media'],
  'division.product': ZH_DIVISION.product,
  'division.project-management': ZH_DIVISION['project-management'],
  'division.sales': ZH_DIVISION.sales,
  'division.security': ZH_DIVISION.security,
  'division.spatial-computing': ZH_DIVISION['spatial-computing'],
  'division.specialized': ZH_DIVISION.specialized,
  'division.support': ZH_DIVISION.support,
  'division.testing': ZH_DIVISION.testing,
} satisfies Record<string, string>

/** agency 命名空间词条 key 联合。 */
export type AgencyKey = keyof typeof zh

/** 英文词条，key 完整性由 satisfies 在编译期保证。 */
export const en = {
  'settings.nav': 'Experts',
  'button.title': 'Summon expert',
  'menu.empty': 'No experts available yet',
  'settings.loading': 'Loading experts…',
  'settings.intro': 'Choose which experts can be summoned in chat. Disabled experts stay out of the @ menu.',
  'settings.enabled': 'Enabled',
  'settings.disabled': 'Disabled',
  'group.count': '{division} ({count})',
  'summon.instruction': 'Summon expert "{name}" ({slug}) to handle the following task:',
  'summon.instruction.withTask': 'Summon expert "{name}" ({slug}) to handle the following task:\n{task}',
  'division.academic': 'Academic',
  'division.design': 'Design',
  'division.engineering': 'Engineering',
  'division.finance': 'Finance',
  'division.game-development': 'Game Development',
  'division.gis': 'GIS',
  'division.healthcare': 'Healthcare',
  'division.marketing': 'Marketing',
  'division.paid-media': 'Paid Media',
  'division.product': 'Product',
  'division.project-management': 'Project Management',
  'division.sales': 'Sales',
  'division.security': 'Security',
  'division.spatial-computing': 'Spatial Computing',
  'division.specialized': 'Specialized',
  'division.support': 'Support',
  'division.testing': 'Testing',
} satisfies Record<AgencyKey, string>
