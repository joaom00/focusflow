import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { PlusIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import React from 'react'

type DropdownProps = Dropdown.DropdownMenuProps

export const DropdownMenu = ({ children, ...props }: DropdownProps) => {
  return (
    <Dropdown.Root {...props}>
      <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
      <Dropdown.Portal container={document.getElementById('task-sidebar')}>
        <div className="absolute inset-0 pointer-events-none z-50">
          <Dropdown.Content className="min-w-[300px] w-full rounded-lg bg-gray-850 py-1 text-sm shadow-lg shadow-black/50 border border-gray-700 relative pointer-events-auto">
            <DropdownItem>
              Copy task
              <RightSLot>Ctrl+C</RightSLot>
            </DropdownItem>

            <Dropdown.Separator className="h-[1px] bg-gray-700 my-1" />

            <DropdownItem>
              <PlusIcon />
              Insert task below
              <RightSLot>Alt+Enter</RightSLot>
            </DropdownItem>
          </Dropdown.Content>
        </div>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}

type DropdownItemProps = {
  children?: React.ReactNode
  onSelect?: (event: Event) => void
}

const MotionDropdownItem = motion(Dropdown.Item)
const DropdownItem = ({ children, onSelect }: DropdownItemProps) => {
  const [hovering, setHovering] = React.useState(false)

  return (
    <MotionDropdownItem
      onSelect={onSelect}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      animate={hovering ? 'hovering' : 'unhovering'}
      variants={{
        hovering: {
          backgroundColor: 'rgb(51 51 56)',
          transition: { duration: 0 },
        },
        unhovering: {
          backgroundColor: 'rgb(51 51 56 / 0)',
          transition: { duration: 0.18 },
        },
      }}
      className="flex items-center gap-2 px-3 cursor-pointer h-[30px] text-gray-200 focus:outline-none"
    >
      {children}
    </MotionDropdownItem>
  )
}

const RightSLot = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="ml-auto text-[11px] leading-none text-gray-400 border border-gray-700 rounded-[4px] p-0.5">
      {children}
    </div>
  )
}
