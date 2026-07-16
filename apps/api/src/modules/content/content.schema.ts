import { z } from 'zod'

export const channelEnum = z.enum([
  'INSTAGRAM',
  'TIKTOK',
  'YOUTUBE_SHORTS',
  'YOUTUBE_LONGO',
  'BLOG',
  'LETTERBOXD',
])


export const statusEnum = z.enum([
  'IDEIA',
  'PAUTA',
  'ROTEIRO',
  'LOCUCAO_GRAVACAO',
  'EDICAO',
  'AGENDADO',
  'POSTADO',
])

export const createContentSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  briefing: z.string().optional(),
  script: z.string().optional(),
  channel: channelEnum,
  status: statusEnum.optional(),
  scheduledAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  thumbnailUrl: z.string().url().optional(),
  publishUrl: z.string().url().optional(),
  notes: z.string().optional(),
})

export const updateContentSchema = createContentSchema.partial()

export const updateStatusSchema = z.object({
  status: statusEnum,
})

export const dateRangeQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  channel: channelEnum.optional(),
  status: statusEnum.optional(),
})

export type CreateContentInput = z.infer<typeof createContentSchema>
export type UpdateContentInput = z.infer<typeof updateContentSchema>
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>
