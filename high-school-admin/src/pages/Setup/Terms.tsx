import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Edit3,
  Trash2,
  Eye,
  AlertTriangle,
  Award,
  FileText,
  X,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  termService,
  type TermRecord,
  type CreateTermPayload,
  type UpdateTermPayload,
} from '@/services/termService'
import { academicYearService, type AcademicYearRecord } from '@/services/academicYearService'

export default function Terms() {
  const { showToast } = useToast()
  const [academicYears, setAcademicYears] = useState<AcademicYearRecord[]>([])
  const [selectedYear, setSelectedYear] = useState('2025 - 2026')
  const [terms, setTerms] = useState<TermRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalData, setViewModalData] = useState<TermRecord | null>(null)
  const [editModalData, setEditModalData] = useState<TermRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TermRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Forms
  const [formData, setFormData] = useState<CreateTermPayload>({
    name: '',
    academicYear: '2025 - 2026',
    startDate: '',
    endDate: '',
    gradingDeadline: '',
    weightPercentage: 35,
    description: '',
  })

  const [editForm, setEditForm] = useState<UpdateTermPayload>({
    name: '',
    startDate: '',
    endDate: '',
    gradingDeadline: '',
    weightPercentage: 35,
    status: 'Upcoming',
    examCount: 0,
    description: '',
  })

  // Load academic years and terms
  const loadInitialData = async () => {
    try {
      setLoading(true)
      const yearsResponse = await academicYearService.list()
      const years = Array.isArray(yearsResponse) ? yearsResponse : []
      setAcademicYears(years)
      const currentYear = years.find((y) => y.isCurrent)?.name || years[0]?.name || '2025 - 2026'
      setSelectedYear(currentYear)
      setFormData((prev) => ({ ...prev, academicYear: currentYear }))

      const termResponse = await termService.list(currentYear)
      setTerms(Array.isArray(termResponse) ? termResponse : [])
    } catch (err: any) {
      showToast(err?.message || 'Failed to load term configurations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadTermsForYear = async (year: string) => {
    try {
      setLoading(true)
      const data = await termService.list(year)
      setTerms(Array.isArray(data) ? data : [])
    } catch (err: any) {
      showToast(err?.message || 'Failed to fetch terms', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setFormData((prev) => ({ ...prev, academicYear: year }))
    loadTermsForYear(year)
  }

  // UC-TERM-01: Set Active
  const handleSetActive = async (id: string, name: string) => {
    try {
      await termService.setActive(id)
      await loadTermsForYear(selectedYear)
      showToast(`Term "${name}" is now the active evaluation cycle`, 'success')
    } catch (err: any) {
      showToast(err?.message || 'Failed to set active term', 'error')
    }
  }

  // UC-TERM-03: Create
  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.startDate || !formData.endDate || !formData.gradingDeadline) {
      showToast('Please fill in term name, dates, and grading deadline', 'error')
      return
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      showToast('Term end date must be strictly after the start date', 'error')
      return
    }

    if (new Date(formData.gradingDeadline) < new Date(formData.endDate)) {
      showToast('Grading deadline must be on or after the term end date', 'error')
      return
    }

    try {
      setSubmitting(true)
      await termService.create({
        ...formData,
        academicYear: selectedYear,
        weightPercentage: Number(formData.weightPercentage) || 30,
      })
      showToast(`Term "${formData.name}" created successfully`, 'success')
      setCreateModalOpen(false)
      setFormData({
        name: '',
        academicYear: selectedYear,
        startDate: '',
        endDate: '',
        gradingDeadline: '',
        weightPercentage: 35,
        description: '',
      })
      await loadTermsForYear(selectedYear)
    } catch (err: any) {
      showToast(err?.message || 'Failed to create term', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-TERM-04: Edit
  const openEditModal = (term: TermRecord) => {
    setEditModalData(term)
    setEditForm({
      name: term.name,
      academicYear: term.academicYear,
      startDate: term.startDate,
      endDate: term.endDate,
      gradingDeadline: term.gradingDeadline,
      weightPercentage: term.weightPercentage,
      status: term.status,
      examCount: term.examCount,
      description: term.description || '',
    })
  }

  const handleUpdateTerm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editModalData) return

    if (!editForm.name?.trim() || !editForm.startDate || !editForm.endDate) {
      showToast('Please fill in required term fields', 'error')
      return
    }

    if (new Date(editForm.endDate!) <= new Date(editForm.startDate!)) {
      showToast('End date must be strictly after start date', 'error')
      return
    }

    try {
      setSubmitting(true)
      await termService.update(editModalData.id, editForm)
      showToast(`Term "${editForm.name}" updated successfully`, 'success')
      setEditModalData(null)
      await loadTermsForYear(selectedYear)
    } catch (err: any) {
      showToast(err?.message || 'Failed to update term', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-TERM-05: Delete
  const handleDeleteTerm = async () => {
    if (!deleteTarget) return
    try {
      setSubmitting(true)
      await termService.delete(deleteTarget.id)
      showToast(`Term "${deleteTarget.name}" deleted successfully`, 'success')
      setDeleteTarget(null)
      await loadTermsForYear(selectedYear)
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete term', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const totalWeight = terms.reduce((acc, t) => acc + (t.weightPercentage || 0), 0)

  return (
    <div id="terms-page" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Terms & Semesters"
          description="Configure grading cycles, examination windows, and term evaluation weights."
        />
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <select
            id="select-academic-year-filter"
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-semibold text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.name}>
                Year: {ay.name} {ay.isCurrent ? '(Active)' : ''}
              </option>
            ))}
            {academicYears.length === 0 && (
              <option value="2025 - 2026">Year: 2025 - 2026</option>
            )}
          </select>

          <button
            id="btn-create-term"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Term</span>
          </button>
        </div>
      </div>

      {/* Cumulative Weight Indicator */}
      <div className="p-4 bg-surface-50 dark:bg-surface-900/40 border border-surface-200 dark:border-surface-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-900 dark:text-surface-100">Cumulative Annual Weight</h4>
            <p className="text-[11px] text-surface-500">
              Total grade point contribution for {selectedYear}: <span className="font-semibold text-surface-700 dark:text-surface-300">{totalWeight}%</span> (Target: 100%)
            </p>
          </div>
        </div>

        <div className="w-full md:w-64 bg-surface-200 dark:bg-surface-700 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              totalWeight === 100
                ? 'bg-emerald-500'
                : totalWeight > 100
                ? 'bg-rose-500'
                : 'bg-brand-500'
            }`}
            style={{ width: `${Math.min(totalWeight, 100)}%` }}
          />
        </div>
      </div>

      {/* UC-TERM-01: Term Cards List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-surface-400">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-xs font-medium">Loading evaluation terms...</p>
        </div>
      ) : terms.length === 0 ? (
        <div className="py-16 text-center bg-surface-50 dark:bg-surface-900/40 rounded-2xl border border-dashed border-surface-200 dark:border-surface-800 p-8">
          <Clock className="w-10 h-10 mx-auto text-surface-400 mb-3" />
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">No Terms Configured</h3>
          <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
            No terms found for {selectedYear}. Create terms to begin scheduling assessments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {terms.map((term) => (
            <div
              key={term.id}
              id={`term-card-${term.id}`}
              className={`relative bg-surface-0 dark:bg-surface-800 border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between ${
                term.status === 'Active'
                  ? 'border-brand-500 ring-1 ring-brand-500/30'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
              }`}
            >
              <div>
                {/* Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      term.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                        : term.status === 'Completed'
                        ? 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400 border border-surface-200'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60'
                    }`}
                  >
                    {term.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {term.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {term.status === 'Upcoming' && <Clock className="w-3.5 h-3.5" />}
                    {term.status}
                  </span>

                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-md border border-brand-200/60 dark:border-brand-800/60">
                    {term.weightPercentage}% Weight
                  </span>
                </div>

                <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 tracking-tight">
                  {term.name}
                </h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  Academic Session: {term.academicYear}
                </p>

                {term.description && (
                  <p className="text-xs text-surface-500 mt-2 line-clamp-2">
                    {term.description}
                  </p>
                )}

                {/* Dates Box */}
                <div className="mt-4 p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl space-y-1.5 text-xs text-surface-600 dark:text-surface-400 border border-surface-100 dark:border-surface-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Calendar className="w-3.5 h-3.5" /> Start:
                    </span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">{term.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Calendar className="w-3.5 h-3.5" /> End:
                    </span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">{term.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-surface-200/60 dark:border-surface-700/60">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Grade Deadline:
                    </span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">{term.gradingDeadline}</span>
                  </div>
                </div>

                {/* Exam Metric */}
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-surface-50/70 dark:bg-surface-800/40 text-xs">
                  <span className="flex items-center gap-1.5 text-surface-500">
                    <FileText className="w-3.5 h-3.5" /> Scheduled Assessments
                  </span>
                  <span className="font-bold text-surface-900 dark:text-surface-100">{term.examCount || 0} Exams</span>
                </div>
              </div>

              {/* Action Buttons: Split CRUD operations */}
              <div className="mt-5 pt-3 border-t border-surface-100 dark:border-surface-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* UC-TERM-02: View Details */}
                  <button
                    id={`btn-view-term-${term.id}`}
                    onClick={() => setViewModalData(term)}
                    title="View Details"
                    className="p-2 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* UC-TERM-04: Edit */}
                  <button
                    id={`btn-edit-term-${term.id}`}
                    onClick={() => openEditModal(term)}
                    title="Edit Term"
                    className="p-2 rounded-lg text-surface-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* UC-TERM-05: Delete */}
                  <button
                    id={`btn-delete-term-${term.id}`}
                    onClick={() => setDeleteTarget(term)}
                    title="Delete Term"
                    disabled={term.status === 'Active'}
                    className={`p-2 rounded-lg transition-colors ${
                      term.status === 'Active'
                        ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed'
                        : 'text-surface-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {term.status !== 'Active' && (
                  <button
                    id={`btn-set-active-term-${term.id}`}
                    onClick={() => handleSetActive(term.id, term.name)}
                    className="text-xs font-semibold px-3 py-1.5 bg-surface-100 hover:bg-brand-600 hover:text-white text-surface-700 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-brand-600 dark:hover:text-white rounded-lg transition-all"
                  >
                    Set Active
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UC-TERM-02: View Details Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-term-details"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Term Assessment Details</h3>
                  <p className="text-xs text-surface-500">Identifier: {viewModalData.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewModalData(null)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-surface-900 dark:text-surface-100">{viewModalData.name}</h4>
                  <p className="text-xs text-surface-500 mt-0.5">Session: {viewModalData.academicYear}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    viewModalData.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : viewModalData.status === 'Upcoming'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                  }`}
                >
                  {viewModalData.status}
                </span>
              </div>

              {viewModalData.description && (
                <p className="text-xs text-surface-600 dark:text-surface-300 p-3 bg-surface-50 dark:bg-surface-900/40 rounded-xl border border-surface-100 dark:border-surface-800">
                  {viewModalData.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 text-xs">
                <div>
                  <span className="text-surface-400">Term Start Date:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.startDate}</p>
                </div>
                <div>
                  <span className="text-surface-400">Term End Date:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.endDate}</p>
                </div>
                <div>
                  <span className="text-surface-400">Grading Lock Deadline:</span>
                  <p className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">{viewModalData.gradingDeadline}</p>
                </div>
                <div>
                  <span className="text-surface-400">GPA Contribution Weight:</span>
                  <p className="font-bold text-brand-600 dark:text-brand-400 mt-0.5">{viewModalData.weightPercentage}% of final mark</p>
                </div>
              </div>

              <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 flex items-center justify-between text-xs">
                <span className="text-surface-500">Scheduled Exams / Milestones:</span>
                <span className="font-bold text-surface-900 dark:text-surface-100">{viewModalData.examCount} registered</span>
              </div>
            </div>

            <div className="p-4 bg-surface-50/50 dark:bg-surface-900/30 border-t border-surface-200 dark:border-surface-700 flex justify-end">
              <button
                onClick={() => setViewModalData(null)}
                className="px-4 py-2 text-xs font-semibold bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200 rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UC-TERM-03: Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-create-term"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Create Academic Term</h3>
                  <p className="text-xs text-surface-500">Add evaluation cycle for {selectedYear}</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTerm} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Term Name *
                </label>
                <input
                  id="input-create-term-name"
                  type="text"
                  placeholder="e.g. Term 1 (Fall Semester)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    id="input-create-term-start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    End Date *
                  </label>
                  <input
                    id="input-create-term-end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Grading Deadline *
                  </label>
                  <input
                    id="input-create-term-grading-deadline"
                    type="date"
                    value={formData.gradingDeadline}
                    onChange={(e) => setFormData({ ...formData, gradingDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Weight Contribution (%)
                  </label>
                  <input
                    id="input-create-term-weight"
                    type="number"
                    min={1}
                    max={100}
                    value={formData.weightPercentage}
                    onChange={(e) => setFormData({ ...formData, weightPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Description
                </label>
                <textarea
                  id="input-create-term-description"
                  rows={2}
                  placeholder="Assessment guidelines, final marks breakdown..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="pt-3 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-create-term"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Term</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UC-TERM-04: Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-edit-term"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Edit Academic Term</h3>
                  <p className="text-xs text-surface-500">Update dates, status and evaluation weight</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalData(null)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTerm} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Term Name *
                </label>
                <input
                  id="input-edit-term-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    id="input-edit-term-start-date"
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    End Date *
                  </label>
                  <input
                    id="input-edit-term-end-date"
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Grading Deadline *
                  </label>
                  <input
                    id="input-edit-term-grading-deadline"
                    type="date"
                    value={editForm.gradingDeadline}
                    onChange={(e) => setEditForm({ ...editForm, gradingDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Weight (%)
                  </label>
                  <input
                    id="input-edit-term-weight"
                    type="number"
                    min={1}
                    max={100}
                    value={editForm.weightPercentage}
                    onChange={(e) => setEditForm({ ...editForm, weightPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Status
                  </label>
                  <select
                    id="select-edit-term-status"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Exam Count
                  </label>
                  <input
                    id="input-edit-term-exam-count"
                    type="number"
                    min={0}
                    value={editForm.examCount}
                    onChange={(e) => setEditForm({ ...editForm, examCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Description
                </label>
                <textarea
                  id="input-edit-term-description"
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="pt-3 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalData(null)}
                  className="px-4 py-2 font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-edit-term"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UC-TERM-05: Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-delete-term"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
              Delete Evaluation Term?
            </h3>
            <p className="text-xs text-surface-500 mt-2">
              Are you sure you want to delete <strong className="text-surface-800 dark:text-surface-200">"{deleteTarget.name}"</strong>?
              Active terms with pending student examinations or grades cannot be removed.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-term"
                onClick={handleDeleteTerm}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
