import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AudioPlayer } from '@/features/audio-player'
import { Chat } from '@/features/chat'
import { Tasks } from '@/features/tasks'
import { api } from '@/services/api'
import { useToken, useUserAuthenticated } from '@/features/auth'
import { NotificationsProvider } from '@/components/Notification'

const queryClient = new QueryClient()

export function App() {
  const token = useToken()
  const userAuthenticated = useUserAuthenticated()

  if (token) {
    api.defaults.headers.authorization = `Bearer ${token}`
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        <TooltipPrimitive.Provider>
          <div className="flex flex-col min-h-screen">
            <div className="relative flex-1">
              <Chat />
              {userAuthenticated && <Tasks />}
            </div>
            <AudioPlayer />
          </div>
        </TooltipPrimitive.Provider>
      </NotificationsProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
