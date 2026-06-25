'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
import { KanbanCard } from './KanbanCard'
import type { Content, ContentStatus } from '@/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/types'

interface KanbanColumnProps {
  status: ContentStatus
  contents: Content[]
}

export function KanbanColumn({ status, contents }: KanbanColumnProps) {
  const color = STATUS_COLORS[status]

  return (
    <div
      className="flex-shrink-0 w-72 flex flex-col rounded-2xl border transition-all duration-300"
      style={{ 
        background: 'rgba(11, 11, 19, 0.4)', 
        borderColor: 'rgba(255, 255, 255, 0.04)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Cabeçalho da Coluna com Barra Neon Colorida */}
      <div className="relative">
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" 
          style={{ 
            background: `linear-gradient(to right, ${color}, ${color}88)`,
            boxShadow: `0 1px 8px ${color}50` 
          }}
        />
        
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ 
                background: color,
                boxShadow: `0 0 8px ${color}`
              }} 
            />
            <span 
              className="text-xs font-bold uppercase tracking-wider" 
              style={{ 
                color: 'var(--text-primary)',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              {STATUS_LABELS[status]}
            </span>
          </div>
          <span
            className="text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-lg shadow-sm"
            style={{ 
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)`, 
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            {contents.length}
          </span>
        </div>
      </div>

      {/* Área de Droppable para os Cards */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-3.5 space-y-3 min-h-[140px] overflow-y-auto transition-all duration-300"
            style={{
              background: snapshot.isDraggingOver 
                ? `linear-gradient(180deg, ${color}05 0%, ${color}0d 100%)` 
                : 'transparent',
              maxHeight: 'calc(100vh - 220px)',
            }}
          >
            {contents.map((content, index) => (
              <Draggable key={content.id} draggableId={content.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="outline-none"
                  >
                    <KanbanCard content={content} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {contents.length === 0 && !snapshot.isDraggingOver && (
              <div
                className="text-xs text-center py-8 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1.5 transition-all duration-200 hover:border-purple-500/20"
                style={{ 
                  color: 'var(--text-muted)', 
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  background: 'rgba(255, 255, 255, 0.01)'
                }}
              >
                <span className="font-semibold">Lista Vazia</span>
                <span>Arraste um card para cá</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
