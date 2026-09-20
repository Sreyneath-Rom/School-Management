// src/types/academic.ts

export interface LessonMaterial {
  id: string
  name: string
  type: string
  url: string
  size?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  date: string
  time: string
  content: string
  materials: LessonMaterial[]
}

export interface HomeworkAttachment {
  name: string
  url: string
}

export interface Homework {
  id: string
  title: string
  description: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  assignedDate: string
  dueDate: string
  maxPoints: number
  allowLateSubmissions: boolean
  submissionsCount: number
}

export type HomeworkSubmissionStatus = 'Graded' | 'Submitted' | 'Pending'

export interface HomeworkSubmission {
  id: string
  homeworkId: string
  studentId: string
  studentName: string
  studentCode: string
  submittedAt: string
  content: string
  attachments: HomeworkAttachment[]
  status: HomeworkSubmissionStatus
  grade?: number
  feedback?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  points: number
}

export interface Quiz {
  id: string
  title: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  durationMinutes: number
  totalPoints: number
  questions: QuizQuestion[]
  attemptsCount: number
}

export interface QuizSubmission {
  id: string
  quizId: string
  studentId: string
  score: number
  maxScore: number
  submittedAt: string
  gradedAt?: string
}

export type GradePeriod = 'MONTHLY' | 'SEMESTER' | 'ANNUAL'
export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface GradeRecord {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  period: GradePeriod
  periodLabel: string
  score: number
  maxScore: number
  percentage: number
  letterGrade: LetterGrade
  gpa: number
  comment: string
}

export interface StudentProgress {
  studentId: string
  studentName: string
  studentCode: string
  className: string
  overallGpa: number
  periodAveragePercentage: number
  gradeRecordCount: number
}