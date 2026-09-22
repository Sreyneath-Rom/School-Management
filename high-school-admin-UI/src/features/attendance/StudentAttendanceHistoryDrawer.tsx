// src/features/attendance/StudentAttendanceHistoryDrawer.tsx
import { useMemo } from 'react'
import { X, Calendar, UserCheck, UserX, Clock, Percent } from 'lucide-react'
import type { AttendanceRecord } from '@/services/attendanceService'

interface StudentAttendanceHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  record: AttendanceRecord | null
  allRecordsForStudent?: AttendanceRecord[]
}

export default function StudentAttendanceHistoryDrawer({
  isOpen,
  onClose,
  record,
  allRecordsForStudent = [],
}: StudentAttendanceHistoryDrawerProps) {
  const stats = useMemo(() => {
    if (!record) return { total: 0, present: 0, late: 0, absent: 0, excused: 0, rate: 100 }
    const records = allRecordsForStudent.length > 0 ? allRecordsForStudent : [record]
    const present = records.filter((r) => r.status === 'PRESENT').length
    const late = records.filter((r) => r.status === 'LATE').length
    const absent = records.filter((r) => r.status === 'ABSENT').length
    const excused = records.filter((r) => r.status === 'EXCUSED').length
    const total = records.length
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100
    return { total, present, late, absent, excused, rate }
  }, [allRecordsForStudent, record])

  if (!isOpen || !record) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-strong flex flex-col shadow-(--glass-strong-shadow) animate-in slide-in-from-right duration-300">
          <div className="p-6 shadow-[0_1px_0_var(--neu-shadow-dark)] flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-base shadow-sunken">
                {record.studentAvatar || record.studentName?.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div>
                <h3 className="text-base font-bold text-fg">
                  {record.studentName || 'Student Profile'}
                </h3>
                <p className="text-xs text-fg-muted flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{record.studentCode || record.studentId}</span>
                  <span>•</span>
                  <span>{record.class}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-fg-muted hover:text-fg hover:shadow-sunken transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl shadow-sunken">
                <div className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-brand-500" />
                  <span>Attendance Rate</span>
                </div>
                <div className="text-xl font-bold text-fg mt-1">{stats.rate}%</div>
                <div className="text-[11px] text-fg-muted mt-0.5">Academic Term To-Date</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-success/10 shadow-sunken">
                <div className="text-xs font-semibold text-success flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Days Present</span>
                </div>
                <div className="text-xl font-bold text-success mt-1">
                  {stats.present} / {stats.total}
                </div>
                <div className="text-[11px] text-success/80 mt-0.5">On-time check-ins</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-warning/10 shadow-sunken">
                <div className="text-xs font-semibold text-warning flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Late Arrivals</span>
                </div>
                <div className="text-xl font-bold text-warning mt-1">{stats.late}</div>
                <div className="text-[11px] text-warning/80 mt-0.5">Logged tardies</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-error/10 shadow-sunken">
                <div className="text-xs font-semibold text-error flex items-center gap-1.5">
                  <UserX className="w-3.5 h-3.5" />
                  <span>Absences</span>
                </div>
                <div className="text-xl font-bold text-error mt-1">{stats.absent + stats.excused}</div>
                <div className="text-[11px] text-error/80 mt-0.5">
                  {stats.excused} excused, {stats.absent} unexcused
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl shadow-sunken">
              <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-3">
                Selected Day Details ({record.date})
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Current Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      record.status === 'PRESENT'
                        ? 'bg-success/15 text-success'
                        : record.status === 'LATE'
                          ? 'bg-warning/15 text-warning'
                          : record.status === 'EXCUSED'
                            ? 'bg-info/15 text-info'
                            : 'bg-error/15 text-error'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Check-in Time</span>
                  <span className="font-semibold text-fg">{record.checkIn || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Check-out Time</span>
                  <span className="font-semibold text-fg">{record.checkOut || '—'}</span>
                </div>
                {record.note && (
                  <div className="pt-2 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
                    <span className="text-fg-muted block mb-1">Excuse / Note:</span>
                    <p className="text-fg p-2 rounded-lg shadow-sunken">
                      {record.note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Recent Daily History</span>
                <Calendar className="w-3.5 h-3.5 text-fg-muted" />
              </h4>
              <div className="space-y-2">
                {(allRecordsForStudent.length > 0 ? allRecordsForStudent : [record]).map((r) => (
                  <div
                    key={r.id || `${r.studentId}-${r.date}`}
                    className="p-3 rounded-xl shadow-sunken flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          r.status === 'PRESENT'
                            ? 'bg-success'
                            : r.status === 'LATE'
                              ? 'bg-warning'
                              : r.status === 'EXCUSED'
                                ? 'bg-info'
                                : 'bg-error'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-fg">{r.date}</div>
                        <div className="text-[11px] text-fg-muted">
                          In: {r.checkIn || '—'} • Out: {r.checkOut || '—'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        r.status === 'PRESENT'
                          ? 'bg-success/15 text-success'
                          : r.status === 'LATE'
                            ? 'bg-warning/15 text-warning'
                            : r.status === 'EXCUSED'
                              ? 'bg-info/15 text-info'
                              : 'bg-error/15 text-error'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-end">
            <button
              onClick={onClose}
              className="glass-sm glass-interactive px-4 py-2 text-xs font-semibold text-fg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}