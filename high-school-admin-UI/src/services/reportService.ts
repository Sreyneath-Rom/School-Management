// src/services/reportService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  AttendanceReportQuery,
  AttendanceReportRow,
  GradesReportQuery,
  StudentReportResponse,
  TeacherReportResponse,
} from '@/types/report'
import type { GradeRecord } from '@/types/academic'

/**
 * Reports are staff-only (`reports.view`). Self-service reads for students
 * and parents go through the domain modules — `/grades/me`,
 * `/attendance`, `/students/:id/profile`.
 *
 * The attendance and grades reports currently return paginated raw rows,
 * not aggregated summaries. If you need a "student X has 92% attendance,
 * ranked #5 in class" view, that's client-side aggregation of the rows or
 * a future backend endpoint.
 */
export const reportService = {
  attendance: (params?: AttendanceReportQuery) => {
    const query = new URLSearchParams()
    if (params?.classId) query.set('classId', params.classId)
    if (params?.studentId) query.set('studentId', params.studentId)
    if (params?.from) query.set('from', params.from)
    if (params?.to) query.set('to', params.to)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<AttendanceReportRow[]>(`/reports/attendance${qs}`)
  },

  grades: (params?: GradesReportQuery) => {
    const query = new URLSearchParams()
    if (params?.classId) query.set('classId', params.classId)
    if (params?.subjectId) query.set('subjectId', params.subjectId)
    if (params?.studentId) query.set('studentId', params.studentId)
    if (params?.period) query.set('period', params.period)
    if (params?.periodLabel) query.set('periodLabel', params.periodLabel)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<GradeRecord[]>(`/reports/grades${qs}`)
  },

  forStudent: (studentId: string) =>
    apiClient.get<StudentReportResponse>(`/reports/students/${studentId}`),

  forTeacher: (teacherId: string) =>
    apiClient.get<TeacherReportResponse>(`/reports/teachers/${teacherId}`),
}