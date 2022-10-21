import React from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { AddTodoButton } from './AddTodoButton'

interface SectionProps {
  name: string
  tasksTotal?: number
  children?: React.ReactNode
}

export const Section = React.forwardRef<HTMLUListElement, SectionProps>(
  ({ name, tasksTotal = 0, children }, forwardedRef) => {
    const [open, setOpen] = React.useState(true)

    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div
          className="flex justify-between items-center px-4 py-2 sticky top-0 bg-transparent border-t border-t-gray-700 z-30"
          style={{
            backgroundImage: 'radial-gradient(rgb(24 24 27 / 5%) 1px, rgb(24 24 27) 1px)',
            backgroundSize: '4px 4px',
            backdropFilter: 'brightness(100%) blur(3px)',
            backgroundColor: 'rgb(24 24 27 / 5%)',
          }}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{name}</p>
            <motion.span
              className="w-5 h-5 leading-none inline-flex justify-center items-center rounded-full bg-pink-400 text-xs font-medium"
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
              {tasksTotal}
            </motion.span>
          </div>
          <Collapsible.Trigger asChild>
            <motion.button
              initial={false}
              animate={{ rotateX: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="p-2 rounded-md hover:bg-gray-750"
            >
              <ChevronDownIcon aria-hidden />
            </motion.button>
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content>
          <ul ref={forwardedRef}>
            <AnimatePresence>{children}</AnimatePresence>

            <AddTodoButton />
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    )
  }
)
Section.displayName = 'Section'
