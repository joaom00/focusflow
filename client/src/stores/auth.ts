import create from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
  id: string
  email: string
  username: string
  created_at: string
  updated_at: string
}

type AuthStore = {
  authenticated: boolean
  user: User | null
  token: string
  setUser: (user: User) => void
  setAuthenticated: (authenticated: boolean) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: '',
      authenticated: false,
      setUser: (user) => set((state) => ({ ...state, user })),
      setAuthenticated: (authenticated) => set((state) => ({ ...state, authenticated })),
      setToken: (token) => set((state) => ({ ...state, token })),
    }),
    { name: 'auth-storage' }
  )
)

