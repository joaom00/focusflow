import React from 'react'
import shallow from 'zustand/shallow'
import { usePomodoroStore } from '../stores/pomodoro'

export const useTimer = () => {
  const pomodoro = usePomodoroStore(
    (state) => ({
      workMinutes: state.workMinutes,
      breakMinutes: state.breakMinutes,
      started: state.started,
      paused: state.paused,
    }),
    shallow
  )
  const workInitialSeconds = 60 * pomodoro.workMinutes
  const breakInitialSeconds = 60 * pomodoro.breakMinutes
  const [seconds, setSeconds] = React.useState(workInitialSeconds)
  const [mode, setMode] = React.useState<'work' | 'break'>('work')
  const totalSecondsRef = React.useRef(workInitialSeconds)

  React.useEffect(() => {
    let timerId: ReturnType<typeof setInterval>

    if (pomodoro.started) {
      timerId = setInterval(() => {
        if (pomodoro.paused) return
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
  }, [
    seconds,
    pomodoro.started,
    pomodoro.paused,
    workInitialSeconds,
    breakInitialSeconds,
  ])

  return { seconds, setSeconds, mode, totalSeconds: totalSecondsRef.current }
}
