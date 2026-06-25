import { prisma } from '../../lib/prisma'
import type { CreateTaskInput, UpdateTaskInput } from './task.schema'
import { NotFoundError } from '../../shared/errors'

export class TaskService {
  async findByContentId(contentId: string) {
    return prisma.task.findMany({
      where: { contentId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async create(data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    })
  }

  async update(id: string, data: UpdateTaskInput) {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw new NotFoundError('Task')

    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined
          ? data.dueDate ? new Date(data.dueDate) : null
          : undefined,
      },
    })
  }

  async toggleComplete(id: string) {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw new NotFoundError('Task')

    return prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    })
  }

  async delete(id: string) {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) throw new NotFoundError('Task')

    return prisma.task.delete({ where: { id } })
  }
}
