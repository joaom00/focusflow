import React from 'react'
import ReactDOM from 'react-dom'

type ContainerElement = HTMLDivElement | null
type ChatDialogContextValue = [
  ContainerElement,
  React.Dispatch<React.SetStateAction<ContainerElement>>
]
const ChatDialogContext = React.createContext<ChatDialogContextValue | undefined>(undefined)

type ChatDialogProviderProps = {
  children: React.ReactNode
}

export const ChatDialogProvider = (props: ChatDialogProviderProps) => {
  const chatDialogState = React.useState<ContainerElement>(null)
  return <ChatDialogContext.Provider value={chatDialogState} {...props} />
}

const useChatDialog = () => {
  const context = React.useContext(ChatDialogContext)
  if (!context) throw new Error('`useChatDialog` must be used within a `ChatDialogProvider`')
  return context
}

export const ChatDialog = () => {
  const [, setChatDialog] = useChatDialog()
  return <div ref={setChatDialog} className="absolute top-2 left-2 right-2" />
}

type ChatDialogPortalProps = { children: React.ReactNode }

export const ChatDialogPortal = ({ children }: ChatDialogPortalProps) => {
  const [container] = useChatDialog()
  return container ? ReactDOM.createPortal(children, container) : null
}
