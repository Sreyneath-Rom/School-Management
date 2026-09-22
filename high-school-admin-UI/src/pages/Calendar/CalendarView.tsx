// src/pages/Calendar/CalendarView.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  X,
  Edit3,
  Trash2,
  CalendarDays,
  Bell,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  eventService,
  type SchoolEvent,
  type EventCategory,
} from '@/services/eventService'

/* Category tints are semantic distinctions, not surfaces — kept. */
const CATEGORY_COLORS: Record<
  EventCategory,
  { bg: string; text: string; dot: string }
> = {
  Academic: {
    bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/40',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
  },
  Exam: {
    bg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/40',
    text: 'text-purple-600',
    dot: 'bg-purple-500',
  },
  Holiday: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },
  Extracurricular: {
    bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  Meeting: {
    bg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
  },
}

const CATEGORY_FILTERS: Array<'All' | EventCategory> = [
  'All', 'Academic', 'Exam', 'Holiday', 'Extracurricular', 'Meeting',
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/* Hairline seam on the right and bottom of every cell. Both axes are
   drawn because the grid has no gap — the "inner" borders between
   cells need to come from one side or the other, not both. */
const CELL_SEAM =
  'shadow-[1px_0_0_var(--neu-shadow-dark),0_1px_0_var(--neu-shadow-dark)]'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function CalendarView() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [events, setEvents] = useState<SchoolEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All')
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month')

  const now = new Date()
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())

  const [activeEvent, setActiveEvent] = useState<SchoolEvent | null>(null)

  const todayStr = toDateString(now)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await eventService.list()
      setEvents(list)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1) }
    else setCurrentMonth((m) => m - 1)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1) }
    else setCurrentMonth((m) => m + 1)
  }

  const handleToday = () => {
    const t = new Date()
    setCurrentYear(t.getFullYear())
    setCurrentMonth(t.getMonth())
  }

  const filteredEvents = useMemo(
    () => selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory),
    [events, selectedCategory]
  )

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventService.delete(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
      setActiveEvent(null)
      showToast('Event removed', 'info')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to delete event.'
      showToast(msg, 'error')
    }
  }

  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const cells: Array<{ day: number | null; dateStr: string }> = []
    for (let i = 0; i < firstDayOfWeek; i++) cells.push({ day: null, dateStr: '' })
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        dateStr: `${currentYear}-${pad(currentMonth + 1)}-${pad(d)}`,
      })
    }
    return cells
  }, [currentYear, currentMonth])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="School Calendar"
          subtitle="Institutional milestones, examinations, holidays, and meetings."
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View toggle: sunken tray, active segment brand-filled */}
          <div className="flex items-center rounded-xl p-1 text-xs font-semibold shadow-sunken">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              List
            </button>
          </div>

          <Link
            to="/calendar/events/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm shadow-brand-600/25 transition"
          >
            <Plus size={16} />
            <span>Add Event</span>
          </Link>
        </div>
      </div>

      {/* Navigation + filter bar — border removed (was invisible) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl glass-sm">
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-fg px-2 min-w-40 text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              title="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-fg shadow-sunken hover:shadow-emboss transition cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                  : 'text-fg-muted hover:text-fg hover:shadow-sunken'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="rounded-2xl glass-sm p-16 text-center text-sm text-fg-muted">
          Loading calendar...
        </div>
      ) : error ? (
        // Semantic error — tinted, kept
        <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
          <p className="text-sm font-bold text-error">Couldn't load the calendar</p>
          <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
          <button
            onClick={load}
            className="mt-3 rounded-xl bg-error px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : viewMode === 'month' ? (
        <div className="rounded-2xl glass-sm overflow-hidden">
          {/* Day-of-week header: bottom shadow seam */}
          <div className="grid grid-cols-7 shadow-[0_1px_0_var(--neu-shadow-dark)] text-center text-[11px] font-semibold tracking-wider text-fg-muted uppercase py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Cell grid: each cell draws its own right+bottom seam */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((cell, idx) => {
              if (!cell.day) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className={`min-h-26 p-2 ${CELL_SEAM}`}
                  />
                )
              }

              const dayEvents = filteredEvents.filter((e) => e.date === cell.dateStr)
              const isToday = cell.dateStr === todayStr

              return (
                <div
                  key={cell.dateStr}
                  className={`min-h-26 p-2 transition-shadow flex flex-col justify-between ${CELL_SEAM} ${
                    isToday
                      ? 'bg-brand-500/5'
                      : 'hover:shadow-sunken'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isToday
                          ? 'bg-brand-600 text-white font-bold'
                          : 'text-fg'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-fg-muted font-mono">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-20">
                    {dayEvents.map((evt) => {
                      const col = CATEGORY_COLORS[evt.category]
                      return (
                        <button
                          key={evt.id}
                          onClick={() => setActiveEvent(evt)}
                          className={`w-full text-left px-2 py-1 rounded-lg border text-[11px] font-medium truncate flex items-center gap-1.5 transition hover:scale-[1.02] cursor-pointer ${col.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                          <span className="truncate">{evt.title}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {events.length === 0 && (
            <div className="p-8 text-center text-fg-muted text-xs shadow-[0_-1px_0_var(--neu-shadow-dark)]">
              No events scheduled. Add one to get started.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-fg-muted rounded-2xl glass-sm">
              No events found for the chosen category.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const col = CATEGORY_COLORS[evt.category]
              return (
                <div
                  key={evt.id}
                  onClick={() => setActiveEvent(evt)}
                  className="p-4 rounded-2xl glass-sm glass-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${col.bg} shrink-0`}>
                      <CalendarDays size={20} className={col.text} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-fg">{evt.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${col.bg}`}>
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">
                        {evt.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-fg-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={12} /> {evt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />{' '}
                          {evt.isAllDay ? 'All day' : `${evt.startTime} - ${evt.endTime}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {evt.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {evt.targetAudience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/calendar/events/${evt.id}/edit`)
                      }}
                      className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteEvent(evt.id)
                      }}
                      className="p-1.5 rounded-lg text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Detail modal — flat scrim, `.glass-strong` panel (border + shadow-2xl removed) */}
      {activeEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setActiveEvent(null) }}
        >
          <div className="w-full max-w-md rounded-2xl glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between pb-3 shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[activeEvent.category].bg}`}>
                {activeEvent.category}
              </span>
              <button
                onClick={() => setActiveEvent(null)}
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-fg">{activeEvent.title}</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                {activeEvent.description}
              </p>

              {/* Info panel → sunken well */}
              <div className="p-3.5 rounded-xl shadow-sunken space-y-2 text-xs">
                <div className="flex items-center gap-2 text-fg">
                  <CalendarIcon size={14} className="text-fg-muted" />
                  <span className="font-semibold">{activeEvent.date}</span>
                  <span className="text-fg-muted">•</span>
                  <span>
                    {activeEvent.isAllDay
                      ? 'All day'
                      : `${activeEvent.startTime} - ${activeEvent.endTime}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-fg">
                  <MapPin size={14} className="text-fg-muted" />
                  <span>{activeEvent.location}</span>
                </div>
                <div className="flex items-center gap-2 text-fg">
                  <Users size={14} className="text-fg-muted" />
                  <span>Audience: <strong>{activeEvent.targetAudience}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-fg">
                  <Bell size={14} className="text-fg-muted" />
                  <span>Organizer: <strong>{activeEvent.organizer}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
              <button
                onClick={() => handleDeleteEvent(activeEvent.id)}
                className="text-xs font-semibold text-error hover:underline cursor-pointer"
              >
                Delete
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/calendar/events/${activeEvent.id}/edit`)}
                  className="glass-sm glass-interactive px-3.5 py-1.5 rounded-xl text-fg text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => setActiveEvent(null)}
                  className="px-4 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}