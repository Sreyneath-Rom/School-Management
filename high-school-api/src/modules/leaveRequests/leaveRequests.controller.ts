import type { Request, Response } from 'express'
import {
  leaveRequestsService,
  studentIdForUser,
} from './leaveRequests.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateLeaveRequestForStudentBody,
  CreateLeaveRequestBody,
  ListLeaveRequestsQuery,
  ReviewLeaveRequestBody,
  UpdateLeaveRequestBody,
} from './leaveRequests.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const leaveRequestsController = {
  async list(req: Request, res: Response) {
    const user = requireUser(req)
    const query = (req.validated?.query ?? {}) as ListLeaveRequestsQuery

    // Students see only their own leave requests, overriding any `studentId`
    // they sent. The previous version did this too, but with `??` — which
    // meant a student who left `studentId` blank got their own, and one who
    // supplied another student's id also got their own. Functionally correct
    // but worth making explicit; the same pattern in `grades.controller.ts`
    // had a real leak where the query param won.
    const studentId =
      user.roleName === 'student'
        ? await studentIdForUser(user.sub)
        : query.studentId

    const result = await leaveRequestsService.list({ ...query, studentId })

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
    sendSuccess(
      res,
      await leaveRequestsService.getById(req.params.id, {
        roleName: user.roleName,
        userId: user.sub,
      })
    )
  },

  /**
   * Two create paths, selected by role:
   *   - student: files their own (studentId from token)
   *   - everyone else: files on behalf of a student (studentId from body)
   *
   * The body schema differs between the two, and the route validates against
   * whichever the caller's role requires. See `leaveRequests.routes.ts` — the
   * route applies `createLeaveRequestSchema` for students and
   * `createLeaveRequestForStudentSchema` for staff, based on a small role
   * check middleware.
   */
  async create(req: Request, res: Response) {
    const user = requireUser(req)

    if (user.roleName === 'student') {
      const body = req.validated?.body as CreateLeaveRequestBody | undefined
      if (!body) throw ApiError.badRequest('Request body is required')

      const studentId = await studentIdForUser(user.sub)
      return sendCreated(
        res,
        await leaveRequestsService.createForSelf(studentId, body)
      )
    }

    const body = req.validated?.body as
      | CreateLeaveRequestForStudentBody
      | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    return sendCreated(
      res,
      await leaveRequestsService.createForStudent(body)
    )
  },

  async update(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as UpdateLeaveRequestBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Ownership check for students — they may only edit their own pending
    // request. The service can't enforce this because the update schema has
    // no `studentId` field to compare against.
    if (user.roleName === 'student') {
      const ownStudentId = await studentIdForUser(user.sub)
      const existing = await leaveRequestsService.getById(req.params.id, {
        roleName: user.roleName,
        userId: user.sub,
      })
      if ((existing as { studentId: string }).studentId !== ownStudentId) {
        throw ApiError.forbidden('You can only edit your own leave requests')
      }
    }

    sendSuccess(res, await leaveRequestsService.update(req.params.id, body))
  },

  async review(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as ReviewLeaveRequestBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(
      res,
      await leaveRequestsService.review(req.params.id, user.sub, body)
    )
  },

  async remove(req: Request, res: Response) {
    const user = requireUser(req)

    // Same ownership check as update.
    if (user.roleName === 'student') {
      const ownStudentId = await studentIdForUser(user.sub)
      const existing = await leaveRequestsService.getById(req.params.id, {
        roleName: user.roleName,
        userId: user.sub,
      })
      if ((existing as { studentId: string }).studentId !== ownStudentId) {
        throw ApiError.forbidden('You can only cancel your own leave requests')
      }
    }

    await leaveRequestsService.remove(req.params.id)
    res.status(204).end()
  },
}