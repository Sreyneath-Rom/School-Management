import { upcomingEvents } from '../../services/mockData'

export default function UpcomingEvents() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Daily Schedule</h2>
          <p className="text-sm text-slate-500">Wednesday, July 1</p>
        </div>
        <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          View Full Schedule
        </button>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-3xl bg-slate-900 text-white">
                <span className="text-sm font-semibold">{event.day}</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-200">{event.month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{event.title}</p>
                <p className="text-sm text-slate-500">{event.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
