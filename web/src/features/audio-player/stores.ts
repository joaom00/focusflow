import create from 'zustand'

interface AudioPlayerState {
  playing: boolean
  play: (playing: boolean) => void
}

export const useAudioPlayerStore = create<AudioPlayerState>()((set) => ({
  playing: false,
  play: (playing: boolean) => set((state) => ({ ...state, playing })),
}))
