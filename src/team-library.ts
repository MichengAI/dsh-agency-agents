import { randomUUID } from 'node:crypto'
import { localizeTeam } from './team-content-en.js'
import type { CatalogSnapshot } from './expert-contract.js'
import type { ExpertSettingsStore } from './expert-library.js'
import {
  BUILTIN_TEAMS,
  TEAM_CUSTOM_ID,
  teamInputSchema,
  teamSchema,
  type TeamInput,
  type TeamSnapshot,
  type ExpertTeam,
} from './team-contract.js'
export const AGENCY_TEAM_SERVICE = 'agencyAgentsTeams'
export function createTeamLibrary(
  catalog: () => Promise<CatalogSnapshot>,
  store: ExpertSettingsStore,
) {
  const read = () => ({
    custom: (store.read().customTeams ?? []).map((team) =>
      teamSchema.parse(team),
    ),
    enabled: [...(store.read().enabledTeams ?? [])],
  })
  const check = (revision: number) => {
    if (!Number.isSafeInteger(revision) || revision !== store.revision())
      throw new Error('配置已更新，请读取最新内容后重试。')
  }
  const teams = (): ExpertTeam[] => [
    ...structuredClone(BUILTIN_TEAMS),
    ...read().custom,
  ]
  const requireMembers = (team: TeamInput, snapshot: CatalogSnapshot) => {
    if (
      team.members.some(
        (member) =>
          !snapshot.experts.some(
            (expert) => expert.slug === member.expertSlug && !expert.conflict,
          ),
      )
    )
      throw new Error('团队成员已删除或名称冲突，请替换后重试。')
  }
  const library = {
    async snapshot(): Promise<TeamSnapshot> {
      const all = await catalog()
      // 读取名册期间可能有其他窗口写入，不能混用两个修订的配置。
      check(all.revision)
      return {
        teams: teams(),
        enabledTeams: read().enabled,
        enabledExperts: all.enabled,
        revision: all.revision,
      }
    },
    async get(id: string): Promise<ExpertTeam> {
      const team = teams().find((team) => team.id === id)
      if (!team) throw new Error('专家团不存在，请重新选择。')
      return team
    },
    async save(
      input: TeamInput,
      enabled: boolean,
      revision: number,
    ): Promise<TeamSnapshot> {
      const parsed = teamInputSchema.safeParse(input)
      if (!parsed.success || typeof enabled !== 'boolean')
        throw new Error('请检查团队名称、成员分工、任务示例和主理人提示词。')
      const value = parsed.data
      const all = await catalog()
      check(revision)
      if (value.id && !TEAM_CUSTOM_ID.test(value.id))
        throw new Error('内置专家团只读，请复制为自定义。')
      const state = read()
      if (value.id && !state.custom.some((team) => team.id === value.id))
        throw new Error('专家团已删除，请作为新团队保存。')
      if (!value.id && state.custom.length >= 100)
        throw new Error('自定义专家团最多保存 100 个。')
      if (
        teams().some(
          (team) =>
            team.id !== value.id &&
            [team.name, localizeTeam(team, 'en').name].some(name => name.trim().toLowerCase() === value.name.trim().toLowerCase()),
        )
      )
        throw new Error('团队名称已被使用。')
      requireMembers(value, all)
      const team = {
        ...value,
        id: value.id ?? `team-custom-${randomUUID()}`,
        builtin: false,
      }
      await store.mutate(
        [
          {
            op: 'set',
            path: ['customTeams'],
            value: [...state.custom.filter((t) => t.id !== team.id), team],
          },
          {
            op: 'set',
            path: ['enabledTeams'],
            value: [
              ...state.enabled.filter((id) => id !== team.id),
              ...(enabled ? [team.id] : []),
            ],
          },
          ...(enabled
            ? [
                {
                  op: 'set' as const,
                  path: ['enabled'],
                  value: [
                    ...new Set([
                      ...all.enabled,
                      ...team.members.map((m) => m.expertSlug),
                    ]),
                  ],
                },
              ]
            : []),
        ],
        revision,
      )
      return library.snapshot()
    },
    async setEnabled(
      id: string,
      enabled: boolean,
      revision: number,
    ): Promise<TeamSnapshot> {
      const team = await library.get(id)
      const all = await catalog()
      check(revision)
      if (typeof enabled !== 'boolean') throw new Error('启用状态无效。')
      if (enabled) requireMembers(team, all)
      await store.mutate(
        [
          {
            op: 'set',
            path: ['enabledTeams'],
            value: [
              ...read().enabled.filter((item) => item !== id),
              ...(enabled ? [id] : []),
            ],
          },
          ...(enabled
            ? [
                {
                  op: 'set' as const,
                  path: ['enabled'],
                  value: [
                    ...new Set([
                      ...all.enabled,
                      ...team.members.map((m) => m.expertSlug),
                    ]),
                  ],
                },
              ]
            : []),
        ],
        revision,
      )
      return library.snapshot()
    },
    async remove(id: string, revision: number): Promise<TeamSnapshot> {
      check(revision)
      if (!TEAM_CUSTOM_ID.test(id) || !read().custom.some((t) => t.id === id))
        throw new Error('只能删除已有的自定义专家团。')
      await store.mutate(
        [
          {
            op: 'set',
            path: ['customTeams'],
            value: read().custom.filter((t) => t.id !== id),
          },
          {
            op: 'set',
            path: ['enabledTeams'],
            value: read().enabled.filter((t) => t !== id),
          },
        ],
        revision,
      )
      return library.snapshot()
    },
  }
  return library
}
export type AgencyTeamLibrary = ReturnType<typeof createTeamLibrary>
