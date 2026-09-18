import type { Request, Response } from 'express'
import { attendanceService } from './attendance.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  BulkMarkBody,
  CheckInBody,
  CheckOutBody,
  ListAttendanceQuery,
  StatsQuery,
  UpdateAttendanceBody,
} from './attendance.validation'

/**
 * `authenticate` runs on every route in attendance.routes.ts, so `req.user`
 * is set by the time any handler here runs. Guard exists so TypeScript can
 * narrow without a non-null assertion at every call.
 */
function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const attendanceController = {
  async list(req: Request, res: Response) {
    const user = requireUser(req)
    const query = (req.validated?.query ?? {}) as ListAttendanceQuery

    // Students can only ever see their own attendance. Overriding the query
    // param here (rather than trusting the client) is the same pattern used
    // by the notifications module: every read is scoped by identity.
    const studentId =
      user.roleName === 'student'
        ? await attendanceService.studentIdForUser(user.sub)
        : query.studentId

    sendSuccess(
      res,
      await attendanceService.list({
        ...query,
        studentId,
        includeUnmarked: user.roleName !== 'student',
      })
    )
  },

  async getStats(req: Request, res: Response) {
    const user = requireUser(req)
    const query = (req.validated?.query ?? {}) as StatsQuery
    const targetDate = query.date ?? new Date()

    // Same scoping: a student asking for stats gets their own, not the
    // whole-school aggregate.
    const studentId =
      user.roleName === 'student'
        ? await attendanceService.studentIdForUser(user.sub)
        : undefined

    sendSuccess(
      res,
      await attendanceService.getStats(targetDate, {
        studentId,
        classId: query.classId,
      })
    )
  },

  async getById(req: Request, res: Response) {
    const user = requireUser(req)
    const record = await attendanceService.getById(req.params.id)

    // Ownership check for students — otherwise any student with
    // `attendance.view` could enumerate IDs and read classmates' records.
    // Fixes a hole in the previous version, which returned the record to
    // any caller regardless of role.
    if (
      user.roleName === 'student' &&
      (record as { student: { userId: string } }).student.userId !== user.sub
    ) {
      throw ApiError.forbidden('You can only view your own attendance records')
    }

    sendSuccess(res, record)
  },

  async checkIn(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as CheckInBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await attendanceService.checkIn(body))
  },

  async bulkMark(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as BulkMarkBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await attendanceService.bulkMark(body))
  },

  async checkOut(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as CheckOutBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(
      res,
      await attendanceService.checkOut(body.studentId, body.date, body.checkOut)
    )
  },

  async update(req: Request, res: Response) {
    requireUser(req)
    const body = req.validated?.body as UpdateAttendanceBody | undefined
    if (!body) throw ApiError.badRequest('Request body is required')

    sendSuccess(res, await attendanceService.update(req.params.id, body))
  },

  async remove(req: Request, res: Response) {
    requireUser(req)
    await attendanceService.remove(req.params.id)
    res.status(204).end()
  },
}