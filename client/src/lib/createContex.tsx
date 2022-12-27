import React from 'react'
import { StoreApi, useStore } from 'zustand'

export function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext)

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...context } = props
    // Only re-memoize when prop values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useContext(consumerName: string) {
    const context = React.useContext(Context)
    if (context) return context
    if (defaultContext !== undefined) return defaultContext
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
  }

  Provider.displayName = rootComponentName + 'Provider'
  return [Provider, useContext] as const
}

/* -------------------------------------------------------------------------------------------------
 * Create context with zustand's store
 * -----------------------------------------------------------------------------------------------*/

export function createStoreContext<ContextValueType extends object | null>(
  rootComponentName: string
) {
  const Context = React.createContext<StoreApi<ContextValueType> | undefined>(undefined)

  function Provider(props: { store: StoreApi<ContextValueType> } & { children: React.ReactNode }) {
    const { children, store } = props
    return <Context.Provider value={store}>{children}</Context.Provider>

  }
  function useContext<StateSlice>(
    selector: (state: ContextValueType) => StateSlice,
    equalityFn?: (a: StateSlice, b: StateSlice) => boolean
  ) {
    const store = React.useContext(Context)
    if (!store) {
      throw new Error(`\`useContext\` must be used within \`${rootComponentName}\``)
    }
    return useStore<StoreApi<ContextValueType>, StateSlice>(store, selector, equalityFn)
  }

  Provider.displayName = rootComponentName + 'Provider'
  return [Provider, useContext] as const
}
