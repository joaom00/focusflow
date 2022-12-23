import React from 'react'
import { Command as CmdkCommand } from 'cmdk'
import { flushSync } from 'react-dom'
import Textarea from 'react-textarea-autosize'

import * as Command from './Command'
import { useLazyRef } from '../hooks/useLazyRef'
import { DoublyLinkedList } from '../lib/DoublyLinkedList'
import { AccountDialog } from './AccountDialog'
import { useUserAuthenticated } from '@/stores'
import { motion } from 'framer-motion'

type ChatInputFieldProps = {
  value: string
  onValueChange: (value: string) => void
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  onCommand?: (command: string, args: string[]) => void
}

const getStartEnd = (value: string, subString: string) => [
  value.indexOf(subString),
  value.indexOf(subString) + subString.length,
]

export const ChatInputField = ({
  value,
  onValueChange,
  onSubmit,
  onCommand,
}: ChatInputFieldProps) => {
  const authenticated = useUserAuthenticated()

  const [open, setOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [currentArg, setCurrentArg] = React.useState(0)
  const shouldListeningCommand = React.useRef(true)
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const dll = useLazyRef(() => new DoublyLinkedList<string>())

  const onCommandSelect = (value: string) => {
    const start = value.indexOf('[')
    const end = value.indexOf(']') + 1
    const hasArgs = !!start && !!end
    flushSync(() => {
      onValueChange(hasArgs ? value : '')
      setOpen(false)
    })
    shouldListeningCommand.current = hasArgs ? false : true
    if (hasArgs) {
      ref.current?.focus()
      ref.current?.setSelectionRange(start, end)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!value.trim()) return

    dll.current.append(value)
    onValueChange('')
    setCurrentIndex((currentIndex) => currentIndex + 1)
    shouldListeningCommand.current = true

    const isCommand = value.startsWith('/')
    if (isCommand) {
      const [command, ...args] = value.split(' ')
      onCommand?.(command, args)
      return
    }

    onSubmit?.(event)
  }

  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.currentTarget.value
    if (value === '') {
      shouldListeningCommand.current = true
      setOpen(false)
      setCurrentIndex(dll.current.length)
      setCurrentArg(0)
    }
    const isCommand = value.startsWith('/')
    if (shouldListeningCommand.current && isCommand) setOpen(true)
    onValueChange(value)
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isArrowUpKey = event.key === 'ArrowUp'
    const isArrowDownKey = event.key === 'ArrowDown'
    const isTabKey = event.key === 'Tab'
    const isEnterKey = event.key === 'Enter'
    const isModifierKey = event.ctrlKey && event.altKey && event.metaKey

    if (isArrowUpKey) {
      if (open) return
      const node = dll.current.getAt(currentIndex - 1)
      setCurrentIndex((currentIndex) => Math.max(currentIndex - 1, 0))
      if (!node) return
      onValueChange(node.value)
    }

    if (isArrowDownKey) {
      if (open) return
      const node = dll.current.getAt(currentIndex + 1)
      setCurrentIndex((currentIndex) => Math.min(currentIndex + 1, dll.current.length - 1))
      if (!node) return
      onValueChange(node.value)
    }

    if (isTabKey && !shouldListeningCommand.current) {
      event.preventDefault()

      if (event.shiftKey) {
        // Go to previous arg
        const previousArg = currentArg - 1
        if (previousArg < 0) return
        const [, ...args] = value.split(' ')
        const [start, end] = getStartEnd(value, args[previousArg])
        const hasArgs = !!start && !!end
        if (hasArgs) {
          setCurrentArg(previousArg)
          event.currentTarget.setSelectionRange(start, end)
        }
        return
      }

      const nextArg = currentArg + 1
      const [, ...args] = value.split(' ')
      if (nextArg >= args.length) return
      const [start, end] = getStartEnd(value, args[nextArg])
      const hasArgs = Boolean(start) && Boolean(end)
      if (hasArgs) {
        setCurrentArg(nextArg)
        event.currentTarget.setSelectionRange(start, end)
      }
    }

    if (isEnterKey && !isModifierKey && !open) {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return authenticated ? (
    <form ref={formRef} onSubmit={handleSubmit} className="px-2">
      <Command.Root onSelect={onCommandSelect} open={open}>
        <CmdkCommand.Input className="hidden" value={value} onValueChange={onValueChange} />

        <div className="relative">
          <motion.div
            className="absolute left-[17px] top-1/2 text-xs font-medium text-gray-400 leading-none pointer-events-none"
            initial="noTyping"
            animate={value.length ? 'typing' : 'noTyping'}
            variants={{
              noTyping: {
                x: 0,
                y: 'calc(-50% - 3.2px)',
                opacity: 1,
              },
              typing: {
                x: 8,
                y: 'calc(-50% - 3.2px)',
                opacity: 0,
              },
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Send a message
          </motion.div>
          <Textarea
            ref={ref}
            name="message"
            minRows={1}
            maxRows={5}
            className="w-full px-4 py-3 text-xs font-medium bg-gray-700 outline-none placeholder-gray-400 resize-none rounded-md border border-transparent focus:bg-gray-900 focus:border-pink-600 transition-all duration-150"
            value={value}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
        </div>
      </Command.Root>
    </form>
  ) : (
    <div className="px-2 pb-2">
      <AccountDialog>
        <button className="w-full px-4 py-3 text-xs font-medium bg-pink-600 rounded-md border border-transparent text-center">
          Create an account to join the conversation!
        </button>
      </AccountDialog>
    </div>
  )
}
