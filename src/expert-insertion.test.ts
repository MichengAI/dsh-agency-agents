import { describe, expect, it } from 'vitest'
import { insertExpertReference, matchExpertQuery, type ReferenceInsertionTarget } from './client/index.js'
import { composerProjection } from './test-utils/composer-projection.js'

const reference = { source: 'agency', ref: 'expert', label: '专家', clipboardText: '@专家' }
function input(initial: string, failText = false) {
  let draft = initial
  let draftRev = 4
  const notices: string[] = []
  const target: ReferenceInsertionTarget = {
    state: { getSnapshot: () => ({ ...composerProjection(draft, []), draftRev }) },
    insertReference: (_ref, span) => {
      if (span.draftRev !== draftRev) return false
      draft = draft.slice(0, span.start) + '\uFFFC ' + draft.slice(span.end)
      draftRev++
      return true
    },
    insertText: (text, span) => {
      if (failText || span.draftRev !== draftRev) return false
      draft = draft.slice(0, span.start) + text + draft.slice(span.end)
      draftRev++
      return true
    },
    notify: (_level, text) => { notices.push(text) },
  }
  return { target, snapshot: () => target.state.getSnapshot(), notices }
}

describe('选择专家时自动填入任务示例', () => {
  it('UI 不匹配 build、guide 等单词内部的字母', () => {
    const expert = { slug: 'builder', name: '开发专家', nameEn: 'Builder', division: '', divisionEn: '', divisionZh: '', description: '', descriptionEn: 'Build a guide for acquisition' }
    expect(matchExpertQuery(expert, 'UI')).toBe(false)
    expect(matchExpertQuery({ ...expert, descriptionEn: 'Build UI components' }, 'UI')).toBe(true)
  })
  it('已有多枚剪贴板引用时按 detect 坐标追加专家和示例', () => {
    const value = input('\uFFFC \uFFFC ')
    insertExpertReference(value.target, reference, '示例任务')
    expect(value.snapshot().draft).toBe('@专家 @专家 @专家 \n\n示例任务')
  })
  it('已有引用后的 @ 触发区间仍以 detect 坐标替换', () => {
    const value = input('\uFFFC @UI')
    insertExpertReference(value.target, reference, '示例任务', { start: 2, end: 5, draftRev: 4 })
    expect(value.snapshot().draft).toBe('@专家 @专家 \n\n示例任务')
  })
  it('空白正文保留原生引用并填入一次示例', () => {
    const value = input('')
    expect(insertExpertReference(value.target, reference, '示例任务')).toBe(true)
    expect(value.snapshot().draft).toBe('@专家 \n\n示例任务')
    insertExpertReference(value.target, reference, '其他示例')
    expect(value.snapshot().draft).toBe('@专家 @专家 \n\n示例任务')
  })
  it('有正文时仅插入引用，不追加或覆盖用户需求', () => {
    const value = input('我的需求\n保持内容')
    insertExpertReference(value.target, reference, '示例任务')
    expect(value.snapshot().draft).toBe('@专家 我的需求\n保持内容')
  })
  it('@ 候选用原触发区间替换，排除触发词后判断空白正文', () => {
    const value = input('@UX')
    expect(insertExpertReference(value.target, reference, '示例任务', { start: 0, end: 3, draftRev: 4 })).toBe(true)
    expect(value.snapshot().draft).toBe('@专家 \n\n示例任务')
  })
  it('过期触发区间不插入标签，也不写示例', () => {
    const value = input('@UX')
    expect(insertExpertReference(value.target, reference, '示例任务', { start: 0, end: 3, draftRev: 3 })).toBe(false)
    expect(value.snapshot().draft).toBe('@UX')
  })
  it('键盘选择等待宿主外层编辑事务提交，再按新坐标填入示例', async () => {
    const value = input('@UX')
    const target = { ...value.target, insertReference: (ref: typeof reference, span: { start: number; end: number; draftRev: number }) => {
      // 外层键盘事务返回后才排入宿主提交，早于它的微任务会读到旧草稿。
      queueMicrotask(() => queueMicrotask(() => { value.target.insertReference(ref, span) }))
      return true
    } }
    expect(insertExpertReference(target, reference, '示例任务', { start: 0, end: 3, draftRev: 4 })).toBe(true)
    await new Promise<void>(resolve => setTimeout(resolve, 0))
    expect(value.snapshot().draft).toBe('@专家 \n\n示例任务')
  })
  it('示例写入失败时保留已成功插入的标签并提示，不要求重复选专家', () => {
    const value = input('', true)
    expect(insertExpertReference(value.target, reference, '示例任务', undefined, '示例未填入')).toBe(true)
    expect(value.snapshot().draft).toBe('@专家 ')
    expect(value.notices).toEqual(['示例未填入'])
  })
  it('正文插入事件抛错仍反馈为示例失败，保留成功的专家选择', () => {
    const value = input('')
    const target = { ...value.target, insertText: () => { throw new Error('宿主事件失败') } }
    expect(insertExpertReference(target, reference, '示例任务', undefined, '示例未填入')).toBe(true)
    expect(value.snapshot().draft).toBe('@专家 ')
    expect(value.notices).toEqual(['示例未填入'])
  })
})
