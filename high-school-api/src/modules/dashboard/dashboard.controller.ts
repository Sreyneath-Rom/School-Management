import type { Request, Response } from 'express'
import { dashboardService } from './dashboard.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import type {
  AttendanceSummaryQuery,
  GradeSummaryQuery,
  StatsQuery,
} from './dashboard.validation'

/**
 * `authenticate` runs on every route in dashboard.routes.ts, so `req.user`
 * is set by the time any handler here runs. The guard exists so TypeScript
 * can narrow the type without a non-null assertion at every call site.
 *
 * The original inline handler used `if (!req.user) return`, which left the
 * request hanging with no response — the client would time out rather than
 * receiving a 401. Throwing lets asyncHandler convert it to a proper 401.
 */
function requireUserId(req: Request): string {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user.sub
}

export const dashboardController = {
  async stats(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as StatsQuery
    sendSuccess(res, await dashboardService.stats(query))
  },

  async attendanceSummary(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as AttendanceSummaryQuery
    sendSuccess(res, await dashboardService.attendanceSummary(query))
  },

  async gradeSummary(req: Request, res: Response) {
    const query = (req.validated?.query ?? {}) as GradeSummaryQuery
    sendSuccess(res, await dashboardService.gradeSummary(query))
  },

  async recentNotifications(req: Request, res: Response) {
    const userId = requireUserId(req)
    sendSuccess(res, await dashboardService.recentNotifications(userId))
  },
}