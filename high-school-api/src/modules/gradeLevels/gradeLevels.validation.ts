import { z } from 'zod'

const status = z.enum(['Active', 'Archived'])

/**
 * Fields the client controls on create.
 *
 * NOTE — `totalClasses`, `enrolledStudents`, and `averageGpa` are deliberately
 * NOT in this schema.
 *
 * Those are derived quantities: the number of Class rows pointing at this
 * level, the number of Student rows enrolled in those classes, and the mean
 * of Grade rows for those students. Accepting them as client input lets a
 * caller PATCH `totalClasses: 0` on a level that still has classes, which
 * defeats the delete guard in the service.
 *
 * The eventual fix is to drop them as columns and project `_count` on read.
 * Until that migration happens, they're read-only at the API boundary — a
 * response still includes them, a request cannot set them.
 */
const gradeLevelFields = z.object({
  code: z.string().trim().min(1).max(30),
  name: z.string().trim().min(1).max(120),
  alias: z.string().trim().max(120).optional(),
  levelOrder: z.number().int().min(1).max(100),
  minPassingScore: z.number().int().min(0).max(100).default(50),
  headCoordinator: z.string().trim().max(120).optional(),
  maxCapacity: z.number().int().min(0).default(0),
  status: status.default('Active'),
  description: z.string().trim().max(2000).optional(),
})

export const createGradeLevelSchema = gradeLevelFields

/**
 * `.partial()` wraps every field in ZodOptional, which short-circuits on
 * `undefined` and skips the inner ZodDefault. So the defaults above do NOT
 * fire on PATCH — a request that sets only `name` doesn't reset
 * `minPassingScore` to 50. That's the intended behavior.
 */
export const updateGradeLevelSchema = gradeLevelFields
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Query schema for the list endpoint. `status` is optional; omitting it means
 * "no filter", not the sentinel string `'All'`. The old code accepted any
 * string and silently treated unrecognized values as no-filter — a client
 * typo like `?status=active` (lowercase) returned archived rows too.
 */
export const listGradeLevelsQuerySchema = z.object({
  status: status.optional(),
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.enum(['levelOrder', 'name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type CreateGradeLevelBody = z.infer<typeof createGradeLevelSchema>
export type UpdateGradeLevelBody = z.infer<typeof updateGradeLevelSchema>
export type ListGradeLevelsQuery = z.infer<typeof listGradeLevelsQuerySchema>