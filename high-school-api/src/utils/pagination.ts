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

export function buildOrderBy(
  query: Pick<PaginationQuery, 'sortBy' | 'sortOrder'>,
  sortableFields: readonly string[]
): Record<string, 'asc' | 'desc'> | undefined {
  if (!query.sortBy) return undefined
  if (!sortableFields.includes(query.sortBy)) return undefined
  return { [query.sortBy]: query.sortOrder }
}