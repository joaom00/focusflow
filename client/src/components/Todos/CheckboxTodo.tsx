import * as Checkbox from '@radix-ui/react-checkbox'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { CheckIcon } from '../../icons/CheckIcon'

interface CheckboxTodoProps {
  id: string
  edit: boolean
  onClick?: () => void
}

const MotionCheckboxRoot = motion(Checkbox.Root)

export const CheckboxTodo = ({ id, edit, onClick }: CheckboxTodoProps) => {
  return (
    <MotionCheckboxRoot
      id={id}
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      className={clsx(
        'border-2 border-gray-500 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center radix-checked:bg-pink-500 radix-checked:border-transparent transition-colors ease-in-out duration-[250ms] ml-4 mt-3',
        edit ? 'z-40' : 'z-10'
      )}
      style={{ gridColumn: '1/2', gridRow: '1/2' }}
    >
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </MotionCheckboxRoot>
  )
}
