'use client'

import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { KanbanColumn } from './KanbanColumn'
import { useContents, useUpdateStatus } from '@/hooks/useContents'
import { STATUS_ORDER, type ContentStatus } from '@/types'
import { toast } from 'sonner'

export function KanbanBoard() {
  const { data: contents = [], isLoading } = useContents()
  const updateStatus = useUpdateStatus()

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId as ContentStatus
    updateStatus.mutate(
      { id: draggableId, status: newStatus },
      {
        onError: () => toast.error('Erro ao mover o card'),
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="flex-shrink-0 w-64 h-64 skeleton rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
        {STATUS_ORDER.map((status) => {
          const columnContents = contents.filter((c) => c.status === status)
          return (
            <KanbanColumn key={status} status={status} contents={columnContents} />
          )
        })}
      </div>
    </DragDropContext>
  )
}
