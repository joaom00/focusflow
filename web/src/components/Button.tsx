import clsx from 'clsx'
import React from 'react'
import { LoaderIcon } from 'react-hot-toast'

type ButtonVariant = 'default' | 'primary' | 'ghost'

type ButtonElement = React.ElementRef<'button'>
type ButtonProps = React.ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant
  isLoading?: boolean
}

const defaultClasses = 'px-5 py-2 rounded-md text-sm font-medium shadow-sm inline-flex items-center gap-3'
const defaultVariantClasses =
  'bg-gray-800 hover:bg-gray-750 text-white hover:text-gray-100 border border-gray-700'
const primaryVariantClasses =
  'bg-pink-600 hover:bg-pink-700 text-white border border-pink-700 hover:border-pink-800'

export const Button = React.forwardRef<ButtonElement, ButtonProps>((props, forwardedRef) => {
  const { variant = 'default', isLoading = false, className, children, ...buttonProps } = props

  const composedClasses = clsx(
    defaultClasses,
    variant === 'default' && defaultVariantClasses,
    variant === 'primary' && primaryVariantClasses,
    className
  )

  return (
    <button type="button" {...buttonProps} className={composedClasses} ref={forwardedRef}>
      {isLoading && <LoaderIcon />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
