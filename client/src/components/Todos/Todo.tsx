import React from 'react'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import Textarea from 'react-textarea-autosize'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { DotsHorizontalIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'

import { createTodoStore, type TodoStore } from '@/stores'
import { createStoreContext } from '@/lib/createContex'

import { CheckboxTodo } from './CheckboxTodo'
import { Menu } from './Menu'
import { type Todo as TTodo, useCreateTodoMutation, useUpdateTodoMutation } from './Todos'

// TODO: Controlar edit localmente pelo componente ou pelo cache do react query

export const [TodoProvider, useTodo] = createStoreContext<TodoStore>('TodoStore')

interface TodoProps {
  id: string
  value: string
  edit: boolean
  status: 'TODO' | 'DONE' | 'INPROGRESS'
  position: number
}

export const Todo = (props: TodoProps) => {
  return (
    <TodoProvider store={createTodoStore(props)}>
      <TodoImpl />
    </TodoProvider>
  )
}

const TodoImpl = () => {
  const queryClient = useQueryClient()

  const {
    id,
    value,
    setValue,
    onOpenMenuChange,
    edit,
    position,
    setEdit,
    insertTaskBelow,
    duplicateTask,
    removeTask,
  } = useTodo(
    (state) => ({
      id: state.id,
      value: state.value,
      setValue: state.setValue,
      onOpenMenuChange: state.setMenu,
      edit: state.edit,
      position: state.position,
      setEdit: state.setEdit,
      insertTaskBelow: state.insertTaskBelow,
      duplicateTask: state.duplicateTask,
      removeTask: state.removeTask,
    }),
    shallow
  )

  const createTodo = useCreateTodoMutation()
  const updateTodo = useUpdateTodoMutation()

  const checkboxId = React.useId()
  const [hovering, setHovering] = React.useState(false)
  const prevValueRef = React.useRef(value)
  const todoElRef = React.useRef<HTMLLIElement>(null)

  const onBlur = () => {
    if (!value && !prevValueRef.current) {
      return queryClient.setQueryData(['todos'], removeTask)
    }

    if (!value && prevValueRef.current) {
      setValue(prevValueRef.current)
      setEdit(false)
      return
    }

    setEdit(false)
    const isCreatingNewTodo = prevValueRef.current === ''
    if (isCreatingNewTodo) {
      createTodo.mutate({ id, content: value, position, shoudlInsertTaskBelow: false })
    }

    const hasValueChanged = prevValueRef.current !== value
    const isUpdatingTodo = !isCreatingNewTodo && hasValueChanged
    if (isUpdatingTodo) {
      updateTodo.mutate({ id, content: value, position })
    }

    prevValueRef.current = value
  }

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (!value) {
          return queryClient.setQueryData(['todos'], removeTask)
        }

        const isCreatingNewTodo = prevValueRef.current === ''
        if (isCreatingNewTodo) {
          createTodo.mutate({ id, content: value, position })
        }

        const hasValueChanged = prevValueRef.current !== value
        const isUpdatingTodo = !isCreatingNewTodo && hasValueChanged
        if (isUpdatingTodo) {
          updateTodo.mutate({ id, content: value, position, shouldInsertTaskBelow: true })
        }

        if (!isCreatingNewTodo && !hasValueChanged) {
          queryClient.setQueryData(['todos'], insertTaskBelow)
        }

        prevValueRef.current = value
        break
      }
      case 'Backspace': {
        if (!value) {
          event.preventDefault()
          queryClient.setQueryData(['todos'], removeTask)
        }
        break
      }
      case 'Escape': {
        if (!value && !prevValueRef.current) {
          return queryClient.setQueryData(['todos'], removeTask)
        }

        if (!value && prevValueRef.current) {
          setValue(prevValueRef.current)
          setEdit(false)
          return
        }

        setEdit(false)
        const isCreatingNewTodo = prevValueRef.current === ''
        if (isCreatingNewTodo) {
          createTodo.mutate({ id, content: value, shoudlInsertTaskBelow: false })
        }

        const hasValueChanged = prevValueRef.current !== value
        const isUpdatingTodo = !isCreatingNewTodo && hasValueChanged
        if (isUpdatingTodo) {
          updateTodo.mutate({ id, content: value, position })
        }

        prevValueRef.current = value
        break
      }
    }
  }

  const onTodoKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (event.altKey) {
          queryClient.setQueryData<TTodo[]>(['todos'], insertTaskBelow)
          break
        }
        setEdit(true)
        break
      }
      case 'd': {
        if (event.ctrlKey) {
          event.preventDefault()
          queryClient.setQueryData<TTodo[]>(['todos'], duplicateTask)
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
      ref={todoElRef}
      className="border-t border-t-gray-700 select-none focus:bg-gray-750"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{
        opacity: 0,
        height: 0,
        transition: { duration: 0.2 },
      }}
      onKeyDown={onTodoKeyDown}
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
