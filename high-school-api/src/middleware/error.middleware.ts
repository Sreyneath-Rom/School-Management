import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
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

  // Known Prisma errors -> map to sensible HTTP codes instead of leaking a 500
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'A record with this value already exists', meta: err.meta })
    }
    if (err.code === 'P2025') {
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
