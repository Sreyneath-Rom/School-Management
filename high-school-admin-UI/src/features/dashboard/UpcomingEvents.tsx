// src/features/dashboard/UpcomingEvents.tsx
import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarClock } from 'lucide-react'
import EmptyState from '@/components/common/EmptyState'

export default function UpcomingEvents() {
  return (
    <section className="rounded-3xl glass p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
        <div>
          <h2 className="text-base font-bold text-fg">Upcoming Events</h2>
          <p className="text-xs text-fg-muted">Institutional timeline & schedules</p>
        </div>
        <Link
          to="/calendar"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Calendar</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <EmptyState
        icon={CalendarClock}
        title="No upcoming events"
        description="Events created in the calendar module will appear here."
        variant="compact"
      />
    </section>
  )
}