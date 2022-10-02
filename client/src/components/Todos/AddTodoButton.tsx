import React from 'react'
import { FiPlus } from 'react-icons/fi'

interface AddTodoButtonProps {
  onClick?: () => void
}

export const AddTodoButton = React.forwardRef<HTMLButtonElement, AddTodoButtonProps>(({onClick}, forwardedRef) => {
  return (
    <div className="border-t border-t-gray-700 w-full py-1 px-2">
      <button
        ref={forwardedRef}
        type="button"
        className="text-sm flex items-center gap-2 rounded-lg text-gray-300 px-2 py-1 duration-200 relative add-task-button"
        onClick={onClick}
      >
        <div className="border-2 border-gray-300 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center">
          <FiPlus className="text-gray-300" />
        </div>
        New task
      </button>
    </div>
  )
})

AddTodoButton.displayName = 'AddTodoButton'
