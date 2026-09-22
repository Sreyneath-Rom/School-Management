// src/features/attendance/AttendanceExportModal.tsx
import React, { useState } from 'react'
import { X, Download, FileSpreadsheet, Printer, Check } from 'lucide-react'
import type { AttendanceRecord } from '@/services/attendanceService'

interface AttendanceExportModalProps {
  isOpen: boolean
  onClose: () => void
  records: AttendanceRecord[]
  selectedDate: string
  selectedClass: string
}

export default function AttendanceExportModal({
  isOpen,
  onClose,
  records,
  selectedDate,
  selectedClass,
}: AttendanceExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'print'>('csv')
  const [downloaded, setDownloaded] = useState(false)

  if (!isOpen) return null

  const handleExport = () => {
    if (format === 'print') {
      window.print()
      onClose()
      return
    }

    const headers = ['Student ID', 'Student Name', 'Class', 'Date', 'Status', 'Check-In', 'Check-Out', 'Note']
    const rows = records.map((r) => [
      `"${r.studentCode || r.studentId}"`,
      `"${r.studentName || ''}"`,
      `"${r.class || ''}"`,
      `"${r.date}"`,
      `"${r.status}"`,
      `"${r.checkIn || ''}"`,
      `"${r.checkOut || ''}"`,
      `"${r.note || ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Attendance_${selectedClass.replace(/\s+/g, '_')}_${selectedDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloaded(true)
    setTimeout(() => {
      setDownloaded(false)
      onClose()
    }, 1200)
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
        className="relative w-full max-w-md overflow-hidden rounded-[28px] glass-strong animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-linear-to-br from-emerald-400/20 via-teal-400/15 to-transparent blur-3xl opacity-60" />

        <div className="relative z-10 flex items-center justify-between px-6 py-4.5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25">
              <Download className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-fg">Export Attendance Records</h3>
              <p className="text-xs text-fg-muted mt-0.5">
                {selectedClass} • {selectedDate} ({records.length} students)
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
          <label className="block text-xs font-bold text-fg">
            Export Format & Destination
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
                format === 'csv'
                  ? 'text-emerald-800 dark:text-emerald-300 shadow-sunken'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold block text-fg">CSV Spreadsheet</span>
                <span className="text-[10px] text-fg-muted font-medium">Excel & Sheets ready</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('print')}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
                format === 'print'
                  ? 'text-blue-800 dark:text-blue-300 shadow-sunken'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <Printer className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold block text-fg">Print / PDF</span>
                <span className="text-[10px] text-fg-muted font-medium">Official roll sheet</span>
              </div>
            </button>
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
            onClick={handleExport}
            disabled={downloaded}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer disabled:opacity-50"
          >
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'Downloaded!' : format === 'csv' ? 'Download CSV' : 'Open Print View'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}