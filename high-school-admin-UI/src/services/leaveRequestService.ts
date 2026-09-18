// src/services/leaveRequestService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateLeaveRequestForStudentPayload,
  CreateLeaveRequestPayload,
  LeaveRequest,
  ListLeaveRequestsQuery,
  ReviewLeaveRequestPayload,
  UpdateLeaveRequestPayload,
} from '@/types/leaveRequest'

/**
 * Leave requests.
 *
 * The create endpoint takes different body shapes by role:
 *   - A student files their own: `{ startDate, endDate, reason }`
 *   - Staff/parent files on behalf: `{ studentId, startDate, endDate, reason }`
 *
 * The backend derives `studentId` from the token for student callers, so
 * the two helpers below cover both paths explicitly.
 */
export const leaveRequestService = {
  list: (params?: ListLeaveRequestsQuery) => {
    const query = new URLSearchParams()
    if (params?.studentId) query.set('studentId', params.studentId)
    if (params?.status) query.set('status', params.status)
    if (params?.from) query.set('from', params.from)
    if (params?.to) query.set('to', params.to)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sortBy) query.set('sortBy', params.sortBy)
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<LeaveRequest[]>(`/leaves${qs}`)
  },

  getById: (id: string) => apiClient.get<LeaveRequest>(`/leaves/${id}`),

  /** A student filing their own request. */
  create: (payload: CreateLeaveRequestPayload) =>
    apiClient.post<LeaveRequest>('/leaves', payload),

  /** Staff or parent filing on behalf of a student. */
  createForStudent: (payload: CreateLeaveRequestForStudentPayload) =>
    apiClient.post<LeaveRequest>('/leaves', payload),

  /** Editable only while status is PENDING. Refused with 409 otherwise. */
  update: (id: string, payload: UpdateLeaveRequestPayload) =>
    apiClient.patch<LeaveRequest>(`/leaves/${id}`, payload),

  /** Approve or reject. Refused with 409 if the request isn't PENDING. */
  review: (id: string, payload: ReviewLeaveRequestPayload) =>
    apiClient.patch<LeaveRequest>(`/leaves/${id}/review`, payload),

  /** Cancel a PENDING request. Refused with 409 once reviewed. */
  delete: (id: string) => apiClient.delete<void>(`/leaves/${id}`),
}