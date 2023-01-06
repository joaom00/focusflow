import { api } from '@/services/api'
import { useMutation } from '@tanstack/react-query'

import type { SignInResponse, SignUpResponse } from './types'

export const useSignInMutation = <Payload>() => {
  return useMutation(
    async (payload: Payload) => {
      const { data } = await api.post<SignInResponse>('auth/login', payload)
      return data
    },
    {
      onSuccess: ({ token }) => {
        api.defaults.headers.authorization = `Bearer ${token}`
      },
    }
  )
}

export const useSignUpMutation = <Payload>() => {
  return useMutation(
    async (payload: Payload) => {
      const { data } = await api.post<SignUpResponse>('auth/register', payload)
      return data
    },
    {
      onSuccess: ({ token }) => {
        api.defaults.headers.authorization = `Bearer ${token}`
      },
    }
  )
}
