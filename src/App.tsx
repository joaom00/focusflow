import { AudioPlayer } from './components/AudioPlayer'
import { Chat } from './components/Chat'

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <Chat />
      <AudioPlayer />
    </div>
  )
}

export default App
