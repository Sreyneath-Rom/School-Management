import { apiClient } from '@/lib/apiClient'

export interface SchoolSettings {
  schoolCode?: string
  academicTerm?: string
  motto?: string
  description?: string
  website?: string
  language?: string
  timeZone?: string
  dateFormat?: string
}

export interface SchoolPayload {
  name: string
  logoUrl?: string
  address?: string
  phone?: string
  email?: string
  academicYear: string
  settings?: SchoolSettings
}

export interface SchoolModel extends SchoolPayload {
  id: string
  createdAt: string
  updatedAt: string
}

export const schoolService = {
  getSchool: () => apiClient.get<SchoolModel>('/schools'),
  updateSchool: (payload: Partial<SchoolPayload>) => apiClient.patch<SchoolModel>('/schools', payload),
}
