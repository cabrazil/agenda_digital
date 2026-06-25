import { prisma } from '../../lib/prisma'
import type { CreateContentInput, UpdateContentInput, DateRangeQuery } from './content.schema'
import { Prisma } from '@prisma/client'
import { NotFoundError } from '../../shared/errors'

export class ContentService {
  async findByDateRange(query: DateRangeQuery) {
    const where: Prisma.ContentWhereInput = {
      scheduledAt: {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      },
    }

    if (query.channel) where.channel = query.channel
    if (query.status) where.status = query.status

    return prisma.content.findMany({
      where,
      include: { tasks: true },
      orderBy: { scheduledAt: 'asc' },
    })
  }

  async findAll(status?: string, channel?: string) {
    const where: Prisma.ContentWhereInput = {}
    if (status) where.status = status as any
    if (channel) where.channel = channel as any

    return prisma.content.findMany({
      where,
      include: { tasks: true },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findById(id: string) {
    const content = await prisma.content.findUnique({
      where: { id },
      include: { tasks: { orderBy: { createdAt: 'asc' } } },
    })

    if (!content) throw new NotFoundError('Conteúdo')
    return content
  }

  async create(data: CreateContentInput) {
    return prisma.content.create({
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
      include: { tasks: true },
    })
  }

  async update(id: string, data: UpdateContentInput) {
    await this.findById(id) // garante que existe

    return prisma.content.update({
      where: { id },
      data: {
        ...data,
        scheduledAt: data.scheduledAt !== undefined
          ? data.scheduledAt ? new Date(data.scheduledAt) : null
          : undefined,
      },
      include: { tasks: true },
    })
  }

  async updateStatus(id: string, status: string) {
    await this.findById(id)

    const updateData: Prisma.ContentUpdateInput = {
      status: status as any,
    }

    // Se marcou como POSTADO, registra data de publicação
    if (status === 'POSTADO') {
      updateData.publishedAt = new Date()
    }

    return prisma.content.update({
      where: { id },
      data: updateData,
      include: { tasks: true },
    })
  }

  async delete(id: string) {
    await this.findById(id)
    return prisma.content.delete({ where: { id } })
  }

  async getStats() {
    const [byStatus, byChannel, total] = await Promise.all([
      prisma.content.groupBy({ by: ['status'], _count: true }),
      prisma.content.groupBy({ by: ['channel'], _count: true }),
      prisma.content.count(),
    ])

    return { total, byStatus, byChannel }
  }
}
