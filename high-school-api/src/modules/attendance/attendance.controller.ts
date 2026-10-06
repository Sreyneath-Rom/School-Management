import type { Request, Response } from 'express'
import { attendanceService } from './attendance.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { toUtcMidnight } from '@/utils/date'
import type {
  BulkMarkBody,
  CheckInBody,
  CheckOutBody,
  ListAttendanceQuery,
  StatsQuery,
  UpdateAttendanceBody,
} from './attendance.validation'

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user
}

export const attendanceController = {
  async list(req: Request, res: Response) {
    const user = requireUser(req)
    const query = (req.validated?.query ?? {}) as ListAttendanceQuery

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

    // Fallback must be UTC midnight — `new Date()` has a time component
    // and would never match a stored attendance.date.
    const targetDate = query.date ?? toUtcMidnight(new Date())

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