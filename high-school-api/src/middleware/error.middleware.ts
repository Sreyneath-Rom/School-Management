import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { Prisma } from '@/generated/prisma/client'
import { ApiError } from '@/utils/ApiError'
import { logger } from '@/config/logger'
import { env } from '@/config/env'

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors -> 400 with field-level detail
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
    })
  }

  // Invalid / expired JWTs -> 401, not 500. Without this, any stale token in
  // the browser (or one signed with an old secret) surfaces as a confusing
  // "Internal server error" instead of prompting a clean re-login.
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({ success: false, message: 'Session expired, please log in again' })
  }
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ success: false, message: 'Invalid authentication token' })
  }

  // Body larger than express.json()'s limit -> 413, not 500. Relevant any
  // time a client sends a big JSON payload (e.g. a base64-encoded file).
  if (isPayloadTooLargeError(err)) {
    return res.status(413).json({
      success: false,
      message: 'Request body is too large. Please upload smaller files or use the dedicated upload endpoint.',
    })
  }

  // Malformed JSON body -> 400, not 500.
  if (isBadJsonError(err)) {
    return res.status(400).json({ success: false, message: 'Malformed JSON in request body' })
  }

  // Known Prisma errors -> map to sensible HTTP codes instead of leaking a 500
  const anyErr = err as any
  if (err instanceof Prisma.PrismaClientKnownRequestError || anyErr?.code?.startsWith?.('P')) {
    if (anyErr.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'A record with this value already exists', meta: anyErr.meta })
    }
    if (anyErr.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Record not found' })
    }
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, ...(err.details ? { errors: err.details } : {}) })
  }

  logger.error('Unhandled error', { err, path: req.originalUrl })
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.NODE_ENV !== 'production' && err instanceof Error ? { stack: err.stack } : {}),
  })
}

function isPayloadTooLargeError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    ('type' in err && (err as { type?: string }).type === 'entity.too.large')
  )
}

function isBadJsonError(err: unknown): boolean {
  return (
    err instanceof SyntaxError &&
    typeof err === 'object' &&
    err !== null &&
    'type' in err &&
    (err as { type?: string }).type === 'entity.parse.failed'
  )
}