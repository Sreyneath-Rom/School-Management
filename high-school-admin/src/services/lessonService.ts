export type LessonStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'

export interface LessonAttachment {
  id: string
  name: string
  url: string
  size: string
  type: 'pdf' | 'slide' | 'doc' | 'video' | 'link'
}

export interface Lesson {
  id: string
  title: string
  subject: string
  class: string
  teacherId: string
  teacherName: string
  unit: string
  chapter?: string
  date: string // YYYY-MM-DD
  startTime: string // "09:00"
  durationMinutes: number
  room: string
  objectives: string[]
  summary: string
  status: LessonStatus
  attachments: LessonAttachment[]
  linkedHomeworkId?: string
  linkedHomeworkTitle?: string
  linkedQuizId?: string
  linkedQuizTitle?: string
  reviewedByStudents: string[] // student IDs who checked it as reviewed
  createdAt: string
  updatedAt: string
}

export interface CreateLessonPayload {
  title: string
  subject: string
  class: string
  teacherId: string
  teacherName: string
  unit: string
  chapter?: string
  date: string
  startTime: string
  durationMinutes: number
  room: string
  objectives: string[]
  summary: string
  status: LessonStatus
  attachments?: LessonAttachment[]
  linkedHomeworkId?: string
  linkedHomeworkTitle?: string
  linkedQuizId?: string
  linkedQuizTitle?: string
}

const STORAGE_KEY_LESSONS = 'school_lessons_data_v1'

const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'les-1',
    title: 'Introduction to Derivative Rules: Power, Product, and Quotient',
    subject: 'Mathematics',
    class: 'Grade 10 - A',
    teacherId: 'tch-1',
    teacherName: 'Dr. Robert Jenkins',
    unit: 'Unit 3: Differential Calculus',
    chapter: 'Chapter 3.2',
    date: '2026-09-08',
    startTime: '08:30',
    durationMinutes: 90,
    room: 'Room 204 - Math Wing',
    objectives: [
      'Apply the power rule d/dx(x^n) = n*x^(n-1) to polynomials',
      'Derive and utilize the product rule for composite polynomial products',
      'Differentiate rational functions applying the quotient rule correctly',
      'Identify tangent line slopes at given boundary points',
    ],
    summary:
      'In this lecture, students transition from definition of limits to algorithmic differentiation shortcuts. We systematically prove the power rule and product rule, walk through 4 practical graphing applications, and set up problem solving workflows.',
    status: 'Scheduled',
    attachments: [
      {
        id: 'att-1',
        name: 'Calculus_Unit3_Derivative_Lecture_Slides.pdf',
        url: '#',
        size: '3.4 MB',
        type: 'slide',
      },
      {
        id: 'att-2',
        name: 'Derivative_Rules_Cheatsheet.pdf',
        url: '#',
        size: '540 KB',
        type: 'pdf',
      },
      {
        id: 'att-3',
        name: 'Interactive Visual Tangent Slopes (Geogebra)',
        url: 'https://www.geogebra.org/m/derivatives',
        size: 'External Link',
        type: 'link',
      },
    ],
    linkedHomeworkId: 'hw-1',
    linkedHomeworkTitle: 'Calculus Problem Set #4: Derivative Rules & Chain Rule',
    reviewedByStudents: ['std-1', 'std-2'],
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'les-2',
    title: 'Cellular Respiration: Glycolysis & The Krebs Cycle',
    subject: 'Biology',
    class: 'Grade 10 - A',
    teacherId: 'tch-2',
    teacherName: 'Dr. John Whitfield',
    unit: 'Unit 2: Cellular Bioenergetics',
    chapter: 'Chapter 2.4',
    date: '2026-09-05',
    startTime: '10:15',
    durationMinutes: 90,
    room: 'Room 302 - Biology Lab',
    objectives: [
      'Trace the biochemical breakdown of glucose into pyruvate in the cytoplasm',
      'Track net ATP and NADH yields from glycolysis and the Citric Acid Cycle',
      'Differentiate aerobic respiration from lactic acid and alcoholic fermentation',
      'Observe yeast fermentation rates in laboratory respirometer chambers',
    ],
    summary:
      'Students completed the wet lab session examining aerobic respiration pathways. We quantified mitochondrial ATP synthase activity, ran respirometer trials with baker yeast, and mapped electron carrier pathways across the inner mitochondrial membrane.',
    status: 'Completed',
    attachments: [
      {
        id: 'att-4',
        name: 'BioLab_Respiration_Experiment_Protocol.pdf',
        url: '#',
        size: '1.8 MB',
        type: 'pdf',
      },
      {
        id: 'att-5',
        name: 'Mitochondrial_Electron_Transport_Diagram.png',
        url: '#',
        size: '920 KB',
        type: 'doc',
      },
      {
        id: 'att-6',
        name: 'Khan Academy: Cellular Respiration Crash Course',
        url: 'https://khanacademy.org/science/biology/cellular-respiration',
        size: 'Video Lecture',
        type: 'video',
      },
    ],
    linkedQuizId: 'qz-2',
    linkedQuizTitle: 'Cellular Respiration & Krebs Cycle Concept Check',
    reviewedByStudents: ['std-1', 'std-3', 'std-4'],
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-09-05T12:00:00Z',
  },
  {
    id: 'les-3',
    title: 'Shakespearean Tragedy & The Psychology of Ambition in Macbeth',
    subject: 'Literature',
    class: 'Grade 10 - A',
    teacherId: 'tch-3',
    teacherName: 'Ms. Eleanor Vance',
    unit: 'Unit 1: Renaissance Drama & Morality',
    chapter: 'Act I & II',
    date: '2026-09-07',
    startTime: '13:00',
    durationMinutes: 60,
    room: 'Room 105 - Humanities Hall',
    objectives: [
      'Analyze the motif of equivocation in the Weird Sisters prophecies',
      'Compare Lady Macbeth rhetoric with classic Aristotelian tragic flaw hamartia',
      'Annotate soliloquy rhetorical devices (iambic pentameter, caesura, apostrophe)',
      'Construct a dialectical thesis statement on internal vs external fate',
    ],
    summary:
      'Close-reading symposium focusing on Macbeth "If it were done when \'tis done" soliloquy. We examined blank verse variations indicating moral breakdown, listened to the Royal Shakespeare Company audio recording, and initiated essay outline drafting.',
    status: 'Completed',
    attachments: [
      {
        id: 'att-7',
        name: 'Macbeth_Act_I_Annotated_Folio_Selections.pdf',
        url: '#',
        size: '2.1 MB',
        type: 'pdf',
      },
      {
        id: 'att-8',
        name: 'Tragic_Hero_Literary_Analysis_Rubric.pdf',
        url: '#',
        size: '310 KB',
        type: 'pdf',
      },
    ],
    linkedHomeworkId: 'hw-2',
    linkedHomeworkTitle: 'Analytical Essay: Themes of Power in Shakespeare\'s Macbeth',
    reviewedByStudents: ['std-1'],
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-07T14:30:00Z',
  },
  {
    id: 'les-4',
    title: 'Thermodynamics & Heat Transfer: Conduction, Convection, Radiation',
    subject: 'Physics',
    class: 'Grade 10 - A',
    teacherId: 'tch-4',
    teacherName: 'Dr. Aris Thorne',
    unit: 'Unit 2: Thermal Energy & Kinetic Theory',
    chapter: 'Chapter 5.1',
    date: '2026-09-09',
    startTime: '11:00',
    durationMinutes: 90,
    room: 'Room 308 - Physics Lab',
    objectives: [
      'Apply Fourier Law of Thermal Conduction Q/t = kA(T2 - T1)/d',
      'Calculate specific heat capacity using coffee cup calorimetry experiments',
      'Model atmospheric convection currents and radiation emissivity',
      'Predict equilibrium temperatures in multi-material thermodynamic systems',
    ],
    summary:
      'Upcoming laboratory workshop on thermal dynamics. Students will bring laptops to log sensor thermistor data in real time as copper, aluminum, and glass rods conduct heat.',
    status: 'Scheduled',
    attachments: [
      {
        id: 'att-9',
        name: 'Calorimetry_Lab_Prep_Brief.pdf',
        url: '#',
        size: '1.5 MB',
        type: 'pdf',
      },
      {
        id: 'att-10',
        name: 'Thermal_Physics_Slide_Deck.pptx',
        url: '#',
        size: '5.2 MB',
        type: 'slide',
      },
    ],
    reviewedByStudents: [],
    createdAt: '2026-09-03T09:00:00Z',
    updatedAt: '2026-09-03T09:00:00Z',
  },
  {
    id: 'les-5',
    title: 'Chemical Stoichiometry & Limiting Reactants',
    subject: 'Chemistry',
    class: 'Grade 10 - B',
    teacherId: 'tch-5',
    teacherName: 'Dr. Sarah Lin',
    unit: 'Unit 3: Quantitative Chemical Reactions',
    chapter: 'Chapter 4',
    date: '2026-09-04',
    startTime: '09:00',
    durationMinutes: 90,
    room: 'Room 310 - Chemistry Lab',
    objectives: [
      'Convert between grams, moles, and Avogadro number of particles',
      'Determine theoretical yield and identify limiting reagents in combustion reactions',
      'Calculate percent yield from empirical precipitation gravimetric data',
    ],
    summary:
      'Hands-on reaction between sodium bicarbonate and acetic acid. Students weighed reactant crucibles before and after gas evolution to demonstrate conservation of mass.',
    status: 'Completed',
    attachments: [
      {
        id: 'att-11',
        name: 'Limiting_Reactant_Problem_Set.pdf',
        url: '#',
        size: '780 KB',
        type: 'pdf',
      },
    ],
    reviewedByStudents: ['std-2'],
    createdAt: '2026-08-28T09:00:00Z',
    updatedAt: '2026-09-04T11:00:00Z',
  },
  {
    id: 'les-6',
    title: 'Object-Oriented Programming: Inheritance and Polymorphism',
    subject: 'Computer Science',
    class: 'Grade 11 - Advanced',
    teacherId: 'tch-6',
    teacherName: 'Mr. Alan Turing Jr.',
    unit: 'Unit 4: Advanced OOP Architecture',
    chapter: 'Chapter 7',
    date: '2026-09-10',
    startTime: '14:00',
    durationMinutes: 90,
    room: 'Lab 102 - Computer Lab',
    objectives: [
      'Construct hierarchical class models using abstract classes and interfaces',
      'Implement method overriding and dynamic method dispatch in TypeScript/Java',
      'Apply the Liskov Substitution Principle to avoid fragile inheritance antipatterns',
    ],
    summary:
      'We will build a modular geometric physics simulator where different shape classes inherit from a base RenderableEntity class.',
    status: 'Scheduled',
    attachments: [
      {
        id: 'att-12',
        name: 'OOP_Design_Patterns_Starter_Repo.zip',
        url: '#',
        size: '4.8 MB',
        type: 'doc',
      },
      {
        id: 'att-13',
        name: 'Polymorphism_UML_Architecture.png',
        url: '#',
        size: '640 KB',
        type: 'doc',
      },
    ],
    reviewedByStudents: [],
    createdAt: '2026-09-02T13:00:00Z',
    updatedAt: '2026-09-02T13:00:00Z',
  },
]

export const lessonService = {
  // Get all lessons with optional filtering
  list: (params?: {
    class?: string
    subject?: string
    unit?: string
    status?: LessonStatus | 'All'
    search?: string
  }): Lesson[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LESSONS)
      let lessons: Lesson[] = stored ? JSON.parse(stored) : INITIAL_LESSONS

      if (!stored) {
        localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(INITIAL_LESSONS))
      }

      if (!params) return lessons

      return lessons.filter((l) => {
        if (params.class && params.class !== 'All Classes' && l.class !== params.class) return false
        if (params.subject && params.subject !== 'All Subjects' && l.subject !== params.subject) return false
        if (params.unit && params.unit !== 'All Units' && l.unit !== params.unit) return false
        if (params.status && params.status !== 'All' && l.status !== params.status) return false
        if (params.search) {
          const q = params.search.toLowerCase()
          const matchTitle = l.title.toLowerCase().includes(q)
          const matchSubject = l.subject.toLowerCase().includes(q)
          const matchUnit = l.unit.toLowerCase().includes(q)
          const matchSummary = l.summary.toLowerCase().includes(q)
          const matchTeacher = l.teacherName.toLowerCase().includes(q)
          if (!matchTitle && !matchSubject && !matchUnit && !matchSummary && !matchTeacher) {
            return false
          }
        }
        return true
      })
    } catch {
      return INITIAL_LESSONS
    }
  },

  getById: (id: string): Lesson | null => {
    const lessons = lessonService.list()
    return lessons.find((l) => l.id === id) || null
  },

  create: (payload: CreateLessonPayload): Lesson => {
    const lessons = lessonService.list()
    const newLesson: Lesson = {
      ...payload,
      id: `les-${Date.now()}`,
      attachments: payload.attachments || [],
      reviewedByStudents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [newLesson, ...lessons]
    localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(updated))
    return newLesson
  },

  update: (id: string, updates: Partial<CreateLessonPayload>): Lesson | null => {
    const lessons = lessonService.list()
    const index = lessons.findIndex((l) => l.id === id)
    if (index === -1) return null

    const updatedLesson: Lesson = {
      ...lessons[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    lessons[index] = updatedLesson
    localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(lessons))
    return updatedLesson
  },

  delete: (id: string): boolean => {
    const lessons = lessonService.list()
    const filtered = lessons.filter((l) => l.id !== id)
    if (filtered.length === lessons.length) return false

    localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(filtered))
    return true
  },

  updateStatus: (id: string, status: LessonStatus): Lesson | null => {
    return lessonService.update(id, { status })
  },

  // Student toggle review status
  toggleStudentReviewed: (lessonId: string, studentId: string): boolean => {
    const lessons = lessonService.list()
    const lesson = lessons.find((l) => l.id === lessonId)
    if (!lesson) return false

    const hasReviewed = lesson.reviewedByStudents.includes(studentId)
    if (hasReviewed) {
      lesson.reviewedByStudents = lesson.reviewedByStudents.filter((id) => id !== studentId)
    } else {
      lesson.reviewedByStudents.push(studentId)
    }
    lesson.updatedAt = new Date().toISOString()

    localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(lessons))
    return !hasReviewed
  },

  // Get distinct classes and subjects
  getFilterOptions: () => {
    const lessons = lessonService.list()
    const classes = Array.from(new Set(lessons.map((l) => l.class))).sort()
    const subjects = Array.from(new Set(lessons.map((l) => l.subject))).sort()
    const units = Array.from(new Set(lessons.map((l) => l.unit))).sort()
    return { classes, subjects, units }
  },

  // Reset demo data
  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(INITIAL_LESSONS))
    return INITIAL_LESSONS
  },
}
