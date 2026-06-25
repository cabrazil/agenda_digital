import { FastifyInstance } from 'fastify'
import { TaskController } from './task.controller'

const controller = new TaskController()

export async function taskRoutes(app: FastifyInstance) {
  app.get('/tasks', controller.getByContentId.bind(controller))
  app.post('/tasks', controller.create.bind(controller))
  app.patch('/tasks/:id', controller.update.bind(controller))
  app.patch('/tasks/:id/toggle', controller.toggleComplete.bind(controller))
  app.delete('/tasks/:id', controller.delete.bind(controller))
}
