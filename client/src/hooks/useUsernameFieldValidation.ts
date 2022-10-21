import React from 'react'
import { useFormContext } from "react-hook-form"

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
      const response = await fetch(`http://localhost:3333/users/${username}`)
      const data = await response.json()
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
