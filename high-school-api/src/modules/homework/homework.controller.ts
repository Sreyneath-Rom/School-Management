import type { Request, Response } from 'express'
import {
  homeworkService,
  studentIdForUser,
  teacherIdForUser,
} from './homework.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateHomeworkBody,
  GradeHomeworkBody,
  ListHomeworkQuery,
  SubmitHomeworkBody,
  UpdateHomeworkBody,
} from './homework.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const homeworkController = {
  async list(req: Request, res: Response) {
    requireUser(req)
    const query = (req.validated?.query ?? {}) as ListHomeworkQuery

    const result = await homeworkService.list(query)

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
      await homeworkService.getById(req.params.id, {
        roleName: user.roleName,
        userId: user.sub,
      })
    )
  },

  async create(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as CreateHomeworkBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Teacher identity comes from the authenticated user, not the body.
    const teacherId = await teacherIdForUser(user.sub)

    sendCreated(res, await homeworkService.create({ ...body, teacherId }))
  },

  async update(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as UpdateHomeworkBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await homeworkService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    requireUser(req)
    await homeworkService.remove(req.params.id)
    res.status(204).end()
  },

  async submit(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as SubmitHomeworkBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Student identity comes from the authenticated user, not the body. A
    // caller without a Student row (e.g. a teacher who somehow holds
    // homework.create) gets a 403 here instead of writing a submission
    // attributed to a student who isn't them.
    const studentId = await studentIdForUser(user.sub)

    sendCreated(
      res,
      await homeworkService.submit(req.params.id, studentId, body)
    )
  },

  async grade(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as GradeHomeworkBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Admin can grade any submission; a teacher can only grade their own.
    const isAdmin = user.roleName === 'admin'
    const teacherId = isAdmin
      ? // For an admin, pass a dummy id that will never match a homework —
        // the `isAdmin` flag short-circuits the ownership check in the service.
        ''
      : await teacherIdForUser(user.sub)

    sendSuccess(
      res,
      await homeworkService.grade(req.params.submissionId, teacherId, body, isAdmin)
    )
  },
}