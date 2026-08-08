'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CHANNEL_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  type Content,
  type ContentStatus,
} from '@/types'
import { formatDate } from '@/lib/utils'
import { ArrowRight, Clock, ListTodo, Sparkles, Search, Filter } from 'lucide-react'

interface RecentContentsGridProps {
  contents: Content[]
  isLoading?: boolean
}

export function RecentContentsGrid({ contents, isLoading }: RecentContentsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL')

  // Sort by updatedAt descending
  const allRecent = [...contents].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const filteredContents = allRecent.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter
    return matchesSearch && matchesStatus
  }).slice(0, 6)

  return (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 border border-purple-500/15">
            <Sparkles size={16} />
          </div>
          <div>
            <h3
              className="text-sm font-extrabold uppercase tracking-wider text-white"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Atualizados Recentemente
            </h3>
            <p className="text-[11px] font-medium text-gray-400">
              Últimas modificações no acervo de produção
            </p>
          </div>
        </div>

        <Link
          href="/kanban"
          className="text-xs font-bold flex items-center gap-1 group text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>Abrir Quadro Kanban</span>
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar nos recentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
              selectedStatusFilter === 'ALL'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-white/[0.02] text-gray-400 border border-white/[0.05] hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedStatusFilter('ROTEIRO')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
              selectedStatusFilter === 'ROTEIRO'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/[0.02] text-gray-400 border border-white/[0.05] hover:text-white'
            }`}
          >
            Roteiros
          </button>
          <button
            onClick={() => setSelectedStatusFilter('AGENDADO')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
              selectedStatusFilter === 'AGENDADO'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'bg-white/[0.02] text-gray-400 border border-white/[0.05] hover:text-white'
            }`}
          >
            Agendados
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-xl bg-white/[0.01] border-white/10">
          <p className="text-xs text-gray-400">Nenhum conteúdo encontrado para esta busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((c) => {
            const tasksDone = c.tasks.filter((t) => t.completed).length
            const tasksTotal = c.tasks.length
            const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0
            const channelKey = c.channel.toLowerCase().replace('_', '-')
            const statusColor = STATUS_COLORS[c.status]

            return (
              <Link
                key={c.id}
                href={`/content/${c.id}`}
                className="group p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[140px] hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(255, 255, 255, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                  e.currentTarget.style.borderColor = 'rgba(124, 106, 247, 0.3)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div>
                  {/* Top Badges & Glow Dot */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`badge badge-${channelKey}`}>
                      {CHANNEL_LABELS[c.channel]}
                    </span>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: statusColor,
                          boxShadow: `0 0 6px ${statusColor}`,
                        }}
                      />
                      <span className="text-[10px] font-semibold text-gray-300">
                        {STATUS_LABELS[c.status]}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-extrabold text-white mt-3 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                    {c.title}
                  </h4>
                </div>

                {/* Progress Bar & Footer */}
                <div className="mt-4 pt-3 border-t border-white/[0.04]">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mb-1.5">
                    <span className="flex items-center gap-1">
                      <ListTodo size={11} className="text-purple-400" />
                      {tasksTotal > 0 ? `${tasksDone}/${tasksTotal} tarefas` : 'Sem tarefas'}
                    </span>
                    {tasksTotal > 0 && <span>{progressPct}%</span>}
                  </div>

                  {tasksTotal > 0 && (
                    <div className="h-1 rounded-full overflow-hidden bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPct}%`,
                          background:
                            progressPct === 100
                              ? 'linear-gradient(to right, #10b981, #059669)'
                              : 'linear-gradient(to right, var(--accent), var(--accent-secondary))',
                        }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
