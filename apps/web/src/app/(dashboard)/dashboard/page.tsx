'use client'

import { useContents } from '@/hooks/useContents'
import {
  CHANNEL_LABELS,
  CHANNEL_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ORDER,
  type ContentStatus,
  type Channel,
} from '@/types'
import { formatDate } from '@/lib/utils'
import { 
  Film, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  ListTodo, 
  LayoutGrid 
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
  bgGradient: string
  shadowColor: string
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bgGradient,
  shadowColor,
}: StatCardProps) {
  return (
    <div 
      className="card-hover p-6 flex items-center gap-5 relative overflow-hidden"
      style={{
        ['--border-hover' as any]: color,
        ['--shadow-glow' as any]: `0 0 25px ${shadowColor}`,
      }}
    >
      {/* Glow Decorativo de Fundo */}
      <div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity duration-300"
        style={{ background: color }}
      />
      
      {/* Container do Ícone com Gradiente */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
        style={{ 
          background: bgGradient,
          boxShadow: `0 4px 15px ${shadowColor}`,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Icon size={22} className="text-white" />
      </div>

      <div className="min-w-0 z-10">
        <p 
          className="text-3.5xl font-extrabold tracking-tight text-white" 
          style={{ 
            fontFamily: 'Outfit, sans-serif',
            lineHeight: 1
          }}
        >
          {value}
        </p>
        <p className="text-xxs font-bold uppercase tracking-widest mt-1.5" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: contents = [], isLoading } = useContents()

  const agendados = contents.filter((c) => c.status === 'AGENDADO').length
  const postados  = contents.filter((c) => c.status === 'POSTADO').length
  const emProd    = contents.filter((c) => !['IDEIA', 'POSTADO'].includes(c.status)).length

  // Ordena os conteúdos atualizados recentemente (últimos 4)
  const recentContents = [...contents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  // Filtra os próximos agendamentos futuros
  const upcomingScheduled = contents
    .filter((c) => c.status === 'AGENDADO' && c.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-8 max-w-6xl animate-fadeIn">
      
      {/* Banner de Boas Vindas com Design Premium */}
      <div 
        className="relative p-8 rounded-2xl border overflow-hidden flex flex-col justify-center min-h-[140px]"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.85) 0%, rgba(10, 10, 18, 0.95) 100%)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Glows de Fundo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-xxs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/10" style={{ fontSize: '10px' }}>
            Painel Geral
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-3 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Filmes & Críticas 🎬
          </h2>
          <p className="text-sm mt-1.5 text-gray-400 leading-relaxed">
            Gerencie suas pautas, roteiros e agendamentos do blog vibesfilm em um único painel integrado.
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          label="Total de Conteúdos" 
          value={contents.length} 
          icon={Film} 
          color="#7c6af7"
          bgGradient="linear-gradient(135deg, #7c6af7 0%, #b55fe6 100%)"
          shadowColor="rgba(124, 106, 247, 0.15)"
        />
        <StatCard 
          label="Em Produção" 
          value={emProd} 
          icon={TrendingUp} 
          color="#f59e0b"
          bgGradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          shadowColor="rgba(245, 158, 11, 0.15)"
        />
        <StatCard 
          label="Agendados" 
          value={agendados} 
          icon={Calendar} 
          color="#ec4899"
          bgGradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
          shadowColor="rgba(236, 72, 153, 0.15)"
        />
        <StatCard 
          label="Postados" 
          value={postados} 
          icon={CheckCircle} 
          color="#10b981"
          bgGradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          shadowColor="rgba(16, 185, 129, 0.15)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna da Esquerda: Pipeline & Canais */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Pipeline por Status */}
          <div className="card p-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest mb-6" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
              Estágios da Produção
            </h3>
            <div className="space-y-4">
              {STATUS_ORDER.map((status) => {
                const count = contents.filter((c) => c.status === status).length
                const pct = contents.length ? Math.round((count / contents.length) * 100) : 0
                return (
                  <div key={status} className="group">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-gray-300">
                        {STATUS_LABELS[status]}
                      </span>
                      <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
                        {count} {count === 1 ? 'item' : 'itens'} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          width: `${pct}%`, 
                          background: `linear-gradient(to right, ${STATUS_COLORS[status]}, ${STATUS_COLORS[status]}dd)`,
                          boxShadow: count > 0 ? `0 0 6px ${STATUS_COLORS[status]}40` : 'none'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Distribuição por Canais */}
          <div className="card p-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest mb-6" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
              Distribuição por Rede
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(CHANNEL_COLORS) as Channel[]).map((channel) => {
                const count = contents.filter((c) => c.channel === channel).length
                const color = CHANNEL_COLORS[channel]
                return (
                  <div 
                    key={channel}
                    className="p-3 rounded-xl border flex flex-col justify-between min-h-[85px] transition-all duration-200"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.01)',
                      borderColor: 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                      <span className="text-xxs font-bold uppercase tracking-wider text-gray-400" style={{ fontSize: '10px' }}>
                        {CHANNEL_LABELS[channel]}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {count}
                      </span>
                      <span className="text-xxs text-gray-500 font-semibold" style={{ fontSize: '9px' }}>
                        {count === 1 ? 'conteúdo' : 'conteúdos'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Agenda & Conteúdos Recentes */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Próximos Agendamentos */}
          <div className="card p-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest mb-5" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
              Próximos Lançamentos
            </h3>
            {isLoading ? (
              <div className="skeleton h-20 rounded-xl" />
            ) : upcomingScheduled.length === 0 ? (
              <div className="p-6 text-center border border-dashed rounded-xl" style={{ borderColor: 'var(--border)', background: 'rgba(255, 255, 255, 0.01)' }}>
                <Clock size={20} className="mx-auto mb-2 text-gray-500" />
                <p className="text-xs text-gray-400">Nenhum conteúdo agendado para os próximos dias.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {upcomingScheduled.map((c) => {
                  const tasksDone = c.tasks.filter((t) => t.completed).length
                  const tasksTotal = c.tasks.length
                  return (
                    <Link
                      key={c.id}
                      href={`/content/${c.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(124, 106, 247, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.03)';
                      }}
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`badge badge-${c.channel.toLowerCase().replace('_', '-')}`}>
                            {CHANNEL_LABELS[c.channel]}
                          </span>
                          <span className="text-xxs font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/10 flex items-center gap-1" style={{ fontSize: '9px' }}>
                            <Clock size={10} />
                            {formatDate(c.scheduledAt!)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-2 truncate">
                          {c.title}
                        </h4>
                      </div>
                      
                      {/* Status de checklist */}
                      <div className="mt-3 sm:mt-0 flex-shrink-0 flex items-center gap-2.5">
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-300">
                            {tasksTotal > 0 ? `${tasksDone}/${tasksTotal} checklist` : 'Sem checklist'}
                          </p>
                          {tasksTotal > 0 && (
                            <div className="w-24 h-1.5 rounded-full overflow-hidden mt-1.5 bg-white/5 ml-auto">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: `${Math.round((tasksDone / tasksTotal) * 100)}%` }} 
                              />
                            </div>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 border border-purple-500/15">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Conteúdos Recentes (Reformulado como Cards) */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                Atualizados Recentemente
              </h3>
              <Link 
                href="/kanban" 
                className="text-xs font-bold flex items-center gap-1 group hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                <span>Acessar Kanban</span>
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="skeleton h-28 rounded-xl" />
                <div className="skeleton h-28 rounded-xl" />
              </div>
            ) : recentContents.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-xl" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs text-gray-400">Nenhum conteúdo encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentContents.map((c) => {
                  const tasksDone = c.tasks.filter((t) => t.completed).length
                  const tasksTotal = c.tasks.length
                  const progressPct = tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0
                  
                  return (
                    <Link
                      key={c.id}
                      href={`/content/${c.id}`}
                      className="p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[125px] hover:-translate-y-1"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(124, 106, 247, 0.25)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div>
                        {/* Tags / Badges superiores */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`badge badge-${c.channel.toLowerCase().replace('_', '-')}`}>
                            {CHANNEL_LABELS[c.channel]}
                          </span>
                          
                          {/* Dot de Status com Glow */}
                          <div className="flex items-center gap-1.5">
                            <div 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ 
                                background: STATUS_COLORS[c.status],
                                boxShadow: `0 0 6px ${STATUS_COLORS[c.status]}` 
                              }} 
                            />
                            <span className="text-[10px] font-semibold text-gray-400">
                              {STATUS_LABELS[c.status]}
                            </span>
                          </div>
                        </div>

                        {/* Título do Card */}
                        <h4 className="text-sm font-extrabold text-white mt-3 line-clamp-2 leading-snug">
                          {c.title}
                        </h4>
                      </div>

                      {/* Progresso de Tarefas do Card */}
                      <div className="mt-4 pt-3 border-t border-white/[0.03]">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mb-1">
                          <span className="flex items-center gap-1">
                            <ListTodo size={11} />
                            {tasksTotal > 0 ? `${tasksDone}/${tasksTotal} concluídas` : 'Sem tarefas'}
                          </span>
                          {tasksTotal > 0 && <span>{progressPct}%</span>}
                        </div>
                        {tasksTotal > 0 && (
                          <div className="h-1 rounded-full overflow-hidden bg-white/5">
                            <div 
                              className="h-full rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${progressPct}%`,
                                background: progressPct === 100 
                                  ? 'linear-gradient(to right, #10b981, #059669)'
                                  : 'linear-gradient(to right, var(--accent), var(--accent-secondary))'
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
        </div>
      </div>
    </div>
  )
}
