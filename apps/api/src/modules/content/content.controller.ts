import { FastifyRequest, FastifyReply } from 'fastify'
import { ContentService } from './content.service'
import {
  createContentSchema,
  updateContentSchema,
  updateStatusSchema,
  dateRangeQuerySchema,
} from './content.schema'

const service = new ContentService()

export class ContentController {
  async getByDateRange(req: FastifyRequest, reply: FastifyReply) {
    const query = dateRangeQuerySchema.parse(req.query)
    const contents = await service.findByDateRange(query)
    return reply.send(contents)
  }

  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const { status, channel } = req.query as { status?: string; channel?: string }
    const contents = await service.findAll(status, channel)
    return reply.send(contents)
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const content = await service.findById(id)
    return reply.send(content)
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const data = createContentSchema.parse(req.body)
    const content = await service.create(data)
    return reply.status(201).send(content)
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const data = updateContentSchema.parse(req.body)
    const content = await service.update(id, data)
    return reply.send(content)
  }

  async updateStatus(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const { status } = updateStatusSchema.parse(req.body)
    const content = await service.updateStatus(id, status)
    return reply.send(content)
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    await service.delete(id)
    return reply.status(204).send()
  }

  async getStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await service.getStats()
    return reply.send(stats)
  }
}
