'use client'

import React from 'react'
import Link from 'next/link'
import {
  CHANNEL_LABELS,
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
    .slice(0, 4)

  return (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-500/10 text-pink-400 border border-pink-500/15">
            <Calendar size={16} />
          </div>
          <div>
            <h3
              className="text-sm font-extrabold uppercase tracking-wider text-white"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Próximos Lançamentos
            </h3>
            <p className="text-[11px] font-medium text-gray-400">
              Conteúdos agendados prontos para publicação
            </p>
          </div>
        </div>

        <Link
          href="/calendar"
          className="text-xs font-bold flex items-center gap-1 group text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>Ver Calendário</span>
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="skeleton h-20 rounded-xl" />
          <div className="skeleton h-20 rounded-xl" />
        </div>
      ) : upcomingScheduled.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-xl bg-white/[0.01] border-white/10">
          <Clock size={24} className="mx-auto mb-2 text-gray-500" />
          <p className="text-xs font-semibold text-gray-300">Nenhum lançamento agendado</p>
          <p className="text-[11px] text-gray-500 mt-1">
            Mude o status de um conteúdo para AGENDADO para acompanhar aqui.
          </p>
          <Link
            href="/kanban"
            className="btn-ghost text-xs font-bold mt-4 inline-flex items-center gap-1.5"
          >
            <span>Organizar no Kanban</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingScheduled.map((c) => {
            const tasksDone = c.tasks.filter((t) => t.completed).length
            const tasksTotal = c.tasks.length
            const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0
            const channelKey = c.channel.toLowerCase().replace('_', '-')

            return (
              <Link
                key={c.id}
                href={`/content/${c.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(255, 255, 255, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge badge-${channelKey}`}>
                      {CHANNEL_LABELS[c.channel]}
                    </span>

                    <span className="text-[10px] font-bold text-pink-300 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20 flex items-center gap-1">
                      <Clock size={11} className="text-pink-400" />
                      {formatDate(c.scheduledAt!)}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white mt-2 truncate group-hover:text-pink-300 transition-colors">
                    {c.title}
                  </h4>
                </div>

                {/* Task Checklist Pill */}
                <div className="mt-3 sm:mt-0 flex-shrink-0 flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-300 flex items-center gap-1 justify-end">
                      <CheckSquare size={12} className="text-emerald-400" />
                      {tasksTotal > 0 ? `${tasksDone}/${tasksTotal} checklist` : 'Sem checklist'}
                    </p>
                    {tasksTotal > 0 && (
                      <div className="w-24 h-1.5 rounded-full overflow-hidden mt-1.5 bg-white/10 ml-auto">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] text-gray-400 group-hover:bg-pink-500/20 group-hover:text-pink-300 border border-white/[0.05] transition-all">
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
