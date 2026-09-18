import type { Response } from 'express'

/**
 * Success response envelope. Every 2xx response has `{ success: true, data }`
 * plus an optional `meta` — the pagination helpers hang off `meta` so the
 * payload shape never changes between paginated and non-paginated endpoints.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>
) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  })
}

export function sendCreated<T>(res: Response, data: T) {
  return sendSuccess(res, data, 201)
}

/**
 * 204 responses must not include a body — `res.send()` with no argument
 * produces the correct empty response, `res.json({})` does not.
 */
export function sendNoContent(res: Response) {
  return res.status(204).send()
}