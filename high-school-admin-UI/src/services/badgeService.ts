// src/services/badgeService.ts
import { apiClient } from '@/lib/apiClient'

export interface BadgeCounts {
  'leave-requests': number
  messages: number
}

/**
 * Best-effort count fetch. A missing endpoint, 404, or 500 returns 0 rather
 * than crashing the sidebar — badges are informational, not load-bearing.
 *
 * The backend wraps every success in `{ success: true, data: <payload> }`,
 * and `apiClient` unwraps to `data` before returning. So the shape here is
 * the payload directly: `{ count: N }`.
 */
async function safeCount(path: string): Promise<number> {
  try {
    const result = await apiClient.get<{ count: number }>(path)
    return result?.count ?? 0
  } catch {
    return 0
  }
}

export const badgeService = {
  // Backend mounts the leave-request router at `/leaves` (see
  // src/routes/index.ts) and exposes `/pending/count` inside it. There is
  // no `/leave-requests` mount.
  leaveRequestsPending: () => safeCount('/leaves/pending/count'),

  // There is no `/messages` module in the backend. Per-user unread items
  // live in the notifications module, which now exposes `/unread/count`.
  messagesUnread: () => safeCount('/notifications/unread/count'),
}