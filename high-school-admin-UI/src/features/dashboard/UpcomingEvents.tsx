import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarClock } from 'lucide-react'
import EmptyState from '@/components/common/EmptyState'

/**
 * The backend has no events/calendar endpoint yet. This widget will
 * populate once the Calendar module is built — the shape would be a list
 * of upcoming Event rows.
 *
 * Until then, this renders an honest empty state instead of fake rows.
 */
export default function UpcomingEvents() {
  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-surface">
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