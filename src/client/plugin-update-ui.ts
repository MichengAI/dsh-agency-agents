import React from 'react'
import { createRoot } from 'react-dom/client'
import { AntdProvider, Button, Modal, Progress } from './antd-ui.js'
import { useEscapeLayer } from './escape-layer.js'
import { documentAntdLocale, documentUiLocale } from './antd-locale.js'

export type PluginUpdateUiOptions = {
  readonly endpoint: string
  readonly packageName: string
  readonly titleRowSelector: string
  readonly linksSelector: string
  readonly zhName: string
  readonly enName: string
  readonly createIcon: (name: PluginUpdateIconName) => HTMLElement
}

export type PluginUpdateIconName = 'refresh' | 'download' | 'copy' | 'close'

type UpdatePayload = {
  packageName: string
  currentVersion: string
  latestVersion?: string
  latestCheckFailed: boolean
  updateAvailable: boolean
  profileName: string
  canAutoUpdate: boolean
  updatedVersion?: string
  autoReload?: boolean
}

const UPDATE_HEADER = 'x-michengai-plugin-update'
const STYLE_ID = 'michengai-plugin-update-ui'
const CSS = `
.mpi-version{margin-left:8px;color:var(--dsw-alias-label-tertiary);font-family:inherit;font-size:12px;font-weight:500;line-height:18px;letter-spacing:0;white-space:nowrap;vertical-align:baseline}.mpi-check-host{display:inline-flex;align-items:center}.mpi-icon{display:inline-flex;flex:0 0 auto;width:16px;height:16px;align-items:center;justify-content:center;pointer-events:none}.mpi-icon svg{display:block;width:16px;height:16px}
.mpi-intro{margin:0 0 16px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}.mpi-meta{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:8px 18px;margin:0 0 16px;font-size:12px;line-height:18px}.mpi-meta dt{color:var(--dsw-alias-label-secondary)}.mpi-meta dd{margin:0}.mpi-mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.mpi-latest{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px}.mpi-status{font-size:13px;font-weight:600;line-height:18px}.mpi-status[data-kind=error]{color:var(--dsw-alias-state-error-primary)}.mpi-status[data-kind=success]{color:var(--dsw-alias-state-success-primary)}.mpi-manual{border-top:1px solid var(--dsw-alias-border-l2);padding-top:16px}.mpi-manual h3{margin:0 0 6px;font-size:14px;line-height:20px}.mpi-manual p{margin:0 0 10px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.mpi-command{display:flex;align-items:flex-start;gap:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:10px;background:var(--dsw-alias-bg-layer-3,var(--dsw-specific-menu-item-hover))}.mpi-command code{min-width:0;flex:1;overflow:visible;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;line-height:18px;white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:560px){.mpi-meta{grid-template-columns:1fr;gap:2px}.mpi-meta dd{margin-bottom:6px}}
`

const ZH = {
  check: '检查更新', update: '更新', close: '关闭', recheck: '重新检查', auto: '自动更新', updating: '正在更新…', copy: '复制命令', copied: '已复制', copyFailed: '复制失败',
  checking: '正在检查更新…', latest: '已是最新版本', found: '发现新版本', failed: '检查更新失败，请稍后重试。', current: '运行版本', latestLabel: '最新版本', profile: '目标 profile', unknown: '未知',
  manual: '手工更新', manualHint: '自动更新失败时，可在当前 DSH 终端执行以下命令，完成后重启 DSH Web。', intro: '仅检查并更新当前插件，不会联动安装其他插件。', restart: '更新完成，请重启 DSH Web。', restarting: '更新完成，正在重启 DSH Desktop…', unavailable: '当前环境不支持自动更新，请使用手工更新命令。',
}
const EN = {
  check: 'Check for updates', update: 'Update', close: 'Close', recheck: 'Check again', auto: 'Update automatically', updating: 'Updating…', copy: 'Copy command', copied: 'Copied', copyFailed: 'Copy failed',
  checking: 'Checking for updates…', latest: 'You are up to date', found: 'New version available', failed: 'Could not check for updates. Try again later.', current: 'Running version', latestLabel: 'Latest version', profile: 'Target profile', unknown: 'Unknown',
  manual: 'Manual update', manualHint: 'If automatic update fails, run this command in the current DSH terminal, then restart DSH Web.', intro: 'Only this plugin is checked and updated. Other plugins are not changed.', restart: 'Update complete. Restart DSH Web.', restarting: 'Update complete. Restarting DSH Desktop…', unavailable: 'Automatic update is unavailable. Use the manual command.',
}

type UpdateStrings = { [Key in keyof typeof ZH]: string }

function HostIcon(props: { readonly node: HTMLElement }): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useLayoutEffect(() => { ref.current?.replaceChildren(props.node) }, [props.node])
  return React.createElement('span', { ref, className: 'mpi-icon', 'aria-hidden': true })
}

function strings(): UpdateStrings {
  const lang = document.documentElement.lang.toLowerCase()
  const settings = document.querySelector('[role="dialog"]')?.textContent ?? ''
  return lang.startsWith('en') || (settings.includes('Settings') && !settings.includes('设置')) ? EN : ZH
}

function ensureStyle(): void {
  if (document.getElementById(STYLE_ID) !== null) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  ;(document.head ?? document.documentElement).append(style)
}

function validPayload(value: unknown): value is UpdatePayload {
  if (value === null || typeof value !== 'object') return false
  const item = value as Partial<UpdatePayload>
  return typeof item.packageName === 'string' && typeof item.currentVersion === 'string'
    && typeof item.updateAvailable === 'boolean' && typeof item.profileName === 'string'
    && typeof item.canAutoUpdate === 'boolean' && typeof item.latestCheckFailed === 'boolean'
    && (item.latestVersion === undefined || typeof item.latestVersion === 'string')
}

async function requestStatus(endpoint: string, method: 'GET' | 'POST', signal?: AbortSignal): Promise<UpdatePayload> {
  const signalOption = signal === undefined ? {} : { signal }
  const response = await fetch(endpoint, method === 'GET' ? { cache: 'no-store', ...signalOption } : {
    method: 'POST', headers: { 'content-type': 'application/json', [UPDATE_HEADER]: '1' }, body: '{}', ...signalOption,
  })
  const value = await response.json() as UpdatePayload & { error?: unknown }
  if (!response.ok || !validPayload(value)) throw new Error(typeof value.error === 'string' ? value.error : strings().failed)
  return value
}

export function manualPluginUpdateCommand(profileName: string, packageName: string, version: string): string {
  const profile = profileName.trim() === '' ? '' : ` --profile ${profileName.trim()}`
  return `dsh plugin${profile} add ${packageName}@${version} --registry=https://registry.npmjs.org/`
}

interface PluginUpdateEscapeEvent {
  readonly key: string
  preventDefault(): void
  stopPropagation(): void
  stopImmediatePropagation(): void
}

export function handlePluginUpdateEscape(event: PluginUpdateEscapeEvent, close: () => void): boolean {
  if (event.key !== 'Escape') return false
  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()
  close()
  return true
}

function UpdateDialog(props: {
  readonly name: string
  readonly packageName: string
  readonly initial: UpdatePayload | undefined
  readonly refresh: () => Promise<UpdatePayload>
  readonly update: () => Promise<UpdatePayload>
  readonly onPayload: (value: UpdatePayload) => void
  readonly onClose: () => void
}): React.ReactElement {
  const text = strings()
  const [current, setCurrent] = React.useState(props.initial)
  const [message, setMessage] = React.useState(props.initial === undefined ? text.checking : '')
  const [kind, setKind] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [copyLabel, setCopyLabel] = React.useState(text.copy)
  const show = (value: UpdatePayload | undefined): void => {
    if (value === undefined) { setMessage(text.checking); setKind(''); return }
    if (value.latestCheckFailed) { setMessage(text.failed); setKind('error'); return }
    if (!value.canAutoUpdate && value.updateAvailable) { setMessage(text.unavailable); setKind(''); return }
    if (value.updateAvailable) { setMessage(`${text.found}: v${value.latestVersion ?? text.unknown}`); setKind(''); return }
    setMessage(text.latest); setKind('success')
  }
  const checkNow = async (): Promise<void> => {
    if (busy) return
    setBusy(true); setMessage(text.checking); setKind('')
    try {
      const next = await props.refresh()
      setCurrent(next); props.onPayload(next); show(next)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : text.failed); setKind('error')
    } finally { setBusy(false) }
  }
  const updateNow = async (): Promise<void> => {
    if (busy) return
    setBusy(true); setMessage(text.updating); setKind('')
    try {
      const next = await props.update()
      setCurrent(next); props.onPayload(next); show(next)
      setMessage(next.autoReload === true ? text.restarting : text.restart); setKind('success')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : text.failed); setKind('error')
    } finally { setBusy(false) }
  }
  React.useEffect(() => { void checkNow() }, [])
  useEscapeLayer(true, props.onClose)
  const command = manualPluginUpdateCommand(current?.profileName ?? '', props.packageName, current?.latestVersion ?? 'latest')
  const currentVersion = current === undefined ? text.unknown : `v${current.currentVersion}`
  const latestVersion = current?.latestVersion === undefined ? text.unknown : `v${current.latestVersion}`
  return React.createElement(AntdProvider, { locale: documentAntdLocale() }, React.createElement(Modal, {
    open: true, keyboard: false, className: 'mpi-dialog', width: 680, zIndex: 1200, title: `${props.name} ${text.update}`, onCancel: props.onClose,
    footer: [
      React.createElement(Button, { key: 'check', disabled: busy, onClick: () => { void checkNow() } }, text.recheck),
      React.createElement(Button, { key: 'update', type: 'primary', disabled: busy || current?.canAutoUpdate !== true || current.updateAvailable !== true, loading: busy, onClick: () => { void updateNow() } }, text.auto),
    ],
  },
    React.createElement('p', { className: 'mpi-intro' }, text.intro),
    React.createElement('dl', { className: 'mpi-meta' },
      React.createElement('dt', null, text.current), React.createElement('dd', null, React.createElement('span', { className: 'mpi-mono' }, currentVersion)),
      React.createElement('dt', null, text.latestLabel), React.createElement('dd', { className: 'mpi-latest' }, React.createElement('span', { className: 'mpi-mono' }, latestVersion), React.createElement('span', { className: 'mpi-status', role: 'status', 'data-kind': kind }, message)),
      React.createElement('dt', null, text.profile), React.createElement('dd', null, React.createElement('span', { className: 'mpi-mono' }, current?.profileName ?? text.unknown))),
    busy ? React.createElement(Progress, { percent: 100, showInfo: false, status: 'active' }) : null,
    React.createElement('section', { className: 'mpi-manual' },
      React.createElement('h3', null, text.manual),
      React.createElement('p', null, text.manualHint),
      React.createElement('div', { className: 'mpi-command' },
        React.createElement('code', null, command),
        React.createElement(Button, { onClick: () => {
          void navigator.clipboard?.writeText(command).then(() => {
            setCopyLabel(text.copied)
            setTimeout(() => setCopyLabel(text.copy), 1_400)
          }).catch(() => setCopyLabel(text.copyFailed))
        } }, copyLabel)))))
}

export function observePluginUpdate(options: PluginUpdateUiOptions): () => void {
  if (typeof document === 'undefined' || document.body === null) return () => {}
  ensureStyle()
  const controller = new AbortController()
  let payload: UpdatePayload | undefined
  let overlay: HTMLElement | undefined
  let dialogRoot: { unmount(): void } | undefined
  let buttonHost: HTMLElement | undefined
  let buttonRoot: ReturnType<typeof createRoot> | undefined
  let iconNode: HTMLElement | undefined
  let frame: number | undefined

  const unmountCheck = (): void => { buttonRoot?.unmount(); buttonRoot = undefined; buttonHost = undefined; iconNode = undefined }
  const renderCheck = (): void => {
    if (buttonRoot === undefined) return
    iconNode ??= options.createIcon('refresh')
    const icon = iconNode
    buttonRoot.render(React.createElement(AntdProvider, { locale: documentAntdLocale() }, React.createElement(Button, {
      size: 'small', shape: 'default', onClick: openDialog, icon: React.createElement(HostIcon, { node: icon }),
    }, React.createElement('span', { 'data-mpi-label': '' }, strings().check))))
  }
  const applyControls = (): void => {
    const row = document.querySelector<HTMLElement>(options.titleRowSelector)
    if (row === null) return
    const heading = row.querySelector<HTMLElement>('h1,h2')
    if (heading !== null && payload !== undefined) {
      let version = heading.querySelector<HTMLElement>(`.mpi-version[data-package="${options.packageName}"]`)
      if (version === null) {
        version = document.createElement('span')
        version.className = 'mpi-version'
        version.dataset.package = options.packageName
        heading.append(version)
      }
      const versionLabel = `v${payload.currentVersion}`
      if (version.textContent !== versionLabel) version.textContent = versionLabel
    }
    if (buttonHost !== undefined && !buttonHost.isConnected) unmountCheck()
    const links = row.querySelector<HTMLElement>(options.linksSelector)
    if (links === null) return
    const existing = links.querySelector<HTMLElement>(`[data-mpi-check="${options.packageName}"]`)
    if (existing !== null) {
      const label = existing.querySelector('[data-mpi-label]')
      if (label === null || label.textContent !== strings().check) renderCheck()
      return
    }
    const host = document.createElement('span')
    host.dataset.mpiCheck = options.packageName
    host.className = 'mpi-check-host'
    links.append(host)
    buttonHost = host
    buttonRoot = createRoot(host)
    renderCheck()
  }

  const load = async (): Promise<UpdatePayload> => {
    payload = await requestStatus(options.endpoint, 'GET', controller.signal)
    applyControls()
    return payload
  }

  const closeDialog = (): void => { dialogRoot?.unmount(); dialogRoot = undefined; overlay?.remove(); overlay = undefined }

  function openDialog(): void {
    closeDialog()
    const host = document.createElement('div')
    host.className = 'mpi-dialog-root'
    document.body.append(host)
    const root = createRoot(host)
    overlay = host
    dialogRoot = root
    root.render(React.createElement(UpdateDialog, {
      name: documentUiLocale() === 'en' ? options.enName : options.zhName,
      packageName: options.packageName,
      initial: payload,
      refresh: () => load(),
      update: () => requestStatus(options.endpoint, 'POST', controller.signal),
      onPayload: (next: UpdatePayload) => { payload = next; applyControls() },
      onClose: closeDialog,
    }))
  }

  const observer = new MutationObserver(() => {
    if (frame !== undefined) return
    frame = window.requestAnimationFrame(() => { frame = undefined; applyControls() })
  })
  observer.observe(document.body, { childList: true, subtree: true })
  applyControls()
  void load().catch(() => {})
  return () => {
    controller.abort(); observer.disconnect(); closeDialog(); unmountCheck()
    if (frame !== undefined) window.cancelAnimationFrame(frame)
    document.querySelectorAll(`[data-mpi-check="${options.packageName}"],.mpi-version[data-package="${options.packageName}"]`).forEach(node => node.remove())
  }
}
