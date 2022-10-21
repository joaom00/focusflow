import { useUsernameFieldValidation } from '@/hooks/useUsernameFieldValidation'
import { useAuthStore, User } from '@/stores/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { FormProvider, useForm } from 'react-hook-form'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Input } from './Input'
import { PasswordTooltip } from './PasswordTooltip'
import { Button } from './Button'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import shallow from 'zustand/shallow'

const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, 'Usernames must be between 4 and 25 characters')
      .max(25, 'Usernames must be between 4 and 25 characters'),
    email: z.string().email('Please enter a valid email').min(1, 'Please enter a valid email'),
    password: z
      .string()
      .min(6, 'Passwords must be at least 6 characters long')
      .max(32, 'Passwords must be shorter than 32 characters'),
    confirmPassword: z.string().min(1, 'Passwords do not match. Please try again'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please try again',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof registerSchema>

const UsernameInput = () => {
  const usernameStatus = useUsernameFieldValidation()

  return <Input label="Username" name="username" autoComplete="username" status={usernameStatus} />
}

type SignUpPayload = Omit<FormData, 'confirmPassword'>
type SignUpResponse = {
  user: User
  token: string
}
const useSignUpMutation = () => {
  return useMutation(
    async ({ username, email, password }: SignUpPayload) => {
      const { data } = await api.post<SignUpResponse>('auth/register', {
        username,
        email,
        password,
      })
      return data
    },
    {
      onSuccess: ({ token }) => {
        api.defaults.headers.authorization = `Bearer ${token}`
      },
    }
  )
}

export const SignUpForm = () => {
  const {setUser, setToken, setAuthtenticated } = useAuthStore(
    (state) => ({ setUser: state.setUser, setToken: state.setToken, setAuthtenticated: state.setAuthenticated }),
    shallow
  )
  const methods = useForm<FormData>({ resolver: zodResolver(registerSchema) })
  const { handleSubmit } = methods
  const signUpMutation = useSignUpMutation()

  const onSubmit = handleSubmit(async ({ username, email, password }) => {
    signUpMutation.mutate(
      { username, email, password },
      {
        onSuccess: ({user, token }) => {
          setUser(user)
          setToken(token)
          setAuthtenticated(true)
          toast.success('Account created successfully!')
        },
      }
    )
  })

  return (
    <FormProvider {...methods}>
      <form aria-labelledby="create-account" onSubmit={onSubmit} noValidate>
        <fieldset>
          <legend id="create-account" className="sr-only">
            Create an account
          </legend>

          <div className="px-5 py-5 flex flex-col gap-5">
            <UsernameInput />

            <Input type="email" label="Email" name="email" autoComplete="email" />

            <Input
              type="password"
              label="Password"
              name="password"
              autoComplete="new-password"
              trailingAccessory={
                <PasswordTooltip>
                  <HiOutlineLightBulb className="flex-shrink-0 w-[18px] h-[18px]" />
                </PasswordTooltip>
              }
            />

            <Input type="password" label="Confirm password" name="confirmPassword" />
          </div>

          <div className="border-t border-t-gray-700 px-5 py-2 flex justify-end items-center gap-3">
            <Dialog.Close asChild>
              <Button>Cancel</Button>
            </Dialog.Close>

            <Button type="submit" variant="primary" isLoading={signUpMutation.isLoading}>
              Create account
            </Button>
          </div>
        </fieldset>
      </form>
    </FormProvider>
  )
}