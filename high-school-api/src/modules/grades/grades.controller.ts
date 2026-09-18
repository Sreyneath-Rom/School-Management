import type { Request, Response } from 'express'
import { gradesService, teacherIdForUser } from './grades.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  ListGradesQuery,
  UpsertGradeBody,
} from './grades.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const gradesController = {
  /**
   * Returns the calling student's own grades. Paginated response envelope,
   * same shape as `list` — clients can render both with the same code.
   */
  async me(req: Request, res: Response) {
    const user = requireUser(req)
    const result = await gradesService.listForUser(user.sub)
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

  async list(req: Request, res: Response) {
    const user = requireUser(req)
    const query = (req.validated?.query ?? {}) as ListGradesQuery

    // Students see only their own grades, overriding any `studentId` they
    // sent. Without this, a student holding `grades.view` could enumerate
    // IDs and read classmates' grades.
    const studentId =
      user.roleName === 'student'
        ? await gradesService.studentIdForUser(user.sub)
        : query.studentId

    const result = await gradesService.list({ ...query, studentId })

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
    const user = requireUser(req)
    const grade = await gradesService.getById(req.params.id)

    // Same ownership rule as list — students see only their own. Without
    // this, guessing an id was enough to read any student's grade.
    if (
      user.roleName === 'student' &&
      (grade as { student: { user: { id: string } } }).student.user.id !== user.sub
    ) {
      throw ApiError.forbidden('You can only view your own grades')
    }

    sendSuccess(res, grade)
  },

  async upsert(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as UpsertGradeBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Teacher identity comes from the authenticated user, not the body.
    const teacherId = await teacherIdForUser(user.sub)

    sendSuccess(res, await gradesService.upsert({ ...body, teacherId }))
  },

  async remove(req: Request, res: Response) {
    requireUser(req)
    await gradesService.remove(req.params.id)
    res.status(204).end()
  },
}