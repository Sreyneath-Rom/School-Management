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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Excuse & Attendance Note
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {record.studentName} ({record.studentCode || record.studentId}) • {record.class}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Quick Preset Reasons
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setNote(reason)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Custom Excuse Remarks / Doctor Note Details
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Parent called at 07:30 AM to report medical visit. Excused slip to follow."
              className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-xs text-slate-600 dark:text-slate-400">
            <AlertCircle className="w-4 h-4 text-violet-500 shrink-0" />
            <span>
              Notes attached to excused/absent records are synchronized to the parent portal and student cumulative file.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  )
}
