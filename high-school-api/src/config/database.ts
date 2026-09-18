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
  throw new Error('Unable to initialize Prisma database client')
}

export const prisma = new Proxy({} as any, {
  get: (_target: any, prop: string) => {
    const target = prismaInstance
    const val = target[prop]
    if (typeof val === 'function') {
      return val.bind(target)
    }
    return val
  },
})

export async function connectDatabase() {
  try {
    if (prismaInstance?.$connect) {
      await prismaInstance.$connect()
      logger.info('Connected to PostgreSQL via Prisma')
    }
  } catch (err) {
    logger.error('Could not connect to PostgreSQL', { err })
    throw err
  }
}

export async function disconnectDatabase() {
  try {
    if (prisma?.$disconnect) {
      await prisma.$disconnect()
    }
  } catch {}
}
