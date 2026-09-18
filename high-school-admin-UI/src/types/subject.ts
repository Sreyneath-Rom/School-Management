// src/types/subject.ts

/**
 * A subject as returned by the backend.
 *
 * `teachers` is an array of synthetic display objects, not real Teacher
 * records — the `id` is derived from the name. Do not use it as a foreign
 * key. See the subjects module's design note for the migration plan to a
 * proper join table.
 */
export interface Subject {
  id: string
  name: string
  code: string
  department: string
  category: 'Core' | 'Elective' | 'AP / Advanced'
  description: string | null
  credits: number
  weeklyHours: number
  gradeLevel: string
  teachers: Array<{
    id: string // synthetic — not a Teacher.id
    name: string
    label: string // 2-letter initial
    color: string
  }>
  createdAt: string
  updatedAt: string
}

/**
 * Payload for creating or updating a subject.
 *
 * `teachers` is a list of teacher NAMES, not ids — the backend resolves
 * them and rejects the request if any name doesn't match a real Teacher.
 */
export interface CreateSubjectPayload {
  name: string
  code: string
  department?: string
  category?: 'Core' | 'Elective' | 'AP / Advanced'
  description?: string
  credits?: number
  weeklyHours?: number
  gradeLevel?: string
  teachers?: string[]
}

export type UpdateSubjectPayload = Partial<CreateSubjectPayload>

/**
 * Query parameters for `GET /subjects`.
 */
export interface ListSubjectsQuery {
  department?: string
  category?: 'Core' | 'Elective' | 'AP / Advanced'
  search?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'code' | 'department' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}