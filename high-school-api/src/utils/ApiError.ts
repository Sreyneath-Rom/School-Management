export class ApiError extends Error {
  readonly statusCode: number
  readonly details?: unknown

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
    // Preserves the stack without the ApiError constructor frame — makes the
    // stack trace point at the throw site, not this file.
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new ApiError(400, message, details)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message)
  }

  static conflict(message = 'Conflict', details?: unknown) {
    return new ApiError(409, message, details)
  }

  /**
   * 422 — request is well-formed and valid, but semantically can't be
   * processed (e.g. "cannot archive an academic year that still has classes").
   * Distinct from 400, which is malformed input, and 409, which is a state
   * collision on a unique field.
   */
  static unprocessable(message = 'Unprocessable entity', details?: unknown) {
    return new ApiError(422, message, details)
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message)
  }
}