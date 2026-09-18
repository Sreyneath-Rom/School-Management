// src/types/leaveRequest.ts

/**
 * Leave status — matches the backend's `LeaveStatus` Prisma enum exactly.
 * Uppercase.
 *
 * There is no `CANCELLED` status. A student cancels a pending request by
 * DELETing it. Once reviewed, the row is a permanent record and cannot be
 * deleted.
 */
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/**
 * A leave request as returned by the API.
 *
 * `reviewedBy` is a plain user id string, not a relation — the backend
 * resolves the reviewer's name separately if needed. The `reviewer` field
 * here is hydrated by the API layer if the endpoint returns it.
 */
export interface LeaveRequest {
  id: string
  studentId: string
  startDate: string // yyyy-mm-dd
  endDate: string // yyyy-mm-dd
  reason: string
  status: LeaveStatus
  reviewedBy: string | null
  reviewedAt: string | null
  reviewNote: string | null
  createdAt: string
  updatedAt: string

  // Hydrated relations
  student?: {
    id: string
    studentCode: string
    user: { id: string; firstName: string; lastName: string; email: string }
    class: { id: string; name: string; gradeLevel: number } | null
  }
  reviewer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

/**
 * Payload for a student filing their own leave request.
 *
 * `studentId` is resolved from the token — do not include it.
 */
export interface CreateLeaveRequestPayload {
  startDate: string
  endDate: string
  reason: string
}

/**
 * Payload for a staff member or parent filing on behalf of a student.
 */
export interface CreateLeaveRequestForStudentPayload
  extends CreateLeaveRequestPayload {
  studentId: string
}

/**
 * Payload for `PATCH /leaves/:id` — only editable while PENDING.
 */
export interface UpdateLeaveRequestPayload {
  startDate?: string
  endDate?: string
  reason?: string
}

/**
 * Payload for `PATCH /leaves/:id/review` — approving or rejecting.
 * Refused with 409 if the request isn't PENDING.
 */
export interface ReviewLeaveRequestPayload {
  status: 'APPROVED' | 'REJECTED'
  note?: string
}

/**
 * Query parameters for `GET /leaves`.
 */
export interface ListLeaveRequestsQuery {
  studentId?: string
  status?: LeaveStatus
  from?: string
  to?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'startDate' | 'status'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Human-readable labels and colors for status badges.
 *
 * Colors come from the theme's status tokens (`--color-warning`,
 * `--color-success`, `--color-error`), which flip with the light/dark
 * toggle in `globals.css`. No `dark:` variant needed at the call site.
 */
export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export const LEAVE_STATUS_COLORS: Record<
  LeaveStatus,
  { bg: string; text: string; ring: string }
> = {
  PENDING: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    ring: 'ring-warning/30',
  },
  APPROVED: {
    bg: 'bg-success/15',
    text: 'text-success',
    ring: 'ring-success/30',
  },
  REJECTED: {
    bg: 'bg-error/15',
    text: 'text-error',
    ring: 'ring-error/30',
  },
}