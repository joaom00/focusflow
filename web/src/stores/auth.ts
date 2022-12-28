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
    { name: 'auth-storage', partialize: (state) => ({ user: state.user, token: state.token, authenticated: state.authenticated }) }
  )
)

export const useUser = () => useAuthStore((state) => state.user)
export const useToken = () => useAuthStore((state) => state.token)
export const useUserAuthenticated = () => useAuthStore((state) => state.authenticated)
export const useAuthActions = () => useAuthStore((state) => state.actions)
