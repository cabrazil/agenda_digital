import { z } from 'zod'

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'])

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  contentId: z.string().uuid(),
  priority: taskPriorityEnum.optional(),
  dueDate: z.string().datetime().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z.string().datetime().nullable().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
