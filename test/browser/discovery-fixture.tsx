// 真实工具栏组件配合内存 Remote，隔离用户 Profile 并模拟写入冲突。
import React from 'react'
import { AgentsButton, CSS, insertExpertReference } from '../../src/client/index'
import { expertTaskExample } from '../../src/client/task-examples'
import { zh, en } from '../../src/client/locales'
import { ROSTER } from '../../src/client/roster'
import { ZH_NAME, ZH_DIVISION } from '../../src/names'
import type { CatalogSnapshot } from '../../src/expert-contract'
import { composerProjection } from '../../src/test-utils/composer-projection'

const params = new URLSearchParams(location.search)
const active = params.has('en') ? 'en' : 'zh'
const experts = ROSTER.map(e => ({ ...e, name: ZH_NAME[e.slug] ?? e.nameEn,
  divisionZh: ZH_DIVISION[e.division] ?? e.division, custom: false }))
let snapshot: CatalogSnapshot = { experts, enabled: params.has('all') ? experts.map(e => e.slug) : params.has('empty') ? [] : ['engineering-code-reviewer'], revision: 0 }
let writes = 0
let conflict = params.has('conflict')
let loadFailure = params.has('load-fail')
const unsupported = async (): Promise<never> => { throw new Error('测试中不应调用管理方法') }
const remote: React.ComponentProps<typeof AgentsButton>['remote'] = {
  getCatalog: async () => {
    if (loadFailure) { loadFailure = false; throw new Error('名册连接暂时不可用') }
    if (params.has('slow-catalog')) await new Promise(resolve => setTimeout(resolve, 400))
    return { ok: true, value: structuredClone(snapshot) }
  },
  getEnabled: async () => ({ ok: true, value: { enabled: [...snapshot.enabled], revision: snapshot.revision } }),
  setEnabled: async (enabled, revision) => {
    writes++
    await new Promise(resolve => setTimeout(resolve, params.has('slow') ? 500 : 100))
    if (conflict) {
      conflict = false
      snapshot = { ...snapshot, enabled: [...snapshot.enabled, 'design-ui-designer'], revision: snapshot.revision + 1 }
    }
    if (revision !== snapshot.revision) throw new Error('Configuration changed since it was read')
    snapshot = { ...snapshot, enabled, revision: snapshot.revision + 1 }
    return { ok: true, value: { enabled, revision: snapshot.revision } }
  },
  getPrompt: unsupported, getCustomExpert: unsupported, saveCustomExpert: unsupported, deleteCustomExpert: unsupported,
}
Object.assign(window, { discoveryState: () => ({ snapshot, writes }) })

export function DiscoveryFixture() {
  const [labels, setLabels] = React.useState<string[]>([])
  const [draft, setDraft] = React.useState(params.has('blank') ? '' : '保留已有需求')
  const draftRef = React.useRef<HTMLTextAreaElement | null>(null)
  return <>
    <style>{`:root{--dsw-alias-label-primary:#202124;--dsw-alias-label-secondary:#555;--dsw-alias-label-tertiary:#666;--dsw-specific-menu:#fff;--dsw-alias-bg-layer-2:#fff;--dsw-alias-border-l2:#ddd;--dsw-alias-border-inverted:#ddd;--dsw-alias-interactive-bg-hover:#f2f3f5;--dsw-shadow-lv3:0 8px 32px #0002}body{margin:0;font:14px system-ui;background:#f5f5f5}.fixture-composer{position:fixed;bottom:20px;left:16px;right:16px;padding:12px;background:white;border:1px solid #ddd;border-radius:12px}.fixture-composer textarea{box-sizing:border-box;width:100%;height:70px} .fixture-chips{padding:8px 0}` + CSS}</style>
    <div className="fixture-composer" data-composer-card>
      <div className="fixture-chips" aria-label="已选专家">{labels.join('、')}</div>
      <textarea ref={draftRef} aria-label="任务草稿" value={draft} onChange={e => setDraft(e.target.value)} />
      <span>附件：需求.md</span>
      <AgentsButton remote={remote} getActive={() => active} t={key => ((active === 'en' ? en : zh) as Record<string, string>)[key] ?? key}
        insertReference={reference => {
          let projection = '\uFFFC '.repeat(labels.length) + draft
          let revision = 0
          const selectedLabels = [...labels]
          const expert = experts.find(item => item.slug === reference.ref)!
          return insertExpertReference({
            state: { getSnapshot: () => ({ ...composerProjection(projection, selectedLabels), draftRev: revision }) },
            insertReference: (ref, span) => {
              if (params.has('insert-fail')) return false
              projection = projection.slice(0, span.start) + '\uFFFC ' + projection.slice(span.end)
              revision++
              selectedLabels.push(ref.label)
              setLabels(current => [...current, ref.label])
              draftRef.current?.focus()
              return true
            },
            insertText: (text, span) => {
              if (span.draftRev !== revision) return false
              projection = projection.slice(0, span.start) + text + projection.slice(span.end)
              revision++
              setDraft(projection.replace(/\uFFFC /gu, ''))
              return true
            },
          }, reference, expertTaskExample(expert, active))
        }} />
    </div>
  </>
}
