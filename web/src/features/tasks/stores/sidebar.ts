import create from 'zustand'
import { persist } from 'zustand/middleware'

type TasksStore = {
  open: boolean
  toggleOpen: () => void
}

export const useTasksSidebarStore = create<TasksStore>()(
  persist(
    (set) => ({
      open: false,
      toggleOpen: () => set((state) => ({ open: !state.open })),
    }),
    { name: 'task-sidebar' }
  )
)

