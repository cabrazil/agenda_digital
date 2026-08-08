'use client'

import React from 'react'
import { useContents } from '@/hooks/useContents'
import { DashboardHero } from '@/components/dashboard/DashboardHero'
import { StatCardsGrid } from '@/components/dashboard/StatCardsGrid'
import { ProductionPipeline } from '@/components/dashboard/ProductionPipeline'
import { ChannelDistribution } from '@/components/dashboard/ChannelDistribution'
import { UpcomingTimeline } from '@/components/dashboard/UpcomingTimeline'

export default function DashboardPage() {
  const { data: contents = [], isLoading } = useContents()

  const agendadosCount = contents.filter((c) => c.status === 'AGENDADO').length
  const postadosCount  = contents.filter((c) => c.status === 'POSTADO').length
  const inProdCount    = contents.filter((c) => !['IDEIA', 'POSTADO'].includes(c.status)).length

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn pb-10">
      {/* Hero Banner */}
      <DashboardHero
        totalContents={contents.length}
        inProductionCount={inProdCount}
        postedCount={postadosCount}
      />

      {/* KPI Cards Grid */}
      <StatCardsGrid
        totalContents={contents.length}
        inProductionCount={inProdCount}
        scheduledCount={agendadosCount}
        postedCount={postadosCount}
      />

      {/* Pipeline & Canais */}
      <div className="space-y-5">
        <ProductionPipeline contents={contents} />
        <ChannelDistribution contents={contents} />
      </div>

      {/* Próximos Lançamentos (largura total) */}
      <UpcomingTimeline contents={contents} isLoading={isLoading} />
    </div>
  )
}
