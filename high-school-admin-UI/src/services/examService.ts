// src/services/examService.ts
import { apiClient, ApiError } from '@/lib/apiClient'

/**
 * The exams module is a stub on the backend — reads return `[]` and
 * writes return 501. This service exposes the eventual API shape so the
 * frontend can be built against it now; the endpoints will start
 * returning real data when the Prisma models land.
 *
 * Do not build a critical flow that assumes these endpoints work. Guard
 * calls with a try/catch and treat 501 as "not available yet".
 */

export interface ExamRecord {
  id: string
  title: string
  academicYear: string
  term: string
  startDate: string
  endDate: string
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  totalSubjects: number
  classesCovered: string[]
}

export interface ExamScheduleRecord {
  id: string
  examId: string
  subject: string
  date: string
  timeSlot: string
  room: string
  totalStudents: number
  supervisor: string
  maxMarks: number
  passingMarks: number
}

export interface MarkEntryRecord {
  id: string
  examId: string
  subject: string
  studentId: string
  studentName: string
  rollNumber: string
  marksObtained: number
  maxMarks: number
  grade: string
  remarks?: string
}

export interface ReportCardRecord {
  id: string
  studentId: string
  studentName: string
  class: string
  academicYear: string
  term: string
  overallGpa: number
  rank: number
  attendanceRate: number
  subjects: Array<{ subject: string; score: number; grade: string; credits: number; remarks?: string }>
  conduct: string
  issueDate: string
}

const STUB_MESSAGE =
  'The exams module is not yet implemented on the backend. It will be available once the Exam, ExamSchedule, MarkEntry, and ReportCard models are added.'

/**
 * Detect a 501 from the exams stub and turn it into a friendlier message
 * without changing the error type. Callers can still branch on
 * `error instanceof ApiError && error.status === 501`.
 */
function isStubError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 501
}

export const examService = {
  list: async (): Promise<ExamRecord[]> => {
    try {
      return await apiClient.get<ExamRecord[]>('/exams')
    } catch (err) {
      if (isStubError(err)) return []
      throw err
    }
  },

  getById: (id: string) => apiClient.get<ExamRecord>(`/exams/${id}`),

  create: (payload: Omit<ExamRecord, 'id'>) => apiClient.post<ExamRecord>('/exams', payload),

  update: (id: string, payload: Partial<ExamRecord>) =>
    apiClient.patch<ExamRecord>(`/exams/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`/exams/${id}`),

  /** Writes are 501 for now — the caller gets an ApiError. */
  schedules: async (): Promise<ExamScheduleRecord[]> => {
    try {
      return await apiClient.get<ExamScheduleRecord[]>('/exams/schedules/all')
    } catch (err) {
      if (isStubError(err)) return []
      throw err
    }
  },

  marks: async (params?: { examId?: string; subject?: string }): Promise<MarkEntryRecord[]> => {
    const query = new URLSearchParams()
    if (params?.examId) query.set('examId', params.examId)
    if (params?.subject) query.set('subject', params.subject)
    const qs = query.toString() ? `?${query.toString()}` : ''
    try {
      return await apiClient.get<MarkEntryRecord[]>(`/exams/marks/entries${qs}`)
    } catch (err) {
      if (isStubError(err)) return []
      throw err
    }
  },

  reportCards: async (): Promise<ReportCardRecord[]> => {
    try {
      return await apiClient.get<ReportCardRecord[]>('/exams/report-cards/all')
    } catch (err) {
      if (isStubError(err)) return []
      throw err
    }
  },

  /** Exposed for UI messaging. */
  stubMessage: STUB_MESSAGE,
}