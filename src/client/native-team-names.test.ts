import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installNativeTeamNames } from './native-team-names.js'

class MockTextNode {
  nodeType = 3
  isConnected = true
  constructor(public data: string) {}
}

class MockElement {
  nodeType = 1
  isConnected = true
  childNodes: any[] = []
  className = ''
  constructor(public tagName: string, public classes: string[] = []) {
    this.className = classes.join(' ')
  }

  get firstChild() {
    return this.childNodes[0] ?? null
  }

  appendChild(child: any) {
    this.childNodes.push(child)
    return child
  }

  matches(selector: string): boolean {
    const parts = selector.split(/\s+/).filter(Boolean)
    const last = parts[parts.length - 1]
    if (last?.startsWith('[class*="') && last.endsWith('"]')) {
      const targetClass = last.slice(9, -2)
      return this.classes.some(c => c.includes(targetClass))
    }
    if (last === 'button') return this.tagName.toLowerCase() === 'button'
    if (last === 'span') return this.tagName.toLowerCase() === 'span'
    if (last === 'strong') return this.tagName.toLowerCase() === 'strong'
    if (last === '> span') return this.tagName.toLowerCase() === 'span'
    if (last === '> strong') return this.tagName.toLowerCase() === 'strong'
    return false
  }

  querySelectorAll(selector: string): MockElement[] {
    const results: MockElement[] = []
    const traverse = (el: MockElement) => {
      for (const child of el.childNodes) {
        if (child instanceof MockElement) {
          if (child.matches(selector)) {
            results.push(child)
          }
          traverse(child)
        }
      }
    }
    traverse(this)
    return results
  }
}

describe('installNativeTeamNames', () => {
  let originalDocument: any
  let originalMutationObserver: any
  let originalText: any

  beforeEach(() => {
    originalDocument = (globalThis as any).document
    originalMutationObserver = (globalThis as any).MutationObserver
    originalText = (globalThis as any).Text

    ;(globalThis as any).Text = MockTextNode
    ;(globalThis as any).MutationObserver = class {
      observe = vi.fn()
      disconnect = vi.fn()
    }
  })

  afterEach(() => {
    ;(globalThis as any).document = originalDocument
    ;(globalThis as any).MutationObserver = originalMutationObserver
    ;(globalThis as any).Text = originalText
  })

  it('替换成员列表中的机器标识为专家本地化名称，并替换 lead 为专家团名称', async () => {
    const root = new MockElement('div')
    const roster = new MockElement('div', ['VoX2oq_roster'])
    root.appendChild(roster)

    // lead 按钮
    const buttonLead = new MockElement('button', ['VoX2oq_member'])
    const memberTextLead = new MockElement('span', ['VoX2oq_memberText'])
    const memberNameLead = new MockElement('span', ['VoX2oq_memberName'])
    const memberNameTextLead = new MockElement('span', ['VoX2oq_memberNameText'])
    const textNodeLead = new MockTextNode('lead')
    memberNameTextLead.appendChild(textNodeLead)
    memberNameLead.appendChild(memberNameTextLead)
    memberTextLead.appendChild(memberNameLead)
    buttonLead.appendChild(memberTextLead)
    roster.appendChild(buttonLead)

    // 队友按钮
    const buttonTeammate = new MockElement('button', ['VoX2oq_member'])
    const memberTextTeammate = new MockElement('span', ['VoX2oq_memberText'])
    const memberNameTeammate = new MockElement('span', ['VoX2oq_memberName'])
    const memberNameTextTeammate = new MockElement('span', ['VoX2oq_memberNameText'])
    const textNodeTeammate = new MockTextNode('agency-engineering-software-architect-8a70fbbcd3')
    memberNameTextTeammate.appendChild(textNodeTeammate)
    memberNameTeammate.appendChild(memberNameTextTeammate)
    memberTextTeammate.appendChild(memberNameTeammate)
    buttonTeammate.appendChild(memberTextTeammate)
    roster.appendChild(buttonTeammate)

    console.log('textNodeLead === textNodeTeammate?', textNodeLead === textNodeTeammate)

    // 共享任务卡片（包含专家团名称，供 lead 识别）
    const tasks = new MockElement('div', ['VoX2oq_tasks'])
    const task = new MockElement('div', ['VoX2oq_task'])
    const taskTitle = new MockElement('div', ['VoX2oq_taskTitle'])
    const strongTitle = new MockElement('strong')
    strongTitle.appendChild(new MockTextNode('技术方案评审团：软件架构师'))
    taskTitle.appendChild(strongTitle)
    task.appendChild(taskTitle)
    tasks.appendChild(task)

    root.appendChild(roster)
    root.appendChild(tasks)

    ;(globalThis as any).document = {
      body: root,
      querySelectorAll: (sel: string) => root.querySelectorAll(sel),
    }

    const labels = new Map([
      ['agency-engineering-software-architect-8a70fbbcd3', '软件架构师'],
    ])
    const loader = vi.fn(async () => ({ members: labels, teams: ['技术方案评审团'] }))
    const onError = vi.fn()

    const handle = installNativeTeamNames(loader, onError)
    await handle.refresh()

    expect(textNodeTeammate.data).toBe('软件架构师')
    expect(textNodeLead.data).toBe('技术方案评审团')

    console.log('before dispose, tracked entries:', [...(handle as any).tracked.entries()].map(([k, v]: any) => [k.data, v]))
    handle.dispose()
    expect(textNodeTeammate.data).toBe('agency-engineering-software-architect-8a70fbbcd3')
    expect(textNodeLead.data).toBe('lead')
  })

  it('替换共享任务卡片中的 Owner 标识', async () => {
    const root = new MockElement('div')
    const tasks = new MockElement('div', ['VoX2oq_tasks'])
    const task = new MockElement('div', ['VoX2oq_task'])
    const meta = new MockElement('div', ['VoX2oq_meta'])
    const spanTask = new MockElement('span')
    spanTask.appendChild(new MockTextNode('task-1'))
    const spanOwner = new MockElement('span')
    const textNode = new MockTextNode('Owner: agency-security-appsec-engineer-f29ea176a0')
    spanOwner.appendChild(textNode)

    meta.appendChild(spanTask)
    meta.appendChild(spanOwner)
    task.appendChild(meta)
    tasks.appendChild(task)
    root.appendChild(tasks)

    ;(globalThis as any).document = {
      body: root,
      querySelectorAll: (sel: string) => root.querySelectorAll(sel),
    }

    const labels = new Map([
      ['agency-security-appsec-engineer-f29ea176a0', '应用安全工程师'],
    ])
    const loader = vi.fn(async () => labels)
    const onError = vi.fn()

    const handle = installNativeTeamNames(loader, onError)
    await handle.refresh()

    expect(textNode.data).toBe('Owner: 应用安全工程师')

    handle.dispose()
    expect(textNode.data).toBe('Owner: agency-security-appsec-engineer-f29ea176a0')
  })
})
