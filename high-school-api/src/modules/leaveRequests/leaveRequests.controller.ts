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
  async pendingCount(_req: Request, res: Response) {
    sendSuccess(res, await leaveRequestsService.pendingCount())
  },

  async list(req: Request, res: Response) {
    const user = requireUser(req)
    const query = (req.validated?.query ?? {}) as ListLeaveRequestsQuery

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

    return sendCreated(res, await leaveRequestsService.createForStudent(body))
  },

  async update(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as UpdateLeaveRequestBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

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