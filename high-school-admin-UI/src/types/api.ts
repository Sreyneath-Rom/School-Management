// src/types/api.ts

/**
 * The envelope every successful response from the backend uses.
 *
 *   { success: true, data: <payload>, meta?: {...} }
 *
 * The `apiClient` unwraps this and returns `data` directly, so most
 * consumers never see this type. It's useful when you bypass the client
 * (e.g. in a custom fetch for a file download) or when you want to type
 * the raw response from a hook.
 */
export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

/**
 * The envelope every error response uses. The `apiClient` converts this
 * into an `ApiError` instance, but the shape is useful for typing
 * raw fetch handlers or error boundaries.
 */
export interface ApiFailure {
  success: false
  message: string
  errors?: Record<string, string[]>
  requestId?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

/**
 * Attached to every paginated list response. Mirrors the shape produced by
 * `buildPaginationMeta` on the backend.
 *
 * Note: `totalPages` is `0` when `total` is `0` — the backend doesn't
 * return `1` for an empty list.
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Standard paginated list result. Produced by the API layer's mapper —
 * not directly by the backend, which returns `data` and `meta` as
 * siblings in the envelope.
 */
export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}

/**
 * Sort order accepted by every list endpoint.
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Standard pagination + sort query parameters. Every list endpoint accepts
 * at least these.
 */
export interface ListQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: SortOrder
}

/**
 * A generic "resource exists" check the client can use to distinguish
 * 404 from a network error.
 */
export function isApiFailure(value: unknown): value is ApiFailure {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as { success: unknown }).success === false
  )
}