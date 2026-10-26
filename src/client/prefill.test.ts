import { describe, expect, it, vi } from 'vitest'
import {
  peekChatPrefill,
  setChatPrefill,
  subscribeChatPrefill,
  takeChatPrefill,
  triggerChatCreation,
} from './prefill.js'

describe('prefill', () => {
  it('stores and retrieves pending chat prefill', () => {
    takeChatPrefill() // 清理状态
    expect(peekChatPrefill()).toBeNull()

    setChatPrefill('我要创建一个专家')
    expect(peekChatPrefill()).toBe('我要创建一个专家')

    const taken = takeChatPrefill()
    expect(taken).toBe('我要创建一个专家')
    expect(peekChatPrefill()).toBeNull()
  })

  it('notifies subscribers when prefill is set', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeChatPrefill(listener)

    setChatPrefill('组建专家团')
    expect(listener).toHaveBeenCalledWith('组建专家团')

    unsubscribe()
    setChatPrefill('另一个任务')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('triggerChatCreation calls closeSettings and sets prefill', () => {
    const closeSettings = vi.fn()
    triggerChatCreation('测试预填', closeSettings)

    expect(closeSettings).toHaveBeenCalled()
    expect(peekChatPrefill()).toBe('测试预填')
    takeChatPrefill()
  })
})
