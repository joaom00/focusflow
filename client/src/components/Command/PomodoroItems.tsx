import { Command as Cmdk } from 'cmdk'

import { usePomodoro, usePomodoroActions } from '../../stores'
import { Presence } from '../Presence'
import { Item } from '.'
import { composeEventHandlers } from '../../utils/composeEventHandlers'

export const PomodoroItems = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const pomodoro = usePomodoro()
  const pomodoroActions = usePomodoroActions()

  return (
    <Cmdk.Group heading="Pomodoro">
      <Presence present={pomodoro.started}>
        <Item
          value="/stop"
          description="Stop timer"
          onSelect={composeEventHandlers(onSelect, () => pomodoroActions.stop())}
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
          onSelect={composeEventHandlers(onSelect, () => pomodoroActions.minimize(false))}
        >
          /show-timer
        </Item>
      </Presence>

      <Presence present={pomodoro.started && !pomodoro.minimized}>
        <Item
          value="/minimize"
          description="Minimize timer and show chat"
          onSelect={composeEventHandlers(onSelect, () => pomodoroActions.minimize(true))}
        >
          /minimize
        </Item>
      </Presence>

      <Presence present={pomodoro.started && pomodoro.paused}>
        <Item
          value="/play-timer"
          description="Play timer"
          onSelect={composeEventHandlers(onSelect, () => pomodoroActions.pause(false))}
        >
          /play
        </Item>
      </Presence>

      <Presence present={pomodoro.started && !pomodoro.paused}>
        <Item
          value="/pause-timer"
          description="Pause timer"
          onSelect={composeEventHandlers(onSelect, () => pomodoroActions.pause())}
        >
          /pause
        </Item>
      </Presence>
    </Cmdk.Group>
  )
}
