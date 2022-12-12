import { Command as Cmdk } from 'cmdk'

import { usePomodoroActions, usePomodoroStore } from '../../stores'
import { Presence } from '../Presence'
import { Item } from '.'
import { composeEventHandlers } from '../../utils/composeEventHandlers'
import shallow from 'zustand/shallow'

export const PomodoroItems = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const pomodoro = usePomodoroStore(
    (state) => ({ started: state.started, minimized: state.minimized, paused: state.paused }),
    shallow
  )
  const { pause, stop, minimize } = usePomodoroActions()

  return (
    <Cmdk.Group heading="Pomodoro">
      <Presence present={pomodoro.started}>
        <Item
          value="/stop"
          description="Stop timer"
          onSelect={composeEventHandlers(onSelect, () => stop())}
        >
          /stop
        </Item>
      </Presence>

      <Presence present={!pomodoro.started}>
        <Item
          value="/pomodoro [workminutes] [breakminutes]"
          description="Starts Pomodoro of 30 minutes as default, and 60 minutes maximum"
          onSelect={onSelect}
        >
          /pomodoro [workMinutes] [breakMinutes]
        </Item>
      </Presence>

      <Presence present={pomodoro.minimized}>
        <Item
          value="/show-timer"
          description="Minimize chat and show timer"
          onSelect={composeEventHandlers(onSelect, () => minimize(false))}
        >
          /show-timer
        </Item>
      </Presence>

      <Presence present={pomodoro.started && !pomodoro.minimized}>
        <Item
          value="/minimize"
          description="Minimize timer and show chat"
          onSelect={composeEventHandlers(onSelect, () => minimize(true))}
        >
          /minimize
        </Item>
      </Presence>

      <Presence present={pomodoro.started && pomodoro.paused}>
        <Item
          value="/play-timer"
          description="Play timer"
          onSelect={composeEventHandlers(onSelect, () => pause(false))}
        >
          /play
        </Item>
      </Presence>

      <Presence present={pomodoro.started && !pomodoro.paused}>
        <Item
          value="/pause-timer"
          description="Pause timer"
          onSelect={composeEventHandlers(onSelect, () => pause())}
        >
          /pause
        </Item>
      </Presence>
    </Cmdk.Group>
  )
}
