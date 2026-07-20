import { createApp } from './app'
import { env } from '@/config/env'
import { connectDatabase, disconnectDatabase } from '@/config/database'
import { logger } from '@/config/logger'

async function main() {
  await connectDatabase()

  const app = createApp()
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 API listening on http://localhost:${env.PORT}`)
    logger.info(`📚 Swagger docs at http://localhost:${env.PORT}/api-docs`)
  })

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`)
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch((err) => {
  logger.error('Failed to start server', { err })
  process.exit(1)
})
