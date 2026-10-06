import winston from 'winston'
import path from 'node:path'
import fs from 'node:fs'
import { env } from './env'

const { combine, timestamp, printf, colorize, errors, json, splat } = winston.format

const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  colors: { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'blue' },
}
winston.addColors(customLevels.colors)

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  printf(({ level, message, timestamp: ts, stack, requestId }) => {
    const rid = typeof requestId === 'string' ? ` [${requestId.slice(0, 8)}]` : ''
    return `${ts} [${level}]${rid} ${stack || message}`
  })
)

const prodFormat = combine(timestamp(), errors({ stack: true }), splat(), json())

const logDir = path.resolve('logs')
fs.mkdirSync(logDir, { recursive: true })

const rootLogger = winston.createLogger({
  level: env.LOG_LEVEL ?? (env.NODE_ENV === 'production' ? 'info' : 'debug'),
  levels: customLevels.levels,
  format: env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
  exitOnError: false,
})

export const logger = rootLogger

export function childLogger(bindings: Record<string, unknown>) {
  return rootLogger.child(bindings)
}

export const httpLogStream = {
  write: (message: string) => {
    rootLogger.http(message.trim())
  },
}