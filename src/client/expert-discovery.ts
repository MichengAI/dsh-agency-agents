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
  readonly avatarSrc: (expert: ExpertView) => string
}

/** 按分区排列专家，行首使用头像。 */
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
    React.createElement('div', { className: 'aag-discovery-results', 'aria-busy': props.busy && props.experts.length === 0 },
      props.busy && props.experts.length === 0 ? React.createElement('p', { className: 'aag-menu-empty', role: 'status' }, props.t('discovery.working')) : null,
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
          }, React.createElement('img', {
            className: 'aag-discovery-avatar', src: props.avatarSrc(expert), alt: '', width: 22, height: 22, loading: 'lazy', decoding: 'async',
          }),
          React.createElement('span', { className: 'aag-discovery-name' }, name(expert)),
          action === '' ? null : React.createElement('span', { className: 'aag-discovery-action' }, action))
        })))))
}

export const DISCOVERY_CSS = `
.aag-menu.aag-discovery{width:340px;max-width:calc(100vw - 24px);max-height:360px;overflow:hidden;padding:6px;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:1.5}
.aag-discovery-tools{padding:2px 2px 6px;flex:none}
.aag-discovery input{box-sizing:border-box;width:100%;min-height:36px;padding:7px 10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-layer-1);color:inherit;font:inherit}
.aag-discovery input:focus-visible{outline:none;border-color:var(--dsw-alias-brand-primary)}
.aag-discovery button.aag-discovery-row{display:flex;align-items:center;width:100%;gap:10px;padding:8px 10px;border:0;border-radius:var(--dsw-radius-sm,8px);background:transparent;color:inherit;text-align:left;cursor:pointer;transition:background 100ms ease}
.aag-discovery button.aag-discovery-row:hover:not(:disabled),.aag-discovery button.aag-discovery-row:focus-visible{background:var(--dsw-alias-interactive-bg-hover);outline:none}
.aag-discovery button:disabled{opacity:.55;cursor:default}
.aag-discovery-results{overflow-y:auto;min-height:0;overscroll-behavior:contain;padding-top:2px}
.aag-discovery-avatar{flex:none;width:24px;height:24px;border-radius:50%;corner-shape:round;object-fit:cover;object-position:center 20%}
.aag-discovery-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
.aag-discovery-action{flex:none;color:var(--dsw-alias-label-secondary);font-size:11px;padding:2px 6px;border-radius:var(--dsw-radius-xs,4px);background:var(--dsw-alias-bg-layer-2)}
.aag-discovery>.aag-error{padding:8px;flex:none}
`
