// src/types/report.ts

import type { AttendanceStatus } from './attendance'
import type { GradePeriod } from './academic'

/**
 * Query for `GET /reports/attendance`.
 */
export interface AttendanceReportQuery {
  classId?: string
  studentId?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

/**
 * Query for `GET /reports/grades`.
 */
export interface GradesReportQuery {
  classId?: string
  subjectId?: string
  studentId?: string
  period?: GradePeriod
  periodLabel?: string
  page?: number
  limit?: number
}

/**
 * Row shape returned by `GET /reports/attendance`. Same shape as the
 * attendance module's record — the reports endpoint is paginated raw rows
 * in the current build.
 */
export interface AttendanceReportRow {
  id: string
  studentId: string
  date: string
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  note: string | null
  student: {
    id: string
    studentCode: string
    user: { id: string; firstName: string; lastName: string }
    class: { id: string; name: string; gradeLevel: number } | null
  }
}

/**
 * Student-scoped summary returned by `GET /reports/students/:id`.
 *
 * Note the shape difference from the attendance module's `AttendanceStats`
 * — this one is a summary that the report endpoint composes together with
 * grades and leave requests.
 */
export interface StudentReportResponse {
  student: {
    id: string
    studentCode: string
    user: { id: string; firstName: string; lastName: string; email: string }
    class: { id: string; name: string; gradeLevel: number } | null
  }
  attendance: {
    total: number
    present: number
    absent: number
    late: number
    excused: number
    /** 0-100, already scaled */
    attendanceRate: number
  }
  grades: Array<{
    id: string
    subjectId: string
    period: GradePeriod
    periodLabel: string
    score: number
    maxScore: number
    comment: string | null
    createdAt: string
    subject: { id: string; name: string; code: string }
  }>
  leaveRequests: Array<{
    id: string
    startDate: string
    endDate: string
    reason: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    reviewedAt: string | null
    createdAt: string
  }>
}

/**
 * Teacher-scoped summary returned by `GET /reports/teachers/:id`.
 */
export interface TeacherReportResponse {
  teacher: {
    id: string
    teacherCode: string
    user: { id: string; firstName: string; lastName: string; email: string }
  }
  subjects: Array<{ subject: { id: string; name: string; code: string } }>
  classesLed: Array<{
    id: string
    name: string
    gradeLevel: number
    _count: { students: number }
  }>
  homeworkGiven: number
  quizzesGiven: number
}