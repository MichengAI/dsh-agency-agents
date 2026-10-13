/** 宿主暂无显示名接口，只适配原生成员卡片及任务卡片中的名称叶子节点，不改变成员身份与点击行为。 */
export function installNativeTeamNames(loadLabels: () => Promise<{ readonly members: ReadonlyMap<string, string>; readonly teams?: ReadonlyArray<string> } | ReadonlyMap<string, string>>, onError: (error: unknown) => void) {
    const memberSelectors = [
    // 优先只选 memberNameText，避免父级 memberName 也被遍历导致重复处理
    '[class*="_roster"] button [class*="_memberNameText"]',
  ]
  const metaSelectors = [
    // 任务卡片 meta 行中的 Owner 显示项
    '[class*="_tasks"] [class*="_meta"] > span',
  ]
  const taskTitleSelector = '[class*="_tasks"] [class*="_taskTitle"] > strong'
  const tracked = new Map<Text, { original: string; shown: string }>()
  const seen = new WeakMap<Text, string>()
  let labels: ReadonlyMap<string, string> = new Map()
  let teamNames: ReadonlyArray<string> = []
  let disposed = false
  let generation = 0

  const resolveTeamNameFromDOM = (): string | undefined => {
    // 1. 优先从共享任务卡片的标题提取（形如 "技术方案评审团：软件架构师"）
    for (const strong of document.querySelectorAll(taskTitleSelector)) {
      const text = strong.textContent?.trim()
      if (!text) continue
      const colonIndex = text.indexOf('：') !== -1 ? text.indexOf('：') : text.indexOf(':')
      if (colonIndex > 0) {
        return text.slice(0, colonIndex).trim()
      }
    }
    // 2. 从已知的已启用团队列表匹配
    return teamNames[0]
  }

  const scan = (): boolean => {
    let added = false
    for (const [node] of tracked) if (!node.isConnected) tracked.delete(node)

    // 1. 扫描成员列表（包含 lead 替换）
    const leadReplacement = resolveTeamNameFromDOM()
    for (const selector of memberSelectors) {
      for (const element of document.querySelectorAll(selector)) {
        for (const node of element.childNodes) {
          if (!(node instanceof Text)) continue
          const old = tracked.get(node)
          const text = old && node.data === old.shown ? old.original : node.data
          const trimmed = text.trim()
          if (trimmed === 'lead' || (old && old.original.trim() === 'lead')) {
            const original = old && old.original.trim() === 'lead' ? old.original : text
            if (seen.get(node) !== original) { seen.set(node, original); added = true }
            const shown = leadReplacement ? original.replace('lead', leadReplacement) : original
            tracked.set(node, { original, shown })
            if (node.data !== shown) node.data = shown
            continue
          }
          const match = text.match(/(agency-[a-z0-9-]+-[0-9a-f]{10})/u)
          if (!match && !(old && old.original.match(/(agency-[a-z0-9-]+-[0-9a-f]{10})/u))) {
            continue
          }
          const original = old && old.original.match(/(agency-[a-z0-9-]+-[0-9a-f]{10})/u) ? old.original : text
          if (seen.get(node) !== original) { seen.set(node, original); added = true }
          const targetId = (original.match(/(agency-[a-z0-9-]+-[0-9a-f]{10})/u))![1]!
          const label = labels.get(targetId)
          const shown = label ? original.replace(targetId, label) : original
          tracked.set(node, { original, shown })
          if (node.data !== shown) node.data = shown
        }
      }
    }

    // 2. 扫描任务卡片 meta 行
    for (const selector of metaSelectors) {
      for (const element of document.querySelectorAll(selector)) {
        for (const node of element.childNodes) {
          if (!(node instanceof Text)) continue
          if (tracked.has(node) && (tracked.get(node)?.original === 'lead' || tracked.get(node)?.shown === leadReplacement)) continue
          const old = tracked.get(node)
          const text = old && node.data === old.shown ? old.original : node.data
          const match = text.match(/(agency-[a-z0-9-]+-[0-9a-f]{10})/u)
          if (!match) {
            if (old) tracked.delete(node)
            continue
          }
          const original = text
          if (seen.get(node) !== original) { seen.set(node, original); added = true }
          const targetId = match[1]!
          const label = labels.get(targetId)
          const shown = label ? original.replace(targetId, label) : original
          tracked.set(node, { original, shown })
          if (node.data !== shown) node.data = shown
        }
      }
    }

    return added
  }
  const refresh = async () => {
    const current = ++generation
    try {
      const next = await loadLabels()
      if (disposed || current !== generation) return
      if ('members' in next) {
        labels = next.members
        teamNames = next.teams ?? []
      } else {
        labels = next
      }
      scan()
    } catch (error) { if (!disposed && current === generation) onError(error) }
  }
  const observer = new MutationObserver(() => { if (scan()) void refresh() })
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  if (scan()) void refresh()
  return {
    refresh,
    tracked,
    dispose() {
      disposed = true
      observer.disconnect()
      for (const [node, value] of tracked) node.data = value.original
      tracked.clear()
    },
  }
}
