import { Router } from 'express'
import path from 'path'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { validateBody } from '@/middleware/validation.middleware'
import { upload } from '@/middleware/upload.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess } from '@/utils/apiResponse'
import { ApiError } from '@/utils/ApiError'
import { upsertSchoolSchema } from './school.validation'

const router = Router()
router.use(authenticate)

// Single-tenant: there is exactly one School row. GET returns it (or 404 if
// setup hasn't run yet); PATCH upserts it.
router.get(
  '/',
  requirePermission('school', 'view'),
  asyncHandler(async (_req, res) => {
    const school = await prisma.school.findFirst()
    if (!school) throw ApiError.notFound('School has not been configured yet')
    sendSuccess(res, school)
  })
)

router.patch(
  '/',
  requirePermission('school', 'edit'),
  validateBody(upsertSchoolSchema),
  asyncHandler(async (req, res) => {
    const existing = await prisma.school.findFirst()
    const school = existing
      ? await prisma.school.update({ where: { id: existing.id }, data: req.body })
      : await prisma.school.create({ data: req.body })
    sendSuccess(res, school)
  })
)

// Dedicated multipart endpoint for the school logo. Keeping this out of the
// JSON PATCH body means an uploaded image never has to be base64-inflated
// and stuffed into express.json()'s size limit — multer streams it straight
// to disk, and we only ever store a short URL string on the School row.
router.post(
  '/logo',
  requirePermission('school', 'edit'),
  upload.single('logo'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('No logo file provided')

    const logoUrl = `/uploads/${path.basename(req.file.path)}`

    const existing = await prisma.school.findFirst()
    if (!existing) {
      throw ApiError.notFound('School has not been configured yet — save the school profile before uploading a logo')
    }
    const school = await prisma.school.update({ where: { id: existing.id }, data: { logoUrl } })

    sendSuccess(res, school)
  })
)

export default router