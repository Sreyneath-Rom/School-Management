import type { Request, Response } from 'express'
import { dashboardService } from './dashboard.service'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'

// Same pattern as notifications/leaveRequests controllers. NOTE: the original
// inline handler here did `if (!req.user) return`, which silently hung the
// request with no response at all — this throws instead, so asyncHandler
// turns it into a proper 401.
function requireUserId(req: Request): string {
  if (!req.user) throw ApiError.unauthorized('Authentication required')
  return req.user.sub
}

export const dashboardController = {
  async stats(_req: Request, res: Response) {
    sendSuccess(res, await dashboardService.stats())
  },

  async attendanceSummary(req: Request, res: Response) {
    const { from, to } = req.query as { from?: string; to?: string }
    sendSuccess(res, await dashboardService.attendanceSummary({ from, to }))
  },

  async gradeSummary(_req: Request, res: Response) {
    sendSuccess(res, await dashboardService.gradeSummary())
  },

  async recentNotifications(req: Request, res: Response) {
    sendSuccess(res, await dashboardService.recentNotifications(requireUserId(req)))
  },
}