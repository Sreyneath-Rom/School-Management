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
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Events
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Institutional timeline & schedules
          </p>
        </div>

        <Link
          to="/calendar"
          className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          <span>Calendar</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="group flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-teal-500/30 hover:bg-slate-100/60 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
          >
            {/* Calendar date badge */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-xs">
              <span className="text-sm font-black leading-none">{event.day}</span>
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-teal-100 mt-0.5">
                {event.month}
              </span>
            </div>

            {/* Event details */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {event.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
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
