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
  parent: MockElement | null = null
  constructor(public tagName: string, public classes: string[] = []) {
    this.className = classes.join(' ')
  }

  get firstChild() {
    return this.childNodes[0] ?? null
  }

  appendChild(child: any) {
    if (child instanceof MockElement) child.parent = this
    this.childNodes.push(child)
    return child
  }

  matches(selector: string): boolean {
    const parts = selector.split('>').map(part => part.trim())
    let element: MockElement | null = this
    for (let index = parts.length - 1; index >= 0; index--) {
      const part = parts[index]!
      const tag = part.match(/^[a-z]+/i)?.[0]
      const classSuffix = part.match(/\[class\$="([^"]+)"\]/)?.[1]
      if (tag && element?.tagName.toLowerCase() !== tag.toLowerCase()) return false
      if (classSuffix && !element?.classes.some(name => name.endsWith(classSuffix))) return false
      if (part.includes(':first-child') && element?.parent?.childNodes.filter(child => child instanceof MockElement)[0] !== element) return false
      if (index > 0) element = element?.parent ?? null
      if (element === null) return false
    }
    return true
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

  it('只本地化已知成员名称，保留 lead，并在宿主替换文本后安全卸载', async () => {
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

    ;(globalThis as any).document = {
      body: root,
      querySelectorAll: (sel: string) => root.querySelectorAll(sel),
    }

    const labels = new Map([
      ['agency-engineering-software-architect-8a70fbbcd3', '软件架构师'],
    ])
    const loader = vi.fn(async () => labels)
    const onError = vi.fn()

    const handle = installNativeTeamNames(loader, onError)
    await handle.refresh()

    expect(textNodeTeammate.data).toBe('软件架构师')
    expect(textNodeLead.data).toBe('lead')

    textNodeTeammate.data = '产品经理'
    handle.dispose()
    expect(textNodeTeammate.data).toBe('产品经理')
    expect(textNodeLead.data).toBe('lead')
  })

  it('不改写任务卡片中的路由 Owner 标识', async () => {
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

    expect(textNode.data).toBe('Owner: agency-security-appsec-engineer-f29ea176a0')

    handle.dispose()
    expect(textNode.data).toBe('Owner: agency-security-appsec-engineer-f29ea176a0')
  })
})
