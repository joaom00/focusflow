import React from 'react'
import shallow from 'zustand/shallow'
import { usePomodoroStore } from '../stores'

type Props = {
  timerStarted: boolean
}

export const useTimer = ({ timerStarted }: Props) => {
  const { started, isPaused, workMinutes, breakMinutes } = usePomodoroStore(
    (state) => ({
      started: state.started,
      isPaused: state.paused,
      workMinutes: state.workMinutes,
      breakMinutes: state.breakMinutes,
    }),
    shallow
  )
  console.log({workMinutes})
  const workInitialSeconds = 60 * workMinutes
  const breakInitialSeconds = 60 * breakMinutes
  const [seconds, setSeconds] = React.useState(workInitialSeconds)
  const [mode, setMode] = React.useState<'work' | 'break'>('work')
  const totalSecondsRef = React.useRef(workInitialSeconds)

  React.useEffect(() => {
    let timerId: ReturnType<typeof setInterval>

    if (timerStarted) {
      timerId = setInterval(() => {
        if (isPaused) return
        setSeconds((currentSeconds) => currentSeconds - 1)
      }, 1000)

      if (seconds === 0) {
        clearInterval(timerId)
        setMode((currentMode) => {
          if (currentMode === 'work') {
            setSeconds(breakInitialSeconds)
            totalSecondsRef.current = breakInitialSeconds
            return 'break'
          }
          setSeconds(workInitialSeconds)
          totalSecondsRef.current = workInitialSeconds
          return 'work'
        })
      }
    }

    return () => clearInterval(timerId)
  }, [timerStarted, seconds, started, isPaused, workInitialSeconds, breakInitialSeconds])

  return { seconds, setSeconds, mode, totalSeconds: totalSecondsRef.current }
}
