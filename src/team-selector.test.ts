import { describe, expect, it } from 'vitest'
import { BUILTIN_TEAMS, type ExpertTeam } from './team-contract.js'
import { selectTeam } from './team-selector.js'


const product = BUILTIN_TEAMS[0]
const collision = 'Equipe de avaliação de produto'
const custom = {
  ...product, id: 'custom-product', builtin: false, name: collision,
  description: '  Mi equipo 自定义 {0} $& \r\n Cafe\u0301  ',
  coordinatorMode: 'custom' as const, coordinatorPrompt: 'Minha regra: 保存 {0}',
}

describe('selectTeam', () => {
  it('selects the existing custom label when the built-in is disabled without changing custom content', () => {
    const result = selectTeam({ teams: [product, custom], enabledTeams: ['custom-product'] }, collision, 'pt-BR')
    expect(result).toEqual({ kind: 'found', team: custom })
    if (result.kind === 'found') expect(result.team).toBe(custom)
  })

  it('reports the enabled teams with the same full name instead of picking the first', () => {
    const enabledTeams = ['team-product', 'custom-product']
    for (const teams of [[product, custom], [custom, product]]) {
      expect(selectTeam({ teams, enabledTeams }, collision, 'pt-BR')).toEqual({
        kind: 'ambiguous', ids: ['custom-product', 'team-product'],
      })
    }
  })

  it('chooses an exact enabled ID even if an earlier team uses the ID as its name', () => {
    const namedLikeId = { ...custom, name: 'team-product' }
    const snapshot = { teams: [namedLikeId, product], enabledTeams: ['custom-product', 'team-product'] }
    expect(selectTeam(snapshot, 'team-product', 'pt')).toMatchObject({
      kind: 'found', team: { id: 'team-product', name: collision },
    })
    expect(selectTeam(snapshot, 'custom-product', 'pt')).toEqual({ kind: 'found', team: namedLikeId })
  })

  it('does not reinterpret a disabled stable ID as the name of an enabled team', () => {
    const snapshot = { teams: [{ ...custom, name: 'team-product' }, product], enabledTeams: ['custom-product'] }
    expect(selectTeam(snapshot, 'team-product', 'pt')).toEqual({ kind: 'unavailable' })
  })

  it.each(['Product Review Team', '产品方案评审团', 'Equipo de evaluación de producto'])(
    'resolves the exact full name %s without duplicating aliases for a single team', (name) => {
      expect(selectTeam({ teams: [product], enabledTeams: ['team-product'] }, name, 'es-419')).toMatchObject({
        kind: 'found', team: { id: 'team-product', name: 'Equipo de evaluación de producto' },
      })
    },
  )

  it.each(['no such team', 'equipe de avaliação de produto', 'Equipe de avaliação de produto '])(
    'does not match a missing or non-exact full name %s', (name) => {
      expect(selectTeam({ teams: [product, custom], enabledTeams: ['team-product', 'custom-product'] }, name, 'pt')).toEqual({ kind: 'unavailable' })
    },
  )
})
