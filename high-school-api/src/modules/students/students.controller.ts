import type { Request, Response } from 'express'
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

/**
 * Enforces ownership on student-scoped reads.
 *
 *   - Students see only their own profile.
 *   - Parents see only their own children (requires a Student↔Parent link).
 *   - Teachers and admins see any student (they need it for their class).
 *
 * Called with the student's `userId` (the linked User id), not the Student
 * row id, so the comparison is against `req.user.sub` directly.
 *
 * The service is role-agnostic and returns whatever the id resolves to; this
 * function is where the authorization decision lives.
 */
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
    // Verifies the parent is actually linked to this student. The parent
    // module doesn't exist yet, but the relation is referenced by the
    // student profile include, so the query is available.
    const link = await prisma.studentParent.findFirst({
      where: { parent: { userId: user.sub }, student: { userId: studentUserId } },
      select: { studentId: true },
    })
    if (!link) throw ApiError.forbidden('You can only view your own children')
    return
  }

  throw ApiError.forbidden('Insufficient role')
}

// Imported lazily above the function that uses it — kept at the bottom to
// avoid a circular import between controller and service modules. Move it
// to the top of the file if your linter complains.
import { prisma } from '@/config/database'

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