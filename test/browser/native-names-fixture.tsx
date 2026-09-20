import React from 'react'
import { installNativeTeamNames } from '../../src/client/native-team-names'

const identity = 'agency-engineering-software-architect-8a70fbbd93'
export function NativeNamesFixture() {
  const [locale, setLocale] = React.useState('zh')
  const [revision, setRevision] = React.useState(0)
  const [enabled, setEnabled] = React.useState(true)
  const [clicked, setClicked] = React.useState('')
  React.useEffect(() => {
    if (!enabled) return
    const adapter = installNativeTeamNames(async () => new Map([[identity, locale === 'zh' ? '软件架构师' : 'Software Architect'], ['agency-custom-reviewer-1234567890', '我的评审专家']]), error => { throw error })
    void adapter.refresh()
    return () => adapter.dispose()
  }, [locale, enabled])
  return <>
    <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}>切换语言</button>
    <button onClick={() => setRevision(revision + 1)}>宿主刷新</button>
    <button onClick={() => setEnabled(false)}>卸载适配</button>
    <div className="host_roster" key={revision}>
      {[identity, 'lead', 'agency-unknown-0123456789', 'agency-custom-reviewer-1234567890'].map(name => <button key={name} onClick={() => setClicked(name)}><span className="host_memberText"><span>{name}</span><small>运行中</small></span></button>)}
    </div>
    <p data-testid="正文">{identity}</p><output>{clicked}</output>
  </>
}
