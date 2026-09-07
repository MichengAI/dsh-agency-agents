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
.mpi-version{margin-left:8px;color:var(--dsw-alias-label-tertiary,#9da1aa);font-family:inherit;font-size:12px;font-weight:500;line-height:18px;letter-spacing:0;white-space:nowrap;vertical-align:baseline}.mpi-check{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:28px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2,#4b4d52);border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary,#b8bbc2);font:inherit;font-size:12px;font-weight:500;line-height:18px;white-space:nowrap;cursor:pointer}.mpi-check:hover{background:var(--dsw-alias-interactive-bg-hover,#3a3b3f);color:var(--dsw-alias-label-primary,#fff)}.mpi-check:focus-visible,.mpi-action:focus-visible,.mpi-dialog-close:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4f8cff);outline-offset:2px}.mpi-icon{display:inline-flex;flex:0 0 auto;width:16px;height:16px;align-items:center;justify-content:center;pointer-events:none}.mpi-icon svg{display:block;width:16px;height:16px}
.mpi-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.62)}.mpi-dialog{position:relative;box-sizing:border-box;width:min(680px,100%);max-height:calc(100vh - 48px);overflow:auto;border:1px solid var(--dsw-alias-border-l2,#4b4d52);border-radius:14px;padding:22px;background:var(--dsw-alias-bg-layer-2,var(--dsw-specific-menu,#202124));color:var(--dsw-alias-label-primary,#fff);box-shadow:var(--dsw-shadow-lv3,0 16px 48px rgba(0,0,0,.24));font-family:inherit}.mpi-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.mpi-dialog h2{margin:0;font-size:18px;line-height:26px}.mpi-dialog-close{display:inline-flex;flex:0 0 28px;width:28px;height:28px;align-items:center;justify-content:center;padding:0;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#b8bbc2);cursor:pointer}.mpi-dialog-close:hover{background:var(--dsw-alias-interactive-bg-hover,#3a3b3f);color:var(--dsw-alias-label-primary,#fff)}.mpi-intro{margin:8px 0 18px;color:var(--dsw-alias-label-secondary,#c2c4ca);font-size:13px;line-height:20px}.mpi-meta{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:8px 18px;margin:0 0 16px;font-size:12px;line-height:18px}.mpi-meta dt{color:var(--dsw-alias-label-secondary,#c2c4ca)}.mpi-meta dd{margin:0;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.mpi-status{margin:0 0 18px;border-radius:7px;padding:12px 14px;background:var(--dsw-alias-bg-layer-3,var(--dsw-specific-menu-item-hover,#252527));font-size:13px;font-weight:600;line-height:20px}.mpi-status[data-kind=error]{color:var(--dsw-alias-state-error-primary,#ff6464)}.mpi-status[data-kind=success]{color:var(--dsw-alias-state-success-primary,#36d67a)}.mpi-manual{border-top:1px solid var(--dsw-alias-border-l2,#4b4d52);padding-top:16px}.mpi-manual h3{margin:0 0 6px;font-size:14px;line-height:20px}.mpi-manual p{margin:0 0 10px;color:var(--dsw-alias-label-secondary,#c2c4ca);font-size:12px;line-height:18px}.mpi-command{display:flex;align-items:center;gap:8px;border:1px solid var(--dsw-alias-border-l2,#4b4d52);border-radius:7px;padding:10px;background:var(--dsw-alias-bg-layer-3,var(--dsw-specific-menu-item-hover,#252527))}.mpi-command code{min-width:0;flex:1;overflow:auto;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;line-height:18px;white-space:nowrap}.mpi-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:18px}.mpi-actions-group{display:flex;gap:8px}.mpi-action{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;border:1px solid var(--dsw-alias-border-l2,#4b4d52);border-radius:7px;padding:6px 10px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer}.mpi-action:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,#414247)}.mpi-action:disabled{cursor:not-allowed;opacity:.55}.mpi-primary{border-color:var(--dsw-alias-state-business-primary,#4f8cff);background:var(--dsw-alias-state-business-primary,#4f8cff);color:#fff}.mpi-progress{height:4px;margin-top:10px;overflow:hidden;border-radius:99px;background:var(--dsw-alias-border-l2,#4b4d52)}.mpi-progress::after{display:block;width:32%;height:100%;background:var(--dsw-alias-state-business-primary,#4f8cff);content:'';animation:mpi-wave 1.15s ease-in-out infinite}@keyframes mpi-wave{from{transform:translateX(-110%)}to{transform:translateX(330%)}}@media(max-width:560px){.mpi-overlay{padding:10px}.mpi-dialog{max-height:calc(100vh - 20px);padding:16px}.mpi-actions{align-items:stretch}.mpi-actions-group{justify-content:flex-end;flex-wrap:wrap}.mpi-meta{grid-template-columns:1fr;gap:2px}.mpi-meta dd{margin-bottom:6px}}
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

export function observePluginUpdate(options: PluginUpdateUiOptions): () => void {
  if (typeof document === 'undefined' || document.body === null) return () => {}
  ensureStyle()
  const controller = new AbortController()
  let payload: UpdatePayload | undefined
  let overlay: HTMLElement | undefined
  let frame: number | undefined

  const setButtonContent = (button: HTMLButtonElement, label: string, iconName: PluginUpdateIconName): void => {
    const icon = options.createIcon(iconName)
    icon.classList.add('mpi-icon')
    icon.setAttribute('aria-hidden', 'true')
    const text = document.createElement('span')
    text.dataset.mpiLabel = ''
    text.textContent = label
    button.replaceChildren(icon, text)
  }
  const setButtonLabel = (button: HTMLButtonElement, label: string): void => {
    const text = button.querySelector<HTMLElement>('[data-mpi-label]')
    if (text === null) button.textContent = label
    else text.textContent = label
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
    const links = row.querySelector<HTMLElement>(options.linksSelector)
    if (links === null || links.querySelector(`[data-mpi-check="${options.packageName}"]`) !== null) return
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'mpi-check'
    button.dataset.mpiCheck = options.packageName
    setButtonContent(button, strings().check, 'refresh')
    button.addEventListener('click', openDialog)
    links.append(button)
  }

  const load = async (): Promise<UpdatePayload> => {
    payload = await requestStatus(options.endpoint, 'GET', controller.signal)
    applyControls()
    return payload
  }

  const closeDialog = (): void => { overlay?.remove(); overlay = undefined }

  function openDialog(): void {
    closeDialog()
    const text = strings()
    overlay = document.createElement('div')
    overlay.className = 'mpi-overlay'
    const dialog = document.createElement('section')
    dialog.className = 'mpi-dialog'
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')
    dialog.innerHTML = `<header class="mpi-head"><h2></h2><button type="button" class="mpi-dialog-close" data-action="close"></button></header><p class="mpi-intro"></p><dl class="mpi-meta"><dt></dt><dd data-role="current"></dd><dt></dt><dd data-role="latest"></dd><dt></dt><dd data-role="profile"></dd></dl><div class="mpi-status" role="status"></div><div class="mpi-progress" hidden></div><section class="mpi-manual"><h3></h3><p></p><div class="mpi-command"><code></code><button type="button" class="mpi-action" data-action="copy"></button></div></section><footer class="mpi-actions"><div class="mpi-actions-group"><button type="button" class="mpi-action" data-action="check"></button><button type="button" class="mpi-action mpi-primary" data-action="update"></button></div></footer>`
    const name = document.documentElement.lang.toLowerCase().startsWith('en') ? options.enName : options.zhName
    dialog.querySelector('h2')!.textContent = `${name} ${text.update}`
    dialog.querySelector<HTMLElement>('.mpi-intro')!.textContent = text.intro
    const terms = dialog.querySelectorAll('dt')
    terms[0]!.textContent = text.current
    terms[1]!.textContent = text.latestLabel
    terms[2]!.textContent = text.profile
    dialog.querySelector<HTMLElement>('.mpi-manual h3')!.textContent = text.manual
    dialog.querySelector<HTMLElement>('.mpi-manual p')!.textContent = text.manualHint
    const status = dialog.querySelector<HTMLElement>('.mpi-status')!
    const progress = dialog.querySelector<HTMLElement>('.mpi-progress')!
    const command = dialog.querySelector<HTMLElement>('.mpi-command code')!
    const close = dialog.querySelector<HTMLButtonElement>('[data-action=close]')!
    const check = dialog.querySelector<HTMLButtonElement>('[data-action=check]')!
    const update = dialog.querySelector<HTMLButtonElement>('[data-action=update]')!
    const copy = dialog.querySelector<HTMLButtonElement>('[data-action=copy]')!
    setButtonContent(close, text.close, 'close')
    close.querySelector('[data-mpi-label]')?.remove()
    close.setAttribute('aria-label', text.close)
    close.title = text.close
    setButtonContent(check, text.recheck, 'refresh')
    setButtonContent(update, text.auto, 'download')
    setButtonContent(copy, text.copy, 'copy')
    let busy = false
    const setMessage = (message: string, kind = ''): void => { status.textContent = message; status.dataset.kind = kind }
    const setBusy = (value: boolean): void => {
      busy = value
      check.disabled = value
      copy.disabled = value
      update.disabled = value || payload?.canAutoUpdate !== true || payload.updateAvailable !== true
      progress.hidden = !value
    }
    const render = (): void => {
      dialog.querySelector<HTMLElement>('[data-role=current]')!.textContent = payload === undefined ? text.unknown : `v${payload.currentVersion}`
      dialog.querySelector<HTMLElement>('[data-role=latest]')!.textContent = payload?.latestVersion === undefined ? text.unknown : `v${payload.latestVersion}`
      dialog.querySelector<HTMLElement>('[data-role=profile]')!.textContent = payload?.profileName ?? text.unknown
      command.textContent = manualPluginUpdateCommand(payload?.profileName ?? '', options.packageName, payload?.latestVersion ?? 'latest')
      update.disabled = busy || payload?.canAutoUpdate !== true || payload.updateAvailable !== true
      if (payload === undefined) setMessage(text.checking)
      else if (payload.latestCheckFailed) setMessage(text.failed, 'error')
      else if (payload.updateAvailable) setMessage(`${text.found}: v${payload.latestVersion ?? text.unknown}`)
      else setMessage(text.latest, 'success')
      if (payload !== undefined && !payload.canAutoUpdate && payload.updateAvailable) setMessage(text.unavailable)
    }
    const checkNow = async (): Promise<void> => {
      if (busy) return
      setBusy(true); setMessage(text.checking)
      try {
        await load()
        setBusy(false)
        render()
      } catch (error) {
        setBusy(false)
        setMessage(error instanceof Error ? error.message : text.failed, 'error')
      }
    }
    const updateNow = async (): Promise<void> => {
      if (busy) return
      setBusy(true); setButtonLabel(update, text.updating); setMessage(text.updating)
      try {
        payload = await requestStatus(options.endpoint, 'POST', controller.signal)
        applyControls(); render()
        setMessage(payload.autoReload === true ? text.restarting : text.restart, 'success')
      } catch (error) { setMessage(error instanceof Error ? error.message : text.failed, 'error') }
      finally { setButtonLabel(update, text.auto); setBusy(false) }
    }
    close.addEventListener('click', closeDialog)
    check.addEventListener('click', () => { void checkNow() })
    update.addEventListener('click', () => { void updateNow() })
    copy.addEventListener('click', () => {
      void navigator.clipboard?.writeText(command.textContent ?? '').then(() => {
        setButtonLabel(copy, text.copied)
        setTimeout(() => { setButtonLabel(copy, text.copy) }, 1_400)
      }).catch(() => { setButtonLabel(copy, text.copyFailed) })
    })
    overlay.addEventListener('click', event => { if (event.target === overlay) closeDialog() })
    overlay.addEventListener('keydown', event => { handlePluginUpdateEscape(event, closeDialog) }, true)
    overlay.append(dialog)
    document.body.append(overlay)
    render()
    close.focus()
    void checkNow()
  }

  const observer = new MutationObserver(() => {
    if (frame !== undefined) return
    frame = window.requestAnimationFrame(() => { frame = undefined; applyControls() })
  })
  observer.observe(document.body, { childList: true, subtree: true })
  applyControls()
  void load().catch(() => {})
  return () => {
    controller.abort(); observer.disconnect(); closeDialog()
    if (frame !== undefined) window.cancelAnimationFrame(frame)
    document.querySelectorAll(`[data-mpi-check="${options.packageName}"],.mpi-version[data-package="${options.packageName}"]`).forEach(node => node.remove())
  }
}
