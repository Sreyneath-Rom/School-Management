import { upcomingEvents } from '@/services/mockData'
import { ListCardSkeleton } from '@/components/common/Skeleton'
import { Calendar, Clock, MapPin, ChevronRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface UpcomingEventsProps {
  loading?: boolean
}

export default function UpcomingEvents({ loading }: UpcomingEventsProps = {}) {
  if (loading) {
    return <ListCardSkeleton rows={3} />
  }

  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-surface">
        <div>
          <h2 className="text-base font-bold text-color">
            Upcoming Events
          </h2>
          <p className="text-xs text-secondary">
            Institutional timeline & schedules
          </p>
        </div>

        <Link
          to="/calendar"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Calendar</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="group flex items-start gap-3.5 rounded-2xl border border-surface bg-surface p-3.5 transition hover:border-brand-500/30"
          >
            {/* Calendar date badge */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-xs">
              <span className="text-sm font-black leading-none">{event.day}</span>
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-white/90 mt-0.5">
                {event.month}
              </span>
            </div>

            {/* Event details */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-color leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {event.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-secondary">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {event.time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={11} />
                  Main Auditorium
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
