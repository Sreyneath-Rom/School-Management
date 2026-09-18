// src/types/class.ts

/**
 * A class section, as returned by `GET /classes`.
 */
export interface ClassRecord {
  id: string
  name: string
  gradeLevel: number
  capacity: number | null
  homeroomTeacherId: string | null
  createdAt: string
  updatedAt: string

  // Hydrated relations
  homeroomTeacher?: {
    id: string
    teacherCode: string
    user: { id: string; firstName: string; lastName: string; email: string }
  } | null

  // Populated on list responses — student count per class
  _count?: {
    students: number
  }
}

/**
 * Payload for creating a class.
 *
 * The backend rejects duplicate `(name, gradeLevel)` combinations.
 */
export interface CreateClassPayload {
  name: string
  gradeLevel: number
  capacity?: number | null
  homeroomTeacherId?: string | null
}

export type UpdateClassPayload = Partial<CreateClassPayload>

/**
 * Query parameters for `GET /classes`.
 */
export interface ListClassesQuery {
  gradeLevel?: number
  search?: string
  homeroomTeacherId?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'gradeLevel' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}