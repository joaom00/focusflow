import React from 'react'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { CopyIcon, PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import { useTodo } from './Todo'
import type { Todo } from './Todos'
import { useQueryClient } from '@tanstack/react-query'
import shallow from 'zustand/shallow'

interface MenuProps {
  children: React.ReactNode
}

export const Menu = ({ children }: MenuProps) => {
  const queryClient = useQueryClient()
  const { id, value, setEdit, setMenu, insertTaskBelow, duplicateTask } = useTodo(
    (state) => ({
      id: state.id,
      value: state.value,
      setEdit: state.setEdit,
      setMenu: state.setMenu,
      insertTaskBelow: state.insertTaskBelow,
      duplicateTask: state.duplicateTask,
    }),
    shallow
  )

  const onCopy = () => window.navigator.clipboard.writeText(value)

  const onEdit = () => {
    setTimeout(() => {
      setEdit(true)
    }, 10)
  }

  const onInsertTaskBelow = () => {
    setTimeout(() => {
      queryClient.setQueryData<Todo[]>(['todos'], insertTaskBelow(id))
    }, 10)
  }

  const onDuplicateTask = () => {
    setTimeout(() => {
      queryClient.setQueryData<Todo[]>(['todos'], duplicateTask(id, value))
    }, 10)
  }

  return (
    <ContextMenu.Root onOpenChange={setMenu}>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[300px] w-full rounded-lg bg-gray-850 py-1 text-sm shadow-lg shadow-black/50 border border-gray-700">
          <MenuItem onSelect={onCopy}>
            <CopyIcon />
            Copy task
            <RightSLot>Ctrl+C</RightSLot>
          </MenuItem>

          <ContextMenu.Separator className="h-[1px] bg-gray-700 my-1" />

          <MenuItem onSelect={onInsertTaskBelow}>
            <PlusIcon />
            Insert task below
            <RightSLot>Alt+Enter</RightSLot>
          </MenuItem>

          <MenuItem onSelect={onDuplicateTask}>
            <CopyIcon />
            Duplicate task
            <RightSLot>Ctrl+Shift+V</RightSLot>
          </MenuItem>

          <MenuItem onSelect={onEdit}>
            <Pencil1Icon />
            Edit task
            <RightSLot>Enter</RightSLot>
          </MenuItem>

          <ContextMenu.Separator className="h-[1px] bg-gray-600 my-1" />

          <MenuItem>
            <TrashIcon />
            Delete
          </MenuItem>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

interface MenuItemProps {
  children?: React.ReactNode
  onSelect?: (event: Event) => void
}

const MotionContextMenuItem = motion(ContextMenu.Item)
const MenuItem = ({ children, onSelect }: MenuItemProps) => {
  const [hovering, setHovering] = React.useState(false)

  return (
    <MotionContextMenuItem
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
      className="flex items-center gap-2 px-3 cursor-pointer h-[30px] text-gray-200 todo-menu-item"
    >
      {children}
    </MotionContextMenuItem>
  )
}

const RightSLot = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="ml-auto text-[11px] leading-none text-gray-400 border border-gray-700 rounded-[4px] p-0.5">
      {children}
    </div>
  )
}
