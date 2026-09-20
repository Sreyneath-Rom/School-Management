// src/pages/Teachers/TeacherAttendance.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  Info,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { apiClient, ApiError } from '@/lib/apiClient'

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

  const updateStatus = (id: string, status: FacultyAttendanceRecord['status']) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
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
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface bg-surface text-color text-xs font-semibold hover:bg-surface-strong transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
          >
            <CheckCircle2 size={14} />
            Save
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          The teacher attendance endpoint is not yet implemented on the backend.
          The roster below is empty until that endpoint lands.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-surface flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-success/10 text-success">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-xs text-secondary font-medium">On Duty</div>
            <div className="text-lg font-bold text-color">
              {counts.present} members
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl glass-sm border border-surface flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-warning/10 text-warning">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xs text-secondary font-medium">Late</div>
            <div className="text-lg font-bold text-color">
              {counts.late} logged
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl glass-sm border border-surface flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-error/10 text-error">
            <XCircle size={22} />
          </div>
          <div>
            <div className="text-xs text-secondary font-medium">Absent / Leave</div>
            <div className="text-lg font-bold text-color">
              {counts.absent} members
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-surface">
        <div className="p-3.5 border-b border-surface flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-secondary" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent text-color placeholder:text-secondary focus:outline-none"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-surface border border-surface text-color focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All departments' : d}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-16 text-center text-secondary text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load records</p>
            <p className="mt-1 text-xs text-secondary">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-secondary" />
            <p className="text-sm font-semibold text-color">
              No records for {selectedDate}
            </p>
            <p className="text-xs text-secondary mt-1">
              The teacher attendance module is not yet implemented.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-strong text-secondary font-semibold border-b border-surface">
                <tr>
                  <th className="p-3.5">Faculty</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Check-in</th>
                  <th className="p-3.5">Check-out</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface/50">
                    <td className="p-3.5">
                      <div className="font-bold text-color">{r.name}</div>
                      <div className="text-[11px] font-mono text-secondary">
                        {r.employeeId}
                      </div>
                    </td>
                    <td className="p-3.5 text-secondary font-medium">
                      {r.department}
                    </td>
                    <td className="p-3.5 font-mono text-secondary">
                      {r.checkIn || '—'}
                    </td>
                    <td className="p-3.5 font-mono text-secondary">
                      {r.checkOut || '—'}
                    </td>
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
                                ? 'bg-brand-600 text-white'
                                : 'bg-surface text-secondary hover:bg-surface-strong'
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