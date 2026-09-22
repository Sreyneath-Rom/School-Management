// src/features/dashboard/RecentLeaveRequests.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, FileClock } from 'lucide-react'
import EmptyState from '@/components/common/EmptyState'
import { ListCardSkeleton } from '@/components/common/Skeleton'
import { leaveRequestService } from '@/services/leaveRequestService'
import type { LeaveRequest, LeaveStatus } from '@/types/leaveRequest'

function statusClasses(status: LeaveStatus): string {
  switch (status) {
    case 'APPROVED': return 'bg-success/15 text-success border border-success/25'
    case 'REJECTED': return 'bg-error/15 text-error border border-error/25'
    default:         return 'bg-warning/15 text-warning border border-warning/25'
  }
}

function statusLabel(status: LeaveStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return s.getTime() === e.getTime() ? fmt(s) : `${fmt(s)} – ${fmt(e)}`
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export default function RecentLeaveRequests() {
  const [items, setItems] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    leaveRequestService
      .list({ status: 'PENDING', limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((rows) => { if (!cancelled) setItems(rows) })
      .catch(() => { if (!cancelled) setItems([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <ListCardSkeleton rows={3} />

  return (
    <section className="rounded-3xl glass p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-fg">Student Leave Requests</h2>
            {items.length > 0 && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold text-warning border border-warning/25">
                {items.length} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-fg-muted">Absence authorizations & medical notes</p>
        </div>
        <Link
          to="/students/leave-requests"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Manage</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={FileClock}
          title="No pending requests"
          description="New leave requests will appear here."
          variant="compact"
        />
      ) : (
        <div className="space-y-3">
          {items.map((request) => {
            const name = request.student
              ? `${request.student.user.firstName} ${request.student.user.lastName}`.trim()
              : 'Unknown student'
            const grade = request.student?.class?.name ?? '—'

            return (
              // Was `border border-surface bg-surface` — both no-ops.
              // Sunken well now, matching the sibling list rows.
              <div
                key={request.id}
                className="flex items-center justify-between gap-3 rounded-2xl p-3.5 shadow-sunken"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 font-bold text-brand-600 dark:text-brand-300 text-xs">
                    {initials(name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-fg leading-tight truncate">{name}</p>
                    <p className="text-[11px] text-fg-muted leading-snug mt-0.5">
                      {grade} • {formatDateRange(request.startDate, request.endDate)}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${statusClasses(request.status)}`}>
                  {statusLabel(request.status)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}