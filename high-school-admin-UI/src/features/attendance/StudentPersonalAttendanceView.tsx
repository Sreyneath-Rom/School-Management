// src/features/attendance/StudentPersonalAttendanceView.tsx
import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, Clock, AlertTriangle, FileQuestion, Printer, FileClock,
  TrendingUp, ShieldCheck, Search,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { attendanceService } from '@/services/attendanceService'

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

export default function StudentPersonalAttendanceView() {
  const { user } = useAuth()
  const [filterMonth, setFilterMonth] = useState('All dates')
  const [attendanceLog, setAttendanceLog] = useState<PersonalAttendanceDay[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const studentName = user?.name || 'Emily Watson'
  const studentCode = 'STU-1001'
  const className = 'Grade 10 - A'

  useEffect(() => {
    attendanceService
      .list({ from: '2025-01-01', to: new Date().toISOString().slice(0, 10) })
      .then((records) => {
        setAttendanceLog(
          records.map((record) => ({
            id: record.id,
            date: record.date.slice(0, 10),
            dayOfWeek: new Date(record.date).toLocaleDateString(undefined, { weekday: 'long' }),
            status: record.status,
            checkIn: record.checkIn ?? null,
            checkOut: record.checkOut ?? null,
            periodCount: 0,
            note: record.note ?? null,
          }))
        )
      })
      .catch(() => setAttendanceLog([]))
  }, [])

  const filteredLogs = useMemo(() => {
    return attendanceLog.filter((log) => {
      const matchStatus = statusFilter === 'ALL' || log.status === statusFilter
      const matchSearch =
        log.date.includes(searchQuery) ||
        log.dayOfWeek.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.note && log.note.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchStatus && matchSearch
    })
  }, [attendanceLog, statusFilter, searchQuery])

  const totalLogged = attendanceLog.length
  const presentCount = attendanceLog.filter((d) => d.status === 'PRESENT').length
  const lateCount = attendanceLog.filter((d) => d.status === 'LATE').length
  const excusedCount = attendanceLog.filter((d) => d.status === 'EXCUSED').length
  const absentCount = attendanceLog.filter((d) => d.status === 'ABSENT').length
  const attendancePercentage = (((presentCount + lateCount) / totalLogged) * 100 || 0).toFixed(1)

  const handlePrint = () => window.print()

  return (
    <div className="space-y-6 pb-12 print:p-0">
      <div className="p-5 rounded-3xl glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-[var(--shadow-emboss-sunken)]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-fg">My Attendance Portal</h2>
              <p className="text-xs text-fg-muted mt-0.5">
                {studentName} • {studentCode} • Enrolled in {className} (BR-09 Private Record)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/student/leave-requests"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium shadow-sm shadow-brand-600/20 transition"
          >
            <FileClock className="w-4 h-4" />
            Request Leave / Excuse Note
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl shadow-[var(--shadow-emboss-sunken)]">
          <span className="text-xs font-medium text-fg-muted">Overall Rate</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-success">{attendancePercentage}%</span>
          </div>
          <span className="text-[11px] text-success font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Good Standing
          </span>
        </div>

        <div className="p-4 rounded-2xl shadow-[var(--shadow-emboss-sunken)]">
          <span className="text-xs font-medium text-fg-muted">Present Days</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-fg">{presentCount}</span>
            <span className="text-xs text-fg-muted">/ {totalLogged} days</span>
          </div>
          <span className="text-[11px] text-fg-muted mt-1 block">Full daily attendance</span>
        </div>

        <div className="p-4 rounded-2xl shadow-[var(--shadow-emboss-sunken)]">
          <span className="text-xs font-medium text-fg-muted">Late Arrivals</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-warning">{lateCount}</span>
            <span className="text-xs text-fg-muted">sessions</span>
          </div>
          <span className="text-[11px] text-fg-muted mt-1 block">After 08:00 AM bell</span>
        </div>

        <div className="p-4 rounded-2xl shadow-[var(--shadow-emboss-sunken)]">
          <span className="text-xs font-medium text-fg-muted">Excused Absence</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-info">{excusedCount}</span>
            <span className="text-xs text-fg-muted">days</span>
          </div>
          <span className="text-[11px] text-fg-muted mt-1 block">Documented medical / leave</span>
        </div>

        <div className="p-4 rounded-2xl shadow-[var(--shadow-emboss-sunken)]">
          <span className="text-xs font-medium text-fg-muted">Unexcused Absences</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-fg">{absentCount}</span>
            <span className="text-xs text-fg-muted">days</span>
          </div>
          <span className="text-[11px] text-success mt-1 block">Zero unauthorized absences</span>
        </div>
      </div>

      <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-fg">Period:</span>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  : 'text-fg-muted hover:text-fg hover:shadow-[var(--shadow-emboss-sunken)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
          <input
            type="text"
            placeholder="Search dates, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
                <th className="py-3 px-4 font-semibold">Date & Day</th>
                <th className="py-3 px-3 font-semibold">Check-In Arrival</th>
                <th className="py-3 px-3 font-semibold">Check-Out Departure</th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Remarks & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--neu-shadow-dark)]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:shadow-[var(--shadow-emboss-sunken)] transition">
                  <td className="py-3 px-4 font-medium text-fg">
                    <div>{log.date}</div>
                    <span className="text-[11px] text-fg-muted">{log.dayOfWeek}</span>
                  </td>
                  <td className="py-3 px-3 text-fg font-mono">{log.checkIn || '—'}</td>
                  <td className="py-3 px-3 text-fg font-mono">{log.checkOut || '—'}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                        log.status === 'PRESENT'
                          ? 'bg-success/15 text-success'
                          : log.status === 'LATE'
                            ? 'bg-warning/15 text-warning'
                            : log.status === 'EXCUSED'
                              ? 'bg-info/15 text-info'
                              : 'bg-error/15 text-error'
                      }`}
                    >
                      {log.status === 'PRESENT' && <CheckCircle2 className="w-3 h-3" />}
                      {log.status === 'LATE' && <Clock className="w-3 h-3" />}
                      {log.status === 'EXCUSED' && <FileQuestion className="w-3 h-3" />}
                      {log.status === 'ABSENT' && <AlertTriangle className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-fg-muted">
                    {log.note || <span className="text-fg-muted/60 italic">No notes</span>}
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