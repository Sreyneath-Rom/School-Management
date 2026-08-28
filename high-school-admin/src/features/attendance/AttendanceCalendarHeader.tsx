import React, { useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarDays,
  Download,
} from 'lucide-react'

interface AttendanceCalendarHeaderProps {
  selectedDate: string // YYYY-MM-DD
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
  // Parse current selected date
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

  // Format date display: e.g. "Friday, August 28, 2026"
  const formattedLongDate = useMemo(() => {
    return currentDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [currentDateObj])

  // Generate 5-day school week strip (Mon-Fri)
  const weekDays = useMemo(() => {
    const days: { dateStr: string; dayName: string; dayNum: number; isToday: boolean; isSelected: boolean }[] = []
    const start = new Date(currentDateObj)
    // Find Monday of the current week (0 = Sunday, 1 = Monday)
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

  const handleToday = () => {
    onDateChange(todayStr)
  }

  const isToday = selectedDate === todayStr

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all mb-6">
      {/* Top row: Date navigation + Actions + View switch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        {/* Date Navigator */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isToday
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="relative flex items-center">
            <CalendarIcon className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Formatted Date Title */}
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {formattedLongDate}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  attendanceRate >= 90 ? 'bg-emerald-500' : attendanceRate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
              <span>
                {presentCount} of {totalStudents} students present ({attendanceRate}% attendance)
              </span>
            </p>
          </div>
        </div>

        {/* Right side: View Mode & Export */}
        <div className="flex items-center gap-2.5 self-end lg:self-center">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => onViewModeChange('roster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'roster'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Marking Roster</span>
            </button>
            <button
              onClick={() => onViewModeChange('schedule')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'schedule'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Periods & Classes</span>
            </button>
          </div>

          {onExportClick && (
            <button
              onClick={onExportClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Week Day Strip (Mon-Fri) */}
      <div className="pt-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline-block">
          School Week
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          {weekDays.map((day) => (
            <button
              key={day.dateStr}
              onClick={() => onDateChange(day.dateStr)}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[74px] py-2 px-2.5 rounded-xl border transition-all text-center cursor-pointer ${
                day.isSelected
                  ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500/50 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20 shadow-xs'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase">{day.dayName}</span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {day.dayNum}
              </span>
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
