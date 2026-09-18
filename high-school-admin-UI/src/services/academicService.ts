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

export function calculateWeightedGrade(
  assignment: number,
  quiz: number,
  midterm: number,
  final: number
): { totalScore: number; letterGrade: 'A' | 'B' | 'C' | 'D' | 'F'; gpa: number } {
  const a = Math.max(0, Math.min(100, Number(assignment) || 0))
  const q = Math.max(0, Math.min(100, Number(quiz) || 0))
  const m = Math.max(0, Math.min(100, Number(midterm) || 0))
  const f = Math.max(0, Math.min(100, Number(final) || 0))
  const totalScore = Number((a * 0.2 + q * 0.2 + m * 0.25 + f * 0.35).toFixed(1))
  if (totalScore >= 90) return { totalScore, letterGrade: 'A', gpa: 4.0 }
  if (totalScore >= 80) return { totalScore, letterGrade: 'B', gpa: 3.0 }
  if (totalScore >= 70) return { totalScore, letterGrade: 'C', gpa: 2.0 }
  if (totalScore >= 60) return { totalScore, letterGrade: 'D', gpa: 1.0 }
  return { totalScore, letterGrade: 'F', gpa: 0.0 }
}

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

function fullName(
  user: { firstName?: string; lastName?: string } | undefined
): string {
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
    durationMinutes: 0,
    objectives: [],
    content: record.description ?? '',
    materials,
    status: 'Scheduled',
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
    materials: [],
    status: 'Published',
    submissionsCount: record._count?.submissions ?? 0,
  }
}

function mapHomeworkSubmission(
  record: RawHomeworkSubmission
): HomeworkSubmission {
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
      ? [
          {
            name: record.fileUrl.split('/').pop() ?? 'Attachment',
            url: record.fileUrl,
          },
        ]
      : [],
    status,
    grade: record.score ?? undefined,
    feedback: record.feedback ?? undefined,
  }
}

function mapQuizQuestion(q: RawQuizQuestion): QuizQuestion {
  const options = Array.isArray(q.options) ? q.options : []
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
    description: '',
    classId: record.classId ?? '',
    className: record.class?.name ?? '',
    subjectId: record.subjectId,
    subjectName: record.subject?.name ?? '',
    teacherId: record.teacherId,
    teacherName: fullName(record.teacher?.user),
    durationMinutes: record.timeLimitMin ?? 0,
    totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
    dueDate: record.createdAt.slice(0, 10),
    status: 'Published',
    questions,
    attemptsCount: record._count?.submissions ?? 0,
  }
}

function mapGrade(record: RawGrade): GradeRecord {
  const percentage = Number(
    ((record.score / (record.maxScore || 100)) * 100).toFixed(1)
  )
  const result = calculateWeightedGrade(
    percentage,
    percentage,
    percentage,
    percentage
  )
  return {
    id: record.id,
    studentId: record.studentId,
    studentName: fullName(record.student?.user),
    studentCode: record.student?.studentCode ?? '',
    classId: record.student?.classId ?? '',
    className: record.student?.class?.name ?? '',
    subjectId: record.subjectId,
    subjectName: record.subject?.name ?? '',
    assignmentScore: percentage,
    quizScore: percentage,
    midtermScore: percentage,
    finalScore: percentage,
    totalWeightedScore: percentage,
    letterGrade: result.letterGrade,
    gpa: result.gpa,
    remarks: record.comment ?? '',
  }
}

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

  getSubmissions: async (homeworkId: string): Promise<HomeworkSubmission[]> => {
    const record = await apiClient.get<{
      submissions?: RawHomeworkSubmission[]
    }>(`/homeworks/${homeworkId}`)
    return (record.submissions ?? []).map(mapHomeworkSubmission)
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

  getQuizForStudent: async (id: string): Promise<Quiz> => {
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
    return apiClient.post<QuizSubmission>(`/quizzes/${quizId}/submissions`, {
      answers,
    })
  },

  getGrades: async (): Promise<GradeRecord[]> => {
    const records = await apiClient.get<RawGrade[]>('/grades')
    return records.map(mapGrade)
  },

  getStudentGrades: async (studentId?: string): Promise<GradeRecord[]> => {
    const path = studentId
      ? `/grades?studentId=${encodeURIComponent(studentId)}`
      : '/grades/me'
    const records = await apiClient.get<RawGrade[]>(path)
    return records.map(mapGrade)
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
  ): Promise<GradeRecord[]> => {
    const results: GradeRecord[] = []
    for (const rec of records) {
      const saved = await apiClient.put<RawGrade>('/grades', rec)
      results.push(mapGrade(saved))
    }
    return results
  },

  getStudentProgress: async (className?: string): Promise<StudentProgress[]> => {
    const query =
      className && className !== 'all'
        ? `?classId=${encodeURIComponent(className)}`
        : ''
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
      const avgPct =
        rows.reduce(
          (sum, r) => sum + (r.score / (r.maxScore || 100)) * 100,
          0
        ) / rows.length

      const trend: StudentProgress['academicTrend'] =
        avgPct >= 88
          ? 'improving'
          : avgPct >= 75
            ? 'stable'
            : 'needs_support'

      out.push({
        studentId,
        studentName: fullName(first.student?.user),
        studentCode: first.student?.studentCode ?? '',
        className: first.student?.class?.name ?? '',
        attendanceRate: 0,
        overallGpa: Number((avgPct / 25).toFixed(2)),
        assignmentAverage: avgPct,
        quizAverage: avgPct,
        midtermAverage: avgPct,
        finalAverage: avgPct,
        homeworkCompletionRate: 0,
        academicTrend: trend,
      })
    }
    return out
  },
}