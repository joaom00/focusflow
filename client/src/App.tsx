import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AudioPlayer } from './components/AudioPlayer'
import { Chat } from '@/components/Chat'
import { Tasks } from '@/components/Tasks/Tasks'
import { api } from './lib/api'
import { useToken, useUserAuthenticated } from '@/stores'
import { Notifications } from '@/components/Notification'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } })

const useAxiosToken = () => {
  const token = useToken()

  if (token) {
    api.defaults.headers.authorization = `Bearer ${token}`
  }
}

function App() {
  useAxiosToken()
  const userAuthenticated = useUserAuthenticated()

  return (
    <QueryClientProvider client={queryClient}>
      <Notifications>
        <TooltipPrimitive.Provider>
          <div className="flex flex-col min-h-screen">
            <div className="relative flex-1">
              <Chat />
              {userAuthenticated && <Tasks />}
            </div>
            <AudioPlayer />
          </div>
        </TooltipPrimitive.Provider>
      </Notifications>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}


export default App
