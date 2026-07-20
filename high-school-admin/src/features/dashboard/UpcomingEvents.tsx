import { upcomingEvents } from '@/services/mockData'
import Button from '@/components/common/Button'

export default function UpcomingEvents() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Daily Schedule</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Wednesday, July 1</p>
        </div>
        <Button>View Full Schedule</Button>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="group rounded-3xl glass-sm p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50/60 hover:shadow-[0_16px_35px_-15px_rgba(15,23,42,0.2)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-3xl bg-sky-600 text-white shadow-[0_8px_20px_-6px_rgba(2,132,199,0.6)] transition-transform duration-300 ease-out group-hover:scale-105">
                <span className="text-sm font-semibold">{event.day}</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-200">{event.month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{event.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}