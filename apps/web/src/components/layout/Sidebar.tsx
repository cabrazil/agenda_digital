'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  Clapperboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/kanban',    icon: KanbanSquare,    label: 'Kanban' },
  { href: '/calendar',  icon: Calendar,        label: 'Calendário' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-30 border-r"
      style={{ 
        background: 'rgba(7, 7, 12, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border)' 
      }}
    >
      {/* Logo com estilo premium */}
      <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
            boxShadow: '0 4px 12px rgba(124, 106, 247, 0.3)'
          }}
        >
          <Clapperboard size={18} className="text-white" />
        </div>
        <div>
          <p 
            className="text-sm font-extrabold tracking-tight" 
            style={{ 
              background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            vibesfilm
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            agenda
          </p>
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 p-4 space-y-1.5">
        <p className="px-3 py-2 text-xxs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          Menu de Produção
        </p>
        
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'text-white'
                  : 'hover:text-white',
              )}
              style={
                isActive
                  ? { 
                      background: 'linear-gradient(135deg, rgba(124, 106, 247, 0.8) 0%, rgba(181, 95, 230, 0.8) 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(124, 106, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }
                  : { color: 'var(--text-secondary)' }
              }
            >
              <Icon 
                size={16} 
                className={cn(
                  'transition-transform duration-200 group-hover:scale-110', 
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )} 
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Perfil / Footer com efeito premium */}
      <div className="p-5 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
            style={{ 
              background: 'linear-gradient(135deg, rgba(124, 106, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)', 
              color: 'var(--text-primary)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            VF
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>vibesfilm</p>
            <p className="text-xxs text-gray-500 font-medium" style={{ fontSize: '10px' }}>Dashboard de Cinema</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
