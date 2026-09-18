import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'
import { env } from '@/config/env'
import { swaggerSpec } from '@/config/swagger'
import { httpLogStream } from '@/config/logger'
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware'
import { requestId } from '@/middleware/requestId.middleware'
import apiRoutes from '@/routes'

export function createApp(): Express {
  const app = express()

  // Trust exactly one hop (nginx / managed LB). Without this, express-rate-limit
  // keys every request on the proxy's IP and throttles the entire internet as
  // if it were a single client. Must match the real deployment topology — bump
  // this number only if you add another proxy in front.
  app.set('trust proxy', 1)

  // ---- Request identity ----
  // Must come first so every downstream log line and error response can be
  // correlated. See middleware/requestId.middleware.ts.
  app.use(requestId)

  // ---- Security headers ----
  // The API serves JSON, not HTML, so most helmet defaults are moot. CSP is
  // explicitly disabled because Swagger UI at /api-docs relies on inline
  // scripts and renders blank under helmet's default policy.
  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))

  // ---- Body parsers ----
  // Keep JSON deliberately small. File uploads go through multer on their own
  // routes; nothing on the JSON API should need more than ~1 MB.
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
  // Mounted BEFORE the rate limiter on purpose: orchestrator probes must never
  // be the reason a healthy pod looks unhealthy, and probes must not consume
  // the shared request budget.
  app.get('/health', (_req, res) =>
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
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
  // Swagger is an internal tool. Gate it out of production unless explicitly
  // enabled via env (see note at the bottom — add SWAGGER_ENABLED to env.ts).
  if (env.NODE_ENV !== 'production' || env.SWAGGER_ENABLED) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  }

  // ---- Application routes ----
  // NOTE: the previous `express.static(env.UPLOAD_PATH)` mount has been removed.
  // Serving lesson materials and homework submissions as unauthenticated static
  // files is a data leak. Uploads should be served through an authenticated
  // route (e.g. `GET /api/v1/uploads/:id` with a permission check), or via
  // short-lived signed URLs. See the notes below.
  app.use('/api/v1', apiRoutes)

  // ---- Fallthrough handlers (must be last) ----
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}