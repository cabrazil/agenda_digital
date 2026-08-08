'use client'

import React from 'react'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ORDER,
  type ContentStatus,
  type Content,
} from '@/types'

interface ProductionPipelineProps {
  contents: Content[]
}

// Gradientes por status
const STATUS_GRADIENTS: Record<ContentStatus, string> = {
  IDEIA:            'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  PAUTA:            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  ROTEIRO:          'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  LOCUCAO_GRAVACAO: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  EDICAO:           'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
  AGENDADO:         'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
  POSTADO:          'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
}

const STATUS_SHADOWS: Record<ContentStatus, string> = {
  IDEIA:            'rgba(100, 116, 139, 0.35)',
  PAUTA:            'rgba(245, 158, 11, 0.35)',
  ROTEIRO:          'rgba(59, 130, 246, 0.35)',
  LOCUCAO_GRAVACAO: 'rgba(139, 92, 246, 0.35)',
  EDICAO:           'rgba(236, 72, 153, 0.35)',
  AGENDADO:         'rgba(249, 115, 22, 0.35)',
  POSTADO:          'rgba(34, 197, 94, 0.35)',
}

export function ProductionPipeline({ contents }: ProductionPipelineProps) {
  const total = contents.length

  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 mb-3">
        Estágios da Produção
      </p>
      <div className="flex flex-wrap gap-2.5">
        {STATUS_ORDER.map((status) => {
          const count = contents.filter((c) => c.status === status).length
          const pct = total ? Math.round((count / total) * 100) : 0

          return (
            <div
              key={status}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex-1 min-w-[90px]"
              style={{
                background: STATUS_GRADIENTS[status],
                boxShadow: `0 4px 14px ${STATUS_SHADOWS[status]}`,
              }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-white/75 uppercase tracking-wide truncate">
                  {STATUS_LABELS[status]}
                </p>
                <p className="text-xl font-black text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {count}
                  <span className="text-[10px] font-semibold text-white/60 ml-1">{pct}%</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
