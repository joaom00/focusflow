import cuid from 'cuid'
import { Section } from './Section'
import { Todo } from './Todo'
import { GearIcon, SpeakerLoudIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ScrollArea } from '../ScrollArea'
import React from 'react'

export interface Todo {
  id: string
  status: 'TODO' | 'DONE'
  edit: boolean
  content: string
  position: number
}

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      content,
      position,
    }: {
      id: string
      content: string
      position?: number
      shoudlInsertTaskBelow?: boolean
    }) => {
      await fetch('http://localhost:3333/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, position }),
      })
    },
    {
      onMutate: async ({ id, content, shoudlInsertTaskBelow = true }) => {
        await queryClient.cancelQueries(['todos'])
        const previousTasks = queryClient.getQueryData<Todo[]>(['todos'])

        queryClient.setQueryData<Todo[]>(['todos'], (currentTasks) => {
          if (currentTasks) {
            const currentFocusedTask = currentTasks.find((task) => task.id === id)
            const currentFocusedTaskIndex = currentTasks.findIndex((task) => task.id === id)
            if (currentFocusedTask) {
              currentFocusedTask.content = content
              currentFocusedTask.edit = false
              if (shoudlInsertTaskBelow) {
                const nextPosition = currentFocusedTask.position + 1
                const newTask: Todo = {
                  id: cuid(),
                  edit: true,
                  status: 'TODO',
                  content: '',
                  position: nextPosition,
                }
                const updatedTasksPosition = currentTasks.map((task) => {
                  if (task.position >= nextPosition) {
                    return { ...task, position: task.position + 1 }
                  }
                  return task
                })
                return [
                  ...updatedTasksPosition.slice(0, currentFocusedTaskIndex),
                  currentFocusedTask,
                  newTask,
                  ...updatedTasksPosition.slice(currentFocusedTaskIndex + 1),
                ]
              }

              return [
                ...currentTasks.slice(0, currentFocusedTaskIndex),
                currentFocusedTask,
                ...currentTasks.slice(currentFocusedTaskIndex + 1),
              ]
            }
          }
          return undefined
        })

        return { previousTasks }
      },
    }
  )
}

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({
      id,
      content,
      position,
    }: {
      id: string
      content: string
      position: number
      shouldInsertTaskBelow?: boolean
    }) => {
      await fetch(`http://localhost:3333/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, position }),
      })
    },
    {
      onMutate: async ({ id, content, shouldInsertTaskBelow = false }) => {
        await queryClient.cancelQueries(['todos'])

        const previousTasks = queryClient.getQueryData(['todos'])

        queryClient.setQueryData<Todo[]>(['todos'], (currentTasks) => {
          if (currentTasks) {
            const currentFocusedTask = currentTasks.find((task) => task.id === id)
            const currentFocusedTaskIndex = currentTasks.findIndex((task) => task.id === id)
            if (currentFocusedTask) {
              currentFocusedTask.content = content
              currentFocusedTask.edit = false
              if (shouldInsertTaskBelow) {
                const nextPosition = currentFocusedTask.position + 1
                const newTask: Todo = {
                  id: cuid(),
                  edit: true,
                  status: 'TODO',
                  content: '',
                  position: nextPosition,
                }
                const updatedTasksPosition = currentTasks.map((task) => {
                  if (task.position >= nextPosition) {
                    return { ...task, position: task.position + 1 }
                  }
                  return task
                })
                return [
                  ...updatedTasksPosition.slice(0, currentFocusedTaskIndex),
                  currentFocusedTask,
                  newTask,
                  ...updatedTasksPosition.slice(currentFocusedTaskIndex + 1),
                ]
              }

              return [
                ...currentTasks.slice(0, currentFocusedTaskIndex),
                currentFocusedTask,
                ...currentTasks.slice(currentFocusedTaskIndex + 1),
              ]
            }
          }
          return undefined
        })

        return { previousTasks }
      },
    }
  )
}

const THREE_MINUTES = 1000 * 60 * 3

export const Todos = () => {
  const todosQuery = useQuery<Todo[]>(
    ['todos'],
    async () => {
      const response = await fetch('http://localhost:3333/todos')
      const todos = await response.json()
      return todos
    },
    { staleTime: THREE_MINUTES }
  )

  const scrollViewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="bg-gray-900 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto overflow-none">
      <header className="border-b border-b-gray-700 w-full text-center py-4 px-3 flex items-center justify-between">
        <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">To-do list</p>
        <div className="flex items-center gap-0.5">
          <button className="p-2 rounded-md hover:bg-gray-750" aria-label="Configuration">
            <GearIcon aria-hidden />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-750" aria-label="Turn on check sound">
            <SpeakerLoudIcon aria-hidden />
          </button>
        </div>
      </header>
      <ScrollArea ref={scrollViewportRef}>
        <Section name="To do" tasksTotal={todosQuery.data?.length}>
          {todosQuery.data?.map((todo) => (
            <Todo
              key={todo.id}
              edit={todo.edit ?? false}
              id={todo.id}
              value={todo.content}
              status={todo.status}
              position={todo.position}
            />
          ))}
        </Section>

      </ScrollArea>
    </div>
  )
}
