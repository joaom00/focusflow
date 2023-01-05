import React from 'react'

type LabelElement = React.ElementRef<'label'>
type LabelProps = React.ComponentPropsWithRef<'label'>

export const Label = React.forwardRef<LabelElement, LabelProps>((props, forwardedRef) => {
  return (
    <label
      {...props}
      onMouseDown={(event) => {
        // prevent text selection when double clicking label
        if (event.detail > 1) event.preventDefault()
        props.onMouseDown?.(event)
      }}
      ref={forwardedRef}
    />
  )
})

Label.displayName = 'Label'
