/** 仅替换原生成员卡片的名称叶子文本，不修改任务正文或路由字段。 */
export function installNativeTeamNames(
  loadLabels: () => Promise<ReadonlyMap<string, string>>,
  onError: (error: unknown) => void,
) {
  const memberSelectors = [
    '[class$="_roster"] > button > [class$="_memberText"] > span:first-child',
    '[class$="_roster"] > button > [class$="_memberText"] > [class$="_memberName"] > [class$="_memberNameText"]',
  ]
  const tracked = new Map<Text, { original: string; shown: string }>()
  const seen = new WeakMap<Text, string>()
  let labels: ReadonlyMap<string, string> = new Map()
  let disposed = false
  let generation = 0

  const scan = (): boolean => {
    let added = false
    for (const [node] of tracked) if (!node.isConnected) tracked.delete(node)

    const visited = new Set<Element>()
    for (const selector of memberSelectors) {
      for (const element of document.querySelectorAll(selector)) {
        if (visited.has(element)) continue
        visited.add(element)
        for (const node of element.childNodes) {
          if (!(node instanceof Text)) continue
          const old = tracked.get(node)
          const text = old && node.data === old.shown ? old.original : node.data
          const match = text.match(/(agency-[a-z0-9-]+-[0-9a-f]{10})/u)
          if (!match) {
            if (old) tracked.delete(node)
            continue
          }
          const original = text
          if (seen.get(node) !== original) {
            seen.set(node, original)
            added = true
          }
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
      labels = next
      scan()
    } catch (error) {
      if (!disposed && current === generation) onError(error)
    }
  }

  const observer = new MutationObserver(() => {
    if (scan()) void refresh()
  })
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  if (scan()) void refresh()

  return {
    refresh,
    dispose() {
      disposed = true
      observer.disconnect()
      for (const [node, value] of tracked) {
        if (node.data === value.shown) node.data = value.original
      }
      tracked.clear()
    },
  }
}
