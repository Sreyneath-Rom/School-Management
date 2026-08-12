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
  // Uploads the logo as multipart form data (not JSON/base64), so large
  // images never risk hitting express.json()'s body-size limit.
  uploadLogo: (file: File) => {
    const formData = new FormData()
    formData.append('logo', file)
    return apiUpload<SchoolModel>('/schools/logo', formData)
  },
}