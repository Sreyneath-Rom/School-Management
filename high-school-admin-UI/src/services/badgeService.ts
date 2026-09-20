// src/services/badgeService.ts
import { apiClient } from '@/lib/apiClient'

export interface BadgeCounts {
  'leave-requests': number
  messages: number
}

async function safeCount(path: string): Promise<number> {
  try {
    const result = await apiClient.get<{ count: number }>(path)
    return result?.count ?? 0
  } catch {
    return 0
  }
}

export const badgeService = {
  leaveRequestsPending: () => safeCount('/leave-requests/pending/count'),
  messagesUnread: () => safeCount('/messages/unread/count'),
}