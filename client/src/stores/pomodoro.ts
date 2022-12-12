import create from 'zustand'
import shallow from 'zustand/shallow'

interface PomodoroState {
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
    start: (workMinutes, breakMinutes) =>
      set((state) => ({ ...state, started: true, workMinutes, breakMinutes })),
    pause: (paused = true) => set((state) => ({ ...state, paused })),
    minimize: (minimized = true) => set((state) => ({ ...state, minimized })),
    stop: () => set((state) => ({ ...state, started: false, paused: false })),
    setWorkMinutes: (workMinutes) => set((state) => ({ ...state, workMinutes })),
    setBreakMinutes: (breakMinutes) => set((state) => ({ ...state, breakMinutes })),
  },
}))

export const usePomodoro = () =>
  usePomodoroStore(
    (state) => ({
      workMinutes: state.workMinutes,
      breakMinutes: state.breakMinutes,
      started: state.started,
      paused: state.paused,
      minimized: state.minimized,
    }),
    shallow
  )

export const usePomodoroActions = () => usePomodoroStore(state => state.actions)
