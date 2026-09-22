import type { UserRole } from '@/utils/rolePermissions'

export type MockUserGender = 'male' | 'female' | 'other'

export interface MockUser {
  id: string
  name: string
  firstName: string
  gender: MockUserGender
  email: string
  password: string
  role: UserRole
  studentId?: string
  teacherId?: string
  parentId?: string
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin Sarah',
    firstName: 'Sarah',
    gender: 'female',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Teacher John',
    firstName: 'John',
    gender: 'male',
    email: 'teacher@example.com',
    password: 'password',
    role: 'teacher',
    teacherId: 'TCH-123456',
  },
  {
    id: '3',
    name: 'Student Emily',
    firstName: 'Emily',
    gender: 'female',
    email: 'student@example.com',
    password: 'password',
    role: 'student',
    studentId: 'STU123456',
  },
  {
    id: '4',
    name: 'Parent Robert',
    firstName: 'Robert',
    gender: 'male',
    email: 'parent@example.com',
    password: 'password',
    role: 'parent',
    parentId: 'PAR-123456',
  },
]

/**
 * Mock login — replace with a real API call once the backend exists.
 * `identifier` may be either an email address or a student/teacher/parent ID.
 * Returns the matching user (without the password) or null if invalid.
 */
export const mockLogin = (
  identifier: string,
  _password: string
): Omit<MockUser, 'password'> | null => {
  const normalized = identifier.toLowerCase().trim()
  let match = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.studentId?.toLowerCase() === normalized ||
      u.teacherId?.toLowerCase() === normalized ||
      u.parentId?.toLowerCase() === normalized
  )

  if (!match) {
    if (normalized.includes('teacher') || normalized.startsWith('tch-')) {
      match = mockUsers.find((u) => u.role === 'teacher')
    } else if (normalized.includes('student') || normalized.startsWith('stu')) {
      match = mockUsers.find((u) => u.role === 'student')
    } else if (normalized.includes('parent') || normalized.startsWith('par-')) {
      match = mockUsers.find((u) => u.role === 'parent')
    } else if (normalized.includes('admin') || normalized.includes('oakridge')) {
      match = mockUsers.find((u) => u.role === 'admin')
    } else if (normalized.length > 0) {
      match = mockUsers[0]
    }
  }

  if (!match) return null
  const { password: _pw, ...userWithoutPassword } = match
  return userWithoutPassword
}

/**
 * Look up a user's display name by email/studentId/teacherId/parentId — no
 * password required. Meant for lightweight UI touches like showing
 * "Welcome back, {name}" as someone types their ID, before they've
 * actually authenticated. Returns null if there's no match yet.
 */
export const getUserDisplayName = (identifier: string): string | null => {
  if (!identifier.trim()) return null
  const normalized = identifier.toLowerCase()
  const match = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.studentId?.toLowerCase() === normalized ||
      u.teacherId?.toLowerCase() === normalized ||
      u.parentId?.toLowerCase() === normalized
  )
  return match?.name ?? null
}

const HONORIFIC_BY_GENDER: Record<MockUserGender, string> = {
  male: 'Mr',
  female: 'Ms',
  other: '',
}

export const getGreetingForUser = (user: {
  firstName?: string
  gender?: MockUserGender
  name?: string
}): string => {
  const firstName = user.firstName ?? user.name?.trim().split(/\s+/).pop() ?? ''
  if (!firstName) return ''
  const honorific = user.gender ? HONORIFIC_BY_GENDER[user.gender] : ''
  return honorific ? `${honorific} ${firstName}` : firstName
}

export const getUserGreeting = (identifier: string): string | null => {
  if (!identifier.trim()) return null
  const normalized = identifier.toLowerCase()
  const match = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.studentId?.toLowerCase() === normalized ||
      u.teacherId?.toLowerCase() === normalized ||
      u.parentId?.toLowerCase() === normalized
  )
  if (!match) return null
  return getGreetingForUser(match)
}
