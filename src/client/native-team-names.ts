/** 宿主暂无显示名接口，只适配原生成员卡片的名称叶子节点，不改变成员身份与点击行为。 */
export function installNativeTeamNames(loadLabels: () => Promise<ReadonlyMap<string, string>>, onError: (error: unknown) => void) {
  const selector = '[class$="_roster"] > button > span[class$="_memberText"] > span:first-child'
  const tracked = new Map<Text, { original: string; shown: string }>()
  const seen = new WeakMap<Text, string>()
  let labels: ReadonlyMap<string, string> = new Map()
  let disposed = false
  let generation = 0
  const scan = (): boolean => {
    let added = false
    for (const [node] of tracked) if (!node.isConnected) tracked.delete(node)
    for (const element of document.querySelectorAll(selector)) {
      const node = element.firstChild
      if (!(node instanceof Text) || element.childNodes.length !== 1) continue
      const old = tracked.get(node)
      const original = old && node.data === old.shown ? old.original : node.data
      if (!/^agency-[a-z0-9-]+-[0-9a-f]{10}$/u.test(original)) { tracked.delete(node); continue }
      if (seen.get(node) !== original) { seen.set(node, original); added = true }
      const shown = labels.get(original) ?? original
      tracked.set(node, { original, shown })
      // 修改原文字节点，保留 React 持有的节点和事件绑定。
      if (node.data !== shown) node.data = shown
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
    } catch (error) { if (!disposed && current === generation) onError(error) }
  }
  const observer = new MutationObserver(() => { if (scan()) void refresh() })
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  if (scan()) void refresh()
  return {
    refresh,
    dispose() {
      disposed = true
      observer.disconnect()
      for (const [node, value] of tracked) if (node.data === value.shown) node.data = value.original
      tracked.clear()
    },
  }
}
