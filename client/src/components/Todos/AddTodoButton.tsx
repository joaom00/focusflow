import React from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import type { Todo } from './Todos'
import cuid from 'cuid'

export const AddTodoButton = React.forwardRef<HTMLButtonElement>((_props, forwardedRef) => {
  const queryClient = useQueryClient()

  const onAddTodo = () => {
    const currentTodos = queryClient.getQueryData<Todo[]>(['todos'])
    const newTodo: Todo = {
      id: cuid(),
      status: 'TODO',
      edit: true,
      content: '',
      position: currentTodos ? currentTodos.length + 1 : 1,
    }
    queryClient.setQueryData<Todo[]>(['todos'], (currentTodos) =>
      currentTodos ? [...currentTodos, newTodo] : undefined
    )
  }
  return (
    <div className="border-t border-t-gray-700 w-full py-1 px-2">
      <button
        ref={forwardedRef}
        type="button"
        className="text-sm flex items-center gap-2 rounded-lg text-gray-300 px-2 py-1 duration-200 relative add-task-button hover:text-white group transition-colors"
        onClick={onAddTodo}
      >
        <div className="border-2 border-gray-400 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center group-hover:border-white transition-colors duration-200">
          <PlusIcon className="group-hover:text-white" />
        </div>
        New task
      </button>
    </div>
  )
})

AddTodoButton.displayName = 'AddTodoButton'
