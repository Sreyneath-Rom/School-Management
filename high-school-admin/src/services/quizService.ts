export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer'

export interface QuizQuestion {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  correctAnswer: string // Hidden from students before submission per BR-06
  explanation?: string
  points: number
}

// Student-safe version of question adhering strictly to BR-06
export interface StudentSafeQuizQuestion {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  points: number
}

export type QuizStatus = 'Draft' | 'Published' | 'Closed'

export interface QuizSubmission {
  id: string
  quizId: string
  studentId: string
  studentName: string
  studentAvatar?: string
  class: string
  answers: Record<string, string> // questionId -> selected answer
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  submittedAt: string
  timeSpentSeconds: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  class: string
  teacherId: string
  teacherName: string
  durationMinutes: number
  passingPercentage: number
  status: QuizStatus
  dueDate: string
  createdAt: string
  questions: QuizQuestion[]
  submissionsCount?: number
  averageScore?: number
}

// Student-safe quiz model (correctAnswer stripped per BR-06)
export interface StudentSafeQuiz {
  id: string
  title: string
  description: string
  subject: string
  class: string
  teacherName: string
  durationMinutes: number
  passingPercentage: number
  status: QuizStatus
  dueDate: string
  totalQuestions: number
  totalPoints: number
  questions: StudentSafeQuizQuestion[]
}

const STORAGE_KEY_QUIZZES = 'school_quizzes_data_v1'
const STORAGE_KEY_SUBMISSIONS = 'school_quiz_submissions_data_v1'

const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Algebra II: Quadratic Functions & Polynomials',
    description: 'Assessment on factoring, solving roots using quadratic formula, and graphing parabolas.',
    subject: 'Mathematics',
    class: 'Grade 10 - A',
    teacherId: 'tch-1',
    teacherName: 'Dr. Robert Jenkins',
    durationMinutes: 25,
    passingPercentage: 70,
    status: 'Published',
    dueDate: '2026-09-10T15:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
    questions: [
      {
        id: 'q-1-1',
        text: 'What are the roots of the quadratic equation x² - 5x + 6 = 0?',
        type: 'multiple_choice',
        options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = 5'],
        correctAnswer: 'x = 2 and x = 3',
        explanation: 'Factoring gives (x - 2)(x - 3) = 0, so x = 2 and x = 3.',
        points: 5,
      },
      {
        id: 'q-1-2',
        text: 'The vertex of the parabola f(x) = (x - 3)² + 4 is at the point (3, 4).',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'In vertex form f(x) = a(x - h)² + k, the vertex is (h, k) = (3, 4).',
        points: 5,
      },
      {
        id: 'q-1-3',
        text: 'If the discriminant b² - 4ac is negative, how many real roots does the quadratic equation have?',
        type: 'multiple_choice',
        options: ['Zero real roots (two complex roots)', 'Exactly one real root', 'Two distinct real roots', 'Infinitely many roots'],
        correctAnswer: 'Zero real roots (two complex roots)',
        explanation: 'A negative discriminant results in the square root of a negative number, yielding complex conjugate roots.',
        points: 5,
      },
      {
        id: 'q-1-4',
        text: 'Which of the following polynomials is a difference of squares?',
        type: 'multiple_choice',
        options: ['4x² - 25', 'x² + 9', '3x² - 12x', 'x³ - 8'],
        correctAnswer: '4x² - 25',
        explanation: '4x² - 25 = (2x - 5)(2x + 5), which is a difference of squares.',
        points: 5,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'AP Physics: Newton\'s Laws & Dynamics',
    description: 'Conceptual and quantitative quiz covering free-body diagrams, friction coefficients, and centripetal acceleration.',
    subject: 'Physics',
    class: 'Grade 11 - Advanced',
    teacherId: 'tch-2',
    teacherName: 'Prof. Elena Rostova',
    durationMinutes: 30,
    passingPercentage: 75,
    status: 'Published',
    dueDate: '2026-09-12T18:00:00Z',
    createdAt: '2026-09-02T10:00:00Z',
    questions: [
      {
        id: 'q-2-1',
        text: 'A 10 kg block rests on a horizontal frictionless surface. A force of 50 N is applied. What is its acceleration?',
        type: 'multiple_choice',
        options: ['5 m/s²', '0.2 m/s²', '500 m/s²', '9.8 m/s²'],
        correctAnswer: '5 m/s²',
        explanation: 'F = ma => a = F/m = 50 N / 10 kg = 5 m/s².',
        points: 5,
      },
      {
        id: 'q-2-2',
        text: 'Newton\'s Third Law states that every action has an equal and opposite reaction acting on the same object.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Action and reaction force pairs always act on two different interacting objects, not the same object.',
        points: 5,
      },
      {
        id: 'q-2-3',
        text: 'What is the net force on an object moving at a constant velocity of 20 m/s in a straight line?',
        type: 'multiple_choice',
        options: ['0 N', '20 N', '200 N', 'Depends on mass'],
        correctAnswer: '0 N',
        explanation: 'Constant velocity implies zero acceleration (a = 0). By F_net = ma, F_net must be 0 N.',
        points: 5,
      },
    ],
  },
  {
    id: 'quiz-3',
    title: 'Biology: Cell Structure & Cellular Respiration',
    description: 'Quiz evaluating organelle functions, ATP synthesis, glycolysis, and the Krebs cycle.',
    subject: 'Biology',
    class: 'Grade 10 - A',
    teacherId: 'tch-3',
    teacherName: 'Dr. Marcus Vance',
    durationMinutes: 20,
    passingPercentage: 65,
    status: 'Draft',
    dueDate: '2026-09-15T12:00:00Z',
    createdAt: '2026-09-03T09:00:00Z',
    questions: [
      {
        id: 'q-3-1',
        text: 'Which organelle is considered the powerhouse of eukaryotic cells where aerobic ATP synthesis occurs?',
        type: 'multiple_choice',
        options: ['Mitochondria', 'Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosome'],
        correctAnswer: 'Mitochondria',
        explanation: 'Mitochondria generate the majority of cellular adenosine triphosphate (ATP).',
        points: 10,
      },
      {
        id: 'q-3-2',
        text: 'Glycolysis takes place inside the mitochondrial matrix.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Glycolysis occurs in the cytosol (cytoplasm) of the cell.',
        points: 10,
      },
    ],
  },
]

const INITIAL_SUBMISSIONS: QuizSubmission[] = [
  {
    id: 'sub-1',
    quizId: 'quiz-1',
    studentId: 'stu-101',
    studentName: 'Emily Watson',
    class: 'Grade 10 - A',
    answers: {
      'q-1-1': 'x = 2 and x = 3',
      'q-1-2': 'True',
      'q-1-3': 'Zero real roots (two complex roots)',
      'q-1-4': '4x² - 25',
    },
    score: 20,
    totalPoints: 20,
    percentage: 100,
    passed: true,
    submittedAt: '2026-09-02T14:30:00Z',
    timeSpentSeconds: 740,
  },
  {
    id: 'sub-2',
    quizId: 'quiz-1',
    studentId: 'stu-102',
    studentName: 'David Kim',
    class: 'Grade 10 - A',
    answers: {
      'q-1-1': 'x = 2 and x = 3',
      'q-1-2': 'True',
      'q-1-3': 'Two distinct real roots',
      'q-1-4': '4x² - 25',
    },
    score: 15,
    totalPoints: 20,
    percentage: 75,
    passed: true,
    submittedAt: '2026-09-02T15:10:00Z',
    timeSpentSeconds: 890,
  },
  {
    id: 'sub-3',
    quizId: 'quiz-2',
    studentId: 'stu-103',
    studentName: 'Sophia Martinez',
    class: 'Grade 11 - Advanced',
    answers: {
      'q-2-1': '5 m/s²',
      'q-2-2': 'False',
      'q-2-3': '0 N',
    },
    score: 15,
    totalPoints: 15,
    percentage: 100,
    passed: true,
    submittedAt: '2026-09-03T11:20:00Z',
    timeSpentSeconds: 610,
  },
]

class QuizService {
  private getStoredQuizzes(): Quiz[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_QUIZZES)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // fallback
    }
    this.saveStoredQuizzes(INITIAL_QUIZZES)
    return INITIAL_QUIZZES
  }

  private saveStoredQuizzes(quizzes: Quiz[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes))
    } catch (e) {
      console.error('Failed to save quizzes to localStorage', e)
    }
  }

  private getStoredSubmissions(): QuizSubmission[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SUBMISSIONS)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // fallback
    }
    this.saveStoredSubmissions(INITIAL_SUBMISSIONS)
    return INITIAL_SUBMISSIONS
  }

  private saveStoredSubmissions(subs: QuizSubmission[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(subs))
    } catch (e) {
      console.error('Failed to save submissions to localStorage', e)
    }
  }

  // Teacher / Admin: List all quizzes with summary metrics
  public async getQuizzes(filter?: { class?: string; subject?: string; status?: QuizStatus }): Promise<Quiz[]> {
    const quizzes = this.getStoredQuizzes()
    const submissions = this.getStoredSubmissions()

    return quizzes
      .filter((q) => {
        if (filter?.class && filter.class !== 'All Classes' && q.class !== filter.class) return false
        if (filter?.subject && filter.subject !== 'All Subjects' && q.subject !== filter.subject) return false
        if (filter?.status && q.status !== filter.status) return false
        return true
      })
      .map((q) => {
        const subs = submissions.filter((s) => s.quizId === q.id)
        const avg = subs.length > 0 ? Math.round(subs.reduce((acc, s) => acc + s.percentage, 0) / subs.length) : undefined
        return {
          ...q,
          submissionsCount: subs.length,
          averageScore: avg,
        }
      })
  }

  // Teacher: Create Quiz (UC-QUIZ-01)
  public async createQuiz(quizInput: Omit<Quiz, 'id' | 'createdAt' | 'submissionsCount' | 'averageScore'>): Promise<Quiz> {
    const quizzes = this.getStoredQuizzes()
    const newQuiz: Quiz = {
      ...quizInput,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissionsCount: 0,
    }
    quizzes.unshift(newQuiz)
    this.saveStoredQuizzes(quizzes)
    return newQuiz
  }

  // Teacher: Update Quiz
  public async updateQuiz(id: string, patch: Partial<Quiz>): Promise<Quiz> {
    const quizzes = this.getStoredQuizzes()
    const index = quizzes.findIndex((q) => q.id === id)
    if (index === -1) throw new Error('Quiz not found')

    const updated = { ...quizzes[index], ...patch }
    quizzes[index] = updated
    this.saveStoredQuizzes(quizzes)
    return updated
  }

  // Teacher: Publish Quiz (UC-QUIZ-02)
  public async publishQuiz(id: string): Promise<Quiz> {
    return this.updateQuiz(id, { status: 'Published' })
  }

  // Teacher: Delete Quiz
  public async deleteQuiz(id: string): Promise<void> {
    let quizzes = this.getStoredQuizzes()
    quizzes = quizzes.filter((q) => q.id !== id)
    this.saveStoredQuizzes(quizzes)
  }

  // Student Safe: Retrieve Quiz for taking (Enforces BR-06: No correctAnswer provided to students)
  public async getStudentSafeQuiz(id: string): Promise<StudentSafeQuiz> {
    const quizzes = this.getStoredQuizzes()
    const quiz = quizzes.find((q) => q.id === id)
    if (!quiz) throw new Error('Quiz not found')

    const safeQuestions: StudentSafeQuizQuestion[] = quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options ? [...q.options] : undefined,
      points: q.points,
    }))

    const totalPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0)

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      class: quiz.class,
      teacherName: quiz.teacherName,
      durationMinutes: quiz.durationMinutes,
      passingPercentage: quiz.passingPercentage,
      status: quiz.status,
      dueDate: quiz.dueDate,
      totalQuestions: safeQuestions.length,
      totalPoints,
      questions: safeQuestions,
    }
  }

  // Student: Submit Quiz (UC-QUIZ-03 Step 4-7: Evaluates answers securely, calculates score)
  public async submitQuiz(
    quizId: string,
    studentId: string,
    studentName: string,
    studentClass: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<{
    submission: QuizSubmission
    review: {
      questionId: string
      questionText: string
      userAnswer: string
      correctAnswer: string
      isCorrect: boolean
      pointsEarned: number
      maxPoints: number
      explanation?: string
    }[]
  }> {
    const quizzes = this.getStoredQuizzes()
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) throw new Error('Quiz not found')

    let totalPoints = 0
    let earnedPoints = 0

    const review = quiz.questions.map((q) => {
      totalPoints += q.points
      const userAns = answers[q.id] || ''
      const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      const pts = isCorrect ? q.points : 0
      earnedPoints += pts

      return {
        questionId: q.id,
        questionText: q.text,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        pointsEarned: pts,
        maxPoints: q.points,
        explanation: q.explanation,
      }
    })

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    const passed = percentage >= quiz.passingPercentage

    const submission: QuizSubmission = {
      id: `sub-${Date.now()}`,
      quizId,
      studentId,
      studentName,
      class: studentClass,
      answers,
      score: earnedPoints,
      totalPoints,
      percentage,
      passed,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds,
    }

    const subs = this.getStoredSubmissions()
    // If student previously submitted, replace or append
    const existingIdx = subs.findIndex((s) => s.quizId === quizId && s.studentId === studentId)
    if (existingIdx !== -1) {
      subs[existingIdx] = submission
    } else {
      subs.push(submission)
    }
    this.saveStoredSubmissions(subs)

    return { submission, review }
  }

  // Submissions for a quiz (Teacher/Admin view)
  public async getQuizSubmissions(quizId: string): Promise<QuizSubmission[]> {
    const subs = this.getStoredSubmissions()
    return subs.filter((s) => s.quizId === quizId)
  }

  // Student: Get previous submission for a quiz if any
  public async getStudentSubmission(quizId: string, studentId: string): Promise<QuizSubmission | null> {
    const subs = this.getStoredSubmissions()
    const found = subs.find((s) => s.quizId === quizId && s.studentId === studentId)
    return found || null
  }
}

export const quizService = new QuizService()
