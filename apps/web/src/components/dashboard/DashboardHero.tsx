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
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none animate-pulseGlow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-purple-400" />
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
              className="btn-primary text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus size={16} />
              Criar Novo Roteiro
            </Link>

            <Link
              href="/kanban"
              className="btn-ghost text-xs sm:text-sm font-semibold hover:border-purple-500/40 hover:text-white"
            >
              <Kanban size={15} className="text-purple-400" />
              Abrir Kanban
            </Link>

            <Link
              href="/calendar"
              className="btn-ghost text-xs sm:text-sm font-semibold hover:border-purple-500/40 hover:text-white"
            >
              <Calendar size={15} className="text-pink-400" />
              Calendário
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Overall Progress Circle */}
        <div className="flex-shrink-0 flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-purple-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${completionRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="url(#gradientProgress)"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <defs>
                <linearGradient id="gradientProgress" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c6af7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-white leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {completionRate}%
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                Concluídos
              </span>
            </div>
          </div>

          <div className="space-y-1 pr-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Status Geral
            </p>
            <p className="text-xs text-gray-400">
              <span className="text-emerald-400 font-bold">{postedCount}</span> de <span className="text-white font-bold">{totalContents}</span> publicados
            </p>
            <Link 
              href="/kanban" 
              className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 mt-1 transition-colors"
            >
              Ver detalhes <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
