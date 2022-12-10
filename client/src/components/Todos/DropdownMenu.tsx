import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { CopyIcon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import React from 'react'

type DropdownProps = Dropdown.DropdownMenuProps

export const DropdownMenu = ({ children, ...props }: DropdownProps) => {
  return (
    <Dropdown.Root {...props}>
      <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
      <Dropdown.Portal container={document.getElementById('task-sidebar')}>
        <div className="absolute inset-0 pointer-events-none z-50">
          <Dropdown.Content
            align="start"
            className="min-w-[300px] w-full rounded-lg bg-gray-850 py-1 text-sm shadow-lg shadow-black/50 border border-gray-700 relative pointer-events-auto"
          >
            <DropdownItem>
              <CopyIcon aria-hidden />
              Copy text
              <RightSLot>Ctrl+C</RightSLot>
            </DropdownItem>


            <Dropdown.Separator className="h-[1px] bg-gray-700 my-1" />

            <DropdownItem>
              <PlusIcon aria-hidden />
              Insert task below
              <RightSLot>Alt+Enter</RightSLot>
            </DropdownItem>

            <DropdownItem>
              <CopyIcon aria-hidden />
              Duplicate
              <RightSLot>Ctrl+D</RightSLot>
            </DropdownItem>

            <DropdownItem>
              <Pencil1Icon aria-hidden />
              Edit
              <RightSLot>Enter</RightSLot>
            </DropdownItem>

            <Dropdown.Separator className="h-[1px] bg-gray-700 my-1" />

            <DropdownItem>
              <TrashIcon aria-hidden />
              Delete
              <RightSLot>Delete</RightSLot>
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

const DropdownItem = ({ children, onSelect }: DropdownItemProps) => {
  return (
    <Dropdown.Item
      onSelect={onSelect}
      className="flex items-center gap-2 px-3 cursor-pointer h-[30px] text-gray-200 focus:outline-none radix-highlighted:bg-gray-750"
    >
      {children}
    </Dropdown.Item>
  )
}

const RightSLot = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="ml-auto text-[11px] leading-none text-gray-400 border border-gray-700 rounded-[4px] p-0.5">
      {children}
    </div>
  )
}
