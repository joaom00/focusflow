import create from 'zustand'
import { persist } from 'zustand/middleware'

type TasksStore = {
  open: boolean
  toggleOpen: () => void
}

export const useTasksStore = create<TasksStore>()(persist((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ ...state, open: !state.open })),
}), {name: 'task-sidebar'}) )
