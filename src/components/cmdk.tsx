import { Command, useCommandState } from 'cmdk'

interface CmdkProps {
  onSelect: (value: string) => void
  open: boolean
  children?: React.ReactNode
}

export const Cmdk = ({ onSelect, open, children }: CmdkProps) => {
  return (
    <Command
      className={`border w-full px-1 rounded-md transition-colors ease-linear duration-100 ${
        open ? 'bg-gray-800 border-gray-700' : 'bg-transparent border-transparent'
      }`}
    >
      <CmdkEmpty open={open} />
      <CmdkList onSelect={onSelect} open={open} />
      {children}
    </Command>
  )
}

interface CmdkListProps {
  onSelect: (value: string) => void
  open: boolean
}

const CmdkList = ({ onSelect, open }: CmdkListProps) => {
  return open ? (
    <Command.List className="px-2 py-2 gap-10">
      <Command.Item
        className="px-2 py-1.5 rounded-sm cursor-pointer selected:bg-gray-750 text-sm font-medium select-none"
        value="/pomodoro [minute]"
        onSelect={onSelect}
      >
        /pomodoro [minute]
        <span className="block font-normal text-gray-400 text-sm mt-1">
          Starts Pomodoro of 30 minutes as default, and 60 minutes maximum
        </span>
      </Command.Item>
      <Command.Item
        className="px-2 py-1.5 rounded-sm cursor-pointer selected:bg-gray-750 text-sm font-medium select-none"
        value="/history"
        onSelect={onSelect}
      >
        /history
        <span className="block font-normal text-gray-400 text-sm mt-1">
          List the latest 20 played songs
        </span>
      </Command.Item>
    </Command.List>
  ) : null
}

interface CmdkEmptyProps {
  open: boolean
}

const CmdkEmpty = ({ open }: CmdkEmptyProps) => {
  const search = useCommandState((state) => state.search)
  return open ? (
    <Command.Empty className="text-center text-sm py-2 break-all">
      No command found for <p>&quot;{search}&quot;</p>
    </Command.Empty>
  ) : null
}
