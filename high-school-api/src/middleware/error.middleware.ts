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
    requestId: req.id,
  })
}

/**
 * Express recognizes an error handler by its 4-argument signature. `_next`
 * must stay in the parameter list even though it's unused — removing it turns
 * this function into ordinary middleware and errors fall through to Express's
 * default HTML error page.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.id
  // Echo the correlation ID on every error response so a user pasting
  // "something went wrong" into a ticket gives you a trail to follow.
  res.setHeader('x-request-id', requestId)

  // ---- Zod validation ----
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten().fieldErrors,
      requestId,
    })
  }

  // ---- Multer file uploads ----
  // Multer throws its own error class for oversized files, unexpected fields,
  // and too many files. The ApiError we pass from `fileFilter` is a separate
  // class and is caught by the ApiError branch below.
  if (err instanceof MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File too large. Maximum size is ${env.MAX_UPLOAD_MB} MB.`
        : `Upload rejected: ${err.code}`
    return res.status(status).json({ success: false, message, requestId })
  }

  // ---- JWT ----
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .json({ success: false, message: 'Session expired, please log in again', requestId })
  }
  if (err instanceof JsonWebTokenError) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid authentication token', requestId })
  }

  // ---- Body parser ----
  if (isPayloadTooLargeError(err)) {
    return res.status(413).json({
      success: false,
      message:
        'Request body is too large. Please upload smaller files or use the dedicated upload endpoint.',
      requestId,
    })
  }
  if (isBadJsonError(err)) {
    return res
      .status(400)
      .json({ success: false, message: 'Malformed JSON in request body', requestId })
  }

  // ---- Prisma known request errors ----
  // Match only on `instanceof`. Do NOT fall back to a string check on
  // `err.code` — that catches unrelated errors from the pg driver, Node, or
  // any third-party library whose `code` happens to start with "P".
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
        return res
          .status(404)
          .json({ success: false, message: 'Record not found', requestId })
      case 'P2003':
        // Foreign key constraint failed on delete/update.
        return res.status(409).json({
          success: false,
          message:
            'This record is still referenced by other records and cannot be modified.',
          requestId,
        })
      case 'P2014':
        // Required relation violation.
        return res.status(409).json({
          success: false,
          message: 'The change would violate a required relation.',
          requestId,
        })
      // No default — unrecognized Prisma codes fall through to the 500 branch
      // below so they get logged rather than silently swallowed.
    }
  }

  // ---- Prisma validation errors ----
  // Usually a bug in a service layer passing the wrong shape, not something a
  // client can trigger. Log it and report 400 so the bug is visible.
  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error('Prisma validation error', { err, path: req.originalUrl, requestId })
    return res
      .status(400)
      .json({ success: false, message: 'Invalid data for this operation', requestId })
  }

  // ---- Application errors ----
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
      requestId,
    })
  }

  // ---- Unknown ----
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