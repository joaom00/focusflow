import React from 'react'
import { RiPlayFill, RiPauseFill } from 'react-icons/ri'

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const onRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = Number(event.currentTarget.value) / 100
    }
  }

  const onPlay = () => {
    audioRef.current?.play()
    setIsPlaying(true)
  }

  const onPause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  return (
    <div className="bg-gray-900/70 p-3 border-t border-t-gray-700 backdrop-blur-lg backdrop-saturate-[180%] flex justify-end items-center gap-20">
      {isPlaying ? (
        <button className="hover:bg-gray-800 p-2.5 rounded-lg select-none" onClick={onPause}>
          <RiPauseFill size={24} />
        </button>
      ) : (
        <button className="hover:bg-gray-800 p-2.5 rounded-lg select-none" onClick={onPlay}>
          <RiPlayFill size={24} />
        </button>
      )}
      <input type="range" min={0} max={100} onChange={onRangeChange} />
      <audio ref={audioRef} src="https://s2.radio.co/s83d70ae1d/listen" crossOrigin="" />
    </div>
  )
}
