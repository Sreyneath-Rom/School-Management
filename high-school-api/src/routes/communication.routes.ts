import { Router } from 'express'
import announcementsRoutes from '@/modules/announcements/announcements.routes'
import notificationsRoutes from '@/modules/notifications/notifications.routes'

const router = Router()

/**
 * Communication & Notification Hub Routes
 */
router.use('/announcements', announcementsRoutes)
router.use('/notifications', notificationsRoutes)

export default router
