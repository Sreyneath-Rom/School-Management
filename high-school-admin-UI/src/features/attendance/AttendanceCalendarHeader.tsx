// src/features/attendance/AttendanceCalendarHeader.tsx
import { useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarDays,
  Download,
} from 'lucide-react'

interface AttendanceCalendarHeaderProps {
  selectedDate: string
  onDateChange: (date: string) => void
  viewMode: 'roster' | 'schedule'
  onViewModeChange: (mode: 'roster' | 'schedule') => void
  attendanceRate: number
  totalStudents: number
  presentCount: number
  onExportClick?: () => void
}

export default function AttendanceCalendarHeader({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  attendanceRate,
  totalStudents,
  presentCount,
  onExportClick,
}: AttendanceCalendarHeaderProps) {
  const currentDateObj = useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    return new Date(year, month - 1, day)
  }, [selectedDate])

  const todayStr = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [])

  const formattedLongDate = useMemo(
    () =>
      currentDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [currentDateObj]
  )

  const weekDays = useMemo(() => {
    const days: { dateStr: string; dayName: string; dayNum: number; isToday: boolean; isSelected: boolean }[] = []
    const start = new Date(currentDateObj)
    const dayOfWeek = start.getDay()
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    start.setDate(start.getDate() + diffToMonday)

    for (let i = 0; i < 5; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dayVal = String(d.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${dayVal}`
      days.push({
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      })
    }
    return days
  }, [currentDateObj, selectedDate, todayStr])

  const handlePrevDay = () => {
    const prev = new Date(currentDateObj)
    prev.setDate(prev.getDate() - 1)
    const y = prev.getFullYear()
    const m = String(prev.getMonth() + 1).padStart(2, '0')
    const d = String(prev.getDate()).padStart(2, '0')
    onDateChange(`${y}-${m}-${d}`)
  }

  const handleNextDay = () => {
    const next = new Date(currentDateObj)
    next.setDate(next.getDate() + 1)
    const y = next.getFullYear()
    const m = String(next.getMonth() + 1).padStart(2, '0')
    const d = String(next.getDate()).padStart(2, '0')
    onDateChange(`${y}-${m}-${d}`)
  }

  const handleToday = () => onDateChange(todayStr)
  const isToday = selectedDate === todayStr

  return (
    <div className="glass rounded-2xl p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl p-1 shadow-sunken">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 rounded-lg text-fg-muted hover:text-fg transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isToday
                  ? 'bg-brand-600 text-white'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 rounded-lg text-fg-muted hover:text-fg transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center">
            <CalendarIcon className="w-4 h-4 absolute left-3 text-fg-muted pointer-events-none z-10" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm font-medium text-fg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-fg tracking-tight">{formattedLongDate}</h1>
            <p className="text-xs text-fg-muted flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  attendanceRate >= 90 ? 'bg-success' : attendanceRate >= 75 ? 'bg-warning' : 'bg-error'
                }`}
              />
              <span>
                {presentCount} of {totalStudents} students present ({attendanceRate}% attendance)
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end lg:self-center">
          <div className="flex items-center rounded-xl p-1 shadow-sunken">
            <button
              onClick={() => onViewModeChange('roster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'roster'
                  ? 'text-brand-700 dark:text-brand-300 font-bold shadow-sunken'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Marking Roster</span>
            </button>
            <button
              onClick={() => onViewModeChange('schedule')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'schedule'
                  ? 'text-brand-700 dark:text-brand-300 font-bold shadow-sunken'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Periods & Classes</span>
            </button>
          </div>

          {onExportClick && (
            <button
              onClick={onExportClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-fg glass-sm glass-interactive cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-medium text-fg-muted uppercase tracking-wider shrink-0 hidden sm:inline-block">
          School Week
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          {weekDays.map((day) => (
            <button
              key={day.dateStr}
              onClick={() => onDateChange(day.dateStr)}
              className={`flex flex-col items-center justify-center min-w-15.5 sm:min-w-18.5 py-2 px-2.5 rounded-xl transition-all text-center cursor-pointer ${
                day.isSelected
                  ? 'text-brand-700 dark:text-brand-300 shadow-sunken'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase">{day.dayName}</span>
              <span className="text-base font-bold text-fg mt-0.5">{day.dayNum}</span>
              {day.isToday && (
                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}