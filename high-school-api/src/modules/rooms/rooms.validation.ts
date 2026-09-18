import { z } from 'zod'

const roomType = z.enum([
  'Classroom',
  'Science Lab',
  'Computer Lab',
  'Auditorium',
  'Library Wing',
])
const roomStatus = z.enum(['Available', 'Occupied', 'Maintenance'])

/**
 * `roomFields` requires every structural field. The previous version
 * duplicated this requirement with a hand-rolled check inside the service
 * (`if (!input.name || !input.code || ...)`) — dead code when the schema
 * enforces it, inconsistent when the service is called directly. One
 * source of truth: the schema.
 */
const roomFields = z.object({
  name: z.string().trim().min(1).max(120),
  code: z.string().trim().min(1).max(40),
  building: z.string().trim().min(1).max(120),
  floor: z.string().trim().min(1).max(60),
  type: roomType,
  capacity: z.number().int().min(1).max(5000),
  amenities: z.array(z.string().trim().min(1).max(100)).max(50).default([]),
  status: roomStatus.default('Available'),
  /**
   * `currentClass` — if the schema stores this as a plain string, renaming
   * the class silently desyncs the room. If it's a foreign key to Class,
   * this should be `currentClassId` and validated against a real row.
   * Kept as-is here to match the current schema; swap to `z.string().cuid()`
   * if it's an FK.
   */
  currentClass: z.string().trim().max(120).nullable().optional(),
})

export const createRoomSchema = roomFields

/**
 * `.partial()` wraps each field in ZodOptional, which short-circuits on
 * `undefined` and skips the inner ZodDefault. So the defaults above do NOT
 * fire on PATCH — sending `{ name: "New" }` doesn't reset `status` to
 * "Available". That's the intended behavior.
 */
export const updateRoomSchema = roomFields
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  })

/**
 * Query schema for the list endpoint.
 *
 * The previous version used `type !== 'All'` / `status !== 'All'` as a
 * sentinel for "no filter". A typo like `?type=ClassRoom` (capital R) or
 * `?status=available` (lowercase) matched neither the sentinel nor a valid
 * value, and silently returned unfiltered results — indistinguishable from
 * a working request. The enum makes invalid values a 400.
 */
export const listRoomsQuerySchema = z.object({
  type: roomType.optional(),
  status: roomStatus.optional(),
  building: z.string().trim().min(1).max(120).optional(),
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
  sortBy: z.enum(['name', 'code', 'building', 'capacity', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type CreateRoomBody = z.infer<typeof createRoomSchema>
export type UpdateRoomBody = z.infer<typeof updateRoomSchema>
export type ListRoomsQuery = z.infer<typeof listRoomsQuerySchema>