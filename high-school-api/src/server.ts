import { createApp } from './app'
import { env } from '@/config/env'
import { connectDatabase, disconnectDatabase } from '@/config/database'
import { logger } from '@/config/logger'

const SHUTDOWN_TIMEOUT_MS = 10_000

async function main() {
  await connectDatabase()

  const app = createApp()
  const server = app.listen(env.PORT)

  server.on('listening', () => {
    logger.info(`🚀 API listening on http://localhost:${env.PORT}`)
    if (env.NODE_ENV !== 'production' || env.SWAGGER_ENABLED) {
      logger.info(`📚 Swagger docs at http://localhost:${env.PORT}/api-docs`)
    }
  })

  // Surface listen errors (EADDRINUSE, EACCES) instead of hanging silently.
  server.on('error', (err) => {
    logger.error('HTTP server error', { err })
    process.exit(1)
  })

  // Keep-alive must exceed the upstream LB's idle timeout, or you get sporadic
  // 502s when the LB closes an idle connection the server still believes is
  // live. 65s sits just above AWS ALB's 60s default; headersTimeout must be
  // strictly greater than keepAliveTimeout.
  server.keepAliveTimeout = 65_000
  server.headersTimeout = 66_000

  let shuttingDown = false
  const shutdown = (signal: string) => {
    if (shuttingDown) return
    shuttingDown = true

    logger.info(`${signal} received — starting graceful shutdown`)

    // Force-exit if graceful shutdown hangs. Without this, a stuck request or
    // a hung DB pool checkout leaves the process alive until the orchestrator
    // SIGKILLs it — which looks like a crash in the metrics.
    const forceExit = setTimeout(() => {
      logger.error(`Graceful shutdown timed out after ${SHUTDOWN_TIMEOUT_MS}ms — forcing exit`)
      process.exit(1)
    }, SHUTDOWN_TIMEOUT_MS)
    forceExit.unref()

    server.close(async (err) => {
      if (err) logger.error('Error while closing HTTP server', { err })

      try {
        await disconnectDatabase()
      } catch (disconnectErr) {
        logger.error('Error while disconnecting from database', { disconnectErr })
      }

      clearTimeout(forceExit)
      logger.info('Shutdown complete')
      process.exit(err ? 1 : 0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // Anything reaching these handlers means the process is in an unknown state.
  // Log and exit so the orchestrator restarts it cleanly, rather than running
  // half-broken and serving wrong answers.
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception — exiting', { err })
    shutdown('uncaughtException')
  })
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection — exiting', { err: reason })
    shutdown('unhandledRejection')
  })
}

main().catch((err) => {
  logger.error('Failed to start server', { err })
  process.exit(1)
})