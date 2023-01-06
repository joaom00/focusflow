import React from 'react'
import { api } from '@/services/api'
import { useFormContext } from 'react-hook-form'
import { useAuthStore } from './stores'

export const useUser = () => useAuthStore((state) => state.user)
export const useToken = () => useAuthStore((state) => state.token)
export const useUserAuthenticated = () => useAuthStore((state) => state.authenticated)
export const useAuthActions = () => useAuthStore((state) => state.actions)

export const useUsernameFieldValidation = () => {
  const { watch, formState, clearErrors, setError } = useFormContext()
  const username = watch('username')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle')

  React.useEffect(() => {
    if (!username) {
      setStatus('idle')
      return
    }

    const usernameError = formState.errors['username']
    if (usernameError?.type === 'custom') {
      clearErrors('username')
    }

    setStatus('loading')
    const timeoutId = setTimeout(async () => {
      const { data } = await api.get(`/users/${username}`)
      if (data.username) {
        setError('username', { type: 'custom', message: 'This username is unavailable' })
        setStatus('idle')
        return
      }
      setStatus('success')
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [clearErrors, formState.errors, setError, username])

  return status
}
