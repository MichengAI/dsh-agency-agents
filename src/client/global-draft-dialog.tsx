import React from 'react'
import { createRoot } from 'react-dom/client'
import type { StoredProposal } from '../creation-tools.js'
import { CustomExpertEditor } from './custom-editor.js'
import { TeamEditor } from './team-editor.js'
import { TeamLocaleContext } from './team-locale.js'
import { unwrap } from './team-ui.js'
import { ZH_DIVISION } from '../names.js'
import type { CatalogSnapshot } from '../expert-contract.js'
import type { TeamSnapshot } from '../team-contract.js'

export interface GlobalDraftDialogOptions {
  proposal: StoredProposal
  remote: any
  locale: 'zh' | 'en'
  t: (key: string, params?: Record<string, string | number>) => string
  onSaved?: () => void
}

export function openGlobalDraftEditor(options: GlobalDraftDialogOptions): void {
  const container = document.createElement('div')
  container.className = 'aag-global-draft-root'
  document.body.appendChild(container)
  const root = createRoot(container)

  let cleaned = false
  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    queueMicrotask(() => {
      root.unmount()
      container.remove()
    })
  }

  function ExpertHost() {
    const [catalog, setCatalog] = React.useState<CatalogSnapshot | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
      let active = true
      unwrap<CatalogSnapshot>(options.remote.getCatalog())
        .then((data) => {
          if (!active) return
          setCatalog(data)
          setLoading(false)
        })
        .catch(() => {
          if (!active) return
          setLoading(false)
        })
      return () => { active = false }
    }, [])

    if (loading || !catalog) return null

    return (
      <CustomExpertEditor
        expert={options.proposal.data as any}
        enabled={true}
        revision={catalog.revision}
        divisions={[...new Set([...Object.keys(ZH_DIVISION), ...catalog.experts.map(e => e.division)])]}
        remote={options.remote}
        t={options.t as any}
        locale={options.locale}
        onClose={cleanup}
        onSaved={() => {
          options.onSaved?.()
          cleanup()
        }}
      />
    )
  }

  function TeamHost() {
    const [data, setData] = React.useState<{ catalog: CatalogSnapshot; teams: TeamSnapshot } | null>(null)
    const [loading, setLoading] = React.useState(true)

    const fetchAll = React.useCallback(async () => {
      const [catalogData, teamData] = await Promise.all([
        unwrap<CatalogSnapshot>(options.remote.getCatalog()),
        unwrap<TeamSnapshot>(options.remote.getTeams()),
      ])
      setData({ catalog: catalogData, teams: teamData })
      setLoading(false)
      return teamData
    }, [])

    React.useEffect(() => {
      let active = true
      fetchAll().catch(() => {
        if (!active) return
        setLoading(false)
      })
      return () => { active = false }
    }, [fetchAll])

    if (loading || !data) return null

    return (
      <TeamLocaleContext.Provider value={options.locale}>
        <TeamEditor
          initial={options.proposal.data as any}
          experts={data.catalog.experts}
          enabled={true}
          enabledExperts={data.teams.enabledExperts ?? []}
          close={cleanup}
          refresh={fetchAll}
          save={async (value, enabled, revision) => {
            const rev = revision ?? data.teams.revision
            await unwrap(options.remote.saveTeam(value, enabled, rev))
            options.onSaved?.()
            cleanup()
          }}
        />
      </TeamLocaleContext.Provider>
    )
  }

  root.render(
    options.proposal.kind === 'expert' ? <ExpertHost /> : <TeamHost />
  )
}
