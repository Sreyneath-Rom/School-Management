import { mockLogin, mockUsers } from '@/data/mockUsers'
import type { PermissionAction, PermissionDef, RoleDef } from '@/types/roles'
import type { LanguageRecord } from '@/services/languagesService'
import type { SchoolModel } from '@/services/schoolService'
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

let rolesStore = [...initialRoles]

export const mockApiHandler = {
  handle: async (
    path: string,
    method: string,
    body?: any
  ): Promise<{ success: boolean; data?: any; message?: string } | null> => {
    // Subtle realistic network latency simulation for mock API
    await new Promise((resolve) => setTimeout(resolve, 200))
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
        permissionIds: [],
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
