'use client'

import { usePathname } from 'next/navigation'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/kanban':      'Kanban Board',
  '/calendar':    'Calendário',
  '/content/new': 'Novo Conteúdo',
}

export function Header() {
  const pathname = usePathname()
  const title = Object.entries(PAGE_TITLES).find(([p]) => pathname.startsWith(p))?.[1] ?? 'Conteúdo'

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b"
      style={{
        background: 'rgba(20, 24, 36, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}
    >
      <h1 className="page-title">{title}</h1>

      <Link
        href="/content/new"
        className="btn-primary gap-1.5"
        style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
          color: 'white',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          borderRadius: '10px',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.filter = 'brightness(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.filter = 'none';
        }}
      >
        <Plus size={16} />
        Novo Conteúdo
      </Link>
    </header>
  )
}
