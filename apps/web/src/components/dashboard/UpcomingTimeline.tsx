'use client'

import React from 'react'
import Link from 'next/link'
import {
  CHANNEL_LABELS,
  STATUS_COLORS,
  type Content,
} from '@/types'
import { formatDate } from '@/lib/utils'
import { Clock, ArrowRight, Calendar, CheckSquare } from 'lucide-react'

interface UpcomingTimelineProps {
  contents: Content[]
  isLoading?: boolean
}

export function UpcomingTimeline({ contents, isLoading }: UpcomingTimelineProps) {
  const upcomingScheduled = [...contents]
    .filter((c) => c.status === 'AGENDADO' && c.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 6)

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
          <Calendar size={12} />
          Próximos Lançamentos
        </p>
        <Link
          href="/calendar"
          className="text-[11px] font-bold flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
        >
          Ver Calendário <ArrowRight size={11} />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-14 rounded-xl" />
        </div>
      ) : upcomingScheduled.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
          <Clock size={20} className="mb-2 text-gray-600" />
          <p className="text-xs font-semibold text-gray-400">Nenhum lançamento agendado</p>
          <Link href="/kanban" className="mt-3 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
            Organizar no Kanban <ArrowRight size={11} />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {upcomingScheduled.map((c) => {
            const tasksDone  = c.tasks.filter((t) => t.completed).length
            const tasksTotal = c.tasks.length
            const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0

            return (
              <Link
                key={c.id}
                href={`/content/${c.id}`}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-200"
              >
                {/* Indicador de canal */}
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS['AGENDADO'] }}
                />

                {/* Conteúdo principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {CHANNEL_LABELS[c.channel]}
                    </span>
                    <span className="text-[10px] text-gray-500">·</span>
                    <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-0.5">
                      <Clock size={9} />
                      {formatDate(c.scheduledAt!)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-100 truncate group-hover:text-white transition-colors">
                    {c.title}
                  </p>
                </div>

                {/* Checklist */}
                {tasksTotal > 0 && (
                  <div className="flex-shrink-0 flex flex-col items-end gap-1 min-w-[64px]">
                    <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                      <CheckSquare size={10} className="text-emerald-400" />
                      {tasksDone}/{tasksTotal}
                    </span>
                    <div className="w-16 h-1 rounded-full overflow-hidden bg-white/10">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Seta */}
                <ArrowRight size={14} className="flex-shrink-0 text-gray-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
