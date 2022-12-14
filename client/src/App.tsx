import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastBar, Toaster } from 'react-hot-toast'
import { AudioPlayer } from './components/AudioPlayer'
import { Button } from './components/Button'
import { Chat } from './components/Chat'
import { Tasks } from './components/Tasks/Tasks'
import { api } from './lib/api'
import { useToken, useUserAuthenticated } from '@/stores'

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
      <TooltipPrimitive.Provider>
        <div className="flex flex-col min-h-screen">
          <div className="relative flex-1">
            <Chat />
            {userAuthenticated && <Tasks />}
          </div>
          <AudioPlayer />
        </div>
      </TooltipPrimitive.Provider>
      <Toaster
        toastOptions={{
          style: {
            background: 'red',
            borderRadius: '99999px',
            padding: '0',
          },
        }}
        position="bottom-center"
        containerClassName="select-none"
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ message }) => (
              <div
                className="bg-gray-800 rounded-md grid gap-4 items-center w-[25rem]"
                style={{
                  gridTemplateAreas: '"title action" "description action"',
                  gridTemplateColumns: 'auto max-content',
                }}
              >
                <div className="text-sm text-white" style={{ gridArea: 'title' }}>
                  {message}
                </div>
                <Button style={{ gridArea: 'action' }}>Undo</Button>
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App
