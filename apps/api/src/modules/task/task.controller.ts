import { FastifyRequest, FastifyReply } from 'fastify'
import { TaskService } from './task.service'
import { createTaskSchema, updateTaskSchema } from './task.schema'

const service = new TaskService()

export class TaskController {
  async getByContentId(req: FastifyRequest, reply: FastifyReply) {
    const { contentId } = req.query as { contentId: string }
    if (!contentId) return reply.status(400).send({ error: 'contentId é obrigatório' })

    const tasks = await service.findByContentId(contentId)
    return reply.send(tasks)
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const data = createTaskSchema.parse(req.body)
    const task = await service.create(data)
    return reply.status(201).send(task)
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const data = updateTaskSchema.parse(req.body)
    const task = await service.update(id, data)
    return reply.send(task)
  }

  async toggleComplete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const task = await service.toggleComplete(id)
    return reply.send(task)
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    await service.delete(id)
    return reply.status(204).send()
  }
}
