import React from 'react'
import { useCreateTaskMutation, useDeleteTaskMutation } from '@/queries'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { CopyIcon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import type { Task } from './Tasks'
import { useTaskStore, useTaskActions } from '@/stores'
import shallow from 'zustand/shallow'

type DropdownProps = Dropdown.DropdownMenuProps

export const DropdownMenu = ({ children, ...props }: DropdownProps) => {
  const queryClient = useQueryClient()
  const createTask = useCreateTaskMutation()
  const deleteTask = useDeleteTaskMutation()

  const task = useTaskStore(
    (state) => ({ id: state.id, value: state.value, status: state.status }),
    shallow
  )
  const taskActions = useTaskActions()

  const handleCopyText = () => {
    window.navigator.clipboard.writeText(task.value)
    toast('Copy task')
  }

  const handleEdit = () => {
    setTimeout(() => {
      taskActions.updateEdit(true)
    }, 1)
  }

  const handleInsertTaskBelow = () => {
    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], taskActions.insertTaskBelow)
    }, 1)
  }

  const handleDuplicateTask = () => {
    const currentTasks = queryClient.getQueryData<Task[]>(['tasks'])
    if (!currentTasks) return

    const duplicatedTask = taskActions.generateTaskWithPositionBelow(currentTasks)
    duplicatedTask.edit = false
    duplicatedTask.status = task.status
    duplicatedTask.content = task.value

    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], taskActions.duplicateTask(duplicatedTask))
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
    <Dropdown.Root {...props}>
      <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
      <Dropdown.Portal container={document.getElementById('task-sidebar')}>
        <div className="absolute inset-0 pointer-events-none z-50">
          <Dropdown.Content
            align="start"
            className="min-w-[300px] w-full rounded-lg bg-gray-850 py-1 text-sm shadow-lg shadow-black/50 border border-gray-700 relative pointer-events-auto z-50"
          >
            <DropdownItem onSelect={handleCopyText}>
              <CopyIcon aria-hidden />
              Copy text
              <RightSLot>Ctrl+C</RightSLot>
            </DropdownItem>

            <DropdownSeparator />

            <DropdownItem onSelect={handleInsertTaskBelow}>
              <PlusIcon aria-hidden />
              Insert task below
              <RightSLot>Alt+Enter</RightSLot>
            </DropdownItem>

            <DropdownItem onSelect={handleDuplicateTask}>
              <CopyIcon aria-hidden />
              Duplicate
              <RightSLot>Ctrl+D</RightSLot>
            </DropdownItem>

            <DropdownItem onSelect={handleEdit}>
              <Pencil1Icon aria-hidden />
              Edit
              <RightSLot>Enter</RightSLot>
            </DropdownItem>

            <DropdownSeparator />

            <DropdownItem onSelect={handleDelete}>
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

const DropdownSeparator = () => {
  return <Dropdown.Separator className="h-[1px] bg-gray-700 my-1" />
}

const RightSLot = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="ml-auto text-[11px] leading-none text-gray-400 border border-gray-700 rounded-[4px] p-0.5">
      {children}
    </div>
  )
}
