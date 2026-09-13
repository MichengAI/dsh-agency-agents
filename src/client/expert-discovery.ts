import React from 'react'
import type { ExpertView } from './catalog.js'
import type { AgencyKey } from './locales.js'

interface DiscoveryProps {
  readonly experts: readonly ExpertView[]
  readonly enabled: ReadonlySet<string>
  readonly locale: 'zh' | 'en'
  readonly t: (key: AgencyKey) => string
  readonly query: string
  readonly busy: boolean
  readonly hasMore: boolean
  readonly onQuery: (query: string) => void
  readonly onPick: (slug: string) => void
}

/** 保留原分类和 Emoji 单行列表，只增加覆盖全名册的搜索。 */
export function ExpertDiscovery(props: DiscoveryProps): React.ReactElement {
  const groups = new Map<string, ExpertView[]>()
  for (const expert of props.experts) {
    const group = groups.get(expert.division) ?? []
    group.push(expert)
    groups.set(expert.division, group)
  }
  const name = (expert: ExpertView): string => props.locale === 'en' ? expert.nameEn : expert.name
  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'aag-discovery-tools' },
      React.createElement('input', { type: 'search', autoFocus: true, value: props.query,
        'aria-label': props.t('discovery.search'), placeholder: props.t('discovery.search'),
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => props.onQuery(event.target.value) })),
    React.createElement('div', { className: 'aag-discovery-results', 'aria-busy': props.busy },
      props.busy ? React.createElement('p', { className: 'aag-menu-empty', role: 'status' }, props.t('discovery.working')) : null,
      !props.busy && props.experts.length === 0 ? React.createElement('p', { className: 'aag-menu-empty', role: 'status' },
        props.t(props.query.trim() !== '' ? 'discovery.noResults' : 'discovery.empty')) : null,
      props.hasMore ? React.createElement('p', { className: 'aag-menu-empty' }, props.t('discovery.refine')) : null,
      [...groups.entries()].map(([division, experts]) => React.createElement('div', { key: division },
        React.createElement('div', { className: 'aag-menu-title' }, props.locale === 'en' ? experts[0].divisionEn : experts[0].divisionZh),
        experts.map(expert => {
          const action = expert.conflict ? props.t('discovery.conflict') : props.enabled.has(expert.slug) ? '' : props.t('discovery.enableSelect')
          return React.createElement('button', {
            key: expert.slug, type: 'button', className: 'aag-menu-item aag-discovery-row',
            'aria-label': action === '' ? name(expert) : `${name(expert)} · ${action}`,
            title: props.locale === 'en' ? expert.descriptionEn || expert.description : expert.description,
            disabled: props.busy || expert.conflict === true, onClick: () => props.onPick(expert.slug),
          }, React.createElement('span', { className: 'aag-emoji', 'aria-hidden': true }, expert.emoji),
          React.createElement('span', { className: 'aag-discovery-name' }, name(expert)),
          action === '' ? null : React.createElement('span', { className: 'aag-discovery-action' }, action))
        })))))
}

export const DISCOVERY_CSS = `
.aag-menu.aag-discovery{width:340px;max-width:calc(100vw - 24px);max-height:360px;overflow:hidden;padding:4px;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:1.5}
.aag-discovery-tools{padding:4px;flex:none}
.aag-discovery input{box-sizing:border-box;width:100%;min-height:36px;padding:7px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:inherit;font:inherit}
.aag-discovery input:focus-visible,.aag-discovery button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4f8cff);outline-offset:-2px}
.aag-discovery button:disabled{opacity:.55;cursor:default}.aag-discovery-results{overflow-y:auto;min-height:0;overscroll-behavior:contain}
.aag-discovery-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.aag-discovery-action{flex:none;color:var(--dsw-alias-label-secondary);font-size:11px}
.aag-discovery>.aag-error{padding:8px;flex:none}
`
