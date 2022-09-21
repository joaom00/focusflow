import React from 'react'
import { createPortal, flushSync } from 'react-dom'
import { animate } from 'motion'
import { RiStopFill } from 'react-icons/ri'
import { useTimer } from '../hooks/useTimer'
import { createContext } from '../lib/createContex'
import { formatSecondsIntoMinutesAndSeconds } from '../utils/seconds'
import { ChatInputField } from './ChatInput'

const CHAT_NAME = 'Chat'

interface ChatContextValue {
  headerRef?: React.RefObject<HTMLElement>
}

const [ChatProvider, useChatContext] = createContext<ChatContextValue>(CHAT_NAME)

export const Chat = () => {
  const [showPomodoro, setShowPomodoro] = React.useState(false)
  const [startPomodoro, setStartPomodoro] = React.useState(false)
  const [minutes, setMinutes] = React.useState(30)
  const [messages, setMessages] = React.useState<string[]>([])
  const [commandValue, setCommandValue] = React.useState('')

  const headerRef = React.useRef<HTMLElement>(null)
  const chatContainer = React.useRef<HTMLDivElement>(null)
  const messagesContainer = React.useRef<HTMLDivElement>(null)

  const onPomodoro = (args: string[]) => {
    setShowPomodoro(true)
    setStartPomodoro(true)
    const workTime = Math.max(Number(args[0]), 30)
    setMinutes(isNaN(workTime) ? 30 : workTime)
  }

  const onPomodoroStop = () => {
    setShowPomodoro(false)
    setStartPomodoro(false)
  }

  return (
    <ChatProvider headerRef={headerRef}>
      <div className="bg-gray-900/70 ml-auto max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex-1 flex flex-col border-l border-l-gray-700">
        <header
          ref={headerRef}
          className="border-b border-b-gray-700 w-full grid grid-cols-3 items-center py-6 px-3"
        >
          <p className="text-2xl font-bold justify-self-center col-start-2">Chat</p>
        </header>

        <div
          ref={messagesContainer}
          className="px-4 pt-3 mb-3 overflow-auto flex-1 basis-auto h-0 messages"
        >
          <ChatPomodoro
            key={minutes}
            start={startPomodoro}
            minutes={1}
            onStop={onPomodoroStop}
            show={showPomodoro}
            onShowChange={setShowPomodoro}
          />
          {!showPomodoro && (
            <div className="space-y-3.5" ref={chatContainer}>
              {messages.map((message, i) => (
                <p className="text-sm" key={i} tabIndex={0}>
                  <span className="text-gray-400 font-medium">joaom00</span> {message}
                </p>
              ))}
            </div>
          )}
        </div>

        <ChatInputField
          value={commandValue}
          onValueChange={setCommandValue}
          onSubmit={() => {
            flushSync(() => {
              setMessages((currentMessages) => [...currentMessages, commandValue])
            })
            const lastChild = messagesContainer.current?.lastChild as HTMLElement
            lastChild.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            })
          }}
          onCommandEnter={(command, args) => {
            switch (command) {
              case '/pomodoro':
                onPomodoro(args)
                break
            }
          }}
        />
      </div>
    </ChatProvider>
  )
}

const CHAT_POMODORO_NAME = 'ChatPomodoro'

interface ChatPomodoroProps {
  start: boolean
  minutes?: number
  onStop: () => void
  show?: boolean
  onShowChange: (show: boolean) => void
  onShowChat?: () => void
}

const ChatPomodoro = ({
  start = false,
  minutes = 30,
  onStop,
  show = false,
  onShowChange,
}: ChatPomodoroProps) => {
  const context = useChatContext(CHAT_POMODORO_NAME)
  const [seconds] = useTimer(start, 60 * Math.min(minutes, 60))
  const [minimize, setMinimize] = React.useState(false)

  const onShowChat = () => {
    setMinimize(true)
    onShowChange(false)
  }

  const onShowPomodoro = () => {
    setMinimize(false)
    onShowChange(true)
  }

  return minimize ? (
    createPortal(
      <button className="justify-self-end" onClick={onShowPomodoro}>
        {formatSecondsIntoMinutesAndSeconds(seconds)}
      </button>,
      context.headerRef?.current ?? document.body
    )
  ) : (
    <ChatPomodoroImpl
      // key={minutes}
      show={show}
      onShowChat={onShowChat}
      onStop={onStop}
      seconds={seconds}
    >
      <p className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 text-4xl font-bold">
        {formatSecondsIntoMinutesAndSeconds(seconds)}
      </p>
    </ChatPomodoroImpl>
  )
}

interface ChatPomodoroImplProps {
  children?: React.ReactNode
  seconds?: number
  show?: boolean
  onStop?: () => void
  onShowChat?: () => void
}

const ChatPomodoroImpl = ({
  seconds = 30,
  show = false,
  onStop,
  onShowChat,
  children,
}: ChatPomodoroImplProps) => {
  const circleRef = React.useRef<SVGCircleElement>(null)
  const behindCircleRef = React.useRef<SVGCircleElement>(null)

  React.useEffect(() => {
    animate(circleRef.current!, { strokeDasharray: ['0,1', '1,1'] }, { duration: seconds })
    animate(behindCircleRef.current!, { strokeDasharray: ['0,1', '1,1'] }, { duration: seconds })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return show ? (
    <div className="justify-center items-center h-full flex flex-col">
      <div className="relative">
        <svg width="340" height="340" viewBox="0 0 80 80" className="transform -rotate-90">
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="3 1" />
            </filter>
          </defs>
          <circle
            cx="40"
            cy="40"
            r="30"
            pathLength="1"
            className="stroke-gray-700"
            style={{ strokeDashoffset: 0, strokeWidth: '4%', fill: 'none' }}
          />
          <circle
            ref={behindCircleRef}
            cx="40"
            cy="40"
            r="30"
            pathLength="1"
            strokeLinecap="round"
            className="stroke-pink-500"
            filter="url(#blur)"
            style={{
              strokeDashoffset: 0,
              strokeWidth: '4%',
              fill: 'none',
              strokeDasharray: '0, 1',
            }}
          />
          <circle
            ref={circleRef}
            cx="40"
            cy="40"
            r="30"
            pathLength="1"
            strokeLinecap="round"
            className="stroke-pink-500"
            style={{
              strokeDashoffset: 0,
              strokeWidth: '4%',
              fill: 'none',
              strokeDasharray: '0, 1',
            }}
          />
        </svg>
        {children}
      </div>
      <button className="hover:bg-gray-800 p-2.5 rounded-lg select-none" onClick={onStop}>
        <RiStopFill size={24} />
      </button>
      <button className="hover:bg-gray-800 p-2.5 rounded-lg text-sm" onClick={onShowChat}>
        Show chat
      </button>
    </div>
  ) : null
}
