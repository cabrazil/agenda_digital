import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Content, ContentStatus } from '@/types'

export function useContents(status?: string, channel?: string) {
  return useQuery<Content[]>({
    queryKey: ['contents', { status, channel }],
    queryFn: () =>
      api.get('/contents', { params: { status, channel } }).then((r) => r.data),
  })
}

export function useCalendarContents(startDate: string, endDate: string) {
  return useQuery<Content[]>({
    queryKey: ['contents', 'calendar', startDate, endDate],
    queryFn: () =>
      api
        .get('/contents/calendar', { params: { startDate, endDate } })
        .then((r) => r.data),
    enabled: !!startDate && !!endDate,
  })
}

export function useContent(id: string) {
  return useQuery<Content>({
    queryKey: ['contents', id],
    queryFn: () => api.get(`/contents/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['contents', 'stats'],
    queryFn: () => api.get('/contents/stats').then((r) => r.data),
  })
}

export function useCreateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Content>) => api.post('/contents', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contents'] }),
  })
}

export function useUpdateContent(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Content>) =>
      api.put(`/contents/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] })
      qc.invalidateQueries({ queryKey: ['contents', id] })
    },
  })
}

export function useUpdateStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      api.patch(`/contents/${id}/status`, { status }).then((r) => r.data),
    onMutate: async ({ id, status }) => {
      // Optimistic update para o Kanban
      await qc.cancelQueries({ queryKey: ['contents'] })
      const prev = qc.getQueryData<Content[]>(['contents', {}])
      if (prev) {
        qc.setQueryData(
          ['contents', {}],
          prev.map((c) => (c.id === id ? { ...c, status } : c)),
        )
      }
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['contents', {}], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['contents'] }),
  })
}

export function useDeleteContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/contents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contents'] }),
  })
}
