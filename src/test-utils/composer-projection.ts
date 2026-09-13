// 测试夹具：按宿主协议输出剪贴板草稿与引用范围，编辑坐标仍使用单字符引用。
export function composerProjection(detectText: string, labels: readonly string[]) {
  let draft = ''
  const occurrences: { source: string; offset: number; length: number }[] = []
  let index = 0
  for (const character of detectText) {
    if (character !== '\uFFFC') { draft += character; continue }
    const text = `@${labels[index++] ?? '专家'}`
    occurrences.push({ source: 'agency', offset: draft.length, length: text.length })
    draft += text
  }
  return { draft, occurrences }
}
