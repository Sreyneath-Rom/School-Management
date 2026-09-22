// src/pages/Exams/ExamList.tsx
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@/components/common/PageHeading'
import {
  FileText, Plus, Search, Calendar, BookOpen, Layers,
  ChevronRight, RefreshCw, Info,
} from 'lucide-react'
import { examService, type ExamRecord } from '@/services/examService'

export default function ExamList() {
  const [exams, setExams] = useState<ExamRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await examService.list()
      setExams(Array.isArray(list) ? list : [])
    } catch {
      setExams([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = exams.filter((ex) => {
    if (statusFilter !== 'All' && ex.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.term.toLowerCase().includes(q) ||
        ex.academicYear.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Examinations"
          subtitle="Manage exam sessions, schedules, and publishing status."
        />
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/academic/exam-schedules"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-semibold"
          >
            <Calendar size={15} />
            <span>Schedules</span>
          </Link>
          <Link
            to="/academic/exams/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold"
          >
            <Plus size={16} />
            <span>New Exam</span>
          </Link>
        </div>
      </div>

      {/* Info banner — semantic info signal, tinted */}
      <div className="rounded-2xl border border-info/30 bg-info/10 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-fg-muted">
          The exams module is not yet implemented on the backend. Exams you
          create here will start persisting once the Exam model lands. Writes
          currently return a 501 and will surface an error in the toast.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-fg-muted z-10 pointer-events-none" />
          {/* Inputs inherit the sunken-well look from globals.css (.neu-inset) */}
          <input
            type="text"
            placeholder="Search exam title, term, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
        >
          <option value="All">All statuses</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading exams...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <FileText className="mx-auto mb-3 h-12 w-12 text-fg-muted/60" />
          <h3 className="text-base font-semibold text-fg">
            {exams.length === 0 ? 'No exams yet' : 'No matches'}
          </h3>
          <p className="text-sm text-fg-muted mt-1 max-w-md mx-auto">
            {exams.length === 0
              ? 'Exams will appear here once the backend module is implemented.'
              : 'Try a different search or status filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((exam) => (
            <div
              key={exam.id}
              className="rounded-2xl p-5 glass-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Brand icon well — sunken into the card */}
                    <div className="p-3 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
                      <FileText size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-fg">{exam.title}</h3>
                      <div className="text-xs text-fg-muted font-mono">
                        {exam.term} • {exam.academicYear}
                      </div>
                    </div>
                  </div>
                  {/* Status pill — semantic tints; neutral is sunken */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      exam.status === 'COMPLETED'
                        ? 'bg-success/15 text-success'
                        : exam.status === 'ACTIVE'
                          ? 'bg-warning/15 text-warning'
                          : exam.status === 'ARCHIVED'
                            ? 'text-fg-muted shadow-sunken'
                            : 'bg-info/15 text-info'
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>

                {/* Inner stat rows — top & bottom shadow seams */}
                <div className="space-y-2 py-3 shadow-[0_-1px_0_var(--neu-shadow-dark),0_1px_0_var(--neu-shadow-dark)] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-fg-muted">
                      <Calendar size={13} /> Window
                    </span>
                    <span className="font-medium text-fg">
                      {exam.startDate} → {exam.endDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-fg-muted">
                      <BookOpen size={13} /> Subjects
                    </span>
                    <span className="font-medium text-fg">{exam.totalSubjects}</span>
                  </div>
                  {exam.classesCovered?.length > 0 && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-fg-muted shrink-0">
                        <Layers size={13} /> Classes
                      </span>
                      <span className="font-medium text-fg text-right truncate">
                        {exam.classesCovered.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <Link
                  to={`/academic/mark-entry?exam=${exam.id}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-brand-700 dark:text-brand-300 shadow-sunken hover:bg-brand-500/10 transition flex items-center gap-1.5"
                >
                  Enter marks
                  <ChevronRight size={14} />
                </Link>
                <Link
                  to={`/academic/exams/${exam.id}/edit`}
                  className="text-xs font-semibold text-fg-muted hover:text-fg transition"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}