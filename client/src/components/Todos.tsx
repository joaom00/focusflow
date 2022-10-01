import React from 'react'
import { FiPlus, FiChevronDown, FiEdit2 } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Textarea from 'react-textarea-autosize'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ScrollArea } from './ScrollArea'
import { CheckIcon } from '../icons/CheckIcon'

interface TodoProps {
  edit: boolean
  value: string
  onBlurEmptyValue: () => void
  onBlur: (value: string) => void
  onSubmit: (value: string) => void
}

const MotionCheckboxRoot = motion(Checkbox.Root)

const CheckboxTodo = ({ id, edit }: { id: string; edit: boolean }) => {
  return (
    <MotionCheckboxRoot
      id={id}
      whileTap={{ scale: 0.8 }}
      className={`border-2 border-gray-500 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center radix-checked:bg-pink-500 radix-checked:border-transparent transition-colors ease-in-out duration-[250ms] ml-4 mt-3 ${
        edit ? 'z-40' : 'z-10'
      }`}
      style={{ gridColumn: '1/2', gridRow: '1/2' }}
    >
      <Checkbox.Indicator className="text-violet-500">
        <CheckIcon />
      </Checkbox.Indicator>
    </MotionCheckboxRoot>
  )
}

const Todo = (props: TodoProps) => {
  const id = React.useId()
  const [edit, setEdit] = React.useState(props.edit)
  const [value, setValue] = React.useState(props.value)
  const [hovering, setHovering] = React.useState(false)
  const prevValueRef = React.useRef(props.value)

  const onBlur = () => {
    if (!prevValueRef.current) return props.onBlurEmptyValue()
    if (!value && prevValueRef.current) {
      setValue(prevValueRef.current)
      setEdit(false)
      return
    }
    setEdit(false)
    prevValueRef.current = value
    props.onBlur(value)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (!value) return props.onBlurEmptyValue()
        prevValueRef.current = value
        props.onSubmit(value)
        break
      }
      case 'Backspace': {
        if (!value) {
          event.preventDefault()
          props.onBlurEmptyValue()
        }
        break
      }
      case 'Escape': {
        if (!prevValueRef.current) return props.onBlurEmptyValue()
        if (!value && prevValueRef.current) {
          setValue(prevValueRef.current)
          return
        }
        prevValueRef.current = value
        props.onBlur(value)
        setEdit(false)
        break
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
            transition: {
              duration: 0.18,
            },
          },
        }}
        className={`group hover:bg-gray-750 min-h-[36px] h-full grid relative ${
          edit ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        <CheckboxTodo id={id} edit={edit} />

        <div className="hidden absolute top-1/2 right-2 -translate-y-1/2 group-hover:flex">
          <button className="hover:bg-gray-800 p-1.5 rounded-md" onClick={() => setEdit(true)}>
            <FiEdit2 size={14} />
          </button>
        </div>

        {edit ? (
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
            className={`resize-none bg-gray-800 pl-10 pr-4 py-2 text-sm focus:outline-none border-t border-t-transparent focus:border-t-pink-500 absolute inset-x-0 shadow-lg shadow-[rgba(0,0,0,0.5)] rounded-md ${
              edit ? 'pointer-events-auto z-30' : ''
            }`}
            placeholder="Enter a name"
            minRows={1}
            style={{ gridColumn: '1/2', gridRow: '1/2' }}
          />
        ) : (
          <label
            htmlFor={id}
            className="self-baseline pl-10 pr-5 text-sm break-all mt-[9px]"
            style={{
              gridColumn: '1/2',
              gridRow: '1/2',
              display: '-webkit-box',
              ['WebkitLineClamp' as string]: '2',
              ['WebkitBoxOrient' as string]: 'vertical',
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
        className="text-sm flex items-center gap-2 rounded-lg text-gray-300 px-2 py-1 hover:bg-gray-750 transition-colors duration-200"
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
  status: 'todo' | 'in-progress' | 'done'
  edit: boolean
  content: string
}

export const Todos = () => {
  const [todos, setTodos] = React.useState<Todo[]>([])

  const onAddTodo = () => {
    setTodos((currentTodos) => [...currentTodos, { status: 'todo', edit: true, content: '' }])
  }

  const onSubmit = (value: string) => {
    const currentTodos = [...todos]
    const lastTodo = currentTodos.pop()
    if (lastTodo) {
      lastTodo.edit = false
      lastTodo.content = value
      const newTodo: Todo = { edit: true, status: 'todo', content: '' }
      setTodos([...currentTodos, lastTodo, newTodo])
    }
  }

  const onBlur = (value: string) => {
    setTodos((currentTodos) => [
      ...currentTodos.slice(0, -1),
      { edit: false, status: 'todo', content: value },
    ])
  }

  const onBlurEmptyValue = () => setTodos((currentTodos) => currentTodos.slice(0, -1))

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
          {todos.map((todo, i) => (
            <Todo
              key={i}
              edit={todo.edit}
              value={todo.content}
              onSubmit={onSubmit}
              onBlur={onBlur}
              onBlurEmptyValue={onBlurEmptyValue}
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
