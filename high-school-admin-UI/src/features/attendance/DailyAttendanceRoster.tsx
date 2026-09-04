import React, { useState, useMemo } from 'react'
import {
  Search,
  Check,
  Clock,
  X,
  ShieldAlert,
  Edit3,
  FileText,
  Save,
  ChevronRight,
  Filter,
  Info,
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
  'All Classes',
  'Grade 10 - A',
  'Grade 9 - A',
  'Grade 11 - B',
  'Grade 12 - A',
]

export default function DailyAttendanceRoster({
  records,
  loading = false,
  selectedClass,
  onClassChange,
  onUpdateStatus,
  onUpdateCheckIn,
  onUpdateCheckOut,
  onOpenNoteModal,
  onOpenHistoryDrawer,
  onBulkMarkAll,
  onSaveSync,
  hasUnsavedChanges,
  saving,
}: DailyAttendanceRosterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL')

  // Filter records by search term and status tab
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Class filter
      if (selectedClass !== 'All Classes' && r.class?.toLowerCase() !== selectedClass.toLowerCase()) {
        return false
      }

      // Status filter
      if (statusFilter !== 'ALL' && r.status !== statusFilter) {
        return false
      }

      // Search term
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
    if (field === 'checkIn') {
      onUpdateCheckIn(recordId, timeStr)
    } else {
      onUpdateCheckOut(recordId, timeStr)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all">
      {/* Top Filter & Bulk Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        {/* Controls row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Class Selector & Search Input */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Class Dropdown */}
            <div className="relative min-w-[170px]">
              <select
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer transition-all"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student by name, ID, or note..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Batch Actions & Save Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => onBulkMarkAll('PRESENT')}
                title="Mark all students in current view as Present"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>All Present</span>
              </button>
              <button
                type="button"
                onClick={() => onBulkMarkAll('ABSENT')}
                title="Mark all as Absent"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>All Absent</span>
              </button>
              <button
                type="button"
                onClick={() => onBulkMarkAll('LATE')}
                title="Mark all as Late"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>All Late</span>
              </button>
            </div>

            {/* Save Sync Button */}
            <button
              type="button"
              onClick={onSaveSync}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-brand-600 hover:bg-brand-700 text-white animate-pulse'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Syncing...' : hasUnsavedChanges ? 'Save Changes *' : 'Save & Sync'}</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Students ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PRESENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              statusFilter === 'PRESENT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
            }`}
          >
            Present ({counts.present})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('LATE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              statusFilter === 'LATE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
            }`}
          >
            Late ({counts.late})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ABSENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              statusFilter === 'ABSENT'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100'
            }`}
          >
            Absent ({counts.absent})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('EXCUSED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              statusFilter === 'EXCUSED'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 hover:bg-violet-100'
            }`}
          >
            Excused ({counts.excused})
          </button>
        </div>
      </div>

      {/* Desktop & Tablet Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[220px]">Student Information</th>
              <th className="py-3 px-4 min-w-[270px]">Attendance Status</th>
              <th className="py-3 px-4 min-w-[130px]">Time In</th>
              <th className="py-3 px-4 min-w-[130px]">Time Out</th>
              <th className="py-3 px-4 min-w-[200px]">Excuse & Remarks</th>
              <th className="py-3 px-4 w-16 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4 text-center">
                    <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-sm mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                        <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                      No student records found
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Try adjusting your search query, status filter, or class selection.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => {
                const recId = record.id || record.studentId
                return (
                  <tr
                    key={recId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                      {index + 1}
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 ${
                            record.status === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : record.status === 'LATE'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : record.status === 'EXCUSED'
                              ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {record.studentAvatar ||
                            record.studentName?.substring(0, 2).toUpperCase() ||
                            'ST'}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onOpenHistoryDrawer(record)}
                            className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate block text-left cursor-pointer"
                          >
                            {record.studentName || 'Student Name'}
                          </button>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span className="font-mono">{record.studentCode || record.studentId}</span>
                            <span>•</span>
                            <span>{record.class}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 4-State Quick Toggle Buttons */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
                        {/* PRESENT */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(recId, 'PRESENT')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            record.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs scale-102'
                              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        {/* LATE */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(recId, 'LATE')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            record.status === 'LATE'
                              ? 'bg-amber-500 text-white shadow-xs scale-102'
                              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        {/* ABSENT */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(recId, 'ABSENT')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            record.status === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs scale-102'
                              : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        {/* EXCUSED */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(recId, 'EXCUSED')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            record.status === 'EXCUSED'
                              ? 'bg-violet-600 text-white shadow-xs scale-102'
                              : 'text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400'
                          }`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Excused</span>
                        </button>
                      </div>
                    </td>

                    {/* Time In */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={record.checkIn || ''}
                          onChange={(e) => onUpdateCheckIn(recId, e.target.value)}
                          placeholder="--:--"
                          disabled={record.status === 'ABSENT'}
                          className="w-20 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono disabled:opacity-40 disabled:cursor-not-allowed focus:outline-hidden focus:border-brand-500"
                        />
                        {record.status !== 'ABSENT' && (
                          <button
                            type="button"
                            onClick={() => setNowTime(recId, 'checkIn')}
                            title="Set to Current Time"
                            className="px-1.5 py-1 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
                          >
                            Now
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Time Out */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={record.checkOut || ''}
                          onChange={(e) => onUpdateCheckOut(recId, e.target.value)}
                          placeholder="--:--"
                          disabled={record.status === 'ABSENT'}
                          className="w-20 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono disabled:opacity-40 disabled:cursor-not-allowed focus:outline-hidden focus:border-brand-500"
                        />
                        {record.status !== 'ABSENT' && (
                          <button
                            type="button"
                            onClick={() => setNowTime(recId, 'checkOut')}
                            title="Set to Current Time"
                            className="px-1.5 py-1 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
                          >
                            Now
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Excuse & Remarks */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {record.note ? (
                          <button
                            type="button"
                            onClick={() => onOpenNoteModal(record)}
                            className="text-left flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/50 text-violet-800 dark:text-violet-300 rounded-lg text-xs hover:bg-violet-100 transition-colors max-w-[190px] truncate cursor-pointer"
                          >
                            <FileText className="w-3 h-3 shrink-0 text-violet-500" />
                            <span className="truncate">{record.note}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenNoteModal(record)}
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Add note</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Profile Link */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenHistoryDrawer(record)}
                        title="View Attendance History & Statistics"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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

      {/* Mobile Card List View (< 768px) */}
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                </div>
              </div>
              <div className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
          ))
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-slate-400 px-4">
            <Info className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              No student records found
            </p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Try adjusting your search query, status filter, or class selection.
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const recId = record.id || record.studentId
            return (
              <div key={recId} className="p-4 space-y-3 bg-white dark:bg-slate-900">
                {/* Header: Student Info + Profile Link */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        record.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : record.status === 'LATE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : record.status === 'EXCUSED'
                          ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {record.studentAvatar ||
                        record.studentName?.substring(0, 2).toUpperCase() ||
                        'ST'}
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenHistoryDrawer(record)}
                        className="font-bold text-sm text-slate-900 dark:text-white truncate block text-left"
                      >
                        {record.studentName || 'Student Name'}
                      </button>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{record.studentCode || record.studentId}</span>
                        <span>•</span>
                        <span>{record.class}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenHistoryDrawer(record)}
                    className="p-2 rounded-xl text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 4-State Quick Action Buttons */}
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(recId, 'PRESENT')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      record.status === 'PRESENT'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Present</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(recId, 'LATE')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      record.status === 'LATE'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Late</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(recId, 'ABSENT')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      record.status === 'ABSENT'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Absent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(recId, 'EXCUSED')}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      record.status === 'EXCUSED'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Excused</span>
                  </button>
                </div>

                {/* Times & Note Section */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400">In:</span>
                      <input
                        type="text"
                        value={record.checkIn || ''}
                        onChange={(e) => onUpdateCheckIn(recId, e.target.value)}
                        placeholder="--:--"
                        disabled={record.status === 'ABSENT'}
                        className="w-18 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono disabled:opacity-40"
                      />
                      {record.status !== 'ABSENT' && (
                        <button
                          type="button"
                          onClick={() => setNowTime(recId, 'checkIn')}
                          className="px-1.5 py-1 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md"
                        >
                          Now
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400">Out:</span>
                      <input
                        type="text"
                        value={record.checkOut || ''}
                        onChange={(e) => onUpdateCheckOut(recId, e.target.value)}
                        placeholder="--:--"
                        disabled={record.status === 'ABSENT'}
                        className="w-18 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono disabled:opacity-40"
                      />
                      {record.status !== 'ABSENT' && (
                        <button
                          type="button"
                          onClick={() => setNowTime(recId, 'checkOut')}
                          className="px-1.5 py-1 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md"
                        >
                          Now
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    {record.note ? (
                      <button
                        type="button"
                        onClick={() => onOpenNoteModal(record)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/50 text-violet-800 dark:text-violet-300 rounded-lg text-xs max-w-[160px] truncate"
                      >
                        <FileText className="w-3 h-3 shrink-0 text-violet-500" />
                        <span className="truncate">{record.note}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenNoteModal(record)}
                        className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Note</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Roster Footer Summary */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredRecords.length}</span>{' '}
          of <span className="font-bold text-slate-900 dark:text-white">{records.length}</span> total students
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> {counts.present} Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> {counts.late} Late
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> {counts.absent} Absent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500" /> {counts.excused} Excused
          </span>
        </div>
      </div>
    </div>
  )
}
