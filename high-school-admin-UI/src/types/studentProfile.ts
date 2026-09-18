// src/types/studentProfile.ts

import type { Gender } from './user'

/**
 * A parent link, as returned on a student profile from
 * `GET /students/:id/profile`.
 *
 * A student may have zero, one, or several parents on record. The
 * previous type assumed exactly one (`parentName`, `parentPhone`,
 * `parentEmail`); the backend's relation supports many.
 */
export interface StudentGuardian {
  id: string
  relationship: string | null
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

/**
 * Aggregate counts returned by the profile endpoint. Every status key is
 * present even when the count is zero (fixed shape from the backend).
 */
export interface StudentAttendanceSummary {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  /**
   * Attendance rate in 0-100 (already scaled by the backend). Do not
   * multiply by 100 when formatting.
   */
  attendanceRate: number
}

/**
 * Student profile as returned by `GET /students/:id/profile`.
 *
 * The endpoint returns the student row, its user, its class, its parents,
 * an attendance summary, and recent grades. Client-side helpers derive
 * display fields (`name`, `rollNo`, `gpa`) from this.
 */
export interface StudentProfile {
  id: string
  userId: string

  // User-linked fields (flat via `user` in the response)
  firstName: string
  lastName: string
  email: string
  phone: string | null
  avatarUrl: string | null
  isActive: boolean

  // Student fields
  studentCode: string
  dateOfBirth: string | null
  gender: Gender | null
  enrolledAt: string
  classId: string | null
  class: { id: string; name: string; gradeLevel: number } | null

  // Relations
  parents: StudentGuardian[]
  attendanceSummary: StudentAttendanceSummary

  // Client-derived (computed by a mapper, not returned by the API)
  // - name: firstName + lastName
  // - rollNo: studentCode
  // - grade: class?.name prefix, or a lookup against GradeLevel
  // - gpa: computed from grades, null if no grades exist
}

/**
 * View model ready for the profile page. Every field is populated —
 * either by the mapper from the raw response, or with a safe fallback.
 */
export interface StudentProfileView {
  id: string
  firstName: string
  lastName: string
  fullName: string
  avatarUrl: string | null

  studentCode: string
  className: string | null
  gradeLevel: number | null
  dateOfBirth: string | null
  gender: Gender | null
  enrolledAt: string

  email: string
  phone: string | null
  isActive: boolean

  guardians: StudentGuardian[]
  attendance: StudentAttendanceSummary

  /**
   * GPA on a 4.0 scale, or null when the student has no grades yet.
   * Computed client-side from recent grades — the backend does not store
   * a GPA.
   */
  gpa: number | null
}

/**
 * Map a raw `StudentProfile` from the API to the view model the UI
 * consumes. Keeps the transformation in one place instead of scattering
 * `firstName + ' ' + lastName` across components.
 */
export function toStudentProfileView(
  profile: StudentProfile,
  gpa: number | null = null
): StudentProfileView {
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName} ${profile.lastName}`,
    avatarUrl: profile.avatarUrl,
    studentCode: profile.studentCode,
    className: profile.class?.name ?? null,
    gradeLevel: profile.class?.gradeLevel ?? null,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    enrolledAt: profile.enrolledAt,
    email: profile.email,
    phone: profile.phone,
    isActive: profile.isActive,
    guardians: profile.parents,
    attendance: profile.attendanceSummary,
    gpa,
  }
}