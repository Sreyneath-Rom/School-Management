export interface LessonMaterial {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'slides' | 'video' | 'link'
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
  durationMinutes: number
  objectives: string[]
  content: string
  materials: LessonMaterial[]
  status: 'Draft' | 'Scheduled' | 'Completed'
}

export interface HomeworkMaterial {
  id: string
  name: string
  type: string
  url: string
}

export interface HomeworkSubmission {
  id: string
  homeworkId: string
  studentId: string
  studentName: string
  studentCode: string
  submittedAt: string
  content: string
  attachments: { name: string; url: string; size?: string }[]
  status: 'Pending' | 'Submitted' | 'Graded' | 'Late'
  grade?: number // 0 - 100
  feedback?: string
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
  materials: HomeworkMaterial[]
  status: 'Draft' | 'Published'
  submissionsCount?: number
  totalStudents?: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // 0-indexed choice index
  points: number
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  durationMinutes: number
  totalPoints: number
  dueDate: string
  status: 'Draft' | 'Published'
  questions: QuizQuestion[]
  attemptsCount?: number
}

export interface QuizSubmission {
  id: string
  quizId: string
  studentId: string
  studentName: string
  studentCode: string
  submittedAt: string
  answers: Record<string, number> // questionId -> selected choice index
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
}

export interface GradeRecord {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  assignmentScore: number // 20%
  quizScore: number // 20%
  midtermScore: number // 25%
  finalScore: number // 35%
  totalWeightedScore: number // 0 - 100
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  gpa: number
  remarks?: string
}

export interface StudentProgress {
  studentId: string
  studentName: string
  studentCode: string
  className: string
  attendanceRate: number
  overallGpa: number
  assignmentAverage: number
  quizAverage: number
  midtermAverage: number
  finalAverage: number
  homeworkCompletionRate: number
  academicTrend: 'improving' | 'stable' | 'needs_support'
}
