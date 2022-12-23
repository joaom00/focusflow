import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

type NotificationContextValue = {
  success: (message: string, options?: Omit<NotificationOptions, 'type' | 'message'>) => void
  error: (message: string, options?: Omit<NotificationOptions, 'type' | 'message'>) => void
}

const NotificationContext = React.createContext<NotificationContextValue | undefined>(undefined)

type NotificationOptions = {
  type: string
  message: string
  description?: string
  undoAction?: () => void
}

type NotificationsProps = {
  children: React.ReactNode
}

export const Notifications = ({ children }: NotificationsProps) => {
  const [notifications, setNotifications] = React.useState<Map<string, NotificationOptions>>(
    new Map()
  )

  const handleAddToast = React.useCallback((toast: NotificationOptions) => {
    setNotifications((current) => {
      const newMap = new Map(current)
      newMap.set(String(Date.now()), { ...toast })
      return newMap
    })
  }, [])

  const handleRemoveToast = React.useCallback((key: string) => {
    setNotifications((current) => {
      const newMap = new Map(current)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const handleDispatchSuccess = React.useCallback(
    (message: string) => handleAddToast({ message, type: 'success' }),
    [handleAddToast]
  )

  const handleDispatchError = React.useCallback(
    (message: string) => handleAddToast({ message, type: 'error' }),
    [handleAddToast]
  )

  return (
    <NotificationContext.Provider
      value={React.useMemo(
        () => ({
          success: handleDispatchSuccess,
          error: handleDispatchError,
        }),
        [handleDispatchSuccess, handleDispatchError]
      )}
    >
      <ToastPrimitive.Provider>
        {children}
        <AnimatePresence>
          {Array.from(notifications).map(([key, notification]) => (
            <ToastPrimitive.Root
              key={key}
              onOpenChange={(open) => {
                if (!open) handleRemoveToast(key)
              }}
              asChild
              forceMount
            >
              <motion.li
                className="flex bg-gray-800 w-[356px] min-h-[58px] rounded-md overflow-hidden"
                initial={{
                  y: 100,
                  scale: 0.6,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  transition: { duration: 0.15 },
                }}
                layout
              >
                <div className="flex-1 p-4 flex items-center">
                  <ToastPrimitive.Title className="text-sm font-medium">
                    {notification.message}
                  </ToastPrimitive.Title>

                  {notification.description && (
                    <ToastPrimitive.Description>
                      {notification.description}
                    </ToastPrimitive.Description>
                  )}
                </div>
                {notification.undoAction && (
                  <button
                    className="px-4 border-l border-gray-700 text-sm hover:bg-gray-750 duration-200"
                    onClick={notification.undoAction}
                  >
                    Undo
                  </button>
                )}
              </motion.li>
            </ToastPrimitive.Root>
          ))}
        </AnimatePresence>

        <ToastPrimitive.Viewport className="fixed flex flex-col gap-4 outline-none bottom-4 left-4 pointer-events-none" />
      </ToastPrimitive.Provider>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = React.useContext(NotificationContext)
  if (!context) throw new Error('useNotification must be used within Notifications')
  return context
}
