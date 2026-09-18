import { z } from 'zod'

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().trim().min(1).max(64).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

export function toSkipTake({ page, limit }: Pick<PaginationQuery, 'page' | 'limit'>) {
  return { skip: (page - 1) * limit, take: limit }
}

/**
 * Builds the `meta` block attached to every paginated response.
 *
 * The parameter type is narrowed to the two fields this function actually
 * reads. `PaginationQuery` requires `sortOrder` (Zod's `.default()` makes the
 * output type required even though the input is optional), so declaring the
 * parameter as the full `PaginationQuery` would force every caller to supply
 * a value this function ignores.
 */
export function buildPaginationMeta(
  total: number,
  { page, limit }: Pick<PaginationQuery, 'page' | 'limit'>
) {
  return {
    total,
    page,
    limit,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  }
}

/**
 * Converts `sortBy` / `sortOrder` into a Prisma `orderBy` object. Returns
 * `undefined` when the field isn't whitelisted, so the caller falls back to
 * a model-specific default.
 */
export function buildOrderBy(
  query: Pick<PaginationQuery, 'sortBy' | 'sortOrder'>,
  sortableFields: readonly string[]
): Record<string, 'asc' | 'desc'> | undefined {
  if (!query.sortBy) return undefined
  if (!sortableFields.includes(query.sortBy)) return undefined
  return { [query.sortBy]: query.sortOrder }
}