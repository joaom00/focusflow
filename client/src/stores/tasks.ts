import create from 'zustand'

type TasksStore = {
  open: boolean
  toggleOpen: () => void
}

export const useTasksStore = create<TasksStore>()((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ ...state, open: !state.open })),
}))
