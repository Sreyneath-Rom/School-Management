import { useState, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  ClipboardCheck,
  Filter,
  Download,
  Printer,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileQuestion,
  Users,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { useAuth } from '@/hooks/useAuth'

interface StudentAttendanceSummary {
  studentId: string
  name: string
  class: string
  grade: string
  totalDays: number
  presentDays: number
  lateDays: number
  excusedDays: number
  absentDays: number
  attendanceRate: number
  chronicAlert: boolean
}

const SAMPLE_ATTENDANCE_DATA: StudentAttendanceSummary[] = [
  {
    studentId: 'STU-1001',
    name: 'Emily Watson',
    class: 'Grade 10-A',
    grade: 'Grade 10',
    totalDays: 60,
    presentDays: 58,
    lateDays: 1,
    excusedDays: 1,
    absentDays: 0,
    attendanceRate: 98.3,
    chronicAlert: false,
  },
  {
    studentId: 'STU-1002',
    name: 'Michael Chen',
    class: 'Grade 10-A',
    grade: 'Grade 10',
    totalDays: 60,
    presentDays: 55,
    lateDays: 3,
    excusedDays: 2,
    absentDays: 0,
    attendanceRate: 95.0,
    chronicAlert: false,
  },
  {
    studentId: 'STU-1003',
    name: 'Sophia Rodriguez',
    class: 'Grade 10-A',
    grade: 'Grade 10',
    totalDays: 60,
    presentDays: 59,
    lateDays: 1,
    excusedDays: 0,
    absentDays: 0,
    attendanceRate: 99.2,
    chronicAlert: false,
  },
  {
    studentId: 'STU-1004',
    name: 'James Wilson',
    class: 'Grade 10-B',
    grade: 'Grade 10',
    totalDays: 60,
    presentDays: 48,
    lateDays: 4,
    excusedDays: 2,
    absentDays: 6,
    attendanceRate: 83.3,
    chronicAlert: true,
  },
  {
    studentId: 'STU-1005',
    name: 'Olivia Martinez',
    class: 'Grade 10-B',
    grade: 'Grade 10',
    totalDays: 60,
    presentDays: 56,
    lateDays: 2,
    excusedDays: 1,
    absentDays: 1,
    attendanceRate: 94.5,
    chronicAlert: false,
  },
  {
    studentId: 'STU-1006',
    name: 'Ethan Brown',
    class: 'Grade 11-A',
    grade: 'Grade 11',
    totalDays: 60,
    presentDays: 57,
    lateDays: 2,
    excusedDays: 1,
    absentDays: 0,
    attendanceRate: 96.7,
    chronicAlert: false,
  },
  {
    studentId: 'STU-1007',
    name: 'Ava Taylor',
    class: 'Grade 11-A',
    grade: 'Grade 11',
    totalDays: 60,
    presentDays: 46,
    lateDays: 5,
    excusedDays: 3,
    absentDays: 6,
    attendanceRate: 80.0,
    chronicAlert: true,
  },
  {
    studentId: 'STU-1008',
    name: 'Lucas Garcia',
    class: 'Grade 12-A',
    grade: 'Grade 12',
    totalDays: 60,
    presentDays: 60,
    lateDays: 0,
    excusedDays: 0,
    absentDays: 0,
    attendanceRate: 100.0,
    chronicAlert: false,
  },
]

export default function AttendanceReport() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacher = user?.role === 'teacher'

  // Filter States (UC-REPORT-02)
  const [fromDate, setFromDate] = useState('2025-09-01')
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState<string>(isTeacher ? 'Grade 10-A' : 'All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Chronic Alert' | 'Regular'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    return SAMPLE_ATTENDANCE_DATA.filter((s) => {
      if (isTeacher && s.class !== 'Grade 10-A') return false
      const matchClass = selectedClass === 'All' || s.class === selectedClass
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Chronic Alert' && s.chronicAlert) ||
        (statusFilter === 'Regular' && !s.chronicAlert)
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      return matchClass && matchStatus && matchSearch
    })
  }, [isTeacher, selectedClass, statusFilter, searchQuery])

  // Summary Metrics
  const totalStudents = filteredData.length
  const avgAttendanceRate = totalStudents
    ? (filteredData.reduce((acc, s) => acc + s.attendanceRate, 0) / totalStudents).toFixed(1)
    : '0.0'
  const totalAbsences = filteredData.reduce((acc, s) => acc + s.absentDays, 0)
  const chronicCount = filteredData.filter((s) => s.chronicAlert).length

  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Student Name',
      'Class',
      'Grade',
      'Enrolled Days',
      'Present',
      'Late',
      'Permission/Excused',
      'Unexcused Absent',
      'Attendance Rate (%)',
      'Chronic Alert Status',
    ]

    const rows = filteredData.map((s) => [
      s.studentId,
      `"${s.name}"`,
      s.class,
      s.grade,
      s.totalDays,
      s.presentDays,
      s.lateDays,
      s.excusedDays,
      s.absentDays,
      `${s.attendanceRate}%`,
      s.chronicAlert ? 'CHRONIC ALERT (<85%)' : 'NORMAL',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Attendance_Report_${fromDate}_to_${toDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('Attendance report exported to CSV successfully', 'success')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <PageHeading
          title="Attendance & Punctuality Report"
          subtitle={
            isTeacher
              ? 'Attendance compliance and tracking report for your assigned classes (UC-REPORT-02).'
              : 'School-wide attendance analytics, absenteeism alerts, and verification records (UC-REPORT-02).'
          }
        />
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 transition shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            Print Report
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

      {/* Filter Parameters Ribbon */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Report Date Range & Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Class</label>
            <select
              value={selectedClass}
              disabled={isTeacher}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-60"
            >
              {!isTeacher && <option value="All">All Classes</option>}
              <option value="Grade 10-A">Grade 10-A</option>
              <option value="Grade 10-B">Grade 10-B</option>
              <option value="Grade 11-A">Grade 11-A</option>
              <option value="Grade 12-A">Grade 12-A</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="All">All Students</option>
              <option value="Chronic Alert">Chronic Absenteeism (&lt; 85%)</option>
              <option value="Regular">Normal Attendance (&ge; 85%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Attendance Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgAttendanceRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">Compliance Target &ge; 90%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across filtered students</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Filtered Students</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalStudents}</span>
            <span className="text-xs text-slate-400 font-medium">Students</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Enrolled across class scope</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Unexcused Absences</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalAbsences}</span>
            <span className="text-xs text-rose-500 font-medium">Days Lost</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Excludes excused sick leaves</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Chronic Absenteeism Alerts</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold ${chronicCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
              {chronicCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">Students &lt; 85%</span>
          </div>
          <p className="text-[11px] text-rose-500 font-medium mt-1">Requires pastoral intervention</p>
        </div>
      </div>

      {/* Attendance Summary Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Student Attendance Breakdown
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {filteredData.length} Students
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-3 font-semibold">Class</th>
                <th className="py-3 px-3 font-semibold text-center">Sessions</th>
                <th className="py-3 px-3 font-semibold text-center text-emerald-600 dark:text-emerald-400">Present</th>
                <th className="py-3 px-3 font-semibold text-center text-amber-600 dark:text-amber-400">Late</th>
                <th className="py-3 px-3 font-semibold text-center text-blue-600 dark:text-blue-400">Permission</th>
                <th className="py-3 px-3 font-semibold text-center text-rose-600 dark:text-rose-400">Absent</th>
                <th className="py-3 px-3 font-semibold text-center">Attendance %</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.map((s) => (
                <tr key={s.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    <div>{s.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{s.studentId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{s.class}</td>
                  <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">{s.totalDays}</td>
                  <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {s.presentDays}
                  </td>
                  <td className="py-3 px-3 text-center text-amber-600 dark:text-amber-400 font-bold font-mono">
                    {s.lateDays}
                  </td>
                  <td className="py-3 px-3 text-center text-blue-600 dark:text-blue-400 font-bold font-mono">
                    {s.excusedDays}
                  </td>
                  <td className="py-3 px-3 text-center text-rose-600 dark:text-rose-400 font-bold font-mono">
                    {s.absentDays}
                  </td>
                  <td className="py-3 px-3 text-center font-bold font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] ${
                        s.attendanceRate >= 95
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : s.attendanceRate >= 85
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {s.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {s.chronicAlert ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                        <AlertTriangle className="w-3 h-3" />
                        Chronic Warning
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
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
      </div>
    </div>
  )
}
