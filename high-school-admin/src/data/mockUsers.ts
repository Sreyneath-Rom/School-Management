import type { UserRole } from '@/utils/rolePermissions'

export interface MockUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin Sarah',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Teacher John',
    email: 'teacher@example.com', // matches the "teacherr" spelling you gave — double-check this isn't a typo you meant as "teacher@example.com"
    password: 'password',
    role: 'teacher',
  },
  {
    id: '3',
    name: 'Student Emily',
    email: 'student@example.com',
    password: 'password',
    role: 'student',
  },
]

/**
 * Mock login — replace with a real API call once the backend exists.
 * Returns the matching user (without the password) or null if invalid.
 */
export const mockLogin = (
  email: string,
  password: string
): Omit<MockUser, 'password'> | null => {
  const match = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!match) return null
  const { password: _password, ...userWithoutPassword } = match
  return userWithoutPassword
}