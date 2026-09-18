import type { Request, Response } from 'express'
import { reportsService } from './reports.service'
import { sendSuccess } from '@/utils/apiResponse'
import { buildPaginationMeta } from '@/utils/pagination'
import type {
  AttendanceReportQuery,
  GradesReportQuery,
} from './reports.validation'

export const reportsController = {
  async attendance(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as AttendanceReportQuery

    const result = await reportsService.attendance(query)

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

  async grades(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as GradesReportQuery

    const result = await reportsService.grades(query)

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

  async forStudent(req: Request, res: Response) {
    sendSuccess(res, await reportsService.forStudent(req.params.id))
  },

  async forTeacher(req: Request, res: Response) {
    sendSuccess(res, await reportsService.forTeacher(req.params.id))
  },
}