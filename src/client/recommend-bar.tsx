import React, { useState, useEffect, useRef } from 'react'
import { Pill, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
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
}

/**
 * 输入框正上方的推荐条组件。
 * 纯客户端防抖计算（250ms），零模型 Token 损耗；
 * 采用宿主原生 Pill / Tooltip 与 CSS 变量构建。
 */
/**
 * 从宿主 input.dock 插槽 props 或 fallbackTarget 中统一提取推荐所需输入。
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

export function RecommendBar(props: RecommendBarProps): React.ReactElement | null {
  const {
    draft,
    experts,
    teams,
    enabledExpertSlugs,
    enabledTeamIds,
    activeLocale,
    onSelect,
    currentOccurrences = [],
  } = props

  const [candidates, setCandidates] = useState<readonly RecommendCandidate[]>([])
  const [dismissedKey, setDismissedKey] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const trimmed = draft.trim()
    // 中文双字（如“安全”、“架构”）即为完整领域意图；纯英文保持 >= 3 字符防抖触发
    if (trimmed.length < 2 || (trimmed.length < 3 && !/[\u4e00-\u9fa5]/u.test(trimmed))) {
      setCandidates([])
      return
    }

    // 防抖 250ms，避免用户快速键入时高频执行切词打分
    timerRef.current = setTimeout(() => {
      // 如果当前草稿内容已被用户手动“忽略”，不再弹起
      if (dismissedKey === trimmed) {
        setCandidates([])
        return
      }

      const excludeSlugs = new Set(currentOccurrences)
      const list = recommendExpertsForTask({
        draft: trimmed,
        experts,
        teams,
        enabledExpertSlugs,
        enabledTeamIds,
        activeLocale,
        maxCount: 3,
        excludeSlugs,
      })

      setCandidates(list)
    }, 250)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [draft, experts, teams, enabledExpertSlugs, enabledTeamIds, activeLocale, dismissedKey, currentOccurrences])

  // 无命中或分数不足时保持平滑静默
  if (candidates.length === 0) return null

  const isZh = activeLocale === 'zh'
  const titleText = isZh ? '推荐：' : 'Suggestions:'
  const dismissText = isZh ? '忽略' : 'Dismiss'

  return React.createElement(
    'div',
    {
      className: 'aag-recommend-dock',
      role: 'region',
      'aria-label': isZh ? '任务专家推荐' : 'Expert suggestions',
    },
    React.createElement(
      'span',
      { className: 'aag-recommend-lead' },
      titleText,
    ),
    React.createElement(
      'div',
      { className: 'aag-recommend-chips' },
      candidates.map((cand) =>
        React.createElement(
          Tooltip,
          {
            key: cand.id,
            label: cand.reason,
            side: 'top',
            delayMs: 200,
          },
          React.createElement(
            Pill,
            {
              className: 'aag-recommend-pill',
              onClick: () => {
                onSelect(cand)
              },
            },
            React.createElement('span', { className: 'aag-pill-emoji' }, cand.emoji),
            React.createElement('span', { className: 'aag-pill-name' }, cand.name),
            cand.kind === 'team'
              ? React.createElement('span', { className: 'aag-pill-tag' }, isZh ? '团队' : 'Team')
              : null,
          ),
        ),
      ),
    ),
    React.createElement(
      'button',
      {
        type: 'button',
        className: 'aag-recommend-dismiss',
        title: isZh ? '忽略当前推荐' : 'Dismiss suggestions',
        onClick: () => {
          setDismissedKey(draft.trim())
          setCandidates([])
        },
      },
      dismissText,
    ),
  )
}
