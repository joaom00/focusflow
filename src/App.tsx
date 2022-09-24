import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { AudioPlayer } from './components/AudioPlayer'
import { Chat } from './components/Chat'
import { Todos } from './components/Todos'

function App() {
  return (
    <TooltipPrimitive.Provider>
      <div className="flex flex-col min-h-screen">
        <div className="relative flex-1">
          <Chat />
          <Todos />
        </div>
        <AudioPlayer />
      </div>
    </TooltipPrimitive.Provider>
  )
}

export default App
