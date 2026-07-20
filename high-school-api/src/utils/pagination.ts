import { z } from 'zod'

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

export function toSkipTake({ page, limit }: PaginationQuery) {
  return { skip: (page - 1) * limit, take: limit }
}

export function buildPaginationMeta(total: number, { page, limit }: PaginationQuery) {
  return { total, page, limit, totalPages: Math.ceil(total / limit) }
}
