import { Router } from 'express'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendCreated, sendSuccess } from '@/utils/apiResponse'
import { createLeaveRequestSchema, reviewLeaveRequestSchema } from './leaveRequests.validation'

const router = Router()
router.use(authenticate)

router.get(
  '/',
  requirePermission('leaveRequests', 'view'),
  asyncHandler(async (req, res) => {
    const { studentId, status } = req.query as { studentId?: string; status?: string }
    const requests = await prisma.leaveRequest.findMany({
      where: { studentId, status: status as never },
      orderBy: { createdAt: 'desc' },
    })
    sendSuccess(res, requests)
  })
)

router.post(
  '/',
  requirePermission('leaveRequests', 'create'),
  validateBody(createLeaveRequestSchema),
  asyncHandler(async (req, res) => {
    sendCreated(res, await prisma.leaveRequest.create({ data: req.body }))
  })
)

router.patch(
  '/:id/review',
  requirePermission('leaveRequests', 'edit'),
  validateBody(reviewLeaveRequestSchema),
  asyncHandler(async (req, res) => {
    if (!req.user) return
    const updated = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: { status: req.body.status, reviewedBy: req.user.sub, reviewedAt: new Date() },
    })
    sendSuccess(res, updated)
  })
)

export default router
