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
import { Menu } from './Menu'
import { type Task as TTask } from './Todos'
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/queries/todo'

export const [TaskProvider, useTask] = createStoreContext<TaskStore>('TaskStore')

interface TaskProps {
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

  const {
    id,
    value,
    status,
    setValue,
    onOpenMenuChange,
    edit,
    position,
    setEdit,
    generateTaskWithPositionBelow,
    insertTaskBelow,
    duplicateTask,
    removeTask,
  } = useTask(
    (state) => ({
      id: state.id,
      value: state.value,
      status: state.status,
      setValue: state.setValue,
      onOpenMenuChange: state.setMenu,
      edit: state.edit,
      position: state.position,
      setEdit: state.setEdit,
      generateTaskWithPositionBelow: state.generateTaskWithPositionBelow,
      insertTaskBelow: state.insertTaskBelow,
      duplicateTask: state.duplicateTask,
      removeTask: state.removeTask,
    }),
    shallow
  )

  const createTask = useCreateTaskMutation()
  const updateTask = useUpdateTaskMutation()

  const checkboxId = React.useId()
  const [hovering, setHovering] = React.useState(false)
  const prevValueRef = React.useRef(value)
  const taskElRef = React.useRef<HTMLLIElement>(null)

  const onBlur = () => {
    if (!value && !prevValueRef.current) {
      return queryClient.setQueryData(['tasks'], removeTask)
    }

    if (!value && prevValueRef.current) {
      setValue(prevValueRef.current)
      setEdit(false)
      return
    }

    setEdit(false)
    const isCreatingNewTask = prevValueRef.current === ''
    if (isCreatingNewTask) {
      createTask.mutate({ id, content: value, position, insertTaskBelow: false })
    }

    const hasValueChanged = prevValueRef.current !== value
    const isUpdatingTask = !isCreatingNewTask && hasValueChanged
    if (isUpdatingTask) {
      updateTask.mutate({ id, content: value })
    }

    prevValueRef.current = value
  }

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (!value) {
          return queryClient.setQueryData(['tasks'], removeTask)
        }

        const isCreatingNewTask = prevValueRef.current === ''
        if (isCreatingNewTask) {
          createTask.mutate({ id, content: value, position })
        }

        const hasValueChanged = prevValueRef.current !== value
        const isUpdatingTask = !isCreatingNewTask && hasValueChanged
        if (isUpdatingTask) {
          updateTask.mutate({ id, content: value,  insertTaskBelow: true })
        }

        if (!isCreatingNewTask && !hasValueChanged) {
          queryClient.setQueryData(['tasks'], insertTaskBelow)
        }

        prevValueRef.current = value
        break
      }
      case 'Backspace': {
        if (!value) {
          event.preventDefault()
          queryClient.setQueryData(['tasks'], removeTask)
        }
        break
      }
      case 'Escape': {
        if (!value && !prevValueRef.current) {
          return queryClient.setQueryData(['tasks'], removeTask)
        }

        if (!value && prevValueRef.current) {
          setValue(prevValueRef.current)
          setEdit(false)
          return
        }

        setEdit(false)
        const isCreatingNewTask = prevValueRef.current === ''
        if (isCreatingNewTask) {
          createTask.mutate({ id, content: value, position, insertTaskBelow: false })
        }

        const hasValueChanged = prevValueRef.current !== value
        const isUpdatingTask = !isCreatingNewTask && hasValueChanged
        if (isUpdatingTask) {
          updateTask.mutate({ id, content: value })
        }

        prevValueRef.current = value
        break
      }
    }
  }

  const onTaskKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (event.altKey) {
          queryClient.setQueryData<TTask[]>(['tasks'], insertTaskBelow)
          break
        }
        setEdit(true)
        break
      }
      case 'd': {
        if (event.ctrlKey) {
          event.preventDefault()
          const currentTasks = queryClient.getQueryData<TTask[]>(['tasks'])
          if (!currentTasks) return

          const duplicatedTask = generateTaskWithPositionBelow(currentTasks)
          duplicatedTask.edit = false
          duplicatedTask.status = status
          duplicatedTask.content = value
          queryClient.setQueryData<TTask[]>(['tasks'], duplicateTask(duplicatedTask))
          break
        }
        break
      }
      case 'c': {
        if (event.ctrlKey) {
          event.preventDefault()
          window.navigator.clipboard.writeText(value)
          toast('Copy task')
          break
        }
      }
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value)
  }

  return (
    <motion.li
      ref={taskElRef}
      className="border-t border-t-gray-700 select-none focus:bg-gray-750"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{
        opacity: 0,
        height: 0,
        transition: { duration: 0.2 },
      }}
      onKeyDown={onTaskKeyDown}
    >
      <Menu>
        <motion.div
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
          className={clsx(
            'group hover:bg-gray-750 min-h-[36px] h-full grid relative',
            edit ? 'pointer-events-none' : 'pointer-events-auto'
          )}
        >
          <CheckboxTodo id={checkboxId} />

          <div className="hidden absolute top-1/2 right-4 -translate-y-1/2 group-hover:flex">
            <button className="hover:bg-gray-800 p-1.5 rounded-md" onClick={() => setEdit(true)}>
              <Pencil1Icon />
            </button>
            <button
              className="hover:bg-gray-800 p-1.5 rounded-md"
              onClick={() => onOpenMenuChange(true)}
            >
              <DotsHorizontalIcon />
            </button>
          </div>

          {edit ? (
            <>
              <div className="fixed inset-0 z-30 pointer-events-auto" />
              <Textarea
                ref={(node) => {
                  if (node) {
                    const end = value.length
                    node.setSelectionRange(end, end)
                    node.focus()
                  }
                }}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
                onKeyDown={onInputKeyDown}
                className={clsx(
                  'resize-none bg-gray-800 pl-10 pr-4 py-2 text-sm focus:outline-none border-t border-t-transparent focus:border-t-pink-500 absolute inset-x-0 shadow-lg shadow-black/50 rounded-md',
                  edit && 'pointer-events-auto z-40'
                )}
                placeholder="Enter a name"
                minRows={1}
                style={{ gridColumn: '1/2', gridRow: '1/2' }}
              />
            </>
          ) : (
            <label
              htmlFor={checkboxId}
              className="self-baseline pl-10 pr-5 text-sm break-all mt-[9px] w-fit"
              style={{
                gridColumn: '1/2',
                gridRow: '1/2',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {value}
            </label>
          )}
        </motion.div>
      </Menu>
    </motion.li>
  )
}
