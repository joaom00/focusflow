import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useTasksQuery } from '@/queries/todo'

import { ScrollArea } from '../ScrollArea'
import { Task } from './Todo'
import { AddTodoButton } from './AddTodoButton'
import { useTasksStore } from '@/stores/tasks'

export type Task = {
  id: string
  status: 'TODO' | 'DONE'
  edit: boolean
  content: string
  position: string
}

export const Todos = () => {
  const tasksQuery = useTasksQuery()

  const open = useTasksStore((state) => state.open)

  const scrollViewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <motion.div
      id="task-sidebar"
      className="bg-gray-900 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto overflow-none"
      initial="closed"
      animate={open ? 'open' : 'closed'}
      variants={{
        open: { x: 0 },
        closed: { x: '-100%' },
      }}
      transition={{ ease: [0.53, 0.21, 0, 1], duration: 0.5 }}
    >
      <header className="border-b border-b-gray-700 w-full text-center py-4 px-3 flex items-center justify-between">
        <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">To-do list</p>
      </header>

      <ScrollArea ref={scrollViewportRef}>
        <ul>
          <AnimatePresence>
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
          </AnimatePresence>
        </ul>
        <AddTodoButton />
      </ScrollArea>
    </motion.div>
  )
}
