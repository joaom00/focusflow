import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import clsx from 'clsx'

type TooltipRootProps = React.ComponentProps<typeof TooltipPrimitive.Root>
type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>

type TooltipProps = TooltipContentProps & {
  content: string | React.ReactNode
  open?: TooltipRootProps['open']
  defaultOpen?: TooltipRootProps['defaultOpen']
  onOpenChange?: TooltipRootProps['onOpenChange']
  delayDuration?: TooltipRootProps['delayDuration']
}

export const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 700,
  className,
  ...props
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={4}
          {...props}
          className={clsx(
            'bg-gray-800 px-3 py-2 leading-none select-none rounded-lg text-xs font-medium will-change-transform',
            'data-[side=top]:animate-slideDownAndFade',
            'data-[side=bottom]:animate-slideUpAndFade',
            'data-[side=left]:animate-slideRightAndFade',
            'data-[side=right]:animate-slideLeftAndFade',
            className
          )}
        >
          {content}
          <TooltipPrimitive.Arrow width={11} height={5} className="fill-gray-800" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
