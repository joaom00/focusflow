import React from 'react'

type UpdaterFn<TState> = (currentState: TState) => TState

type Result<TState> = [state: TState, wrappedSetState: (update: TState | UpdaterFn<TState>) => void]

export const useLocalStorage = <TState>(key: string, initialValue: TState): Result<TState> => {
  const [state, setState] = React.useState<TState>(() => {
    try {
      const item = window.localStorage.getItem(key)

      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)

      return initialValue
    }
  })

  const wrappedSetState = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (update: any) => {
      try {
        setState((currentState) => {
          const nextState = typeof update === 'function' ? update(currentState) : update

          window.localStorage.setItem(key, JSON.stringify(nextState))
          return nextState
        })
      } catch (error) {
        console.error(error)
      }
    },
    [key]
  )

  return [state, wrappedSetState]
}
