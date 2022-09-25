import shallow from 'zustand/shallow'
import { Command as Cmdk } from 'cmdk'

import { usePomodoroStore } from '../../stores'
import { Presence } from '../Presence'
import { Item } from '.'
import { composeEventHandlers } from '../../utils/composeEventHandlers'

export const PomodoroItems = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const { started, paused, minimized, minimizePomodoro, pausePomodoro, stopPomodoro } =
    usePomodoroStore(
      (state) => ({
        started: state.started,
        paused: state.paused,
        minimized: state.minimized,
        minimizePomodoro: state.minimize,
        pausePomodoro: state.pause,
        stopPomodoro: state.stop,
      }),
      shallow
    )

  return (
    <Cmdk.Group heading="Pomodoro">
      <Presence present={started}>
        <Item
          value="/stop"
          description="Stop timer"
          onSelect={composeEventHandlers(onSelect, () => stopPomodoro())}
        >
          /stop
        </Item>
      </Presence>

      <Presence present={!started}>
        <Item
          value="/pomodoro [workminutes] [breakminutes]"
          description="Starts Pomodoro of 30 minutes as default, and 60 minutes maximum"
          onSelect={onSelect}
        >
          /pomodoro [workMinutes] [breakMinutes]
        </Item>
      </Presence>

      <Presence present={minimized}>
        <Item
          value="/show-timer"
          description="Minimize chat and show timer"
          onSelect={composeEventHandlers(onSelect, () => minimizePomodoro(false))}
        >
          /show-timer
        </Item>
      </Presence>

      <Presence present={started && !minimized}>
        <Item
          value="/minimize"
          description="Minimize timer and show chat"
          onSelect={composeEventHandlers(onSelect, () => minimizePomodoro(true))}
        >
          /minimize
        </Item>
      </Presence>

      <Presence present={started && paused}>
        <Item
          value="/play-timer"
          description="Play timer"
          onSelect={composeEventHandlers(onSelect, () => pausePomodoro(false))}
        >
          /play
        </Item>
      </Presence>

      <Presence present={started && !paused}>
        <Item
          value="/pause-timer"
          description="Pause timer"
          onSelect={composeEventHandlers(onSelect, () => pausePomodoro())}
        >
          /pause
        </Item>
      </Presence>
    </Cmdk.Group>
  )
}
