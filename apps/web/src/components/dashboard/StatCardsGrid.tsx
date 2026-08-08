'use client'

import React from 'react'
import { Film, TrendingUp, Calendar, CheckCircle, ArrowUpRight } from 'lucide-react'

interface StatCardsGridProps {
  totalContents: number
  inProductionCount: number
  scheduledCount: number
  postedCount: number
}

export function StatCardsGrid({
  totalContents,
  inProductionCount,
  scheduledCount,
  postedCount,
}: StatCardsGridProps) {
  const postedRate = totalContents > 0 ? Math.round((postedCount / totalContents) * 100) : 0
  const scheduledRate = totalContents > 0 ? Math.round((scheduledCount / totalContents) * 100) : 0

  const stats = [
    {
      id: 'total',
      label: 'Total de Conteúdos',
      value: totalContents,
      unit: 'no banco',
      icon: Film,
      accentColor: '#7c6af7',
      bgGradient: 'linear-gradient(135deg, #7c6af7 0%, #b55fe6 100%)',
      shadowColor: 'rgba(124, 106, 247, 0.25)',
      badgeText: 'Catálogo Ativo',
      badgeBg: 'rgba(124, 106, 247, 0.12)',
      badgeColor: '#a78bfa',
    },
    {
      id: 'production',
      label: 'Em Produção',
      value: inProductionCount,
      unit: 'em andamento',
      icon: TrendingUp,
      accentColor: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      shadowColor: 'rgba(245, 158, 11, 0.25)',
      badgeText: 'Pauta a Edição',
      badgeBg: 'rgba(245, 158, 11, 0.12)',
      badgeColor: '#fbbf24',
    },
    {
      id: 'scheduled',
      label: 'Agendados',
      value: scheduledCount,
      unit: `${scheduledRate}% do total`,
      icon: Calendar,
      accentColor: '#ec4899',
      bgGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      shadowColor: 'rgba(236, 72, 153, 0.25)',
      badgeText: 'Prontos p/ Publicar',
      badgeBg: 'rgba(236, 72, 153, 0.12)',
      badgeColor: '#f472b6',
    },
    {
      id: 'posted',
      label: 'Postados',
      value: postedCount,
      unit: `${postedRate}% concluídos`,
      icon: CheckCircle,
      accentColor: '#10b981',
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadowColor: 'rgba(16, 185, 129, 0.25)',
      badgeText: 'Publicados',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeColor: '#34d399',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className="group relative p-5 rounded-2xl glass-card-interactive flex flex-col justify-between overflow-hidden min-h-[140px]"
          >
            {/* Background Glow */}
            <div
              className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-3xl opacity-15 transition-opacity duration-300 group-hover:opacity-30 pointer-events-none"
              style={{ background: stat.accentColor }}
            />

            {/* Top Bar: Icon & Badge */}
            <div className="flex items-center justify-between z-10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: stat.bgGradient,
                  boxShadow: `0 4px 14px ${stat.shadowColor}`,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <Icon size={18} className="text-white" />
              </div>

              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
                style={{
                  backgroundColor: stat.badgeBg,
                  color: stat.badgeColor,
                  borderColor: `${stat.badgeColor}25`,
                }}
              >
                {stat.badgeText}
              </span>
            </div>

            {/* Bottom Content: Number & Label */}
            <div className="mt-4 z-10">
              <div className="flex items-baseline justify-between">
                <span
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  {stat.unit}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                  {stat.label}
                </p>
                <ArrowUpRight 
                  size={14} 
                  className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
