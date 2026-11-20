import React from 'react'
import { createRoot } from 'react-dom/client'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import type { StoredProposal } from '../creation-tools.js'
import { CustomExpertEditor } from './custom-editor.js'
import { TeamEditor } from './team-editor.js'
import { TeamLocaleContext } from './team-locale.js'
import { unwrap } from './team-ui.js'
import { ZH_DIVISION } from '../names.js'
import { personaLocale, type AgencyLocale } from '../agency-locale.js'
import { acceptCatalog } from './catalog.js'
import type { CatalogSnapshot } from '../expert-contract.js'
import type { TeamSnapshot } from '../team-contract.js'

export interface GlobalDraftDialogOptions {
  proposal: StoredProposal
  remote: any
  locale: AgencyLocale
  isCurrent: () => boolean
  revalidate: () => Promise<boolean>
  onClose?: () => void
  t: TranslateNS<'agency'>
  onSaved?: (catalog?: CatalogSnapshot) => void
}

export function openGlobalDraftEditor(options: GlobalDraftDialogOptions): () => void {
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
      options.onClose?.()
    })
  }

  function ExpertHost() {
    const [catalog, setCatalog] = React.useState<CatalogSnapshot | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
      let active = true
      unwrap<CatalogSnapshot>(options.remote.getCatalog())
        .then(async data => {
          if (!active || cleaned) return
          const valid = options.isCurrent() && await options.revalidate()
          if (!active || cleaned) return
          if (!valid || !options.isCurrent()) return cleanup()
          setCatalog(data)
          setLoading(false)
        })
        .catch(() => {
          if (!active) return
          cleanup()
        })
      return () => { active = false }
    }, [])

    if (cleaned || !options.isCurrent() || loading || !catalog) return null

    return (
      <CustomExpertEditor
        expert={options.proposal.data as any}
        enabled={true}
        revision={catalog.revision}
        divisions={[...new Set([...Object.keys(ZH_DIVISION), ...catalog.experts.map(e => e.division)])]}
        remote={options.remote}
        t={options.t as any}
        locale={personaLocale(options.locale)}
        divisionLocale={options.locale}
        onClose={cleanup}
        onSaved={(savedCatalog) => {
          acceptCatalog(options.remote, savedCatalog)
          options.onSaved?.(savedCatalog)
          cleanup()
        }}
      />
    )
  }

  function TeamHost() {
    const [data, setData] = React.useState<{ catalog: CatalogSnapshot; teams: TeamSnapshot } | null>(null)
    const [loading, setLoading] = React.useState(true)

    const fetchAll = React.useCallback(async (initial = false) => {
      const [catalogData, teamData] = await Promise.all([
        unwrap<CatalogSnapshot>(options.remote.getCatalog()),
        unwrap<TeamSnapshot>(options.remote.getTeams()),
      ])
      const valid = !cleaned && options.isCurrent() && (!initial || await options.revalidate())
      if (!valid || cleaned || !options.isCurrent()) {
        cleanup()
        return teamData
      }
      setData({ catalog: catalogData, teams: teamData })
      setLoading(false)
      return teamData
    }, [])

    React.useEffect(() => {
      let active = true
      fetchAll(true).catch(() => {
        if (!active) return
        cleanup()
      })
      return () => { active = false }
    }, [fetchAll])

    if (cleaned || !options.isCurrent() || loading || !data) return null

    return (
      <TeamLocaleContext.Provider value={options.locale}>
        <TeamEditor
          initial={options.proposal.data as any}
          experts={data.catalog.experts}
          enabled={true}
          enabledExperts={data.teams.enabledExperts ?? []}
          close={cleanup}
          refresh={() => fetchAll()}
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
  return cleanup
}
