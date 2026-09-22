// src/pages/Reports/GradeReport.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  Filter, Download, Printer, Search, RefreshCw, Info, Award,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { academicService } from '@/services/academicService'
import { classService, type ClassRecord } from '@/services/classService'
import type { GradeRecord } from '@/types/academic'

interface StudentSummary {
  studentId: string
  name: string
  studentCode: string
  className: string
  records: number
  averagePercentage: number
  averageGpa: number
  letterGrade: GradeRecord['letterGrade']
}

/* Neumorphic hairline seam (bottom edge). */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'

function letterFor(pct: number): GradeRecord['letterGrade'] {
  if (pct >= 90) return 'A'
  if (pct >= 80) return 'B'
  if (pct >= 70) return 'C'
  if (pct >= 60) return 'D'
  return 'F'
}

function aggregate(rows: GradeRecord[]): StudentSummary[] {
  const byStudent = new Map<string, GradeRecord[]>()
  for (const row of rows) {
    const list = byStudent.get(row.studentId) ?? []
    list.push(row)
    byStudent.set(row.studentId, list)
  }

  const out: StudentSummary[] = []
  for (const [studentId, list] of byStudent) {
    const first = list[0]
    const avgPct = list.reduce((sum, r) => sum + r.percentage, 0) / list.length
    const avgGpa = list.reduce((sum, r) => sum + r.gpa, 0) / list.length
    out.push({
      studentId,
      name: first.studentName || first.studentCode || studentId,
      studentCode: first.studentCode,
      className: first.className,
      records: list.length,
      averagePercentage: Number(avgPct.toFixed(1)),
      averageGpa: Number(avgGpa.toFixed(2)),
      letterGrade: letterFor(avgPct),
    })
  }
  return out.sort((a, b) => b.averagePercentage - a.averagePercentage)
}

const filterInput =
  'w-full text-xs px-3 py-2 rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
const filterLabel = 'block text-[11px] font-medium text-fg-muted mb-1'

export default function GradeReport() {
  const { showToast } = useToast()

  const [classId, setClassId] = useState('')
  const [search, setSearch] = useState('')
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [records, setRecords] = useState<GradeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    classService
      .list()
      .then((c) => setClasses(Array.isArray(c) ? c : []))
      .catch(() => setClasses([]))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const raw = await academicService.getAllGrades(classId ? { classId } : undefined)
      setRecords(Array.isArray(raw) ? raw : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [classId])

  useEffect(() => { load() }, [load])

  const summaries = useMemo(() => aggregate(records), [records])

  const filtered = useMemo(
    () =>
      summaries.filter((s) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          s.name.toLowerCase().includes(q) ||
          s.studentCode.toLowerCase().includes(q)
        )
      }),
    [summaries, search]
  )

  const stats = useMemo(() => {
    const total = filtered.length
    const avgGpa = total ? filtered.reduce((sum, s) => sum + s.averageGpa, 0) / total : 0
    const avgPct = total ? filtered.reduce((sum, s) => sum + s.averagePercentage, 0) / total : 0
    const passing = filtered.filter((s) => s.averagePercentage >= 60).length
    const honorRoll = filtered.filter((s) => s.averageGpa >= 3.8).length
    return { total, avgGpa, avgPct, passing, honorRoll }
  }, [filtered])

  const brackets = useMemo(() => {
    const b = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    for (const s of filtered) b[s.letterGrade] += 1
    return b
  }, [filtered])

  const kpiCards: StatCard[] = [
    { id: 'avg-gpa',   label: 'Average GPA',   value: stats.avgGpa.toFixed(2),                                               delta: '-', deltaDirection: 'neutral', deltaLabel: 'across students', icon: 'Award',         tint: 'blue' },
    { id: 'avg-score', label: 'Average Score', value: `${stats.avgPct.toFixed(1)}%`,                                              delta: '-', deltaDirection: 'neutral', deltaLabel: 'across subjects', icon: 'TrendingUp',    tint: 'green' },
    { id: 'pass-rate', label: 'Pass Rate',     value: `${stats.total ? Math.round((stats.passing / stats.total) * 100) : 0}%`,    delta: '-', deltaDirection: 'neutral', deltaLabel: `${stats.passing} / ${stats.total}`,   icon: 'CheckCircle2',  tint: 'amber' },
    { id: 'honor',     label: 'Honor Roll',    value: String(stats.honorRoll),                                                   delta: '-', deltaDirection: 'neutral', deltaLabel: 'GPA ≥ 3.8',       icon: 'GraduationCap', tint: 'violet' },
  ]

  const handleExportCSV = () => {
    if (filtered.length === 0) { showToast('Nothing to export', 'info'); return }
    const headers = ['Student ID','Name','Class','Records','Average %','Letter','GPA']
    const data = filtered.map((s) => [
      s.studentCode || s.studentId, `"${s.name}"`, s.className,
      s.records, s.averagePercentage, s.letterGrade, s.averageGpa,
    ])
    const csv = [headers.join(','), ...data.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Grade_Report_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Report exported', 'success')
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Academic Performance Report"
          subtitle="Grade distribution, averages, and standing by student."
        />
        <div className="flex items-center gap-2.5">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
          Report is computed from recorded grade rows. Each row is one
          student&times;subject&times;period score — averages are per student
          across all recorded subjects.
        </p>
      </div>

      {/* Filter card */}
      <div className="p-4 rounded-2xl glass-sm space-y-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-fg">
          <Filter className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={filterLabel}>Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className={`${filterInput} cursor-pointer`}
            >
              <option value="">All classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={filterLabel}>Search student</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or ID..."
              className={filterInput}
            />
          </div>
        </div>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grade Distribution — semantic fill colors carry meaning, kept */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-fg">Grade Distribution</h3>
            <span className="text-xs text-fg-muted">{filtered.length} students</span>
          </div>
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D', 'F'] as const).map((letter) => {
              const count = brackets[letter]
              const pct = filtered.length ? Math.round((count / filtered.length) * 100) : 0
              const color =
                letter === 'A' ? 'bg-success'
                : letter === 'B' ? 'bg-info'
                : letter === 'C' ? 'bg-warning'
                : letter === 'D' ? 'bg-warning/60'
                : 'bg-error'
              return (
                <div key={letter} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-fg">Grade {letter}</span>
                    <span className="text-fg-muted">{count} ({pct}%)</span>
                  </div>
                  {/* Track: sunken well */}
                  <div className="w-full h-2 rounded-full shadow-sunken overflow-hidden">
                    <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Grading Scale reference */}
        <div className="p-5 rounded-2xl glass-sm space-y-3">
          <h3 className="font-bold text-sm text-fg flex items-center gap-1.5">
            <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Grading Scale
          </h3>
          <div className="space-y-2 text-xs">
            {[
              ['A', '90 – 100%', '4.0'],
              ['B', '80 – 89%', '3.0'],
              ['C', '70 – 79%', '2.0'],
              ['D', '60 – 69%', '1.0'],
              ['F', '< 60%', '0.0'],
            ].map(([letter, range, gpa]) => (
              <div
                key={letter}
                className="flex justify-between p-2.5 rounded-xl shadow-sunken"
              >
                <span className="font-medium text-fg">{letter} ({range})</span>
                <span className="font-bold text-fg">{gpa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roster table */}
      <div className="glass-sm rounded-2xl overflow-hidden">
        <div className={`p-4 ${SEAM_B}`}>
          <h3 className="font-bold text-sm text-fg">Student Roster</h3>
        </div>
        {loading ? (
          <div className="py-16 text-center text-fg-muted text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading grades...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load report</p>
            <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-fg-muted text-sm">
            {summaries.length === 0
              ? 'No grade records available.'
              : 'No students match the search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`text-fg-muted font-semibold ${SEAM_B}`}>
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3 text-center">Records</th>
                  <th className="py-3 px-3 text-center">Average %</th>
                  <th className="py-3 px-3 text-center">Letter</th>
                  <th className="py-3 px-3 text-center">GPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--neu-shadow-dark)">
                {filtered.map((s) => (
                  <tr key={s.studentId} className="hover:shadow-sunken transition-shadow">
                    <td className="py-3 px-4 font-medium text-fg">
                      <div>{s.name}</div>
                      {s.studentCode && (
                        <span className="text-[10px] text-fg-muted font-mono">{s.studentCode}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-fg-muted">{s.className}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.records}</td>
                    <td className="py-3 px-3 text-center font-bold font-mono text-fg">{s.averagePercentage}%</td>
                    <td className="py-3 px-3 text-center">
                      {/* Letter chip — brand tint, matches GradeBadge elsewhere */}
                      <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-brand-500/15 text-brand-700 dark:text-brand-300">
                        {s.letterGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono text-fg">{s.averageGpa.toFixed(2)}</td>
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