import cuid from 'cuid'
import { Section } from './Section'
import { Todo } from './Todo'
import { AddTodoButton } from './AddTodoButton'
import { GearIcon, SpeakerLoudIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Todo {
  id: string
  status: 'TODO' | 'DONE'
  edit: boolean
  content: string
}

export const Todos = () => {
  const queryClient = useQueryClient()
  const todosQuery = useQuery<Todo[]>(['todos'], async () => {
    const response = await fetch('http://localhost:3333/todos')
    const todos = await response.json()
    return todos
  })
  const addTodo = useMutation(
    async ({ content }: { id: string; content: string }) => {
      await fetch('http://localhost:3333/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
    },
    {
      onMutate: async ({ id, content }) => {
        await queryClient.cancelQueries(['todos'])
        const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

        queryClient.setQueryData<Todo[]>(['todos'], (currentTodos) => {
          if (currentTodos) {
            const currentFocusedTodo = currentTodos.find((todo) => todo.id === id)
            const currentFocusedTodoIndex = currentTodos.findIndex((todo) => todo.id === id)
            if (currentFocusedTodo) {
              currentFocusedTodo.edit = false
              currentFocusedTodo.content = content
              const newTodo: Todo = { id: cuid(), edit: true, status: 'TODO', content: '' }
              return [
                ...currentTodos.slice(0, currentFocusedTodoIndex),
                currentFocusedTodo,
                newTodo,
                ...currentTodos.slice(currentFocusedTodoIndex + 1),
              ]
            }
          }
          return undefined
        })

        return { previousTodos }
      },
      onError: (_err, _id, context) => {
        queryClient.setQueryData(['todos'], context?.previousTodos)
      },
    }
  )

  const onAddTodo = () => {
    const newTodo: Todo = { id: cuid(), status: 'TODO', edit: true, content: '' }
    queryClient.setQueryData<Todo[]>(['todos'], (currentTodos) =>
      currentTodos ? [...currentTodos, newTodo] : undefined
    )
  }

  const onSubmit = ({ id, value }: { id: string; value: string }) => {
    addTodo.mutate({ id, content: value })
  }

  const onBlur = ({ id, value }: { id: string; value: string }) => {
    queryClient.setQueryData<Todo[]>(['todos'], (currentTodos) => {
      return currentTodos
        ? currentTodos.map((todo) =>
            todo.id === id ? { ...todo, edit: false, content: value } : todo
          )
        : undefined
    })
    // TODO: trigger a mutation to add task in DB
    // TODO: invalidate todos' query
  }

  const onBlurEmptyValue = (id: string) => {
    queryClient.setQueryData<Todo[]>(['todos'], (currentTodos) =>
      currentTodos ? [...currentTodos.filter((todo) => todo.id !== id)] : undefined
    )
  }

  const onDone = (id: string) => {
    queryClient.setQueryData<Todo[]>(['todos'], (currentTodos) =>
      currentTodos
        ? currentTodos.map((todo) =>
            todo.id === id ? { ...todo, status: todo.status === 'TODO' ? 'DONE' : 'TODO' } : todo
          )
        : undefined
    )
  }

  return (
    <div className="bg-gray-900 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto overflow-auto">
      <header className="border-b border-b-gray-700 w-full text-center py-4 px-3 flex items-center justify-between">
        <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">To-do list</p>
        <div className="flex items-center gap-0.5">
          <button className="p-2 rounded-md hover:bg-gray-750">
            <GearIcon />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-750">
            <SpeakerLoudIcon />
          </button>
        </div>
      </header>
      <Section name="To do">
        {todosQuery.data?.map((todo) => (
          <Todo
            key={todo.id}
            edit={todo.edit ?? false}
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
    </div>
  )
}
