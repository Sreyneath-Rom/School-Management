import { leaveRequests } from '@/services/mockData'
import { ListCardSkeleton } from '@/components/common/Skeleton'
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function statusBadge(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
    case 'Rejected':
      return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
    default:
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
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
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Leave Requests
            </h2>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
              3 Under Review
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Absence authorizations & medical notes
          </p>
        </div>

        <Link
          to="/students/leaves"
          className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          <span>Manage</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-teal-500/30 dark:border-slate-800/80 dark:bg-slate-800/40"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 font-bold text-teal-700 dark:text-teal-300 border border-teal-500/20 text-xs">
                {request.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                  {request.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
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
