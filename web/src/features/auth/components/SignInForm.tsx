import { api } from '@/services/api'
import { useAuthActions, type User } from '@/features/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

const loginSchema = z.object({
  username: z
    .string()
    .min(4, 'Usernames must be between 4 and 25 characters')
    .max(25, 'Usernames must be between 4 and 25 characters'),
  password: z
    .string()
    .min(6, 'Passwords must be at least 6 characters long')
    .max(32, 'Passwords must be shorter than 32 characters'),
})

type FormData = z.infer<typeof loginSchema>

export const SignInForm = () => {
  const authActions = useAuthActions()
  const methods = useForm<FormData>({ resolver: zodResolver(loginSchema) })
  const { handleSubmit } = methods
  const signInMutation = useSignInMutation()

  const onSubmit = handleSubmit((payload) => {
    signInMutation.mutate(payload, {
      onSuccess: ({ user, token }) => {
        authActions.setUser(user)
        authActions.setToken(token)
        authActions.setAuthenticated(true)
      },
    })
  })

  return (
    <FormProvider {...methods}>
      <form aria-labelledby="login" onSubmit={onSubmit} noValidate>
        <fieldset>
          <legend id="login" className="sr-only">
            Create an account
          </legend>

          <div className="px-5 py-5 flex flex-col gap-5">
            <Input label="Username" name="username" autoComplete="username" />

            <Input
              type="password"
              label="Password"
              name="password"
              autoComplete="current-password"
            />
          </div>

          <div className="border-t border-t-gray-700 px-5 py-2 flex justify-end items-center gap-3">
            <Dialog.Close asChild>
              <Button>Cancel</Button>
            </Dialog.Close>

            <Button type="submit" variant="primary" isLoading={signInMutation.isLoading}>
              Log in
            </Button>
          </div>
        </fieldset>
      </form>
    </FormProvider>
  )
}

type SignInResponse = {
  user: User
  token: string
}

const useSignInMutation = () => {
  return useMutation(
    async (payload: FormData) => {
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
