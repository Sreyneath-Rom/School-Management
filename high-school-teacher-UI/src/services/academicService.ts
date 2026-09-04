import type {
  Lesson,
  Homework,
  HomeworkSubmission,
  Quiz,
  QuizQuestion,
  QuizSubmission,
  GradeRecord,
  StudentProgress,
} from '@/types/academic'

// Helper for calculating grade according to UC-GRADE-02:
// Assignment = 20%, Quiz = 20%, Midterm = 25%, Final = 35%
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

  let letterGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F'
  let gpa = 0.0

  if (totalScore >= 90) {
    letterGrade = 'A'
    gpa = 4.0
  } else if (totalScore >= 80) {
    letterGrade = 'B'
    gpa = 3.0
  } else if (totalScore >= 70) {
    letterGrade = 'C'
    gpa = 2.0
  } else if (totalScore >= 60) {
    letterGrade = 'D'
    gpa = 1.0
  } else {
    letterGrade = 'F'
    gpa = 0.0
  }

  return { totalScore, letterGrade, gpa }
}

const STORAGE_KEYS = {
  LESSONS: 'hsms_academic_lessons',
  HOMEWORK: 'hsms_academic_homework',
  HOMEWORK_SUBMISSIONS: 'hsms_academic_hw_submissions',
  QUIZZES: 'hsms_academic_quizzes',
  QUIZ_SUBMISSIONS: 'hsms_academic_quiz_submissions',
  GRADES: 'hsms_academic_grades',
}

// Initial seed data
const initialLessons: Lesson[] = [
  {
    id: 'les-1',
    title: 'Quadratic Equations & Parabolic Trajectories',
    description: 'Master solving quadratic formulas by factoring, completing the square, and graphical models.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: '2',
    teacherName: 'John Whitfield',
    date: '2026-09-04',
    time: '08:30 - 09:45 AM',
    durationMinutes: 75,
    objectives: [
      'Derive the quadratic formula from standard form ax^2 + bx + c = 0',
      'Identify the vertex and axis of symmetry on coordinate planes',
      'Model projectile height vs. time trajectory calculations',
    ],
    content: `In this session, we examine how quadratic functions behave in physical reality. We start by expanding binomials, finding roots via factoring, and then proving the quadratic formula. Students work in pairs to analyze parabolic projectile curves.`,
    materials: [
      { id: 'mat-1', name: 'Quadratic_Formulas_Lecture_Slides.pdf', type: 'pdf', url: '#', size: '2.4 MB' },
      { id: 'mat-2', name: 'Interactive_Desmos_Parabola_Graph.link', type: 'link', url: 'https://www.desmos.com/calculator' },
      { id: 'mat-3', name: 'Homework_Prep_Worksheet_Ch4.pdf', type: 'doc', url: '#', size: '1.1 MB' },
    ],
    status: 'Completed',
  },
  {
    id: 'les-2',
    title: 'Newtonian Dynamics & Free Body Diagrams',
    description: 'Analyzing force vectors, friction coefficients, and conservation of momentum in linear systems.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    teacherId: '2',
    teacherName: 'John Whitfield',
    date: '2026-09-05',
    time: '10:00 - 11:15 AM',
    durationMinutes: 75,
    objectives: [
      'Construct accurate free-body force diagrams for inclined planes',
      'Calculate static and kinetic friction thresholds',
      'Apply F_net = m * a in multi-body pulley configurations',
    ],
    content: `Physics lab session focusing on friction carts and inclined track sensors. Students calculate experimental acceleration and contrast against theoretical predictions without friction.`,
    materials: [
      { id: 'mat-4', name: 'Newton_Laws_Lab_Manual.pdf', type: 'pdf', url: '#', size: '3.8 MB' },
      { id: 'mat-5', name: 'Lab_Data_Collection_Sheet.doc', type: 'doc', url: '#', size: '640 KB' },
    ],
    status: 'Scheduled',
  },
  {
    id: 'les-3',
    title: 'Literary Themes in Shakespearean Tragedy',
    description: 'Textual analysis of ambition, fate, and moral culpability in Macbeth Act III.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-eng',
    subjectName: 'English Literature',
    teacherId: '5',
    teacherName: 'Sarah Parker',
    date: '2026-09-06',
    time: '01:00 - 02:15 PM',
    durationMinutes: 75,
    objectives: [
      'Deconstruct soliloquies in Act III Scene 1 and 4',
      'Identify dramatic irony and recurring blood motif symbolism',
      'Prepare comparative thesis statement for upcoming analytical essay',
    ],
    content: `Close-reading seminar focusing on the banquet scene in Macbeth. We analyze how hallucinations manifest internal psychological conflict and guilt.`,
    materials: [
      { id: 'mat-6', name: 'Macbeth_Act_III_Annotated_Text.pdf', type: 'pdf', url: '#', size: '1.8 MB' },
    ],
    status: 'Scheduled',
  },
]

const initialHomework: Homework[] = [
  {
    id: 'hw-1',
    title: 'Chapter 4 Problem Set: Quadratic Roots',
    description: 'Complete questions 1 to 15 on page 142. Show all step-by-step discriminant calculations and sketch the parabolas for problems 8 and 12.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: '2',
    teacherName: 'John Whitfield',
    assignedDate: '2026-09-02',
    dueDate: '2026-09-07',
    maxPoints: 100,
    materials: [
      { id: 'hm-1', name: 'Problem_Set_4_Reference.pdf', type: 'pdf', url: '#' },
    ],
    status: 'Published',
    submissionsCount: 29,
    totalStudents: 32,
  },
  {
    id: 'hw-2',
    title: 'Friction Coefficient Lab Report',
    description: 'Submit your typed laboratory report including hypothesis, apparatus diagram, raw acceleration measurements, and calculated coefficient of static friction.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    teacherId: '2',
    teacherName: 'John Whitfield',
    assignedDate: '2026-09-03',
    dueDate: '2026-09-09',
    maxPoints: 100,
    materials: [
      { id: 'hm-2', name: 'Formal_Lab_Report_Rubric.pdf', type: 'pdf', url: '#' },
    ],
    status: 'Published',
    submissionsCount: 18,
    totalStudents: 32,
  },
  {
    id: 'hw-3',
    title: 'Macbeth Act III Analytical Response',
    description: 'Write a 600-word analytical response exploring how Shakespeare uses light and darkness imagery to mirror the deteriorating moral state of Scotland.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-eng',
    subjectName: 'English Literature',
    teacherId: '5',
    teacherName: 'Sarah Parker',
    assignedDate: '2026-09-01',
    dueDate: '2026-09-08',
    maxPoints: 50,
    materials: [],
    status: 'Published',
    submissionsCount: 31,
    totalStudents: 32,
  },
]

const initialSubmissions: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-1',
    studentId: '3', // Emily
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    submittedAt: '2026-09-03 14:22',
    content: 'All 15 problems completed in attached sheet. Checked roots using discriminant b^2 - 4ac. Graph sketches included for #8 and #12.',
    attachments: [{ name: 'Emily_Watson_Math_HW4.pdf', url: '#', size: '1.4 MB' }],
    status: 'Graded',
    grade: 96,
    feedback: 'Superb clarity on completing the square, Emily! Excellent work on identifying the vertex coordinates.',
  },
  {
    id: 'sub-2',
    homeworkId: 'hw-2',
    studentId: '3', // Emily
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    submittedAt: '2026-09-04 09:15',
    content: 'Attached my typed report on incline friction coefficient experiments.',
    attachments: [{ name: 'Emily_Watson_Physics_Lab2.pdf', url: '#', size: '2.1 MB' }],
    status: 'Submitted',
  },
  {
    id: 'sub-3',
    homeworkId: 'hw-1',
    studentId: 'stu-alex',
    studentName: 'Alex Chen',
    studentCode: 'STU-1002',
    submittedAt: '2026-09-03 16:40',
    content: 'Problem set solutions attached with verification using factored forms.',
    attachments: [{ name: 'Alex_Chen_Math_Ch4.pdf', url: '#', size: '980 KB' }],
    status: 'Graded',
    grade: 92,
    feedback: 'Solid work. Remember to include units for real-world word problems.',
  },
  {
    id: 'sub-4',
    homeworkId: 'hw-1',
    studentId: 'stu-sophia',
    studentName: 'Sophia Miller',
    studentCode: 'STU-1003',
    submittedAt: '2026-09-04 11:30',
    content: 'Here is my assignment for Chapter 4.',
    attachments: [{ name: 'Sophia_M_HW4.pdf', url: '#', size: '1.2 MB' }],
    status: 'Submitted',
  },
]

const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Algebra II: Quadratics & Polynomial Functions',
    description: 'Assess mastery of discriminant calculations, parabolic coordinates, and polynomial root factoring.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: '2',
    teacherName: 'John Whitfield',
    durationMinutes: 20,
    totalPoints: 20,
    dueDate: '2026-09-08',
    status: 'Published',
    attemptsCount: 28,
    questions: [
      {
        id: 'q1',
        question: 'What does a negative discriminant (b² - 4ac < 0) indicate about a quadratic equation?',
        options: [
          'Two distinct real roots',
          'Exactly one real repeated root',
          'Two complex/imaginary roots and no real x-intercepts',
          'The parabola is a straight line',
        ],
        correctAnswer: 2,
        points: 5,
        explanation: 'When b² - 4ac < 0, the square root yields an imaginary number, meaning the parabola never crosses the x-axis.',
      },
      {
        id: 'q2',
        question: 'What are the roots of the quadratic equation x² - 7x + 12 = 0?',
        options: [
          'x = -3 and x = -4',
          'x = 3 and x = 4',
          'x = 2 and x = 6',
          'x = -2 and x = -6',
        ],
        correctAnswer: 1,
        points: 5,
        explanation: '(x - 3)(x - 4) = 0 gives solutions x = 3 and x = 4.',
      },
      {
        id: 'q3',
        question: 'What are the coordinates of the vertex for f(x) = 2(x - 3)² + 5?',
        options: [
          '(-3, 5)',
          '(3, -5)',
          '(3, 5)',
          '(2, 5)',
        ],
        correctAnswer: 2,
        points: 5,
        explanation: 'In vertex form a(x - h)² + k, the vertex is (h, k) = (3, 5).',
      },
      {
        id: 'q4',
        question: 'If the roots of a quadratic equation are 5 and -2, which equation represents them?',
        options: [
          'x² - 3x - 10 = 0',
          'x² + 3x - 10 = 0',
          'x² - 7x + 10 = 0',
          'x² + 7x + 10 = 0',
        ],
        correctAnswer: 0,
        points: 5,
        explanation: '(x - 5)(x + 2) = x² - 3x - 10 = 0.',
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Kinematics & Newton’s Laws of Motion',
    description: 'Speed, velocity, acceleration, force equilibrium, and momentum conservation principles.',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    teacherId: '2',
    teacherName: 'John Whitfield',
    durationMinutes: 25,
    totalPoints: 20,
    dueDate: '2026-09-10',
    status: 'Published',
    attemptsCount: 22,
    questions: [
      {
        id: 'qp1',
        question: 'According to Newton’s First Law, what happens to an object when net external force is zero?',
        options: [
          'It immediately decelerates to a stop',
          'It continues at constant velocity or remains at rest',
          'It accelerates constantly in a circular trajectory',
          'Its mass increases proportionally',
        ],
        correctAnswer: 1,
        points: 5,
        explanation: 'Inertia keeps the velocity constant unless an unbalanced net force acts upon it.',
      },
      {
        id: 'qp2',
        question: 'A 5 kg mass accelerates at 4 m/s². What is the net force applied?',
        options: [
          '1.25 N',
          '9 N',
          '20 N',
          '40 N',
        ],
        correctAnswer: 2,
        points: 5,
        explanation: 'F = m * a = 5 kg * 4 m/s² = 20 N.',
      },
      {
        id: 'qp3',
        question: 'What is the standard SI unit of momentum?',
        options: [
          'kg·m/s',
          'Joules (J)',
          'Newtons (N)',
          'kg/s²',
        ],
        correctAnswer: 0,
        points: 5,
        explanation: 'Momentum p = m * v, so units are kg * m/s.',
      },
      {
        id: 'qp4',
        question: 'If surface friction coefficient is 0.3 on a 100 N block resting horizontally, what horizontal force overcomes static friction?',
        options: [
          '10 N',
          '30 N',
          '70 N',
          '300 N',
        ],
        correctAnswer: 1,
        points: 5,
        explanation: 'F_friction = μ * N = 0.3 * 100 N = 30 N.',
      },
    ],
  },
]

const initialQuizSubmissions: QuizSubmission[] = [
  {
    id: 'qsub-1',
    quizId: 'quiz-1',
    studentId: '3', // Emily
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    submittedAt: '2026-09-03 11:15',
    answers: { q1: 2, q2: 1, q3: 2, q4: 0 },
    score: 20,
    totalPoints: 20,
    percentage: 100,
    passed: true,
  },
]

const initialGrades: GradeRecord[] = [
  {
    id: 'gr-1',
    studentId: '3',
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    assignmentScore: 96, // 20% -> 19.2
    quizScore: 95,       // 20% -> 19.0
    midtermScore: 92,    // 25% -> 23.0
    finalScore: 94,      // 35% -> 32.9
    totalWeightedScore: 94.1,
    letterGrade: 'A',
    gpa: 4.0,
    remarks: 'Consistent top-tier academic rigor and mathematical problem-solving.',
  },
  {
    id: 'gr-2',
    studentId: '3',
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    assignmentScore: 90,
    quizScore: 94,
    midtermScore: 88,
    finalScore: 91,
    totalWeightedScore: 90.7,
    letterGrade: 'A',
    gpa: 4.0,
    remarks: 'Strong laboratory analysis skills and diligent experimental writeups.',
  },
  {
    id: 'gr-3',
    studentId: '3',
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-eng',
    subjectName: 'English Literature',
    assignmentScore: 95,
    quizScore: 90,
    midtermScore: 92,
    finalScore: 93,
    totalWeightedScore: 92.6,
    letterGrade: 'A',
    gpa: 4.0,
    remarks: 'Exceptional literary deconstruction and critical essay argumentation.',
  },
  {
    id: 'gr-4',
    studentId: '3',
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    assignmentScore: 88,
    quizScore: 85,
    midtermScore: 86,
    finalScore: 89,
    totalWeightedScore: 87.3,
    letterGrade: 'B',
    gpa: 3.0,
    remarks: 'Solid understanding of stoichiometry and thermochemical equilibrium.',
  },
  {
    id: 'gr-5',
    studentId: '3',
    studentName: 'Emily Watson',
    studentCode: 'STU123456',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science',
    assignmentScore: 98,
    quizScore: 100,
    midtermScore: 95,
    finalScore: 97,
    totalWeightedScore: 97.1,
    letterGrade: 'A',
    gpa: 4.0,
    remarks: 'Mastery of object-oriented data structures and algorithmic complexity.',
  },
  // Additional students in Grade 10-A for teacher grading roster
  {
    id: 'gr-6',
    studentId: 'stu-alex',
    studentName: 'Alex Chen',
    studentCode: 'STU-1002',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    assignmentScore: 92,
    quizScore: 88,
    midtermScore: 86,
    finalScore: 90,
    totalWeightedScore: 89.0,
    letterGrade: 'B',
    gpa: 3.0,
    remarks: 'Good participation; focus on quadratic word problems.',
  },
  {
    id: 'gr-7',
    studentId: 'stu-sophia',
    studentName: 'Sophia Miller',
    studentCode: 'STU-1003',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    assignmentScore: 85,
    quizScore: 80,
    midtermScore: 82,
    finalScore: 84,
    totalWeightedScore: 82.9,
    letterGrade: 'B',
    gpa: 3.0,
    remarks: 'Regular attendance and consistent progress throughout the term.',
  },
  {
    id: 'gr-8',
    studentId: 'stu-marcus',
    studentName: 'Marcus Vance',
    studentCode: 'STU-1004',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    assignmentScore: 72,
    quizScore: 68,
    midtermScore: 74,
    finalScore: 70,
    totalWeightedScore: 71.0,
    letterGrade: 'C',
    gpa: 2.0,
    remarks: 'Needs additional practice on factoring quadratic equations.',
  },
  {
    id: 'gr-9',
    studentId: 'stu-chloe',
    studentName: 'Chloe Bennett',
    studentCode: 'STU-1005',
    classId: 'cls-1',
    className: 'Grade 10-A',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    assignmentScore: 95,
    quizScore: 94,
    midtermScore: 96,
    finalScore: 98,
    totalWeightedScore: 96.1,
    letterGrade: 'A',
    gpa: 4.0,
    remarks: 'Exemplary academic dedication and peer tutoring contributions.',
  },
]

// Storage helper functions
function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setStorageItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    // ignore
  }
}

export const academicService = {
  // ----------------------------------------------------
  // LESSONS
  // ----------------------------------------------------
  getLessons: async (): Promise<Lesson[]> => {
    return getStorageItem<Lesson[]>(STORAGE_KEYS.LESSONS, initialLessons)
  },

  createLesson: async (lesson: Omit<Lesson, 'id'>): Promise<Lesson> => {
    const lessons = getStorageItem<Lesson[]>(STORAGE_KEYS.LESSONS, initialLessons)
    const newLesson: Lesson = {
      ...lesson,
      id: `les-${Date.now()}`,
    }
    lessons.unshift(newLesson)
    setStorageItem(STORAGE_KEYS.LESSONS, lessons)
    return newLesson
  },

  updateLesson: async (id: string, updates: Partial<Lesson>): Promise<Lesson | null> => {
    const lessons = getStorageItem<Lesson[]>(STORAGE_KEYS.LESSONS, initialLessons)
    const idx = lessons.findIndex((l) => l.id === id)
    if (idx === -1) return null
    lessons[idx] = { ...lessons[idx], ...updates }
    setStorageItem(STORAGE_KEYS.LESSONS, lessons)
    return lessons[idx]
  },

  deleteLesson: async (id: string): Promise<boolean> => {
    const lessons = getStorageItem<Lesson[]>(STORAGE_KEYS.LESSONS, initialLessons)
    const filtered = lessons.filter((l) => l.id !== id)
    setStorageItem(STORAGE_KEYS.LESSONS, filtered)
    return true
  },

  // ----------------------------------------------------
  // HOMEWORK
  // ----------------------------------------------------
  getHomeworkList: async (): Promise<Homework[]> => {
    return getStorageItem<Homework[]>(STORAGE_KEYS.HOMEWORK, initialHomework)
  },

  createHomework: async (hw: Omit<Homework, 'id' | 'submissionsCount' | 'totalStudents'>): Promise<Homework> => {
    const list = getStorageItem<Homework[]>(STORAGE_KEYS.HOMEWORK, initialHomework)
    const newHw: Homework = {
      ...hw,
      id: `hw-${Date.now()}`,
      submissionsCount: 0,
      totalStudents: 32,
    }
    list.unshift(newHw)
    setStorageItem(STORAGE_KEYS.HOMEWORK, list)
    return newHw
  },

  updateHomework: async (id: string, updates: Partial<Homework>): Promise<Homework | null> => {
    const list = getStorageItem<Homework[]>(STORAGE_KEYS.HOMEWORK, initialHomework)
    const idx = list.findIndex((h) => h.id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...updates }
    setStorageItem(STORAGE_KEYS.HOMEWORK, list)
    return list[idx]
  },

  deleteHomework: async (id: string): Promise<boolean> => {
    const list = getStorageItem<Homework[]>(STORAGE_KEYS.HOMEWORK, initialHomework)
    setStorageItem(STORAGE_KEYS.HOMEWORK, list.filter((h) => h.id !== id))
    return true
  },

  // Submissions
  getSubmissions: async (homeworkId?: string): Promise<HomeworkSubmission[]> => {
    const subs = getStorageItem<HomeworkSubmission[]>(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, initialSubmissions)
    if (homeworkId) {
      return subs.filter((s) => s.homeworkId === homeworkId)
    }
    return subs
  },

  submitHomework: async (payload: {
    homeworkId: string
    studentId: string
    studentName: string
    studentCode: string
    content: string
    attachments?: { name: string; url: string; size?: string }[]
  }): Promise<HomeworkSubmission> => {
    const subs = getStorageItem<HomeworkSubmission[]>(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, initialSubmissions)
    const existingIdx = subs.findIndex(
      (s) => s.homeworkId === payload.homeworkId && s.studentId === payload.studentId
    )

    const submission: HomeworkSubmission = {
      id: existingIdx !== -1 ? subs[existingIdx].id : `sub-${Date.now()}`,
      homeworkId: payload.homeworkId,
      studentId: payload.studentId,
      studentName: payload.studentName,
      studentCode: payload.studentCode,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content: payload.content,
      attachments: payload.attachments || [],
      status: 'Submitted',
    }

    if (existingIdx !== -1) {
      subs[existingIdx] = submission
    } else {
      subs.push(submission)
    }
    setStorageItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, subs)

    // Update submissions count on the homework
    const hwList = getStorageItem<Homework[]>(STORAGE_KEYS.HOMEWORK, initialHomework)
    const hwIdx = hwList.findIndex((h) => h.id === payload.homeworkId)
    if (hwIdx !== -1) {
      const hwSubs = subs.filter((s) => s.homeworkId === payload.homeworkId)
      hwList[hwIdx].submissionsCount = hwSubs.length
      setStorageItem(STORAGE_KEYS.HOMEWORK, hwList)
    }

    return submission
  },

  gradeSubmission: async (
    submissionId: string,
    grade: number,
    feedback?: string
  ): Promise<HomeworkSubmission | null> => {
    const subs = getStorageItem<HomeworkSubmission[]>(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, initialSubmissions)
    const idx = subs.findIndex((s) => s.id === submissionId)
    if (idx === -1) return null
    subs[idx].grade = Math.max(0, Math.min(100, grade))
    subs[idx].feedback = feedback || ''
    subs[idx].status = 'Graded'
    setStorageItem(STORAGE_KEYS.HOMEWORK_SUBMISSIONS, subs)
    return subs[idx]
  },

  // ----------------------------------------------------
  // QUIZZES & TESTS
  // ----------------------------------------------------
  getQuizzes: async (): Promise<Quiz[]> => {
    return getStorageItem<Quiz[]>(STORAGE_KEYS.QUIZZES, initialQuizzes)
  },

  /**
   * UC-QUIZ-03 Security Requirement:
   * "The student must not receive correctAnswer before submitting the quiz."
   */
  getQuizForStudent: async (quizId: string): Promise<Quiz | null> => {
    const quizzes = getStorageItem<Quiz[]>(STORAGE_KEYS.QUIZZES, initialQuizzes)
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return null

    // Strip out correctAnswer and explanation so student cannot inspect browser memory
    const secureQuestions = quiz.questions.map(({ correctAnswer: _ca, explanation: _exp, ...rest }) => ({
      ...rest,
      correctAnswer: -1, // Sanitized
    }))

    return {
      ...quiz,
      questions: secureQuestions as QuizQuestion[],
    }
  },

  createQuiz: async (quiz: Omit<Quiz, 'id' | 'attemptsCount'>): Promise<Quiz> => {
    const list = getStorageItem<Quiz[]>(STORAGE_KEYS.QUIZZES, initialQuizzes)
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      attemptsCount: 0,
    }
    list.unshift(newQuiz)
    setStorageItem(STORAGE_KEYS.QUIZZES, list)
    return newQuiz
  },

  updateQuiz: async (id: string, updates: Partial<Quiz>): Promise<Quiz | null> => {
    const list = getStorageItem<Quiz[]>(STORAGE_KEYS.QUIZZES, initialQuizzes)
    const idx = list.findIndex((q) => q.id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...updates }
    setStorageItem(STORAGE_KEYS.QUIZZES, list)
    return list[idx]
  },

  deleteQuiz: async (id: string): Promise<boolean> => {
    const list = getStorageItem<Quiz[]>(STORAGE_KEYS.QUIZZES, initialQuizzes)
    setStorageItem(STORAGE_KEYS.QUIZZES, list.filter((q) => q.id !== id))
    return true
  },

  getQuizSubmissions: async (quizId?: string): Promise<QuizSubmission[]> => {
    const subs = getStorageItem<QuizSubmission[]>(STORAGE_KEYS.QUIZ_SUBMISSIONS, initialQuizSubmissions)
    if (quizId) return subs.filter((s) => s.quizId === quizId)
    return subs
  },

  submitQuiz: async (payload: {
    quizId: string
    studentId: string
    studentName: string
    studentCode: string
    answers: Record<string, number>
  }): Promise<{ submission: QuizSubmission; detailedResults: { questionId: string; correct: boolean; correctAnswer: number; explanation?: string }[] }> => {
    const quizzes = getStorageItem<Quiz[]>(STORAGE_KEYS.QUIZZES, initialQuizzes)
    const quiz = quizzes.find((q) => q.id === payload.quizId)
    if (!quiz) throw new Error('Quiz not found')

    let earnedPoints = 0
    let totalPoints = 0
    const detailedResults: { questionId: string; correct: boolean; correctAnswer: number; explanation?: string }[] = []

    quiz.questions.forEach((q) => {
      totalPoints += q.points
      const chosen = payload.answers[q.id]
      const isCorrect = chosen === q.correctAnswer
      if (isCorrect) earnedPoints += q.points
      detailedResults.push({
        questionId: q.id,
        correct: isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })
    })

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    const passed = percentage >= 60

    const submission: QuizSubmission = {
      id: `qsub-${Date.now()}`,
      quizId: payload.quizId,
      studentId: payload.studentId,
      studentName: payload.studentName,
      studentCode: payload.studentCode,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      answers: payload.answers,
      score: earnedPoints,
      totalPoints,
      percentage,
      passed,
    }

    const subs = getStorageItem<QuizSubmission[]>(STORAGE_KEYS.QUIZ_SUBMISSIONS, initialQuizSubmissions)
    subs.push(submission)
    setStorageItem(STORAGE_KEYS.QUIZ_SUBMISSIONS, subs)

    // Update attempts count
    quiz.attemptsCount = (quiz.attemptsCount || 0) + 1
    setStorageItem(STORAGE_KEYS.QUIZZES, quizzes)

    return { submission, detailedResults }
  },

  // ----------------------------------------------------
  // GRADES & STUDENT PROGRESS
  // ----------------------------------------------------
  getGrades: async (classId?: string, subjectId?: string): Promise<GradeRecord[]> => {
    const grades = getStorageItem<GradeRecord[]>(STORAGE_KEYS.GRADES, initialGrades)
    let filtered = grades
    if (classId && classId !== 'all') {
      filtered = filtered.filter((g) => g.classId === classId || g.className.toLowerCase() === classId.toLowerCase())
    }
    if (subjectId && subjectId !== 'all') {
      filtered = filtered.filter((g) => g.subjectId === subjectId || g.subjectName.toLowerCase() === subjectId.toLowerCase())
    }
    return filtered
  },

  getStudentGrades: async (studentId: string): Promise<GradeRecord[]> => {
    const grades = getStorageItem<GradeRecord[]>(STORAGE_KEYS.GRADES, initialGrades)
    return grades.filter((g) => g.studentId === studentId)
  },

  saveGradeRecord: async (record: Omit<GradeRecord, 'totalWeightedScore' | 'letterGrade' | 'gpa'>): Promise<GradeRecord> => {
    const { totalScore, letterGrade, gpa } = calculateWeightedGrade(
      record.assignmentScore,
      record.quizScore,
      record.midtermScore,
      record.finalScore
    )

    const fullRecord: GradeRecord = {
      ...record,
      totalWeightedScore: totalScore,
      letterGrade,
      gpa,
    }

    const grades = getStorageItem<GradeRecord[]>(STORAGE_KEYS.GRADES, initialGrades)
    const idx = grades.findIndex((g) => g.id === record.id)
    if (idx !== -1) {
      grades[idx] = fullRecord
    } else {
      grades.push(fullRecord)
    }
    setStorageItem(STORAGE_KEYS.GRADES, grades)
    return fullRecord
  },

  saveBatchGrades: async (records: GradeRecord[]): Promise<GradeRecord[]> => {
    const grades = getStorageItem<GradeRecord[]>(STORAGE_KEYS.GRADES, initialGrades)
    const updated = records.map((r) => {
      const { totalScore, letterGrade, gpa } = calculateWeightedGrade(
        r.assignmentScore,
        r.quizScore,
        r.midtermScore,
        r.finalScore
      )
      return {
        ...r,
        totalWeightedScore: totalScore,
        letterGrade,
        gpa,
      }
    })

    updated.forEach((ur) => {
      const idx = grades.findIndex((g) => g.id === ur.id)
      if (idx !== -1) {
        grades[idx] = ur
      } else {
        grades.push(ur)
      }
    })

    setStorageItem(STORAGE_KEYS.GRADES, grades)
    return updated
  },

  getStudentProgress: async (className: string = 'Grade 10-A'): Promise<StudentProgress[]> => {
    const grades = getStorageItem<GradeRecord[]>(STORAGE_KEYS.GRADES, initialGrades)
    const classGrades = grades.filter((g) => g.className === className || className === 'all')

    // Group by student
    const studentMap = new Map<string, GradeRecord[]>()
    classGrades.forEach((g) => {
      const list = studentMap.get(g.studentId) || []
      list.push(g)
      studentMap.set(g.studentId, list)
    })

    const progressList: StudentProgress[] = []
    studentMap.forEach((records, studentId) => {
      const first = records[0]
      const totalWeighted = records.reduce((acc, r) => acc + r.totalWeightedScore, 0) / (records.length || 1)
      const avgAssignment = records.reduce((acc, r) => acc + r.assignmentScore, 0) / (records.length || 1)
      const avgQuiz = records.reduce((acc, r) => acc + r.quizScore, 0) / (records.length || 1)
      const avgMidterm = records.reduce((acc, r) => acc + r.midtermScore, 0) / (records.length || 1)
      const avgFinal = records.reduce((acc, r) => acc + r.finalScore, 0) / (records.length || 1)
      const gpaAvg = records.reduce((acc, r) => acc + r.gpa, 0) / (records.length || 1)

      const trend: 'improving' | 'stable' | 'needs_support' =
        totalWeighted >= 88 ? 'improving' : totalWeighted >= 75 ? 'stable' : 'needs_support'

      progressList.push({
        studentId,
        studentName: first.studentName,
        studentCode: first.studentCode,
        className: first.className,
        attendanceRate: studentId === '3' ? 96.5 : studentId === 'stu-alex' ? 94.0 : 88.5,
        overallGpa: Number(gpaAvg.toFixed(2)),
        assignmentAverage: Number(avgAssignment.toFixed(1)),
        quizAverage: Number(avgQuiz.toFixed(1)),
        midtermAverage: Number(avgMidterm.toFixed(1)),
        finalAverage: Number(avgFinal.toFixed(1)),
        homeworkCompletionRate: studentId === '3' ? 100 : 85,
        academicTrend: trend,
      })
    })

    return progressList
  },
}
