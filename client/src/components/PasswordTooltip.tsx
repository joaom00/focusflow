import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { useFormContext } from 'react-hook-form'
import clsx from 'clsx'

type TooltipProps =  TooltipPrimitive.TooltipContentProps & {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const uppercaseRegex = new RegExp('[A-Z]')
const numberRegex = new RegExp('[0-9]')
const specialCharactersRegex = new RegExp(/[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/)

export const PasswordTooltip = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipProps) => {
  const { watch } = useFormContext()
  const password = watch('password')
  const hasUppercaseLetters = uppercaseRegex.test(password)
  const hasNumber = numberRegex.test(password)
  const hasSpecialCharacters = specialCharactersRegex.test(password)
  const hasAtLeastEightCharacters = password ? password.length >= 8 : false

  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={0}
    >
      <TooltipPrimitive.Trigger
        type="button"
        aria-hidden
        tabIndex={-1}
        className={clsx(
          'text-gray-400 hover:text-gray-200 transition-all duration-150 cursor-default',
          password ? 'opacity-100' : 'opacity-0'
        )}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          align="end"
          sideOffset={4}
          {...props}
          className="bg-gray-900 px-3 py-2 leading-none select-none rounded-lg text-xs font-medium animate-slideDownAndFade"
        >
          <span>Password strength</span>

          <div
            className={clsx(
              'flex items-center gap-2 mt-2 font-normal',
              hasUppercaseLetters ? 'text-green-400' : 'text-gray-400'
            )}
          >
            {hasUppercaseLetters ? <CheckCircledIcon /> : <CrossCircledIcon />}
            Uppercase & lowercase
          </div>

          <div
            className={clsx(
              'flex items-center gap-2 mt-2 font-normal',
              hasNumber ? 'text-green-400' : 'text-gray-400'
            )}
          >
            {hasNumber ? <CheckCircledIcon /> : <CrossCircledIcon />}
            Numbers
          </div>

          <div
            className={clsx(
              'flex items-center gap-2 mt-2 font-normal',
              hasSpecialCharacters ? 'text-green-400' : 'text-gray-400'
            )}
          >
            {hasSpecialCharacters ? <CheckCircledIcon /> : <CrossCircledIcon />}
            Special characters
          </div>

          <div
            className={clsx(
              'flex items-center gap-2 mt-2 font-normal',
              hasAtLeastEightCharacters ? 'text-green-400' : 'text-gray-400'
            )}
          >
            {hasAtLeastEightCharacters ? <CheckCircledIcon /> : <CrossCircledIcon />}
            At least 8 characters
          </div>

          <TooltipPrimitive.Arrow width={11} height={5} className="fill-gray-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
