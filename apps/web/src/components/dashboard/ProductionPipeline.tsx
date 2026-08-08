'use client'

import React from 'react'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ORDER,
  type ContentStatus,
  type Content,
} from '@/types'
import { Layers } from 'lucide-react'

interface ProductionPipelineProps {
  contents: Content[]
}

export function ProductionPipeline({ contents }: ProductionPipelineProps) {
  const total = contents.length

  return (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 border border-purple-500/15">
            <Layers size={16} />
          </div>
          <div>
            <h3
              className="text-sm font-extrabold uppercase tracking-wider text-white"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Estágios da Produção
            </h3>
            <p className="text-[11px] font-medium text-gray-400">
              Distribuição por etapas do pipeline
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] text-gray-300 border border-white/[0.06]">
          {total} {total === 1 ? 'conteúdo' : 'conteúdos'}
        </span>
      </div>

      <div className="space-y-4">
        {STATUS_ORDER.map((status: ContentStatus) => {
          const count = contents.filter((c) => c.status === status).length
          const pct = total ? Math.round((count / total) * 100) : 0
          const color = STATUS_COLORS[status]

          return (
            <div key={status} className="group cursor-default">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{
                      backgroundColor: color,
                      boxShadow: count > 0 ? `0 0 8px ${color}` : 'none',
                    }}
                  />
                  <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {STATUS_LABELS[status]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    {count}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400 w-10 text-right">
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2 rounded-full overflow-hidden bg-white/[0.03] border border-white/[0.04] p-[1px]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(to right, ${color}, ${color}cc)`,
                    boxShadow: count > 0 ? `0 0 10px ${color}60` : 'none',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
