import { apiClient, apiUpload } from '@/lib/apiClient'

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
  logoUrl?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  academicYear: string
  settings?: SchoolSettings
}

export interface SchoolModel extends SchoolPayload {
  id: string
  createdAt: string
  updatedAt: string
}

export const schoolService = {
  // READ
  getSchool: () => apiClient.get<SchoolModel>('/schools'),

  // CREATE-OR-UPDATE (singleton upsert)
  saveSchool: (payload: Partial<SchoolPayload>) =>
    apiClient.patch<SchoolModel>('/setup/school/setup', payload),
  updateSchool: (payload: Partial<SchoolPayload>) => apiClient.patch<SchoolModel>('/schools', payload),

  // LOGO
  uploadLogo: (file: File) => {
    const formData = new FormData()
    formData.append('logo', file)
    return apiUpload<SchoolModel>('/schools/logo', formData)
  },
  removeLogo: () => apiClient.delete<SchoolModel>('/schools/logo'),
}