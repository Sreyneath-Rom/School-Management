import { upcomingEvents } from '@/services/mockData'
import Button from '@/components/common/Button'

export default function UpcomingEvents() {
  return (
    <section className="glass rounded-[28px] p-6 text-text-main">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-main">Daily Schedule</h2>
          <p className="text-sm text-text-main/70">Wednesday, July 1</p>
        </div>
        <Button variant="teal">View Full Schedule</Button>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="glass glass-interactive rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-3xl bg-brand-500 text-white shadow-emboss">
                <span className="text-sm font-semibold">{event.day}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/80">{event.month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text-main">{event.title}</p>
                <p className="text-sm text-text-main/70">{event.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}