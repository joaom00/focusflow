import React from 'react'
import { flushSync } from 'react-dom'
import { RiStopFill, RiChat3Fill, RiPauseFill, RiPlayFill } from 'react-icons/ri'
import { ChatInputField } from './ChatInput'
import { Tooltip } from '@/components/Tooltip'
import { useTasksSidebarOpen, useToggleTasksSidebar } from '@/features/tasks'
import { useUser, useUserAuthenticated, useAuthActions } from '@/features/auth'
import { ChevronRightIcon, ExitIcon, ReaderIcon } from '@radix-ui/react-icons'
import shallow from 'zustand/shallow'
import io from 'socket.io-client'
import { ChatDialog, ChatDialogPortal, ChatDialogProvider } from './ChatDialog'
import { motion } from 'framer-motion'
import { Pomodoro, usePomodoroStore, usePomodoroActions, useTimer } from '@/features/pomodoro'
import { formatSecondsIntoMinutesAndSeconds } from '../utils/seconds'

const MIN_WORK_MINUTES = 30
const MIN_BREAK_MINUTES = 5

const socket = io(import.meta.env.VITE_BASE_API_URL)

type MessagePayload = {
  author: string
  content: string
}

export const Chat = () => {
  const user = useUser()
  const userAuthenticated = useUserAuthenticated()
  const authActions = useAuthActions()
  const pomodoro = usePomodoroStore(
    (state) => ({
      started: state.started,
      minimized: state.minimized,
    }),
    shallow
  )
  const pomodoroActions = usePomodoroActions()

  const tasksSidebarOpen = useTasksSidebarOpen()
  const toggleTasksSidebar = useToggleTasksSidebar()

  const [messages, setMessages] = React.useState<MessagePayload[]>([])
  const [value, setValue] = React.useState('')

  const chatContainer = React.useRef<HTMLDivElement>(null)
  const messagesContainer = React.useRef<HTMLDivElement>(null)

  const onPomodoro = (args: string[]) => {
    const workTime = Math.max(Number(args[0]), MIN_WORK_MINUTES)
    const breakTime = Math.max(Number(args[1]), MIN_BREAK_MINUTES)

    pomodoroActions.setStart(
      isNaN(workTime) ? MIN_WORK_MINUTES : workTime,
      isNaN(breakTime) ? MIN_BREAK_MINUTES : breakTime
    )
  }

  React.useEffect(() => {
    socket.on('onMessage', (data: MessagePayload) => {
      console.log('onMessage event received!')

      flushSync(() => {
        setMessages((currentMessages) => [...currentMessages, data])
      })
      const lastChild = messagesContainer.current?.lastChild as HTMLElement
      lastChild.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    })

    return () => {
      socket.off('connect')
      socket.off('onMessage')
    }
  }, [])

  const handleSubmit = () => {
    socket.emit('newMessage', {
      author: user?.username,
      content: value,
    })
  }

  const handleCommand = (command: string, args: string[]) => {
    switch (command) {
      case '/pomodoro':
        onPomodoro(args)
        break
    }
  }

  return (
    <ChatDialogProvider>
      <div className="bg-gray-900/70 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-l border-l-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto">
        <header className="border-b border-b-gray-700 w-full grid grid-cols-3 items-center py-4 px-3">
          <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">Chat</p>

          {userAuthenticated && (
            <div className="ml-auto flex items-center gap-1">
              <Tooltip content={tasksSidebarOpen ? 'Close tasks list' : 'Open tasks list'}>
                <button
                  aria-label={tasksSidebarOpen ? 'Close tasks list' : 'Open tasks list'}
                  onClick={toggleTasksSidebar}
                  className="text-gray-400 hover:bg-gray-700/50 w-8 h-8 flex items-center justify-center rounded-md hover:text-gray-100 duration-150"
                >
                  <ReaderIcon aria-hidden />
                </button>
              </Tooltip>
              <Tooltip content="Log out">
                <button
                  aria-label="Log out"
                  onClick={authActions.logout}
                  className="text-gray-400 hover:bg-gray-700/50 w-8 h-8 flex items-center justify-center rounded-md hover:text-gray-100 duration-150"
                >
                  <ExitIcon aria-hidden />
                </button>
              </Tooltip>
            </div>
          )}
        </header>

        <div
          ref={messagesContainer}
          className="px-4 pt-3 mb-[60px] overflow-y-auto flex-1 basis-auto h-0 messages relative"
        >
          <ChatDialog />

          {pomodoro.started && <ChatPomodoro />}

          {(pomodoro.minimized || !pomodoro.started) && (
            <div className="space-y-3.5" ref={chatContainer}>
              {messages.map((message, index) => (
                <p className="text-sm" key={index} tabIndex={0}>
                  <span className="text-gray-400 font-medium">{message.author}:</span>{' '}
                  {message.content}
                </p>
              ))}
            </div>
          )}
        </div>

        <ChatInputField
          value={value}
          onValueChange={setValue}
          onSubmit={handleSubmit}
          onCommand={handleCommand}
        />
      </div>
    </ChatDialogProvider>
  )
}

const ChatPomodoro = () => {
  const pomodoro = usePomodoroStore(
    (state) => ({
      started: state.started,
      minimized: state.minimized,
      paused: state.paused,
    }),
    shallow
  )
  const { setMinimize, setPause } = usePomodoroActions()
  const { seconds, totalSeconds, setSeconds } = useTimer()

  return pomodoro.minimized ? (
    <ChatDialogPortal>
      <motion.div
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        className="bg-gray-800 opacity-60 rounded-md px-2.5 py-4 flex items-center hover:opacity-100 transition-opacity duration-300 ease-in-out gap-1.5"
      >
        <p className="font-bungee flex-1">{formatSecondsIntoMinutesAndSeconds(seconds)}</p>
        {pomodoro.paused ? (
          <button
            className="hover:bg-gray-850 text-gray-200 p-1.5 rounded-lg select-none"
            onClick={() => setPause(false)}
          >
            <RiPlayFill size={18} />
          </button>
        ) : (
          <button
            className="hover:bg-gray-850 text-gray-200 p-1.5 rounded-lg select-none"
            onClick={() => setPause(true)}
          >
            <RiPauseFill size={18} />
          </button>
        )}
        <button
          onClick={() => setMinimize(false)}
          className="text-xl p-1.5 rounded-lg select-none hover:bg-gray-850 text-gray-200"
        >
          <ChevronRightIcon />
        </button>
      </motion.div>
    </ChatDialogPortal>
  ) : (
    <ChatPomodoroImpl seconds={seconds} totalSeconds={totalSeconds} setSeconds={setSeconds} />
  )
}

type ChatPomodoroImplProps = {
  seconds: number
  totalSeconds: number
  setSeconds: (seconds: number) => void
}

const ChatPomodoroImpl = ({ seconds, totalSeconds, setSeconds }: ChatPomodoroImplProps) => {
  const pomodoro = usePomodoroStore(
    (state) => ({ started: state.started, paused: state.paused }),
    shallow
  )
  const { setPause, setMinimize, setStop } = usePomodoroActions()
  const percentage = Math.max(((totalSeconds - seconds) / totalSeconds) * 100, 1)

  const handlePlay = () => setPause(false)
  const handlePause = () => setPause(true)
  const handleStop = () => {
    setStop()
    setSeconds?.(60 * 30)
  }
  const handleMinimize = () => setMinimize()

  return pomodoro.started ? (
    <div className="justify-start items-center gap-8 h-full flex flex-col pt-8">
      <div className="w-[240px] h-[240px]">
        <Pomodoro value={percentage}>{formatSecondsIntoMinutesAndSeconds(seconds)}</Pomodoro>
      </div>

      <div className="flex justify-evenly items-center w-full mt-4">
        <Tooltip content="Stop">
          <button
            className="hover:bg-gray-800 text-gray-200 p-2 rounded-lg select-none"
            onClick={handleStop}
          >
            <RiStopFill size={24} />
          </button>
        </Tooltip>

        {pomodoro.paused ? (
          <Tooltip content="Play">
            <button
              className="hover:bg-gray-800 text-gray-200 p-2 rounded-lg select-none"
              onClick={handlePlay}
            >
              <RiPlayFill size={24} />
            </button>
          </Tooltip>
        ) : (
          <Tooltip content="Pause">
            <button
              className="hover:bg-gray-800 text-gray-200 p-2 rounded-lg select-none"
              onClick={handlePause}
            >
              <RiPauseFill size={24} />
            </button>
          </Tooltip>
        )}

        <Tooltip content="Minimize">
          <button
            className="hover:bg-gray-800 text-gray-200 p-2 rounded-lg text-sm"
            onClick={handleMinimize}
          >
            <RiChat3Fill size={24} />
          </button>
        </Tooltip>
      </div>
    </div>
  ) : null
}
