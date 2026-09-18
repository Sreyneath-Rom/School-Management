import winston from 'winston'
import path from 'node:path'
import fs from 'node:fs'
import { env } from './env'

const { combine, timestamp, printf, colorize, errors, json, splat } = winston.format

/**
 * Winston's default npm levels do not include `http`. Adding it so
 * `logger.http(...)` from httpLogStream lands at a level between info and
 * debug, which is where access logs belong.
 */
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
    // requestId is optional — not every log line is inside a request. When
    // present, prefix it so grep by correlation ID works on a single string.
    const rid = typeof requestId === 'string' ? ` [${requestId.slice(0, 8)}]` : ''
    return `${ts} [${level}]${rid} ${stack || message}`
  })
)

const prodFormat = combine(timestamp(), errors({ stack: true }), splat(), json())

/**
 * Ensure the logs directory exists before either file transport tries to open
 * its stream — otherwise the first write on a fresh container throws ENOENT.
 * `recursive: true` is idempotent and safe to run at module load.
 */
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
  // Don't crash the process if a log file becomes unwritable — logging
  // failures should degrade, not take the API down.
  exitOnError: false,
})

export const logger = rootLogger

/**
 * Returns a logger that automatically includes the given bindings on every
 * log line. Use inside request-scoped code:
 *
 *   const log = logger.child({ requestId: req.id })
 *   log.error('Unhandled error', { err })
 *
 * Instead of threading `requestId` through every call site manually.
 */
export function childLogger(bindings: Record<string, unknown>) {
  return rootLogger.child(bindings)
}

/**
 * Morgan-compatible write stream. Morgan will call `write(line)` once per
 * request; we route those to `logger.http`.
 */
export const httpLogStream = {
  write: (message: string) => {
    rootLogger.http(message.trim())
  },
}