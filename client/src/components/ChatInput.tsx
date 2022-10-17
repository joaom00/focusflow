import React from 'react'
import { Command as CmdkCommand } from 'cmdk'
import { flushSync } from 'react-dom'
import Textarea from 'react-textarea-autosize'
import * as Dialog from '@radix-ui/react-dialog'

import * as Command from './Command'
import { useLazyRef } from '../hooks/useLazyRef'
import { DoublyLinkedList } from '../lib/DoublyLinkedList'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { ErrorIcon } from 'react-hot-toast'

const is_authenticated = false

interface ChatInputFieldProps {
  value: string
  onValueChange: (value: string) => void
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  onCommandEnter?: (command: string, args: string[]) => void
}

const getStartEnd = (value: string, subString: string) => [
  value.indexOf(subString),
  value.indexOf(subString) + subString.length,
]

export const ChatInputField = ({
  value,
  onValueChange,
  onSubmit: onSubmitProp,
  onCommandEnter,
}: ChatInputFieldProps) => {
  const [open, setOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [currentArg, setCurrentArg] = React.useState(0)
  const shouldListeningCommand = React.useRef(true)
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const dll = useLazyRef(() => new DoublyLinkedList<string>())

  const onCommandSelect = (value: string) => {
    const start = value.indexOf('[')
    const end = value.indexOf(']') + 1
    const hasArgs = !!start && !!end
    flushSync(() => {
      onValueChange(hasArgs ? value : '')
      setOpen(false)
    })
    shouldListeningCommand.current = hasArgs ? false : true
    if (hasArgs) {
      ref.current?.focus()
      ref.current?.setSelectionRange(start, end)
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!value.trim()) return

    dll.current.append(value)
    onValueChange('')
    setCurrentIndex((currentIndex) => currentIndex + 1)
    shouldListeningCommand.current = true

    const isCommand = value.startsWith('/')
    if (isCommand) {
      const [command, ...args] = value.split(' ')
      onCommandEnter?.(command, args)
      return
    }

    onSubmitProp?.(event)
  }

  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.currentTarget.value
    if (value === '') {
      shouldListeningCommand.current = true
      setOpen(false)
      setCurrentIndex(dll.current.length)
      setCurrentArg(0)
    }
    const isCommand = value.startsWith('/')
    if (shouldListeningCommand.current && isCommand) setOpen(true)
    onValueChange(value)
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isArrowUpKey = event.key === 'ArrowUp'
    const isArrowDownKey = event.key === 'ArrowDown'
    const isTabKey = event.key === 'Tab'
    const isEnterKey = event.key === 'Enter'
    const isModifierKey = event.ctrlKey && event.altKey && event.metaKey

    if (isArrowUpKey) {
      if (open) return
      const node = dll.current.getAt(currentIndex - 1)
      setCurrentIndex((currentIndex) => Math.max(currentIndex - 1, 0))
      if (!node) return
      onValueChange(node.value)
    }

    if (isArrowDownKey) {
      if (open) return
      const node = dll.current.getAt(currentIndex + 1)
      setCurrentIndex((currentIndex) => Math.min(currentIndex + 1, dll.current.length - 1))
      if (!node) return
      onValueChange(node.value)
    }

    if (isTabKey && !shouldListeningCommand.current) {
      event.preventDefault()

      if (event.shiftKey) {
        // Go to previous arg
        const previousArg = currentArg - 1
        if (previousArg < 0) return
        const [, ...args] = value.split(' ')
        const [start, end] = getStartEnd(value, args[previousArg])
        const hasArgs = !!start && !!end
        if (hasArgs) {
          setCurrentArg(previousArg)
          event.currentTarget.setSelectionRange(start, end)
        }
        return
      }

      const nextArg = currentArg + 1
      const [, ...args] = value.split(' ')
      if (nextArg >= args.length) return
      const [start, end] = getStartEnd(value, args[nextArg])
      const hasArgs = Boolean(start) && Boolean(end)
      if (hasArgs) {
        setCurrentArg(nextArg)
        event.currentTarget.setSelectionRange(start, end)
      }
    }

    if (isEnterKey && !isModifierKey && !open) {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="px-2">
      <Command.Root onSelect={onCommandSelect} open={open}>
        <CmdkCommand.Input className="hidden" value={value} onValueChange={onValueChange} />

        {is_authenticated ? (
          <Textarea
            ref={ref}
            name="message"
            minRows={1}
            maxRows={5}
            placeholder="Send a message"
            className="w-full px-4 py-3 text-xs font-medium bg-gray-700 outline-none placeholder-gray-400 resize-none rounded-md border border-transparent focus:bg-gray-900 focus:border-pink-600"
            value={value}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
        ) : (
          <SignInDialog>
            <button className="w-full px-4 py-3 text-xs font-medium bg-pink-600 rounded-md border border-transparent text-center">
              You need to login to start conversation
            </button>
          </SignInDialog>
        )}
      </Command.Root>
    </form>
  )
}

interface SignInDialogProps {
  children?: React.ReactNode
}

const registerSchema = z.object({
  username: z
    .string()
    .min(4, 'Usernames must be between 4 and 25 characters')
    .max(25, 'Usernames must be between 4 and 25 characters'),
  email: z.string().email('Please enter a valid email').min(1, 'Please enter a valid email'),
  password: z
    .string()
    .min(6, 'Passwords must be at least 6 characters long')
    .max(32, 'Passwords must be shorter than 32 characters'),
})

type FormData = z.infer<typeof registerSchema>

const SignInDialog = ({ children }: SignInDialogProps) => {
  const methods = useForm<FormData>({ resolver: zodResolver(registerSchema) })
  const { handleSubmit } = methods

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-900/90 fixed inset-0" />
        <Dialog.Content className="bg-gray-800 border border-gray-700 rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg w-11/12">
          <div className="border-b border-b-gray-700 px-5 py-3">
            <Dialog.Title className="font-medium">Create an account</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-400">
              Enter your details to create an account
            </Dialog.Description>
          </div>

          <FormProvider {...methods}>
            <form aria-labelledby="create-account" onSubmit={onSubmit} noValidate>
              <fieldset>
                <legend id="create-account" className="sr-only">
                  Create an account
                </legend>

                <div className="px-5 py-5 flex flex-col gap-5">
                  <Input label="Username" name="username" autoComplete="username" />

                  <Input type="email" label="Email" name="email" autoComplete="email" />

                  <Input
                    type="password"
                    label="Password"
                    name="password"
                    autoComplete="new-password"
                  />
                </div>

                <div className="border-t border-t-gray-700 px-5 py-2 flex justify-end items-center gap-3">
                  <Dialog.Close className="bg-gray-800 hover:bg-gray-750 text-white hover:text-gray-100 shadow-sm border border-gray-700 px-5 py-2 rounded-md text-sm font-medium">
                    Cancel
                  </Dialog.Close>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white shadow-sm border border-pink-700 hover:border-pink-800 px-5 py-2 rounded-md text-sm font-medium">
                    Create account
                  </button>
                </div>
              </fieldset>
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type NativeInputProps = React.ComponentPropsWithRef<'input'>

type InputProps = NativeInputProps & {
  label: string
  name: keyof FormData
}

const Input = ({ name, label, ...props }: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>()

  const error = errors[name]
  const hasError = !!error

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm select-none flex justify-between items-center">
        {label}
        {hasError && <ErrorIcon className="w-4 h-4 before:w-[10px] after:w-[10px] before:left-[3px] before:bottom-[7px] after:left-[3px] after:bottom-[7px]" />}
      </label>

      <input
        {...props}
        id={name}
        className={clsx(
          'h-9 rounded-md bg-gray-750 px-3 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none transition duration-200 focus:bg-gray-850 caret-pink-300',
          hasError ? 'focus:ring-red-400' : 'focus:ring-pink-400'
        )}
        aria-invalid={hasError ? 'true' : 'false'}
        {...register(name)}
      />

      {!!error && (
        <motion.span
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          role="alert"
          className="text-xs font-medium text-red-400 mt-1"
        >
          {error.message}
        </motion.span>
      )}
    </div>
  )
}
