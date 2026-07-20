import winston from 'winston'
import path from 'path'
import { env } from './env'

const { combine, timestamp, printf, colorize, errors, json } = winston.format

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => `${ts} [${level}] ${stack || message}`)
)

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: env.NODE_ENV === 'production' ? combine(timestamp(), errors({ stack: true }), json()) : devFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
  ],
})

// Separate stream for morgan-style HTTP request logging, wired in app.ts
export const httpLogStream = {
  write: (message: string) => logger.http?.(message.trim()) ?? logger.info(message.trim()),
}
