import { leaveRequests } from '@/services/mockData'

function statusClass(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-700/10'
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-700/10'
    default:
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-700/10'
  }
}

export default function RecentLeaveRequests() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Pending Leave Requests</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Review student leave requests quickly</p>
      </div>

      <div className="space-y-4">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="group flex items-center justify-between rounded-3xl glass-sm p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50/60 hover:shadow-[0_16px_35px_-15px_rgba(15,23,42,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-700/15 text-sky-700 ring-1 ring-sky-700/15 font-semibold transition-transform duration-300 ease-out group-hover:scale-105">
                {request.avatar}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{request.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{request.grade} · {request.dateRange}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
              {request.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}