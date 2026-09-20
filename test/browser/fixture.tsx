import { TeamsFixture } from './teams-fixture'
import { NativeNamesFixture } from './native-names-fixture'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { PromptDialog } from '../../src/client/prompt-dialog'
import { DiscoveryFixture } from './discovery-fixture'


// 模拟真实入口的异步读取和禁用按钮，焦点不能从弹窗挂载时反推。
function Fixture() {
  const [loading, setLoading] = React.useState(false)
  const [trigger, setTrigger] = React.useState<HTMLElement | null>(null)
  const open = async (button: HTMLElement) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 50))
    setLoading(false)
    setTrigger(button)
  }
  return <>
    {['专家甲', '专家乙'].map(name => <button key={name} disabled={loading}
      onClick={event => void open(event.currentTarget)}>{name}</button>)}
    {trigger && <PromptDialog value={{ name: '专家', prompt: '测试提示词' }}
      title="提示词" closeLabel="关闭" returnFocus={trigger} onClose={() => setTrigger(null)} />}
  </>
}
const strict = new URLSearchParams(location.search).has('strict')
const content = new URLSearchParams(location.search).has('nativeNames') ? <NativeNamesFixture /> : new URLSearchParams(location.search).has('teams') ? <TeamsFixture /> : new URLSearchParams(location.search).has('discovery') ? <DiscoveryFixture /> : <Fixture />
createRoot(document.getElementById('root')!).render(strict ? <React.StrictMode>{content}</React.StrictMode> : content)
