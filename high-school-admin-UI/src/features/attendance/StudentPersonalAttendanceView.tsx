import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileQuestion,
  Printer,
  Download,
  FileClock,
  TrendingUp,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface PersonalAttendanceDay {
  id: string
  date: string
  dayOfWeek: string
  status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT'
  checkIn: string | null
  checkOut: string | null
  periodCount: number
  note: string | null
}

const MOCK_STUDENT_ATTENDANCE_LOG: PersonalAttendanceDay[] = [
  { id: '1', date: '2025-10-24', dayOfWeek: 'Friday', status: 'PRESENT', checkIn: '07:54 AM', checkOut: '03:30 PM', periodCount: 7, note: 'All periods attended' },
  { id: '2', date: '2025-10-23', dayOfWeek: 'Thursday', status: 'PRESENT', checkIn: '07:50 AM', checkOut: '03:30 PM', periodCount: 7, note: null },
  { id: '3', date: '2025-10-22', dayOfWeek: 'Wednesday', status: 'LATE', checkIn: '08:15 AM', checkOut: '03:30 PM', periodCount: 7, note: 'Bus delay pass presented' },
  { id: '4', date: '2025-10-21', dayOfWeek: 'Tuesday', status: 'PRESENT', checkIn: '07:52 AM', checkOut: '03:30 PM', periodCount: 7, note: null },
  { id: '5', date: '2025-10-20', dayOfWeek: 'Monday', status: 'PRESENT', checkIn: '07:48 AM', checkOut: '03:30 PM', periodCount: 7, note: null },
  { id: '6', date: '2025-10-17', dayOfWeek: 'Friday', status: 'EXCUSED', checkIn: null, checkOut: null, periodCount: 7, note: 'Approved medical dental appointment' },
  { id: '7', date: '2025-10-16', dayOfWeek: 'Thursday', status: 'PRESENT', checkIn: '07:55 AM', checkOut: '03:30 PM', periodCount: 7, note: null },
  { id: '8', date: '2025-10-15', dayOfWeek: 'Wednesday', status: 'PRESENT', checkIn: '07:51 AM', checkOut: '03:30 PM', periodCount: 7, note: null },
  { id: '9', date: '2025-10-14', dayOfWeek: 'Tuesday', status: 'PRESENT', checkIn: '07:53 AM', checkOut: '03:30 PM', periodCount: 7, note: null },
  { id: '10', date: '2025-10-13', dayOfWeek: 'Monday', status: 'PRESENT', checkIn: '07:49 AM', checkOut: '03:30 PM', periodCount: 7, note: null },
]

export default function StudentPersonalAttendanceView() {
  const { user } = useAuth()
  const [filterMonth, setFilterMonth] = useState('October 2025')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const studentName = user?.name || 'Emily Watson'
  const studentCode = 'STU-1001'
  const className = 'Grade 10 - A'

  const filteredLogs = useMemo(() => {
    return MOCK_STUDENT_ATTENDANCE_LOG.filter((log) => {
      const matchStatus = statusFilter === 'ALL' || log.status === statusFilter
      const matchSearch =
        log.date.includes(searchQuery) ||
        log.dayOfWeek.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.note && log.note.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchStatus && matchSearch
    })
  }, [statusFilter, searchQuery])

  // Summary figures
  const totalLogged = MOCK_STUDENT_ATTENDANCE_LOG.length
  const presentCount = MOCK_STUDENT_ATTENDANCE_LOG.filter((d) => d.status === 'PRESENT').length
  const lateCount = MOCK_STUDENT_ATTENDANCE_LOG.filter((d) => d.status === 'LATE').length
  const excusedCount = MOCK_STUDENT_ATTENDANCE_LOG.filter((d) => d.status === 'EXCUSED').length
  const absentCount = MOCK_STUDENT_ATTENDANCE_LOG.filter((d) => d.status === 'ABSENT').length
  const attendancePercentage = (((presentCount + lateCount) / totalLogged) * 100).toFixed(1)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Student Banner */}
      <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                My Attendance Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {studentName} • {studentCode} • Enrolled in {className} (BR-09 Private Record)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/student/leave-requests"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium shadow-xs transition"
          >
            <FileClock className="w-4 h-4" />
            Request Leave / Excuse Note
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 transition"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Overall Rate</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {attendancePercentage}%
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Good Standing
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Present Days</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{presentCount}</span>
            <span className="text-xs text-slate-400">/ {totalLogged} days</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full daily attendance</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Late Arrivals</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lateCount}</span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">After 08:00 AM bell</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Excused Absence</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{excusedCount}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Documented medical / leave</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Unexcused Absences</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{absentCount}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Zero unauthorized absences</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Period:</span>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="October 2025">October 2025 (Current)</option>
            <option value="September 2025">September 2025</option>
            <option value="All Term 1">All Semester 1</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'PRESENT', 'LATE', 'EXCUSED', 'ABSENT'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search dates, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Date & Day</th>
                <th className="py-3 px-3 font-semibold">Check-In Arrival</th>
                <th className="py-3 px-3 font-semibold">Check-Out Departure</th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Remarks & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    <div>{log.date}</div>
                    <span className="text-[11px] text-slate-400">{log.dayOfWeek}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-mono">
                    {log.checkIn || '—'}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-mono">
                    {log.checkOut || '—'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                        log.status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : log.status === 'LATE'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : log.status === 'EXCUSED'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {log.status === 'PRESENT' && <CheckCircle2 className="w-3 h-3" />}
                      {log.status === 'LATE' && <Clock className="w-3 h-3" />}
                      {log.status === 'EXCUSED' && <FileQuestion className="w-3 h-3" />}
                      {log.status === 'ABSENT' && <AlertTriangle className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {log.note || <span className="text-slate-300 italic">No notes</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
