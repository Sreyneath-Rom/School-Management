// src/services/academicService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  Lesson,
  LessonMaterial,
  Homework,
  HomeworkSubmission,
  Quiz,
  QuizQuestion,
  QuizSubmission,
  GradeRecord,
  StudentProgress,
} from '@/types/academic'

/**
 * Standard 4.0 letter-grade scale, used everywhere this file needs to
 * convert a percentage to a letter/GPA. If the school's grading scale
 * becomes configurable (see `GradeScale` in useSchoolSetup), replace this
 * with a lookup against the school's configured bands.
 */
export function letterFromPercentage(pct: number): {
  letter: 'A' | 'B' | 'C' | 'D' | 'F'
  gpa: number
} {
  if (pct >= 90) return { letter: 'A', gpa: 4.0 }
  if (pct >= 80) return { letter: 'B', gpa: 3.0 }
  if (pct >= 70) return { letter: 'C', gpa: 2.0 }
  if (pct >= 60) return { letter: 'D', gpa: 1.0 }
  return { letter: 'F', gpa: 0.0 }
}

// ---------------------------------------------------------------------------
// Raw shapes as returned by the backend (unchanged — these match the API)
// ---------------------------------------------------------------------------

interface RawLesson {
  id: string
  title: string
  description: string | null
  subjectId: string
  teacherId: string
  classId: string | null
  scheduledAt: string | null
  fileUrl: string | null
  fileType: string | null
  fileSizeKb: number | null
  createdAt: string
  subject?: { name?: string }
  class?: { name?: string }
  teacher?: { user?: { firstName?: string; lastName?: string } }
}

interface RawHomework {
  id: string
  title: string
  description: string | null
  subjectId: string
  teacherId: string
  classId: string | null
  dueDate: string
  maxScore: number
  allowLateSubmissions: boolean
  createdAt: string
  subject?: { name?: string }
  class?: { name?: string }
  teacher?: { user?: { firstName?: string; lastName?: string } }
  _count?: { submissions?: number }
}

interface RawHomeworkSubmission {
  id: string
  homeworkId: string
  studentId: string
  content: string | null
  fileUrl: string | null
  submittedAt: string
  score: number | null
  feedback: string | null
  gradedAt: string | null
  student?: {
    studentCode?: string
    user?: { firstName?: string; lastName?: string }
  }
}

interface RawQuizQuestion {
  id: string
  questionText: string
  options: string[]
  correctAnswer?: string
  points: number
}

interface RawQuiz {
  id: string
  title: string
  subjectId: string
  teacherId: string
  classId: string | null
  isAutoGrade: boolean
  timeLimitMin: number | null
  createdAt: string
  subject?: { name?: string }
  class?: { name?: string }
  teacher?: { user?: { firstName?: string; lastName?: string } }
  questions?: RawQuizQuestion[]
  _count?: { submissions?: number }
}

interface RawQuizSubmission {
  id: string
  quizId: string
  studentId: string
  score: number | null
  maxScore: number | null
  submittedAt: string
  gradedAt: string | null
}

interface RawGrade {
  id: string
  studentId: string
  subjectId: string
  teacherId: string
  period: 'MONTHLY' | 'SEMESTER' | 'ANNUAL'
  periodLabel: string
  score: number
  maxScore: number
  comment: string | null
  createdAt: string
  subject?: { name?: string }
  student?: {
    studentCode?: string
    classId?: string | null
    class?: { name?: string }
    user?: { firstName?: string; lastName?: string }
  }
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function fullName(user: { firstName?: string; lastName?: string } | undefined): string {
  if (!user) return ''
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
}

function mapLesson(record: RawLesson): Lesson {
  const materials: LessonMaterial[] = record.fileUrl
    ? [
        {
          id: `${record.id}-file`,
          name: record.fileUrl.split('/').pop() ?? 'Lesson file',
          type: record.fileType ?? 'link',
          url: record.fileUrl,
          size: record.fileSizeKb ? `${record.fileSizeKb} KB` : undefined,
        },
      ]
    : []

  return {
    id: record.id,
    title: record.title,
    description: record.description ?? '',
    classId: record.classId ?? '',
    className: record.class?.name ?? '',
    subjectId: record.subjectId,
    subjectName: record.subject?.name ?? '',
    teacherId: record.teacherId,
    teacherName: fullName(record.teacher?.user),
    date: record.scheduledAt?.slice(0, 10) ?? record.createdAt.slice(0, 10),
    time: record.scheduledAt?.slice(11, 16) ?? '',
    content: record.description ?? '',
    materials,
    // The backend has no durationMinutes, objectives, or status. Omitted
    // rather than defaulted to zero/empty strings, which would be lies.
  }
}

function mapHomework(record: RawHomework): Homework {
  return {
    id: record.id,
    title: record.title,
    description: record.description ?? '',
    classId: record.classId ?? '',
    className: record.class?.name ?? '',
    subjectId: record.subjectId,
    subjectName: record.subject?.name ?? '',
    teacherId: record.teacherId,
    teacherName: fullName(record.teacher?.user),
    assignedDate: record.createdAt.slice(0, 10),
    dueDate: record.dueDate.slice(0, 10),
    maxPoints: record.maxScore,
    allowLateSubmissions: record.allowLateSubmissions,
    submissionsCount: record._count?.submissions ?? 0,
    // No `status` — the backend doesn't store one.
  }
}

function mapHomeworkSubmission(record: RawHomeworkSubmission): HomeworkSubmission {
  const status: HomeworkSubmission['status'] =
    record.score !== null
      ? 'Graded'
      : record.fileUrl || record.content
        ? 'Submitted'
        : 'Pending'

  return {
    id: record.id,
    homeworkId: record.homeworkId,
    studentId: record.studentId,
    studentName: fullName(record.student?.user),
    studentCode: record.student?.studentCode ?? '',
    submittedAt: record.submittedAt.replace('T', ' ').slice(0, 16),
    content: record.content ?? '',
    attachments: record.fileUrl
      ? [{ name: record.fileUrl.split('/').pop() ?? 'Attachment', url: record.fileUrl }]
      : [],
    status,
    grade: record.score ?? undefined,
    feedback: record.feedback ?? undefined,
  }
}

function mapQuizQuestion(q: RawQuizQuestion): QuizQuestion {
  const options = Array.isArray(q.options) ? q.options : []
  // The backend strips `correctAnswer` for student callers. -1 means
  // "unknown" — the UI must not display an answer index of -1.
  const correctAnswer =
    typeof q.correctAnswer === 'string'
      ? Math.max(0, options.indexOf(q.correctAnswer))
      : -1
  return {
    id: q.id,
    question: q.questionText,
    options,
    correctAnswer,
    points: q.points ?? 1,
  }
}

function mapQuiz(record: RawQuiz): Quiz {
  const questions = (record.questions ?? []).map(mapQuizQuestion)
  return {
    id: record.id,
    title: record.title,
    classId: record.classId ?? '',
    className: record.class?.name ?? '',
    subjectId: record.subjectId,
    subjectName: record.subject?.name ?? '',
    teacherId: record.teacherId,
    teacherName: fullName(record.teacher?.user),
    durationMinutes: record.timeLimitMin ?? 0,
    totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
    questions,
    attemptsCount: record._count?.submissions ?? 0,
    // No `dueDate` — the backend doesn't store one. Using createdAt would
    // mislabel every quiz as due the day it was created.
    // No `status` — a quiz is available from creation until the teacher
    // closes it; there's no lifecycle column.
  }
}

function mapQuizSubmission(record: RawQuizSubmission): QuizSubmission {
  return {
    id: record.id,
    quizId: record.quizId,
    studentId: record.studentId,
    score: record.score ?? 0,
    maxScore: record.maxScore ?? 0,
    submittedAt: record.submittedAt.replace('T', ' ').slice(0, 16),
    gradedAt: record.gradedAt
      ? record.gradedAt.replace('T', ' ').slice(0, 16)
      : undefined,
  }
}

function mapGrade(record: RawGrade): GradeRecord {
  const max = record.maxScore || 100
  const percentage = Number(((record.score / max) * 100).toFixed(1))
  const { letter, gpa } = letterFromPercentage(percentage)

  return {
    id: record.id,
    studentId: record.studentId,
    studentName: fullName(record.student?.user),
    studentCode: record.student?.studentCode ?? '',
    classId: record.student?.classId ?? '',
    className: record.student?.class?.name ?? '',
    subjectId: record.subjectId,
    subjectName: record.subject?.name ?? '',
    period: record.period,
    periodLabel: record.periodLabel,
    score: record.score,
    maxScore: max,
    percentage,
    letterGrade: letter,
    gpa,
    comment: record.comment ?? '',
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const academicService = {
  getLessons: async (): Promise<Lesson[]> => {
    const records = await apiClient.get<RawLesson[]>('/lessons')
    return records.map(mapLesson)
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const record = await apiClient.get<RawLesson>(`/lessons/${id}`)
    return mapLesson(record)
  },

  createLesson: async (payload: {
    title: string
    description?: string
    subjectId: string
    classId?: string
    scheduledAt?: string
    fileUrl?: string
    fileType?: string
    fileSizeKb?: number
  }): Promise<Lesson> => {
    const record = await apiClient.post<RawLesson>('/lessons', payload)
    return mapLesson(record)
  },

  updateLesson: async (
    id: string,
    payload: Partial<{
      title: string
      description: string
      subjectId: string
      classId: string
      scheduledAt: string
      fileUrl: string
      fileType: string
      fileSizeKb: number
    }>
  ): Promise<Lesson> => {
    const record = await apiClient.patch<RawLesson>(`/lessons/${id}`, payload)
    return mapLesson(record)
  },

  deleteLesson: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/lessons/${id}`)
  },

  getHomeworkList: async (): Promise<Homework[]> => {
    const records = await apiClient.get<RawHomework[]>('/homeworks')
    return records.map(mapHomework)
  },

  getHomeworkById: async (id: string): Promise<Homework> => {
    const record = await apiClient.get<RawHomework>(`/homeworks/${id}`)
    return mapHomework(record)
  },

  createHomework: async (payload: {
    title: string
    description?: string
    subjectId: string
    classId?: string
    dueDate: string
    maxScore?: number
    allowLateSubmissions?: boolean
  }): Promise<Homework> => {
    const record = await apiClient.post<RawHomework>('/homeworks', payload)
    return mapHomework(record)
  },

  updateHomework: async (
    id: string,
    payload: Partial<{
      title: string
      description: string
      subjectId: string
      classId: string
      dueDate: string
      maxScore: number
      allowLateSubmissions: boolean
    }>
  ): Promise<Homework> => {
    const record = await apiClient.patch<RawHomework>(`/homeworks/${id}`, payload)
    return mapHomework(record)
  },

  deleteHomework: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/homeworks/${id}`)
  },

  submitHomework: async (
    homeworkId: string,
    payload: { content?: string; fileUrl?: string }
  ): Promise<HomeworkSubmission> => {
    const record = await apiClient.post<RawHomeworkSubmission>(
      `/homeworks/${homeworkId}/submissions`,
      payload
    )
    return mapHomeworkSubmission(record)
  },

  /**
   * Submissions for a homework.
   *
   * ASSUMES: `GET /homeworks/:id/submissions` returns a bare array.
   * Verify against the backend — the earlier version read `record.submissions`
   * off the detail response, which only works if the backend inlines them.
   */
  getSubmissions: async (homeworkId: string): Promise<HomeworkSubmission[]> => {
    const records = await apiClient.get<RawHomeworkSubmission[]>(
      `/homeworks/${homeworkId}/submissions`
    )
    return records.map(mapHomeworkSubmission)
  },

  gradeSubmission: async (
    submissionId: string,
    score: number,
    feedback?: string
  ): Promise<HomeworkSubmission> => {
    const record = await apiClient.patch<RawHomeworkSubmission>(
      `/homeworks/submissions/${submissionId}/grade`,
      { score, feedback }
    )
    return mapHomeworkSubmission(record)
  },

  getQuizzes: async (): Promise<Quiz[]> => {
    const records = await apiClient.get<RawQuiz[]>('/quizzes')
    return records.map(mapQuiz)
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    const record = await apiClient.get<RawQuiz>(`/quizzes/${id}`)
    return mapQuiz(record)
  },

  createQuiz: async (payload: {
    title: string
    subjectId: string
    classId?: string
    isAutoGrade?: boolean
    timeLimitMin?: number
    questions: Array<{
      questionText: string
      options?: string[]
      correctAnswer: string
      points?: number
    }>
  }): Promise<Quiz> => {
    const record = await apiClient.post<RawQuiz>('/quizzes', payload)
    return mapQuiz(record)
  },

  updateQuiz: async (
    id: string,
    payload: Partial<{
      title: string
      subjectId: string
      classId: string
      isAutoGrade: boolean
      timeLimitMin: number
    }>
  ): Promise<Quiz> => {
    const record = await apiClient.patch<RawQuiz>(`/quizzes/${id}`, payload)
    return mapQuiz(record)
  },

  deleteQuiz: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/quizzes/${id}`)
  },

  submitQuiz: async (
    quizId: string,
    answers: Record<string, string>
  ): Promise<QuizSubmission> => {
    const record = await apiClient.post<RawQuizSubmission>(
      `/quizzes/${quizId}/submissions`,
      { answers }
    )
    return mapQuizSubmission(record)
  },

  /**
   * All grades. Staff-only (`grades.view`). Students calling this get 403.
   * Use `getMyGrades()` for self-service.
   */
  getAllGrades: async (params?: {
    studentId?: string
    classId?: string
    subjectId?: string
    period?: 'MONTHLY' | 'SEMESTER' | 'ANNUAL'
    periodLabel?: string
  }): Promise<GradeRecord[]> => {
    const query = new URLSearchParams()
    if (params?.studentId) query.set('studentId', params.studentId)
    if (params?.classId) query.set('classId', params.classId)
    if (params?.subjectId) query.set('subjectId', params.subjectId)
    if (params?.period) query.set('period', params.period)
    if (params?.periodLabel) query.set('periodLabel', params.periodLabel)
    const qs = query.toString() ? `?${query.toString()}` : ''
    const records = await apiClient.get<RawGrade[]>(`/grades${qs}`)
    return records.map(mapGrade)
  },

  /**
   * Grades for the authenticated student. Safe for student and parent
   * roles — hits `/grades/me`, which the backend scopes to the caller.
   */
  getMyGrades: async (): Promise<GradeRecord[]> => {
    const records = await apiClient.get<RawGrade[]>('/grades/me')
    return records.map(mapGrade)
  },

  /** @deprecated Use `getAllGrades` (staff) or `getMyGrades` (self). */
  getGrades: async (): Promise<GradeRecord[]> => academicService.getAllGrades(),

  /** @deprecated Use `getAllGrades({ studentId })` or `getMyGrades()`. */
  getStudentGrades: async (studentId?: string): Promise<GradeRecord[]> => {
    if (studentId) return academicService.getAllGrades({ studentId })
    return academicService.getMyGrades()
  },

  saveGradeRecord: async (payload: {
    studentId: string
    subjectId: string
    period: 'MONTHLY' | 'SEMESTER' | 'ANNUAL'
    periodLabel: string
    score: number
    maxScore?: number
    comment?: string
  }): Promise<GradeRecord> => {
    const record = await apiClient.put<RawGrade>('/grades', payload)
    return mapGrade(record)
  },

  /**
   * Save a batch of grade records. Sequential PUTs — if record 5 fails,
   * records 1–4 are already committed server-side. The UI must show
   * per-row status so the teacher can retry only the failures.
   *
   * TODO: replace with `POST /grades/batch` running the upserts inside
   * a transaction.
   */
  saveBatchGrades: async (
    records: Array<{
      studentId: string
      subjectId: string
      period: 'MONTHLY' | 'SEMESTER' | 'ANNUAL'
      periodLabel: string
      score: number
      maxScore?: number
      comment?: string
    }>
  ): Promise<
    Array<
      | { ok: true; record: GradeRecord }
      | { ok: false; error: Error; input: (typeof records)[number] }
    >
  > => {
    const results: Array<
      | { ok: true; record: GradeRecord }
      | { ok: false; error: Error; input: (typeof records)[number] }
    > = []
    for (const rec of records) {
      try {
        const saved = await apiClient.put<RawGrade>('/grades', rec)
        results.push({ ok: true, record: mapGrade(saved) })
      } catch (err) {
        results.push({
          ok: false,
          error: err instanceof Error ? err : new Error(String(err)),
          input: rec,
        })
      }
    }
    return results
  },

  /**
   * Per-student aggregate across grade records.
   *
   * Only GPA and the period average percentage are computed. Attendance,
   * homework completion, and trend require data this endpoint doesn't
   * return — those fields have been removed from `StudentProgress`.
   */
  getStudentProgress: async (classId?: string): Promise<StudentProgress[]> => {
    const query =
      classId && classId !== 'all' ? `?classId=${encodeURIComponent(classId)}` : ''
    const records = await apiClient.get<RawGrade[]>(`/grades${query}`)

    const byStudent = new Map<string, RawGrade[]>()
    for (const r of records) {
      const list = byStudent.get(r.studentId) ?? []
      list.push(r)
      byStudent.set(r.studentId, list)
    }

    const out: StudentProgress[] = []
    for (const [studentId, rows] of byStudent) {
      const first = rows[0]
      const percentages = rows.map((r) => (r.score / (r.maxScore || 100)) * 100)
      const avgPct = percentages.reduce((a, b) => a + b, 0) / percentages.length
      const { gpa } = letterFromPercentage(avgPct)

      out.push({
        studentId,
        studentName: fullName(first.student?.user),
        studentCode: first.student?.studentCode ?? '',
        className: first.student?.class?.name ?? '',
        overallGpa: gpa,
        periodAveragePercentage: Number(avgPct.toFixed(1)),
        gradeRecordCount: rows.length,
      })
    }
    return out
  },
}