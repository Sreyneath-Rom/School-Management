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
]

/**
 * Mock login — replace with a real API call once the backend exists.
 * `identifier` may be either an email address or a student/teacher ID.
 * Returns the matching user (without the password) or null if invalid.
 */
export const mockLogin = (
  identifier: string,
  password: string
): Omit<MockUser, 'password'> | null => {
  const normalized = identifier.toLowerCase()
  const match = mockUsers.find(
    (u) =>
      (u.email.toLowerCase() === normalized ||
        u.studentId?.toLowerCase() === normalized ||
        u.teacherId?.toLowerCase() === normalized) &&
      u.password === password
  )
  if (!match) return null
  const { password: _password, ...userWithoutPassword } = match
  return userWithoutPassword
}

/**
 * Look up a user's display name by email/studentId/teacherId — no
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
      u.teacherId?.toLowerCase() === normalized
  )
  return match?.name ?? null
}

const HONORIFIC_BY_GENDER: Record<MockUserGender, string> = {
  male: 'Mr',
  female: 'Ms',
  other: '',
}

/**
 * Builds a greeting with a gender-based honorific prefixed to the first
 * name — e.g. "Mr John", "Ms Sarah". Falls back to just the first name
 * if gender is 'other'/unset, and falls back to deriving a first name
 * from `name` (e.g. "Teacher John" -> "John") if `firstName` isn't
 * present on the object passed in — this keeps it compatible with a
 * narrower User type (e.g. from AuthContext) that hasn't been updated
 * to include firstName/gender yet.
 *
 * For full accuracy, prefer adding `firstName` and `gender` to your
 * AuthContext's User type so they flow through from mockLogin's result
 * without needing the fallback.
 */
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

/**
 * Same live-lookup as getUserDisplayName, but returns a greeting with a
 * gender-based honorific prefixed to the first name — e.g. "Mr John",
 * "Ms Sarah". Meant for pre-auth screens (login forms) where you only
 * have a typed-in identifier. Returns null if there's no match yet.
 */
export const getUserGreeting = (identifier: string): string | null => {
  if (!identifier.trim()) return null
  const normalized = identifier.toLowerCase()
  const match = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.studentId?.toLowerCase() === normalized ||
      u.teacherId?.toLowerCase() === normalized
  )
  if (!match) return null
  return getGreetingForUser(match)
}