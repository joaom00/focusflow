import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AudioPlayer } from './components/AudioPlayer'
import { Chat } from './components/Chat'
import { Todos } from './components/Todos/Todos'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipPrimitive.Provider>
        <div className="flex flex-col min-h-screen">
          <div className="relative flex-1">
            <Chat />
            <Todos />
          </div>
          <AudioPlayer />
        </div>
      </TooltipPrimitive.Provider>
      <Toaster position="bottom-center" containerClassName='select-none' />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App
