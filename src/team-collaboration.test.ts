import { describe, expect, it, vi } from 'vitest'
import { BUILTIN_TEAMS } from './team-contract.js'
import { executeTeam } from './team-runtime.js'
import { teamCollaboration } from './team-collaboration.js'
import type { ExpertSummary } from './expert-contract.js'

const team = BUILTIN_TEAMS[0]
const experts: ExpertSummary[] = team.members.map((member) => ({
  slug: member.expertSlug,
  name: member.expertSlug,
  nameEn: member.expertSlug,
  description: '',
  descriptionEn: '',
  division: 'engineering',
  divisionZh: '工程',
  emoji: '',
  custom: false,
}))
const args = () => ({
  team,
  experts,
  enabled: experts.map((e) => e.slug),
  task: '评估首版范围',
  revision: 1,
  readPersona: async () => '专家身份',
})

describe('专家团协作交接', () => {
  it('每个成员收到共同交付要求、队友边界和可追溯的回传规范', async () => {
    const run = vi.fn(async (member: { prompt: string }) => {
      expect(member.prompt).toContain(team.deliveryRequirements)
      for (const peer of team.members)
        expect(member.prompt).toContain(peer.duty)
      expect(member.prompt).toContain('证据与定位')
      expect(member.prompt).toContain('交接给主理人')
      expect(member.prompt).toContain('不得假设已经收到其他成员的结果')
      return '结论与依据'
    })
    const result = await executeTeam({ ...args(), run })
    expect(run).toHaveBeenCalledTimes(3)
    expect(result.coverage).toMatchObject({
      status: 'complete',
      completed: 3,
      total: 3,
      missing: [],
    })
    expect(result.collaboration.reviewChecklist.length).toBeGreaterThan(0)
    expect(result.instruction).toContain('不代表结论已通过验证')
  })
  it('身份读取失败仅影响对应成员，保留其他结果并给出职责缺口', async () => {
    const run = vi.fn(async () => '已完成分析')
    const result = await executeTeam({
      ...args(),
      readPersona: async (expert) => {
        if (expert.slug === experts[1].slug) throw new Error('身份文件不可用')
        return '身份'
      },
      run,
    })
    expect(run).toHaveBeenCalledTimes(2)
    expect(result.coverage).toMatchObject({
      status: 'partial',
      completed: 2,
      total: 3,
      missing: [{ slug: experts[1].slug, duty: team.members[1].duty }],
    })
    expect(result.results[1]).toMatchObject({
      ok: false,
      error: '身份文件不可用',
    })
  })
  it('空白返回不是成功分析，全部失败时禁止给出实质性汇总结论', async () => {
    const result = await executeTeam({ ...args(), run: async () => '  \n ' })
    expect(result.results.every((r) => !r.ok)).toBe(true)
    expect(result.coverage.status).toBe('failed')
    expect(result.instruction).toContain('没有可用的成员结果')
  })
  it('五团有不同的准备与验收重点，自定义规则不混入旧团队专属方法', () => {
    expect(BUILTIN_TEAMS).toHaveLength(5)
    expect(
      new Set(
        BUILTIN_TEAMS.map((t) =>
          JSON.stringify(teamCollaboration(t).reviewChecklist),
        ),
      ).size,
    ).toBe(5)
    const custom = teamCollaboration({
      ...team,
      coordinatorMode: 'custom',
      coordinatorPrompt: '仅按我的要求给出决策依据',
    })
    expect(custom.reviewChecklist.join('')).not.toContain(
      '必须做、建议做、暂缓',
    )
    expect(custom.reviewChecklist.join('')).toContain('自定义主理人规则')
  })
})
