import create from 'zustand'

type PomodoroState = {
  workMinutes: number
  breakMinutes: number
  started: boolean
  paused: boolean
  minimized: boolean
  actions: {
    start: (workMinutes: number, breakMinutes: number) => void
    pause: (pause?: boolean) => void
    stop: () => void
    minimize: (minimize?: boolean) => void
    setWorkMinutes: (minutes: number) => void
    setBreakMinutes: (minutes: number) => void
  }
}

export const usePomodoroStore = create<PomodoroState>()((set) => ({
  workMinutes: 30,
  breakMinutes: 5,
  started: false,
  paused: false,
  minimized: false,
  actions: {
    start: (workMinutes, breakMinutes) => set({ started: true, workMinutes, breakMinutes }),
    pause: (paused = true) => set({ paused }),
    minimize: (minimized = true) => set({ minimized }),
    stop: () => set({ started: false, paused: false }),
    setWorkMinutes: (workMinutes) => set({ workMinutes }),
    setBreakMinutes: (breakMinutes) => set({ breakMinutes }),
  },
}))

export const usePomodoroActions = () => usePomodoroStore((state) => state.actions)
