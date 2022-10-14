import cuid from 'cuid'
import { createStore } from 'zustand'
import type { Todo } from '../components/Todos/Todos'

export interface TodoStore {
  id: string
  value: string
  status: 'TODO' | 'DONE' | 'INPROGRESS'
  openMenu: boolean
  edit: boolean
  position: number
  setValue: (value: string) => void
  setEdit: (edit: boolean) => void
  setMenu: (open: boolean) => void
  insertTaskBelow: (todos: Todo[] | undefined) => Todo[] | undefined
  duplicateTask: (todos: Todo[] | undefined) => Todo[] | undefined
  removeTask: (todos: Todo[] | undefined) => Todo[] | undefined
}

type InitialTodoStore = Pick<TodoStore, 'id' | 'edit' | 'value' | 'status' | 'position'>

export function createTodoStore(initialStore: InitialTodoStore) {
  return createStore<TodoStore>()((set, get) => ({
    ...initialStore,
    openMenu: false,
    setValue: (value) => set((state) => ({ ...state, value })),
    setEdit: (edit) => set((state) => ({ ...state, edit })),
    setMenu: (menuOpen) => set((state) => ({ ...state, menuOpen })),
    insertTaskBelow: (currentTasks) => {
      if (currentTasks) {
        const nextPosition = get().position + 1
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
        const currentTaskIndex = updatedTasksPosition.findIndex((task) => task.id === get().id)
        return [
          ...updatedTasksPosition.slice(0, currentTaskIndex + 1),
          newTask,
          ...updatedTasksPosition.slice(currentTaskIndex + 1),
        ]
      }
      return undefined
    },
    duplicateTask: (currentTasks) => {
      if (currentTasks) {
        const currentTaskIndex = currentTasks.findIndex((task) => task.id === get().id)
        const nextPosition = get().position + 1
        const newTask: Todo = {
          id: cuid(),
          edit: false,
          status: 'TODO',
          content: get().value,
          position: nextPosition,
        }
        const updatedTasksPosition = currentTasks.map((task) => {
          if (task.position >= nextPosition) {
            return { ...task, position: task.position + 1 }
          }
          return task
        })
        return [
          ...updatedTasksPosition.slice(0, currentTaskIndex + 1),
          newTask,
          ...updatedTasksPosition.slice(currentTaskIndex + 1),
        ]
      }
      return undefined
    },
    removeTask: (currentTasks) => {
      if (currentTasks) {
        const taskToDeleteId = get().id
        const taskToDeletePosition = get().position
        const updatedTasksPosition = currentTasks.map((task) => {
          if (task.position && task.position >= taskToDeletePosition) {
            return { ...task, position: task.position - 1 }
          }
          return task
        })
        return [...updatedTasksPosition.filter((task) => task.id !== taskToDeleteId)]
      }
      return undefined
    },
  }))
}
