'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, isToday, addMonths, subMonths,
  startOfWeek, endOfWeek, parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { useCalendarContents } from '@/hooks/useContents'
import { CHANNEL_COLORS, CHANNEL_LABELS, type Content } from '@/types'

export function CalendarView() {
  const [current, setCurrent] = useState(new Date())
  const router = useRouter()

  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd     = endOfWeek(monthEnd,     { weekStartsOn: 0 })
  const days       = eachDayOfInterval({ start: calStart, end: calEnd })

  const { data: contents = [], isLoading } = useCalendarContents(
    calStart.toISOString(),
    calEnd.toISOString(),
  )

  const eventsByDay = useMemo(() => {
    const map: Record<string, Content[]> = {}
    contents.forEach((c) => {
      if (!c.scheduledAt) return
      const key = format(parseISO(c.scheduledAt), 'yyyy-MM-dd')
      if (!map[key]) map[key] = []
      map[key].push(c)
    })
    return map
  }, [contents])

  const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="card overflow-hidden w-full max-w-6xl mx-auto shadow-2xl animate-fadeIn">
      {/* Barra de Navegação */}
      <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <CalendarIcon size={20} className="text-purple-400" />
          <h2 
            className="text-lg font-bold capitalize tracking-tight" 
            style={{ 
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            {format(current, 'MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent(subMonths(current, 1))}
            className="btn-ghost p-2 rounded-xl"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={() => setCurrent(new Date())}
            className="btn-ghost px-4 py-1.5 rounded-xl text-xs font-semibold hover:border-purple-500/30"
          >
            Hoje
          </button>
          
          <button
            onClick={() => setCurrent(addMonths(current, 1))}
            className="btn-ghost p-2 rounded-xl"
            aria-label="Próximo mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Dias da Semana Header */}
      <div className="grid grid-cols-7 border-b text-center" style={{ borderColor: 'var(--border)', background: 'rgba(255, 255, 255, 0.01)' }}>
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="py-3 text-xxs font-extrabold uppercase tracking-widest text-gray-500"
            style={{ fontSize: '10px' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7" style={{ background: 'rgba(255, 255, 255, 0.005)' }}>
        {days.map((day, idx) => {
          const key = format(day, 'yyyy-MM-dd')
          const events = eventsByDay[key] || []
          const isCurrentMonth = isSameMonth(day, current)
          const isTodayDay = isToday(day)

          return (
            <div
              key={idx}
              className="min-h-[145px] p-2.5 border-b border-r transition-all duration-200"
              style={{
                borderColor: 'var(--border)',
                background: isCurrentMonth ? 'transparent' : 'rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Cabeçalho do Dia */}
              <div className="flex justify-end mb-2">
                <span
                  className="w-7 h-7 flex items-center justify-center text-xs rounded-xl font-bold transition-all"
                  style={
                    isTodayDay
                      ? { 
                          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)', 
                          color: 'white',
                          boxShadow: '0 3px 10px rgba(124, 106, 247, 0.4)'
                        }
                      : { 
                          color: isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)',
                        }
                  }
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Eventos / Pílulas de Conteúdo */}
              <div className="space-y-1.5">
                {events.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => router.push(`/content/${c.id}`)}
                    className="w-full text-left text-xxs px-2 py-1 rounded-lg truncate transition-all duration-150 border font-semibold block"
                    style={{
                      background: `${CHANNEL_COLORS[c.channel]}12`,
                      color: CHANNEL_COLORS[c.channel],
                      borderColor: `${CHANNEL_COLORS[c.channel]}25`,
                      fontSize: '10px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${CHANNEL_COLORS[c.channel]}22`;
                      e.currentTarget.style.borderColor = `${CHANNEL_COLORS[c.channel]}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${CHANNEL_COLORS[c.channel]}12`;
                      e.currentTarget.style.borderColor = `${CHANNEL_COLORS[c.channel]}25`;
                    }}
                  >
                    {c.title}
                  </button>
                ))}
                
                {events.length > 5 && (
                  <div 
                    className="text-xxs font-extrabold px-1.5 py-0.5 rounded bg-gray-900/60 w-max inline-block text-gray-500"
                    style={{ fontSize: '9px' }}
                  >
                    +{events.length - 5} mais
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legendas de Canais */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-t" style={{ borderColor: 'var(--border)', background: 'rgba(0,0,0,0.1)' }}>
        <span className="text-xxs font-bold uppercase tracking-wider text-gray-500" style={{ fontSize: '10px' }}>
          Canais do Blog:
        </span>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CHANNEL_LABELS).map(([ch, label]) => (
            <div key={ch} className="flex items-center gap-2 px-2.5 py-1 rounded-lg border" style={{ borderColor: 'rgba(255, 255, 255, 0.03)', background: 'rgba(255, 255, 255, 0.01)' }}>
              <div
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: CHANNEL_COLORS[ch as keyof typeof CHANNEL_COLORS],
                  boxShadow: `0 0 6px ${CHANNEL_COLORS[ch as keyof typeof CHANNEL_COLORS]}`
                }}
              />
              <span className="text-xxs font-semibold" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
