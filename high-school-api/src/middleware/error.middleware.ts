import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { MulterError } from 'multer'
import { Prisma } from '@/generated/prisma/client'
import { ApiError } from '@/utils/ApiError'
import { logger } from '@/config/logger'
import { env } from '@/config/env'

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    requestId: req.id ?? 'unknown',
  })
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Defensive: req.id is optional. Passing undefined to res.setHeader
  // throws ERR_HTTP_INVALID_HEADER_VALUE, which would turn every error
  // into a generic 500.
  const requestId = req.id ?? 'unknown'
  res.setHeader('x-request-id', requestId)

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
      requestId,
    })
  }

  if (err instanceof MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File too large. Maximum size is ${env.MAX_UPLOAD_MB} MB.`
        : `Upload rejected: ${err.code}`
    return res.status(status).json({ success: false, message, requestId })
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: 'Session expired, please log in again',
      requestId,
    })
  }
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      requestId,
    })
  }

  if (isPayloadTooLargeError(err)) {
    return res.status(413).json({
      success: false,
      message:
        'Request body is too large. Please upload smaller files or use the dedicated upload endpoint.',
      requestId,
    })
  }
  if (isBadJsonError(err)) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body',
      requestId,
    })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'A record with this value already exists',
          meta: err.meta,
          requestId,
        })
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
          requestId,
        })
      case 'P2003':
        return res.status(409).json({
          success: false,
          message:
            'This record is still referenced by other records and cannot be modified.',
          requestId,
        })
      case 'P2014':
        return res.status(409).json({
          success: false,
          message: 'The change would violate a required relation.',
          requestId,
        })
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error('Prisma validation error', {
      err,
      path: req.originalUrl,
      requestId,
    })
    return res.status(400).json({
      success: false,
      message: 'Invalid data for this operation',
      requestId,
    })
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
      requestId,
    })
  }

  logger.error('Unhandled error', {
    err,
    path: req.originalUrl,
    method: req.method,
    requestId,
  })

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    requestId,
    ...(env.NODE_ENV !== 'production' && err instanceof Error
      ? { stack: err.stack }
      : {}),
  })
}

function isPayloadTooLargeError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'type' in err &&
    (err as { type?: string }).type === 'entity.too.large'
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