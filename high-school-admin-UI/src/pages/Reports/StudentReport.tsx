// src/pages/Reports/StudentReport.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Search, Download, Printer, RefreshCw, Info, GraduationCap, FileText,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { reportService } from '@/services/reportService'
import { studentService } from '@/services/studentService'
import { academicService } from '@/services/academicService'
import type { GradeRecord } from '@/types/academic'
import type { StudentProfileView } from '@/types/studentProfile'

interface StudentOption {
  id: string
  name: string
  studentCode: string
  className: string
}

/* Neumorphic hairline seam (bottom edge). */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'

function displayName(s: StudentProfileView): string {
  const composed = `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim()
  return composed || s.studentCode || s.id
}

export default function StudentReport() {
  const { showToast } = useToast()

  const [students, setStudents] = useState<StudentOption[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [search, setSearch] = useState('')
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [loadingReport, setLoadingReport] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await studentService.list({ limit: 500 })
        if (cancelled) return
        const options = (Array.isArray(list) ? list : []).map((s) => ({
          id: s.id,
          name: displayName(s),
          studentCode: s.studentCode ?? '',
          className: s.className ?? '',
        }))
        setStudents(options)
        if (options.length > 0) setSelectedId((prev) => prev || options[0].id)
      } catch {
        if (!cancelled) setStudents([])
      } finally {
        if (!cancelled) setLoadingStudents(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const loadReport = useCallback(async () => {
    if (!selectedId) { setGrades([]); return }
    setLoadingReport(true)
    setError(null)
    try {
      await reportService.forStudent(selectedId).catch(() => null)
      const rows = await academicService.getAllGrades({ studentId: selectedId })
      setGrades(Array.isArray(rows) ? rows : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setGrades([])
    } finally {
      setLoadingReport(false)
    }
  }, [selectedId])

  useEffect(() => { loadReport() }, [loadReport])

  const filteredStudents = students.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.studentCode.toLowerCase().includes(q)
    )
  })

  const selected = students.find((s) => s.id === selectedId) ?? null

  const summary = grades.length > 0
    ? {
        avg: Number((grades.reduce((sum, r) => sum + r.percentage, 0) / grades.length).toFixed(1)),
        gpa: Number((grades.reduce((sum, r) => sum + r.gpa, 0) / grades.length).toFixed(2)),
        records: grades.length,
      }
    : null

  const handleExportCSV = () => {
    if (!selected || grades.length === 0) { showToast('Nothing to export', 'info'); return }
    const headers = ['Student ID','Name','Class','Subject','Period','Score','Max','Percentage','Letter','GPA','Comment']
    const data = grades.map((g) => [
      selected.studentCode || selected.id,
      `"${selected.name}"`,
      `"${g.className}"`,
      `"${g.subjectName}"`,
      `"${g.periodLabel}"`,
      g.score, g.maxScore, g.percentage, g.letterGrade, g.gpa,
      `"${(g.comment ?? '').replace(/"/g, '""')}"`,
    ])
    const csv = [headers.join(','), ...data.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Student_Report_${selected.studentCode || selected.id}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Report exported', 'success')
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading title="Student Report" subtitle="Individual academic transcript." />
        <div className="flex items-center gap-2">
          <button
            onClick={loadReport}
            disabled={loadingReport || !selectedId}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loadingReport ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-button-primary text-xs font-medium cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/10 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-fg-muted">
          Only grade records are rendered. Composite standings require the Student
          aggregate endpoint which is not yet returning data.
        </p>
      </div>

      {/* Selector bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between glass-sm p-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-fg-muted">Student:</span>
          {loadingStudents ? (
            <span className="text-xs text-fg-muted">Loading students...</span>
          ) : (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl text-fg min-w-64 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {students.length === 0 && <option value="">No students</option>}
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.studentCode ? `${s.studentCode} — ` : ''}{s.name}
                  {s.className ? ` (${s.className})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl text-fg placeholder:text-fg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {!selected ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <FileText className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-sm font-semibold text-fg">No student selected</p>
          <p className="text-xs text-fg-muted mt-1">
            {students.length === 0
              ? 'No students available. Enroll a student first.'
              : 'Choose a student to view their report.'}
          </p>
        </div>
      ) : (
        // Report sheet — glass-strong reads as "elevated document"
        <div className="rounded-3xl glass-strong p-6 sm:p-8 space-y-6">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 ${SEAM_B}`}>
            <div className="flex items-center gap-4">
              {/* Avatar — brand-ramp gradient only; no local elevation
                  (the glass-strong sheet already provides the raised
                  surface, so a second shadow would double-stack). */}
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-600 to-brand-900 text-white flex items-center justify-center font-black text-xl shrink-0">
                {selected.name
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-black text-fg">{selected.name}</h1>
                <p className="text-xs text-fg-muted mt-1 flex items-center gap-2">
                  {selected.studentCode && <span className="font-mono">{selected.studentCode}</span>}
                  {selected.className && <span>• {selected.className}</span>}
                </p>
              </div>
            </div>
            {summary && (
              <div className="flex items-center gap-6 text-xs">
                <div className="text-right">
                  <span className="text-fg-muted block text-[10px] uppercase font-bold">Average</span>
                  <span className="font-black text-fg text-lg">{summary.avg}%</span>
                </div>
                <div className="text-right">
                  <span className="text-fg-muted block text-[10px] uppercase font-bold">GPA</span>
                  <span className="font-black text-success text-lg">{summary.gpa.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-fg-muted block text-[10px] uppercase font-bold">Records</span>
                  <span className="font-black text-fg text-lg">{summary.records}</span>
                </div>
              </div>
            )}
          </div>

          {loadingReport ? (
            <div className="py-12 text-center text-fg-muted text-sm">
              <RefreshCw size={16} className="inline animate-spin mr-2" />
              Loading report...
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-sm font-bold text-error">Couldn't load report</p>
              <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
            </div>
          ) : grades.length === 0 ? (
            <div className="py-12 text-center">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
              <p className="text-sm font-semibold text-fg">No grades recorded</p>
              <p className="text-xs text-fg-muted mt-1">This student has no grade entries yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className={`text-fg-muted font-bold ${SEAM_B}`}>
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-3">Period</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3 text-center">%</th>
                    <th className="py-3 px-3 text-center">Letter</th>
                    <th className="py-3 px-3 text-center">GPA</th>
                    <th className="py-3 px-4">Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--neu-shadow-dark)">
                  {grades.map((g) => (
                    <tr key={g.id} className="hover:shadow-sunken transition-shadow">
                      <td className="py-3 px-4 font-bold text-fg">{g.subjectName || '—'}</td>
                      <td className="py-3 px-3 text-fg-muted text-[11px]">{g.periodLabel} ({g.period})</td>
                      <td className="py-3 px-3 text-center font-mono text-fg-muted">{g.score} / {g.maxScore}</td>
                      <td className="py-3 px-3 text-center font-bold font-mono text-fg">{g.percentage}%</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-brand-500/15 text-brand-700 dark:text-brand-300">
                          {g.letterGrade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-fg">{g.gpa.toFixed(2)}</td>
                      <td className="py-3 px-4 text-fg-muted italic text-[11px]">{g.comment || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}