// src/features/attendance/PendingExcuseRequests.tsx
import { pendingExcuseRequests } from '@/services/attendanceMockData'

function statusClass(status: string) {
  switch (status) {
    case 'Approved':
      return 'bg-success/15 text-success'
    case 'Rejected':
      return 'bg-error/15 text-error'
    default:
      return 'bg-warning/15 text-warning'
  }
}

export default function PendingExcuseRequests() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-fg">Pending Excuse Requests</h2>
        <p className="text-sm text-fg-muted">Review parent-submitted absence excuses</p>
      </div>

      <div className="space-y-4">
        {pendingExcuseRequests.map((request) => (
          <div
            key={request.id}
            className="group flex items-center justify-between rounded-3xl glass-sm p-6 transition-all duration-300 ease-out hover:shadow-(--glass-strong-shadow)"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-info/15 text-info font-semibold transition-transform duration-300 ease-out group-hover:scale-105 shadow-sunken">
                {request.avatar}
              </div>
              <div>
                <p className="font-semibold text-fg">{request.name}</p>
                <p className="text-sm text-fg-muted">
                  {request.grade} · {request.dateRange}
                </p>
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