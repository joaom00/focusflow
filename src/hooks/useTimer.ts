import React from 'react'

export const useTimer = (timerStarted: boolean, initialSeconds: number) => {
  const [seconds, setSeconds] = React.useState(initialSeconds)

  React.useEffect(() => {
    let timerId: ReturnType<typeof setInterval>

    if (timerStarted) {
      timerId = setInterval(() => {
        setSeconds((currentSeconds) => currentSeconds - 1)
      }, 1000)
    }

    return () => clearInterval(timerId)
  }, [timerStarted])

  return [seconds, setSeconds] as const
}
