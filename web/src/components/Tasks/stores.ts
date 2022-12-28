import { createStoreContext } from '@/lib/createContex'
import cuid from 'cuid'
import { createStore } from 'zustand'

import type { Task } from './Tasks'

type TaskStatus = 'TODO' | 'DONE'

export type TaskStore = {
  id: string
  value: string
  status: TaskStatus
  edit: boolean
  position: string
  actions: {
    setValue: (value: string) => void
    setEdit: (edit: boolean) => void
    setStatus: (status: TaskStatus) => void
    generateTaskWithPositionBelow: (tasks: Task[]) => Task
    insertTaskBelow: (tasks: Task[] | undefined) => Task[] | undefined
    duplicateTask: (task: Task) => (tasks: Task[] | undefined) => Task[] | undefined
    removeTask: (tasks: Task[] | undefined) => Task[] | undefined
  }
}

type InitialTaskStore = Pick<TaskStore, 'id' | 'edit' | 'value' | 'status' | 'position'>

export const createTaskStore = (initialStore: InitialTaskStore) => {
  return createStore<TaskStore>()((set, get) => ({
    ...initialStore,
    dropdownMenuOpen: false,
    actions: {
      setValue: (value) => set({ value }),
      setStatus: (status) => set({ status }),
      setEdit: (edit) => set({ edit }),
      generateTaskWithPositionBelow: (currentTasks) => {
        const currentId = get().id
        const currentPosition = get().position
        const currentTaskIndex = currentTasks.findIndex((task) => task.id === currentId)
        const nextTask = currentTasks[currentTaskIndex + 1]
        let newTaskPosition = parseFloat(currentPosition) + 1
        if (nextTask) {
          const nextTaskPosition = nextTask.position
          newTaskPosition = (parseFloat(currentPosition) + parseFloat(nextTaskPosition)) / 2
        }
        const newTask: Task = {
          id: cuid(),
          edit: true,
          status: 'TODO',
          content: '',
          position: String(newTaskPosition),
        }
        return newTask
      },
      insertTaskBelow: (currentTasks) => {
        if (currentTasks) {
          const currentId = get().id
          const currentTaskIndex = currentTasks.findIndex((task) => task.id === currentId)
          const newTask = get().actions.generateTaskWithPositionBelow(currentTasks)
          return [
            ...currentTasks.slice(0, currentTaskIndex + 1),
            newTask,
            ...currentTasks.slice(currentTaskIndex + 1),
          ]
        }
        return undefined
      },
      duplicateTask: (newTask) => (currentTasks) => {
        if (currentTasks) {
          const currentTaskIndex = currentTasks.findIndex((task) => task.id === get().id)
          return [
            ...currentTasks.slice(0, currentTaskIndex + 1),
            newTask,
            ...currentTasks.slice(currentTaskIndex + 1),
          ]
        }
        return undefined
      },
      removeTask: (currentTasks) => {
        if (currentTasks) {
          return [...currentTasks.filter((task) => task.id !== get().id)]
        }
        return undefined
      },
    },
  }))
}

export const [TaskProvider, useTaskStore] = createStoreContext<TaskStore>('TaskStore')
export const useTaskActions = () => useTaskStore((state) => state.actions)
