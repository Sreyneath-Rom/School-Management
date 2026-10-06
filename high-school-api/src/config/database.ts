import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from './env'
import { logger } from './logger'

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  max: 10,
})

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
})

prisma.$on('warn' as never, (e: unknown) => {
  logger.warn('Prisma warning', { event: e })
})
prisma.$on('error' as never, (e: unknown) => {
  logger.error('Prisma error', { event: e })
})

let connected = false

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