// src/services/teacherService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateTeacherPayload,
  ListTeachersQuery,
  TeacherProfile,
  TeacherProfileView,
  UpdateTeacherPayload,
} from '@/types/teacherProfile'
import { toTeacherProfileView } from '@/types/teacherProfile'

export type TeacherRecord = TeacherProfileView
export type TeacherFilterParams = ListTeachersQuery

export type { CreateTeacherPayload, UpdateTeacherPayload }

/**
 * Form payload for the create dialog. Extends the backend's accepted
 * fields with display-only metadata (`title`, `specialization`) that
 * lives on the frontend. The service strips them before sending the
 * request — see `stripUiOnlyFields` below.
 *
 * NOTE: `CreateTeacherPayload` is a discriminated union (link-existing vs
 * create-new), so this is a `type` intersection rather than an `interface
 * extends` — TypeScript doesn't allow interfaces to extend unions.
 */
export type CreateTeacherFormPayload = CreateTeacherPayload & {
  title?: string
  specialization?: string
}

/**
 * Removes fields that only exist on the frontend before sending to the
 * backend. The backend's Zod schema strips unknown keys, but sending them
 * at all is noise and would fail if the schema ever switches to
 * `strictObject`.
 */
function stripUiOnlyFields(
  payload: CreateTeacherFormPayload | (Partial<CreateTeacherFormPayload> & { status?: string })
): Record<string, unknown> {
  const { title: _title, specialization: _spec, ...rest } = payload as Record<string, unknown>
  return rest
}

export const teacherService = {
  list: async (params?: TeacherFilterParams): Promise<TeacherRecord[]> => {
    const query = new URLSearchParams()
    if (params?.search) query.set('search', params.search)
    if (params?.department) query.set('department', params.department)
    if (params?.status) query.set('status', params.status)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sortBy) query.set('sortBy', params.sortBy)
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder)
    const qs = query.toString() ? `?${query.toString()}` : ''
    const rows = await apiClient.get<TeacherProfile[]>(`/teachers${qs}`)
    return rows.map(toTeacherProfileView)
  },

  getById: async (id: string): Promise<TeacherRecord> => {
    const profile = await apiClient.get<TeacherProfile>(`/teachers/${id}`)
    return toTeacherProfileView(profile)
  },

  create: async (payload: CreateTeacherFormPayload): Promise<TeacherRecord> => {
    const profile = await apiClient.post<TeacherProfile>(
      '/teachers',
      stripUiOnlyFields(payload)
    )
    return toTeacherProfileView(profile)
  },

  update: async (
    id: string,
    payload: Partial<CreateTeacherFormPayload> & { status?: string }
  ): Promise<TeacherRecord> => {
    const profile = await apiClient.patch<TeacherProfile>(
      `/teachers/${id}`,
      stripUiOnlyFields(payload)
    )
    return toTeacherProfileView(profile)
  },

  delete: (id: string) => apiClient.delete<void>(`/teachers/${id}`),
}