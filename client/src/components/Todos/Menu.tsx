import * as ContextMenu from '@radix-ui/react-context-menu'
import { FiCopy, FiPlus } from 'react-icons/fi'

interface MenuProps {
  children: React.ReactNode
}

export const Menu = ({ children }: MenuProps) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[300px] w-full rounded-lg bg-gray-850 py-1 text-sm shadow-lg shadow-black/50 border border-gray-600">
          <ContextMenu.Item className="flex items-center gap-2 px-3 hover:bg-gray-750 cursor-pointer h-[30px] text-gray-200">
            <FiCopy />
            Copy task
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-[1px] bg-gray-600 my-1" />
          <ContextMenu.Item className="flex items-center gap-2 px-3 hover:bg-gray-750 cursor-pointer h-[30px] text-gray-200">
            <FiPlus />
            Insert task below
          </ContextMenu.Item>
          <ContextMenu.Item className="flex items-center gap-2 px-3 hover:bg-gray-750 cursor-pointer h-[30px] text-gray-200">
            <FiCopy />
            Duplicate task
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
