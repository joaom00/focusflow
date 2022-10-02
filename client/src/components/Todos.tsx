import React from 'react'
import cuid from 'cuid'
import { clsx } from 'clsx'
import { FiPlus, FiChevronDown, FiEdit2 } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Textarea from 'react-textarea-autosize'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ScrollArea } from './ScrollArea'
import { CheckIcon } from '../icons/CheckIcon'

const MotionCheckboxRoot = motion(Checkbox.Root)

const CheckboxTodo = ({
  id,
  edit,
  onClick,
}: {
  id: string
  edit: boolean
  onClick?: () => void
}) => {
  return (
    <MotionCheckboxRoot
      id={id}
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      className={clsx(
        'border-2 border-gray-500 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center radix-checked:bg-pink-500 radix-checked:border-transparent transition-colors ease-in-out duration-[250ms] ml-4 mt-3',
        edit ? 'z-40' : 'z-10'
      )}
      style={{ gridColumn: '1/2', gridRow: '1/2' }}
    >
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </MotionCheckboxRoot>
  )
}

interface TodoProps {
  id: string
  value: string
  edit: boolean
  onBlurEmptyValue: (id: string) => void
  onBlur: ({ id, value }: { id: string; value: string }) => void
  onSubmit: ({ id, value }: { id: string; value: string }) => void
  onDone?: () => void
}

const Todo = (props: TodoProps) => {
  const {
    edit: editProp,
    onBlurEmptyValue,
    onBlur: onBlurProp,
    onSubmit,
    onDone,
    ...todoProps
  } = props
  const id = React.useId()
  const [edit, setEdit] = React.useState(editProp)
  const [value, setValue] = React.useState(todoProps.value)
  const [hovering, setHovering] = React.useState(false)
  const prevValueRef = React.useRef(todoProps.value)

  const onBlur = () => {
    if (!value && !prevValueRef.current) return onBlurEmptyValue(todoProps.id)
    if (!value && prevValueRef.current) {
      setValue(prevValueRef.current)
      setEdit(false)
      return
    }
    prevValueRef.current = value
    setEdit(false)
    onBlurProp({ id: todoProps.id, value })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (!value) return onBlurEmptyValue(todoProps.id)
        prevValueRef.current = value
        onSubmit({ id: todoProps.id, value })
        break
      }
      case 'Backspace': {
        if (!value) {
          event.preventDefault()
          props.onBlurEmptyValue(todoProps.id)
        }
        break
      }
      case 'Escape': {
        if (!value && !prevValueRef.current) return onBlurEmptyValue(todoProps.id)
        if (!value && prevValueRef.current) {
          setValue(prevValueRef.current)
          setEdit(false)
          return
        }
        prevValueRef.current = value
        onBlurProp({ id: todoProps.id, value })
        setEdit(false)
        break
      }
    }
  }

  const onTodoKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        setEdit(true)
      }
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value)
  }

  return (
    <motion.li
      className="border-t border-t-gray-700"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      tabIndex={-1}
      onKeyDown={onTodoKeyDown}
    >
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
        <CheckboxTodo id={id} edit={edit} onClick={onDone} />

        <div className="hidden absolute top-1/2 right-2 -translate-y-1/2 group-hover:flex">
          <button className="hover:bg-gray-800 p-1.5 rounded-md" onClick={() => setEdit(true)}>
            <FiEdit2 size={14} />
          </button>
        </div>

        {edit ? (
          <Textarea
            ref={(node) => {
              if (node) {
                const end = value.trim().length
                node.setSelectionRange(end, end)
                node.focus()
              }
            }}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={clsx(
              'resize-none bg-gray-800 pl-10 pr-4 py-2 text-sm focus:outline-none border-t border-t-transparent focus:border-t-pink-500 absolute inset-x-0 shadow-lg shadow-[rgba(0,0,0,0.5)] rounded-md',
              edit && 'pointer-events-auto z-30'
            )}
            placeholder="Enter a name"
            minRows={1}
            style={{ gridColumn: '1/2', gridRow: '1/2' }}
          />
        ) : (
          <label
            htmlFor={id}
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
    </motion.li>
  )
}

const AddTodoButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="border-t border-t-gray-700 w-full py-1 px-2">
      <button
        type="button"
        className="text-sm flex items-center gap-2 rounded-lg text-gray-300 px-2 py-1 duration-200 relative add-task-button"
        onClick={onClick}
      >
        <div className="border-2 border-gray-300 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center">
          <FiPlus className="text-gray-300" />
        </div>
        New task
      </button>
    </div>
  )
}

interface Todo {
  id: string
  status: 'TODO' | 'DONE'
  edit: boolean
  content: string
}

export const Todos = () => {
  const [todos, setTodos] = React.useState<Todo[]>([])
  console.log({ todos })

  const onAddTodo = () => {
    setTodos((currentTodos) => [
      ...currentTodos,
      { id: cuid(), status: 'TODO', edit: true, content: '' },
    ])
  }

  const onSubmit = ({ id, value }: { id: string; value: string }) => {
    const currentTodos = [...todos]
    const currentFocusedTodo = currentTodos.find((todo) => todo.id === id)
    const currentFocusedTodoIndex = currentTodos.findIndex((todo) => todo.id === id)
    if (currentFocusedTodo) {
      currentFocusedTodo.edit = false
      currentFocusedTodo.content = value
      const newTodo: Todo = { id: cuid(), edit: true, status: 'TODO', content: '' }
      setTodos([
        ...currentTodos.slice(0, currentFocusedTodoIndex),
        currentFocusedTodo,
        newTodo,
        ...currentTodos.slice(currentFocusedTodoIndex + 1),
      ])
    }
  }

  const onBlur = ({ id, value }: { id: string; value: string }) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, edit: false, content: value } : todo))
    )
  }

  const onBlurEmptyValue = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  const onDone = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, status: todo.status === 'TODO' ? 'DONE' : 'TODO' } : todo
      )
    )
  }

  React.useEffect(() => {
    async function getTodos() {
      const response = await fetch('http://localhost:3333/todos')
      const todos = await response.json()
      setTodos(todos)
    }
    getTodos()
  }, [])

  return (
    <div className="bg-gray-900/90 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto">
      <header className="border-b border-b-gray-700 w-full text-center py-4 px-3">
        <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">To-do list</p>
      </header>
      <ScrollArea>
        <Section name="To do">
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              edit={todo.edit}
              id={todo.id}
              value={todo.content}
              onSubmit={onSubmit}
              onBlur={onBlur}
              onBlurEmptyValue={onBlurEmptyValue}
              onDone={() => onDone(todo.id)}
            />
          ))}

          <AddTodoButton onClick={onAddTodo} />
        </Section>
      </ScrollArea>
    </div>
  )
}

interface SectionProps {
  name: string
  children?: React.ReactNode
}

const Section = React.forwardRef<HTMLUListElement, SectionProps>(
  ({ name, children }, forwardedRef) => {
    const [open, setOpen] = React.useState(true)

    return (
      <Collapsible.Root className="" open={open} onOpenChange={setOpen}>
        <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-transparent">
          <p className="text-sm font-medium">{name}</p>
          <Collapsible.Trigger asChild>
            <motion.button
              initial={false}
              animate={open ? 'open' : 'closed'}
              variants={{ open: { rotateX: '180deg' }, closed: { rotateX: '0deg' } }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
            >
              <FiChevronDown />
            </motion.button>
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content>
          <ul ref={forwardedRef}>{children}</ul>
        </Collapsible.Content>
      </Collapsible.Root>
    )
  }
)
Section.displayName = 'Section'
