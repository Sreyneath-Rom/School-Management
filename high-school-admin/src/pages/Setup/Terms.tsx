// src/pages/Setup/Terms.tsx
import { useState, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Edit3,
  Trash2,
  FileText,
  Award,
  AlertTriangle,
  Eye,
  X,
  ShieldCheck,
  Layers,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'

export interface TermItem {
  id: string
  name: string
  academicYear: string
  startDate: string
  endDate: string
  gradingDeadline: string
  status: 'Active' | 'Completed' | 'Upcoming'
  examCount: number
  weightPercentage: number
  description?: string
}

const INITIAL_TERMS: TermItem[] = [
  {
    id: 'term-1',
    name: 'Term 1 (Fall Semester)',
    academicYear: '2025 - 2026',
    startDate: '2025-08-15',
    endDate: '2025-11-20',
    gradingDeadline: '2025-11-28',
    status: 'Completed',
    examCount: 4,
    weightPercentage: 30,
    description: 'First formal evaluation period encompassing midterms and initial assessments.',
  },
  {
    id: 'term-2',
    name: 'Term 2 (Winter Trimester)',
    academicYear: '2025 - 2026',
    startDate: '2025-12-01',
    endDate: '2026-03-15',
    gradingDeadline: '2026-03-25',
    status: 'Active',
    examCount: 6,
    weightPercentage: 35,
    description: 'Current instructional cycle with ongoing coursework and mid-year standard examinations.',
  },
  {
    id: 'term-3',
    name: 'Term 3 (Spring Trimester)',
    academicYear: '2025 - 2026',
    startDate: '2026-03-20',
    endDate: '2026-06-20',
    gradingDeadline: '2026-06-28',
    status: 'Upcoming',
    examCount: 5,
    weightPercentage: 35,
    description: 'Final academic trimester culminating in AP testing and comprehensive final examinations.',
  },
]

export default function Terms() {
  const { showToast } = useToast()
  const [selectedYear, setSelectedYear] = useState('2025 - 2026')
  const [terms, setTerms] = useState<TermItem[]>(INITIAL_TERMS)

  // Modals state
  const [detailTerm, setDetailTerm] = useState<TermItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<TermItem | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<TermItem | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    gradingDeadline: '',
    weightPercentage: 35,
    status: 'Upcoming' as 'Active' | 'Completed' | 'Upcoming',
    description: '',
  })

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return terms.filter((t) => t.academicYear === selectedYear)
  }, [terms, selectedYear])

  // Stats calculation
  const stats = useMemo(() => {
    const total = filteredTerms.length
    const active = filteredTerms.find((t) => t.status === 'Active')?.name || 'None'
    const totalWeight = filteredTerms.reduce((sum, t) => sum + t.weightPercentage, 0)
    const totalExams = filteredTerms.reduce((sum, t) => sum + t.examCount, 0)
    return { total, active, totalWeight, totalExams }
  }, [filteredTerms])

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      gradingDeadline: '',
      weightPercentage: 35,
      status: 'Upcoming',
      description: '',
    })
    setEditingTerm(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setModalOpen(true)
  }

  const handleOpenEdit = (t: TermItem) => {
    setEditingTerm(t)
    setFormData({
      name: t.name,
      startDate: t.startDate,
      endDate: t.endDate,
      gradingDeadline: t.gradingDeadline,
      weightPercentage: t.weightPercentage,
      status: t.status,
      description: t.description || '',
    })
    setModalOpen(true)
  }

  const handleSetActive = (id: string) => {
    setTerms((prev) =>
      prev.map((t) => ({
        ...t,
        status: t.id === id ? 'Active' : t.status === 'Active' ? 'Completed' : t.status,
      }))
    )
    showToast('Active term cycle updated successfully', 'success')
  }

  // UC-TERM-03 & 04 Save Handler
  const handleSaveTerm = (e: React.FormEvent) => {
    e.preventDefault()

    // 400 Bad Request prevention
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      showToast('Please fill in all mandatory fields: Term Name, Start Date, and End Date.', 'error')
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      showToast('Start date must precede the end date.', 'error')
      return
    }

    if (editingTerm) {
      // UC-TERM-04: Edit
      const updated: TermItem = {
        ...editingTerm,
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        gradingDeadline: formData.gradingDeadline || formData.endDate,
        weightPercentage: Number(formData.weightPercentage) || 30,
        status: formData.status,
        description: formData.description,
      }
      setTerms((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      if (detailTerm?.id === updated.id) setDetailTerm(updated)
      showToast(`Term "${updated.name}" updated successfully.`, 'success')
    } else {
      // UC-TERM-03: Create
      const newTerm: TermItem = {
        id: `term-${Date.now()}`,
        name: formData.name.trim(),
        academicYear: selectedYear,
        startDate: formData.startDate,
        endDate: formData.endDate,
        gradingDeadline: formData.gradingDeadline || formData.endDate,
        status: formData.status,
        examCount: 0,
        weightPercentage: Number(formData.weightPercentage) || 30,
        description: formData.description,
      }
      setTerms((prev) => [...prev, newTerm])
      showToast(`Term "${newTerm.name}" created successfully.`, 'success')
    }

    setModalOpen(false)
    resetForm()
  }

  // UC-TERM-05: Delete with 409 Conflict check
  const handleDelete = () => {
    if (!deleteCandidate) return

    // Precondition check: Cannot delete active term
    if (deleteCandidate.status === 'Active') {
      showToast('Conflict (409): Cannot delete the currently active term cycle.', 'error')
      setDeleteCandidate(null)
      return
    }

    // Precondition check: Cannot delete term with recorded exams
    if (deleteCandidate.examCount > 0) {
      showToast(
        `Conflict (409): Cannot delete "${deleteCandidate.name}" because it contains ${deleteCandidate.examCount} registered exams.`,
        'error'
      )
      setDeleteCandidate(null)
      return
    }

    setTerms((prev) => prev.filter((t) => t.id !== deleteCandidate.id))
    if (detailTerm?.id === deleteCandidate.id) setDetailTerm(null)
    showToast(`Term "${deleteCandidate.name}" deleted.`, 'success')
    setDeleteCandidate(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Split CRUD Use Case Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageHeading
            title="Terms & Grading Cycles"
            subtitle="Define academic evaluation periods, grade submission deadlines, and GPA weight allocations."
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40">
              <ShieldCheck size={12} /> Standard: Split CRUD Use Cases
            </span>
            <span className="text-xs text-stone-500 font-mono">
              [UC-TERM-01 to 05] • RBAC: terms.view | create | edit | delete
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="2025 - 2026">2025 - 2026 (Current)</option>
            <option value="2026 - 2027">2026 - 2027 (Upcoming)</option>
            <option value="2024 - 2025">2024 - 2025 (Archived)</option>
          </select>

          <button
            id="btn-add-term"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs font-medium text-stone-500">Configured Terms</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900 dark:text-white truncate max-w-[150px]">
              {stats.active}
            </div>
            <div className="text-xs font-medium text-stone-500">Active Term</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Award size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.totalWeight}%
            </div>
            <div className="text-xs font-medium text-stone-500">Aggregate Weight</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <FileText size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.totalExams}
            </div>
            <div className="text-xs font-medium text-stone-500">Examinations</div>
          </div>
        </div>
      </div>

      {/* Grid of Terms (UC-TERM-01) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className={`rounded-2xl p-5 glass-sm border transition flex flex-col justify-between hover:shadow-md ${
              term.status === 'Active'
                ? 'border-brand-500/50 dark:border-brand-400/30 ring-2 ring-brand-500/10'
                : 'border-stone-200/70 dark:border-white/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">
                    {term.name}
                  </h3>
                  <div className="text-xs text-stone-400 flex items-center gap-1.5 font-medium mt-0.5">
                    <Calendar size={12} />
                    <span>
                      {term.startDate} to {term.endDate}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    term.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : term.status === 'Completed'
                      ? 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border border-stone-500/30'
                      : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {term.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 my-3 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400">Grading Deadline:</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {term.gradingDeadline}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400">Grade Weight Contribution:</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    {term.weightPercentage}% of Final GPA
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400">Registered Exams:</span>
                  <span className="font-semibold">{term.examCount} assessments</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2">
              {term.status !== 'Active' ? (
                <button
                  type="button"
                  onClick={() => handleSetActive(term.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-500 hover:text-white text-stone-700 dark:text-stone-200 transition cursor-pointer"
                >
                  Set as Active
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Current Term
                </span>
              )}

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDetailTerm(term)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10 transition"
                  title="View Term Details (UC-TERM-02)"
                >
                  <Eye size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(term)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10 transition"
                  title="Edit Term (UC-TERM-04)"
                >
                  <Edit3 size={15} />
                </button>
                {term.status !== 'Active' && (
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(term)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete Term (UC-TERM-05)"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MODAL: VIEW TERM DETAILS (UC-TERM-02) */}
      {/* ========================================================= */}
      {detailTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Clock size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {detailTerm.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Academic Year: {detailTerm.academicYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailTerm(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Use Case & Permission Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-700 dark:text-brand-300">
                Use Case: UC-TERM-02 (View Term Details)
              </span>
              <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400">
                Permission: terms.view
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">Term Schedule</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {detailTerm.startDate} – {detailTerm.endDate}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">Marks Due Date</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 block">
                  {detailTerm.gradingDeadline}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">GPA Weighting</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 block">
                  {detailTerm.weightPercentage}% Total Weight
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">Assigned Assessments</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {detailTerm.examCount} Formal Exams
                </span>
              </div>
            </div>

            {detailTerm.description && (
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Scope & Pedagogical Focus
                </span>
                <p className="text-stone-600 dark:text-stone-400">
                  {detailTerm.description}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200/60 dark:border-white/10">
              <button
                onClick={() => {
                  const t = detailTerm
                  setDetailTerm(null)
                  handleOpenEdit(t)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
              >
                Edit Term
              </button>
              <button
                onClick={() => setDetailTerm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT TERM (UC-TERM-03 & 04) */}
      {/* ========================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {editingTerm ? 'Edit Term Cycle' : 'Add New Term Cycle'}
                </h3>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-mono">
                  {editingTerm
                    ? 'UC-TERM-04 (Edit) • terms.edit'
                    : 'UC-TERM-03 (Create) • terms.create'}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTerm} className="space-y-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Term Name / Cycle *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Term 4 (Summer Intensive)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Grading Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.gradingDeadline}
                    onChange={(e) => setFormData({ ...formData, gradingDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    GPA Weight (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.weightPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, weightPercentage: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Status State
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition cursor-pointer"
                >
                  {editingTerm ? 'Save Changes' : 'Create Term'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION (UC-TERM-05) */}
      {/* ========================================================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Delete Term Cycle
                </h3>
                <span className="text-xs text-rose-600 font-mono">
                  UC-TERM-05 • terms.delete
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to delete term cycle{' '}
              <span className="font-bold text-stone-900 dark:text-white">
                "{deleteCandidate.name}"
              </span>
              ?
            </p>

            {deleteCandidate.examCount > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold block mb-0.5">Precondition Warning (409 Conflict):</span>
                This term cycle has {deleteCandidate.examCount} registered examinations. Removing it will invalidate term GPA aggregates.
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
