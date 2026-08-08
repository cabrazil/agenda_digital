'use client'

import React from 'react'
import {
  CHANNEL_LABELS,
  CHANNEL_COLORS,
  type Channel,
  type Content,
} from '@/types'

interface ChannelDistributionProps {
  contents: Content[]
}

const CHANNEL_GRADIENTS: Record<Channel, string> = {
  INSTAGRAM:       'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  TIKTOK:          'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
  YOUTUBE_SHORTS:  'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  YOUTUBE_LONGO:   'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
  BLOG:            'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
  LETTERBOXD:      'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
}

const CHANNEL_SHADOWS: Record<Channel, string> = {
  INSTAGRAM:       'rgba(249, 115, 22, 0.35)',
  TIKTOK:          'rgba(51, 65, 85, 0.5)',
  YOUTUBE_SHORTS:  'rgba(239, 68, 68, 0.35)',
  YOUTUBE_LONGO:   'rgba(220, 38, 38, 0.35)',
  BLOG:            'rgba(99, 102, 241, 0.35)',
  LETTERBOXD:      'rgba(34, 197, 94, 0.35)',
}

export function ChannelDistribution({ contents }: ChannelDistributionProps) {
  const channels = Object.keys(CHANNEL_COLORS) as Channel[]

  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500 mb-3">
        Distribuição por Rede
      </p>
      <div className="flex flex-wrap gap-2.5">
        {channels.map((channel) => {
          const count = contents.filter((c) => c.channel === channel).length

          return (
            <div
              key={channel}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex-1 min-w-[90px]"
              style={{
                background: CHANNEL_GRADIENTS[channel],
                boxShadow: `0 4px 14px ${CHANNEL_SHADOWS[channel]}`,
              }}
            >
              <div className="bg-white/20 rounded-lg w-7 h-7 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {count}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate leading-tight">
                {CHANNEL_LABELS[channel]}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
