import React from 'react'
import { observePluginUpdate } from '../../src/client/plugin-update-ui'
import { createPluginUpdateIcon } from '../../src/client/index'
import { teamText } from '../../src/team-i18n'
import { AgentsButton, AgencySettingsPanel, CSS } from '../../src/client/index'
import { CUSTOM_EDITOR_CSS } from '../../src/client/custom-editor'
import { confirmTeamAction } from '../../src/client/team-confirmation'
import { zh, en } from '../../src/client/locales'
import { TeamsPanel, TEAM_CSS, type TeamRemote } from '../../src/client/team-ui'
import { BUILTIN_TEAMS, type TeamSnapshot } from '../../src/team-contract'
import { ROSTER } from '../../src/client/roster'
import { ZH_NAME, ZH_DIVISION } from '../../src/names'
import {
  IconSettings,
  IconDatabase,
  IconPuzzle,
  IconUsers,
  IconClock,
  IconHierarchy,
} from '@tabler/icons-react'
const experts = ROSTER.map((e) => ({
  ...e,
  name: ZH_NAME[e.slug] ?? e.nameEn,
  divisionZh: ZH_DIVISION[e.division] ?? e.division,
  custom: false,
}))
const translate = ((key: string, values?: Record<string, unknown>) => (((params.get('lang') === 'en' ? en : zh) as Record<string, string>)[key] ?? key).replace(/\{(\w+)\}/gu, (match, name: string) => values?.[name] === undefined ? match : String(values[name]))) as React.ComponentProps<typeof AgencySettingsPanel>['t']
const params = new URLSearchParams(location.search)
const activeLocale = () => params.get('lang') === 'en' ? 'en' as const : 'zh' as const
let deleteFailure = params.has('deleteFailure')
let snapshot: TeamSnapshot = {
  ...(params.has('teamDisabled') ? { engine: { state: 'disabled' as const, mode: 'subagent' as const, reason: teamText(activeLocale(), 'Agent Team 服务或当前会话工具尚未就绪。'), recommendation: teamText(activeLocale(), '建议在插件页开启 Agent Team 的 Host 与 Web 层，并重新加载会话；未开启也可继续使用普通专家团。') } } : {}),
  teams: structuredClone([...BUILTIN_TEAMS]),
  enabledTeams: params.has('visual')
    ? BUILTIN_TEAMS.slice(0, 2).map((t) => t.id)
    : [],
  enabledExperts: params.has('visual')
    ? [
        ...new Set(
          BUILTIN_TEAMS.slice(0, 2).flatMap((t) =>
            t.members.map((m) => m.expertSlug),
          ),
        ),
      ]
    : [],
  revision: 0,
}
const unsupported = async (): Promise<never> => {
  throw new Error('此夹具不操作个人专家')
}
const check = (revision: number) => {
  if (revision !== snapshot.revision) throw new Error('配置已更新，请刷新。')
}
const remote: TeamRemote = {
  getTeams: async () => ({ ok: true, value: structuredClone(snapshot) }),
  getCatalog: async () => ({
    ok: true,
    value: {
      experts,
      enabled: [...snapshot.enabledExperts],
      revision: snapshot.revision,
    },
  }),
  getCustomExpert: unsupported,
  saveCustomExpert: unsupported,
  deleteCustomExpert: unsupported,
  saveTeam: async (input, enabled, revision) => {
    check(revision)
    const team = {
      ...structuredClone(input),
      id: input.id ?? `team-custom-${crypto.randomUUID()}`,
      builtin: false,
    }
    snapshot = {
      ...snapshot,
      teams: [...snapshot.teams.filter((t) => t.id !== team.id), team],
      enabledTeams: [
        ...snapshot.enabledTeams.filter((id) => id !== team.id),
        ...(enabled ? [team.id] : []),
      ],
      enabledExperts: enabled
        ? [
            ...new Set([
              ...snapshot.enabledExperts,
              ...team.members.map((m) => m.expertSlug),
            ]),
          ]
        : snapshot.enabledExperts,
      revision: revision + 1,
    }
    return { ok: true, value: structuredClone(snapshot) }
  },
  setTeamEnabled: async (id, enabled, revision) => {
    check(revision)
    const team = snapshot.teams.find((t) => t.id === id)!
    snapshot = {
      ...snapshot,
      enabledTeams: [
        ...snapshot.enabledTeams.filter((t) => t !== id),
        ...(enabled ? [id] : []),
      ],
      enabledExperts: enabled
        ? [
            ...new Set([
              ...snapshot.enabledExperts,
              ...team.members.map((m) => m.expertSlug),
            ]),
          ]
        : snapshot.enabledExperts,
      revision: revision + 1,
    }
    return { ok: true, value: structuredClone(snapshot) }
  },
  deleteTeam: async (id, revision) => {
    if (deleteFailure) { deleteFailure = false; throw new Error('删除失败，请重试。') }
    check(revision)
    snapshot = {
      ...snapshot,
      teams: snapshot.teams.filter((t) => t.id !== id),
      enabledTeams: snapshot.enabledTeams.filter((t) => t !== id),
      revision: revision + 1,
    }
    return { ok: true, value: structuredClone(snapshot) }
  },
}
Object.assign(window, { teamFixtureState: () => structuredClone(snapshot) })
Object.assign(window, { teamFixtureConflict: () => {
  snapshot = { ...snapshot, revision: snapshot.revision + 1, teams: snapshot.teams.map(team => team.builtin ? team : { ...team, description: '其他窗口更新的简介' }) }
} })
export function TeamsFixture() {
  const [, refreshLocale] = React.useState(0)
  React.useEffect(() => {
    Object.assign(window, {
      teamFixtureLocale: (locale: string) => { params.set('lang', locale); refreshLocale(value => value + 1) },
      teamFixtureConfirm: () => confirmTeamAction(teamText(activeLocale(), '草稿已有正文，是否保留正文并追加所选示例？取消则仅选择团队。'), activeLocale()),
    })
  }, [])
  React.useEffect(() => {
    if (!params.has('updateUI')) return
    return observePluginUpdate({ endpoint: '/api/plugin-update', packageName: '@michengai/dsh-agency-agents', titleRowSelector: '.aag-title-row', linksSelector: '.aag-settings-links', zhName: '专家', enName: 'Experts', createIcon: createPluginUpdateIcon })
  }, [])
  const [draft, setDraft] = React.useState('')
  const [selected, setSelected] = React.useState('')

  if (params.has('settings')) return <>
    <style>{CSS + CUSTOM_EDITOR_CSS + `body{margin:0;background:#101010;font:14px 'Segoe UI','Microsoft YaHei',sans-serif;--dsw-alias-label-primary:#eee;--dsw-alias-label-secondary:#c2c4c7;--dsw-alias-label-tertiary:#999;--dsw-alias-border-l2:#444;--dsw-alias-border-l3:#555;--dsw-alias-bg-layer-2:#2b2b2d;--dsw-alias-bg-layer-3:#38383b;--dsw-alias-button-primary-fill:#6688fa;--dsw-alias-label-primary-foreground:#111;--dsw-alias-state-success-primary:#25cf69;--dsw-alias-interactive-bg-hover:#424248}.settings-window{box-sizing:border-box;margin:56px auto;width:min(800px,calc(100vw - 32px));height:800px;background:#2b2b2d;border-radius:32px;padding:24px;overflow:auto;color:#eee}.settings-layout{display:grid;grid-template-columns:164px minmax(0,1fr);gap:36px;margin-top:24px}.settings-sidebar{padding-top:16px}.settings-sidebar button{display:block;width:100%;text-align:left;margin:12px 0;padding:12px;border:0;font:inherit;color:inherit;background:transparent;border-radius:10px;cursor:pointer}.settings-sidebar button[aria-current=page]{background:#44464b}@media(max-width:600px){.settings-layout{grid-template-columns:1fr;gap:0}.settings-sidebar{display:none}.settings-window{padding:16px;margin:16px auto}}`}</style>
    <style>{'body{--dsw-alias-border-l4:#555;--dsw-alias-label-dimmed:#999;--dsw-alias-brand-primary:#6688fa;--dsw-alias-button-primary-hover:#5577e9;--dsw-alias-bg-layer-1:#202022;--dsw-specific-menu:#363638;--dsw-alias-bg-mask-1:#0008;--dsw-mask-blur:blur(2px);--dsw-elevation-prominent:0 6px 20px #0003}' + (params.get('theme') === 'light' ? 'body{--dsw-alias-border-l4:#bbb;--dsw-alias-label-dimmed:#777;--dsw-alias-label-primary:#202020;--dsw-alias-label-secondary:#555;--dsw-alias-label-tertiary:#777;--dsw-alias-label-primary-foreground:#fff;--dsw-alias-bg-layer-1:#f5f5f5;--dsw-alias-bg-layer-2:#fff;--dsw-alias-bg-layer-3:#eee;--dsw-specific-menu:#fff;--dsw-alias-border-l2:#ddd;--dsw-alias-border-l3:#bbb;--dsw-alias-interactive-bg-hover:#e8e8e8;--dsw-alias-bg-mask-1:#0004}.settings-window{background:#fff;color:#202020}' : '')}</style>
    <div className="settings-window">设置<div className="settings-layout"><aside className="settings-sidebar">通用设置<button aria-current="page">专家</button>技能</aside><main>
      <AgencySettingsPanel remote={{ ...remote, getEnabled: async () => ({ ok: true, value: { enabled: snapshot.enabledExperts, revision: snapshot.revision } }), setEnabled: unsupported, getPrompt: unsupported }} getActive={activeLocale} t={translate} prepareTeamSelection={() => () => true} />
    </main></div></div>
  </>
  if (params.has('menu'))
    return (
      <>
        <style>{CSS}</style>
        <div style={{ position: 'fixed', bottom: 20, left: 20, right: 20 }}>
          <textarea
            aria-label="任务草稿"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <p aria-label="已选专家团">{selected}</p>
          <AgentsButton
            remote={{
              ...remote,
              getEnabled: async () => ({
                ok: true,
                value: {
                  enabled: snapshot.enabledExperts,
                  revision: snapshot.revision,
                },
              }),
              setEnabled: unsupported,
              getPrompt: unsupported,
            }}
            getActive={activeLocale}
            t={translate}
            prepareTeamSelection={() => (team, example) => {
              setSelected(team.name)
              if (example) setDraft(example)
              return true
            }}
          />
        </div>
      </>
    )
  return (
    <>
      <style>
        {CSS + CUSTOM_EDITOR_CSS +
          `body{margin:0;background:#202222;color:#f2f2f2;font-family:'Segoe UI','Microsoft YaHei',sans-serif}.team-fixture{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:100vh}.fixture-sidebar{background:#292c2b;padding:28px 20px;display:flex;flex-direction:column;gap:12px}.fixture-sidebar h2{font-size:24px;margin:0 12px 16px}.fixture-sidebar div{display:flex;align-items:center;gap:16px;padding:16px 12px;font-size:20px;border-radius:10px}.fixture-sidebar div.active{background:#414645}.fixture-sidebar svg{width:26px;height:26px}.fixture-sidebar footer{margin-top:auto;padding:24px 12px;color:#aeb5b1;border-top:1px solid #444}.fixture-main{padding:26px 30px}.fixture-title{font-size:32px;margin:0 0 16px}.fixture-tabs{display:flex;gap:36px;border-bottom:1px solid #444;margin-bottom:20px}.fixture-tabs span{padding:12px 8px;font-size:20px}.fixture-tabs span:last-child{border-bottom:3px solid #b9e6cf}.fixture-draft{margin-top:24px;width:90%;background:#242827;color:white;border:1px solid #555;padding:14px}.team-fixture:has(.agt-dialog[open]) .fixture-draft{visibility:hidden}@media(max-width:800px){.team-fixture{grid-template-columns:1fr}.fixture-sidebar{display:none}.fixture-main{padding:16px}}`}
      </style>
      <div className="team-fixture">
        <aside className="fixture-sidebar">
          <h2>设置</h2>
          <div>
            <IconSettings />
            通用设置
          </div>
          <div>
            <IconDatabase />
            模型
          </div>
          <div>
            <IconPuzzle />
            插件
          </div>
          <div className="active">
            <IconUsers />
            专家
          </div>
          <div>
            <IconHierarchy />
            Agent 预设
          </div>
          <div>
            <IconClock />
            定时任务
          </div>
          <footer>Agency Agents</footer>
        </aside>
        <main className="fixture-main">
          <h1 className="fixture-title">专家库</h1>
          <nav className="fixture-tabs">
            <span>专家</span>
            <span>专家团</span>
          </nav>
          <TeamsPanel
            remote={remote}

            onSelect={(_team, example) => {
              setDraft(example ?? '请评估我提供的方案。')
              return true
            }}
          />
          {!params.has('visual') && (
            <textarea
              className="fixture-draft"
              aria-label="任务草稿"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}
        </main>
      </div>
    </>
  )
}
