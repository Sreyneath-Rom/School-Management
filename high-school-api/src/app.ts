import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'
import path from 'node:path'
import { env, swaggerEnabled } from '@/config/env'
import { swaggerSpec } from '@/config/swagger'
import { httpLogStream } from '@/config/logger'
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware'
import { requestId } from '@/middleware/requestId.middleware'
import apiRoutes from '@/routes'

export function createApp(): Express {
  const app = express()

  app.set('trust proxy', 1)

  // ---- Request identity ----
  // MUST be first. Every downstream consumer of req.id (morgan, error
  // handler, logger bindings) depends on this having run.
  app.use(requestId)

  // ---- Security headers ----
  // CSP disabled so Swagger UI's inline scripts render. CORP stays at
  // Helmet's default (`same-origin`), which is correct for JSON responses;
  // the /uploads/logos mount below overrides it per-route where needed.
  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))

  // ---- Body parsers ----
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))

  // ---- HTTP access log ----
  morgan.token('id', (req) => (req as { id?: string }).id ?? '-')
  app.use(
    morgan(
      ':id :remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms ":referrer" ":user-agent"',
      { stream: httpLogStream }
    )
  )

  // ---- Liveness / readiness ----
  app.get('/health', (_req, res) =>
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
  )

  // ---- Public static: school logos only ----
  // Logos are intentionally public (login page, invoices, report card
  // headers). They must be cross-origin accessible because the SPA runs on
  // a different origin than the API in dev (Vite on :5173 vs API on :5000)
  // and often in production (separate host / CDN). Helmet's default
  // Cross-Origin-Resource-Policy is `same-origin`, which blocks <img src>
  // loads with ERR_BLOCKED_BY_RESPONSE.NotSameOrigin. Override it here for
  // this route only — JSON API responses keep the stricter default.
  app.use(
    '/uploads/logos',
    express.static(path.resolve(env.UPLOAD_PATH, 'logos'), {
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
      },
    })
  )

  // ---- Global rate limit ----
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    })
  )

  // ---- API documentation ----
  if (swaggerEnabled && swaggerSpec) {
    app.use(
      '/api-docs',
      swaggerUi.serve as never,
      swaggerUi.setup(swaggerSpec) as never
    )
  }

  // ---- Application routes ----
  app.use('/api/v1', apiRoutes)

  // ---- Fallthrough handlers ----
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}