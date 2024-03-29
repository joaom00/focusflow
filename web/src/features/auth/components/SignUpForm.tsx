import * as Dialog from '@radix-ui/react-dialog'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { z } from 'zod'
import { useAuthActions } from '@/features/auth'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useNotification } from '@/components/Notification'
import { PasswordTooltip } from './PasswordTooltip'
import { useSignUpMutation } from '../queries'
import { useUsernameFieldValidation } from '../hooks'

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

export const SignUpForm = () => {
  const authActions = useAuthActions()
  const methods = useForm<FormData>({ resolver: zodResolver(registerSchema) })
  const { handleSubmit } = methods
  const signUpMutation = useSignUpMutation<FormData>()
  const notification = useNotification()

  const onSubmit = handleSubmit((payload) => {
    signUpMutation.mutate(payload, {
      onSuccess: ({ user, token }) => {
        authActions.setUser(user)
        authActions.setToken(token)
        authActions.setAuthenticated(true)
        notification.success('Account created successfully!')
      },
    })
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

const UsernameInput = () => {
  const usernameStatus = useUsernameFieldValidation()

  return <Input label="Username" name="username" autoComplete="username" status={usernameStatus} />
}
