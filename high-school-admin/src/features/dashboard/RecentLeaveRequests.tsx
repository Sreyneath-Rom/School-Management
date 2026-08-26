import { leaveRequests } from '@/services/mockData'

function statusClass(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-success/20 text-success'
    case 'Rejected':
      return 'bg-error/20 text-error'
    default:
      return 'bg-warning/20 text-warning'
  }
}

export default function RecentLeaveRequests() {
  return (
    <section className="glass rounded-[28px] p-6 text-text-main">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text-main">Pending Leave Requests</h2>
        <p className="text-sm text-text-main/70">Review student leave requests quickly</p>
      </div>

      <div className="space-y-4">
        {leaveRequests.map((request) => (
          <div
            key={request.id}
            className="glass glass-interactive flex items-center justify-between rounded-3xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300 font-semibold">
                {request.avatar}
              </div>
              <div>
                <p className="font-semibold text-text-main">{request.name}</p>
                <p className="text-sm text-text-main/70">{request.grade} · {request.dateRange}</p>
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