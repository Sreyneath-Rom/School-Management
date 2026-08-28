import { Router } from 'express'
import reportsRoutes from '@/modules/reports/reports.routes'

const router = Router()

/**
 * Analytical & Performance Reports Routes
 */
router.use('/', reportsRoutes)

export default router
