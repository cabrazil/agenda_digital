export type Channel = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE_SHORTS' | 'YOUTUBE_LONGO' | 'BLOG' | 'LETTERBOXD' | 'APP'

export type ContentStatus =
  | 'IDEIA'
  | 'PAUTA'
  | 'ROTEIRO'
  | 'LOCUCAO_GRAVACAO'
  | 'EDICAO'
  | 'AGENDADO'
  | 'POSTADO'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: TaskPriority
  dueDate: string | null
  contentId: string
  createdAt: string
  updatedAt: string
}

export interface Content {
  id: string
  title: string
  briefing: string | null
  script: string | null
  channel: Channel
  status: ContentStatus
  scheduledAt: string | null
  publishedAt: string | null
  tags: string[]
  thumbnailUrl: string | null
  publishUrl: string | null
  notes: string | null
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

export interface Stats {
  total: number
  byStatus: Array<{ status: ContentStatus; _count: number }>
  byChannel: Array<{ channel: Channel; _count: number }>
}

// Mapeamentos de exibição
export const CHANNEL_LABELS: Record<Channel, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE_SHORTS: 'YT Shorts',
  YOUTUBE_LONGO: 'YouTube',
  BLOG: 'Blog',
  LETTERBOXD: 'Letterboxd',
  APP: 'App',
}

export const CHANNEL_COLORS: Record<Channel, string> = {
  INSTAGRAM: '#f97316',
  TIKTOK: '#cbd5e1',
  YOUTUBE_SHORTS: '#FF0000',
  YOUTUBE_LONGO: '#FF0000',
  BLOG: '#a3e635',
  LETTERBOXD: '#22c55e',
  APP: '#38bdf8',
}


export const STATUS_LABELS: Record<ContentStatus, string> = {
  IDEIA: 'Ideia',
  PAUTA: 'Pauta',
  ROTEIRO: 'Roteiro',
  LOCUCAO_GRAVACAO: 'Gravação',
  EDICAO: 'Edição',
  AGENDADO: 'Agendado',
  POSTADO: 'Postado',
}

export const STATUS_ORDER: ContentStatus[] = [
  'IDEIA',
  'PAUTA',
  'ROTEIRO',
  'LOCUCAO_GRAVACAO',
  'EDICAO',
  'AGENDADO',
  'POSTADO',
]

export const STATUS_COLORS: Record<ContentStatus, string> = {
  IDEIA: '#94a3b8',
  PAUTA: '#f59e0b',
  ROTEIRO: '#3b82f6',
  LOCUCAO_GRAVACAO: '#8b5cf6',
  EDICAO: '#ec4899',
  AGENDADO: '#f97316',
  POSTADO: '#22c55e',
}
