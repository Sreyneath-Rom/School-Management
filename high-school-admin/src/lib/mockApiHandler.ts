import { mockLogin, mockUsers } from '@/data/mockUsers'
import { mockUserDirectory } from '@/data/mockUserDirectory'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'
import type { PermissionAction, PermissionDef, RoleDef } from '@/types/roles'
import type { LanguageRecord } from '@/services/languagesService'
import type { SchoolModel } from '@/services/schoolService'
import type { SubjectItem } from '@/services/subjectService'
import type { ScheduleSlot } from '@/services/scheduleService'
import type { SystemUser } from '@/types/user'
import type { DashboardStats, AttendanceSummary } from '@/services/dashboardService'
import { BUILT_IN_LANGUAGES } from '@/i18n/useTranslations'
import { STRINGS } from '@/i18n/strings'

const MODULE_IDS = [
  'dashboard',
  'school',
  'academicYears',
  'terms',
  'users',
  'teachers',
  'students',
  'roles',
  'grades',
  'gradeLevels',
  'classes',
  'subjects',
  'rooms',
  'schedules',
  'attendance',
  'reports',
] as const

const ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete']

export const initialPermissions: PermissionDef[] = []
let pIndex = 1
MODULE_IDS.forEach((mod) => {
  ACTIONS.forEach((act) => {
    initialPermissions.push({
      id: `perm-${pIndex++}`,
      key: `${mod}.${act}`,
      moduleId: mod,
      action: act,
    })
  })
})

export const initialRoles: RoleDef[] = [
  {
    id: 'role-1',
    name: 'Super Admin',
    label: 'Super Admin',
    initial: 'SA',
    isSystem: true,
    permissionIds: initialPermissions.map((p) => p.id),
  },
  {
    id: 'role-2',
    name: 'Teacher',
    label: 'Teacher',
    initial: 'T',
    isSystem: true,
    permissionIds: initialPermissions
      .filter(
        (p) =>
          p.moduleId === 'dashboard' ||
          p.moduleId === 'attendance' ||
          p.moduleId === 'grades' ||
          (p.moduleId === 'classes' && p.action === 'view') ||
          (p.moduleId === 'subjects' && p.action === 'view') ||
          (p.moduleId === 'schedules' && p.action === 'view')
      )
      .map((p) => p.id),
  },
  {
    id: 'role-3',
    name: 'Student',
    label: 'Student',
    initial: 'S',
    isSystem: true,
    permissionIds: initialPermissions
      .filter(
        (p) =>
          (p.moduleId === 'dashboard' ||
            p.moduleId === 'attendance' ||
            p.moduleId === 'grades' ||
            p.moduleId === 'schedules') &&
          p.action === 'view'
      )
      .map((p) => p.id),
  },
  {
    id: 'role-4',
    name: 'Parent',
    label: 'Parent',
    initial: 'P',
    isSystem: true,
    permissionIds: initialPermissions
      .filter(
        (p) =>
          (p.moduleId === 'dashboard' ||
            p.moduleId === 'attendance' ||
            p.moduleId === 'grades' ||
            p.moduleId === 'reports') &&
          p.action === 'view'
      )
      .map((p) => p.id),
  },
  {
    id: 'role-5',
    name: 'Academic Coordinator',
    label: 'Academic Coordinator',
    initial: 'AC',
    isSystem: false,
    permissionIds: initialPermissions
      .filter(
        (p) =>
          p.moduleId === 'classes' ||
          p.moduleId === 'subjects' ||
          p.moduleId === 'schedules' ||
          p.moduleId === 'grades'
      )
      .map((p) => p.id),
  },
]

let languagesStore: LanguageRecord[] = BUILT_IN_LANGUAGES.map((lang, idx) => ({
  id: `lang-${idx + 1}`,
  code: lang.code,
  name: lang.name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const translationsStore: Record<string, Record<string, string>> = {}
BUILT_IN_LANGUAGES.forEach((lang) => {
  translationsStore[lang.code] = {}
  STRINGS.forEach((entry) => {
    const val = entry[lang.code as keyof typeof entry]
    if (val && typeof val === 'string') {
      translationsStore[lang.code][entry.key] = val
    } else {
      translationsStore[lang.code][entry.key] = entry.en
    }
  })
})

let schoolStore: SchoolModel = {
  id: 'school-1',
  name: 'Oakridge International High School',
  logoUrl: null,
  address: '100 Academic Way, Metro City',
  phone: '+1 (555) 019-2834',
  email: 'admin@oakridge.edu',
  academicYear: '2025 - 2026',
  settings: {
    schoolCode: 'OIS-2026',
    academicTerm: 'Semester 1',
    motto: 'Excellence in Education & Character',
    description: 'Premier secondary academy committed to academic distinction and holistic student growth.',
    website: 'https://oakridge.edu',
    language: 'en',
    timeZone: 'America/New_York',
    dateFormat: 'YYYY-MM-DD',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

let rolesStore: RoleDef[] = [...initialRoles]

let subjectsStore: SubjectItem[] = [
  {
    id: 's1',
    name: 'Advanced Biology',
    code: 'SCI-301',
    department: 'Science',
    category: 'Core',
    credits: 4,
    weeklyHours: 5,
    gradeLevel: 'Grade 10 - 12',
    description: 'Comprehensive study of molecular genetics, cellular biology, and evolutionary ecology.',
    color: 'sky',
    teachers: [
      { id: 't1', name: 'Dr. John Whitfield', label: 'JW', color: 'bg-emerald-500' },
      { id: 't2', name: 'Dr. Alice Liu', label: 'AL', color: 'bg-violet-500' },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 's2',
    name: 'Calculus BC',
    code: 'MTH-402',
    department: 'Mathematics',
    category: 'Core',
    credits: 4,
    weeklyHours: 5,
    gradeLevel: 'Grade 11 - 12',
    description: 'Advanced derivatives, integral calculus, infinite series, and vector-valued differential equations.',
    color: 'amber',
    teachers: [
      { id: 't3', name: 'Prof. Marcus Kane', label: 'MK', color: 'bg-violet-500' },
      { id: 't4', name: 'Rachel Ross', label: 'RR', color: 'bg-teal-500' },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 's3',
    name: 'Digital Illustration & UI',
    code: 'ART-105',
    department: 'Fine Arts',
    category: 'Elective',
    credits: 3,
    weeklyHours: 4,
    gradeLevel: 'Grade 9 - 12',
    description: 'Vector artwork, digital composition, typography, and contemporary product design paradigms.',
    color: 'emerald',
    teachers: [{ id: 't5', name: 'Liam Walker', label: 'LW', color: 'bg-amber-500' }],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 's4',
    name: 'Modern World History',
    code: 'HUM-201',
    department: 'Humanities',
    category: 'Core',
    credits: 3,
    weeklyHours: 4,
    gradeLevel: 'Grade 10',
    description: 'Exploration of geopolitical movements, revolutions, and world treaties from the 19th through 21st centuries.',
    color: 'violet',
    teachers: [
      { id: 't6', name: 'Sarah Parker', label: 'SP', color: 'bg-amber-500' },
      { id: 't7', name: 'David Miller', label: 'DM', color: 'bg-violet-500' },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 's5',
    name: 'AP Computer Science A',
    code: 'CS-501',
    department: 'Technology',
    category: 'AP / Advanced',
    credits: 4,
    weeklyHours: 5,
    gradeLevel: 'Grade 11 - 12',
    description: 'Object-oriented programming, data structures, algorithm design, and software verification in Java and TypeScript.',
    color: 'indigo',
    teachers: [{ id: 't8', name: 'Elena Vance', label: 'EV', color: 'bg-indigo-500' }],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 's6',
    name: 'Literature & Composition II',
    code: 'ENG-202',
    department: 'Languages',
    category: 'Core',
    credits: 3,
    weeklyHours: 4,
    gradeLevel: 'Grade 10',
    description: 'Critical analysis of world literature, rhetorical essays, and persuasive composition.',
    color: 'rose',
    teachers: [{ id: 't9', name: 'Claire Bennett', label: 'CB', color: 'bg-rose-500' }],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
]

let schedulesStore: ScheduleSlot[] = [
  {
    id: 'sch-1',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's1',
    subjectName: 'Advanced Biology',
    teacherId: 't1',
    teacherName: 'Dr. John Whitfield',
    dayOfWeek: 0,
    startTime: '08:00',
    endTime: '09:30',
    room: 'Lab 302',
    colorTheme: 'sky',
  },
  {
    id: 'sch-2',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's2',
    subjectName: 'Calculus BC',
    teacherId: 't3',
    teacherName: 'Prof. Marcus Kane',
    dayOfWeek: 0,
    startTime: '10:00',
    endTime: '11:30',
    room: 'Room 204',
    colorTheme: 'amber',
  },
  {
    id: 'sch-3',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's4',
    subjectName: 'Modern World History',
    teacherId: 't6',
    teacherName: 'Sarah Parker',
    dayOfWeek: 0,
    startTime: '13:00',
    endTime: '14:30',
    room: 'Room 101',
    colorTheme: 'violet',
  },
  {
    id: 'sch-4',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's2',
    subjectName: 'Calculus BC',
    teacherId: 't3',
    teacherName: 'Prof. Marcus Kane',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '09:30',
    room: 'Lab 12',
    colorTheme: 'amber',
  },
  {
    id: 'sch-5',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's6',
    subjectName: 'Literature II',
    teacherId: 't9',
    teacherName: 'Claire Bennett',
    dayOfWeek: 1,
    startTime: '10:00',
    endTime: '11:30',
    room: 'Room 405',
    colorTheme: 'rose',
  },
  {
    id: 'sch-6',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's5',
    subjectName: 'AP Computer Science',
    teacherId: 't8',
    teacherName: 'Elena Vance',
    dayOfWeek: 1,
    startTime: '13:00',
    endTime: '14:30',
    room: 'Tech Lab 01',
    colorTheme: 'indigo',
  },
  {
    id: 'sch-7',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's1',
    subjectName: 'Advanced Biology',
    teacherId: 't1',
    teacherName: 'Dr. John Whitfield',
    dayOfWeek: 2,
    startTime: '08:00',
    endTime: '09:30',
    room: 'Lab 302',
    colorTheme: 'sky',
  },
  {
    id: 'sch-8',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's3',
    subjectName: 'Digital Illustration',
    teacherId: 't5',
    teacherName: 'Liam Walker',
    dayOfWeek: 2,
    startTime: '10:00',
    endTime: '11:30',
    room: 'Studio A',
    colorTheme: 'emerald',
  },
  {
    id: 'sch-9',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's4',
    subjectName: 'Modern World History',
    teacherId: 't6',
    teacherName: 'Sarah Parker',
    dayOfWeek: 3,
    startTime: '08:00',
    endTime: '09:30',
    room: 'Room 101',
    colorTheme: 'violet',
  },
  {
    id: 'sch-10',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's2',
    subjectName: 'Calculus BC',
    teacherId: 't3',
    teacherName: 'Prof. Marcus Kane',
    dayOfWeek: 3,
    startTime: '10:00',
    endTime: '11:30',
    room: 'Room 204',
    colorTheme: 'amber',
  },
  {
    id: 'sch-11',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's5',
    subjectName: 'AP Computer Science',
    teacherId: 't8',
    teacherName: 'Elena Vance',
    dayOfWeek: 4,
    startTime: '08:00',
    endTime: '09:30',
    room: 'Tech Lab 01',
    colorTheme: 'indigo',
  },
  {
    id: 'sch-12',
    classId: 'cls-10a',
    className: 'Grade 10-A',
    subjectId: 's1',
    subjectName: 'Advanced Biology',
    teacherId: 't1',
    teacherName: 'Dr. John Whitfield',
    dayOfWeek: 4,
    startTime: '10:00',
    endTime: '11:30',
    room: 'Lab 302',
    colorTheme: 'sky',
  },
]

let usersStore: SystemUser[] = [...mockUserDirectory]

export interface MockAttendanceRecord {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  studentAvatar: string
  grade: string
  class: string
  date: string // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  checkIn?: string | null
  checkOut?: string | null
  note?: string | null
  createdAt: string
  updatedAt: string
}

// Generate realistic initial attendance records for mock students across recent dates
const getInitialAttendance = (): MockAttendanceRecord[] => {
  const students = mockUserDirectory.filter((u) => u.role === 'student' || u.role === 'mazer')
  const records: MockAttendanceRecord[] = []
  
  // Dates for current week
  const today = new Date()
  for (let offset = -7; offset <= 2; offset++) {
    const d = new Date()
    d.setDate(today.getDate() + offset)
    const dateStr = d.toISOString().split('T')[0]
    const dayOfWeek = d.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue // skip weekends

    students.forEach((stu, idx) => {
      let status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' = 'PRESENT'
      let checkIn: string | null = '07:55 AM'
      let checkOut: string | null = '03:30 PM'
      let note: string | null = null

      if ((idx + offset) % 11 === 0) {
        status = 'ABSENT'
        checkIn = null
        checkOut = null
        note = 'Sick leave reported by guardian'
      } else if ((idx + offset) % 7 === 0) {
        status = 'LATE'
        checkIn = '08:24 AM'
        note = 'Traffic delay on transit bus route 4'
      } else if ((idx + offset) % 13 === 0) {
        status = 'EXCUSED'
        checkIn = null
        checkOut = null
        note = 'Official Math Olympiad tournament'
      }

      records.push({
        id: `att-${stu.id}-${dateStr}`,
        studentId: stu.id,
        studentName: `${stu.firstName} ${stu.lastName}`,
        studentCode: (stu as any).studentId || `STU-${stu.id.replace(/\D/g, '')}`,
        studentAvatar: `${stu.firstName[0]}${stu.lastName[0]}`,
        grade: (stu as any).grade || 'Grade 10',
        class: (stu as any).class || 'Grade 10 - A',
        date: dateStr,
        status,
        checkIn,
        checkOut,
        note,
        createdAt: d.toISOString(),
        updatedAt: d.toISOString(),
      })
    })
  }
  return records
}

let attendanceStore: MockAttendanceRecord[] = getInitialAttendance()

// ==========================================
// MASTER DATA STORES FOR SPLIT CRUD USE CASES
// ==========================================
export interface MockClassItem {
  id: string
  name: string
  gradeLevel: string
  section: string
  room: string
  classTeacher: string
  studentCount: number
  maxCapacity: number
  subjectsCount: number
  schedulePeriod?: string
  status?: 'Active' | 'Archived'
  description?: string
  createdAt?: string
  updatedAt?: string
}

let classesStore: MockClassItem[] = [
  {
    id: 'cls-1',
    name: 'Grade 10-A',
    gradeLevel: 'Grade 10',
    section: 'A',
    room: 'Room 101',
    classTeacher: 'Dr. John Whitfield',
    studentCount: 32,
    maxCapacity: 35,
    subjectsCount: 7,
    schedulePeriod: '08:00 - 15:30',
    status: 'Active',
    description: 'General high school academic section emphasizing core mathematics, natural science, and humanities.',
  },
  {
    id: 'cls-2',
    name: 'Grade 10-B',
    gradeLevel: 'Grade 10',
    section: 'B',
    room: 'Room 102',
    classTeacher: 'Sarah Parker',
    studentCount: 30,
    maxCapacity: 35,
    subjectsCount: 7,
    schedulePeriod: '08:00 - 15:30',
    status: 'Active',
    description: 'Standard sophomore track with enriched literature and world history coursework.',
  },
  {
    id: 'cls-3',
    name: 'Grade 11-A (Advanced STEM)',
    gradeLevel: 'Grade 11',
    section: 'A',
    room: 'Lab 201',
    classTeacher: 'Prof. Marcus Kane',
    studentCount: 28,
    maxCapacity: 30,
    subjectsCount: 8,
    schedulePeriod: '08:00 - 16:00',
    status: 'Active',
    description: 'Advanced placement preparatory cohort specializing in calculus, biotechnology, and computer science.',
  },
  {
    id: 'cls-4',
    name: 'Grade 11-B (Humanities)',
    gradeLevel: 'Grade 11',
    section: 'B',
    room: 'Room 203',
    classTeacher: 'Claire Bennett',
    studentCount: 29,
    maxCapacity: 32,
    subjectsCount: 7,
    schedulePeriod: '08:00 - 15:30',
    status: 'Active',
    description: 'Humanities and international relations cohort with rhetorical studies and modern linguistics.',
  },
  {
    id: 'cls-5',
    name: 'Grade 12-A (Honors & AP)',
    gradeLevel: 'Grade 12',
    section: 'A',
    room: 'Seminar 301',
    classTeacher: 'Elena Vance',
    studentCount: 26,
    maxCapacity: 30,
    subjectsCount: 8,
    schedulePeriod: '08:00 - 16:00',
    status: 'Active',
    description: 'Senior capstone section with university dual-enrollment credits and research seminar.',
  },
]

export interface MockAcademicYearItem {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'Active' | 'Upcoming' | 'Archived'
  termsCount: number
  classesCount: number
  studentsCount: number
  isCurrent: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

let academicYearsStore: MockAcademicYearItem[] = [
  {
    id: 'ay-1',
    name: '2025 - 2026',
    startDate: '2025-08-15',
    endDate: '2026-06-20',
    status: 'Active',
    termsCount: 3,
    classesCount: 48,
    studentsCount: 1284,
    isCurrent: true,
    description: 'Standard academic operational calendar for primary and secondary grade tracks.',
  },
  {
    id: 'ay-2',
    name: '2026 - 2027',
    startDate: '2026-08-20',
    endDate: '2027-06-25',
    status: 'Upcoming',
    termsCount: 3,
    classesCount: 50,
    studentsCount: 0,
    isCurrent: false,
    description: 'Next planned academic school session awaiting cohort rollover and registration.',
  },
  {
    id: 'ay-3',
    name: '2024 - 2025',
    startDate: '2024-08-18',
    endDate: '2025-06-18',
    status: 'Archived',
    termsCount: 3,
    classesCount: 46,
    studentsCount: 1210,
    isCurrent: false,
    description: 'Historical archive of concluded school session, marks, and official diploma issuance.',
  },
]

export interface MockTermItem {
  id: string
  name: string
  academicYear: string
  startDate: string
  endDate: string
  gradingDeadline: string
  status: 'Active' | 'Completed' | 'Upcoming'
  examCount: number
  weightPercentage: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

let termsStore: MockTermItem[] = [
  {
    id: 'term-1',
    name: 'Term 1 (Fall Semester)',
    academicYear: '2025 - 2026',
    startDate: '2025-08-15',
    endDate: '2025-11-20',
    gradingDeadline: '2025-11-28',
    status: 'Completed',
    examCount: 4,
    weightPercentage: 30,
    description: 'Introductory term focusing on baseline curriculum and midterm examinations.',
  },
  {
    id: 'term-2',
    name: 'Term 2 (Winter Trimester)',
    academicYear: '2025 - 2026',
    startDate: '2025-12-01',
    endDate: '2026-03-15',
    gradingDeadline: '2026-03-25',
    status: 'Active',
    examCount: 6,
    weightPercentage: 35,
    description: 'Core evaluation cycle including practical laboratory assessments and science fairs.',
  },
  {
    id: 'term-3',
    name: 'Term 3 (Spring Trimester)',
    academicYear: '2025 - 2026',
    startDate: '2026-03-20',
    endDate: '2026-06-20',
    gradingDeadline: '2026-06-28',
    status: 'Upcoming',
    examCount: 5,
    weightPercentage: 35,
    description: 'Concluding term with cumulative final evaluations, honors thesis, and commencement.',
  },
]

export interface MockGradeLevelItem {
  id: string
  name: string
  numericLevel: number
  division: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'High School'
  minAge: number
  maxAge: number
  requiredCredits: number
  description?: string
  classesCount: number
  studentsCount: number
  status: 'Active' | 'Archived'
  createdAt?: string
  updatedAt?: string
}

let gradeLevelsStore: MockGradeLevelItem[] = [
  {
    id: 'gl-9',
    name: 'Grade 9',
    numericLevel: 9,
    division: 'Freshman',
    minAge: 14,
    maxAge: 15,
    requiredCredits: 20,
    classesCount: 12,
    studentsCount: 310,
    status: 'Active',
    description: 'First year of secondary education focusing on fundamental literacies and science labs.',
  },
  {
    id: 'gl-10',
    name: 'Grade 10',
    numericLevel: 10,
    division: 'Sophomore',
    minAge: 15,
    maxAge: 16,
    requiredCredits: 40,
    classesCount: 12,
    studentsCount: 325,
    status: 'Active',
    description: 'Sophomore level with core STEM sequences and elective exploratory paths.',
  },
  {
    id: 'gl-11',
    name: 'Grade 11',
    numericLevel: 11,
    division: 'Junior',
    minAge: 16,
    maxAge: 17,
    requiredCredits: 60,
    classesCount: 12,
    studentsCount: 330,
    status: 'Active',
    description: 'Junior year featuring Advanced Placement (AP) electives and standardized test prep.',
  },
  {
    id: 'gl-12',
    name: 'Grade 12',
    numericLevel: 12,
    division: 'Senior',
    minAge: 17,
    maxAge: 19,
    requiredCredits: 80,
    classesCount: 12,
    studentsCount: 319,
    status: 'Active',
    description: 'Graduating senior class completing graduation capstones, internships, and university applications.',
  },
]

export interface MockRoomItem {
  id: string
  name: string
  code: string
  building: string
  floor: string
  type: 'Classroom' | 'Science Lab' | 'Computer Lab' | 'Auditorium' | 'Library Wing'
  capacity: number
  amenities: string[]
  status: 'Available' | 'Occupied' | 'Maintenance'
  currentClass?: string
  createdAt?: string
  updatedAt?: string
}

let roomsStore: MockRoomItem[] = [
  {
    id: 'rm-1',
    name: 'Room 101 (Humanities)',
    code: 'R-101',
    building: 'Main Academic Hall',
    floor: '1st Floor',
    type: 'Classroom',
    capacity: 35,
    amenities: ['Interactive Smartboard', 'AC', 'Projector'],
    status: 'Occupied',
    currentClass: 'Grade 10-A (History)',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'rm-2',
    name: 'Biology Lab 302',
    code: 'LAB-BIO',
    building: 'Science Wing',
    floor: '3rd Floor',
    type: 'Science Lab',
    capacity: 28,
    amenities: ['Microscopes', 'Fume Hood', 'Chemical Sinks', 'Projector'],
    status: 'Available',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'rm-3',
    name: 'Computer Lab Alpha',
    code: 'LAB-CS1',
    building: 'Technology Center',
    floor: '2nd Floor',
    type: 'Computer Lab',
    capacity: 32,
    amenities: ['32 iMac Workstations', 'Gigabit LAN', 'Dual Projectors'],
    status: 'Occupied',
    currentClass: 'Grade 11-A (AP Computer Science)',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'rm-4',
    name: 'Grand Auditorium',
    code: 'AUD-MAIN',
    building: 'Arts & Performing Complex',
    floor: 'Ground Floor',
    type: 'Auditorium',
    capacity: 450,
    amenities: ['Pro Stage Lighting', 'Surround Sound', 'Dual 4K Projectors'],
    status: 'Available',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'rm-5',
    name: 'Chemistry Lab 301',
    code: 'LAB-CHEM',
    building: 'Science Wing',
    floor: '3rd Floor',
    type: 'Science Lab',
    capacity: 30,
    amenities: ['Gas Valves', 'Emergency Shower', 'Fume Hoods'],
    status: 'Maintenance',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'rm-6',
    name: 'Room 204 (Mathematics)',
    code: 'R-204',
    building: 'Main Academic Hall',
    floor: '2nd Floor',
    type: 'Classroom',
    capacity: 35,
    amenities: ['Interactive Smartboard', 'AC', 'Math Graph Boards'],
    status: 'Available',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
]

export interface MockTeacherItem {
  id: string
  teacherId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position?: string
  qualification: string
  specialization?: string
  experienceYears?: number
  hireDate: string
  weeklyTeachingHours?: number
  status: 'active' | 'on_leave' | 'inactive'
  subjects: string[]
  assignedClasses: string[]
  avatarUrl?: string
  performanceRating?: number
  createdAt?: string
  updatedAt?: string
}

let teachersStore: MockTeacherItem[] = [
  {
    id: 't1',
    teacherId: 'TCH-1001',
    firstName: 'John',
    lastName: 'Whitfield',
    email: 'john.whitfield@oakridge.edu',
    phone: '+1 (555) 019-2834',
    department: 'Science',
    position: 'Department Head',
    qualification: 'Ph.D. in Molecular Biology',
    specialization: 'Cellular Biochemistry & Genetics',
    experienceYears: 12,
    hireDate: '2019-08-15',
    weeklyTeachingHours: 18,
    status: 'active',
    subjects: ['Advanced Biology', 'AP Biology Seminar'],
    assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 12-A'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
    performanceRating: 4.9,
  },
  {
    id: 't3',
    teacherId: 'TCH-1002',
    firstName: 'Marcus',
    lastName: 'Kane',
    email: 'marcus.kane@oakridge.edu',
    phone: '+1 (555) 019-9943',
    department: 'Mathematics',
    position: 'Senior Lecturer',
    qualification: 'M.Sc. in Applied Mathematics',
    specialization: 'Calculus, Differential Equations & Analysis',
    experienceYears: 9,
    hireDate: '2020-01-10',
    weeklyTeachingHours: 20,
    status: 'active',
    subjects: ['Calculus BC', 'Linear Algebra'],
    assignedClasses: ['Grade 10-A', 'Grade 11-A (Advanced STEM)'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    performanceRating: 4.8,
  },
  {
    id: 't6',
    teacherId: 'TCH-1003',
    firstName: 'Sarah',
    lastName: 'Parker',
    email: 'sarah.parker@oakridge.edu',
    phone: '+1 (555) 019-8765',
    department: 'Humanities',
    position: 'Faculty Member',
    qualification: 'M.A. in Modern History',
    specialization: '20th Century Geopolitics',
    experienceYears: 7,
    hireDate: '2021-08-20',
    weeklyTeachingHours: 16,
    status: 'active',
    subjects: ['Modern World History'],
    assignedClasses: ['Grade 10-A', 'Grade 10-B'],
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
    performanceRating: 4.7,
  },
  {
    id: 't8',
    teacherId: 'TCH-1004',
    firstName: 'Elena',
    lastName: 'Vance',
    email: 'elena.vance@oakridge.edu',
    phone: '+1 (555) 019-4411',
    department: 'Technology',
    position: 'Lead Instructor',
    qualification: 'M.S. in Computer Science',
    specialization: 'Software Architecture & Algorithms',
    experienceYears: 6,
    hireDate: '2022-01-15',
    weeklyTeachingHours: 17,
    status: 'active',
    subjects: ['AP Computer Science A', 'Web Engineering'],
    assignedClasses: ['Grade 10-A', 'Grade 12-A (Honors & AP)'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop',
    performanceRating: 4.95,
  },
  {
    id: 't9',
    teacherId: 'TCH-1005',
    firstName: 'Claire',
    lastName: 'Bennett',
    email: 'claire.bennett@oakridge.edu',
    phone: '+1 (555) 019-3322',
    department: 'Languages',
    position: 'Faculty Member',
    qualification: 'M.A. in Comparative Literature',
    specialization: 'Rhetoric & World Literature',
    experienceYears: 8,
    hireDate: '2020-08-15',
    weeklyTeachingHours: 18,
    status: 'active',
    subjects: ['Literature & Composition II'],
    assignedClasses: ['Grade 10-A', 'Grade 11-B (Humanities)'],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop',
    performanceRating: 4.85,
  },
]


export const mockApiHandler = {
  handle: async (
    path: string,
    method: string,
    body?: any
  ): Promise<{ success: boolean; data?: any; message?: string } | null> => {
    // Subtle realistic network latency simulation for mock API
    await new Promise((resolve) => setTimeout(resolve, 150))
    const cleanPath = path.replace(/^\/api\/v\d+/, '').replace(/\/$/, '') || '/'

    // Auth endpoints
    if (cleanPath === '/auth/login' && method === 'POST') {
      const { email, password } = body || {}
      const matched = mockLogin(email || '', password || '')
      if (matched) {
        return {
          success: true,
          data: {
            accessToken: `mock-token-${matched.id}-${Date.now()}`,
            refreshToken: `mock-refresh-${matched.id}-${Date.now()}`,
            user: {
              id: matched.id,
              email: matched.email,
              firstName: matched.firstName,
              lastName: matched.name.replace(matched.firstName, '').trim() || matched.role,
              role: matched.role,
            },
          },
        }
      }
      return { success: false, message: 'Invalid email or password' }
    }

    if (cleanPath === '/auth/logout' && method === 'POST') {
      return { success: true, data: null }
    }

    if (cleanPath === '/auth/refresh-token' && method === 'POST') {
      return {
        success: true,
        data: {
          accessToken: `mock-token-${Date.now()}`,
          refreshToken: `mock-refresh-${Date.now()}`,
        },
      }
    }

    if (cleanPath === '/auth/me' && method === 'GET') {
      let u = mockUsers[0]
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
          if (stored) {
            const parsed = JSON.parse(stored)
            const matched = mockUsers.find((item) => item.id === parsed.id || item.email === parsed.email)
            if (matched) {
              u = matched
            } else if (parsed && parsed.email && parsed.role) {
              return {
                success: true,
                data: {
                  id: parsed.id,
                  email: parsed.email,
                  firstName: parsed.firstName,
                  lastName: parsed.lastName,
                  role: parsed.role,
                },
              }
            }
          }
        }
      } catch {
        // fallback to default
      }
      return {
        success: true,
        data: {
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.name.replace(u.firstName, '').trim(),
          role: u.role,
        },
      }
    }

    // ==========================================
    // SUBJECTS ENDPOINTS
    // ==========================================
    if (cleanPath === '/subjects' && method === 'GET') {
      return { success: true, data: [...subjectsStore] }
    }

    if (cleanPath === '/subjects' && method === 'POST') {
      const newSubject: SubjectItem = {
        id: `s-${Date.now()}`,
        name: body?.name || 'New Subject',
        code: body?.code || `SUB-${Math.floor(Math.random() * 900 + 100)}`,
        department: body?.department || 'General',
        category: body?.category || 'Core',
        credits: Number(body?.credits) || 3,
        weeklyHours: Number(body?.weeklyHours) || 4,
        gradeLevel: body?.gradeLevel || 'Grade 10',
        description: body?.description || '',
        color: body?.color || 'sky',
        teachers: (body?.teachers || []).map((tId: string, idx: number) => ({
          id: tId || `t-${idx}`,
          name: tId,
          label: (tId.substring(0, 2) || 'TC').toUpperCase(),
          color: 'bg-brand-500',
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      subjectsStore.unshift(newSubject)
      return { success: true, data: newSubject }
    }

    if (cleanPath.startsWith('/subjects/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const sub = subjectsStore.find((s) => s.id === id)
      if (sub) return { success: true, data: sub }
      return { success: false, message: 'Subject not found' }
    }

    if (cleanPath.startsWith('/subjects/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = subjectsStore.findIndex((s) => s.id === id)
      if (index !== -1) {
        subjectsStore[index] = {
          ...subjectsStore[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: subjectsStore[index] }
      }
      return { success: false, message: 'Subject not found' }
    }

    if (cleanPath.startsWith('/subjects/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      subjectsStore = subjectsStore.filter((s) => s.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // SCHEDULES ENDPOINTS
    // ==========================================
    if (cleanPath === '/schedules' && method === 'GET') {
      return { success: true, data: [...schedulesStore] }
    }

    if (cleanPath === '/schedules' && method === 'POST') {
      const dayOfWeek = Number(body?.dayOfWeek) ?? 0
      const startTime = body?.startTime || '08:00'
      const endTime = body?.endTime || '09:30'
      const teacherId = body?.teacherId || 't1'
      const room = body?.room || 'Room 101'

      // Check collision: same teacher or same room at overlapping time
      const hasConflict = schedulesStore.find(
        (s) =>
          s.dayOfWeek === dayOfWeek &&
          ((s.teacherId && s.teacherId === teacherId) || (s.room && s.room.toLowerCase() === room.toLowerCase())) &&
          !(endTime <= s.startTime || startTime >= s.endTime)
      )

      if (hasConflict) {
        const conflictReason = hasConflict.teacherId === teacherId ? `Teacher "${hasConflict.teacherName}"` : `Room "${hasConflict.room}"`
        return {
          success: false,
          message: `Schedule conflict: ${conflictReason} is already booked on day ${dayOfWeek} from ${hasConflict.startTime} to ${hasConflict.endTime} for "${hasConflict.subjectName}".`,
        }
      }

      const newSlot: ScheduleSlot = {
        id: `sch-${Date.now()}`,
        classId: body?.classId || 'cls-10a',
        className: body?.className || 'Grade 10-A',
        subjectId: body?.subjectId || 's1',
        subjectName: body?.subjectName || 'Subject',
        teacherId,
        teacherName: body?.teacherName || 'Faculty',
        dayOfWeek,
        startTime,
        endTime,
        room,
        colorTheme: body?.colorTheme || 'sky',
      }
      schedulesStore.push(newSlot)
      return { success: true, data: newSlot }
    }

    if (cleanPath.startsWith('/schedules/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const slot = schedulesStore.find((s) => s.id === id)
      if (slot) return { success: true, data: slot }
      return { success: false, message: 'Schedule slot not found' }
    }

    if (cleanPath.startsWith('/schedules/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = schedulesStore.findIndex((s) => s.id === id)
      if (index !== -1) {
        schedulesStore[index] = { ...schedulesStore[index], ...body }
        return { success: true, data: schedulesStore[index] }
      }
      return { success: false, message: 'Schedule slot not found' }
    }

    if (cleanPath.startsWith('/schedules/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      schedulesStore = schedulesStore.filter((s) => s.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // USERS ENDPOINTS
    // ==========================================
    if (cleanPath === '/users' && method === 'GET') {
      return { success: true, data: [...usersStore] }
    }

    // ==========================================
    // STUDENTS ENDPOINTS
    // ==========================================
    if (cleanPath === '/students' && method === 'GET') {
      const students = usersStore.filter((u) => u.role === 'student' || u.role === 'mazer')
      return { success: true, data: [...students] }
    }

    if (cleanPath === '/students' && method === 'POST') {
      const idNum = Math.floor(Math.random() * 9000 + 1000)
      const firstName = body?.firstName || 'Student'
      const lastName = body?.lastName || 'User'
      const newStudent: any = {
        id: `U-${idNum}`,
        username: body?.username || `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        email: body?.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@varinhs.edu`,
        status: body?.status || 'active',
        createdDate: new Date().toISOString().split('T')[0],
        firstName,
        lastName,
        gender: body?.gender || 'male',
        dateOfBirth: body?.dateOfBirth || '2009-05-15',
        phone: body?.phone || '+1 555-303-9999',
        address: body?.address || 'Springfield Campus',
        nationality: body?.nationality || 'American',
        role: body?.role || 'student',
        studentId: body?.studentId || `STU${idNum}`,
        grade: body?.grade || 'Grade 10',
        class: body?.class || 'Grade 10 - A',
        academicYear: body?.academicYear || '2025-2026',
        enrollmentDate: body?.enrollmentDate || new Date().toISOString().split('T')[0],
        fatherName: body?.fatherName || '',
        motherName: body?.motherName || '',
        guardianName: body?.guardianName || '',
        parentPhone: body?.parentPhone || '',
        parentEmail: body?.parentEmail || '',
        relationship: body?.relationship || 'father',
        gpa: body?.gpa || 3.8,
        attendanceRate: body?.attendanceRate || 96,
      }
      usersStore.unshift(newStudent)
      return { success: true, data: newStudent }
    }

    if (cleanPath.startsWith('/students/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const student = usersStore.find((u) => u.id === id && (u.role === 'student' || u.role === 'mazer'))
      if (student) return { success: true, data: student }
      return { success: false, message: 'Student not found' }
    }

    if (cleanPath.startsWith('/students/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = usersStore.findIndex((u) => u.id === id)
      if (index !== -1) {
        usersStore[index] = { ...usersStore[index], ...body }
        return { success: true, data: usersStore[index] }
      }
      return { success: false, message: 'Student not found' }
    }

    if (cleanPath.startsWith('/students/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      usersStore = usersStore.filter((u) => u.id !== id)
      return { success: true, data: null }
    }

    if (cleanPath === '/users' && method === 'POST') {
      const role = body?.role || 'student'
      const idNum = Math.floor(Math.random() * 9000 + 1000)
      const newUser: any = {
        id: `U-${idNum}`,
        username: body?.username || `${(body?.firstName || 'user').toLowerCase()}.${(body?.lastName || 'new').toLowerCase()}`,
        email: body?.email || `${(body?.firstName || 'user').toLowerCase()}@varinhs.edu`,
        status: body?.status || 'active',
        createdDate: new Date().toISOString().split('T')[0],
        firstName: body?.firstName || 'New',
        lastName: body?.lastName || 'User',
        gender: body?.gender || 'other',
        dateOfBirth: body?.dateOfBirth || '2008-01-01',
        phone: body?.phone || '+1 555-000-0000',
        address: body?.address || 'Springfield Campus',
        nationality: body?.nationality || 'American',
        role,
        ...(role === 'admin'
          ? { employeeId: body?.employeeId || `EMP-${idNum}`, department: body?.department || 'Administration', position: body?.position || 'Staff' }
          : role === 'teacher'
          ? { teacherId: body?.teacherId || `TCH-${idNum}`, department: body?.department || 'Science', qualification: body?.qualification || "Bachelor's", hireDate: new Date().toISOString().split('T')[0], experienceYears: 3, subjects: ['Biology'], assignedClasses: ['10-A'] }
          : { studentId: body?.studentId || `STU-${idNum}`, grade: body?.grade || 'Grade 10', class: body?.class || '10-A', academicYear: '2025-2026', enrollmentDate: new Date().toISOString().split('T')[0] }),
      }
      usersStore.unshift(newUser)
      return { success: true, data: newUser }
    }

    if (cleanPath.startsWith('/users/') && cleanPath.endsWith('/reset-password') && method === 'POST') {
      const id = cleanPath.split('/')[2]
      return { success: true, data: { success: true, message: `Password reset instructions sent for user ${id}` } }
    }

    if (cleanPath === '/users/bulk-status' && method === 'POST') {
      const { ids, status } = body || {}
      if (Array.isArray(ids)) {
        usersStore = usersStore.map((u) => (ids.includes(u.id) ? { ...u, status } : u))
        return { success: true, data: { updated: ids.length } }
      }
      return { success: false, message: 'Invalid bulk payload' }
    }

    if (cleanPath.startsWith('/users/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const user = usersStore.find((u) => u.id === id)
      if (user) return { success: true, data: user }
      return { success: false, message: 'User not found' }
    }

    if (cleanPath.startsWith('/users/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = usersStore.findIndex((u) => u.id === id)
      if (index !== -1) {
        usersStore[index] = { ...usersStore[index], ...body }
        return { success: true, data: usersStore[index] }
      }
      return { success: false, message: 'User not found' }
    }

    if (cleanPath.startsWith('/users/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      usersStore = usersStore.filter((u) => u.id !== id)
      return { success: true, data: null }
    }

    // Languages endpoints
    if (cleanPath === '/languages' && method === 'GET') {
      return { success: true, data: [...languagesStore] }
    }

    if (cleanPath === '/languages' && method === 'POST') {
      const newLang: LanguageRecord = {
        id: `lang-${Date.now()}`,
        code: (body?.code || '').toLowerCase(),
        name: body?.name || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      languagesStore.push(newLang)
      if (!translationsStore[newLang.code]) {
        translationsStore[newLang.code] = {}
      }
      return { success: true, data: newLang }
    }

    if (cleanPath.startsWith('/languages/') && method === 'PATCH') {
      const code = decodeURIComponent(cleanPath.split('/')[2] || '').toLowerCase()
      const lang = languagesStore.find((l) => l.code === code)
      if (lang) {
        if (body?.name) lang.name = body.name
        lang.updatedAt = new Date().toISOString()
        return { success: true, data: lang }
      }
      return { success: false, message: 'Language not found' }
    }

    if (cleanPath.startsWith('/languages/') && method === 'DELETE') {
      const code = decodeURIComponent(cleanPath.split('/')[2] || '').toLowerCase()
      languagesStore = languagesStore.filter((l) => l.code !== code)
      delete translationsStore[code]
      return { success: true, data: null }
    }

    // Translations endpoints
    if (cleanPath.startsWith('/translations/') && method === 'GET') {
      const parts = cleanPath.split('/')
      const code = decodeURIComponent(parts[2] || '').toLowerCase()
      const trans = translationsStore[code] || {}
      return { success: true, data: trans }
    }

    if (cleanPath.startsWith('/translations/') && cleanPath.endsWith('/auto-translate') && method === 'POST') {
      const parts = cleanPath.split('/')
      const code = decodeURIComponent(parts[2] || '').toLowerCase()
      const entries = body?.entries || []
      const translatedMap: Record<string, string> = {}
      entries.forEach((e: { key: string; text: string }) => {
        translatedMap[e.key] = e.text
      })
      translationsStore[code] = { ...(translationsStore[code] || {}), ...translatedMap }
      return { success: true, data: { translations: translatedMap, failedKeys: [] } }
    }

    if (cleanPath.startsWith('/translations/') && method === 'PATCH') {
      const parts = cleanPath.split('/')
      const code = decodeURIComponent(parts[2] || '').toLowerCase()
      const newMap = body?.translations || {}
      translationsStore[code] = { ...(translationsStore[code] || {}), ...newMap }
      return { success: true, data: translationsStore[code] }
    }

    if (cleanPath.startsWith('/translations/') && method === 'DELETE') {
      const parts = cleanPath.split('/')
      const code = decodeURIComponent(parts[2] || '').toLowerCase()
      const key = decodeURIComponent(parts[3] || '')
      if (translationsStore[code] && key) {
        delete translationsStore[code][key]
      }
      return { success: true, data: null }
    }

    // Schools endpoints
    if (cleanPath === '/schools' && method === 'GET') {
      return { success: true, data: schoolStore }
    }

    if (cleanPath === '/schools' && method === 'PATCH') {
      schoolStore = {
        ...schoolStore,
        ...body,
        settings: {
          ...schoolStore.settings,
          ...(body?.settings || {}),
        },
        updatedAt: new Date().toISOString(),
      }
      return { success: true, data: schoolStore }
    }

    if (cleanPath === '/schools/logo' && method === 'POST') {
      schoolStore.logoUrl = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&h=128&fit=crop'
      return { success: true, data: schoolStore }
    }

    if (cleanPath === '/schools/logo' && method === 'DELETE') {
      schoolStore.logoUrl = null
      return { success: true, data: schoolStore }
    }

    // Permissions & Roles endpoints
    if (cleanPath === '/permissions' && method === 'GET') {
      return { success: true, data: initialPermissions }
    }

    if (cleanPath === '/roles' && method === 'GET') {
      return { success: true, data: rolesStore }
    }

    if (cleanPath === '/roles' && method === 'POST') {
      const newRole: RoleDef = {
        id: `role-${Date.now()}`,
        name: body?.name || 'New Role',
        label: body?.label || body?.name || 'New Role',
        initial: (body?.name || 'NR').substring(0, 2).toUpperCase(),
        isSystem: false,
        permissionIds: body?.permissionIds || [],
      }
      rolesStore.push(newRole)
      return { success: true, data: newRole }
    }

    if (cleanPath.includes('/roles/') && cleanPath.endsWith('/permissions') && method === 'PATCH') {
      const roleId = cleanPath.split('/')[2]
      const role = rolesStore.find((r) => r.id === roleId)
      if (role) {
        role.permissionIds = body?.permissionIds || []
        return { success: true, data: role }
      }
      return { success: false, message: 'Role not found' }
    }

    if (cleanPath.startsWith('/roles/') && method === 'GET') {
      const roleId = cleanPath.split('/')[2]
      const role = rolesStore.find((r) => r.id === roleId)
      if (role) return { success: true, data: role }
      return { success: false, message: 'Role not found' }
    }

    if (cleanPath.startsWith('/roles/') && !cleanPath.endsWith('/permissions') && method === 'PATCH') {
      const roleId = cleanPath.split('/')[2]
      const index = rolesStore.findIndex((r) => r.id === roleId)
      if (index !== -1) {
        rolesStore[index] = {
          ...rolesStore[index],
          ...body,
          name: body?.name || rolesStore[index].name,
          label: body?.label || body?.name || rolesStore[index].label,
        }
        return { success: true, data: rolesStore[index] }
      }
      return { success: false, message: 'Role not found' }
    }

    if (cleanPath.startsWith('/roles/') && method === 'DELETE') {
      const roleId = cleanPath.split('/')[2]
      const role = rolesStore.find((r) => r.id === roleId)
      if (!role) return { success: false, message: 'Role not found' }
      if (role.isSystem) {
        return { success: false, message: 'System defined roles cannot be deleted for system safety' }
      }
      rolesStore = rolesStore.filter((r) => r.id !== roleId)
      return { success: true, data: null }
    }

    // ==========================================
    // CLASSES ENDPOINTS (/classes)
    // ==========================================
    if (cleanPath === '/classes' && method === 'GET') {
      return { success: true, data: [...classesStore] }
    }

    if (cleanPath === '/classes' && method === 'POST') {
      const newClass: MockClassItem = {
        id: `cls-${Date.now()}`,
        name: body?.name || 'Grade 10-C',
        gradeLevel: body?.gradeLevel || 'Grade 10',
        section: body?.section || 'C',
        room: body?.room || 'Room 105',
        classTeacher: body?.classTeacher || 'Staff Advisor',
        studentCount: 0,
        maxCapacity: Number(body?.maxCapacity) || 35,
        subjectsCount: Number(body?.subjectsCount) || 6,
        schedulePeriod: body?.schedulePeriod || '08:00 - 15:30',
        status: 'Active',
        description: body?.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      classesStore.unshift(newClass)
      return { success: true, data: newClass }
    }

    if (cleanPath.startsWith('/classes/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const cls = classesStore.find((c) => c.id === id)
      if (cls) return { success: true, data: cls }
      return { success: false, message: 'Class record not found' }
    }

    if (cleanPath.startsWith('/classes/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = classesStore.findIndex((c) => c.id === id)
      if (index !== -1) {
        classesStore[index] = {
          ...classesStore[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: classesStore[index] }
      }
      return { success: false, message: 'Class not found' }
    }

    if (cleanPath.startsWith('/classes/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      const cls = classesStore.find((c) => c.id === id)
      if (!cls) return { success: false, message: 'Class not found' }
      if (cls.studentCount > 0) {
        return {
          success: false,
          message: `Cannot delete class "${cls.name}" because it currently has ${cls.studentCount} active enrolled students. Reassign students first.`,
        }
      }
      classesStore = classesStore.filter((c) => c.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // ACADEMIC YEARS ENDPOINTS (/academic-years)
    // ==========================================
    if (cleanPath === '/academic-years' && method === 'GET') {
      return { success: true, data: [...academicYearsStore] }
    }

    if (cleanPath === '/academic-years' && method === 'POST') {
      const newYear: MockAcademicYearItem = {
        id: `ay-${Date.now()}`,
        name: body?.name || '2027 - 2028',
        startDate: body?.startDate || '2027-08-20',
        endDate: body?.endDate || '2028-06-25',
        status: 'Upcoming',
        termsCount: Number(body?.termsCount) || 3,
        classesCount: 0,
        studentsCount: 0,
        isCurrent: false,
        description: body?.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      academicYearsStore.unshift(newYear)
      return { success: true, data: newYear }
    }

    if (cleanPath.startsWith('/academic-years/') && cleanPath.endsWith('/set-active') && method === 'POST') {
      const id = cleanPath.split('/')[2]
      academicYearsStore = academicYearsStore.map((ay) => {
        if (ay.id === id) {
          schoolStore.academicYear = ay.name
          return { ...ay, isCurrent: true, status: 'Active' as const, updatedAt: new Date().toISOString() }
        }
        return { ...ay, isCurrent: false, status: ay.status === 'Active' ? ('Archived' as const) : ay.status }
      })
      const current = academicYearsStore.find((ay) => ay.id === id)
      return { success: true, data: current }
    }

    if (cleanPath.startsWith('/academic-years/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const year = academicYearsStore.find((y) => y.id === id)
      if (year) return { success: true, data: year }
      return { success: false, message: 'Academic Year not found' }
    }

    if (cleanPath.startsWith('/academic-years/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = academicYearsStore.findIndex((y) => y.id === id)
      if (index !== -1) {
        academicYearsStore[index] = {
          ...academicYearsStore[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        if (academicYearsStore[index].isCurrent) {
          schoolStore.academicYear = academicYearsStore[index].name
        }
        return { success: true, data: academicYearsStore[index] }
      }
      return { success: false, message: 'Academic Year not found' }
    }

    if (cleanPath.startsWith('/academic-years/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      const year = academicYearsStore.find((y) => y.id === id)
      if (!year) return { success: false, message: 'Academic Year not found' }
      if (year.isCurrent) {
        return {
          success: false,
          message: 'Cannot delete the active academic year. Please activate another academic year before deleting this session.',
        }
      }
      if (year.classesCount > 0 || year.studentsCount > 0) {
        return {
          success: false,
          message: `Cannot delete academic year "${year.name}" with dependent classes (${year.classesCount}) and students (${year.studentsCount}). Please archive it instead.`,
        }
      }
      academicYearsStore = academicYearsStore.filter((y) => y.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // TERMS ENDPOINTS (/terms)
    // ==========================================
    if (cleanPath === '/terms' && method === 'GET') {
      return { success: true, data: [...termsStore] }
    }

    if (cleanPath === '/terms' && method === 'POST') {
      const newTerm: MockTermItem = {
        id: `term-${Date.now()}`,
        name: body?.name || 'Term 4',
        academicYear: body?.academicYear || schoolStore.academicYear,
        startDate: body?.startDate || '2026-07-01',
        endDate: body?.endDate || '2026-08-15',
        gradingDeadline: body?.gradingDeadline || '2026-08-20',
        status: 'Upcoming',
        examCount: 2,
        weightPercentage: Number(body?.weightPercentage) || 20,
        description: body?.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      termsStore.push(newTerm)
      return { success: true, data: newTerm }
    }

    if (cleanPath.startsWith('/terms/') && cleanPath.endsWith('/set-active') && method === 'POST') {
      const id = cleanPath.split('/')[2]
      termsStore = termsStore.map((t) => {
        if (t.id === id) {
          return { ...t, status: 'Active' as const, updatedAt: new Date().toISOString() }
        }
        return { ...t, status: t.status === 'Active' ? ('Completed' as const) : t.status }
      })
      const current = termsStore.find((t) => t.id === id)
      return { success: true, data: current }
    }

    if (cleanPath.startsWith('/terms/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const term = termsStore.find((t) => t.id === id)
      if (term) return { success: true, data: term }
      return { success: false, message: 'Term not found' }
    }

    if (cleanPath.startsWith('/terms/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = termsStore.findIndex((t) => t.id === id)
      if (index !== -1) {
        termsStore[index] = {
          ...termsStore[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: termsStore[index] }
      }
      return { success: false, message: 'Term not found' }
    }

    if (cleanPath.startsWith('/terms/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      const term = termsStore.find((t) => t.id === id)
      if (!term) return { success: false, message: 'Term not found' }
      if (term.status === 'Active') {
        return {
          success: false,
          message: 'Cannot delete the active evaluation term. Please switch or complete the term before removal.',
        }
      }
      termsStore = termsStore.filter((t) => t.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // GRADE LEVELS ENDPOINTS (/grade-levels)
    // ==========================================
    if (cleanPath === '/grade-levels' && method === 'GET') {
      return { success: true, data: [...gradeLevelsStore] }
    }

    if (cleanPath === '/grade-levels' && method === 'POST') {
      const newGrade: MockGradeLevelItem = {
        id: `gl-${Date.now()}`,
        name: body?.name || 'Grade New',
        numericLevel: Number(body?.numericLevel) || 9,
        division: body?.division || 'High School',
        minAge: Number(body?.minAge) || 14,
        maxAge: Number(body?.maxAge) || 15,
        requiredCredits: Number(body?.requiredCredits) || 20,
        classesCount: 0,
        studentsCount: 0,
        status: 'Active',
        description: body?.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      gradeLevelsStore.push(newGrade)
      return { success: true, data: newGrade }
    }

    if (cleanPath.startsWith('/grade-levels/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const grade = gradeLevelsStore.find((g) => g.id === id)
      if (grade) return { success: true, data: grade }
      return { success: false, message: 'Grade Level not found' }
    }

    if (cleanPath.startsWith('/grade-levels/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = gradeLevelsStore.findIndex((g) => g.id === id)
      if (index !== -1) {
        gradeLevelsStore[index] = {
          ...gradeLevelsStore[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: gradeLevelsStore[index] }
      }
      return { success: false, message: 'Grade Level not found' }
    }

    if (cleanPath.startsWith('/grade-levels/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      const grade = gradeLevelsStore.find((g) => g.id === id)
      if (!grade) return { success: false, message: 'Grade Level not found' }
      if (grade.classesCount > 0) {
        return {
          success: false,
          message: `Cannot delete grade level "${grade.name}" because it has ${grade.classesCount} active classes assigned.`,
        }
      }
      gradeLevelsStore = gradeLevelsStore.filter((g) => g.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // ROOMS & FACILITIES ENDPOINTS (/rooms)
    // ==========================================
    if (cleanPath === '/rooms' && method === 'GET') {
      return { success: true, data: [...roomsStore] }
    }

    if (cleanPath === '/rooms' && method === 'POST') {
      const code = body?.code?.trim() || `RM-${Math.floor(Math.random() * 900 + 100)}`
      if (roomsStore.some((r) => r.code.toLowerCase() === code.toLowerCase())) {
        return {
          success: false,
          message: `A room with code "${code}" already exists in the campus database.`,
        }
      }
      const newRoom: MockRoomItem = {
        id: `rm-${Date.now()}`,
        name: body?.name || 'New Facility Room',
        code,
        building: body?.building || 'Main Academic Hall',
        floor: body?.floor || '1st Floor',
        type: body?.type || 'Classroom',
        capacity: Number(body?.capacity) || 30,
        amenities: Array.isArray(body?.amenities) ? body.amenities : [],
        status: body?.status || 'Available',
        currentClass: body?.currentClass,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      roomsStore.unshift(newRoom)
      return { success: true, data: newRoom }
    }

    if (cleanPath.startsWith('/rooms/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const room = roomsStore.find((r) => r.id === id || r.code === id)
      if (room) return { success: true, data: room }
      return { success: false, message: 'Facility room not found' }
    }

    if (cleanPath.startsWith('/rooms/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = roomsStore.findIndex((r) => r.id === id || r.code === id)
      if (index !== -1) {
        if (body?.code && body.code.toLowerCase() !== roomsStore[index].code.toLowerCase()) {
          const duplicate = roomsStore.some(
            (r, i) => i !== index && r.code.toLowerCase() === body.code.toLowerCase()
          )
          if (duplicate) {
            return {
              success: false,
              message: `Facility room code "${body.code}" is already in use by another room.`,
            }
          }
        }
        roomsStore[index] = {
          ...roomsStore[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: roomsStore[index] }
      }
      return { success: false, message: 'Room not found' }
    }

    if (cleanPath.startsWith('/rooms/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      const room = roomsStore.find((r) => r.id === id || r.code === id)
      if (!room) return { success: false, message: 'Room not found' }
      if (room.status === 'Occupied') {
        return {
          success: false,
          message: `Cannot delete room "${room.name}" while it is currently occupied by active class sessions (${room.currentClass || 'In Session'}).`,
        }
      }
      const isRoomInClasses = classesStore.some(
        (c) => c.room && c.room.toLowerCase() === room.name.toLowerCase()
      )
      if (isRoomInClasses) {
        return {
          success: false,
          message: `Cannot delete room "${room.name}" because it is currently designated as the homeroom for registered classes.`,
        }
      }
      roomsStore = roomsStore.filter((r) => r.id !== id && r.code !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // TEACHERS ENDPOINTS (/teachers)
    // ==========================================
    if (cleanPath === '/teachers' && method === 'GET') {
      return { success: true, data: [...teachersStore] }
    }

    if (cleanPath === '/teachers' && method === 'POST') {
      const idNum = Math.floor(Math.random() * 9000 + 1000)
      const firstName = body?.firstName || 'Faculty'
      const lastName = body?.lastName || 'Member'
      const newTeacher: MockTeacherItem = {
        id: `t-${idNum}`,
        teacherId: body?.teacherId || `TCH-${idNum}`,
        firstName,
        lastName,
        email: body?.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@oakridge.edu`,
        phone: body?.phone || '+1 (555) 019-0000',
        department: body?.department || 'General',
        position: body?.position || 'Faculty Member',
        qualification: body?.qualification || "Master's Degree",
        specialization: body?.specialization || '',
        experienceYears: Number(body?.experienceYears) || 3,
        hireDate: body?.hireDate || new Date().toISOString().split('T')[0],
        weeklyTeachingHours: Number(body?.weeklyTeachingHours) || 18,
        status: body?.status || 'active',
        subjects: body?.subjects || ['General Studies'],
        assignedClasses: body?.assignedClasses || ['Grade 10-A'],
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop`,
        performanceRating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      teachersStore.unshift(newTeacher)
      return { success: true, data: newTeacher }
    }

    if (cleanPath.startsWith('/teachers/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const teacher = teachersStore.find((t) => t.id === id || t.teacherId === id)
      if (teacher) return { success: true, data: teacher }
      return { success: false, message: 'Teacher record not found' }
    }

    if (cleanPath.startsWith('/teachers/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = teachersStore.findIndex((t) => t.id === id || t.teacherId === id)
      if (index !== -1) {
        teachersStore[index] = {
          ...teachersStore[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: teachersStore[index] }
      }
      return { success: false, message: 'Teacher not found' }
    }

    if (cleanPath.startsWith('/teachers/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      const teacher = teachersStore.find((t) => t.id === id || t.teacherId === id)
      if (!teacher) return { success: false, message: 'Teacher not found' }
      if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
        return {
          success: false,
          message: `Cannot delete teacher "${teacher.firstName} ${teacher.lastName}" while assigned to active classes (${teacher.assignedClasses.join(', ')}). Please reassign homeroom classes first.`,
        }
      }
      teachersStore = teachersStore.filter((t) => t.id !== id && t.teacherId !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // ATTENDANCE ENDPOINTS (/api/v1/attendance)
    // ==========================================
    if (cleanPath === '/attendance/stats' && method === 'GET') {
      const url = new URL(`http://localhost${path}`)
      const dateParam = url.searchParams.get('date') || new Date().toISOString().split('T')[0]
      const recordsForDate = attendanceStore.filter((r) => r.date === dateParam)
      const students = usersStore.filter((u) => u.role === 'student' || u.role === 'mazer')
      const total = students.length || recordsForDate.length || 1

      const present = recordsForDate.filter((r) => r.status === 'PRESENT').length
      const absent = recordsForDate.filter((r) => r.status === 'ABSENT').length
      const late = recordsForDate.filter((r) => r.status === 'LATE').length
      const excused = recordsForDate.filter((r) => r.status === 'EXCUSED').length
      const rate = total > 0 ? Number((((present + late) / total) * 100).toFixed(1)) : 100

      return {
        success: true,
        data: {
          date: dateParam,
          total,
          present,
          absent,
          late,
          excused,
          attendanceRate: rate,
          presentToday: present,
          absentToday: absent,
          lateToday: late,
          pendingExcuses: 4,
          perfectAttendanceCount: Math.max(0, present - 2),
        },
      }
    }

    if (cleanPath === '/attendance' && method === 'GET') {
      const url = new URL(`http://localhost${path}`)
      const date = url.searchParams.get('date')
      const studentId = url.searchParams.get('studentId')
      const classParam = url.searchParams.get('class')
      const gradeParam = url.searchParams.get('grade')
      const from = url.searchParams.get('from')
      const to = url.searchParams.get('to')

      let filtered = [...attendanceStore]

      if (date) {
        // If query for a specific date has no records yet, create default records for students so teacher can mark immediately
        const existingForDate = filtered.filter((r) => r.date === date)
        if (existingForDate.length === 0) {
          const students = usersStore.filter((u) => u.role === 'student' || u.role === 'mazer')
          students.forEach((stu) => {
            const newRec: MockAttendanceRecord = {
              id: `att-${stu.id}-${date}`,
              studentId: stu.id,
              studentName: `${stu.firstName} ${stu.lastName}`,
              studentCode: (stu as any).studentId || `STU-${stu.id.replace(/\D/g, '')}`,
              studentAvatar: `${stu.firstName[0]}${stu.lastName[0]}`,
              grade: (stu as any).grade || 'Grade 10',
              class: (stu as any).class || 'Grade 10 - A',
              date,
              status: 'PRESENT',
              checkIn: '07:55 AM',
              checkOut: '03:30 PM',
              note: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            attendanceStore.push(newRec)
          })
          filtered = [...attendanceStore]
        }
        filtered = filtered.filter((r) => r.date === date)
      }

      if (studentId) {
        filtered = filtered.filter((r) => r.studentId === studentId)
      }
      if (classParam && classParam !== 'all') {
        filtered = filtered.filter((r) => r.class.toLowerCase() === classParam.toLowerCase())
      }
      if (gradeParam && gradeParam !== 'all') {
        filtered = filtered.filter((r) => r.grade.toLowerCase() === gradeParam.toLowerCase())
      }
      if (from) {
        filtered = filtered.filter((r) => r.date >= from)
      }
      if (to) {
        filtered = filtered.filter((r) => r.date <= to)
      }

      return { success: true, data: filtered }
    }

    if (cleanPath === '/attendance/check-in' && method === 'POST') {
      const { studentId, date, status, checkIn, checkOut, note } = body || {}
      const targetDate = date || new Date().toISOString().split('T')[0]
      const existingIdx = attendanceStore.findIndex((r) => r.studentId === studentId && r.date === targetDate)
      const student = usersStore.find((u) => u.id === studentId)

      const rec: MockAttendanceRecord = {
        id: existingIdx !== -1 ? attendanceStore[existingIdx].id : `att-${studentId}-${targetDate}`,
        studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Student',
        studentCode: student ? (student as any).studentId || studentId : studentId,
        studentAvatar: student ? `${student.firstName[0]}${student.lastName[0]}` : 'ST',
        grade: student ? (student as any).grade || 'Grade 10' : 'Grade 10',
        class: student ? (student as any).class || 'Grade 10 - A' : 'Grade 10 - A',
        date: targetDate,
        status: status || 'PRESENT',
        checkIn: checkIn ?? (status === 'PRESENT' || status === 'LATE' ? '08:00 AM' : null),
        checkOut: checkOut ?? null,
        note: note || null,
        createdAt: existingIdx !== -1 ? attendanceStore[existingIdx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (existingIdx !== -1) {
        attendanceStore[existingIdx] = rec
      } else {
        attendanceStore.push(rec)
      }

      return { success: true, data: rec }
    }

    if (cleanPath === '/attendance/bulk' && method === 'POST') {
      const { date, records } = body || {}
      const targetDate = date || new Date().toISOString().split('T')[0]
      const updated: MockAttendanceRecord[] = []

      if (Array.isArray(records)) {
        records.forEach((r: any) => {
          const existingIdx = attendanceStore.findIndex((att) => att.studentId === r.studentId && att.date === targetDate)
          const student = usersStore.find((u) => u.id === r.studentId)

          const rec: MockAttendanceRecord = {
            id: existingIdx !== -1 ? attendanceStore[existingIdx].id : `att-${r.studentId}-${targetDate}`,
            studentId: r.studentId,
            studentName: student ? `${student.firstName} ${student.lastName}` : (r.studentName || 'Student'),
            studentCode: student ? (student as any).studentId || r.studentId : (r.studentCode || r.studentId),
            studentAvatar: student ? `${student.firstName[0]}${student.lastName[0]}` : 'ST',
            grade: student ? (student as any).grade || 'Grade 10' : 'Grade 10',
            class: student ? (student as any).class || 'Grade 10 - A' : 'Grade 10 - A',
            date: targetDate,
            status: r.status || 'PRESENT',
            checkIn: r.checkIn !== undefined ? r.checkIn : (r.status === 'PRESENT' || r.status === 'LATE' ? '08:00 AM' : null),
            checkOut: r.checkOut !== undefined ? r.checkOut : null,
            note: r.note || null,
            createdAt: existingIdx !== -1 ? attendanceStore[existingIdx].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          if (existingIdx !== -1) {
            attendanceStore[existingIdx] = rec
          } else {
            attendanceStore.push(rec)
          }
          updated.push(rec)
        })
      }

      return { success: true, data: { count: updated.length, records: updated } }
    }

    if (cleanPath === '/attendance/check-out' && method === 'POST') {
      const { studentId, date, checkOut } = body || {}
      const targetDate = date || new Date().toISOString().split('T')[0]
      const existingIdx = attendanceStore.findIndex((r) => r.studentId === studentId && r.date === targetDate)
      if (existingIdx !== -1) {
        attendanceStore[existingIdx].checkOut = checkOut || '03:30 PM'
        attendanceStore[existingIdx].updatedAt = new Date().toISOString()
        return { success: true, data: attendanceStore[existingIdx] }
      }
      return { success: false, message: 'Attendance record not found for check-out' }
    }

    if (cleanPath.startsWith('/attendance/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      attendanceStore = attendanceStore.filter((r) => r.id !== id)
      return { success: true, data: null }
    }

    // Dashboard stats
    if (cleanPath === '/dashboard/stats' && method === 'GET') {

      const stats: DashboardStats = {
        studentCount: 1284,
        teacherCount: 86,
        classCount: 48,
        pendingLeaveRequests: 12,
      }
      return { success: true, data: stats }
    }

    if (cleanPath.startsWith('/dashboard/attendance-summary') && method === 'GET') {
      const summary: AttendanceSummary = [
        { status: 'Present', _count: 1210 },
        { status: 'Late', _count: 45 },
        { status: 'Absent', _count: 29 },
      ]
      return { success: true, data: summary }
    }

    return null
  },
}

