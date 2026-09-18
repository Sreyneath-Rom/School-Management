import type { Request, Response } from 'express'
import { lessonsService, teacherIdForUser } from './lessons.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateLessonBody,
  ListLessonsQuery,
  UpdateLessonBody,
} from './lessons.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

/**
 * Resolves the (teacherId, isAdmin) pair that the update/delete ownership
 * checks need. A non-admin caller with no Teacher profile can't have created
 * any lessons, so returning an empty string guarantees they'll fail every
 * ownership comparison — same result as an explicit 403, but without an
 * extra branch at each call site.
 *
 * Admins don't need a Teacher row; `isAdmin: true` short-circuits the
 * ownership check in the service.
 */
async function resolveActor(user: {
  sub: string
  roleName: string
}): Promise<{ teacherId: string; isAdmin: boolean }> {
  if (user.roleName === 'admin') {
    return { teacherId: '', isAdmin: true }
  }
  const teacherId = await teacherIdForUser(user.sub)
  return { teacherId, isAdmin: false }
}

export const lessonsController = {
  async list(req: Request, res: Response) {
    requireUser(req)
    const query = (req.validated?.query ?? {}) as ListLessonsQuery

    const result = await lessonsService.list(query)

    sendSuccess(
      res,
      result.items,
      200,
      buildPaginationMeta(result.total, {
        page: result.page,
        limit: result.limit,
      })
    )
  },

  async getById(req: Request, res: Response) {
    requireUser(req)
    sendSuccess(res, await lessonsService.getById(req.params.id))
  },

  async create(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as CreateLessonBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Teacher identity comes from the authenticated user, not the body.
    const teacherId = await teacherIdForUser(user.sub)

    sendCreated(res, await lessonsService.create({ ...body, teacherId }))
  },

  async update(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as UpdateLessonBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    const actor = await resolveActor({ sub: user.sub, roleName: user.roleName })

    sendSuccess(
      res,
      await lessonsService.update(req.params.id, body, actor)
    )
  },

  async remove(req: Request, res: Response) {
    const user = requireUser(req)
    const actor = await resolveActor({ sub: user.sub, roleName: user.roleName })

    await lessonsService.remove(req.params.id, actor)
    res.status(204).end()
  },
}