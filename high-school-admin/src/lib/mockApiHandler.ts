import { mockLogin, mockUsers } from '@/data/mockUsers'
import { mockUserDirectory } from '@/data/mockUserDirectory'
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
  'users',
  'classes',
  'subjects',
  'schedules',
  'attendance',
  'grades',
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

    if (cleanPath.startsWith('/roles/') && method === 'DELETE') {
      const roleId = cleanPath.split('/')[2]
      rolesStore = rolesStore.filter((r) => r.id !== roleId)
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

