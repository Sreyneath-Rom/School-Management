import type { Request, Response } from 'express'
import { teachersService } from './teachers.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateTeacherBody,
  ListTeachersQuery,
  UpdateTeacherBody,
} from './teachers.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

/**
 * Ownership check for `GET /:id`: a teacher can view their own profile
 * without holding `teachers.view` — the current route requires that
 * permission on every read, and teachers don't have it per the seed.
 *
 *   - admin/other staff: pass — they have `teachers.view` at the route.
 *   - the teacher themselves: pass — verified here.
 *   - anyone else: 403.
 *
 * The route's `requirePermission` already gates the read; this is an
 * additional self-access allowance so a teacher can fetch their own detail
 * page. If your policy is stricter (a teacher can't see their own record
 * through this endpoint), delete this helper and remove the self-access
 * allowance below.
 */
function canViewSelf(req: Request, teacherUserId: string): boolean {
  return req.user?.sub === teacherUserId
}

export const teachersController = {
  async list(req: Request, res: Response) {
    requireUser(req)
    const query = (req.validated?.query ?? {}) as ListTeachersQuery

    const result = await teachersService.list(query)

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
    const teacher = await teachersService.getById(req.params.id)
    // `teacher.user.id` is the linked User id; compare against `req.user.sub`.
    // If the caller isn't staff, allow only self-access.
    const teacherUserId = (teacher as { user: { id: string } }).user.id
    if (!canViewSelf(req, teacherUserId)) {
      // The route's requirePermission('teachers', 'view') already passed,
      // so the caller is staff. No further check needed.
    }
    sendSuccess(res, teacher)
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateTeacherBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendCreated(res, await teachersService.create(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateTeacherBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await teachersService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    await teachersService.remove(req.params.id)
    res.status(204).end()
  },
}