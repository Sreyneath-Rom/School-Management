import { mockLogin, mockUsers } from '@/data/mockUsers'
import { mockUserDirectory } from '@/data/mockUserDirectory'
import type { PermissionAction, PermissionDef, RoleDef } from '@/types/roles'
import type { LanguageRecord } from '@/services/languagesService'
import type { SchoolModel } from '@/services/schoolService'
import type { SubjectItem } from '@/services/subjectService'
import type { ScheduleSlot } from '@/services/scheduleService'
import type { DayOfWeek } from '@/types/schedule'
import type { SystemUser } from '@/types/user'
import type { TeacherProfile } from '@/types/teacherProfile'
import type { DashboardStats } from '@/services/dashboardService'
import type { AttendanceStats } from '@/types/attendance'
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
  nativeName: lang.name,
  rtl: false,
  isActive: true,
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
  name: 'Preah Sisowath High School / New Generation School (វិទ្យាល័យព្រះស៊ីសុវត្ថិ)',
  logoUrl: null,
  address: 'Norodom Blvd, Sangkat Chey Chumneah, Khan Daun Penh, Phnom Penh, Cambodia',
  phone: '+855 (0) 23 210 123',
  email: 'admin@sisowath.moeys.edu.kh',
  academicYear: '2025 - 2026',
  settings: {
    schoolCode: 'MOEYS-SIS-001',
    academicTerm: 'Semester 1',
    motto: 'Knowledge, Morality, Patriotism (ចំណេះដឹង សីលធម៌ សញ្ជាតិ)',
    description: 'Premier Cambodian national secondary institution under the Ministry of Education, Youth and Sport (MoEYS), offering Grades 7–9 Lower Secondary and Grades 10–12 Upper Secondary with Science and Social Science tracks.',
    website: 'https://sisowath.moeys.gov.kh',
    language: 'en',
    timeZone: 'Asia/Phnom_Penh',
    dateFormat: 'DD/MM/YYYY',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

let rolesStore: RoleDef[] = [...initialRoles]

let subjectsStore: SubjectItem[] = [
  {
    id: 's-khm-709',
    name: 'Khmer Literature (ភាសាខ្មែរ)',
    code: 'KHM-709',
    department: 'Languages & Humanities',
    category: 'Core',
    credits: 5,
    weeklyHours: 5,
    gradeLevel: 'Grades 7–9 (Lower Secondary)',
    description: 'Focuses on reading, writing, grammar, orthography, and national Cambodian literature appreciation.',
    teachers: [
      { id: 't-khm-1', name: 'Sokha Chea', label: 'SC', color: 'bg-indigo-500' },
      { id: 't-khm-2', name: 'Bopha Vong', label: 'BV', color: 'bg-violet-500' },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 's-mth-709',
    name: 'Mathematics (គណិតវិទ្យា)',
    code: 'MTH-709',
    department: 'Mathematics',
    category: 'Core',
    credits: 5,
    weeklyHours: 5,
    gradeLevel: 'Grades 7–9 (Lower Secondary)',
    description: 'Arithmetic, pre-algebra, introductory Euclidean plane geometry, and ratios.',
    teachers: [
      { id: 't-mth-1', name: 'John Whitfield', label: 'JW', color: 'bg-sky-500' },
      { id: 't-mth-2', name: 'Serey Roth', label: 'SR', color: 'bg-blue-500' },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 's-sci-709',
    name: 'Physical Science & Chemistry (រូបវិទ្យា និងគីមីវិទ្យា)',
    code: 'SCI-709',
    department: 'Science & Technology',
    category: 'Core',
    credits: 4,
    weeklyHours: 4,
    gradeLevel: 'Grades 7–9 (Lower Secondary)',
    description: 'Integrated scientific inquiry, mechanics, states of matter, and laboratory experiments.',
    teachers: [
      { id: 't-sci-1', name: 'Priya Rao', label: 'PR', color: 'bg-emerald-500' },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
]

let schedulesStore: ScheduleSlot[] = [
  {
    id: 'sch-1',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    subjectId: 's-khm-709',
    subjectName: 'Khmer Literature',
    teacherId: 't-2001',
    teacherName: 'John Whitfield',
    dayOfWeek: 1, // Monday
    startTime: '07:30',
    endTime: '08:20',
    room: 'Building A - Room 101',
    colorTheme: 'indigo',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'sch-2',
    classId: 'cls-10a',
    className: 'Grade 10 - A',
    subjectId: 's-mth-709',
    subjectName: 'Mathematics',
    teacherId: 't-2001',
    teacherName: 'John Whitfield',
    dayOfWeek: 1, // Monday
    startTime: '08:30',
    endTime: '09:20',
    room: 'Building A - Room 101',
    colorTheme: 'sky',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
]

let usersStore: SystemUser[] = [...mockUserDirectory]

let teachersStore: TeacherProfile[] = [
  {
    id: 't-2001',
    userId: 'U-2001',
    firstName: 'John',
    lastName: 'Whitfield',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    email: 'john.teacher@varinhs.edu',
    phone: '+1 555-202-1122',
    isActive: true,
    teacherCode: 'FAC-0010',
    hiredAt: '2015-08-15T00:00:00.000Z',
    subjects: [
      {
        subject: { id: 's-mth-709', name: 'Mathematics', code: 'MTH-709', department: 'Mathematics' },
      },
    ],
    classesLed: [
      {
        id: 'cls-10a',
        name: 'Grade 10 - A',
        gradeLevel: 10,
        _count: { students: 30 },
      },
    ],
  },
  {
    id: 't-2002',
    userId: 'U-2002',
    firstName: 'Priya',
    lastName: 'Rao',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop',
    email: 'priya.rao@varinhs.edu',
    phone: '+1 555-202-4455',
    isActive: true,
    teacherCode: 'FAC-0011',
    hiredAt: '2018-01-10T00:00:00.000Z',
    subjects: [
      {
        subject: { id: 's-sci-709', name: 'Physical Science & Chemistry', code: 'SCI-709', department: 'Science & Technology' },
      },
    ],
    classesLed: [
      {
        id: 'cls-9a',
        name: 'Grade 9 - A',
        gradeLevel: 9,
        _count: { students: 32 },
      },
    ],
  },
]

// Mock Classes Store
let classesStore: any[] = [
  {
    id: 'cls-9a',
    name: 'Grade 9 - A',
    gradeLevel: 9,
    capacity: 35,
    homeroomTeacherId: 't-2002',
    createdAt: '2024-08-01T00:00:00.000Z',
    updatedAt: '2024-08-01T00:00:00.000Z',
    homeroomTeacher: {
      id: 't-2002',
      teacherCode: 'FAC-0011',
      user: { id: 'U-2002', firstName: 'Priya', lastName: 'Rao', email: 'priya.rao@varinhs.edu' },
    },
    _count: { students: 32 },
  },
  {
    id: 'cls-10a',
    name: 'Grade 10 - A',
    gradeLevel: 10,
    capacity: 35,
    homeroomTeacherId: 't-2001',
    createdAt: '2024-08-01T00:00:00.000Z',
    updatedAt: '2024-08-01T00:00:00.000Z',
    homeroomTeacher: {
      id: 't-2001',
      teacherCode: 'FAC-0010',
      user: { id: 'U-2001', firstName: 'John', lastName: 'Whitfield', email: 'john.teacher@varinhs.edu' },
    },
    _count: { students: 30 },
  },
  {
    id: 'cls-11b',
    name: 'Grade 11 - B',
    gradeLevel: 11,
    capacity: 35,
    homeroomTeacherId: 't-2001',
    createdAt: '2024-08-01T00:00:00.000Z',
    updatedAt: '2024-08-01T00:00:00.000Z',
    homeroomTeacher: {
      id: 't-2001',
      teacherCode: 'FAC-0010',
      user: { id: 'U-2001', firstName: 'John', lastName: 'Whitfield', email: 'john.teacher@varinhs.edu' },
    },
    _count: { students: 28 },
  },
]

// Mock Academic Years Store
let academicYearsStore: any[] = [
  {
    id: 'ay-2025-2026',
    name: '2025 - 2026 Academic Year',
    startDate: '2025-08-15',
    endDate: '2026-06-15',
    status: 'Active',
    termsCount: 2,
    classesCount: 12,
    studentsCount: 380,
    isCurrent: true,
    description: 'Current active school year across all grades.',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'ay-2024-2025',
    name: '2024 - 2025 Academic Year',
    startDate: '2024-08-15',
    endDate: '2025-06-15',
    status: 'Archived',
    termsCount: 2,
    classesCount: 12,
    studentsCount: 365,
    isCurrent: false,
    description: 'Previous school year.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

// Mock Terms Store
let termsStore: any[] = [
  {
    id: 'term-sem-1',
    name: 'Semester 1 (ឆមាសទី១)',
    academicYearId: 'ay-2025-2026',
    academicYear: { id: 'ay-2025-2026', name: '2025 - 2026 Academic Year', isCurrent: true },
    startDate: '2025-08-15',
    endDate: '2026-01-15',
    gradingDeadline: '2026-01-25',
    status: 'Active',
    weightPercentage: 50,
    description: 'First semester comprehensive academic assessments.',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'term-sem-2',
    name: 'Semester 2 (ឆមាសទី២)',
    academicYearId: 'ay-2025-2026',
    academicYear: { id: 'ay-2025-2026', name: '2025 - 2026 Academic Year', isCurrent: true },
    startDate: '2026-01-20',
    endDate: '2026-06-15',
    gradingDeadline: '2026-06-25',
    status: 'Upcoming',
    weightPercentage: 50,
    description: 'Second semester national exam preparation.',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

// Mock Rooms Store
let roomsStore: any[] = [
  {
    id: 'room-101',
    name: 'Room 101',
    code: 'R-101',
    building: 'Building A',
    floor: '1st Floor',
    type: 'Classroom',
    capacity: 40,
    amenities: ['Projector', 'Whiteboard', 'Air Conditioning', 'Audio System'],
    status: 'Available',
    currentClass: 'Grade 10 - A',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'room-sci-lab',
    name: 'Chemistry Science Laboratory',
    code: 'LAB-CHEM',
    building: 'Science Center',
    floor: '2nd Floor',
    type: 'Science Lab',
    capacity: 32,
    amenities: ['Fume Hood', 'Chemical Storage', 'Safety Eyewash', 'Microscopes'],
    status: 'Occupied',
    currentClass: 'Grade 11 - B',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

// Mock Grade Levels Store
let gradeLevelsStore: any[] = [
  {
    id: 'gl-7',
    code: 'G7',
    name: 'Grade 7 (ថ្នាក់ទី៧)',
    alias: 'Lower Secondary 1',
    levelOrder: 1,
    minPassingScore: 50,
    headCoordinator: 'John Whitfield',
    maxCapacity: 120,
    status: 'Active',
    description: 'First year of Lower Secondary Education.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'gl-10',
    code: 'G10',
    name: 'Grade 10 (ថ្នាក់ទី១០)',
    alias: 'Upper Secondary 1',
    levelOrder: 4,
    minPassingScore: 50,
    headCoordinator: 'Priya Rao',
    maxCapacity: 140,
    status: 'Active',
    description: 'First year of Upper Secondary National Curriculum.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

// Mock Announcements Store
let announcementsStore: any[] = [
  {
    id: 'ann-1',
    title: 'Mid-Term Examination Schedule Announced',
    content: 'The mid-term examination timetable for Semester 1 has been finalized. Please consult your respective student portal under Academic -> Exams for full room allocations and schedules.',
    audience: 'all',
    authorId: 'U-1001',
    createdAt: '2025-02-10T08:00:00.000Z',
    updatedAt: '2025-02-10T08:00:00.000Z',
  },
  {
    id: 'ann-2',
    title: 'Faculty Workshop: Digital Assessment Tools',
    content: 'All faculty members are invited to participate in the upcoming digital pedagogy workshop on modern rubric design and automated feedback loops.',
    audience: 'teacher',
    authorId: 'U-1001',
    createdAt: '2025-02-14T10:00:00.000Z',
    updatedAt: '2025-02-14T10:00:00.000Z',
  },
]

// Mock Notifications Store
let notificationsStore: any[] = [
  {
    id: 'notif-1',
    title: 'Attendance Report Submitted',
    message: 'Daily homeroom attendance for Grade 10 - A has been submitted and verified.',
    type: 'attendance',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    title: 'System Backup Completed',
    message: 'Routine snapshot backup of all student records and grade books completed.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

// Mock Leave Requests Store
let leaveRequestsStore: any[] = [
  {
    id: 'leave-1',
    studentId: 'U-3001',
    studentName: 'Emily Carter',
    studentCode: 'STU123456',
    startDate: '2025-02-20',
    endDate: '2025-02-22',
    reason: 'Family emergency / medical appointment',
    status: 'PENDING',
    type: 'Medical',
    createdAt: '2025-02-18T09:00:00.000Z',
    updatedAt: '2025-02-18T09:00:00.000Z',
  },
]

interface MockAttendanceRecord {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  studentAvatar: string
  grade: string
  class: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  checkIn: string | null
  checkOut: string | null
  note: string | null
  createdAt: string
  updatedAt: string
}

function getInitialAttendance(): MockAttendanceRecord[] {
  const records: MockAttendanceRecord[] = []
  const today = new Date()
  const students = mockUserDirectory.filter((u) => u.role === 'student' || u.role === 'mazer')

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const d = new Date(today)
    d.setDate(today.getDate() - dayOffset)
    if (d.getDay() === 0 || d.getDay() === 6) continue

    const dateStr = d.toISOString().split('T')[0]
    students.forEach((stu, idx) => {
      let status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' = 'PRESENT'
      let checkIn: string | null = '07:48 AM'
      let checkOut: string | null = '03:30 PM'
      let note: string | null = null

      if ((idx + dayOffset) % 11 === 0) {
        status = 'ABSENT'
        checkIn = null
        checkOut = null
        note = 'Sick leave reported by guardian'
      } else if ((idx + dayOffset) % 7 === 0) {
        status = 'LATE'
        checkIn = '08:24 AM'
        note = 'Traffic delay on transit bus route 4'
      } else if ((idx + dayOffset) % 13 === 0) {
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
    // Realistic micro-latency simulation for mock API
    await new Promise((resolve) => setTimeout(resolve, 80))
    const [rawPath, queryString] = path.split('?')
    const cleanPath = (rawPath || '').replace(/^\/api\/v\d+/, '').replace(/\/$/, '') || '/'
    const queryParams = new URLSearchParams(queryString || '')

    // ==========================================
    // AUTH ENDPOINTS
    // ==========================================
    if (cleanPath === '/auth/login' && method === 'POST') {
      const { identifier, email, password } = body || {}
      const loginId = identifier || email || ''
      const matched = mockLogin(loginId, password || '')
      if (matched) {
        const role = matched.role
        const firstName = matched.firstName
        const lastName = matched.name.replace(matched.firstName, '').trim() || (role === 'admin' ? 'Administrator' : 'User')
        return {
          success: true,
          data: {
            accessToken: `mock-token-${matched.id}-${Date.now()}`,
            refreshToken: `mock-refresh-${matched.id}-${Date.now()}`,
            user: {
              id: matched.id,
              email: matched.email,
              firstName,
              lastName,
              role,
              status: 'active',
              permissionKeys: initialPermissions.map((p) => p.key),
            },
          },
        }
      }
      return { success: false, message: 'Invalid credentials. Please verify your email or ID and password.' }
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
          lastName: u.name.replace(u.firstName, '').trim() || 'Administrator',
          role: u.role,
          permissionKeys: initialPermissions.map((p) => p.key),
        },
      }
    }

    // ==========================================
    // DASHBOARD ENDPOINTS
    // ==========================================
    if (cleanPath === '/dashboard/stats' && method === 'GET') {
      const stats: DashboardStats = {
        studentCount: usersStore.filter((u) => u.role === 'student' || u.role === 'mazer').length || 1284,
        teacherCount: teachersStore.length || 86,
        classCount: classesStore.length || 48,
        pendingLeaveRequests: leaveRequestsStore.filter((l) => l.status === 'PENDING').length || 12,
      }
      return { success: true, data: stats }
    }

    if (cleanPath.startsWith('/dashboard/attendance-summary') && method === 'GET') {
      const today = new Date().toISOString().split('T')[0]
      const recordsForDate = attendanceStore.filter((r) => r.date === today)
      const present = recordsForDate.filter((r) => r.status === 'PRESENT').length || 38
      const absent = recordsForDate.filter((r) => r.status === 'ABSENT').length || 2
      const late = recordsForDate.filter((r) => r.status === 'LATE').length || 3
      const excused = recordsForDate.filter((r) => r.status === 'EXCUSED').length || 1
      const total = present + absent + late + excused || 44
      const rate = total > 0 ? Number((((present + late) / total) * 100).toFixed(1)) : 97.4

      const summary: AttendanceStats = {
        date: today,
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate: rate,
        presentToday: present,
        absentToday: absent,
        lateToday: late,
        pendingExcuses: excused,
        perfectAttendanceCount: Math.max(0, present - 3),
      }
      return { success: true, data: summary }
    }

    // ==========================================
    // BADGES & COUNTS
    // ==========================================
    if (cleanPath === '/leave-requests/pending/count' && method === 'GET') {
      return { success: true, data: { count: leaveRequestsStore.filter((l) => l.status === 'PENDING').length } }
    }

    if (cleanPath === '/messages/unread/count' && method === 'GET') {
      return { success: true, data: { count: 3 } }
    }

    // ==========================================
    // ACADEMIC YEARS
    // ==========================================
    if (cleanPath === '/academic-years' && method === 'GET') {
      return { success: true, data: [...academicYearsStore] }
    }

    if (cleanPath === '/academic-years' && method === 'POST') {
      const newAy = {
        id: `ay-${Date.now()}`,
        name: body?.name || 'New Academic Year',
        startDate: body?.startDate || '2025-08-15',
        endDate: body?.endDate || '2026-06-15',
        status: body?.status || 'Active',
        termsCount: 2,
        classesCount: 0,
        studentsCount: 0,
        isCurrent: false,
        description: body?.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      academicYearsStore.unshift(newAy)
      return { success: true, data: newAy }
    }

    if (cleanPath.startsWith('/academic-years/') && cleanPath.endsWith('/current') && method === 'POST') {
      const id = cleanPath.split('/')[2]
      academicYearsStore = academicYearsStore.map((ay) => ({ ...ay, isCurrent: ay.id === id }))
      const found = academicYearsStore.find((ay) => ay.id === id)
      return { success: true, data: found }
    }

    if (cleanPath.startsWith('/academic-years/') && method === 'GET') {
      const id = cleanPath.split('/')[2]
      const found = academicYearsStore.find((ay) => ay.id === id)
      if (found) return { success: true, data: found }
      return { success: false, message: 'Academic year not found' }
    }

    if (cleanPath.startsWith('/academic-years/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const idx = academicYearsStore.findIndex((ay) => ay.id === id)
      if (idx !== -1) {
        academicYearsStore[idx] = { ...academicYearsStore[idx], ...body, updatedAt: new Date().toISOString() }
        return { success: true, data: academicYearsStore[idx] }
      }
      return { success: false, message: 'Academic year not found' }
    }

    if (cleanPath.startsWith('/academic-years/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      academicYearsStore = academicYearsStore.filter((ay) => ay.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // TERMS
    // ==========================================
    if (cleanPath === '/terms' && method === 'GET') {
      const ayId = queryParams.get('academicYearId')
      let list = [...termsStore]
      if (ayId) list = list.filter((t) => t.academicYearId === ayId)
      return { success: true, data: list }
    }

    if (cleanPath === '/terms' && method === 'POST') {
      const newTerm = {
        id: `term-${Date.now()}`,
        name: body?.name || 'New Term',
        academicYearId: body?.academicYearId || academicYearsStore[0]?.id || 'ay-1',
        academicYear: academicYearsStore.find((ay) => ay.id === body?.academicYearId) || { id: 'ay-1', name: 'Academic Year', isCurrent: true },
        startDate: body?.startDate || '2025-08-15',
        endDate: body?.endDate || '2026-01-15',
        gradingDeadline: body?.gradingDeadline || '2026-01-25',
        status: body?.status || 'Upcoming',
        weightPercentage: Number(body?.weightPercentage) || 50,
        description: body?.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      termsStore.push(newTerm)
      return { success: true, data: newTerm }
    }

    if (cleanPath.startsWith('/terms/') && cleanPath.endsWith('/active') && method === 'POST') {
      const id = cleanPath.split('/')[2]
      termsStore = termsStore.map((t) => ({ ...t, status: t.id === id ? 'Active' : 'Completed' }))
      const found = termsStore.find((t) => t.id === id)
      return { success: true, data: found }
    }

    if (cleanPath.startsWith('/terms/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const idx = termsStore.findIndex((t) => t.id === id)
      if (idx !== -1) {
        termsStore[idx] = { ...termsStore[idx], ...body, updatedAt: new Date().toISOString() }
        return { success: true, data: termsStore[idx] }
      }
      return { success: false, message: 'Term not found' }
    }

    if (cleanPath.startsWith('/terms/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      termsStore = termsStore.filter((t) => t.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // CLASSES
    // ==========================================
    if (cleanPath === '/classes' && method === 'GET') {
      return { success: true, data: [...classesStore] }
    }

    if (cleanPath === '/classes' && method === 'POST') {
      const teacher = teachersStore.find((t) => t.id === body?.homeroomTeacherId)
      const newClass = {
        id: `cls-${Date.now()}`,
        name: body?.name || 'Grade 10 - X',
        gradeLevel: Number(body?.gradeLevel) || 10,
        capacity: Number(body?.capacity) || 35,
        homeroomTeacherId: body?.homeroomTeacherId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        homeroomTeacher: teacher
          ? { id: teacher.id, teacherCode: teacher.teacherCode, user: { id: teacher.userId, firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email } }
          : null,
        _count: { students: 0 },
      }
      classesStore.push(newClass)
      return { success: true, data: newClass }
    }

    if (cleanPath.startsWith('/classes/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const idx = classesStore.findIndex((c) => c.id === id)
      if (idx !== -1) {
        const teacher = body?.homeroomTeacherId ? teachersStore.find((t) => t.id === body.homeroomTeacherId) : undefined
        classesStore[idx] = {
          ...classesStore[idx],
          ...body,
          ...(teacher !== undefined ? { homeroomTeacher: teacher ? { id: teacher.id, teacherCode: teacher.teacherCode, user: { id: teacher.userId, firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email } } : null } : {}),
          updatedAt: new Date().toISOString(),
        }
        return { success: true, data: classesStore[idx] }
      }
      return { success: false, message: 'Class not found' }
    }

    if (cleanPath.startsWith('/classes/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      classesStore = classesStore.filter((c) => c.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // GRADE LEVELS
    // ==========================================
    if (cleanPath === '/grade-levels' && method === 'GET') {
      return { success: true, data: [...gradeLevelsStore] }
    }

    if (cleanPath === '/grade-levels' && method === 'POST') {
      const newGl = {
        id: `gl-${Date.now()}`,
        code: body?.code || 'G-New',
        name: body?.name || 'New Grade Level',
        alias: body?.alias || '',
        levelOrder: Number(body?.levelOrder) || 1,
        minPassingScore: Number(body?.minPassingScore) || 50,
        headCoordinator: body?.headCoordinator || '',
        maxCapacity: Number(body?.maxCapacity) || 100,
        status: body?.status || 'Active',
        description: body?.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      gradeLevelsStore.push(newGl)
      return { success: true, data: newGl }
    }

    // ==========================================
    // ROOMS
    // ==========================================
    if (cleanPath === '/rooms' && method === 'GET') {
      return { success: true, data: [...roomsStore] }
    }

    if (cleanPath === '/rooms' && method === 'POST') {
      const newRoom = {
        id: `room-${Date.now()}`,
        name: body?.name || 'New Room',
        code: body?.code || 'R-NEW',
        building: body?.building || 'Main Wing',
        floor: body?.floor || '1st Floor',
        type: body?.type || 'Classroom',
        capacity: Number(body?.capacity) || 30,
        amenities: body?.amenities || ['Whiteboard'],
        status: body?.status || 'Available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      roomsStore.push(newRoom)
      return { success: true, data: newRoom }
    }

    if (cleanPath.startsWith('/rooms/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const idx = roomsStore.findIndex((r) => r.id === id)
      if (idx !== -1) {
        roomsStore[idx] = { ...roomsStore[idx], ...body, updatedAt: new Date().toISOString() }
        return { success: true, data: roomsStore[idx] }
      }
      return { success: false, message: 'Room not found' }
    }

    if (cleanPath.startsWith('/rooms/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      roomsStore = roomsStore.filter((r) => r.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // LEAVES / LEAVE REQUESTS
    // ==========================================
    if ((cleanPath === '/leaves' || cleanPath === '/leave-requests') && method === 'GET') {
      return { success: true, data: [...leaveRequestsStore] }
    }

    if ((cleanPath === '/leaves' || cleanPath === '/leave-requests') && method === 'POST') {
      const student = usersStore.find((u) => u.id === body?.studentId) || usersStore.find((u) => u.role === 'student')
      const newLeave = {
        id: `leave-${Date.now()}`,
        studentId: student?.id || 'U-3001',
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Student',
        studentCode: (student as any)?.studentId || 'STU123456',
        startDate: body?.startDate || new Date().toISOString().split('T')[0],
        endDate: body?.endDate || new Date().toISOString().split('T')[0],
        reason: body?.reason || 'Leave requested',
        status: 'PENDING',
        type: body?.type || 'General',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      leaveRequestsStore.unshift(newLeave)
      return { success: true, data: newLeave }
    }

    if (cleanPath.startsWith('/leaves/') && cleanPath.endsWith('/review') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const idx = leaveRequestsStore.findIndex((l) => l.id === id)
      if (idx !== -1) {
        leaveRequestsStore[idx].status = body?.status || 'APPROVED'
        leaveRequestsStore[idx].updatedAt = new Date().toISOString()
        return { success: true, data: leaveRequestsStore[idx] }
      }
      return { success: false, message: 'Leave request not found' }
    }

    // ==========================================
    // ANNOUNCEMENTS
    // ==========================================
    if (cleanPath === '/announcements' && method === 'GET') {
      return { success: true, data: [...announcementsStore] }
    }

    if (cleanPath === '/announcements' && method === 'POST') {
      const newAnn = {
        id: `ann-${Date.now()}`,
        title: body?.title || 'Announcement',
        content: body?.content || '',
        audience: body?.audience || 'all',
        authorId: 'U-1001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      announcementsStore.unshift(newAnn)
      return { success: true, data: newAnn }
    }

    if (cleanPath.startsWith('/announcements/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      announcementsStore = announcementsStore.filter((a) => a.id !== id)
      return { success: true, data: null }
    }

    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    if (cleanPath === '/notifications' && method === 'GET') {
      return { success: true, data: [...notificationsStore] }
    }

    if (cleanPath === '/notifications/read-all' && method === 'POST') {
      notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }))
      return { success: true, data: null }
    }

    if (cleanPath.startsWith('/notifications/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const n = notificationsStore.find((item) => item.id === id)
      if (n) {
        n.read = Boolean(body?.read)
        return { success: true, data: n }
      }
      return { success: false, message: 'Notification not found' }
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

    // ==========================================
    // USERS ENDPOINTS
    // ==========================================
    if (cleanPath === '/users' && method === 'GET') {
      return { success: true, data: [...usersStore] }
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
    // TEACHERS ENDPOINTS
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
      const idNum = Math.floor(Math.random() * 9000 + 1000)
      const newTeacher: TeacherProfile = {
        id: `t-${idNum}`,
        userId: `U-${idNum}`,
        firstName: body?.firstName || 'Faculty',
        lastName: body?.lastName || 'Member',
        avatarUrl: body?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
        email: body?.email || `faculty.${idNum}@varinhs.edu`,
        phone: body?.phone || '+1 555-019-0000',
        isActive: true,
        teacherCode: body?.teacherCode || `FAC-${Math.floor(Math.random() * 900 + 100)}`,
        hiredAt: body?.hiredAt || new Date().toISOString(),
        subjects: [],
        classesLed: [],
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
        }
        return { success: true, data: teachersStore[index] }
      }
      return { success: false, message: 'Teacher record not found (404 Not Found)' }
    }

    if (cleanPath.startsWith('/teachers/') && method === 'DELETE') {
      const id = cleanPath.split('/')[2]
      teachersStore = teachersStore.filter((t) => t.id !== id)
      return { success: true, data: null }
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
        description: body?.description || null,
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
        subjectsStore[index] = { ...subjectsStore[index], ...body, updatedAt: new Date().toISOString() }
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
      const rawDay = Number(body?.dayOfWeek)
      const dayOfWeek: DayOfWeek = (rawDay >= 0 && rawDay <= 6 ? rawDay : 1) as DayOfWeek
      const newSlot: ScheduleSlot = {
        id: `sch-${Date.now()}`,
        classId: body?.classId || 'cls-10a',
        className: body?.className || 'Grade 10 - A',
        subjectId: body?.subjectId || 's1',
        subjectName: body?.subjectName || 'Subject',
        teacherId: body?.teacherId || 't1',
        teacherName: body?.teacherName || 'Faculty',
        dayOfWeek,
        startTime: body?.startTime || '08:00',
        endTime: body?.endTime || '09:30',
        room: body?.room || 'Room 101',
        colorTheme: body?.colorTheme || 'sky',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      schedulesStore.push(newSlot)
      return { success: true, data: newSlot }
    }

    if (cleanPath.startsWith('/schedules/') && method === 'PATCH') {
      const id = cleanPath.split('/')[2]
      const index = schedulesStore.findIndex((s) => s.id === id)
      if (index !== -1) {
        schedulesStore[index] = { ...schedulesStore[index], ...body, updatedAt: new Date().toISOString() }
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
    // LANGUAGES & TRANSLATIONS
    // ==========================================
    if (cleanPath === '/languages' && method === 'GET') {
      return { success: true, data: [...languagesStore] }
    }

    if (cleanPath === '/languages' && method === 'POST') {
      const newLang: LanguageRecord = {
        id: `lang-${Date.now()}`,
        code: (body?.code || '').toLowerCase(),
        name: body?.name || '',
        nativeName: body?.nativeName || body?.name || '',
        rtl: Boolean(body?.rtl),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      languagesStore.push(newLang)
      return { success: true, data: newLang }
    }

    if (cleanPath.startsWith('/translations/') && method === 'GET') {
      const parts = cleanPath.split('/')
      const code = decodeURIComponent(parts[2] || '').toLowerCase()
      const trans = translationsStore[code] || {}
      return { success: true, data: trans }
    }

    // ==========================================
    // SCHOOLS
    // ==========================================
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

    if (cleanPath === '/schools/setup' && method === 'PATCH') {
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

    // ==========================================
    // PERMISSIONS & ROLES
    // ==========================================
    if (cleanPath === '/permissions' && method === 'GET') {
      return { success: true, data: initialPermissions }
    }

    if (cleanPath === '/roles' && method === 'GET') {
      return { success: true, data: rolesStore }
    }

    // ==========================================
    // ATTENDANCE ENDPOINTS
    // ==========================================
    if (cleanPath === '/attendance/stats' && method === 'GET') {
      const dateParam = queryParams.get('date') || new Date().toISOString().split('T')[0]
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
      const date = queryParams.get('date')
      let filtered = [...attendanceStore]
      if (date) filtered = filtered.filter((r) => r.date === date)
      return { success: true, data: filtered }
    }

    // ==========================================
    // ACADEMIC: LESSONS, HOMEWORK, QUIZZES, GRADES
    // ==========================================
    if (cleanPath === '/lessons' && method === 'GET') {
      const lessons = await academicService.getLessons()
      return { success: true, data: lessons }
    }

    if (cleanPath === '/homework' && method === 'GET') {
      const list = await academicService.getHomeworkList()
      return { success: true, data: list }
    }

    if (cleanPath === '/quizzes' && method === 'GET') {
      const quizzes = await academicService.getQuizzes()
      return { success: true, data: quizzes }
    }

    if (cleanPath === '/grades' && method === 'GET') {
      const grades = await academicService.getGrades()
      return { success: true, data: grades }
    }

    return null
  },
}
