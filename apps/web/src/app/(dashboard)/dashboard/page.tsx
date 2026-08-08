'use client'

import React from 'react'
import { useContents } from '@/hooks/useContents'
import { DashboardHero } from '@/components/dashboard/DashboardHero'
import { StatCardsGrid } from '@/components/dashboard/StatCardsGrid'
import { ProductionPipeline } from '@/components/dashboard/ProductionPipeline'
import { ChannelDistribution } from '@/components/dashboard/ChannelDistribution'
import { UpcomingTimeline } from '@/components/dashboard/UpcomingTimeline'
import { RecentContentsGrid } from '@/components/dashboard/RecentContentsGrid'

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

      {/* Main Grid: Pipeline & Channels on left, Timeline & Recents on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pipeline & Channels */}
        <div className="space-y-6 lg:col-span-1">
          <ProductionPipeline contents={contents} />
          <ChannelDistribution contents={contents} />
        </div>

        {/* Right Column: Upcoming Timeline & Recent Contents */}
        <div className="space-y-6 lg:col-span-2">
          <UpcomingTimeline contents={contents} isLoading={isLoading} />
          <RecentContentsGrid contents={contents} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
