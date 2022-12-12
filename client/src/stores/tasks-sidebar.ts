import create from 'zustand'
import { persist } from 'zustand/middleware'

type TasksStore = {
  open: boolean
  toggleOpen: () => void
}

const useTasksSidebarStore = create<TasksStore>()(
  persist(
    (set) => ({
      open: false,
      toggleOpen: () => set((state) => ({ open: !state.open })),
    }),
    { name: 'task-sidebar' }
  )
)

export const useTasksSidebarOpen = () => useTasksSidebarStore((state) => state.open)
export const useToggleTasksSidebar = () => useTasksSidebarStore((state) => state.toggleOpen)
