// src/services/languagesService.ts
import { apiClient } from '@/lib/apiClient'
import type {
  CreateLanguagePayload,
  Language,
  UpdateLanguagePayload,
} from '@/types/translation'

export type LanguageRecord = Language

export const languagesService = {
  list: () => apiClient.get<LanguageRecord[]>('/languages'),

  create: (payload: CreateLanguagePayload) =>
    apiClient.post<LanguageRecord>('/languages', payload),

  update: (code: string, payload: UpdateLanguagePayload) =>
    apiClient.patch<LanguageRecord>(
      `/languages/${encodeURIComponent(code)}`,
      payload
    ),

  remove: (code: string) =>
    apiClient.delete<void>(`/languages/${encodeURIComponent(code)}`),
}