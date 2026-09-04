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
  const noOp: any = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    findUniqueOrThrow: async () => ({ id: 'mock-id' }),
    create: async (d: any) => d?.data ?? { id: 'mock-id' },
    createMany: async () => ({ count: 0 }),
    update: async (d: any) => d?.data ?? { id: 'mock-id' },
    delete: async () => ({}),
    deleteMany: async () => ({ count: 0 }),
  }
  const handler: any = {
    get: (_target: any, prop: string) => {
      if (prop === '$transaction') {
        return async (cb: any) => {
          if (typeof cb === 'function') {
            return cb(new Proxy({}, handler))
          }
          if (Array.isArray(cb)) {
            return Promise.all(cb)
          }
          return []
        }
      }
      if (prop === '$connect' || prop === '$disconnect' || prop === '$on') {
        return async () => {}
      }
      return noOp
    },
  }
  prismaInstance = new Proxy({}, handler)
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
