import React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CopyIcon, PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { useTask } from './Todo'
import { Task } from './Todos'
import { useQueryClient } from '@tanstack/react-query'
import shallow from 'zustand/shallow'
import toast from 'react-hot-toast'
import { useCreateTaskMutation, useDeleteTaskMutation } from '@/queries/todo'

type MenuProps = {
  children: React.ReactNode
}

export const ContextMenu = ({ children }: MenuProps) => {
  const {
    id,
    value,
    status,
    setEdit,
    generateTaskWithPositionBelow,
    insertTaskBelow,
    duplicateTask,
  } = useTask(
    (state) => ({
      id: state.id,
      position: state.position,
      value: state.value,
      status: state.status,
      setEdit: state.setEdit,
      generateTaskWithPositionBelow: state.generateTaskWithPositionBelow,
      insertTaskBelow: state.insertTaskBelow,
      duplicateTask: state.duplicateTask,
    }),
    shallow
  )

  const queryClient = useQueryClient()
  const createTask = useCreateTaskMutation()
  const deleteTask = useDeleteTaskMutation()

  const onCopy = () => {
    window.navigator.clipboard.writeText(value)
    toast('Copy task')
  }

  const onEdit = () => {
    setTimeout(() => {
      setEdit(true)
    }, 1)
  }

  const onInsertTaskBelow = () => {
    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], insertTaskBelow)
    }, 1)
  }

  const onDuplicateTask = () => {
    const currentTasks = queryClient.getQueryData<Task[]>(['tasks'])
    if (!currentTasks) return

    const duplicatedTask = generateTaskWithPositionBelow(currentTasks)
    duplicatedTask.edit = false
    duplicatedTask.status = status
    duplicatedTask.content = value

    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], duplicateTask(duplicatedTask))
      createTask.mutate({ ...duplicatedTask, insertTaskBelow: false })
    }, 1)
  }

  const onDelete = () => {
    deleteTask.mutate(id, {
      onSuccess: () => {
        toast('Delete todo')
      },
    })
  }

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>{children}</ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Content className="min-w-[300px] w-full rounded-lg bg-gray-850 py-1 text-sm shadow-lg shadow-black/50 border border-gray-700">
        <MenuItem onSelect={onCopy}>
          <CopyIcon aria-hidden />
          Copy text
          <RightSLot>Ctrl+C</RightSLot>
        </MenuItem>

        <ContextMenuPrimitive.Separator className="h-[1px] bg-gray-700 my-1" />

        <MenuItem onSelect={onInsertTaskBelow}>
          <PlusIcon aria-hidden />
          Insert task below
          <RightSLot>Alt+Enter</RightSLot>
        </MenuItem>

        <MenuItem onSelect={onDuplicateTask}>
          <CopyIcon />
          Duplicate
          <RightSLot>Ctrl+D</RightSLot>
        </MenuItem>

        <MenuItem onSelect={onEdit}>
          <Pencil1Icon />
          Edit
          <RightSLot>Enter</RightSLot>
        </MenuItem>

        <ContextMenuPrimitive.Separator className="h-[1px] bg-gray-600 my-1" />

        <MenuItem onSelect={onDelete}>
          <TrashIcon />
          Delete
          <RightSLot>Delete</RightSLot>
        </MenuItem>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Root>
  )
}

type MenuItemProps = {
  children?: React.ReactNode
  onSelect?: (event: Event) => void
}

const MenuItem = ({ children, onSelect }: MenuItemProps) => {
  return (
    <ContextMenuPrimitive.Item
      onSelect={onSelect}
      className="flex items-center gap-2 px-3 cursor-pointer h-[30px] text-gray-200 focus:outline-none radix-highlighted:bg-gray-750"
    >
      {children}
    </ContextMenuPrimitive.Item>
  )
}

const RightSLot = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="ml-auto text-[11px] leading-none text-gray-400 border border-gray-700 rounded-[4px] p-0.5">
      {children}
    </div>
  )
}
