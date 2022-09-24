import create from 'zustand'

interface PomodoroState {
  workMinutes: number
  breakMinutes: number
  started: boolean
  paused: boolean
  minimized: boolean
  start: (workMinutes: number, breakMinutes: number) => void
  pause: (pause?: boolean) => void
  stop: () => void
  minimize: (minimize?: boolean) => void
  setWorkMinutes: (minutes: number) => void
  setBreakMinutes: (minutes: number) => void
}

export const usePomodoroStore = create<PomodoroState>()((set) => ({
  workMinutes: 30,
  breakMinutes: 5,
  started: false,
  paused: false,
  minimized: false,
  start: (workMinutes, breakMinutes) =>
    set((state) => ({ ...state, started: true, workMinutes, breakMinutes })),
  pause: (paused = true) => set((state) => ({ ...state, paused })),
  minimize: (minimized = true) => set((state) => ({ ...state, minimized })),
  stop: () => set((state) => ({ ...state, started: false, paused: false })),
  setWorkMinutes: (workMinutes) => set((state) => ({ ...state, workMinutes })),
  setBreakMinutes: (breakMinutes) => set((state) => ({ ...state, breakMinutes })),
}))

interface AudioPlayerState {
  playing: boolean
  play: (playing: boolean) => void
}

export const useAudioPlayerStore = create<AudioPlayerState>()((set) => ({
  playing: false,
  play: (playing: boolean) => set((state) => ({ ...state, playing })),
}))
