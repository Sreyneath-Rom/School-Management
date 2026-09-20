// src/pages/Exams/MarkEntry.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  Save,
  Search,
  Download,
  RefreshCw,
  Info,
  Award,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { examService, type MarkEntryRecord } from '@/services/examService'

export default function MarkEntry() {
  const { showToast } = useToast()

  const [records, setRecords] = useState<MarkEntryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await examService.marks()
      setRecords(Array.isArray(data) ? data : [])
    } catch {
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(
    () =>
      records.filter((m) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          m.studentName.toLowerCase().includes(q) ||
          m.rollNumber.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q)
        )
      }),
    [records, search]
  )

  const stats = useMemo(() => {
    const scored = records.filter((r) => r.marksObtained > 0)
    const avg =
      scored.length > 0
        ? scored.reduce((sum, r) => sum + r.marksObtained, 0) / scored.length
        : 0
    const max =
      scored.length > 0
        ? Math.max(...scored.map((r) => r.marksObtained))
        : 0
    return { total: records.length, avg, max, graded: scored.length }
  }, [records])

  const kpiCards: StatCard[] = [
    { id: 'total', label: 'Records', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: 'marks entered', icon: 'Users', tint: 'blue' },
    { id: 'graded', label: 'Graded', value: `${stats.graded} / ${stats.total}`, delta: '-', deltaDirection: 'neutral', deltaLabel: 'complete', icon: 'CheckCircle2', tint: 'green' },
    { id: 'avg', label: 'Average', value: stats.avg.toFixed(1), delta: '-', deltaDirection: 'neutral', deltaLabel: 'class average', icon: 'TrendingUp', tint: 'sky' },
    { id: 'max', label: 'Highest', value: stats.max.toFixed(0), delta: '-', deltaDirection: 'neutral', deltaLabel: 'top score', icon: 'Award', tint: 'amber' },
  ]

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      showToast('Nothing to export', 'info')
      return
    }
    const header = 'Student,Roll,Subject,Marks,Max,Grade,Remarks'
    const rows = filtered.map((m) =>
      [
        m.studentName,
        m.rollNumber,
        m.subject,
        m.marksObtained,
        m.maxMarks,
        m.grade,
        (m.remarks ?? '').replace(/,/g, ';'),
      ].join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marks-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    // Writes go through examService.updateMarkEntry once that endpoint
    // exists. For now, surface the stub status rather than pretending.
    showToast(examService.stubMessage, 'info')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Mark Entry"
          subtitle="Record marks, letter grades, and feedback for exam papers."
        />
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-strong text-color text-xs font-semibold transition"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          The mark-entry endpoint is part of the exams stub. Saving returns a
          501 until the MarkEntry model is added.
        </p>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="overflow-hidden rounded-2xl glass-sm border border-surface">
        <div className="p-3.5 border-b border-surface flex items-center gap-3">
          <Search size={16} className="text-secondary" />
          <input
            type="text"
            placeholder="Search student, roll number, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent text-color placeholder:text-secondary focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-secondary text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading marks...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Award className="mx-auto mb-3 h-10 w-10 text-secondary" />
            <p className="text-sm font-semibold text-color">
              {records.length === 0 ? 'No marks recorded yet' : 'No matches'}
            </p>
            <p className="text-xs text-secondary mt-1">
              {records.length === 0
                ? 'Marks will appear here once the backend module is implemented.'
                : 'Try a different search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-strong text-secondary font-semibold border-b border-surface">
                <tr>
                  <th className="p-3.5">Roll</th>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5 text-center">Marks</th>
                  <th className="p-3.5 text-center">Grade</th>
                  <th className="p-3.5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-surface/40 transition">
                    <td className="p-3.5 font-mono text-secondary">
                      {m.rollNumber}
                    </td>
                    <td className="p-3.5 font-semibold text-color">
                      {m.studentName}
                    </td>
                    <td className="p-3.5 text-color">{m.subject}</td>
                    <td className="p-3.5 text-center font-bold text-color">
                      {m.marksObtained} / {m.maxMarks}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300">
                        {m.grade}
                      </span>
                    </td>
                    <td className="p-3.5 text-secondary italic">
                      {m.remarks || '—'}
                    </td>
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