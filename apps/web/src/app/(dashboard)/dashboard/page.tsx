'use client'

import { useContents, useStats } from '@/hooks/useContents'
import {
  CHANNEL_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ORDER,
  type ContentStatus,
  type Channel,
} from '@/types'
import { formatDate } from '@/lib/utils'
import { Film, TrendingUp, Calendar, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
        background: `linear-gradient(135deg, rgba(18, 18, 29, 0.7) 0%, rgba(24, 24, 38, 0.4) 100%)`,
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Glow Decorativo de Fundo */}
      <div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity duration-300"
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
          className="text-3xl font-extrabold tracking-tight" 
          style={{ 
            color: 'var(--text-primary)',
            fontFamily: 'Outfit, sans-serif'
          }}
        >
          {value}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-secondary)' }}>
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

  const recentContents = [...contents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)

  const CHANNEL_COLOR: Record<Channel, string> = {
    INSTAGRAM: '#f97316', 
    TIKTOK: '#e2e8f0', 
    YOUTUBE_SHORTS: '#ef4444',
    YOUTUBE_LONGO: '#ff0000', 
    BLOG: '#818cf8',
  }

  return (
    <div className="space-y-8 max-w-6xl animate-fadeIn">
      {/* Seção de Boas Vindas */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Filmes & Críticas 🎬
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Gerencie suas pautas, roteiros e agendamentos do blog vibesfilm em um único painel.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          label="Total de Conteúdos" 
          value={contents.length} 
          icon={Film} 
          color="#7c6af7"
          bgGradient="linear-gradient(135deg, #7c6af7 0%, #b55fe6 100%)"
          shadowColor="rgba(124, 106, 247, 0.25)"
        />
        <StatCard 
          label="Em Produção" 
          value={emProd} 
          icon={TrendingUp} 
          color="#f59e0b"
          bgGradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          shadowColor="rgba(245, 158, 11, 0.25)"
        />
        <StatCard 
          label="Agendados" 
          value={agendados} 
          icon={Calendar} 
          color="#ec4899"
          bgGradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
          shadowColor="rgba(236, 72, 153, 0.25)"
        />
        <StatCard 
          label="Postados" 
          value={postados} 
          icon={CheckCircle} 
          color="#10b981"
          bgGradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          shadowColor="rgba(16, 185, 129, 0.25)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline por Status */}
        <div className="card p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--text-secondary)' }}>
              Estágio da Produção
            </h3>
            <div className="space-y-4">
              {STATUS_ORDER.map((status) => {
                const count = contents.filter((c) => c.status === status).length
                const pct = contents.length ? Math.round((count / contents.length) * 100) : 0
                return (
                  <div key={status} className="group">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {STATUS_LABELS[status]}
                      </span>
                      <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
                        {count} {count === 1 ? 'item' : 'itens'} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          width: `${pct}%`, 
                          background: `linear-gradient(to right, ${STATUS_COLORS[status]}, ${STATUS_COLORS[status]}dd)`,
                          boxShadow: `0 0 8px ${STATUS_COLORS[status]}40`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Conteúdos Recentes */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Atualizados Recentemente
            </h3>
            <Link 
              href="/kanban" 
              className="text-xs font-semibold flex items-center gap-1 group hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              <span>Acessar Kanban</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))
            ) : recentContents.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-xl" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum conteúdo encontrado.</p>
              </div>
            ) : (
              recentContents.map((c) => (
                <Link
                  key={c.id}
                  href={`/content/${c.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(255, 255, 255, 0.03)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(124, 106, 247, 0.2)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Indicador de Status com Ponto Neon */}
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ 
                        background: STATUS_COLORS[c.status],
                        boxShadow: `0 0 8px ${STATUS_COLORS[c.status]}`
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {c.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {STATUS_LABELS[c.status]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className={`badge badge-${c.channel.toLowerCase().replace('_', '-')}`}
                    >
                      {CHANNEL_LABELS[c.channel]}
                    </span>
                    {c.scheduledAt && (
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(c.scheduledAt)}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
