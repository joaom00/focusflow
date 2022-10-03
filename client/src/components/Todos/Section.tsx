import React from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

interface SectionProps {
  name: string
  children?: React.ReactNode
}

export const Section = React.forwardRef<HTMLUListElement, SectionProps>(
  ({ name, children }, forwardedRef) => {
    const [open, setOpen] = React.useState(true)

    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div
          className="flex justify-between items-center px-4 py-3 sticky top-0 bg-transparent border-t border-t-gray-700 z-30"
          style={{
            backgroundImage: 'radial-gradient(rgb(24 24 27 / 5%) 1px, rgb(24 24 27) 1px)',
            backgroundSize: '4px 4px',
            backdropFilter: 'brightness(100%) blur(3px)',
            backgroundColor: 'rgb(24 24 27 / 5%)',
          }}
        >
          <p className="text-sm font-medium">{name}</p>
          <Collapsible.Trigger asChild>
            <motion.button
              initial={false}
              animate={open ? 'open' : 'closed'}
              variants={{ open: { rotateX: '180deg' }, closed: { rotateX: '0deg' } }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
            >
              <ChevronDownIcon />
            </motion.button>
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content>
          <ul ref={forwardedRef}>
            <AnimatePresence>{children}</AnimatePresence>
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    )
  }
)
Section.displayName = 'Section'
