
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import cuid from 'cuid'
import { api } from '@/lib/api'

import type { Task } from '@/components/Tasks/Tasks'

/* -------------------------------------------------------------------------------------------------
 * useTasksQuery
 * -----------------------------------------------------------------------------------------------*/

const ONE_MINUTE = 1000 * 60 * 1

export const useTasksQuery = () => {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('tasks')
      return data
    },
    staleTime: ONE_MINUTE,
    retry: 0,
  })
}

/* -------------------------------------------------------------------------------------------------
 * useCreateTaskMutation
 * -----------------------------------------------------------------------------------------------*/

type CreateTaskPayload = {
  id: string
  content: string
  position: string
  insertTaskBelow?: boolean
}

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => api.post('tasks', payload),
    onMutate: async ({ id, content, insertTaskBelow = true }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      queryClient.setQueryData<Task[]>(['tasks'], (currentTasks) => {
        if (!currentTasks) return undefined

        const currentFocusedTask = currentTasks.find((task) => task.id === id)
        if (!currentFocusedTask) return currentTasks
        const currentFocusedTaskIndex = currentTasks.findIndex((task) => task.id === id)

        currentFocusedTask.content = content
        currentFocusedTask.edit = false

        if (!insertTaskBelow) {
          return [
            ...currentTasks.slice(0, currentFocusedTaskIndex),
            currentFocusedTask,
            ...currentTasks.slice(currentFocusedTaskIndex + 1),
          ]
        }

        const currentPosition = currentFocusedTask.position
        const nextTask = currentTasks[currentFocusedTaskIndex + 1]
        let newTaskPosition = parseFloat(currentPosition) + 1
        if (nextTask) {
          const nextTaskPosition = nextTask.position
          newTaskPosition = (parseFloat(currentPosition) + parseFloat(nextTaskPosition)) / 2
        }
        const newTask: Task = {
          id: cuid(),
          edit: true,
          status: 'TODO',
          content: '',
          position: String(newTaskPosition),
        }

        return [
          ...currentTasks.slice(0, currentFocusedTaskIndex),
          currentFocusedTask,
          newTask,
          ...currentTasks.slice(currentFocusedTaskIndex + 1),
        ]
      })

      return { previousTasks }
    },
  })
}

/* -------------------------------------------------------------------------------------------------
 * useUpdateTaskMutation
 * -----------------------------------------------------------------------------------------------*/

type UpdateTaskPayload = {
  id: string
  content: string
  insertTaskBelow?: true
}

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: UpdateTaskPayload) => api.patch(`tasks/${id}`, { content }),
    onMutate: async ({ id, content, insertTaskBelow }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData(['tasks'])

      queryClient.setQueryData<Task[]>(['tasks'], (currentTasks) => {
        if (!currentTasks) return undefined

        const currentFocusedTask = currentTasks.find((currentTask) => currentTask.id === id)
        if (!currentFocusedTask) return currentTasks
        const currentFocusedTaskIndex = currentTasks.findIndex(
          (currentTask) => currentTask.id === id
        )

        currentFocusedTask.content = content
        currentFocusedTask.edit = false

        if (!insertTaskBelow) {
          return [
            ...currentTasks.slice(0, currentFocusedTaskIndex),
            currentFocusedTask,
            ...currentTasks.slice(currentFocusedTaskIndex + 1),
          ]
        }

        const currentPosition = currentFocusedTask.position
        const nextTask = currentTasks[currentFocusedTaskIndex + 1]
        let newTaskPosition = parseFloat(currentPosition) + 1
        if (nextTask) {
          const nextTaskPosition = nextTask.position
          newTaskPosition = (parseFloat(currentPosition) + parseFloat(nextTaskPosition)) / 2
        }
        const newTask: Task = {
          id: cuid(),
          edit: true,
          status: 'TODO',
          content: '',
          position: String(newTaskPosition),
        }

        return [
          ...currentTasks.slice(0, currentFocusedTaskIndex),
          currentFocusedTask,
          newTask,
          ...currentTasks.slice(currentFocusedTaskIndex + 1),
        ]
      })

      return { previousTasks }
    },
  })
}

/* -------------------------------------------------------------------------------------------------
 * useDeleteTaskMutation
 * -----------------------------------------------------------------------------------------------*/

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`tasks/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      queryClient.setQueryData<Task[]>(['tasks'], (currentTasks) =>
        currentTasks ? currentTasks.filter((task) => task.id !== id) : undefined
      )
      return { previousTasks }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks)
    },
  })
}

/* -------------------------------------------------------------------------------------------------
 * useUndoDeleteTaskMutation
 * -----------------------------------------------------------------------------------------------*/

export const useUndoDeleteTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.patch(`tasks/${id}/undo`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    // onMutate: async (id) => {
    //   await queryClient.cancelQueries({ queryKey: ['tasks'] })
    //   const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

    //   queryClient.setQueryData<Task[]>(['tasks'], (currentTasks) =>
    //     currentTasks ? currentTasks.filter((task) => task.id !== id) : undefined
    //   )
    //   return { previousTasks }
    // },
    // onError: (_err, _id, context) => {
    //   queryClient.setQueryData(['tasks'], context?.previousTasks)
    // },
  })
}
