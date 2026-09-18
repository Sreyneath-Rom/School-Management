import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from './env'
import { logger } from './logger'

/**
 * Prisma 7 dropped the bundled Rust query engine — a driver adapter is now
 * mandatory for every database. This is the Postgres one.
 */
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  // Sensible pool defaults for a single-process API. If you deploy with
  // multiple replicas, keep `max` low: `replicas * max` must stay under the
  // database's own connection limit, or the DB starts refusing connections
  // and the whole fleet goes down together.
  max: 10,
})

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
})

// Prisma 7's emitted event payloads are typed, but the event names aren't
// exposed as a strict union through the driver-adapter path yet. Casting the
// event name keeps the handlers typed without weakening the payload type.
prisma.$on('warn' as never, (e: unknown) => {
  logger.warn('Prisma warning', { event: e })
})
prisma.$on('error' as never, (e: unknown) => {
  logger.error('Prisma error', { event: e })
})

let connected = false

/**
 * Idempotent. Called once from server.ts at boot. If the database is
 * unreachable the process should fail to start rather than serving requests
 * that will all 500 — that's why this rethrows.
 */
export async function connectDatabase(): Promise<void> {
  if (connected) return

  try {
    await prisma.$connect()
    connected = true
    logger.info('Connected to PostgreSQL via Prisma')
  } catch (err) {
    logger.error('Could not connect to PostgreSQL', { err })
    throw err
  }
}

/**
 * Idempotent. Called from the graceful-shutdown path in server.ts. Swallows
 * errors so a broken disconnect doesn't block process exit — a stuck pool is
 * not a reason to hang forever when the orchestrator is trying to stop us.
 */
export async function disconnectDatabase(): Promise<void> {
  if (!connected) return

  try {
    await prisma.$disconnect()
    connected = false
    logger.info('Disconnected from PostgreSQL')
  } catch (err) {
    logger.error('Error while disconnecting from PostgreSQL', { err })
  }
}