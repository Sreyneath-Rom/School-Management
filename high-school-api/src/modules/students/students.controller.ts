import type { Request, Response } from 'express'
import { prisma } from '@/config/database'
import { studentsService } from './students.service'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateStudentBody,
  EnrollStudentBody,
  ListStudentsQuery,
  UpdateStudentBody,
} from './students.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

async function assertStudentAccess(
  req: Request,
  studentUserId: string
): Promise<void> {
  const user = requireUser(req)
  if (user.roleName === 'admin' || user.roleName === 'teacher') return

  if (user.roleName === 'student') {
    if (studentUserId !== user.sub) {
      throw ApiError.forbidden('You can only view your own student profile')
    }
    return
  }

  if (user.roleName === 'parent') {
    const link = await prisma.studentParent.findFirst({
      where: {
        parent: { userId: user.sub },
        student: { userId: studentUserId },
      },
      select: { studentId: true },
    })
    if (!link) throw ApiError.forbidden('You can only view your own children')
    return
  }

  throw ApiError.forbidden('Insufficient role')
}

export const studentsController = {
  async list(req: Request, res: Response) {
    requireUser(req)
    const query = (req.validated?.query ?? {}) as ListStudentsQuery
    const { items, meta } = await studentsService.list(query)
    sendSuccess(res, items, 200, meta)
  },

  async getById(req: Request, res: Response) {
    const student = await studentsService.getById(req.params.id)
    await assertStudentAccess(req, (student as { userId: string }).userId)
    sendSuccess(res, student)
  },

  async getProfile(req: Request, res: Response) {
    const student = await studentsService.getProfile(req.params.id)
    await assertStudentAccess(req, (student as { userId: string }).userId)
    sendSuccess(res, student)
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as CreateStudentBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendCreated(res, await studentsService.create(body))
  },

  async enroll(req: Request, res: Response) {
    const body = req.validated?.body as EnrollStudentBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendCreated(res, await studentsService.enroll(body))
  },

  async update(req: Request, res: Response) {
    const body = req.validated?.body as UpdateStudentBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')
    sendSuccess(res, await studentsService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    await studentsService.remove(req.params.id)
    res.status(204).end()
  },
}