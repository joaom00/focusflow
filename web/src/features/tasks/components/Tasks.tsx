import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as RovingFocusGroup from '@radix-ui/react-roving-focus'

import { useTasksQuery } from '../queries'

import { ScrollArea } from '@/components/ScrollArea'
import { Task } from './Task'
import { AddTaskButton } from './AddTaskButton'
import { useTasksSidebarOpen } from '../hooks'

export const Tasks = () => {
  const tasksQuery = useTasksQuery()
  const tasksSidebarOpen = useTasksSidebarOpen()
  const scrollViewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <motion.div
      id="task-sidebar"
      className="bg-gray-900 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto overflow-none"
      initial={tasksSidebarOpen ? 'open' : 'closed'}
      animate={tasksSidebarOpen ? 'open' : 'closed'}
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
        <RovingFocusGroup.Root asChild orientation="vertical">
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
        </RovingFocusGroup.Root>
        <AddTaskButton />
      </ScrollArea>
    </motion.div>
  )
}
