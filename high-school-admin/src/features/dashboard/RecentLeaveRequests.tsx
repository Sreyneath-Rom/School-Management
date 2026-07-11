import { leaveRequests } from '@/services/mockData'

function statusClass(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-100 text-emerald-700'
    case 'Rejected':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

export default function RecentLeaveRequests() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Pending Leave Requests</h2>
        <p className="text-sm text-slate-600">Review student leave requests quickly</p>
      </div>

      <div className="space-y-4">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between rounded-3xl glass-sm p-6 transition hover:bg-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400/20 backdrop-blur-md text-sky-700 font-semibold">
                {request.avatar}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{request.name}</p>
                <p className="text-sm text-slate-600">{request.grade} · {request.dateRange}</p>
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