import React from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Pencil1Icon } from '@radix-ui/react-icons'
import Textarea from 'react-textarea-autosize'
import { CheckboxTodo } from './CheckboxTodo'
import { Menu } from './Menu'
import { createStoreContext } from '../../lib/createContex'
import { createStore as createStoreZT } from 'zustand'
import shallow from 'zustand/shallow'
import type { Todo as TTodo } from './Todos'
import cuid from 'cuid'
import { useQueryClient } from '@tanstack/react-query'

interface TodoStore {
  id: string
  value: string
  menuOpen: boolean
  edit: boolean
  setValue: (value: string) => void
  setEdit: (edit: boolean) => void
  setMenu: (open: boolean) => void
  insertTaskBelow: (id: string) => (todos: TTodo[] | undefined) => TTodo[] | undefined
  duplicateTask: (
    id: string,
    content: string
  ) => (todos: TTodo[] | undefined) => TTodo[] | undefined
}

export const [TodoProvider, useTodo] = createStoreContext<TodoStore>('TodoStore')

function createStore(store: Pick<TodoStore, 'id' | 'edit' | 'value'>) {
  return createStoreZT<TodoStore>()((set) => ({
    ...store,
    menuOpen: false,
    setValue: (value) => set((state) => ({ ...state, value })),
    setEdit: (edit) => set((state) => ({ ...state, edit })),
    setMenu: (menuOpen) => set((state) => ({ ...state, menuOpen })),
    insertTaskBelow: (id) => (currentTodos) => {
      if (currentTodos) {
        const currentTodoIndex = currentTodos.findIndex((todo) => todo.id === id)
        const newTodo: TTodo = { id: cuid(), edit: true, status: 'TODO', content: '' }
        return [
          ...currentTodos.slice(0, currentTodoIndex + 1),
          newTodo,
          ...currentTodos.slice(currentTodoIndex + 1),
        ]
      }
      return undefined
    },
    duplicateTask: (id, content) => (currentTodos) => {
      if (currentTodos) {
        const currentTodoIndex = currentTodos.findIndex((todo) => todo.id === id)
        const newTodo: TTodo = { id: cuid(), edit: false, status: 'TODO', content }
        return [
          ...currentTodos.slice(0, currentTodoIndex + 1),
          newTodo,
          ...currentTodos.slice(currentTodoIndex + 1),
        ]
      }
      return undefined
    },
  }))
}

interface TodoProps {
  id: string
  value: string
  edit: boolean
  onBlurEmptyValue: (id: string) => void
  onBlur: ({ id, value }: { id: string; value: string }) => void
  onSubmit: ({ id, value }: { id: string; value: string }) => void
  onDone?: () => void
  onDelete?: () => void
}

export const Todo = (props: TodoProps) => {
  const { id, edit, value, ...handlers } = props
  return (
    <TodoProvider store={createStore({ id, edit, value })}>
      <TodoImpl {...handlers} />
    </TodoProvider>
  )
}

const TodoImpl = (props: Omit<TodoProps, 'id' | 'value' | 'edit'>) => {
  const { onBlurEmptyValue, onBlur: onBlurProp, onSubmit, onDone } = props

  const queryClient = useQueryClient()

  const { id, value, setValue, edit, setEdit, insertTaskBelow, duplicateTask } = useTodo(
    (state) => ({
      id: state.id,
      value: state.value,
      setValue: state.setValue,
      edit: state.edit,
      setEdit: state.setEdit,
      insertTaskBelow: state.insertTaskBelow,
      duplicateTask: state.duplicateTask,
    }),
    shallow
  )

  const checkboxId = React.useId()
  const [hovering, setHovering] = React.useState(false)
  const prevValueRef = React.useRef(value)
  const todoElRef = React.useRef<HTMLLIElement>(null)

  const onBlur = () => {
    if (!value && !prevValueRef.current) return onBlurEmptyValue(id)
    if (!value && prevValueRef.current) {
      setValue(prevValueRef.current)
      setEdit(false)
      return
    }
    prevValueRef.current = value
    setEdit(false)
    onBlurProp({ id, value })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (!value) return onBlurEmptyValue(id)
        prevValueRef.current = value
        onSubmit({ id, value })
        break
      }
      case 'Backspace': {
        if (!value) {
          event.preventDefault()
          props.onBlurEmptyValue(id)
        }
        break
      }
      case 'Escape': {
        if (!value && !prevValueRef.current) return onBlurEmptyValue(id)
        if (!value && prevValueRef.current) {
          setValue(prevValueRef.current)
          setEdit(false)
          return
        }
        prevValueRef.current = value
        onBlurProp({ id, value })
        setEdit(false)
        break
      }
    }
  }

  const onTodoKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (event.altKey) {
          queryClient.setQueryData<TTodo[]>(['todos'], insertTaskBelow(id))
          break
        }
        setEdit(true)
        break
      }
      case 'V': {
        event.preventDefault()
        if (event.ctrlKey && event.shiftKey) {
          queryClient.setQueryData<TTodo[]>(['todos'], duplicateTask(id, value))
          break
        }
        break
      }
      case 'c': {
        event.preventDefault()
        if (event.ctrlKey) {
          window.navigator.clipboard.writeText(value)
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
      className="border-t border-t-gray-700 select-none"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{
        opacity: 0,
        height: 0,
        transition: { duration: 0.2 },
      }}
      tabIndex={-1}
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
          <CheckboxTodo id={checkboxId} edit={edit} onClick={onDone} />

          <div className="hidden absolute top-1/2 right-2 -translate-y-1/2 group-hover:flex">
            <button className="hover:bg-gray-800 p-1.5 rounded-md" onClick={() => setEdit(true)}>
              <Pencil1Icon />
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
                onKeyDown={onKeyDown}
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
