import type { Request, Response } from 'express'
import { reportsService } from './reports.service'
import { sendSuccess } from '@/utils/apiResponse'

export const reportsController = {
  async attendance(req: Request, res: Response) {
    const { classId, from, to } = req.query as { classId?: string; from?: string; to?: string }
    sendSuccess(res, await reportsService.attendance({ classId, from, to }))
  },

  async grades(req: Request, res: Response) {
    const { classId, subjectId, period } = req.query as {
      classId?: string
      subjectId?: string
      period?: string
    }
    sendSuccess(res, await reportsService.grades({ classId, subjectId, period }))
  },

  async forStudent(req: Request, res: Response) {
    sendSuccess(res, await reportsService.forStudent(req.params.id))
  },

  async forTeacher(req: Request, res: Response) {
    sendSuccess(res, await reportsService.forTeacher(req.params.id))
  },
}