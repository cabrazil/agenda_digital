'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Kanban, Sparkles, Calendar, ArrowUpRight, Flame } from 'lucide-react'

interface DashboardHeroProps {
  totalContents: number
  inProductionCount: number
  postedCount: number
}

export function DashboardHero({ totalContents, inProductionCount, postedCount }: DashboardHeroProps) {
  const [greeting, setGreeting] = useState('Bem-vindo(a)')
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Bom dia')
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde')
    } else {
      setGreeting('Boa noite')
    }

    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
    const dateStr = now.toLocaleDateString('pt-BR', options)
    setFormattedDate(dateStr.charAt(0).toUpperCase() + dateStr.slice(1))
  }, [])

  const completionRate = totalContents > 0 ? Math.round((postedCount / totalContents) * 100) : 0

  return (
    <div className="relative rounded-2xl border overflow-hidden p-6 sm:p-8 glass-panel transition-all duration-300">
      {/* Dynamic Background Glows — índigo suave */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/08 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-56 h-56 bg-indigo-400/08 rounded-full blur-[70px] pointer-events-none" />

      {/* Decorative Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Column: Greeting & Header text */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-indigo-400" />
              {formattedDate || 'Painel de Produção'}
            </span>

            {inProductionCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Flame size={11} className="animate-pulse" />
                {inProductionCount} em produção
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {greeting}, Criador(a)! 🎬
          </h2>
          
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
            Gerencie roteiros, pautas, gravações e calendário do <span className="text-purple-400 font-semibold">vibesfilm</span> em uma experiência fluida e integrada.
          </p>

          {/* Quick Action Shortcuts */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/content/new"
              className="btn-primary text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus size={16} />
              Criar Novo Roteiro
            </Link>

            <Link
              href="/kanban"
              className="btn-ghost text-xs sm:text-sm font-semibold hover:border-indigo-500/40 hover:text-white"
            >
              <Kanban size={15} className="text-indigo-400" />
              Abrir Kanban
            </Link>

            <Link
              href="/calendar"
              className="btn-ghost text-xs sm:text-sm font-semibold hover:border-indigo-500/40 hover:text-white"
            >
              <Calendar size={15} className="text-indigo-400" />
              Calendário
            </Link>
          </div>
        </div>

        {/* Right Column: Status pill compacto */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <div className="text-center">
            <p className="text-2xl font-black text-white leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {completionRate}%
            </p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">concluídos</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-gray-200">Status Geral</p>
            <p className="text-[11px] text-gray-400">
              <span className="text-emerald-400 font-bold">{postedCount}</span>
              <span className="text-gray-500"> / {totalContents} publicados</span>
            </p>
            <Link
              href="/kanban"
              className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 transition-colors"
            >
              Ver detalhes <ArrowUpRight size={10} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
