// src/features/attendance/AttendanceExcuseNoteModal.tsx
import React, { useState, useEffect } from 'react'
import { X, FileText, Check, AlertCircle } from 'lucide-react'
import type { AttendanceRecord } from '@/services/attendanceService'

interface AttendanceExcuseNoteModalProps {
  isOpen: boolean
  onClose: () => void
  record: AttendanceRecord | null
  onSaveNote: (recordId: string, note: string) => void
}

const COMMON_REASONS = [
  'Medical / Doctor Appointment',
  'Family Emergency',
  'Flu / Illness with Medical Certificate',
  'Official School Sports / Olympiad',
  'Public Transit / Bus Delay',
  'Bereavement',
  'College Interview / Campus Visit',
]

export default function AttendanceExcuseNoteModal({
  isOpen,
  onClose,
  record,
  onSaveNote,
}: AttendanceExcuseNoteModalProps) {
  const [note, setNote] = useState(record?.note || '')

  useEffect(() => {
    setNote(record?.note || '')
  }, [record?.id, record?.note])

  if (!isOpen || !record) return null

  const handleSave = () => {
    onSaveNote(record.id || record.studentId, note)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] glass-strong animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-violet-400/25 via-purple-400/15 to-transparent blur-3xl opacity-60" />

        <div className="relative z-10 flex items-center justify-between px-6 py-4.5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25">
              <FileText className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-fg">Excuse & Attendance Note</h3>
              <p className="text-xs text-fg-muted mt-0.5">
                {record.studentName} ({record.studentCode || record.studentId}) • {record.class}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition hover:text-fg hover:shadow-sunken cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-fg mb-2">
              Quick Preset Reasons
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setNote(reason)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-violet-700 dark:hover:text-violet-300 shadow-sunken transition cursor-pointer"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-fg mb-1.5">
              Custom Excuse Remarks / Medical Note
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Parent notified school office at 07:30 AM regarding medical appointment. Official medical certificate attached."
              className="w-full rounded-2xl p-3.5 text-xs sm:text-sm font-medium text-fg focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-violet-500/10 p-3.5 text-xs text-violet-800 dark:text-violet-300">
            <AlertCircle className="w-4 h-4 text-violet-500 shrink-0" />
            <span>
              Authorized notes are instantly synced to the student cumulative file and parent communication portal.
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-end gap-2.5 px-6 py-4 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
          <button
            type="button"
            onClick={onClose}
            className="glass-sm glass-interactive rounded-2xl px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  )
}