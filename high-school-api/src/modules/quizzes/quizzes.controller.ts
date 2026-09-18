import type { Request, Response } from 'express'
import {
  quizzesService,
  studentIdForUser,
  teacherIdForUser,
} from './quizzes.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  CreateQuizBody,
  ListQuizzesQuery,
  SubmitQuizBody,
  UpdateQuizBody,
} from './quizzes.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

/**
 * Resolves the (teacherId, isAdmin) pair the update/delete ownership checks
 * need. Admins don't need a Teacher row; `isAdmin: true` short-circuits the
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

export const quizzesController = {
  async list(req: Request, res: Response) {
    const user = requireUser(req)
    const query = (req.validated?.query ?? {}) as ListQuizzesQuery

    const result = await quizzesService.list(query, user.roleName)

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
    // Role-aware projection: staff see correctAnswer, students don't. The
    // service decides based on `roleName`, so no branch here.
    sendSuccess(res, await quizzesService.getById(req.params.id, user.roleName))
  },

  async create(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as CreateQuizBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Teacher identity comes from the authenticated user, not the body.
    const teacherId = await teacherIdForUser(user.sub)

    sendCreated(res, await quizzesService.create({ ...body, teacherId }))
  },

  async update(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as UpdateQuizBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    const actor = await resolveActor({ sub: user.sub, roleName: user.roleName })

    sendSuccess(res, await quizzesService.update(req.params.id, body, actor))
  },

  async remove(req: Request, res: Response) {
    const user = requireUser(req)
    const actor = await resolveActor({ sub: user.sub, roleName: user.roleName })

    await quizzesService.remove(req.params.id, actor)
    res.status(204).end()
  },

  async submit(req: Request, res: Response) {
    const user = requireUser(req)
    const body = req.validated?.body as SubmitQuizBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    // Student identity comes from the authenticated user, not the body. A
    // teacher who somehow reaches this endpoint gets a 403 here rather than
    // a submission attributed to a student.
    const studentId = await studentIdForUser(user.sub)

    sendCreated(res, await quizzesService.submit(req.params.id, studentId, body))
  },
}