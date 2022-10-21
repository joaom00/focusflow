import React from 'react'
import { SpeakerLoudIcon } from '@radix-ui/react-icons'

import { useTasksQuery } from '@/queries/todo'

import { Section } from './Section'
import { ScrollArea } from '../ScrollArea'
import { Task } from './Todo'

export type Task = {
  id: string
  status: 'TODO' | 'DONE'
  edit: boolean
  content: string
  position: string
}

export const Todos = () => {
  const tasksQuery = useTasksQuery()

  const scrollViewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="bg-gray-900 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto overflow-none">
      <header className="border-b border-b-gray-700 w-full text-center py-4 px-3 flex items-center justify-between">
        <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">To-do list</p>
        <div className="flex items-center gap-0.5">
          <button className="p-2 rounded-md hover:bg-gray-750" aria-label="Turn on check sound">
            <SpeakerLoudIcon aria-hidden />
          </button>
        </div>
      </header>

      <ScrollArea ref={scrollViewportRef}>
        <Section name="To do" tasksTotal={tasksQuery.data?.length}>
          {tasksQuery.data?.map((todo) => (
            <Task
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
