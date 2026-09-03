export type HomeworkStatus = 'Draft' | 'Published' | 'Closed'
export type SubmissionStatus = 'Submitted' | 'Graded' | 'Returned' | 'Late'

export interface HomeworkAttachment {
  name: string
  url: string
  size: string
}

export interface HomeworkAssignment {
  id: string
  title: string
  instructions: string
  subject: string
  class: string
  teacherId: string
  teacherName: string
  maxPoints: number
  dueDate: string
  status: HomeworkStatus
  allowLateSubmissions: boolean
  attachments?: HomeworkAttachment[]
  submissionsCount?: number
  gradedCount?: number
  createdAt: string
}

export interface HomeworkSubmission {
  id: string
  homeworkId: string
  studentId: string
  studentName: string
  studentClass: string
  submissionDate: string
  textResponse: string
  fileName?: string
  fileSize?: string
  status: SubmissionStatus
  score?: number
  feedback?: string
  gradedAt?: string
  gradedBy?: string
}

const STORAGE_KEY_HOMEWORK = 'school_homework_data_v1'
const STORAGE_KEY_HW_SUBMISSIONS = 'school_hw_submissions_data_v1'

const INITIAL_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: 'hw-1',
    title: 'Calculus Problem Set #4: Derivative Rules & Chain Rule',
    instructions: 'Complete exercises 12 through 34 from Chapter 3. Show all differentiation steps, specify product/quotient/chain rules used, and simplify final algebraic expressions.',
    subject: 'Mathematics',
    class: 'Grade 10 - A',
    teacherId: 'tch-1',
    teacherName: 'Dr. Robert Jenkins',
    maxPoints: 50,
    dueDate: '2026-09-08T23:59:00Z',
    status: 'Published',
    allowLateSubmissions: true,
    attachments: [
      { name: 'Calculus_Problem_Set_4_Worksheet.pdf', url: '#', size: '1.2 MB' },
      { name: 'Formula_Reference_Sheet.pdf', url: '#', size: '420 KB' },
    ],
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'hw-2',
    title: 'Analytical Essay: Themes of Power in Shakespeare\'s Macbeth',
    instructions: 'Submit a 1,200 to 1,500 word thesis-driven analytical essay examining how ambition corrupts moral reasoning in Acts I through III. Cite at least 4 textual passages using MLA style.',
    subject: 'English Literature',
    class: 'Grade 10 - A',
    teacherId: 'tch-4',
    teacherName: 'Ms. Clara Oswald',
    maxPoints: 100,
    dueDate: '2026-09-12T23:59:00Z',
    status: 'Published',
    allowLateSubmissions: false,
    attachments: [
      { name: 'Essay_Rubric_and_Guidelines.pdf', url: '#', size: '580 KB' },
    ],
    createdAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'hw-3',
    title: 'Laboratory Report: Acid-Base Titration & pH Curve Analysis',
    instructions: 'Document your group experiment measuring standard 0.1 M HCl titrated with standardized NaOH. Include your raw burette readings, calculated equivalence point, and titration curve plot.',
    subject: 'Chemistry',
    class: 'Grade 11 - Advanced',
    teacherId: 'tch-5',
    teacherName: 'Dr. Alistair Finch',
    maxPoints: 75,
    dueDate: '2026-09-14T17:00:00Z',
    status: 'Published',
    allowLateSubmissions: true,
    attachments: [
      { name: 'Titration_Data_Template.xlsx', url: '#', size: '89 KB' },
    ],
    createdAt: '2026-09-03T08:30:00Z',
  },
  {
    id: 'hw-4',
    title: 'World History: Primary Source Analysis of the Magna Carta',
    instructions: 'Read excerpts from clauses 12, 39, and 40. Write a 500-word contextual analysis explaining how these clauses shifted feudal concepts of sovereign authority.',
    subject: 'World History',
    class: 'Grade 10 - B',
    teacherId: 'tch-6',
    teacherName: 'Mr. Arthur Pendelton',
    maxPoints: 40,
    dueDate: '2026-09-18T23:59:00Z',
    status: 'Draft',
    allowLateSubmissions: true,
    createdAt: '2026-09-03T10:00:00Z',
  },
]

const INITIAL_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'sub-hw-1',
    homeworkId: 'hw-1',
    studentId: 'stu-101',
    studentName: 'Emily Watson',
    studentClass: 'Grade 10 - A',
    submissionDate: '2026-09-02T16:20:00Z',
    textResponse: 'Here are my solutions to problem set 4. I verified problem 28 using the quotient rule step by step on page 3.',
    fileName: 'Emily_Watson_Calculus_PS4_Solutions.pdf',
    fileSize: '2.4 MB',
    status: 'Graded',
    score: 48,
    feedback: 'Excellent rigor on the chain rule derivations. Minor algebraic simplification error on problem 31, but overall outstanding work.',
    gradedAt: '2026-09-03T10:15:00Z',
    gradedBy: 'Dr. Robert Jenkins',
  },
  {
    id: 'sub-hw-2',
    homeworkId: 'hw-1',
    studentId: 'stu-102',
    studentName: 'David Kim',
    studentClass: 'Grade 10 - A',
    submissionDate: '2026-09-03T08:45:00Z',
    textResponse: 'Completed all problems including the bonus parametric curve derivative.',
    fileName: 'DavidKim_Derivatives_HW.pdf',
    fileSize: '1.8 MB',
    status: 'Submitted',
  },
  {
    id: 'sub-hw-3',
    homeworkId: 'hw-2',
    studentId: 'stu-101',
    studentName: 'Emily Watson',
    studentClass: 'Grade 10 - A',
    submissionDate: '2026-09-03T14:10:00Z',
    textResponse: 'Draft essay analyzing Lady Macbeth and Macbeth\'s parallel psychological spirals.',
    fileName: 'Watson_Macbeth_Essay_Draft.docx',
    fileSize: '410 KB',
    status: 'Submitted',
  },
]

class HomeworkService {
  private getStoredAssignments(): HomeworkAssignment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HOMEWORK)
      if (stored) return JSON.parse(stored)
    } catch {
      // fallback
    }
    this.saveStoredAssignments(INITIAL_ASSIGNMENTS)
    return INITIAL_ASSIGNMENTS
  }

  private saveStoredAssignments(items: HomeworkAssignment[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_HOMEWORK, JSON.stringify(items))
    } catch (e) {
      console.error(e)
    }
  }

  private getStoredSubmissions(): HomeworkSubmission[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HW_SUBMISSIONS)
      if (stored) return JSON.parse(stored)
    } catch {
      // fallback
    }
    this.saveStoredSubmissions(INITIAL_SUBMISSIONS)
    return INITIAL_SUBMISSIONS
  }

  private saveStoredSubmissions(subs: HomeworkSubmission[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_HW_SUBMISSIONS, JSON.stringify(subs))
    } catch (e) {
      console.error(e)
    }
  }

  public async getAssignments(filter?: { class?: string; subject?: string; status?: HomeworkStatus }): Promise<HomeworkAssignment[]> {
    const list = this.getStoredAssignments()
    const subs = this.getStoredSubmissions()

    return list
      .filter((h) => {
        if (filter?.class && filter.class !== 'All Classes' && h.class !== filter.class) return false
        if (filter?.subject && filter.subject !== 'All Subjects' && h.subject !== filter.subject) return false
        if (filter?.status && h.status !== filter.status) return false
        return true
      })
      .map((h) => {
        const matchingSubs = subs.filter((s) => s.homeworkId === h.id)
        const graded = matchingSubs.filter((s) => s.status === 'Graded')
        return {
          ...h,
          submissionsCount: matchingSubs.length,
          gradedCount: graded.length,
        }
      })
  }

  // Teacher: Create Homework (UC-HOMEWORK-01)
  public async createHomework(
    payload: Omit<HomeworkAssignment, 'id' | 'createdAt' | 'submissionsCount' | 'gradedCount'>
  ): Promise<HomeworkAssignment> {
    const items = this.getStoredAssignments()
    const newItem: HomeworkAssignment = {
      ...payload,
      id: `hw-${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissionsCount: 0,
      gradedCount: 0,
    }
    items.unshift(newItem)
    this.saveStoredAssignments(items)
    return newItem
  }

  // Teacher: Publish Homework
  public async publishHomework(id: string): Promise<HomeworkAssignment> {
    const items = this.getStoredAssignments()
    const idx = items.findIndex((h) => h.id === id)
    if (idx === -1) throw new Error('Homework not found')
    items[idx].status = 'Published'
    this.saveStoredAssignments(items)
    return items[idx]
  }

  // Teacher: Delete Homework
  public async deleteHomework(id: string): Promise<void> {
    let items = this.getStoredAssignments()
    items = items.filter((h) => h.id !== id)
    this.saveStoredAssignments(items)
  }

  // Student: Submit Homework (UC-HOMEWORK-02)
  public async submitHomework(payload: {
    homeworkId: string
    studentId: string
    studentName: string
    studentClass: string
    textResponse: string
    fileName?: string
    fileSize?: string
  }): Promise<HomeworkSubmission> {
    const subs = this.getStoredSubmissions()
    const existingIdx = subs.findIndex(
      (s) => s.homeworkId === payload.homeworkId && s.studentId === payload.studentId
    )

    const newSub: HomeworkSubmission = {
      id: existingIdx !== -1 ? subs[existingIdx].id : `sub-hw-${Date.now()}`,
      homeworkId: payload.homeworkId,
      studentId: payload.studentId,
      studentName: payload.studentName,
      studentClass: payload.studentClass,
      submissionDate: new Date().toISOString(),
      textResponse: payload.textResponse,
      fileName: payload.fileName || 'Assignment_Submission.pdf',
      fileSize: payload.fileSize || '1.5 MB',
      status: 'Submitted',
    }

    if (existingIdx !== -1) {
      subs[existingIdx] = newSub
    } else {
      subs.push(newSub)
    }

    this.saveStoredSubmissions(subs)
    return newSub
  }

  // Teacher: Review Homework (UC-HOMEWORK-03)
  public async reviewHomework(
    submissionId: string,
    score: number,
    feedback: string,
    gradedBy: string
  ): Promise<HomeworkSubmission> {
    const subs = this.getStoredSubmissions()
    const idx = subs.findIndex((s) => s.id === submissionId)
    if (idx === -1) throw new Error('Submission not found')

    subs[idx].score = score
    subs[idx].feedback = feedback
    subs[idx].status = 'Graded'
    subs[idx].gradedAt = new Date().toISOString()
    subs[idx].gradedBy = gradedBy

    this.saveStoredSubmissions(subs)
    return subs[idx]
  }

  // Submissions for an assignment
  public async getSubmissionsForAssignment(homeworkId: string): Promise<HomeworkSubmission[]> {
    const subs = this.getStoredSubmissions()
    return subs.filter((s) => s.homeworkId === homeworkId)
  }

  // Student submission for a specific homework
  public async getStudentSubmission(homeworkId: string, studentId: string): Promise<HomeworkSubmission | null> {
    const subs = this.getStoredSubmissions()
    return subs.find((s) => s.homeworkId === homeworkId && s.studentId === studentId) || null
  }
}

export const homeworkService = new HomeworkService()
