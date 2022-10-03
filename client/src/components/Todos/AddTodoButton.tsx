import React from 'react'
import { PlusIcon } from '@radix-ui/react-icons'

interface AddTodoButtonProps {
  onClick?: () => void
}

export const AddTodoButton = React.forwardRef<HTMLButtonElement, AddTodoButtonProps>(
  ({ onClick }, forwardedRef) => {
    return (
      <div className="border-t border-t-gray-700 w-full py-1 px-2">
        <button
          ref={forwardedRef}
          type="button"
          className="text-sm flex items-center gap-2 rounded-lg text-gray-300 px-2 py-1 duration-200 relative add-task-button hover:text-white group transition-colors"
          onClick={onClick}
        >
          <div className="border-2 border-gray-400 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center group-hover:border-white transition-colors duration-200">
            <PlusIcon className="group-hover:text-white" />
          </div>
          New task
        </button>
      </div>
    )
  }
)

AddTodoButton.displayName = 'AddTodoButton'
