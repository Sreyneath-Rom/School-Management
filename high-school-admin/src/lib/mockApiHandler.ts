import { mockLogin, mockUsers } from '@/data/mockUsers'
import { mockUserDirectory } from '@/data/mockUserDirectory'
import type { PermissionAction, PermissionDef, RoleDef } from '@/types/roles'
import type { LanguageRecord } from '@/services/languagesService'
import type { SchoolModel } from '@/services/schoolService'
import type { SubjectItem } from '@/services/subjectService'
import type { ScheduleSlot } from '@/services/scheduleService'
import type { SystemUser } from '@/types/user'
import type { TeacherRecord } from '@/services/teacherService'
import type { DashboardStats, AttendanceSummary } from '@/services/dashboardService'
import { BUILT_IN_LANGUAGES } from '@/i18n/useTranslations'
import { STRINGS } from '@/i18n/strings'
import { academicService } from '@/services/academicService'

const MODULE_IDS = [
  'school',
  'academicYears',
  'terms',
  'users',
  'teachers',
  'students',
  'roles',
  'grades',
  'classes',
  'subjects',
  'schedules',
  'attendance',
  'homework',
  'reports',
  'dashboard',
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

let teachersStore: TeacherRecord[] = [
  {
    id: 't1',
    employeeId: 'FAC-SCI-01',
    firstName: 'John',
    lastName: 'Whitfield',
    name: 'Dr. John Whitfield',
    title: 'Head of Science & Biology Faculty',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
    department: 'Science',
    position: 'Department Chair',
    email: 'john.whitfield@oakridge.edu',
    phone: '+1 (555) 019-2834',
    joiningDate: '2019-08-15',
    qualifications: 'Ph.D. in Molecular Biology (Harvard University)',
    specialization: 'Cellular Biochemistry & Genetics',
    weeklyTeachingHours: 18,
    assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 12-A'],
    subjectsTaught: ['Advanced Biology', 'AP Biology Seminar'],
    performanceRating: 4.9,
    status: 'Active',
    createdAt: '2019-08-15T00:00:00.000Z',
  },
  {
    id: 't2',
    employeeId: 'FAC-MTH-03',
    firstName: 'Marcus',
    lastName: 'Kane',
    name: 'Prof. Marcus Kane',
    title: 'Senior Mathematics Lecturer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    department: 'Mathematics',
    position: 'Senior Lecturer',
    email: 'marcus.kane@oakridge.edu',
    phone: '+1 (555) 019-9943',
    joiningDate: '2018-01-10',
    qualifications: 'M.Sc. in Applied Mathematics (MIT)',
    specialization: 'Calculus, Differential Equations & Topology',
    weeklyTeachingHours: 20,
    assignedClasses: ['Grade 11-A', 'Grade 12-A'],
    subjectsTaught: ['Calculus BC', 'Linear Algebra'],
    performanceRating: 4.85,
    status: 'Active',
    createdAt: '2018-01-10T00:00:00.000Z',
  },
  {
    id: 't3',
    employeeId: 'FAC-HUM-02',
    firstName: 'Sarah',
    lastName: 'Parker',
    name: 'Sarah Parker',
    title: 'Social Studies & History Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop',
    department: 'Social Studies',
    position: 'Lead Teacher',
    email: 'sarah.parker@oakridge.edu',
    phone: '+1 (555) 019-4411',
    joiningDate: '2020-09-01',
    qualifications: 'M.A. in European History (Columbia)',
    specialization: 'Modern World History & Diplomacy',
    weeklyTeachingHours: 16,
    assignedClasses: ['Grade 10-B'],
    subjectsTaught: ['Modern World History'],
    performanceRating: 4.75,
    status: 'Active',
    createdAt: '2020-09-01T00:00:00.000Z',
  },
  {
    id: 't4',
    employeeId: 'FAC-TECH-04',
    firstName: 'Elena',
    lastName: 'Vance',
    name: 'Elena Vance',
    title: 'Computer Science & Robotics Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop',
    department: 'Technology',
    position: 'Coordinator',
    email: 'elena.vance@oakridge.edu',
    phone: '+1 (555) 019-7722',
    joiningDate: '2021-02-15',
    qualifications: 'B.S. in Computer Science & AI (Carnegie Mellon)',
    specialization: 'Algorithms, Web Systems, and Robotics',
    weeklyTeachingHours: 18,
    assignedClasses: ['Grade 12-A'],
    subjectsTaught: ['AP Computer Science A'],
    performanceRating: 4.95,
    status: 'Active',
    createdAt: '2021-02-15T00:00:00.000Z',
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
      const u = mockUsers[0]
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
      const newSlot: ScheduleSlot = {
        id: `sch-${Date.now()}`,
        classId: body?.classId || 'cls-10a',
        className: body?.className || 'Grade 10-A',
        subjectId: body?.subjectId || 's1',
        subjectName: body?.subjectName || 'Subject',
        teacherId: body?.teacherId || 't1',
        teacherName: body?.teacherName || 'Faculty',
        dayOfWeek: Number(body?.dayOfWeek) ?? 0,
        startTime: body?.startTime || '08:00',
        endTime: body?.endTime || '09:30',
        room: body?.room || 'Room 101',
        colorTheme: body?.colorTheme || 'sky',
      }
      schedulesStore.push(newSlot)
      return { success: true, data: newSlot }
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

    // ==========================================
    // TEACHERS ENDPOINTS (UC-TEACHER-01 to 05)
    // ==========================================
    if (cleanPath === '/teachers' && method === 'GET') {
      return { success: true, data: [...teachersStore] }
    }

    if (cleanPath.startsWith('/teachers/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const teacher = teachersStore.find((t) => t.id === id)
      if (teacher) return { success: true, data: teacher }
      return { success: false, message: 'Teacher not found' }
    }

    if (cleanPath === '/teachers' && method === 'POST') {
      if (!body?.firstName || !body?.lastName || !body?.email) {
        return { success: false, message: 'Missing required fields: firstName, lastName, and email are required (400 Bad Request)' }
      }
      const existingEmail = teachersStore.some((t) => t.email.toLowerCase() === body.email.toLowerCase())
      const existingEmpId = body?.employeeId && teachersStore.some((t) => t.employeeId.toLowerCase() === body.employeeId.toLowerCase())
      if (existingEmail || existingEmpId) {
        return { success: false, message: 'A teacher with this email or employee ID already exists (409 Conflict)' }
      }

      const idNum = Math.floor(Math.random() * 9000 + 1000)
      const newTeacher: TeacherRecord = {
        id: `t-${idNum}`,
        employeeId: body?.employeeId || `FAC-${Math.floor(Math.random() * 900 + 100)}`,
        firstName: body.firstName,
        lastName: body.lastName,
        name: `${body.firstName} ${body.lastName}`,
        title: body?.title || `Faculty - ${body?.department || 'General'}`,
        avatarUrl: body?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
        email: body.email,
        phone: body?.phone || '+1 555-019-0000',
        department: body?.department || 'Science',
        position: body?.position || 'Faculty Member',
        qualifications: body?.qualifications || "Master's Degree",
        specialization: body?.specialization || 'General Education',
        weeklyTeachingHours: Number(body?.weeklyTeachingHours) || 16,
        assignedClasses: Array.isArray(body?.assignedClasses) ? body.assignedClasses : [],
        subjectsTaught: Array.isArray(body?.subjectsTaught) ? body.subjectsTaught : [],
        performanceRating: 4.8,
        status: body?.status || 'Active',
        joiningDate: body?.joiningDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      teachersStore.unshift(newTeacher)
      return { success: true, data: newTeacher }
    }

    if (cleanPath.startsWith('/teachers/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = teachersStore.findIndex((t) => t.id === id)
      if (index !== -1) {
        teachersStore[index] = {
          ...teachersStore[index],
          ...body,
          name: body?.firstName && body?.lastName ? `${body.firstName} ${body.lastName}` : teachersStore[index].name,
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: teachersStore[index] }
      }
      return { success: false, message: 'Teacher record not found (404 Not Found)' }
    }

    if (cleanPath.startsWith('/teachers/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      const teacher = teachersStore.find((t) => t.id === id)
      if (!teacher) {
        return { success: false, message: 'Teacher not found (404 Not Found)' }
      }
      // 409 Conflict rule: teacher cannot be deleted if active classes or subjects are assigned
      if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
        return {
          success: false,
          message: `Cannot delete teacher "${teacher.name}": has ${teacher.assignedClasses.length} assigned class(es). Reassign classes before deleting (409 Conflict).`,
        }
      }
      teachersStore = teachersStore.filter((t) => t.id !== id)
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

    if (cleanPath.startsWith('/roles/') && method === 'DELETE') {
      const roleId = cleanPath.split('/')[2]
      rolesStore = rolesStore.filter((r) => r.id !== roleId)
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

    // ==========================================
    // ACADEMIC: LESSONS
    // ==========================================
    if (cleanPath === '/lessons' && method === 'GET') {
      const lessons = await academicService.getLessons()
      return { success: true, data: lessons }
    }

    if (cleanPath === '/lessons' && method === 'POST') {
      const created = await academicService.createLesson(body)
      return { success: true, data: created }
    }

    if (cleanPath.startsWith('/lessons/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const updated = await academicService.updateLesson(id, body)
      return { success: true, data: updated }
    }

    if (cleanPath.startsWith('/lessons/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      await academicService.deleteLesson(id)
      return { success: true, data: null }
    }

    // ==========================================
    // ACADEMIC: HOMEWORK
    // ==========================================
    if (cleanPath === '/homework' && method === 'GET') {
      const list = await academicService.getHomeworkList()
      return { success: true, data: list }
    }

    if (cleanPath === '/homework' && method === 'POST') {
      const created = await academicService.createHomework(body)
      return { success: true, data: created }
    }

    if (cleanPath.startsWith('/homework/') && cleanPath.endsWith('/submissions') && method === 'GET') {
      const hwId = cleanPath.split('/')[2]
      const subs = await academicService.getSubmissions(hwId)
      return { success: true, data: subs }
    }

    if (cleanPath === '/homework/submissions' && method === 'GET') {
      const subs = await academicService.getSubmissions()
      return { success: true, data: subs }
    }

    if (cleanPath === '/homework/submit' && method === 'POST') {
      const sub = await academicService.submitHomework(body)
      return { success: true, data: sub }
    }

    if (cleanPath.startsWith('/homework/submissions/') && cleanPath.endsWith('/grade') && method === 'POST') {
      const subId = cleanPath.split('/')[3]
      const graded = await academicService.gradeSubmission(subId, body.grade, body.feedback)
      return { success: true, data: graded }
    }

    // ==========================================
    // ACADEMIC: QUIZZES
    // ==========================================
    if (cleanPath === '/quizzes' && method === 'GET') {
      const quizzes = await academicService.getQuizzes()
      return { success: true, data: quizzes }
    }

    if (cleanPath.startsWith('/quizzes/') && cleanPath.endsWith('/student') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const quiz = await academicService.getQuizForStudent(id)
      return { success: true, data: quiz }
    }

    if (cleanPath.startsWith('/quizzes/') && cleanPath.endsWith('/submit') && method === 'POST') {
      const quizId = cleanPath.split('/')[2]
      const res = await academicService.submitQuiz({ ...body, quizId })
      return { success: true, data: res }
    }

    if (cleanPath.startsWith('/quizzes/') && cleanPath.endsWith('/submissions') && method === 'GET') {
      const quizId = cleanPath.split('/')[2]
      const subs = await academicService.getQuizSubmissions(quizId)
      return { success: true, data: subs }
    }

    // ==========================================
    // ACADEMIC: GRADES & PROGRESS
    // ==========================================
    if (cleanPath === '/grades' && method === 'GET') {
      const grades = await academicService.getGrades()
      return { success: true, data: grades }
    }

    if (cleanPath === '/grades/batch' && method === 'POST') {
      const saved = await academicService.saveBatchGrades(body?.records || [])
      return { success: true, data: saved }
    }

    if (cleanPath.startsWith('/grades/student/') && method === 'GET') {
      const studentId = cleanPath.split('/')[3]
      const grades = await academicService.getStudentGrades(studentId)
      return { success: true, data: grades }
    }

    if (cleanPath === '/progress' && method === 'GET') {
      const progress = await academicService.getStudentProgress()
      return { success: true, data: progress }
    }

    return null
  },
}

