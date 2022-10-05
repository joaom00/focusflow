import * as Checkbox from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import shallow from 'zustand/shallow'
import { CheckIcon } from '../../icons/CheckIcon'
import { useTodo } from './Todo'
import { Todo } from './Todos'

interface CheckboxTodoProps {
  id: string
}

const MotionCheckboxRoot = motion(Checkbox.Root)

export const CheckboxTodo = ({ id: checkboxId }: CheckboxTodoProps) => {
  const { id, status, edit } = useTodo(
    (state) => ({ id: state.id, status: state.status, edit: state.edit }),
    shallow
  )
  const queryClient = useQueryClient()

  const updateStatus = useMutation(
    async (id: string) => {
      fetch(`http://localhost:3333/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status === 'TODO' ? 'DONE' : 'TODO' }),
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(['todos'])

        queryClient.setQueryData<Todo[]>(['todos'], (currentTodos) =>
          currentTodos
            ? currentTodos.map((todo) =>
                todo.id === id
                  ? { ...todo, status: todo.status === 'TODO' ? 'DONE' : 'TODO' }
                  : todo
              )
            : undefined
        )
      },
    }
  )

  const onDone = () => {
    /* updateStatus.mutate(id) */
  }

  return (
    <MotionCheckboxRoot
      id={checkboxId}
      whileTap={{ scale: 0.8 }}
      onClick={onDone}
      defaultChecked={status === 'DONE'}
      className={clsx(
        'border-2 border-gray-500 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center radix-checked:bg-pink-500 radix-checked:border-transparent transition-colors ease-in-out duration-[250ms] ml-4 mt-3',
        edit ? 'z-50 pointer-events-auto' : 'z-10'
      )}
      style={{ gridColumn: '1/2', gridRow: '1/2' }}
    >
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </MotionCheckboxRoot>
  )
}
