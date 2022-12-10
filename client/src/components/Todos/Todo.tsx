import React from 'react'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import Textarea from 'react-textarea-autosize'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { DotsHorizontalIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'

import { createTaskStore, type TaskStore } from '@/stores'
import { createStoreContext } from '@/lib/createContex'

import { CheckboxTodo } from './CheckboxTodo'
import { ContextMenu } from './ContextMenu'
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/queries/todo'
import { IconButton } from '../IconButton'
import { DropdownMenu } from './DropdownMenu'

import { type Task as TTask } from './Todos'

const [TaskProvider, useTaskStore] = createStoreContext<TaskStore>('TaskStore')
export const useTask = () =>
  useTaskStore(
    (state) => ({
      id: state.id,
      value: state.value,
      status: state.status,
      edit: state.edit,
      position: state.position,
    }),
    shallow
  )
export const useTaskActions = () => useTaskStore((state) => state.actions)

type TaskProps = {
  id: string
  value: string
  edit: boolean
  status: 'TODO' | 'DONE'
  position: string
}

export const Task = (props: TaskProps) => {
  return (
    <TaskProvider store={createTaskStore(props)}>
      <TaskImpl />
    </TaskProvider>
  )
}

const TaskImpl = () => {
  const queryClient = useQueryClient()

  const createTask = useCreateTaskMutation()
  const updateTask = useUpdateTaskMutation()

  const task = useTask()
  const actions = useTaskActions()

  const checkboxId = React.useId()
  const prevValueRef = React.useRef(task.value)
  const taskElRef = React.useRef<HTMLLIElement>(null)

  const isDone = task.status === 'DONE'

  const handleBlur = () => {
    if (!task.value && !prevValueRef.current) {
      return queryClient.setQueryData(['tasks'], actions.removeTask)
    }

    if (!task.value && prevValueRef.current) {
      actions.updateValue(prevValueRef.current)
      actions.updateEdit(false)
      return
    }

    actions.updateEdit(false)
    const isCreatingNewTask = prevValueRef.current === ''
    if (isCreatingNewTask) {
      createTask.mutate({
        id: task.id,
        content: task.value,
        position: task.position,
        insertTaskBelow: false,
      })
    }

    const hasValueChanged = prevValueRef.current !== task.value
    const isUpdatingTask = !isCreatingNewTask && hasValueChanged
    if (isUpdatingTask) {
      updateTask.mutate({ id: task.id, content: task.value })
    }

    prevValueRef.current = task.value
  }

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (!task.value) {
          return queryClient.setQueryData(['tasks'], actions.removeTask)
        }

        const isCreatingNewTask = prevValueRef.current === ''
        if (isCreatingNewTask) {
          createTask.mutate({ id: task.id, content: task.value, position: task.position })
        }

        const hasValueChanged = prevValueRef.current !== task.value
        const isUpdatingTask = !isCreatingNewTask && hasValueChanged
        if (isUpdatingTask) {
          updateTask.mutate({ id: task.id, content: task.value, insertTaskBelow: true })
        }

        if (!isCreatingNewTask && !hasValueChanged) {
          queryClient.setQueryData(['tasks'], actions.insertTaskBelow)
        }

        prevValueRef.current = task.value
        break
      }
      case 'Backspace': {
        if (!task.value) {
          event.preventDefault()
          queryClient.setQueryData(['tasks'], actions.removeTask)
        }
        break
      }
      case 'Escape': {
        if (!task.value && !prevValueRef.current) {
          return queryClient.setQueryData(['tasks'], actions.removeTask)
        }

        if (!task.value && prevValueRef.current) {
          actions.updateValue(prevValueRef.current)
          actions.updateEdit(false)
          return
        }

        actions.updateEdit(false)
        const isCreatingNewTask = prevValueRef.current === ''
        if (isCreatingNewTask) {
          createTask.mutate({
            id: task.id,
            content: task.value,
            position: task.position,
            insertTaskBelow: false,
          })
        }

        const hasValueChanged = prevValueRef.current !== task.value
        const isUpdatingTask = !isCreatingNewTask && hasValueChanged
        if (isUpdatingTask) {
          updateTask.mutate({ id: task.id, content: task.value })
        }

        prevValueRef.current = task.value
        break
      }
    }
  }

  const handleTaskKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (event.altKey) {
          queryClient.setQueryData<TTask[]>(['tasks'], actions.insertTaskBelow)
          break
        }
        actions.updateEdit(true)
        break
      }
      case 'd': {
        if (event.ctrlKey) {
          event.preventDefault()
          const currentTasks = queryClient.getQueryData<TTask[]>(['tasks'])
          if (!currentTasks) return

          const duplicatedTask = actions.generateTaskWithPositionBelow(currentTasks)
          duplicatedTask.edit = false
          duplicatedTask.status = task.status
          duplicatedTask.content = task.value
          queryClient.setQueryData<TTask[]>(['tasks'], actions.duplicateTask(duplicatedTask))
          break
        }
        break
      }
      case 'c': {
        if (event.ctrlKey) {
          event.preventDefault()
          window.navigator.clipboard.writeText(task.value)
          toast('Copy task')
          break
        }
      }
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    actions.updateValue(event.currentTarget.value)
  }

  return (
    <motion.li
      ref={taskElRef}
      className="border-t border-t-gray-700 focus:bg-gray-750"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{
        opacity: 0,
        height: 0,
        transition: { duration: 0.2 },
      }}
      onKeyDown={handleTaskKeyDown}
    >
      <ContextMenu>
        <motion.div className="group hover:bg-gray-750 min-h-[36px] h-full grid relative data-[state=open]:bg-gray-750">
          <CheckboxTodo id={checkboxId} />

          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex gap-1">
            <IconButton
              aria-label="Edit task"
              size="small"
              className="hover:bg-gray-800 hidden group-hover:flex"
              onClick={() => actions.updateEdit(true)}
            >
              <Pencil1Icon aria-hidden />
            </IconButton>

            <DropdownMenu>
              <IconButton
                aria-label="Open task options"
                size="small"
                className="hover:bg-gray-800 group-hover:flex data-[state=closed]:hidden data-[state=open]:bg-gray-800"
              >
                <DotsHorizontalIcon aria-hidden />
              </IconButton>
            </DropdownMenu>
          </div>

          {task.edit ? (
            <>
              <div className="fixed inset-0 z-30 pointer-events-auto" />

              <Textarea
                ref={(node) => {
                  if (node) {
                    const end = task.value.length
                    node.setSelectionRange(end, end)
                    node.focus()
                  }
                }}
                onBlur={handleBlur}
                value={task.value}
                onChange={handleChange}
                onKeyDown={handleInputKeyDown}
                className={clsx(
                  'resize-none bg-gray-800 pl-10 pr-4 py-2 text-sm focus:outline-none border-t border-t-transparent focus:border-t-pink-500 absolute inset-x-0 shadow-lg shadow-black/50 rounded-md',
                  task.edit && 'pointer-events-auto z-40'
                )}
                placeholder="Enter a name"
                minRows={1}
                style={{ gridColumn: '1/2', gridRow: '1/2' }}
              />
            </>
          ) : (
            <label
              htmlFor={checkboxId}
              className={clsx(
                'self-baseline pl-10 pr-5 text-sm break-all mt-[9px] w-fit',
                isDone && 'line-through decoration-pink-500 decoration-2 text-white/50'
              )}
              onMouseDown={(event) => {
                if (event.detail > 1) event.preventDefault()
              }}
              style={{
                gridColumn: '1/2',
                gridRow: '1/2',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {task.value}
            </label>
          )}
        </motion.div>
      </ContextMenu>
    </motion.li>
  )
}
