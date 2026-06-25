import Fastify from 'fastify'
import cors from '@fastify/cors'
import { contentRoutes } from './modules/content/content.routes'
import { taskRoutes } from './modules/task/task.routes'
import { AppError } from './shared/errors'
import { ZodError } from 'zod'

export function buildApp() {
  const app = Fastify({ logger: true })

  // CORS
  app.register(cors, {
    origin: process.env.NODE_ENV === 'development' ? true : (process.env.FRONTEND_URL || 'http://localhost:3000'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })

  // Tratamento global de erros
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: error.flatten().fieldErrors,
      })
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.message,
      })
    }

    // Erro inesperado
    app.log.error(error)
    return reply.status(500).send({
      error: 'Erro interno do servidor',
    })
  })

  // Health check
  app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // Rotas
  app.register(contentRoutes, { prefix: '/api' })
  app.register(taskRoutes, { prefix: '/api' })

  return app
}
