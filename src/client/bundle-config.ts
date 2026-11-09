import React from 'react'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'
import { resolveApiUrl } from '../api-base.js'
import type { EntryLocation } from '../settings-compat.js'

export const BUNDLE_KEY = '@michengai/dsh-agency-agents'
export const SIDEBAR_PANEL_ID = 'agency-agents'
export const SIDEBAR_PANEL_ORDER = 4

export function AgencySidebarIcon(props?: { size?: number }): React.ReactElement {
  const size = props && typeof props.size === 'number' ? props.size : 16
  return React.createElement('svg', {
    viewBox: '0 0 16 16',
    width: size,
    height: size,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.3,
    'aria-hidden': 'true',
  },
    React.createElement('circle', { cx: 8, cy: 4.8, r: 3.2 }),
    React.createElement('path', { d: 'M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5', strokeLinecap: 'round' }),
  )
}

export interface AgencyBundleConfigCardProps {
  t: (key: string) => string
  location?: EntryLocation
  onLocationChange?: (location: EntryLocation) => void
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
  disabled?: boolean
  composerRecommendEnabled?: boolean
  onToggleComposerRecommend?: (enabled: boolean) => void
  composerRecommendDisabled?: boolean
}

export function AgencyBundleConfigCard(props: AgencyBundleConfigCardProps): React.ReactElement {
  const {
    t,
    location: propLocation,
    onLocationChange,
    enabled = false,
    onToggle,
    disabled = false,
    composerRecommendEnabled = false,
    onToggleComposerRecommend,
    composerRecommendDisabled = false,
  } = props

  const PrimitiveSwitch = primitives.Switch
  const PrimitiveSegmented = primitives.SegmentedControl
  const effectiveLocation: EntryLocation = propLocation ?? (enabled ? 'both' : 'settings')

  const handleLocationChange = (next: string) => {
    if (next === 'both' || next === 'sidebar' || next === 'settings') {
      if (typeof onLocationChange === 'function') {
        onLocationChange(next)
      } else if (typeof onToggle === 'function') {
        onToggle(next !== 'settings')
      }
    }
  }

  return React.createElement('div', { className: 'aag-bundle-card' },
    React.createElement('div', { key: 'entry-location', className: 'aag-bundle-row' },
      React.createElement('div', { className: 'aag-bundle-label-box' },
        React.createElement('span', { className: 'aag-bundle-title' }, t('entry.location.title') || t('bundle.sidebar.title')),
        React.createElement('span', { className: 'aag-bundle-desc' }, t('entry.location.desc') || t('bundle.sidebar.desc')),
      ),
      PrimitiveSegmented
        ? React.createElement(PrimitiveSegmented, {
          id: 'aag-bundle-entry-location',
          value: effectiveLocation,
          onChange: handleLocationChange,
          disabled,
          label: t('entry.location.title') || t('bundle.sidebar.title'),
          options: [
            { value: 'both', label: t('entry.location.both') || '两边显示' },
            { value: 'sidebar', label: t('entry.location.sidebar') || '仅侧边栏' },
            { value: 'settings', label: t('entry.location.settings') || '仅设置' },
          ],
        })
        : (PrimitiveSwitch ? React.createElement(PrimitiveSwitch, {
          checked: effectiveLocation !== 'settings',
          onChange: (next: boolean) => handleLocationChange(next ? 'both' : 'settings'),
          disabled,
          label: t('bundle.sidebar.toggle'),
        }) : null),
    ),
    typeof onToggleComposerRecommend === 'function' && React.createElement('div', { key: 'composer-recommend', className: 'aag-bundle-row' },
      React.createElement('div', { className: 'aag-bundle-label-box' },
        React.createElement('span', { className: 'aag-bundle-title' }, t('bundle.recommend.title')),
        React.createElement('span', { className: 'aag-bundle-desc' }, t('bundle.recommend.desc')),
      ),
      PrimitiveSwitch
        ? React.createElement(PrimitiveSwitch, {
          checked: composerRecommendEnabled,
          onChange: onToggleComposerRecommend,
          disabled: composerRecommendDisabled,
          label: t('bundle.recommend.toggle'),
        })
        : null,
    ),
  )
}

export interface AgencyBundleConfigWrapperProps {
  t: (key: string) => string
  getLocation: () => EntryLocation
  setLocation: (location: EntryLocation) => Promise<EntryLocation>
  getEnabled?: () => boolean
  setSidebar?: (enabled: boolean) => Promise<boolean>
  getComposerRecommendEnabled?: () => boolean
  setComposerRecommend?: (enabled: boolean) => Promise<boolean>
  subscribe: (fn: () => void) => () => void
}

export function AgencyBundleConfigCardWrapper(props: AgencyBundleConfigWrapperProps): React.ReactElement {
  const [location, setLocation] = React.useState<EntryLocation>(props.getLocation)
  const [composerRecommendEnabled, setComposerRecommendEnabled] = React.useState(props.getComposerRecommendEnabled ? props.getComposerRecommendEnabled() : false)
  const [savingLocation, setSavingLocation] = React.useState(false)
  const [savingRecommend, setSavingRecommend] = React.useState(false)

  React.useEffect(() => {
    setLocation(props.getLocation())
    if (props.getComposerRecommendEnabled) setComposerRecommendEnabled(props.getComposerRecommendEnabled())
    return props.subscribe(() => {
      setLocation(props.getLocation())
      if (props.getComposerRecommendEnabled) setComposerRecommendEnabled(props.getComposerRecommendEnabled())
    })
  }, [props])

  const onLocationChange = (next: EntryLocation) => {
    setSavingLocation(true)
    setLocation(next)
    props.setLocation(next)
      .catch((err) => {
        console.error('[agency-agents] 设置入口展示位置失败：', err)
        setLocation(props.getLocation())
      })
      .finally(() => setSavingLocation(false))
  }

  const onToggleComposerRecommend = props.setComposerRecommend ? (next: boolean) => {
    setSavingRecommend(true)
    setComposerRecommendEnabled(next)
    props.setComposerRecommend!(next)
      .catch((err) => {
        console.error('[agency-agents] 设置任务智能推荐失败：', err)
        setComposerRecommendEnabled(!next)
      })
      .finally(() => setSavingRecommend(false))
  } : undefined

  return React.createElement(AgencyBundleConfigCard, {
    t: props.t,
    location,
    onLocationChange,
    disabled: savingLocation,
    composerRecommendEnabled,
    onToggleComposerRecommend,
    composerRecommendDisabled: savingRecommend,
  })
}

export interface SetupSidebarOptions {
  callApi: (path: string, options?: RequestInit) => Promise<any>
  renderPanel: (ownerProps: any) => React.ReactNode
  ns: string
  injectProps?: (() => Record<string, unknown>) | Record<string, unknown>
  onComposerRecommendChange?: (enabled: boolean) => void
  onLocationChange?: (location: EntryLocation) => void
}

export interface SidebarController {
  getLocation: () => EntryLocation
  setLocation: (next: EntryLocation) => Promise<EntryLocation>
  isSettingsSectionEnabled: () => boolean
  onLocationChange?: (fn: (location: EntryLocation) => void) => () => void
  isEnabled: () => boolean
  isSupported: () => boolean
  setEnabled: (next: boolean) => Promise<boolean>
  isComposerRecommendEnabled: () => boolean
  setComposerRecommend: (next: boolean) => Promise<boolean>
  destroy: () => void
}

export function setupSidebarEntry(ctx: any, options: SetupSidebarOptions): SidebarController {
  if (!ctx.locale) {
    return {
      getLocation: () => 'both',
      setLocation: async () => 'both',
      isSettingsSectionEnabled: () => true,
      onLocationChange: () => () => {},
      isEnabled: () => false,
      isSupported: () => false,
      setEnabled: async () => false,
      isComposerRecommendEnabled: () => false,
      setComposerRecommend: async () => false,
      destroy: () => {},
    }
  }

  const { callApi, renderPanel, ns } = options
  let entryLocation: EntryLocation = 'settings'
  let sidebarSupported = false
  let mainSupported = false
  let offPanel: (() => void) | null = null
  let offRow: (() => void) | null = null
  let epoch = 0
  let layoutService: any
  const listeners = new Set<() => void>()
  const locationListeners = new Set<(location: EntryLocation) => void>()

  const isSidebarEnabled = () => entryLocation === 'both' || entryLocation === 'sidebar'
  const isSettingsSectionEnabled = () => entryLocation === 'both' || entryLocation === 'settings'

  const notify = () => {
    for (const listener of listeners) {
      try { listener() } catch {}
    }
    for (const listener of locationListeners) {
      try { listener(entryLocation) } catch {}
    }
  }

  const sync = () => {
    if (isSidebarEnabled()) {
      if (mainSupported && !offPanel) {
        try {
          const res = ctx.slots.register({
            name: 'main',
            key: SIDEBAR_PANEL_ID,
            locale: ns,
            inject: () => {
              const extra = typeof options.injectProps === 'function' ? options.injectProps() : options.injectProps
              return Object.assign({ t: ctx.locale?.bind ? ctx.locale.bind(ns) : undefined }, extra)
            },
          }, (ownerProps: any) => React.createElement('div', { className: 'aag-main-panel' }, renderPanel(ownerProps)))
          offPanel = typeof res === 'function' ? res : () => {}
        } catch {}
      }
      if (sidebarSupported && !offRow) {
        try {
          const res = ctx.slots.register({
            name: 'sidebar.panellist',
            id: SIDEBAR_PANEL_ID,
            order: SIDEBAR_PANEL_ORDER,
            label: () => ctx.locale.bind(ns)('settings.title'),
            locale: ns,
          }, (ownerProps: any) => React.createElement(AgencySidebarIcon, ownerProps))
          offRow = typeof res === 'function' ? res : () => {}
        } catch {}
      }
    } else {
      if (layoutService?.panelInfo && typeof layoutService.selectPanel === 'function') {
        try {
          if (layoutService.panelInfo.getSnapshot().activePanelId === SIDEBAR_PANEL_ID) {
            layoutService.selectPanel(null)
          }
        } catch {}
      }
      if (offRow) {
        try { offRow() } catch {}
        offRow = null
      }
      if (offPanel) {
        try { offPanel() } catch {}
        offPanel = null
      }
    }
  }

  const setLocation = async (next: EntryLocation): Promise<EntryLocation> => {
    const currentEpoch = ++epoch
    const previous = entryLocation
    entryLocation = next
    sync()
    notify()
    if (typeof options.onLocationChange === 'function') {
      try { options.onLocationChange(next) } catch {}
    }
    try {
      await callApi('/api/michengai/dsh-agency-agents/sidebar-entry', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-michengai-client': '1' },
        body: JSON.stringify({ location: next }),
      })
      return next
    } catch (err) {
      if (currentEpoch === epoch) {
        entryLocation = previous
        sync()
        notify()
        if (typeof options.onLocationChange === 'function') {
          try { options.onLocationChange(previous) } catch {}
        }
      }
      throw err
    }
  }

  const setEnabled = async (next: boolean): Promise<boolean> => {
    await setLocation(next ? 'both' : 'settings')
    return isSidebarEnabled()
  }

  let composerRecommendEnabled = false
  let recommendEpoch = 0

  const setComposerRecommend = async (next: boolean): Promise<boolean> => {
    const currentEpoch = ++recommendEpoch
    composerRecommendEnabled = next
    notify()
    if (typeof options.onComposerRecommendChange === 'function') {
      try { options.onComposerRecommendChange(next) } catch {}
    }
    try {
      await callApi('/api/michengai/dsh-agency-agents/composer-recommend', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-michengai-client': '1' },
        body: JSON.stringify({ enabled: next }),
      })
      if (currentEpoch === recommendEpoch && typeof options.onComposerRecommendChange === 'function') {
        options.onComposerRecommendChange(next)
      }
      return next
    } catch (err) {
      console.error('[agency-agents] 调用 composer-recommend 接口失败：', err)
      if (currentEpoch === recommendEpoch) {
        composerRecommendEnabled = !next
        notify()
        if (typeof options.onComposerRecommendChange === 'function') {
          try { options.onComposerRecommendChange(!next) } catch {}
        }
      }
      throw err
    }
  }

  const loadEpoch = epoch
  callApi('/api/michengai/dsh-agency-agents/sidebar-entry')
    .then((res: any) => {
      if (epoch === loadEpoch && res) {
        if (res.location === 'both' || res.location === 'sidebar' || res.location === 'settings') {
          entryLocation = res.location
        } else if (typeof res.enabled === 'boolean') {
          entryLocation = res.enabled ? 'both' : 'settings'
        }
        sync()
        notify()
        if (typeof options.onLocationChange === 'function') {
          try { options.onLocationChange(entryLocation) } catch {}
        }
      }
    })
    .catch(() => {})

  const loadRecommendEpoch = recommendEpoch
  callApi('/api/michengai/dsh-agency-agents/composer-recommend')
    .then((res: any) => {
      if (recommendEpoch === loadRecommendEpoch && res && typeof res.enabled === 'boolean') {
        composerRecommendEnabled = res.enabled
        notify()
        if (typeof options.onComposerRecommendChange === 'function') {
          try { options.onComposerRecommendChange(res.enabled) } catch {}
        }
      }
    })
    .catch(() => {})

  if (typeof (ctx as any).inject === 'function') {
    (ctx as any).inject(['layout'], (scoped: any) => {
      layoutService = scoped.layout
    })
  }

  if (typeof ctx.slots?.inject === 'function') {
    ctx.slots.inject('main', () => {
      mainSupported = true
      sync()
      return () => {
        mainSupported = false
        if (offPanel) {
          try { offPanel() } catch {}
          offPanel = null
        }
      }
    })
    ctx.slots.inject('sidebar.panellist', () => {
      sidebarSupported = true
      sync()
      return () => {
        sidebarSupported = false
        if (offRow) {
          try { offRow() } catch {}
          offRow = null
        }
      }
    })
  } else {
    mainSupported = true
    sidebarSupported = true
  }

  ctx.slots.inject('plugins.bundle.config', () => {
    return ctx.slots.register({
      name: 'plugins.bundle.config',
      key: BUNDLE_KEY,
      locale: ns,
    }, (ownerProps: any) => {
      if (ownerProps && ownerProps.view === 'summary') return null
      return React.createElement(AgencyBundleConfigCardWrapper, {
        t: ctx.locale.bind(ns),
        getLocation: () => entryLocation,
        setLocation,
        getEnabled: () => isSidebarEnabled(),
        setSidebar: setEnabled,
        getComposerRecommendEnabled: () => composerRecommendEnabled,
        setComposerRecommend,
        subscribe: (fn: () => void) => {
          listeners.add(fn)
          return () => { listeners.delete(fn) }
        },
      })
    })
  })

  return {
    getLocation: () => entryLocation,
    setLocation,
    isSettingsSectionEnabled,
    onLocationChange: (fn: (loc: EntryLocation) => void) => {
      locationListeners.add(fn)
      return () => { locationListeners.delete(fn) }
    },
    isEnabled: () => isSidebarEnabled(),
    isSupported: () => sidebarSupported,
    setEnabled,
    isComposerRecommendEnabled: () => composerRecommendEnabled,
    setComposerRecommend,
    destroy: () => {
      listeners.clear()
      sidebarSupported = false
      mainSupported = false
      if (offRow) {
        try { offRow() } catch {}
        offRow = null
      }
      if (offPanel) {
        try { offPanel() } catch {}
        offPanel = null
      }
    },
  }
}
