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
    const adapter = installNativeTeamNames(async () => ({
      members: new Map([[identity, locale === 'zh' ? '软件架构师' : 'Software Architect'], ['agency-custom-reviewer-1234567890', '我的评审专家']]),
      teams: [{ names: ['技术方案评审团', 'Technical Review Team'], label: locale === 'zh' ? '技术方案评审团' : 'Technical Review Team' }],
    }), error => { throw error })
    void adapter.refresh()
    return () => adapter.dispose()
  }, [locale, enabled])
  return <>
    <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}>切换语言</button>
    <button onClick={() => setRevision(revision + 1)}>宿主刷新</button>
    <button onClick={() => setEnabled(false)}>卸载适配</button>
    <div className="host_roster" key={revision}>
      {[identity, 'lead', 'agency-unknown-0123456789', 'agency-custom-reviewer-1234567890'].map(name => (
        <button key={name} onClick={() => setClicked(name)}>
          <span className="host_memberText">
            {name === 'agency-custom-reviewer-1234567890'
              ? <span className="host_memberName"><span className="host_memberNameText">{name}</span></span>
              : <span>{name}</span>}
            <small>运行中</small>
          </span>
        </button>
      ))}
      <div className="host_nested">
        <button><span className="host_memberText"><span>{identity}</span></span></button>
      </div>
    </div>
    <div className="host_tasks">
      <div className="host_taskTitle"><strong>技术方案评审团: 软件架构师</strong></div>
      <div className="host_meta"><span>task-1</span><span data-testid="任务Owner">Owner: agency-security-appsec-engineer-f29ea176a0</span></div>
    </div>
    <p data-testid="正文">{identity}</p><output>{clicked}</output>
  </>
}
