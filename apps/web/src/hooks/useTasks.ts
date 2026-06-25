import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Task } from '@/types'

export function useTasks(contentId: string) {
  return useQuery<Task[]>({
    queryKey: ['tasks', contentId],
    queryFn: () => api.get('/tasks', { params: { contentId } }).then((r) => r.data),
    enabled: !!contentId,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; contentId: string; priority?: string }) =>
      api.post('/tasks', data).then((r) => r.data),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ['tasks', vars.contentId] }),
  })
}

export function useToggleTask(contentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/tasks/${id}/toggle`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', contentId] }),
  })
}

export function useDeleteTask(contentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', contentId] }),
  })
}
