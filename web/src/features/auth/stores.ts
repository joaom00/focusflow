import create from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from './types'

type AuthStore = {
  authenticated: boolean
  user: User | null
  token: string
  actions: {
    setUser: (user: User) => void
    setAuthenticated: (authenticated: boolean) => void
    setToken: (token: string) => void
    logout: () => void
  }
}

const initialState = {
  user: null,
  token: '',
  authenticated: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      actions: {
        setUser: (user) => set({ user }),
        setAuthenticated: (authenticated) => set({ authenticated }),
        setToken: (token) => set({ token }),
        logout: () => set({ ...initialState }),
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        authenticated: state.authenticated,
      }),
    }
  )
)
