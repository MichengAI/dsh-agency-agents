import { describe, expect, it } from 'vitest'
import { filterTeamMemberCandidates } from './team-member-picker.js'

const expert = (slug: string, custom = false, division = 'engineering') => ({
  slug,
  name: slug,
  nameEn: slug,
  description: `${slug} 职责`,
  custom,
  division,
  conflict: false,
})

describe('专家团成员选择', () => {
  it('已启用筛选不包含停用专家，全部和已停用仍可选停用专家', () => {
    const experts = [expert('enabled-one'), expert('disabled-one'), expert('enabled-two')]
    const enabled = ['enabled-one', 'enabled-two']
    const taken = [{ expertSlug: 'nobody' }]

    expect(filterTeamMemberCandidates(experts, {
      source: 'all', division: '', status: 'enabled', enabled, taken, replacing: -1, query: '',
    }).map(item => item.slug)).toEqual(['enabled-one', 'enabled-two'])
    expect(filterTeamMemberCandidates(experts, {
      source: 'all', division: '', status: '', enabled, taken, replacing: -1, query: '',
    }).map(item => item.slug)).toEqual(['enabled-one', 'disabled-one', 'enabled-two'])
    expect(filterTeamMemberCandidates(experts, {
      source: 'all', division: '', status: 'disabled', enabled, taken, replacing: -1, query: '',
    }).map(item => item.slug)).toEqual(['disabled-one'])
  })

  it('已占用成员除外，正在替换的那位和名称冲突的专家不进入候选', () => {
    const experts = [
      expert('kept'),
      { ...expert('taken'), conflict: true },
      expert('replacing'),
    ]
    const result = filterTeamMemberCandidates(experts, {
      source: 'all', division: '', status: '', enabled: ['kept', 'taken', 'replacing'],
      taken: [{ expertSlug: 'taken' }, { expertSlug: 'replacing' }],
      replacing: 1,
      query: '',
    })
    expect(result.map(item => item.slug)).toEqual(['kept', 'replacing'])
  })

  it('来源、分类和搜索与状态同时生效，搜索不能绕过已启用', () => {
    const experts = [
      expert('enabled-base'),
      expert('disabled-base'),
      { ...expert('enabled-custom', true, 'marketing'), name: '增长顾问', nameEn: 'growth', description: '投放' },
    ]
    expect(filterTeamMemberCandidates(experts, {
      source: 'custom', division: 'marketing', status: 'enabled', enabled: ['enabled-base', 'enabled-custom'],
      taken: [], replacing: -1, query: '增长',
    }).map(item => item.slug)).toEqual(['enabled-custom'])
    expect(filterTeamMemberCandidates(experts, {
      source: 'all', division: '', status: 'enabled', enabled: ['enabled-base'],
      taken: [], replacing: -1, query: 'disabled-base',
    })).toEqual([])
  })
})
