import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CreationDialog } from './creation-dialog.js'
import type { AgencyCreationRemote } from './remote.js'

describe('CreationDialog', () => {
  const mockRemote: AgencyCreationRemote = {
    generateDraft: vi.fn(async () => ({
      ok: true as const,
      value: {
        ok: true,
        expertDraft: {
          name: 'Go 高并发专家',
          description: '专注微服务并发与通道调优',
          division: 'engineering',
          emoji: '🐹',
          prompt: '你是一位 Go 高并发专家...',
          avatar: 0,
        },
      },
    })),
    getPendingProposal: vi.fn(async () => ({ ok: true as const, value: null })),
  }

  it('renders initial expert dialog layout with prompt input and guide notice', () => {
    const html = renderToStaticMarkup(
      React.createElement(CreationDialog, {
        kind: 'expert',
        locale: 'zh',
        remote: mockRemote,
        t: (k: string) => k,
        onApplyExpert: vi.fn(),
        onApplyTeam: vi.fn(),
        onClose: vi.fn(),
      })
    )

    expect(html).toContain('creation.titleExpert')
    expect(html).toContain('creation.tokenNotice')
    expect(html).toContain('creation.generate')
  })

  it('renders team dialog layout with team prompt placeholder', () => {
    const html = renderToStaticMarkup(
      React.createElement(CreationDialog, {
        kind: 'team',
        locale: 'zh',
        remote: mockRemote,
        t: (k: string) => k,
        onApplyExpert: vi.fn(),
        onApplyTeam: vi.fn(),
        onClose: vi.fn(),
      })
    )

    expect(html).toContain('creation.titleTeam')
    expect(html).toContain('creation.generate')
  })

  it('renders discard button and disabled useDraft button initially', () => {
    const html = renderToStaticMarkup(
      React.createElement(CreationDialog, {
        kind: 'expert',
        locale: 'zh',
        remote: mockRemote,
        t: (k: string) => k,
        onApplyExpert: vi.fn(),
        onApplyTeam: vi.fn(),
        onClose: vi.fn(),
      })
    )

    expect(html).toContain('creation.discard')
    expect(html).toContain('creation.useDraft')
  })
})
