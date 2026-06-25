import { FastifyInstance } from 'fastify'
import { ContentController } from './content.controller'

const controller = new ContentController()

export async function contentRoutes(app: FastifyInstance) {
  app.get('/contents', controller.getAll.bind(controller))
  app.get('/contents/calendar', controller.getByDateRange.bind(controller))
  app.get('/contents/stats', controller.getStats.bind(controller))
  app.get('/contents/:id', controller.getById.bind(controller))
  app.post('/contents', controller.create.bind(controller))
  app.put('/contents/:id', controller.update.bind(controller))
  app.patch('/contents/:id/status', controller.updateStatus.bind(controller))
  app.delete('/contents/:id', controller.delete.bind(controller))
}
