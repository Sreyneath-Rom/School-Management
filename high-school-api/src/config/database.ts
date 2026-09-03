import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from './env'
import { logger } from './logger'

// Prisma 7 removed the bundled Rust query engine — a driver adapter is now
// mandatory for every database. This is the Postgres one.
let prismaInstance: any
try {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
  prismaInstance = new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' },
    ],
  })
  prismaInstance.$on('warn' as never, (e: unknown) => logger.warn('Prisma warning', { e }))
  prismaInstance.$on('error' as never, (e: unknown) => logger.error('Prisma error', { e }))
} catch {
  logger.warn('[AI Studio] Database not connected — using mock')
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  }
  prismaInstance = new Proxy({}, { get: () => noOp })
}

export const prisma = prismaInstance

export async function connectDatabase() {
  try {
    if (prisma?.$connect) {
      await prisma.$connect()
      logger.info('Connected to PostgreSQL via Prisma')
    }
  } catch (err) {
    logger.warn('[AI Studio] Could not connect to PostgreSQL — using mock/offline mode', { err })
  }
}

export async function disconnectDatabase() {
  try {
    if (prisma?.$disconnect) {
      await prisma.$disconnect()
    }
  } catch {}
}
