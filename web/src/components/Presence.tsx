import React from 'react'

interface PresenceProps {
  children: React.ReactElement
  present: boolean
}

export const Presence = ({ children, present }: PresenceProps) => {
  return present ? React.cloneElement(children) : null
}
