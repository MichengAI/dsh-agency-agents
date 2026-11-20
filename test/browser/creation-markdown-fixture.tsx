import React from 'react'

// The default isolated fixture does not bundle the host renderer's optional dependencies.
export const MarkdownText: React.ComponentType<{ text: string; labels: unknown }> = ({ text }) => {
  const action = /\[([^\]]+)\]\(([^)]+)\)/u.exec(text)
  return action ? <a href={action[2]}>{action[1]}</a> : null
}
