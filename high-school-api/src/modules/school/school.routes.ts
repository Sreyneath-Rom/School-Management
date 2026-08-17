import { Router } from 'express'
import { schoolController } from './school.controller'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { upload } from '@/middleware/upload.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { upsertSchoolSchema } from './school.validation'

const router = Router()
router.use(authenticate)

// Single-tenant: there is exactly one School row. GET returns it (or 404 if
// setup hasn't run yet); PATCH upserts it (creates on first save, updates
// after). There's no separate POST-to-create or DELETE — a bare "delete
// the school" doesn't fit a singleton config record that every other table
// implicitly depends on existing.
router.get('/', requirePermission('school', 'view'), asyncHandler(schoolController.get))
router.patch('/', requirePermission('school', 'edit'), validateBody(upsertSchoolSchema), asyncHandler(schoolController.upsert))

// Dedicated multipart endpoint for the school logo — kept out of the JSON
// PATCH body so an uploaded image never has to be base64-inflated and
// stuffed into express.json()'s size limit.
router.post('/logo', requirePermission('school', 'edit'), upload.single('logo'), asyncHandler(schoolController.uploadLogo))

export default router