import React from 'react'
import cuid from 'cuid'
import { Section } from './Section'
import { Todo } from './Todo'
import { AddTodoButton } from './AddTodoButton'

interface Todo {
  id: string
  status: 'TODO' | 'DONE'
  edit: boolean
  content: string
}

export const Todos = () => {
  const [todos, setTodos] = React.useState<Todo[]>([])

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
    <div className="bg-gray-900/90 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto overflow-auto">
      <header className="border-b border-b-gray-700 w-full text-center py-4 px-3">
        <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">To-do list</p>
      </header>
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
    </div>
  )
}
