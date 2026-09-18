// src/components/common/StatusBadge.tsx
import Badge, { type BadgeTone } from './Badge'
import type { Status } from '@/types'

const STATUS_TONE: Record<Status, BadgeTone> = {
  Draft: 'neutral',
  Upcoming: 'info',
  Active: 'success',
  Completed: 'success',
  Archived: 'neutral',
  Inactive: 'error',
}

export default function StatusBadge({ status }: { status: Status }) {
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{status}</Badge>
}