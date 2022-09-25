import React from 'react'
import { FiPlus, FiChevronDown } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Collapsible from '@radix-ui/react-collapsible'

const CheckIcon = () => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#fff"
      strokeWidth={3}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

interface TodoProps {
  edit: boolean
  onSubmit: (value: string) => void
  value: string
}

const Todo = React.forwardRef<HTMLLIElement, TodoProps>((props, forwardedRef) => {
  const id = React.useId()
  const [edit, setEdit] = React.useState(props.edit)
  const [value, setValue] = React.useState(props.value)

  return (
    <motion.li ref={forwardedRef} className="border-t border-t-gray-700 group">
      <div className="group-hover:bg-gray-700">
        <label
          htmlFor={id}
          className="flex items-center gap-2 py-2 px-4 text-sm cursor-pointer w-max"
        >
          <MotionCheckboxRoot
            whileTap={{ scale: 0.8 }}
            id={id}
            className="border-2 border-gray-500 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center radix-checked:bg-pink-500 radix-checked:border-transparent transition-colors ease-in-out duration-[250ms]"
          >
            <Checkbox.Indicator className="text-violet-500">
              <CheckIcon />
            </Checkbox.Indicator>
          </MotionCheckboxRoot>
          {edit ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setEdit(false)
                if (value) {
                  props.onSubmit(value)
                }
              }}
            >
              <input
                type="text"
                placeholder="Enter a name"
                className="bg-transparent outline-none"
                value={value}
                autoFocus
                onBlur={() => {
                  setEdit(false)
                  if (value) {
                    props.onSubmit(value)
                  }
                }}
                onChange={(event) => setValue(event.currentTarget.value)}
              />
            </form>
          ) : (
            <>{value}</>
          )}
        </label>
      </div>
    </motion.li>
  )
})

Todo.displayName = 'Todo'

interface Todo {
  status: 'todo' | 'in-progress' | 'done'
  edit: boolean
  content: string
}

const MotionTodo = motion(Todo)

export const Todos = () => {
  const [todos, setTodos] = React.useState<Todo[]>([])

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
      <div className="overflow-auto">
        <Section name="To do">
          <AnimatePresence initial={false}>
            {todos.map((todo, i) => (
              <MotionTodo
                key={i}
                edit={todo.edit}
                value={todo.content}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={(value) =>
                  setTodos((currentTodos) =>
                    currentTodos.map((todo, index) =>
                      index === i ? { ...todo, edit: false, value } : todo
                    )
                  )
                }
              />
            ))}

            <div className="border-t border-t-gray-700 w-full px-4 py-2">
              <button
                type="button"
                className="text-sm flex items-center gap-2 rounded-lg text-gray-300"
                onClick={() =>
                  setTodos((currentTodos) => [
                    ...currentTodos,
                    { status: 'todo', edit: true, content: '' },
                  ])
                }
              >
                <div className="border-2 border-gray-300 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center">
                  <FiPlus className="text-gray-300" />
                </div>
                New task
              </button>
            </div>
          </AnimatePresence>
        </Section>
      </div>
    </div>
  )
}

interface SectionProps {
  name: string
  children?: React.ReactNode
}

const Section = ({ name, children }: SectionProps) => {
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
        <ul className="">{children}</ul>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

const MotionCheckboxRoot = motion(Checkbox.Root)
