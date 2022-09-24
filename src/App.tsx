import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { AudioPlayer } from './components/AudioPlayer'
import { Chat } from './components/Chat'

function App() {

  return (
    <TooltipPrimitive.Provider>

    <div className="flex flex-col min-h-screen">
      <Chat />
      <AudioPlayer />
    </div>
    </TooltipPrimitive.Provider>
  )
}

export default App
