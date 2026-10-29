import React, { useState, useEffect, useRef } from 'react'
import { Menu, Button } from '@deepseek-ai/dsh-client-ui-primitives'
import { recommendExpertsForTask, type RecommendCandidate } from '../recommend-engine.js'
import type { ExpertSearchable, ReferenceInsertionTarget } from './index.js'
import type { ExpertTeam } from '../team-contract.js'

export interface RecommendBarProps {
  readonly draft: string
  readonly experts: readonly ExpertSearchable[]
  readonly teams: readonly ExpertTeam[]
  readonly enabledExpertSlugs: ReadonlySet<string>
  readonly enabledTeamIds: ReadonlySet<string>
  readonly activeLocale: 'zh' | 'en'
  readonly onSelect: (candidate: RecommendCandidate) => void
  readonly currentOccurrences?: readonly string[]
  readonly target?: ReferenceInsertionTarget
  readonly inDock?: boolean
}

/**
 * 极简向下箭头图标（12x12 SVG，对齐宿主 Chevron 规范与展开旋转动效）。
 */
function ChevronDownIcon({ open }: { open?: boolean }): React.ReactElement {
  return React.createElement(
    'svg',
    {
      viewBox: '0 0 16 16',
      width: 12,
      height: 12,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.5,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className: `aag-hero-recommend-chevron${open ? ' aag-hero-recommend-chevron-open' : ''}`,
      'aria-hidden': 'true',
    },
    React.createElement('path', { d: 'M4 6l4 4 4-4' }),
  )
}

/**
 * 极简推荐闪烁星星图标（14x14 SVG）。
 */
function SparkleIcon(): React.ReactElement {
  return React.createElement(
    'svg',
    {
      viewBox: '0 0 16 16',
      width: 14,
      height: 14,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className: 'aag-hero-recommend-icon',
      'aria-hidden': 'true',
    },
    React.createElement('path', {
      d: 'M8 1.5l1.8 4.2 4.2 1.8-4.2 1.8L8 13.5l-1.8-4.2-4.2-1.8 4.2-1.8L8 1.5z',
    }),
  )
}

/**
 * 从宿主插槽 props 或 fallbackTarget 中统一提取推荐所需输入。
 * 确保已选引用精准提取实体标识 `ref`（而非插件源名 `source`），防范装配层回归。
 */
export function resolveRecommendInputs(
  props: unknown,
  fallbackTarget?: ReferenceInsertionTarget,
): { sessionId?: string; draft: string; occurrences: string[] } {
  const p = (props && typeof props === 'object' ? props : {}) as Record<string, any>
  const sessionId = p.sessionId ?? p.session?.id
  const inputSnapshot = p.input?.getSnapshot?.() ?? p.input ?? fallbackTarget?.state?.getSnapshot()
  const draft = String(inputSnapshot?.draft ?? '')
  const occurrences = (inputSnapshot?.occurrences ?? []).map((o: any) => String(o.ref ?? o.source ?? ''))
  return { sessionId, draft, occurrences }
}

/**
 * 将任务推荐候选列表转换为宿主原生的两行式 Menu 项数据结构。
 * 纯函数抽离，供组件渲染与单元测试严格守护。
 */
export function buildRecommendMenuItems(
  candidates: readonly RecommendCandidate[],
  activeLocale: 'zh' | 'en',
): Array<{ id: string; label: React.ReactElement }> {
  const isZh = activeLocale === 'zh'
  return candidates.map(cand => ({
    id: cand.id,
    label: React.createElement(
      'span',
      { className: 'aag-hero-menu-item' },
      React.createElement(
        'span',
        { className: 'aag-hero-menu-item-row1' },
        React.createElement('span', { className: 'aag-hero-menu-item-name' }, cand.name),
        cand.kind === 'team'
          ? React.createElement('span', { className: 'aag-hero-menu-item-tag' }, isZh ? '团队' : 'Team')
          : null,
      ),
      React.createElement(
        'span',
        { className: 'aag-hero-menu-item-desc' },
        cand.reason,
      ),
    ),
  }))
}

/**
 * 欢迎页工作区行右侧（conversation.hero.options）及已有会话输入框顶栏的专家推荐原生下拉控件。
 * 1. 无输入或未命中时完全静默（返回 null），不占空间；
 * 2. 输入命中时在右上沿浮现带推荐计数的原生 Trigger Chip；
 * 3. 点击一律向上（side="top"）展开两行式 Menu，避免遮盖输入框与发送按钮。
 */
export function RecommendBar(props: RecommendBarProps): React.ReactElement | null {
  const {
    draft: propDraft,
    experts,
    teams,
    enabledExpertSlugs,
    enabledTeamIds,
    activeLocale,
    onSelect,
    currentOccurrences: propOccurrences = [],
    target,
    inDock = false,
  } = props

  const [liveDraft, setLiveDraft] = useState<string>(propDraft)
  const [liveOccurrences, setLiveOccurrences] = useState<readonly string[]>(propOccurrences)
  const [candidates, setCandidates] = useState<readonly RecommendCandidate[]>([])
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1. 同步上层传入的 prop 变化
  useEffect(() => {
    setLiveDraft(propDraft)
    setLiveOccurrences(propOccurrences)
  }, [propDraft, propOccurrences])

  // 2. 深度订阅输入框真实状态（若宿主未全量传递 props，通过 target.state 实时响应输入）
  useEffect(() => {
    if (!target?.state?.getSnapshot) return
    const readLiveSnapshot = (): void => {
      const snap = target.state.getSnapshot()
      if (!snap) return
      setLiveDraft(String(snap.draft ?? ''))
      const occs = (snap.occurrences ?? []).map((o: any) => String(o.ref ?? o.source ?? ''))
      setLiveOccurrences(occs)
    }

    readLiveSnapshot()

    const stateObj = target.state as any
    if (typeof stateObj.subscribe === 'function') {
      const unsubscribe = stateObj.subscribe(() => {
        readLiveSnapshot()
      })
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe()
      }
    }
  }, [target])

  // 3. 防抖计算推荐候选列表（250ms 防抖，零模型 Token 损耗）
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const trimmed = liveDraft.trim()
    // 中文双字（如“安全”、“架构”）即为完整领域意图；纯英文保持 >= 3 字符防抖触发
    if (trimmed.length < 2 || (trimmed.length < 3 && !/[\u4e00-\u9fa5]/u.test(trimmed))) {
      setCandidates([])
      setOpen(false)
      return
    }

    timerRef.current = setTimeout(() => {
      const excludeSlugs = new Set(liveOccurrences)
      const list = recommendExpertsForTask({
        draft: trimmed,
        experts,
        teams,
        enabledExpertSlugs,
        enabledTeamIds,
        activeLocale,
        maxCount: 4,
        excludeSlugs,
      })

      setCandidates(list)
      if (list.length === 0) {
        setOpen(false)
      }
    }, 250)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [liveDraft, liveOccurrences, experts, teams, enabledExpertSlugs, enabledTeamIds, activeLocale])

  // 4. 无输入或无命中时完全静默隐藏（满足“无输入的时候就不显示”）
  if (candidates.length === 0) return null

  const isZh = activeLocale === 'zh'
  const triggerLabel = isZh ? '推荐专家' : 'Suggestions'

  // 5. 映射为宿主原生的两行式 Menu 项
  const items = buildRecommendMenuItems(candidates, activeLocale)

  // 6. 锚点按钮（Trigger Chip）：完全对齐宿主原生 Button variant="ghost" size="sm" 规范
  const anchor = React.createElement(
    Button,
    {
      variant: 'ghost',
      size: 'sm',
      className: 'aag-hero-recommend-seat',
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      title: isZh ? '查看任务匹配的专家与团队推荐' : 'View expert suggestions',
      onClick: () => {
        setOpen(prev => !prev)
      },
      icon: React.createElement(SparkleIcon),
    },
    React.createElement('span', { className: 'aag-hero-recommend-label' }, triggerLabel),
    React.createElement('span', { className: 'aag-hero-recommend-badge' }, String(candidates.length)),
    React.createElement(ChevronDownIcon, { open }),
  )

  return React.createElement(
    'div',
    { className: inDock ? 'aag-dock-right-recommend' : 'aag-hero-options-recommend' },
    React.createElement(Menu, {
      open,
      onClose: () => {
        setOpen(false)
      },
      align: 'end',
      side: 'top',
      portal: false,
      items,
      onSelect: (id: string) => {
        setOpen(false)
        const cand = candidates.find(c => c.id === id)
        if (cand) onSelect(cand)
      },
      anchor,
    }),
  )
}
