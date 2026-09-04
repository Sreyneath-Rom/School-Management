import React, { useMemo } from 'react'
import {
  X,
  Calendar,
  UserCheck,
  UserX,
  Clock,
  Percent,
} from 'lucide-react'
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
  // Calculate student monthly attendance statistics before any conditional returns
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-base shadow-xs">
                {record.studentAvatar || record.studentName?.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {record.studentName || 'Student Profile'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{record.studentCode || record.studentId}</span>
                  <span>•</span>
                  <span>{record.class}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-brand-500" />
                  <span>Attendance Rate</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats.rate}%
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Academic Term To-Date</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Days Present</span>
                </div>
                <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                  {stats.present} / {stats.total}
                </div>
                <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                  On-time check-ins
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Late Arrivals</span>
                </div>
                <div className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-1">
                  {stats.late}
                </div>
                <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                  Logged tardies
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <UserX className="w-3.5 h-3.5" />
                  <span>Absences</span>
                </div>
                <div className="text-xl font-bold text-rose-800 dark:text-rose-300 mt-1">
                  {stats.absent + stats.excused}
                </div>
                <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                  {stats.excused} excused, {stats.absent} unexcused
                </div>
              </div>
            </div>

            {/* Today's Status Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Selected Day Details ({record.date})
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Current Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      record.status === 'PRESENT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : record.status === 'LATE'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : record.status === 'EXCUSED'
                        ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Check-in Time</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {record.checkIn || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Check-out Time</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {record.checkOut || '—'}
                  </span>
                </div>
                {record.note && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Excuse / Note:</span>
                    <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                      {record.note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Attendance Log */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Recent Daily History</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </h4>

              <div className="space-y-2">
                {(allRecordsForStudent.length > 0 ? allRecordsForStudent : [record]).map((r) => (
                  <div
                    key={r.id || `${r.studentId}-${r.date}`}
                    className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          r.status === 'PRESENT'
                            ? 'bg-emerald-500'
                            : r.status === 'LATE'
                            ? 'bg-amber-500'
                            : r.status === 'EXCUSED'
                            ? 'bg-violet-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{r.date}</div>
                        <div className="text-[11px] text-slate-400">
                          In: {r.checkIn || '—'} • Out: {r.checkOut || '—'}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        r.status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : r.status === 'LATE'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          : r.status === 'EXCUSED'
                          ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-755 transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
