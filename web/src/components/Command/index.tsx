import React from 'react'
import { Command as Cmdk, useCommandState } from 'cmdk'
import { PomodoroItems } from './PomodoroItems'
import { useAudioPlayerStore } from '../../stores'
import { composeEventHandlers } from '../../utils/composeEventHandlers'
import clsx from 'clsx'

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/
interface RootProps {
  onSelect: (value: string) => void
  open: boolean
  children?: React.ReactNode
}

export const Root = ({ onSelect, open, children }: RootProps) => {
  return (
    <div className="relative">
      <Cmdk
        className={clsx(
          'border w-full px-1 rounded-md transition-colors ease-linear duration-100 absolute bottom-1',
          open
            ? 'bg-gray-800/50 border-gray-700 backdrop-filter backdrop-blur-lg'
            : 'bg-transparent border-transparent'
        )}
      >
        <Empty open={open} />

        <List onSelect={onSelect} open={open} />
        {children}
      </Cmdk>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * List
 * -----------------------------------------------------------------------------------------------*/
const COMMAND_LIST_NAME = 'CommandList'

interface ListProps {
  onSelect: (value: string) => void
  open: boolean
}

const List = React.forwardRef<HTMLDivElement, ListProps>(({ onSelect, open }, forwardedRef) => {
  const play = useAudioPlayerStore((state) => state.play)
  return open ? (
    <Cmdk.List
      ref={forwardedRef}
      className="px-2 py-2 gap-10 command-heading:text-xs command-heading:uppercase command-heading:tracking-widest command-heading:font-medium command-heading:py-2 command-heading:text-gray-400"
    >
      <PomodoroItems onSelect={onSelect} />

      <Cmdk.Group heading="Song">
        <Item
          value="/play"
          onSelect={composeEventHandlers(onSelect, () => play(true))}
          description="Play current song"
        >
          /play
        </Item>
        <Item
          value="/pause-song"
          onSelect={composeEventHandlers(onSelect, () => play(false))}
          description="Pause current song"
        >
          /pause
        </Item>
      </Cmdk.Group>
    </Cmdk.List>
  ) : null
})

List.displayName = COMMAND_LIST_NAME

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/
const COMMAND_ITEM_NAME = 'CommandItem'

type ItemProps = React.ComponentProps<typeof Cmdk.Item> & {
  description?: string
}

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ description, className, children, ...props }, forwardedRef) => {
    const baseClasses =
      'px-2 py-1.5 rounded-md cursor-pointer selected:bg-gray-750 text-[13px] font-medium select-none'

    return (
      <Cmdk.Item {...props} ref={forwardedRef} className={`${baseClasses} ${className}`}>
        {children}
        <span className="block font-normal text-gray-400 text-xs mt-1">{description}</span>
      </Cmdk.Item>
    )
  }
)

Item.displayName = COMMAND_ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * Empty
 * -----------------------------------------------------------------------------------------------*/
const COMMAND_EMPTY_NAME = 'CommandEmpty'

interface EmptyProps {
  open: boolean
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(({ open }, forwardedRef) => {
  const search = useCommandState((state) => state.search)
  return open ? (
    <Cmdk.Empty className="text-center text-sm py-2 break-all" ref={forwardedRef}>
      No command found for <p>&quot;{search}&quot;</p>
    </Cmdk.Empty>
  ) : null
})

Empty.displayName = COMMAND_EMPTY_NAME
