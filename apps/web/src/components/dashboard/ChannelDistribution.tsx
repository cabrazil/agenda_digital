'use client'

import React from 'react'
import {
  CHANNEL_LABELS,
  CHANNEL_COLORS,
  type Channel,
  type Content,
} from '@/types'
import { Share2 } from 'lucide-react'

interface ChannelDistributionProps {
  contents: Content[]
}

export function ChannelDistribution({ contents }: ChannelDistributionProps) {
  const channels = Object.keys(CHANNEL_COLORS) as Channel[]
  const total = contents.length

  return (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-500/10 text-pink-400 border border-pink-500/15">
          <Share2 size={16} />
        </div>
        <div>
          <h3
            className="text-sm font-extrabold uppercase tracking-wider text-white"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Distribuição por Rede
          </h3>
          <p className="text-[11px] font-medium text-gray-400">
            Foco de conteúdo em cada plataforma
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {channels.map((channel) => {
          const count = contents.filter((c) => c.channel === channel).length
          const color = CHANNEL_COLORS[channel]
          const pct = total ? Math.round((count / total) * 100) : 0

          return (
            <div
              key={channel}
              className="group p-3.5 rounded-xl border flex flex-col justify-between min-h-[90px] transition-all duration-300 hover:border-white/15 hover:translate-y-[-2px]"
              style={{
                background: 'rgba(255, 255, 255, 0.015)',
                borderColor: 'rgba(255, 255, 255, 0.04)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{
                      background: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors truncate">
                    {CHANNEL_LABELS[channel]}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-gray-500">
                  {pct}%
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {count}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {count === 1 ? 'conteúdo' : 'conteúdos'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
