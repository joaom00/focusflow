import React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

interface ScrollAreaProps {
  children?: React.ReactNode
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children }, forwardedRef) => {
    return (
      <ScrollAreaRoot>
        <ScrollAreaScrollbar>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>

        <ScrollAreaPrimitive.Viewport ref={forwardedRef} className="w-full h-full">
          {children}
        </ScrollAreaPrimitive.Viewport>
      </ScrollAreaRoot>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

const ScrollAreaRoot = (props: { children: React.ReactNode }) => {
  return <ScrollAreaPrimitive.Root {...props} className="overflow-hidden" />
}

const ScrollAreaScrollbar = (props: { children: React.ReactNode }) => {
  return (
    <ScrollAreaPrimitive.Scrollbar
      {...props}
      className="flex select-none touch-none p-[2px] bg-gray-900/60 transition-colors duration-150 ease-out hover:bg-gray-900/80 w-2 z-50"
    />
  )
}

const ScrollAreaThumb = () => {
  return (
    <ScrollAreaPrimitive.Thumb className="flex-1 bg-gray-500 rounded-[10px] relative before:content-[' '] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[22px] before:min-h-[44px]" />
  )
}
