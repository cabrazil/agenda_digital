'use client'

import React from 'react'
import { Film, TrendingUp, Calendar, CheckCircle } from 'lucide-react'

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
  const stats = [
    {
      id: 'total',
      label: 'Total',
      value: totalContents,
      icon: Film,
      bg: 'linear-gradient(135deg, #7c6af7 0%, #9f59e8 100%)',
      shadow: 'rgba(124, 106, 247, 0.35)',
    },
    {
      id: 'production',
      label: 'Em Produção',
      value: inProductionCount,
      icon: TrendingUp,
      bg: 'linear-gradient(135deg, #f59e0b 0%, #ef7d00 100%)',
      shadow: 'rgba(245, 158, 11, 0.35)',
    },
    {
      id: 'scheduled',
      label: 'Agendados',
      value: scheduledCount,
      icon: Calendar,
      bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      shadow: 'rgba(236, 72, 153, 0.35)',
    },
    {
      id: 'posted',
      label: 'Postados',
      value: postedCount,
      icon: CheckCircle,
      bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      shadow: 'rgba(16, 185, 129, 0.35)',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: stat.bg,
              boxShadow: `0 4px 16px ${stat.shadow}`,
            }}
          >
            <div className="bg-white/20 rounded-xl p-2 flex-shrink-0">
              <Icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {stat.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
