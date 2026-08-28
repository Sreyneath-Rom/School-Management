import type { Request, Response } from 'express'
import { attendanceService } from './attendance.service'
import { sendSuccess } from '@/utils/apiResponse'

export const attendanceController = {
  async list(req: Request, res: Response) {
    const { studentId, date, from, to, classId } = req.query as {
      studentId?: string
      date?: string
      from?: string
      to?: string
      classId?: string
    }
    sendSuccess(res, await attendanceService.list({ studentId, date, from, to, classId }))
  },

  async getStats(req: Request, res: Response) {
    const { date } = req.query as { date?: string }
    sendSuccess(res, await attendanceService.getStats(date))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await attendanceService.getById(req.params.id))
  },

  async checkIn(req: Request, res: Response) {
    sendSuccess(res, await attendanceService.checkIn(req.body))
  },

  async bulkMark(req: Request, res: Response) {
    sendSuccess(res, await attendanceService.bulkMark(req.body))
  },

  async checkOut(req: Request, res: Response) {
    sendSuccess(res, await attendanceService.checkOut(req.body.studentId, req.body.date, req.body.checkOut))
  },

  async remove(req: Request, res: Response) {
    await attendanceService.remove(req.params.id)
    res.status(204).end()
  },
}
