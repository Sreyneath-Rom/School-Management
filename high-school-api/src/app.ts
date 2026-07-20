import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'
import { env } from '@/config/env'
import { swaggerSpec } from '@/config/swagger'
import { httpLogStream } from '@/config/logger'
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware'
import apiRoutes from '@/routes'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan('combined', { stream: httpLogStream }))

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    })
  )

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use('/api/v1', apiRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
