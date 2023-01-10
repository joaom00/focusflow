import create from 'zustand'

type PomodoroState = {
  workMinutes: number
  breakMinutes: number
  started: boolean
  paused: boolean
  minimized: boolean
  actions: {
    setStart: (workMinutes: number, breakMinutes: number) => void
    setPause: (pause?: boolean) => void
    setStop: () => void
    setMinimize: (minimize?: boolean) => void
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
    setStart: (workMinutes, breakMinutes) => set({ started: true, workMinutes, breakMinutes }),
    setPause: (paused = true) => set({ paused }),
    setMinimize: (minimized = true) => set({ minimized }),
    setStop: () => set({ started: false, paused: false }),
    setWorkMinutes: (workMinutes) => set({ workMinutes }),
    setBreakMinutes: (breakMinutes) => set({ breakMinutes }),
  },
}))

export const usePomodoroActions = () => usePomodoroStore((state) => state.actions)
