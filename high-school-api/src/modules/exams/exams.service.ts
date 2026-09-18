import { ApiError } from '@/utils/ApiError'
import type {
  BatchMarkBody,
  CreateExamBody,
  CreateScheduleBody,
  GenerateReportCardBody,
  ListExamsQuery,
  ListMarksQuery,
  ListReportCardsQuery,
  ListSchedulesQuery,
  UpdateExamBody,
} from './exams.validation'

/**
 * The exams module has no Prisma models yet. This service is a contract-only
 * stub: reads return empty data, writes throw 501. Every method signature is
 * the one the eventual Prisma-backed implementation will have, so the
 * controller and routes do not need to change when the models land — only
 * this file does.
 *
 * When implementing:
 *   1. Add Exam, ExamSchedule, MarkEntry, ReportCard to prisma/schema.prisma.
 *   2. Run `npx prisma migrate dev --name add_exams`.
 *   3. Replace each stub body below with the real query.
 *   4. Add `validateQuery` / `validateBody` to the write routes in
 *      exams.routes.ts.
 */

export interface ExamListItem {
  id: string
  title: string
  academicYearId: string
  termId: string | null
  startDate: Date
  endDate: Date
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  /** Derived from `_count.schedules` once the relation exists. */
  totalSubjects: number
  /** Resolved from the ExamClass join table. */
  classIds: string[]
  createdAt: Date
}

export interface ExamScheduleItem {
  id: string
  examId: string
  subjectId: string
  subjectName: string
  date: Date
  startTime: string
  endTime: string
  room: string | null
  maxMarks: number
  passingMarks: number
  supervisor: string | null
}

export interface MarkEntryItem {
  id: string
  examId: string
  scheduleId: string | null
  studentId: string
  studentName: string
  rollNumber: string | null
  subjectId: string
  subjectName: string
  marksObtained: number
  maxMarks: number
  grade: string | null
  remarks: string | null
}

export interface ReportCardItem {
  id: string
  studentId: string
  studentName: string
  academicYearId: string
  termId: string | null
  overallGpa: number | null
  rank: number | null
  attendanceRate: number | null
  conduct: string | null
  issueDate: Date | null
}

/**
 * Returns `never` — callers cannot accidentally continue after a stub call.
 * TypeScript treats a call to a `never`-returning function as terminating
 * control flow, so an `async` method whose body is just `notImplemented(...)`
 * is inferred as `Promise<never>` with no explicit annotation needed.
 */
function notImplemented(operation: string): never {
  throw new ApiError(501, `Exams: ${operation} is not yet implemented`)
}

export const examsService = {
  // ---- Exams ----

  async list(_query: ListExamsQuery): Promise<ExamListItem[]> {
    return []
  },

  async getById(_id: string): Promise<ExamListItem> {
    throw ApiError.notFound('Exam not found')
  },

  async create(_input: CreateExamBody) {
    notImplemented('create exam')
  },

  async update(_id: string, _input: UpdateExamBody) {
    notImplemented('update exam')
  },

  async remove(_id: string) {
    notImplemented('delete exam')
  },

  // ---- Schedules ----

  async listSchedules(_query: ListSchedulesQuery): Promise<ExamScheduleItem[]> {
    return []
  },

  async createSchedule(_input: CreateScheduleBody) {
    notImplemented('create exam schedule')
  },

  // ---- Marks ----

  async listMarks(_query: ListMarksQuery): Promise<MarkEntryItem[]> {
    return []
  },

  async batchMark(_input: BatchMarkBody) {
    notImplemented('batch mark entry')
  },

  // ---- Report cards ----

  async listReportCards(
    _query: ListReportCardsQuery
  ): Promise<ReportCardItem[]> {
    return []
  },

  async generateReportCard(_input: GenerateReportCardBody) {
    notImplemented('generate report card')
  },
}