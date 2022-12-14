import React from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { AddTaskButton } from './AddTaskButton'
import { IconButton } from '../IconButton'

type SectionProps = {
  name: string
  tasksTotal?: number
  children?: React.ReactNode
}

const MotionChevronDownIcon = motion(ChevronDownIcon)

export const Section = React.forwardRef<HTMLUListElement, SectionProps>(
  ({ name, tasksTotal = 0, children }, forwardedRef) => {
    const [open, setOpen] = React.useState(true)

    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div
          className="flex items-center gap-1.5 px-2 py-2 sticky top-0 bg-transparent border-t border-t-gray-700 z-30"
          style={{
            backgroundImage: 'radial-gradient(rgb(24 24 27 / 5%) 1px, rgb(24 24 27) 1px)',
            backgroundSize: '4px 4px',
            backdropFilter: 'brightness(100%) blur(3px)',
            backgroundColor: 'rgb(24 24 27 / 5%)',
          }}
        >
          <Collapsible.Trigger asChild>
            <IconButton size="small" aria-label="">
              <MotionChevronDownIcon
                aria-hidden
                initial={false}
                animate={{ rotate: open ? 0 : -90 }}
              />
            </IconButton>
          </Collapsible.Trigger>

          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{name}</p>
            <motion.span
              className="px-1.5 py-1 leading-none rounded-full border border-gray-700 text-xs font-medium text-gray-400 tracking-widest"
              initial={false}
              animate={open ? 'open' : 'closed'}
              variants={{
                open: {
                  y: 5,
                  opacity: 0,
                  transition: { duration: 0.1 },
                },
                closed: {
                  y: 0,
                  opacity: 1,
                },
              }}
            >
              2/{tasksTotal}
            </motion.span>
          </div>
        </div>

        <Collapsible.Content>
          <ul ref={forwardedRef}>
            <AnimatePresence>{children}</AnimatePresence>

            <AddTaskButton />
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    )
  }
)
Section.displayName = 'Section'
