// src/pages/Reports/AttendanceReport.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  Filter,
  Download,
  Printer,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/common/ToastProvider'
import { reportService } from '@/services/reportService'
import { classService, type ClassRecord } from '@/services/classService'
import type { AttendanceStatus } from '@/types/attendance'

/**
 * Row shape assumed for `/reports/attendance`. If the backend's
 * `AttendanceReportRow` differs, this is the only place that changes.
 */
interface ReportRow {
  id: string
  studentId: string
  studentName?: string
  studentCode?: string
  className?: string
  date: string
  status: AttendanceStatus
}

interface StudentSummary {
  studentId: string
  name: string
  studentCode: string
  className: string
  totalDays: number
  presentDays: number
  lateDays: number
  excusedDays: number
  absentDays: number
  attendanceRate: number
  chronicAlert: boolean
}

const CHRONIC_THRESHOLD = 85

function normalise(raw: unknown): ReportRow | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string' || typeof r.studentId !== 'string') return null
  if (typeof r.date !== 'string') return null
  const status = String(r.status ?? '').toUpperCase()
  if (
    status !== 'PRESENT' &&
    status !== 'ABSENT' &&
    status !== 'LATE' &&
    status !== 'EXCUSED'
  ) {
    return null
  }
  const student = (r.student as Record<string, unknown> | undefined) ?? undefined
  const user = (student?.user as Record<string, unknown> | undefined) ?? undefined
  const studentClass =
    (student?.class as Record<string, unknown> | undefined) ?? undefined

  const firstName = typeof user?.firstName === 'string' ? user.firstName : ''
  const lastName = typeof user?.lastName === 'string' ? user.lastName : ''
  const name = `${firstName} ${lastName}`.trim()

  return {
    id: r.id,
    studentId: r.studentId,
    studentName: name || undefined,
    studentCode:
      typeof student?.studentCode === 'string' ? student.studentCode : undefined,
    className:
      typeof studentClass?.name === 'string' ? studentClass.name : undefined,
    date: r.date,
    status: status as AttendanceStatus,
  }
}

function aggregate(rows: ReportRow[]): StudentSummary[] {
  const byStudent = new Map<string, ReportRow[]>()
  for (const row of rows) {
    const list = byStudent.get(row.studentId) ?? []
    list.push(row)
    byStudent.set(row.studentId, list)
  }

  const out: StudentSummary[] = []
  for (const [studentId, list] of byStudent) {
    const first = list[0]
    let present = 0
    let late = 0
    let excused = 0
    let absent = 0
    for (const r of list) {
      if (r.status === 'PRESENT') present += 1
      else if (r.status === 'LATE') late += 1
      else if (r.status === 'EXCUSED') excused += 1
      else absent += 1
    }
    const total = list.length
    const attendanceRate =
      total > 0 ? Number((((present + late) / total) * 100).toFixed(1)) : 0

    out.push({
      studentId,
      name: first.studentName ?? first.studentCode ?? studentId,
      studentCode: first.studentCode ?? '',
      className: first.className ?? '—',
      totalDays: total,
      presentDays: present,
      lateDays: late,
      excusedDays: excused,
      absentDays: absent,
      attendanceRate,
      chronicAlert: attendanceRate < CHRONIC_THRESHOLD,
    })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

export default function AttendanceReport() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacher = user?.role === 'teacher'

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10))
  const [classId, setClassId] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Chronic Alert' | 'Regular'>('All')
  const [search, setSearch] = useState('')
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [rows, setRows] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (isTeacher) return
    classService
      .list()
      .then((c) => setClasses(Array.isArray(c) ? c : []))
      .catch(() => setClasses([]))
  }, [isTeacher])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const raw = await reportService.attendance({
        classId: classId || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
        limit: 2000,
      })
      const list = Array.isArray(raw) ? raw : []
      const normalised = list.map(normalise).filter((r): r is ReportRow => r !== null)
      setRows(normalised)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [classId, fromDate, toDate])

  useEffect(() => {
    load()
  }, [load])

  const summaries = useMemo(() => aggregate(rows), [rows])

  const filtered = useMemo(() => {
    return summaries.filter((s) => {
      if (statusFilter === 'Chronic Alert' && !s.chronicAlert) return false
      if (statusFilter === 'Regular' && s.chronicAlert) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          s.name.toLowerCase().includes(q) ||
          s.studentCode.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [summaries, statusFilter, search])

  const stats = useMemo(() => {
    const total = filtered.length
    const avg = total
      ? filtered.reduce((sum, s) => sum + s.attendanceRate, 0) / total
      : 0
    const unexcused = filtered.reduce((sum, s) => sum + s.absentDays, 0)
    const chronic = filtered.filter((s) => s.chronicAlert).length
    return { total, avg, unexcused, chronic }
  }, [filtered])

  const kpiCards: StatCard[] = [
    { id: 'avg-rate', label: 'Average Attendance Rate', value: `${stats.avg.toFixed(1)}%`, delta: '-', deltaDirection: 'neutral', deltaLabel: 'filtered students', icon: 'CheckCircle2', tint: 'green' },
    { id: 'students', label: 'Students', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: 'in scope', icon: 'Users', tint: 'blue' },
    { id: 'unexcused', label: 'Unexcused Absences', value: String(stats.unexcused), delta: '-', deltaDirection: 'neutral', deltaLabel: 'days total', icon: 'CalendarDays', tint: 'amber' },
    { id: 'chronic', label: 'Chronic Alerts', value: String(stats.chronic), delta: '-', deltaDirection: 'neutral', deltaLabel: `below ${CHRONIC_THRESHOLD}%`, icon: 'AlertCircle', tint: 'red' },
  ]

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      showToast('Nothing to export', 'info')
      return
    }
    const headers = [
      'Student ID',
      'Name',
      'Class',
      'Sessions',
      'Present',
      'Late',
      'Excused',
      'Unexcused Absent',
      'Attendance %',
      'Status',
    ]
    const data = filtered.map((s) => [
      s.studentCode || s.studentId,
      `"${s.name}"`,
      s.className,
      s.totalDays,
      s.presentDays,
      s.lateDays,
      s.excusedDays,
      s.absentDays,
      s.attendanceRate,
      s.chronicAlert ? 'CHRONIC' : 'NORMAL',
    ])
    const csv = [headers.join(','), ...data.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Attendance_Report_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Report exported', 'success')
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Attendance Report"
          subtitle={
            isTeacher
              ? 'Attendance compliance for your assigned classes.'
              : 'School-wide attendance and absenteeism analytics.'
          }
        />
        <div className="flex items-center gap-2.5">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface bg-surface text-color text-xs font-medium hover:bg-surface-strong transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface bg-surface text-color text-xs font-medium hover:bg-surface-strong transition"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          This report aggregates raw attendance rows from `/reports/attendance`
          client-side. Per-student summaries are computed from the events in
          the selected range.
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-surface bg-surface shadow-sm space-y-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-color">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-secondary mb-1">
              From date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-surface bg-surface text-color"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-secondary mb-1">
              To date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-surface bg-surface text-color"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-secondary mb-1">
              Class
            </label>
            <select
              value={classId}
              disabled={isTeacher}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-surface bg-surface text-color disabled:opacity-60"
            >
              <option value="">All classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-secondary mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="w-full text-xs px-3 py-2 rounded-xl border border-surface bg-surface text-color"
            >
              <option value="All">All students</option>
              <option value="Chronic Alert">{`Chronic (< ${CHRONIC_THRESHOLD}%)`}</option>
              <option value="Regular">{`Regular (≥ ${CHRONIC_THRESHOLD}%)`}</option>
            </select>
          </div>
        </div>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="bg-surface rounded-2xl border border-surface shadow-sm overflow-hidden">
        <div className="p-4 border-b border-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-color">Student Breakdown</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-strong text-secondary font-medium">
              {filtered.length} students
            </span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search student or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-surface bg-surface text-color"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-secondary text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading attendance...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load report</p>
            <p className="mt-1 text-xs text-secondary">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-secondary text-sm">
            {summaries.length === 0
              ? 'No attendance records in the selected range.'
              : 'No students match these filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-strong text-secondary font-semibold border-b border-surface">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3 text-center">Sessions</th>
                  <th className="py-3 px-3 text-center text-success">Present</th>
                  <th className="py-3 px-3 text-center text-warning">Late</th>
                  <th className="py-3 px-3 text-center text-info">Excused</th>
                  <th className="py-3 px-3 text-center text-error">Absent</th>
                  <th className="py-3 px-3 text-center">Rate</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filtered.map((s) => (
                  <tr key={s.studentId} className="hover:bg-surface/50 transition">
                    <td className="py-3 px-4 font-medium text-color">
                      <div>{s.name}</div>
                      {s.studentCode && (
                        <span className="text-[10px] text-secondary font-mono">
                          {s.studentCode}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-secondary">{s.className}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.totalDays}</td>
                    <td className="py-3 px-3 text-center text-success font-bold font-mono">
                      {s.presentDays}
                    </td>
                    <td className="py-3 px-3 text-center text-warning font-bold font-mono">
                      {s.lateDays}
                    </td>
                    <td className="py-3 px-3 text-center text-info font-bold font-mono">
                      {s.excusedDays}
                    </td>
                    <td className="py-3 px-3 text-center text-error font-bold font-mono">
                      {s.absentDays}
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono text-color">
                      {s.attendanceRate}%
                    </td>
                    <td className="py-3 px-4">
                      {s.chronicAlert ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-error/10 text-error">
                          <AlertTriangle className="w-3 h-3" />
                          Chronic
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                          <CheckCircle2 className="w-3 h-3" />
                          Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}