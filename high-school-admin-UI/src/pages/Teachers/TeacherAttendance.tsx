// src/pages/Teachers/TeacherAttendance.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import { CheckCircle2, Search, RefreshCw, Info, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { apiClient, ApiError } from '@/lib/apiClient'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'

interface FacultyAttendanceRecord {
  id: string
  employeeId: string
  name: string
  department: string
  checkIn: string | null
  checkOut: string | null
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'ON_LEAVE'
  notes?: string
}

function isStubError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 501 || err.status === 404)
}

export default function TeacherAttendance() {
  const { showToast } = useToast()

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [records, setRecords] = useState<FacultyAttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [deptFilter, setDeptFilter] = useState('All')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await apiClient.get<FacultyAttendanceRecord[]>(
        `/teacher-attendance?date=${encodeURIComponent(selectedDate)}`
      )
      setRecords(Array.isArray(rows) ? rows : [])
    } catch (err) {
      if (isStubError(err)) {
        setRecords([])
      } else {
        setError(err instanceof Error ? err : new Error(String(err)))
        setRecords([])
      }
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    load()
  }, [load])

  const departments = useMemo(() => {
    const set = new Set<string>()
    for (const r of records) if (r.department) set.add(r.department)
    return ['All', ...Array.from(set).sort()]
  }, [records])

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (deptFilter !== 'All' && r.department !== deptFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          r.name.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [records, deptFilter, search])

  const counts = useMemo(
    () => ({
      present: records.filter((r) => r.status === 'PRESENT').length,
      late: records.filter((r) => r.status === 'LATE').length,
      absent: records.filter(
        (r) => r.status === 'ABSENT' || r.status === 'ON_LEAVE'
      ).length,
    }),
    [records]
  )

  const statCards: StatCard[] = [
    { id: 'on-duty', label: 'On Duty', value: String(counts.present), delta: 'Today', deltaDirection: 'neutral', deltaLabel: 'members', icon: 'CheckCircle2', tint: 'green', footerLabel: 'Present faculty' },
    { id: 'late', label: 'Late', value: String(counts.late), delta: 'Today', deltaDirection: 'neutral', deltaLabel: 'logged', icon: 'Clock', tint: 'amber', footerLabel: 'Late check-ins' },
    { id: 'absent', label: 'Absent / Leave', value: String(counts.absent), delta: 'Today', deltaDirection: 'neutral', deltaLabel: 'members', icon: 'XCircle', tint: 'red', footerLabel: 'Absence or leave' },
  ]

  const updateStatus = (id: string, status: FacultyAttendanceRecord['status']) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const handleSave = () => {
    showToast(
      'Teacher attendance saving requires the /teacher-attendance endpoint, which is not yet implemented.',
      'info'
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Attendance"
          subtitle="Daily faculty check-ins, duty logs, and leave tracking."
        />
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl text-fg focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold"
          >
            <CheckCircle2 size={14} />
            Save
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-fg-muted">
          The teacher attendance endpoint is not yet implemented on the backend.
          The roster below is empty until that endpoint lands.
        </p>
      </div>

      <StatsGrid cards={statCards} columns={3} loading={loading} />

      <div className="overflow-hidden rounded-2xl glass-sm">
        <div className="p-3.5 flex items-center justify-between gap-3 theme-divider">
          <div className="relative flex items-center gap-2 flex-1">
            <Search size={16} className="absolute left-3 text-fg-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs text-fg placeholder:text-fg-muted focus:outline-none"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl text-fg focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All departments' : d}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-16 text-center text-fg-muted text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load records</p>
            <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-fg-muted" />
            <p className="text-sm font-semibold text-fg">No records for {selectedDate}</p>
            <p className="text-xs text-fg-muted mt-1">
              The teacher attendance module is not yet implemented.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted theme-divider">
                <tr>
                  <th className="p-3.5">Faculty</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Check-in</th>
                  <th className="p-3.5">Check-out</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--neu-shadow-dark) text-fg">
                {filtered.map((r) => (
                  <tr key={r.id} className="transition-shadow hover:shadow-sunken">
                    <td className="p-3.5">
                      <div className="font-bold text-fg">{r.name}</div>
                      <div className="text-[11px] font-mono text-fg-muted">{r.employeeId}</div>
                    </td>
                    <td className="p-3.5 text-fg-muted font-medium">{r.department}</td>
                    <td className="p-3.5 font-mono text-fg-muted">{r.checkIn || '—'}</td>
                    <td className="p-3.5 font-mono text-fg-muted">{r.checkOut || '—'}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          r.status === 'PRESENT'
                            ? 'bg-success/15 text-success'
                            : r.status === 'LATE'
                              ? 'bg-warning/15 text-warning'
                              : 'bg-error/15 text-error'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        {(['PRESENT', 'LATE', 'ON_LEAVE'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(r.id, s)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                              r.status === s
                                ? 'bg-brand-600 text-white shadow-sunken'
                                : 'glass-sm glass-interactive text-fg-muted'
                            }`}
                          >
                            {s === 'ON_LEAVE' ? 'Leave' : s.charAt(0) + s.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
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