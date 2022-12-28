import clsx from 'clsx'
import React from 'react'

type IconButtonSize = 'small' | 'medium'

type IconButtonElement = React.ElementRef<'button'>
type IconButtonProps = React.ComponentPropsWithRef<'button'> & {
  size?: IconButtonSize
  ['aria-label']: string
}

const defaultClasses = 'rounded-md hover:bg-gray-750'
const smallSizeClasses = 'p-1.5'
const mediumSizeClasses = 'p-2'

export const IconButton = React.forwardRef<IconButtonElement, IconButtonProps>(
  (props, forwardedRef) => {
    const { size = 'medium', className, ...buttonProps } = props
    const composedClasses = clsx(
      defaultClasses,
      size === 'small' && smallSizeClasses,
      size === 'medium' && mediumSizeClasses,
      className
    )
    return <button {...buttonProps} className={composedClasses} ref={forwardedRef} />
  }
)

IconButton.displayName = 'IconButton'
