import type { Request, Response } from 'express'
import { attendanceService } from './attendance.service'
import { sendSuccess } from '@/utils/apiResponse'

export const attendanceController = {
  async list(req: Request, res: Response) {
    const { studentId, from, to } = req.query as { studentId?: string; from?: string; to?: string }
    sendSuccess(res, await attendanceService.list({ studentId, from, to }))
  },

  async getById(req: Request, res: Response) {
    sendSuccess(res, await attendanceService.getById(req.params.id))
  },

  async checkIn(req: Request, res: Response) {
    sendSuccess(res, await attendanceService.checkIn(req.body))
  },

  async checkOut(req: Request, res: Response) {
    sendSuccess(res, await attendanceService.checkOut(req.body.studentId, req.body.date))
  },

  async remove(req: Request, res: Response) {
    await attendanceService.remove(req.params.id)
    // No sendSuccess helper for empty bodies here — 204 must not include a
    // response body, so this bypasses the JSON envelope entirely.
    res.status(204).end()
  },
}