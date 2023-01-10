import { CircularProgress } from './CircularProgress'

type PomodoroProps = {
  value: number
  children: React.ReactNode
}

export const Pomodoro = ({ value, children }: PomodoroProps) => {
  return (
    <CircularProgress value={value} className="w-full align-middle" strokeWidth={5}>
      <CircularProgress.Trail className="stroke-gray-700" strokeLinecap="round" />

      <CircularProgress.Path
        className="stroke-pink-500"
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />
      <CircularProgress.Text
        className="text-sm font-bungee fill-white select-none"
        style={{ dominantBaseline: 'middle', textAnchor: 'middle' }}
      >
        {children}
      </CircularProgress.Text>
    </CircularProgress>
  )
}
