'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GripVertical, CheckSquare, Calendar } from 'lucide-react'
import type { Content, Channel } from '@/types'
import { CHANNEL_LABELS, STATUS_COLORS } from '@/types'

const CHANNEL_COLOR: Record<Channel, string> = {
  INSTAGRAM: '#f97316', 
  TIKTOK: '#cbd5e1', 
  YOUTUBE_SHORTS: '#ef4444',
  YOUTUBE_LONGO: '#ff0000', 
  BLOG: '#818cf8',
  LETTERBOXD: '#00e054',
}


interface KanbanCardProps {
  content: Content
  isDragging?: boolean
}

export function KanbanCard({ content, isDragging }: KanbanCardProps) {
  const completedTasks = content.tasks.filter((t) => t.completed).length
  const totalTasks = content.tasks.length
  const channelColor = CHANNEL_COLOR[content.channel]
  const statusColor = STATUS_COLORS[content.status]

  return (
    <Link
      href={`/content/${content.id}`}
      className="block rounded-xl border p-4 transition-all duration-200 group relative overflow-hidden"
      style={{
        background: isDragging 
          ? 'rgba(28, 28, 45, 0.95)' 
          : 'rgba(18, 18, 29, 0.55)',
        borderColor: isDragging 
          ? 'rgba(124, 106, 247, 0.6)' 
          : 'rgba(255, 255, 255, 0.05)',
        boxShadow: isDragging 
          ? '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 15px rgba(124, 106, 247, 0.25)' 
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
        transform: isDragging ? 'scale(1.02) rotate(1deg)' : 'none',
        cursor: 'grab',
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.background = 'rgba(28, 28, 45, 0.75)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.background = 'rgba(18, 18, 29, 0.55)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
          e.currentTarget.style.transform = 'none';
        }
      }}
    >
      {/* Indicador lateral sutil da cor do status */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-70"
        style={{ background: statusColor }}
      />

      {/* Topo: canal + drag handle */}
      <div className="flex items-center justify-between mb-3 pl-1">
        <span
          className={`badge badge-${content.channel.toLowerCase().replace('_', '-')}`}
        >
          {CHANNEL_LABELS[content.channel]}
        </span>
        <GripVertical
          size={14}
          className="opacity-0 group-hover:opacity-40 transition-opacity duration-200 cursor-grabbing"
          style={{ color: 'var(--text-muted)' }}
        />
      </div>

      {/* Título com fonte melhor */}
      <p
        className="text-sm font-semibold leading-relaxed mb-3 line-clamp-2 pl-1"
        style={{ 
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em'
        }}
      >
        {content.title}
      </p>

      {/* Footer: tasks + data */}
      <div className="flex items-center justify-between mt-4 pl-1">
        {totalTasks > 0 ? (
          <div className="flex items-center gap-1.5 p-1 px-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <CheckSquare 
              size={12} 
              style={{ color: completedTasks === totalTasks ? '#10b981' : 'var(--text-muted)' }} 
            />
            <span className="text-xxs font-bold" style={{ color: completedTasks === totalTasks ? '#10b981' : 'var(--text-secondary)', fontSize: '10px' }}>
              {completedTasks}/{totalTasks}
            </span>
          </div>
        ) : (
          <div /> // Spacer para manter a data alinhada à direita
        )}
        
        {content.scheduledAt && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Calendar size={11} className="text-gray-500" />
            <span className="text-xxs font-medium text-gray-400" style={{ fontSize: '11px' }}>
              {format(new Date(content.scheduledAt), 'dd MMM', { locale: ptBR })}
            </span>
          </div>
        )}
      </div>

      {/* Barra de progresso de tasks estilizada */}
      {totalTasks > 0 && (
        <div className="mt-3.5 h-1 rounded-full pl-1 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.round((completedTasks / totalTasks) * 100)}%`,
              background: `linear-gradient(to right, ${statusColor}, ${statusColor}cc)`,
              boxShadow: completedTasks === totalTasks ? '0 0 6px #10b981' : 'none'
            }}
          />
        </div>
      )}
    </Link>
  )
}
