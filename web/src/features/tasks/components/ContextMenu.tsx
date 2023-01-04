import React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CopyIcon, PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import {
  useHandleCopyText,
  useHandleEdit,
  useHandleInsertTaskBelow,
  useHandleDuplicateTask,
  useHandleDelete,
} from '../hooks'

type MenuProps = {
  children: React.ReactNode
}

export const ContextMenu = ({ children }: MenuProps) => {
  const handleCopyText = useHandleCopyText()
  const handleEdit = useHandleEdit()
  const handleInsertTaskBelow = useHandleInsertTaskBelow()
  const handleDuplicateTask = useHandleDuplicateTask()
  const handleDelete = useHandleDelete()

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>{children}</ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Content className="min-w-[300px] w-full rounded-lg bg-gray-850 py-1 text-sm shadow-lg shadow-black/50 border border-gray-700 z-50">
        <ContextMenuItem onSelect={handleCopyText}>
          <CopyIcon aria-hidden />
          Copy text
          <RightSLot>Ctrl+C</RightSLot>
        </ContextMenuItem>

        <ContextSeparator />

        <ContextMenuItem onSelect={handleInsertTaskBelow}>
          <PlusIcon aria-hidden />
          Insert task below
          <RightSLot>Alt+Enter</RightSLot>
        </ContextMenuItem>

        <ContextMenuItem onSelect={handleDuplicateTask}>
          <CopyIcon />
          Duplicate
          <RightSLot>Ctrl+D</RightSLot>
        </ContextMenuItem>

        <ContextMenuItem onSelect={handleEdit}>
          <Pencil1Icon />
          Edit
          <RightSLot>Enter</RightSLot>
        </ContextMenuItem>

        <ContextSeparator />

        <ContextMenuItem onSelect={handleDelete}>
          <TrashIcon />
          Delete
          <RightSLot>Delete</RightSLot>
        </ContextMenuItem>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Root>
  )
}

type MenuItemProps = {
  children?: React.ReactNode
  onSelect?: (event: Event) => void
}

const ContextMenuItem = ({ children, onSelect }: MenuItemProps) => {
  return (
    <ContextMenuPrimitive.Item
      onSelect={onSelect}
      className="flex items-center gap-2 px-3 cursor-pointer h-[30px] text-gray-200 focus:outline-none radix-highlighted:bg-gray-750"
    >
      {children}
    </ContextMenuPrimitive.Item>
  )
}

const ContextSeparator = () => {
  return <ContextMenuPrimitive.Separator className="h-[1px] bg-gray-600 my-1" />
}

const RightSLot = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="ml-auto text-[11px] leading-none text-gray-400 border border-gray-700 rounded-[4px] p-0.5">
      {children}
    </div>
  )
}
