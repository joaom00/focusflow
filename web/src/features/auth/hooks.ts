import {useAuthStore} from './stores'

export const useUser = () => useAuthStore((state) => state.user)
export const useToken = () => useAuthStore((state) => state.token)
export const useUserAuthenticated = () => useAuthStore((state) => state.authenticated)
export const useAuthActions = () => useAuthStore((state) => state.actions)
