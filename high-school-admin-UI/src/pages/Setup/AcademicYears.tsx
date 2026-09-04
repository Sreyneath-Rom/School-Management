// src/pages/Setup/AcademicYears.tsx
import { useState, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Edit3,
  Trash2,
  AlertCircle,
  Eye,
  X,
  AlertTriangle,
  ShieldCheck,
  School,
  Users,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'

export interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'Active' | 'Upcoming' | 'Archived'
  termsCount: number
  classesCount: number
  studentsCount: number
  isCurrent: boolean
  description?: string
  createdAt?: string
}

const INITIAL_YEARS: AcademicYear[] = [
  {
    id: 'ay-1',
    name: '2025 - 2026',
    startDate: '2025-08-15',
    endDate: '2026-06-20',
    status: 'Active',
    termsCount: 3,
    classesCount: 48,
    studentsCount: 1284,
    isCurrent: true,
    description: 'Current standard secondary academic year covering fall, winter, and spring trimesters.',
    createdAt: '2025-06-01',
  },
  {
    id: 'ay-2',
    name: '2026 - 2027',
    startDate: '2026-08-20',
    endDate: '2027-06-25',
    status: 'Upcoming',
    termsCount: 3,
    classesCount: 50,
    studentsCount: 0,
    isCurrent: false,
    description: 'Upcoming scheduled academic cycle with planned expansion into STEM honors sections.',
    createdAt: '2026-01-15',
  },
  {
    id: 'ay-3',
    name: '2024 - 2025',
    startDate: '2024-08-18',
    endDate: '2025-06-18',
    status: 'Archived',
    termsCount: 3,
    classesCount: 46,
    studentsCount: 1210,
    isCurrent: false,
    description: 'Completed historical academic session. Archived for auditing and transcript generation.',
    createdAt: '2024-05-10',
  },
]

export default function AcademicYears() {
  const { showToast } = useToast()
  const [years, setYears] = useState<AcademicYear[]>(INITIAL_YEARS)

  // Modals
  const [detailYear, setDetailYear] = useState<AcademicYear | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<AcademicYear | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    termsCount: 3,
    status: 'Upcoming' as 'Active' | 'Upcoming' | 'Archived',
    description: '',
  })

  // Aggregate stats
  const stats = useMemo(() => {
    const total = years.length
    const current = years.find((y) => y.isCurrent)?.name || 'None'
    const totalClasses = years.reduce((s, y) => s + y.classesCount, 0)
    const totalStudents = years.reduce((s, y) => s + y.studentsCount, 0)
    return { total, current, totalClasses, totalStudents }
  }, [years])

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      termsCount: 3,
      status: 'Upcoming',
      description: '',
    })
    setEditingYear(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setModalOpen(true)
  }

  const handleOpenEdit = (y: AcademicYear) => {
    setEditingYear(y)
    setFormData({
      name: y.name,
      startDate: y.startDate,
      endDate: y.endDate,
      termsCount: y.termsCount,
      status: y.status,
      description: y.description || '',
    })
    setModalOpen(true)
  }

  const handleSetActive = (id: string) => {
    setYears((prev) =>
      prev.map((y) => ({
        ...y,
        isCurrent: y.id === id,
        status: y.id === id ? 'Active' : y.status === 'Active' ? 'Archived' : y.status,
      }))
    )
    showToast('Academic Year set to Active successfully', 'success')
  }

  // UC-ACADEMIC-03 & 04 Save Handler
  const handleSaveYear = (e: React.FormEvent) => {
    e.preventDefault()

    // 400 Bad Request prevention
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      showToast('Please fill in all mandatory fields: Session Name, Start Date, and End Date.', 'error')
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      showToast('Start date must be earlier than end date.', 'error')
      return
    }

    if (editingYear) {
      // UC-ACADEMIC-04: Edit
      const updated: AcademicYear = {
        ...editingYear,
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        termsCount: Number(formData.termsCount) || 3,
        status: formData.status,
        description: formData.description,
      }
      setYears((prev) => prev.map((y) => (y.id === updated.id ? updated : y)))
      if (detailYear?.id === updated.id) setDetailYear(updated)
      showToast(`Academic Year "${updated.name}" updated successfully.`, 'success')
    } else {
      // UC-ACADEMIC-03: Create
      const newYear: AcademicYear = {
        id: `ay-${Date.now()}`,
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        termsCount: Number(formData.termsCount) || 3,
        classesCount: 0,
        studentsCount: 0,
        isCurrent: false,
        description: formData.description,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setYears((prev) => [newYear, ...prev])
      showToast(`Academic Year "${newYear.name}" created successfully.`, 'success')
    }

    setModalOpen(false)
    resetForm()
  }

  // UC-ACADEMIC-05: Delete with 409 Conflict check
  const handleDelete = () => {
    if (!deleteCandidate) return

    // Precondition check: Cannot delete active current year
    if (deleteCandidate.isCurrent) {
      showToast('Conflict (409): Cannot delete the currently active Academic Year.', 'error')
      setDeleteCandidate(null)
      return
    }

    // Precondition check: Cannot delete year with active classes or students
    if (deleteCandidate.classesCount > 0 || deleteCandidate.studentsCount > 0) {
      showToast(
        `Conflict (409): Cannot delete "${deleteCandidate.name}" because it contains ${deleteCandidate.classesCount} classes and ${deleteCandidate.studentsCount} enrolled students.`,
        'error'
      )
      setDeleteCandidate(null)
      return
    }

    setYears((prev) => prev.filter((y) => y.id !== deleteCandidate.id))
    if (detailYear?.id === deleteCandidate.id) setDetailYear(null)
    showToast(`Academic Year "${deleteCandidate.name}" deleted.`, 'success')
    setDeleteCandidate(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Split CRUD Use Case Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageHeading
            title="Academic Years"
            subtitle="Configure school academic sessions, session timelines, and active term cycles."
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40">
              <ShieldCheck size={12} /> Standard: Split CRUD Use Cases
            </span>
            <span className="text-xs text-stone-500 font-mono">
              [UC-ACADEMIC-01 to 05] • RBAC: academicYears.view | create | edit | delete
            </span>
          </div>
        </div>

        <button
          id="btn-add-academic-year"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>New Academic Year</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <CalendarRange size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs font-medium text-stone-500">Academic Sessions</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white truncate max-w-[150px]">
              {stats.current}
            </div>
            <div className="text-xs font-medium text-stone-500">Current Session</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <School size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.totalClasses}
            </div>
            <div className="text-xs font-medium text-stone-500">Total Classes Held</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <Users size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.totalStudents}
            </div>
            <div className="text-xs font-medium text-stone-500">Enrolled Students</div>
          </div>
        </div>
      </div>

      {/* Grid of Academic Years (UC-ACADEMIC-01) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {years.map((year) => (
          <div
            key={year.id}
            className={`rounded-2xl p-5 glass-sm border transition flex flex-col justify-between hover:shadow-md ${
              year.isCurrent
                ? 'border-brand-500/50 dark:border-brand-400/30 ring-2 ring-brand-500/10'
                : 'border-stone-200/70 dark:border-white/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      year.isCurrent
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <CalendarRange size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                      {year.name}
                      {year.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                          CURRENT
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-stone-400 flex items-center gap-1.5 font-medium mt-0.5">
                      <Clock size={12} />
                      <span>
                        {year.startDate} to {year.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    year.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : year.status === 'Upcoming'
                      ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                      : 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border border-stone-500/30'
                  }`}
                >
                  {year.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-200/50 dark:border-white/10 my-3 text-center">
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-xs text-stone-400 font-medium">Terms</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {year.termsCount}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-xs text-stone-400 font-medium">Classes</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {year.classesCount}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-xs text-stone-400 font-medium">Students</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {year.studentsCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2">
              {!year.isCurrent ? (
                <button
                  type="button"
                  onClick={() => handleSetActive(year.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-500 hover:text-white text-stone-700 dark:text-stone-200 transition cursor-pointer"
                >
                  Set as Current
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Active Session
                </span>
              )}

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDetailYear(year)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10 transition"
                  title="View Session Details (UC-ACADEMIC-02)"
                >
                  <Eye size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(year)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10 transition"
                  title="Edit Academic Session (UC-ACADEMIC-04)"
                >
                  <Edit3 size={15} />
                </button>
                {!year.isCurrent && (
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(year)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete Academic Session (UC-ACADEMIC-05)"
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
      {/* MODAL: VIEW DETAILS (UC-ACADEMIC-02) */}
      {/* ========================================================= */}
      {detailYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <CalendarRange size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Academic Session {detailYear.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {detailYear.startDate} through {detailYear.endDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailYear(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Use Case & Permission Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-700 dark:text-brand-300">
                Use Case: UC-ACADEMIC-02 (View Academic Year Details)
              </span>
              <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400">
                Permission: academicYears.view
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">Status State</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {detailYear.status} {detailYear.isCurrent && '(CURRENT)'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">Term Divisions</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {detailYear.termsCount} Distinct Terms
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">Classes Configured</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {detailYear.classesCount} Class Cohorts
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400">Total Enrolled</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {detailYear.studentsCount} Active Students
                </span>
              </div>
            </div>

            {detailYear.description && (
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Session Description & Notes
                </span>
                <p className="text-stone-600 dark:text-stone-400">
                  {detailYear.description}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200/60 dark:border-white/10">
              <button
                onClick={() => {
                  const y = detailYear
                  setDetailYear(null)
                  handleOpenEdit(y)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
              >
                Edit Session
              </button>
              <button
                onClick={() => setDetailYear(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT YEAR (UC-ACADEMIC-03 & 04) */}
      {/* ========================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {editingYear ? 'Edit Academic Year' : 'Add New Academic Year'}
                </h3>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-mono">
                  {editingYear
                    ? 'UC-ACADEMIC-04 (Edit) • academicYears.edit'
                    : 'UC-ACADEMIC-03 (Create) • academicYears.create'}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveYear} className="space-y-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Session Name / Identifier *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2027 - 2028"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
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
                    Terms Structure
                  </label>
                  <select
                    value={formData.termsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, termsCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value={2}>2 Semesters</option>
                    <option value={3}>3 Trimesters</option>
                    <option value={4}>4 Quarters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Status Lifecycle
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
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description / Administrative Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g. Focus on curriculum modernization..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
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
                  {editingYear ? 'Save Changes' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION (UC-ACADEMIC-05) */}
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
                  Delete Academic Session
                </h3>
                <span className="text-xs text-rose-600 font-mono">
                  UC-ACADEMIC-05 • academicYears.delete
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete academic session{' '}
              <span className="font-bold text-stone-900 dark:text-white">
                "{deleteCandidate.name}"
              </span>
              ?
            </p>

            {(deleteCandidate.classesCount > 0 || deleteCandidate.studentsCount > 0) && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold block mb-0.5">Precondition Warning (409 Conflict):</span>
                This academic session contains {deleteCandidate.classesCount} active classes and {deleteCandidate.studentsCount} enrolled students. Deletion will be rejected by the server until emptied.
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
