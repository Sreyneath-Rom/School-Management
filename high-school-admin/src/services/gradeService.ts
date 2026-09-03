export interface AssessmentDefinition {
  id: string
  name: string
  type: 'homework' | 'quiz' | 'midterm' | 'final' | 'project'
  weightPercentage: number
  maxScore: number
}

export interface StudentGradeEntry {
  studentId: string
  studentName: string
  studentNumber: string
  avatar?: string
  class: string
  subject: string
  term: string
  scores: Record<string, number> // assessmentId -> numeric score
  calculatedAverage?: number
  letterGrade?: string
  gpa?: number
  status?: 'Passing' | 'At Risk' | 'Failing'
}

export interface ClassGradebook {
  class: string
  subject: string
  term: string
  assessments: AssessmentDefinition[]
  entries: StudentGradeEntry[]
  classAverage: number
  passingRate: number
}

const STORAGE_KEY_GRADES = 'school_grades_data_v1'

const DEFAULT_ASSESSMENTS: AssessmentDefinition[] = [
  { id: 'as-hw', name: 'Homework & Problem Sets', type: 'homework', weightPercentage: 20, maxScore: 100 },
  { id: 'as-quiz', name: 'Quizzes & Unit Tests', type: 'quiz', weightPercentage: 25, maxScore: 100 },
  { id: 'as-mid', name: 'Midterm Examination', type: 'midterm', weightPercentage: 25, maxScore: 100 },
  { id: 'as-fin', name: 'Final Semester Exam', type: 'final', weightPercentage: 30, maxScore: 100 },
]

const INITIAL_GRADEBOOK_ENTRIES: StudentGradeEntry[] = [
  {
    studentId: 'stu-101',
    studentName: 'Emily Watson',
    studentNumber: 'STU-2026-001',
    class: 'Grade 10 - A',
    subject: 'Mathematics',
    term: 'Term 1',
    scores: { 'as-hw': 96, 'as-quiz': 92, 'as-mid': 94, 'as-fin': 98 },
  },
  {
    studentId: 'stu-102',
    studentName: 'David Kim',
    studentNumber: 'STU-2026-002',
    class: 'Grade 10 - A',
    subject: 'Mathematics',
    term: 'Term 1',
    scores: { 'as-hw': 84, 'as-quiz': 78, 'as-mid': 82, 'as-fin': 85 },
  },
  {
    studentId: 'stu-103',
    studentName: 'Sophia Martinez',
    studentNumber: 'STU-2026-003',
    class: 'Grade 10 - A',
    subject: 'Mathematics',
    term: 'Term 1',
    scores: { 'as-hw': 92, 'as-quiz': 89, 'as-mid': 90, 'as-fin': 91 },
  },
  {
    studentId: 'stu-104',
    studentName: 'Marcus Vance',
    studentNumber: 'STU-2026-004',
    class: 'Grade 10 - A',
    subject: 'Mathematics',
    term: 'Term 1',
    scores: { 'as-hw': 70, 'as-quiz': 65, 'as-mid': 68, 'as-fin': 72 },
  },
  {
    studentId: 'stu-105',
    studentName: 'Olivia Zhang',
    studentNumber: 'STU-2026-005',
    class: 'Grade 10 - A',
    subject: 'Mathematics',
    term: 'Term 1',
    scores: { 'as-hw': 98, 'as-quiz': 95, 'as-mid': 99, 'as-fin': 97 },
  },
  {
    studentId: 'stu-106',
    studentName: 'Lucas Campbell',
    studentNumber: 'STU-2026-006',
    class: 'Grade 10 - A',
    subject: 'Mathematics',
    term: 'Term 1',
    scores: { 'as-hw': 60, 'as-quiz': 54, 'as-mid': 58, 'as-fin': 62 },
  },
  // English Literature entries for Emily Watson
  {
    studentId: 'stu-101',
    studentName: 'Emily Watson',
    studentNumber: 'STU-2026-001',
    class: 'Grade 10 - A',
    subject: 'English Literature',
    term: 'Term 1',
    scores: { 'as-hw': 95, 'as-quiz': 90, 'as-mid': 92, 'as-fin': 94 },
  },
  // Physics entries for Emily Watson
  {
    studentId: 'stu-101',
    studentName: 'Emily Watson',
    studentNumber: 'STU-2026-001',
    class: 'Grade 10 - A',
    subject: 'Physics',
    term: 'Term 1',
    scores: { 'as-hw': 90, 'as-quiz': 88, 'as-mid': 85, 'as-fin': 89 },
  },
]

export function computeGrade(
  scores: Record<string, number>,
  assessments: AssessmentDefinition[]
): { average: number; letterGrade: string; gpa: number; status: 'Passing' | 'At Risk' | 'Failing' } {
  let totalWeightedScore = 0
  let totalWeight = 0

  assessments.forEach((as) => {
    const raw = scores[as.id]
    if (raw !== undefined) {
      const normalized = (raw / as.maxScore) * 100
      totalWeightedScore += normalized * (as.weightPercentage / 100)
      totalWeight += as.weightPercentage
    }
  })

  const average = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0

  let letterGrade = 'F'
  let gpa = 0.0
  let status: 'Passing' | 'At Risk' | 'Failing' = 'Passing'

  if (average >= 93) {
    letterGrade = 'A'
    gpa = 4.0
  } else if (average >= 90) {
    letterGrade = 'A-'
    gpa = 3.7
  } else if (average >= 87) {
    letterGrade = 'B+'
    gpa = 3.3
  } else if (average >= 83) {
    letterGrade = 'B'
    gpa = 3.0
  } else if (average >= 80) {
    letterGrade = 'B-'
    gpa = 2.7
  } else if (average >= 77) {
    letterGrade = 'C+'
    gpa = 2.3
  } else if (average >= 70) {
    letterGrade = 'C'
    gpa = 2.0
    status = 'At Risk'
  } else if (average >= 60) {
    letterGrade = 'D'
    gpa = 1.0
    status = 'At Risk'
  } else {
    letterGrade = 'F'
    gpa = 0.0
    status = 'Failing'
  }

  return { average, letterGrade, gpa, status }
}

class GradeService {
  private getStoredEntries(): StudentGradeEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GRADES)
      if (stored) return JSON.parse(stored)
    } catch {
      // fallback
    }
    this.saveStoredEntries(INITIAL_GRADEBOOK_ENTRIES)
    return INITIAL_GRADEBOOK_ENTRIES
  }

  private saveStoredEntries(entries: StudentGradeEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(entries))
    } catch (e) {
      console.error(e)
    }
  }

  public async getClassGradebook(
    targetClass: string,
    subject: string,
    term: string
  ): Promise<ClassGradebook> {
    const all = this.getStoredEntries()
    const matching = all.filter(
      (e) => e.class === targetClass && e.subject === subject && e.term === term
    )

    const computed = matching.map((e) => {
      const { average, letterGrade, gpa, status } = computeGrade(e.scores, DEFAULT_ASSESSMENTS)
      return {
        ...e,
        calculatedAverage: average,
        letterGrade,
        gpa,
        status,
      }
    })

    const classAverage =
      computed.length > 0
        ? Math.round(computed.reduce((acc, c) => acc + (c.calculatedAverage || 0), 0) / computed.length)
        : 0

    const passingCount = computed.filter((c) => (c.calculatedAverage || 0) >= 70).length
    const passingRate = computed.length > 0 ? Math.round((passingCount / computed.length) * 100) : 100

    return {
      class: targetClass,
      subject,
      term,
      assessments: DEFAULT_ASSESSMENTS,
      entries: computed,
      classAverage,
      passingRate,
    }
  }

  // Teacher: Update student grade (UC-GRADEBOOK-01)
  public async updateStudentScore(
    studentId: string,
    targetClass: string,
    subject: string,
    term: string,
    assessmentId: string,
    newScore: number
  ): Promise<void> {
    const all = this.getStoredEntries()
    const idx = all.findIndex(
      (e) => e.studentId === studentId && e.class === targetClass && e.subject === subject && e.term === term
    )

    if (idx !== -1) {
      all[idx].scores[assessmentId] = newScore
    } else {
      all.push({
        studentId,
        studentName: 'Student',
        studentNumber: `STU-${studentId}`,
        class: targetClass,
        subject,
        term,
        scores: { [assessmentId]: newScore },
      })
    }

    this.saveStoredEntries(all)
  }

  // Student: Get all grades for a student (UC-GRADEBOOK-03 & BR-09)
  public async getStudentReport(studentId: string, term: string): Promise<{
    entries: StudentGradeEntry[]
    cumulativeGpa: number
    overallAverage: number
  }> {
    const all = this.getStoredEntries()
    const studentEntries = all.filter((e) => e.studentId === studentId && e.term === term)

    const computed = studentEntries.map((e) => {
      const { average, letterGrade, gpa, status } = computeGrade(e.scores, DEFAULT_ASSESSMENTS)
      return {
        ...e,
        calculatedAverage: average,
        letterGrade,
        gpa,
        status,
      }
    })

    const cumulativeGpa =
      computed.length > 0
        ? Number((computed.reduce((acc, e) => acc + (e.gpa || 0), 0) / computed.length).toFixed(2))
        : 4.0

    const overallAverage =
      computed.length > 0
        ? Math.round(computed.reduce((acc, e) => acc + (e.calculatedAverage || 0), 0) / computed.length)
        : 0

    return {
      entries: computed,
      cumulativeGpa,
      overallAverage,
    }
  }
}

export const gradeService = new GradeService()
