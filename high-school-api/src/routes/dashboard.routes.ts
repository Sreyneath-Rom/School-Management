import { Router } from 'express'
import dashboardRoutes from '@/modules/dashboard/dashboard.routes'

const router = Router()

/**
 * Main Dashboard Statistics & Overview Routes
 */
router.use('/', dashboardRoutes)

export default router
