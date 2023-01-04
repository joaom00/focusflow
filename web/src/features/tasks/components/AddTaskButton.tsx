import React from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import cuid from 'cuid'

import type { Task } from './Tasks'

export const AddTaskButton = () => {
  const queryClient = useQueryClient()
  const ref = React.useRef<HTMLDivElement>(null)

  const handleAddTask = () => {
    queryClient.setQueryData<Task[]>(['tasks'], (currentTasks) => {
      if (currentTasks?.length) {
        const lastTask = currentTasks[currentTasks.length - 1]
        const position = parseInt(lastTask.position) + 1
        const newTask: Task = {
          id: cuid(),
          status: 'TODO',
          edit: true,
          content: '',
          position: String(position),
        }
        return [...currentTasks, newTask]
      }
      return [{ id: cuid(), status: 'TODO', edit: true, content: '', position: '1' }]
    })
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
      }
    }, 110)
  }

  return (
    <div className="border-t border-t-gray-700 w-full py-1 px-2" ref={ref}>
      <button
        type="button"
        className="text-sm flex items-center gap-2 rounded-lg text-gray-300 px-2 py-1 duration-200 relative add-task-button hover:text-white group transition-colors"
        onClick={handleAddTask}
      >
        <div
          aria-hidden
          className="border-2 border-gray-400 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center group-hover:border-white transition-colors duration-200"
        >
          <PlusIcon className="group-hover:text-white" />
        </div>
        New task
      </button>
    </div>
  )
}
