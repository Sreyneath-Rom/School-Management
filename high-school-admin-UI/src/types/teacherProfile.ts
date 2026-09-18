// src/types/teacherProfile.ts

/**
 * A subject link on a teacher's profile.
 */
export interface TeacherSubjectLink {
  subject: {
    id: string
    name: string
    code: string
    department: string
  }
}

/**
 * A class a teacher leads as homeroom teacher.
 */
export interface TeacherHomeroomClass {
  id: string
  name: string
  gradeLevel: number
  _count: { students: number }
}

/**
 * Teacher profile as returned by `GET /teachers/:id`.
 */
export interface TeacherProfile {
  id: string
  userId: string

  // User-linked fields (flattened via `user` in the response)
  firstName: string
  lastName: string
  email: string
  phone: string | null
  avatarUrl: string | null
  isActive: boolean

  // Teacher fields
  teacherCode: string
  hiredAt: string

  // Relations
  subjects: TeacherSubjectLink[]
  classesLed: TeacherHomeroomClass[]

  // Client-derived (computed by a mapper, not returned by the API)
  // - fullName: firstName + lastName
}

/**
 * View model ready for the profile page.
 */
export interface TeacherProfileView {
  id: string
  firstName: string
  lastName: string
  fullName: string
  avatarUrl: string | null

  teacherCode: string
  hiredAt: string

  email: string
  phone: string | null
  isActive: boolean

  subjects: TeacherSubjectLink['subject'][]
  classesLed: TeacherHomeroomClass[]
}

export function toTeacherProfileView(
  profile: TeacherProfile
): TeacherProfileView {
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName} ${profile.lastName}`,
    avatarUrl: profile.avatarUrl,
    teacherCode: profile.teacherCode,
    hiredAt: profile.hiredAt,
    email: profile.email,
    phone: profile.phone,
    isActive: profile.isActive,
    subjects: profile.subjects.map((s) => s.subject),
    classesLed: profile.classesLed,
  }
}

/**
 * Payload for creating a teacher.
 *
 * Two mutually-exclusive paths:
 *   1. Link an existing user → supply `userId`.
 *   2. Create a user → supply `firstName` + `lastName` + `email` + `password`.
 *
 * Mixing both returns a 400.
 */
export type CreateTeacherPayload =
  | { userId: string; teacherCode?: string; subjectIds?: string[]; subjectsTaught?: string[] }
  | {
      firstName: string
      lastName: string
      email: string
      password: string
      teacherCode?: string
      phone?: string
      subjectIds?: string[]
      subjectsTaught?: string[]
    }

/**
 * Update payload. `teacherCode` is canonical; `employeeId` is a deprecated
 * alias the current UI sends.
 */
export interface UpdateTeacherPayload {
  teacherCode?: string
  /** @deprecated Prefer `teacherCode`. */
  employeeId?: string
  subjectIds?: string[]
  /** @deprecated Prefer `subjectIds`. */
  subjectsTaught?: string[]
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  status?: 'active' | 'inactive' | 'Active' | 'Inactive' | 'On Leave' | 'on leave'
}

/**
 * Query parameters for `GET /teachers`.
 */
export interface ListTeachersQuery {
  search?: string
  department?: string
  status?: 'active' | 'inactive'
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'teacherCode' | 'firstName' | 'lastName'
  sortOrder?: 'asc' | 'desc'
}