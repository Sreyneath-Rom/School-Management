import type { NextFunction, Request, RequestHandler, Response } from 'express'

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>

/**
 * Wraps an async route handler so rejected promises reach Express's error
 * pipeline. Express 4 does not await handler return values — without this,
 * any `await` that throws becomes an unhandled rejection and the client
 * hangs until the socket times out.
 *
 * The return type is `RequestHandler` so Express's own type inference is
 * happy when this is passed to `router.get(...)`.
 */
export function asyncHandler(fn: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}