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

    // Generate CSV
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Export Attendance Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedClass} • {selectedDate} ({records.length} records)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                format === 'csv'
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
              <div className="text-center">
                <span className="text-xs font-bold block">CSV Spreadsheet</span>
                <span className="text-[10px] text-slate-400">Excel, Sheets compatible</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('print')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                format === 'print'
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-6 h-6 text-brand-600" />
              <div className="text-center">
                <span className="text-xs font-bold block">Print / PDF</span>
                <span className="text-[10px] text-slate-400">Printer-ready roll format</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={downloaded}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors"
          >
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'Downloaded!' : format === 'csv' ? 'Download CSV' : 'Open Print View'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
