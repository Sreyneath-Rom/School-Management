// src/pages/Academic/Schedules.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarDays, RefreshCw } from 'lucide-react'

import { scheduleService } from '@/services/scheduleService'
import { classService, type ClassRecord } from '@/services/classService'
import { useTranslations } from '@/i18n'
import { useNotification } from '@/hooks/useNotification'

interface RawSchedule {
  id: string
  dayOfWeek?: unknown
  startTime?: string | null
  endTime?: string | null
  room?: string | null
  subject?: { id?: string; name?: string } | null
  class?: { id?: string; name?: string } | null
  teacher?: { id?: string; user?: { firstName?: string; lastName?: string } } | null
}

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const
const DAY_LABEL: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
}

const DAY_NAME_TO_NUMBER: Record<string, number> = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
}

function normalizeDay(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6) return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    const numeric = Number(trimmed)
    if (!Number.isNaN(numeric) && Number.isInteger(numeric) && numeric >= 0 && numeric <= 6) return numeric
    const named = DAY_NAME_TO_NUMBER[trimmed.toUpperCase()]
    if (named !== undefined) return named
  }
  return null
}

function timeOf(value: string | null | undefined): string {
  if (!value) return ''
  return value.includes('T') ? value.slice(11, 16) : value.slice(0, 5)
}

function teacherName(teacher: RawSchedule['teacher']): string {
  if (!teacher?.user) return ''
  return `${teacher.user.firstName ?? ''} ${teacher.user.lastName ?? ''}`.trim()
}

export default function Schedules() {
  const { t } = useTranslations()
  const { error: notifyError } = useNotification()

  const [schedules, setSchedules] = useState<RawSchedule[]>([])
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [classId, setClassId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    classService
      .list()
      .then((rows) => { if (!cancelled) setClasses(Array.isArray(rows) ? rows : []) })
      .catch(() => { if (!cancelled) setClasses([]) })
    return () => { cancelled = true }
  }, [])

  const loadSchedules = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await scheduleService.list(classId ? { classId } : undefined)
      setSchedules(Array.isArray(rows) ? (rows as unknown as RawSchedule[]) : [])
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      setSchedules([])
      notifyError('Unable to load schedules.')
    } finally {
      setLoading(false)
    }
  }, [classId, notifyError])

  useEffect(() => { loadSchedules() }, [loadSchedules])

  const grouped = useMemo(() => {
    const byDay = new Map<number, RawSchedule[]>()
    for (const row of schedules) {
      const day = normalizeDay(row.dayOfWeek)
      if (day === null) continue
      const list = byDay.get(day) ?? []
      list.push(row)
      byDay.set(day, list)
    }
    for (const list of byDay.values()) {
      list.sort((a, b) => timeOf(a.startTime).localeCompare(timeOf(b.startTime)))
    }
    return byDay
  }, [schedules])

  const daysWithSchedule = useMemo(() => DAY_ORDER.filter((d) => grouped.has(d)), [grouped])

  const handleRefresh = () => { loadSchedules() }
  const handleRetry = () => { loadSchedules() }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-black tracking-tight text-fg sm:text-xl">
            {t('sidebar.classSchedules')}
          </h1>
          <p className="mt-0.5 text-xs text-fg-muted">Weekly timetable by class</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="h-9.5 rounded-xl px-3 text-xs font-semibold text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="">All classes</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex h-9.5 items-center gap-1.5 rounded-xl glass-sm glass-interactive px-3 text-xs font-semibold text-fg-muted hover:text-fg disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : schedules.length === 0 ? (
        <EmptyState
          title="No schedules yet"
          body={
            classId
              ? 'This class has no scheduled periods. Add schedules from the class detail page.'
              : 'No schedules have been created. Select a class or add a schedule first.'
          }
        />
      ) : (
        <div className="space-y-4">
          {daysWithSchedule.map((day) => {
            const slots = grouped.get(day) ?? []
            return (
              <section key={day} className="overflow-hidden rounded-2xl glass-sm">
                <header className="flex items-center gap-2 px-4 py-2.5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
                  <CalendarDays size={14} className="text-brand-600 dark:text-brand-400" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-fg">
                    {DAY_LABEL[day]}
                  </h2>
                  <span className="ml-auto text-[10px] font-semibold text-fg-muted">
                    {slots.length} {slots.length === 1 ? 'period' : 'periods'}
                  </span>
                </header>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-160 text-left text-xs">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-wider text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
                        <th className="w-28 px-4 py-2">Time</th>
                        <th className="px-4 py-2">Subject</th>
                        <th className="px-4 py-2">Teacher</th>
                        <th className="px-4 py-2">Class</th>
                        <th className="w-24 px-4 py-2">Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--neu-shadow-dark)">
                      {slots.map((slot) => {
                        const start = timeOf(slot.startTime)
                        const end = timeOf(slot.endTime)
                        const teacher = teacherName(slot.teacher)
                        return (
                          <tr
                            key={slot.id}
                            className="transition-shadow hover:shadow-sunken"
                          >
                            <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-fg">
                              {start || '—'}{end ? ` – ${end}` : ''}
                            </td>
                            <td className="px-4 py-2.5 font-medium text-fg">{slot.subject?.name || '—'}</td>
                            <td className="px-4 py-2.5 text-fg-muted">{teacher || '—'}</td>
                            <td className="px-4 py-2.5 text-fg-muted">{slot.class?.name || '—'}</td>
                            <td className="px-4 py-2.5 text-fg-muted">{slot.room || '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Local presentation pieces
// ---------------------------------------------------------------------------

function SkeletonTable() {
  return (
    <div className="space-y-4">
      {[0, 1].map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl glass-sm">
          <div className="h-10 skeleton" />
          <div className="space-y-2 p-4">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-6 skeleton rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    // Semantic error signal — tinted, kept
    <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
      <p className="text-sm font-bold text-error">Couldn't load schedules</p>
      <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-xl bg-error px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 cursor-pointer"
      >
        Retry
      </button>
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    // Dashed border tinted against the shadow pair so it's actually visible
    <div className="rounded-2xl border border-dashed border-(--neu-shadow-dark) p-10 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl text-fg-muted shadow-sunken">
        <CalendarDays size={18} />
      </div>
      <p className="text-sm font-bold text-fg">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-xs text-fg-muted">{body}</p>
    </div>
  )
}