import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from './env'
import { logger } from './logger'

// Prisma 7 removed the bundled Rust query engine — a driver adapter is now
// mandatory for every database. This is the Postgres one.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
})

prisma.$on('warn' as never, (e: unknown) => logger.warn('Prisma warning', { e }))
prisma.$on('error' as never, (e: unknown) => logger.error('Prisma error', { e }))

export async function connectDatabase() {
  await prisma.$connect()
  logger.info('Connected to PostgreSQL via Prisma')
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}
