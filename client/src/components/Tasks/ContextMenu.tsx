import React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CopyIcon, PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Task } from './Tasks'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useCreateTaskMutation, useDeleteTaskMutation } from '@/queries'
import { useTaskActions, useTaskStore } from '@/stores'
import shallow from 'zustand/shallow'
import { useNotification } from '../Notification'

type MenuProps = {
  children: React.ReactNode
}

export const ContextMenu = ({ children }: MenuProps) => {
  const queryClient = useQueryClient()
  const createTask = useCreateTaskMutation()
  const deleteTask = useDeleteTaskMutation()
  const task = useTaskStore(
    (state) => ({ id: state.id, value: state.value, status: state.status }),
    shallow
  )
  const actions = useTaskActions()
  const notification = useNotification()

  const handleCopyText = () => {
    window.navigator.clipboard.writeText(task.value)
    notification.success('Text copied!')
  }

  const handleEdit = () => {
    setTimeout(() => {
      actions.updateEdit(true)
    }, 1)
  }

  const handleInsertTaskBelow = () => {
    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], actions.insertTaskBelow)
    }, 1)
  }

  const handleDuplicateTask = () => {
    const currentTasks = queryClient.getQueryData<Task[]>(['tasks'])
    if (!currentTasks) return

    const duplicatedTask = actions.generateTaskWithPositionBelow(currentTasks)
    duplicatedTask.edit = false
    duplicatedTask.status = task.status
    duplicatedTask.content = task.value

    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], actions.duplicateTask(duplicatedTask))
      createTask.mutate({ ...duplicatedTask, insertTaskBelow: false })
    }, 1)
  }

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast('Delete todo')
      },
    })
  }

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
