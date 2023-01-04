import * as Checkbox from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import shallow from 'zustand/shallow'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

import { api } from '@/services/api'
import { CheckIcon } from '@/icons/CheckIcon'
import { useTaskStore } from '../stores/task'

import type { Task } from '../types'

interface CheckboxTaskProps {
  id: string
}

const MotionCheckboxRoot = motion(Checkbox.Root)

export const CheckboxTask = ({ id: checkboxId }: CheckboxTaskProps) => {
  const task = useTaskStore(
    (state) => ({ id: state.id, status: state.status, edit: state.edit }),
    shallow
  )
  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      api.patch(`tasks/${id}`, {
        status: task.status === 'TODO' ? 'DONE' : 'TODO',
      })
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      queryClient.setQueryData<Task[]>(['tasks'], (currentTasks) =>
        currentTasks
          ? currentTasks.map((currentTask) =>
              currentTask.id === task.id
                ? { ...currentTask, status: currentTask.status === 'TODO' ? 'DONE' : 'TODO' }
                : currentTask
            )
          : undefined
      )
    },
  })

  const handleClick = () => {
    updateStatusMutation.mutate(task.id)
  }

  return (
    <MotionCheckboxRoot
      id={checkboxId}
      whileTap={{ scale: 0.8 }}
      onClick={handleClick}
      defaultChecked={task.status === 'DONE'}
      className={clsx(
        'border-2 border-gray-500 w-[14px] h-[14px] rounded-[5px] flex justify-center items-center radix-checked:bg-pink-500 radix-checked:border-transparent transition-colors ease-in-out duration-[250ms] ml-4 mt-3',
        task.edit ? 'z-50 pointer-events-auto' : 'z-10'
      )}
      style={{ gridColumn: '1/2', gridRow: '1/2' }}
    >
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </MotionCheckboxRoot>
  )
}
