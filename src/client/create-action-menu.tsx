import React from 'react'
import { Menu, type MenuEntry } from '@deepseek-ai/dsh-client-ui-primitives'
import { Button } from './plugin-ui.js'
import { IconPlus } from './team-shared.js'

export interface CreateActionMenuProps {
  readonly label: string
  readonly manualLabel: string
  readonly chatLabel: string
  readonly disabled?: boolean
  readonly onSelectManual: () => void
  readonly onSelectChat: () => void
}

export function CreateActionMenu(props: CreateActionMenuProps): React.ReactElement {
  const [open, setOpen] = React.useState(false)

  const entries: readonly MenuEntry[] = [
    { id: 'manual', label: props.manualLabel },
    { id: 'chat', label: props.chatLabel },
  ]

  return (
    <div className="aag-create-menu-wrap" style={{ display: 'inline-block' }}>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(id: string) => {
          setOpen(false)
          if (id === 'manual') props.onSelectManual()
          else if (id === 'chat') props.onSelectChat()
        }}
        align="end"
        portal
        dense
        anchor={
          <Button
            className="aag-icon-btn"
            size="small"
            disabled={props.disabled}
            aria-label={props.label}
            title={props.label}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => {
              if (!props.disabled) setOpen(prev => !prev)
            }}
          >
            <IconPlus />
          </Button>
        }
        items={entries}
      />
    </div>
  )
}
