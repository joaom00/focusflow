import React from 'react'

type AnyFunction = (...args: any[]) => any

export function useEvent<T extends AnyFunction>(callback?: T) {
  const ref = React.useRef<AnyFunction | undefined>(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })
  React.useLayoutEffect(() => {
    ref.current = callback
  })
  return React.useCallback<AnyFunction>((...args) => ref.current?.apply(null, args), []) as T
}
