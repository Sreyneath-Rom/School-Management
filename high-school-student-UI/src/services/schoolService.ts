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

// The backend `school` module is a singleton: GET/PATCH /schools and
// POST|DELETE /schools/logo are the only real endpoints. There is no
// separate POST /schools (create), PATCH /schools/setup, or DELETE
// /schools — PATCH already upserts (creates on first save, updates
// after), and deleting the one School row would break every other table
// that implicitly depends on it existing.
export const schoolService = {
  // READ
  getSchool: () => apiClient.get<SchoolModel>('/schools'),

  // CREATE-OR-UPDATE (singleton upsert)
  saveSchool: (payload: Partial<SchoolPayload>) => apiClient.patch<SchoolModel>('/schools', payload),
  updateSchool: (payload: Partial<SchoolPayload>) => apiClient.patch<SchoolModel>('/schools', payload),

  // LOGO
  uploadLogo: (file: File) => {
    const formData = new FormData()
    formData.append('logo', file)
    return apiUpload<SchoolModel>('/schools/logo', formData)
  },
  removeLogo: () => apiClient.delete<SchoolModel>('/schools/logo'),
}