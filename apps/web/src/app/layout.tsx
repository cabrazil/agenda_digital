import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'Agenda vibesfilm | Dashboard de Conteúdo',
  description: 'Sistema de agendamento e produção de conteúdo para o vibesfilm.com',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
