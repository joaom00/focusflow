import React from 'react'
import { RiPlayFill, RiPauseFill, RiVolumeUpFill, RiVolumeMuteFill } from 'react-icons/ri'
import shallow from 'zustand/shallow'
import { useAudioPlayerStore } from '../stores'
import * as SliderPrimitive from '@radix-ui/react-slider'

export const AudioPlayer = () => {
  const { play, isPlaying } = useAudioPlayerStore(
    (state) => ({
      play: state.play,
      isPlaying: state.playing,
    }),
    shallow
  )

  const [song, setSong] = React.useState({ title: '', artist: '', artwork_url: '' })
  const [volume, setVolume] = React.useState([50])
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const previouslyVolume = React.useRef(50)

  const onRangeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
      setVolume(value)
    }
  }

  const onPlay = () => {
    audioRef.current?.play()
    play(true)
  }

  const onPause = () => {
    audioRef.current?.pause()
    play(false)
  }

  React.useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
      return
    }
    audioRef.current?.pause()
  }, [isPlaying])

  React.useEffect(() => {
    async function getSongStatus() {
      const response = await fetch('https://public.radio.co/stations/s83d70ae1d/status')
      const data = await response.json()
      setSong({
        title: data.current_track.title.split(' - ')[1],
        artist: data.current_track.title.split(' - ')[0],
        artwork_url: data.current_track.artwork_url,
      })
    }
    getSongStatus()
  }, [])

  return (
    <div className="bg-gray-900/70 p-3 border-t border-t-gray-700 backdrop-blur-lg backdrop-saturate-[180%] flex items-center gap-5 px-5">
      <div className="flex-1 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden animate-spin-slow">
          <img className="w-full h-full object-cover" src={song.artwork_url} />
        </div>
        <div>
          <p className="font-bold">{song.title}</p>
          <p className="text-sm">{song.artist}</p>
        </div>
      </div>
      {isPlaying ? (
        <button className="hover:bg-gray-800 p-2 rounded-lg select-none" onClick={onPause}>
          <RiPauseFill size={24} />
        </button>
      ) : (
        <button className="hover:bg-gray-800 p-2 rounded-lg select-none" onClick={onPlay}>
          <RiPlayFill size={24} />
        </button>
      )}
      {volume[0] === 0 ? (
        <button
          className="hover:bg-gray-800 p-2 rounded-lg select-none"
          onClick={() => {
            if (audioRef.current) {
              setVolume([previouslyVolume.current])
              audioRef.current.volume = previouslyVolume.current / 100
            }
          }}
        >
          <RiVolumeMuteFill size={24} />
        </button>
      ) : (
        <button
          className="hover:bg-gray-800 p-2 rounded-lg select-none"
          onClick={() => {
            if (audioRef.current) {
              previouslyVolume.current = volume[0]
              audioRef.current.volume = 0
              setVolume([0])
            }
          }}
        >
          <RiVolumeUpFill size={24} />
        </button>
      )}
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-[150px] h-5 slider-root"
        defaultValue={[50]}
        aria-label="Volume"
        value={volume}
        onValueChange={onRangeChange}
      >
        <SliderPrimitive.Track className="bg-gray-400 relative flex-grow rounded-full h-[3px]">
          <SliderPrimitive.Range className="absolute bg-white h-full rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-5 h-5 bg-gray-100 shadow-md rounded-[10px] hover:bg-gray-200 outline-none focus:shadow-[0_0_0_5px_rgba(51,51,56,0.8)]" />
      </SliderPrimitive.Root>

      <audio ref={audioRef} src="https://s2.radio.co/s83d70ae1d/listen" crossOrigin="" />
    </div>
  )
}
