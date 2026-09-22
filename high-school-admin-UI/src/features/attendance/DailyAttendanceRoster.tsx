// src/features/attendance/DailyAttendanceRoster.tsx
import React, { useState, useMemo } from 'react'
import {
  Search, Check, Clock, X, ShieldAlert, Edit3, FileText, Save,
  ChevronRight, Filter, Info,
} from 'lucide-react'
import type { AttendanceRecord, AttendanceStatus } from '@/services/attendanceService'

interface DailyAttendanceRosterProps {
  records: AttendanceRecord[]
  loading?: boolean
  selectedClass: string
  onClassChange: (className: string) => void
  onUpdateStatus: (recordId: string, status: AttendanceStatus) => void
  onUpdateCheckIn: (recordId: string, timeStr: string) => void
  onUpdateCheckOut: (recordId: string, timeStr: string) => void
  onOpenNoteModal: (record: AttendanceRecord) => void
  onOpenHistoryDrawer: (record: AttendanceRecord) => void
  onBulkMarkAll: (status: AttendanceStatus) => void
  onSaveSync: () => void
  hasUnsavedChanges: boolean
  saving: boolean
}

const CLASS_OPTIONS = [
  'All Classes', 'Grade 10 - A', 'Grade 9 - A', 'Grade 11 - B', 'Grade 12 - A',
]

const STATUS_TONE: Record<AttendanceStatus, { active: string; text: string; dot: string; chip: string }> = {
  PRESENT: { active: 'bg-emerald-600 text-white', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', chip: 'text-emerald-800 dark:text-emerald-300' },
  LATE:    { active: 'bg-amber-500 text-white',   text: 'text-amber-700 dark:text-amber-300',     dot: 'bg-amber-500',   chip: 'text-amber-800 dark:text-amber-300' },
  ABSENT:  { active: 'bg-rose-600 text-white',    text: 'text-rose-700 dark:text-rose-300',       dot: 'bg-rose-500',    chip: 'text-rose-800 dark:text-rose-300' },
  EXCUSED: { active: 'bg-violet-600 text-white',  text: 'text-violet-700 dark:text-violet-300',   dot: 'bg-violet-500',  chip: 'text-violet-800 dark:text-violet-300' },
}

export default function DailyAttendanceRoster({
  records, loading = false, selectedClass, onClassChange,
  onUpdateStatus, onUpdateCheckIn, onUpdateCheckOut,
  onOpenNoteModal, onOpenHistoryDrawer,
  onBulkMarkAll, onSaveSync, hasUnsavedChanges, saving,
}: DailyAttendanceRosterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL')

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedClass !== 'All Classes' && r.class?.toLowerCase() !== selectedClass.toLowerCase()) return false
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const matchName = r.studentName?.toLowerCase().includes(term)
        const matchCode = (r.studentCode || r.studentId)?.toLowerCase().includes(term)
        const matchNote = r.note?.toLowerCase().includes(term)
        if (!matchName && !matchCode && !matchNote) return false
      }
      return true
    })
  }, [records, selectedClass, statusFilter, searchTerm])

  const counts = useMemo(() => {
    const classFiltered = records.filter(
      (r) => selectedClass === 'All Classes' || r.class?.toLowerCase() === selectedClass.toLowerCase()
    )
    return {
      all: classFiltered.length,
      present: classFiltered.filter((r) => r.status === 'PRESENT').length,
      late: classFiltered.filter((r) => r.status === 'LATE').length,
      absent: classFiltered.filter((r) => r.status === 'ABSENT').length,
      excused: classFiltered.filter((r) => r.status === 'EXCUSED').length,
    }
  }, [records, selectedClass])

  const setNowTime = (recordId: string, field: 'checkIn' | 'checkOut') => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    if (field === 'checkIn') onUpdateCheckIn(recordId, timeStr)
    else onUpdateCheckOut(recordId, timeStr)
  }

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all">
      <div className="p-4 sm:p-5 shadow-[0_1px_0_var(--neu-shadow-dark)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-42.5">
              <select
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-fg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 appearance-none cursor-pointer transition-all"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-50 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student by name, ID, or note..."
                className="w-full pl-9 pr-3 py-2 text-xs text-fg rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg text-xs cursor-pointer z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl p-1 shadow-sunken">
              <button
                type="button"
                onClick={() => onBulkMarkAll('PRESENT')}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:shadow-sunken rounded-lg transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>All Present</span>
              </button>
              <button
                type="button"
                onClick={() => onBulkMarkAll('ABSENT')}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:shadow-sunken rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>All Absent</span>
              </button>
              <button
                type="button"
                onClick={() => onBulkMarkAll('LATE')}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:shadow-sunken rounded-lg transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>All Late</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onSaveSync}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'glass-sm glass-interactive text-fg'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Syncing...' : hasUnsavedChanges ? 'Save Changes *' : 'Save & Sync'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              statusFilter === 'ALL'
                ? 'text-brand-700 dark:text-brand-300 shadow-sunken'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            All Students ({counts.all})
          </button>
          {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                statusFilter === st ? STATUS_TONE[st].active : STATUS_TONE[st].text
              }`}
            >
              {st === 'PRESENT' ? 'Present' : st === 'LATE' ? 'Late' : st === 'ABSENT' ? 'Absent' : 'Excused'} ({counts[st.toLowerCase() as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-fg-muted uppercase tracking-wider font-bold shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-55">Student Information</th>
              <th className="py-3 px-4 min-w-67.5">Attendance Status</th>
              <th className="py-3 px-4 min-w-32.5">Time In</th>
              <th className="py-3 px-4 min-w-32.5">Time Out</th>
              <th className="py-3 px-4 min-w-50">Excuse & Remarks</th>
              <th className="py-3 px-4 w-16 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--neu-shadow-dark)">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="py-4 px-4">
                    <div className="h-10 w-full skeleton rounded-xl" />
                  </td>
                </tr>
              ))
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-fg-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info className="w-8 h-8 opacity-40" />
                    <p className="font-semibold text-sm text-fg">No student records found</p>
                    <p className="text-xs">Try adjusting your search query, status filter, or class selection.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => {
                const recId = record.id || record.studentId
                const tone = STATUS_TONE[record.status]
                return (
                  <tr key={recId} className="hover:shadow-sunken transition-shadow group">
                    <td className="py-3 px-4 text-center text-fg-muted font-mono text-xs">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 shadow-sunken ${tone.chip}`}>
                          {record.studentAvatar || record.studentName?.substring(0, 2).toUpperCase() || 'ST'}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onOpenHistoryDrawer(record)}
                            className="font-bold text-fg hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate block text-left cursor-pointer"
                          >
                            {record.studentName || 'Student Name'}
                          </button>
                          <div className="text-[11px] text-fg-muted flex items-center gap-2">
                            <span className="font-mono">{record.studentCode || record.studentId}</span>
                            <span>•</span>
                            <span>{record.class}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center p-1 rounded-xl shadow-sunken">
                        {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as const).map((st) => {
                          const isActive = record.status === st
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => onUpdateStatus(recId, st)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isActive ? STATUS_TONE[st].active : 'text-fg-muted hover:text-fg'
                              }`}
                            >
                              {st === 'PRESENT' && <Check className="w-3.5 h-3.5" />}
                              {st === 'LATE' && <Clock className="w-3.5 h-3.5" />}
                              {st === 'ABSENT' && <X className="w-3.5 h-3.5" />}
                              {st === 'EXCUSED' && <ShieldAlert className="w-3.5 h-3.5" />}
                              <span>{st === 'PRESENT' ? 'Present' : st === 'LATE' ? 'Late' : st === 'ABSENT' ? 'Absent' : 'Excused'}</span>
                            </button>
                          )
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={record.checkIn || ''}
                          onChange={(e) => onUpdateCheckIn(recId, e.target.value)}
                          placeholder="--:--"
                          disabled={record.status === 'ABSENT'}
                          className="w-20 px-2 py-1 text-xs text-fg font-mono rounded-lg disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        {record.status !== 'ABSENT' && (
                          <button
                            type="button"
                            onClick={() => setNowTime(recId, 'checkIn')}
                            className="px-1.5 py-1 text-[10px] font-semibold text-fg-muted hover:text-fg rounded-md transition-colors cursor-pointer shadow-sunken"
                          >
                            Now
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={record.checkOut || ''}
                          onChange={(e) => onUpdateCheckOut(recId, e.target.value)}
                          placeholder="--:--"
                          disabled={record.status === 'ABSENT'}
                          className="w-20 px-2 py-1 text-xs text-fg font-mono rounded-lg disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        {record.status !== 'ABSENT' && (
                          <button
                            type="button"
                            onClick={() => setNowTime(recId, 'checkOut')}
                            className="px-1.5 py-1 text-[10px] font-semibold text-fg-muted hover:text-fg rounded-md transition-colors cursor-pointer shadow-sunken"
                          >
                            Now
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {record.note ? (
                        <button
                          type="button"
                          onClick={() => onOpenNoteModal(record)}
                          className="text-left flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-violet-700 dark:text-violet-300 max-w-47.5 truncate cursor-pointer shadow-sunken"
                        >
                          <FileText className="w-3 h-3 shrink-0 text-violet-500" />
                          <span className="truncate">{record.note}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenNoteModal(record)}
                          className="inline-flex items-center gap-1 text-fg-muted hover:text-fg text-xs py-1 px-2 rounded-lg hover:shadow-sunken transition cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Add note</span>
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenHistoryDrawer(record)}
                        title="View Attendance History & Statistics"
                        className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden divide-y divide-(--neu-shadow-dark)">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="h-16 w-full skeleton rounded-xl" />
              <div className="h-9 w-full skeleton rounded-xl" />
            </div>
          ))
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-fg-muted px-4">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-sm text-fg">No student records found</p>
            <p className="text-xs mt-1">Try adjusting your search query, status filter, or class selection.</p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const recId = record.id || record.studentId
            const tone = STATUS_TONE[record.status]
            return (
              <div key={recId} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sunken ${tone.chip}`}>
                      {record.studentAvatar || record.studentName?.substring(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenHistoryDrawer(record)}
                        className="font-bold text-sm text-fg truncate block text-left"
                      >
                        {record.studentName || 'Student Name'}
                      </button>
                      <div className="text-xs text-fg-muted flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{record.studentCode || record.studentId}</span>
                        <span>•</span>
                        <span>{record.class}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenHistoryDrawer(record)}
                    className="p-2 rounded-xl text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 shadow-sunken transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl shadow-sunken">
                  {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onUpdateStatus(recId, st)}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                        record.status === st ? STATUS_TONE[st].active : 'text-fg-muted hover:text-fg'
                      }`}
                    >
                      {st === 'PRESENT' && <Check className="w-3.5 h-3.5" />}
                      {st === 'LATE' && <Clock className="w-3.5 h-3.5" />}
                      {st === 'ABSENT' && <X className="w-3.5 h-3.5" />}
                      {st === 'EXCUSED' && <ShieldAlert className="w-3.5 h-3.5" />}
                      <span>{st === 'PRESENT' ? 'Present' : st === 'LATE' ? 'Late' : st === 'ABSENT' ? 'Absent' : 'Excused'}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-fg-muted">In:</span>
                      <input
                        type="text"
                        value={record.checkIn || ''}
                        onChange={(e) => onUpdateCheckIn(recId, e.target.value)}
                        placeholder="--:--"
                        disabled={record.status === 'ABSENT'}
                        className="w-18 px-2 py-1 text-xs text-fg font-mono rounded-lg disabled:opacity-40"
                      />
                      {record.status !== 'ABSENT' && (
                        <button
                          type="button"
                          onClick={() => setNowTime(recId, 'checkIn')}
                          className="px-1.5 py-1 text-[10px] font-semibold text-fg-muted rounded-md shadow-sunken"
                        >
                          Now
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-fg-muted">Out:</span>
                      <input
                        type="text"
                        value={record.checkOut || ''}
                        onChange={(e) => onUpdateCheckOut(recId, e.target.value)}
                        placeholder="--:--"
                        disabled={record.status === 'ABSENT'}
                        className="w-18 px-2 py-1 text-xs text-fg font-mono rounded-lg disabled:opacity-40"
                      />
                      {record.status !== 'ABSENT' && (
                        <button
                          type="button"
                          onClick={() => setNowTime(recId, 'checkOut')}
                          className="px-1.5 py-1 text-[10px] font-semibold text-fg-muted rounded-md shadow-sunken"
                        >
                          Now
                        </button>
                      )}
                    </div>
                  </div>

                  {record.note ? (
                    <button
                      type="button"
                      onClick={() => onOpenNoteModal(record)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-violet-700 dark:text-violet-300 max-w-40 truncate shadow-sunken"
                    >
                      <FileText className="w-3 h-3 shrink-0 text-violet-500" />
                      <span className="truncate">{record.note}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenNoteModal(record)}
                      className="inline-flex items-center gap-1 text-fg-muted text-xs py-1 px-2 rounded-lg shadow-sunken"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Note</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-4 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex flex-wrap items-center justify-between gap-3 text-xs text-fg-muted">
        <div>
          Showing <span className="font-bold text-fg">{filteredRecords.length}</span>{' '}
          of <span className="font-bold text-fg">{records.length}</span> total students
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {counts.present} Present</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {counts.late} Late</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> {counts.absent} Absent</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" /> {counts.excused} Excused</span>
        </div>
      </div>
    </div>
  )
}