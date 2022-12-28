import { useQueryClient } from '@tanstack/react-query'
import shallow from 'zustand/shallow'

import { useNotification } from '../Notification'
import { useTaskStore, useTaskActions } from './stores'
import { useCreateTaskMutation, useDeleteTaskMutation, useUndoDeleteTaskMutation } from './queries'

import type { Task } from './Tasks'

/* -------------------------------------------------------------------------------------------------
 * useHandleCopyText
 * -----------------------------------------------------------------------------------------------*/

export const useHandleCopyText = () => {
  const taskValue = useTaskStore((state) => state.value)
  const notification = useNotification()

  return () => {
    window.navigator.clipboard.writeText(taskValue)
    notification.success('Text copied!')
  }
}

/* -------------------------------------------------------------------------------------------------
 * useHandleEdit
 * -----------------------------------------------------------------------------------------------*/

export const useHandleEdit = () => {
  const { setEdit } = useTaskActions()

  return () => {
    setTimeout(() => {
      setEdit(true)
    }, 1)
  }
}

/* -------------------------------------------------------------------------------------------------
 * useHandleInsertTaskBelow
 * -----------------------------------------------------------------------------------------------*/

export const useHandleInsertTaskBelow = () => {
  const queryClient = useQueryClient()
  const { insertTaskBelow } = useTaskActions()

  return () => {
    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], insertTaskBelow)
    }, 1)
  }
}

/* -------------------------------------------------------------------------------------------------
 * useHandleDuplicateTask
 * -----------------------------------------------------------------------------------------------*/

export const useHandleDuplicateTask = () => {
  const queryClient = useQueryClient()
  const createTask = useCreateTaskMutation()
  const task = useTaskStore((state) => ({ status: state.status, value: state.value }), shallow)
  const { generateTaskWithPositionBelow, duplicateTask } = useTaskActions()

  return () => {
    const currentTasks = queryClient.getQueryData<Task[]>(['tasks'])
    if (!currentTasks) return

    const duplicatedTask = generateTaskWithPositionBelow(currentTasks)
    duplicatedTask.edit = false
    duplicatedTask.status = task.status
    duplicatedTask.content = task.value

    setTimeout(() => {
      queryClient.setQueryData<Task[]>(['tasks'], duplicateTask(duplicatedTask))
      createTask.mutate({ ...duplicatedTask, insertTaskBelow: false })
    }, 1)
  }
}

/* -------------------------------------------------------------------------------------------------
 * useHandleDelete
 * -----------------------------------------------------------------------------------------------*/

export const useHandleDelete = () => {
  const deleteTask = useDeleteTaskMutation()
  const undoDeleteTask = useUndoDeleteTaskMutation()
  const taskId = useTaskStore((state) => state.id)
  const notification = useNotification()

  return () => {
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        notification.success('Task deleted', {
          undoAction: () => 
            undoDeleteTask.mutate(taskId)
          ,
        })
      },
    })
  }
}
