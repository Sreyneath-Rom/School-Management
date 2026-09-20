// src/pages/Exams/ReportCard.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Printer,
  Download,
  RefreshCw,
  Info,
  School,
  FileText,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { examService, type ReportCardRecord } from '@/services/examService'

export default function ReportCard() {
  const { showToast } = useToast()

  const [cards, setCards] = useState<ReportCardRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string>('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await examService.reportCards()
      const list = Array.isArray(data) ? data : []
      setCards(list)
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id)
      }
    } catch {
      setCards([])
    } finally {
      setLoading(false)
    }
  }, [selectedId])

  useEffect(() => {
    load()
  }, [load])

  const selected = cards.find((c) => c.id === selectedId) ?? null

  const handleDownload = () => {
    if (!selected) {
      showToast('Nothing to download', 'info')
      return
    }
    showToast(
      'PDF export is not yet wired to the backend. Use Print for now.',
      'info'
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Report Cards"
          subtitle="Official academic transcripts, grades, and remarks."
        />
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-strong text-color text-xs font-semibold transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => window.print()}
            disabled={!selected}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-strong text-color text-xs font-semibold transition disabled:opacity-40"
          >
            <Printer size={15} />
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={!selected}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition disabled:opacity-40"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          Report cards are part of the exams stub module. Until the backend
          returns real records, this page renders an empty state.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-secondary text-sm rounded-2xl glass-sm border border-surface">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading report cards...
        </div>
      ) : cards.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm border border-surface">
          <FileText className="mx-auto mb-3 h-12 w-12 text-secondary" />
          <h3 className="text-base font-semibold text-color">
            No report cards available
          </h3>
          <p className="text-sm text-secondary mt-1 max-w-md mx-auto">
            Once the exams module is implemented and marks are entered, report
            cards will be generated here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl glass-sm border border-surface">
            <div className="w-full sm:w-80">
              <label className="block text-[11px] font-semibold text-secondary mb-1">
                Report card
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
              >
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.studentName} — {c.class} ({c.term})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selected && (
            <div className="rounded-3xl p-8 bg-surface border border-surface shadow-xl max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-surface gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30">
                    <School size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-color uppercase tracking-tight">
                      Official Academic Transcript
                    </h2>
                    <div className="text-xs text-secondary font-medium">
                      {selected.academicYear} • {selected.term}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                    Report Card
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-surface-strong border border-surface text-xs">
                <div>
                  <span className="text-secondary block text-[10px] uppercase font-bold">
                    Student
                  </span>
                  <span className="font-bold text-color text-sm">
                    {selected.studentName}
                  </span>
                </div>
                <div>
                  <span className="text-secondary block text-[10px] uppercase font-bold">
                    Class
                  </span>
                  <span className="font-semibold text-color">
                    {selected.class}
                  </span>
                </div>
                <div>
                  <span className="text-secondary block text-[10px] uppercase font-bold">
                    Rank
                  </span>
                  <span className="font-semibold text-color">
                    {selected.rank}
                  </span>
                </div>
                <div>
                  <span className="text-secondary block text-[10px] uppercase font-bold">
                    GPA
                  </span>
                  <span className="font-black text-success text-sm">
                    {selected.overallGpa.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-surface">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-strong text-secondary font-bold border-b border-surface">
                    <tr>
                      <th className="p-3">Subject</th>
                      <th className="p-3 text-center">Credits</th>
                      <th className="p-3 text-center">Score</th>
                      <th className="p-3 text-center">Grade</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    {selected.subjects.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-surface-strong/50">
                        <td className="p-3 font-bold text-color">
                          {sub.subject}
                        </td>
                        <td className="p-3 text-center font-medium">
                          {sub.credits}
                        </td>
                        <td className="p-3 text-center font-bold text-color">
                          {sub.score}
                        </td>
                        <td className="p-3 text-center font-bold text-brand-600 dark:text-brand-400">
                          {sub.grade}
                        </td>
                        <td className="p-3 text-secondary text-[11px] italic">
                          {sub.remarks || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface-strong border border-surface text-xs">
                  <span className="font-bold text-color block mb-1">
                    Conduct
                  </span>
                  <p className="text-secondary italic">{selected.conduct}</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-strong border border-surface text-xs">
                  <span className="font-bold text-color block mb-1">
                    Attendance
                  </span>
                  <p className="text-secondary">
                    {selected.attendanceRate}%
                  </p>
                </div>
              </div>

              <div className="pt-4 text-right text-[11px] text-secondary">
                Issued {selected.issueDate}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}