import { Router } from 'express'
import schoolRoutes from '@/modules/school/school.routes'
import usersRoutes from '@/modules/users/users.routes'
import rolesRoutes from '@/modules/roles/roles.routes'
import permissionsRoutes from '@/modules/permissions/permissions.routes'
import languagesRoutes from '@/modules/languages/languages.routes'
import translationsRoutes from '@/modules/translations/translations.routes'

const router = Router()

/**
 * Administrative Setup, RBAC & Localization Routes
 */
router.use('/school', schoolRoutes)
router.use('/users', usersRoutes)
router.use('/roles', rolesRoutes)
router.use('/permissions', permissionsRoutes)
router.use('/languages', languagesRoutes)
router.use('/translations', translationsRoutes)

export default router
