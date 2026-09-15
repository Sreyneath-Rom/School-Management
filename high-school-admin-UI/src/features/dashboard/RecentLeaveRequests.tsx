import { leaveRequests } from '@/services/mockData'
import { ListCardSkeleton } from '@/components/common/Skeleton'
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function statusBadge(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-success/10 text-success border-success/20'
    case 'Rejected':
      return 'bg-error/10 text-error border-error/20'
    default:
      return 'bg-warning/10 text-warning border-warning/20'
  }
}

interface RecentLeaveRequestsProps {
  loading?: boolean
}

export default function RecentLeaveRequests({ loading }: RecentLeaveRequestsProps = {}) {
  if (loading) {
    return <ListCardSkeleton rows={3} />
  }

  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-color">
              Student Leave Requests
            </h2>
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning border border-warning/20">
              3 Under Review
            </span>
          </div>
          <p className="text-xs text-secondary">
            Absence authorizations & medical notes
          </p>
        </div>

        <Link
          to="/students/leaves"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Manage</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-surface bg-surface p-3.5 transition hover:border-brand-500/30"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 font-bold text-brand-600 dark:text-brand-300 border border-brand-500/20 text-xs">
                {request.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-color leading-tight truncate">
                  {request.name}
                </p>
                <p className="text-[11px] text-secondary leading-snug mt-0.5">
                  {request.grade} • {request.dateRange}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-bold ${statusBadge(
                request.status
              )}`}
            >
              {request.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
