import React from 'react'
import { createRoot } from 'react-dom/client'
import { AntdProvider } from './antd-ui.js'
import { antdLocale } from './antd-locale.js'
import { LibraryConfirm } from './library-ui.js'
import { teamText, type TeamLocale } from '../team-i18n.js'

/** 插入前确认使用同一套主题弹窗，不使用阻塞浏览器原生窗口。 */
export function confirmTeamAction(message: string, locale: TeamLocale): Promise<boolean> {
  return new Promise(resolve => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    let settled = false
    const finish = (accepted: boolean) => {
      if (settled) return
      settled = true
      window.removeEventListener('pagehide', cancel)
      resolve(accepted)
      queueMicrotask(() => { root.unmount(); container.remove() })
    }
    const cancel = () => finish(false)
    window.addEventListener('pagehide', cancel, { once: true })
    root.render(<AntdProvider locale={antdLocale(locale)}><LibraryConfirm title={teamText(locale, '确认选择专家团')} cancelLabel={teamText(locale, '取消')}
      confirmLabel={teamText(locale, '确认')} close={cancel} confirm={() => finish(true)}><p>{message}</p></LibraryConfirm></AntdProvider>)
  })
}
