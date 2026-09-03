import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  Clock,
  Archive,
  Calendar,
  Edit3,
  Trash2,
  AlertCircle,
  Eye,
  GraduationCap,
  Layers,
  Users,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  academicYearService,
  type AcademicYearRecord,
  type CreateAcademicYearPayload,
  type UpdateAcademicYearPayload,
} from '@/services/academicYearService'

export default function AcademicYears() {
  const { showToast } = useToast()
  const [years, setYears] = useState<AcademicYearRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | 'Active' | 'Upcoming' | 'Archived'>('All')

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalData, setViewModalData] = useState<AcademicYearRecord | null>(null)
  const [editModalData, setEditModalData] = useState<AcademicYearRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AcademicYearRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Forms
  const [formData, setFormData] = useState<CreateAcademicYearPayload>({
    name: '',
    startDate: '',
    endDate: '',
    termsCount: 3,
    description: '',
  })

  const [editForm, setEditForm] = useState<UpdateAcademicYearPayload>({
    name: '',
    startDate: '',
    endDate: '',
    termsCount: 3,
    status: 'Upcoming',
    description: '',
  })

  const loadYears = async () => {
    try {
      setLoading(true)
      const data = await academicYearService.list()
      setYears(data)
    } catch (err: any) {
      showToast(err?.message || 'Failed to load academic years', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadYears()
  }, [])

  // UC-ACADEMIC-01: Set Active
  const handleSetActive = async (id: string, name: string) => {
    try {
      await academicYearService.setActive(id)
      await loadYears()
      showToast(`"${name}" is now the active academic year`, 'success')
    } catch (err: any) {
      showToast(err?.message || 'Failed to set active academic year', 'error')
    }
  }

  // UC-ACADEMIC-03: Create
  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      showToast('Please fill in session name, start date, and end date', 'error')
      return
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      showToast('End date must be strictly after the start date', 'error')
      return
    }

    try {
      setSubmitting(true)
      await academicYearService.create(formData)
      showToast(`Academic year "${formData.name}" created successfully`, 'success')
      setCreateModalOpen(false)
      setFormData({ name: '', startDate: '', endDate: '', termsCount: 3, description: '' })
      await loadYears()
    } catch (err: any) {
      showToast(err?.message || 'Failed to create academic year', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-ACADEMIC-04: Edit
  const openEditModal = (year: AcademicYearRecord) => {
    setEditModalData(year)
    setEditForm({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
      termsCount: year.termsCount,
      status: year.status,
      description: year.description || '',
    })
  }

  const handleUpdateYear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editModalData) return
    if (!editForm.name?.trim() || !editForm.startDate || !editForm.endDate) {
      showToast('Please fill in required fields', 'error')
      return
    }

    if (new Date(editForm.endDate) <= new Date(editForm.startDate)) {
      showToast('End date must be strictly after start date', 'error')
      return
    }

    try {
      setSubmitting(true)
      await academicYearService.update(editModalData.id, editForm)
      showToast(`Academic year "${editForm.name}" updated successfully`, 'success')
      setEditModalData(null)
      await loadYears()
    } catch (err: any) {
      showToast(err?.message || 'Failed to update academic year', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-ACADEMIC-05: Delete
  const handleDeleteYear = async () => {
    if (!deleteTarget) return
    try {
      setSubmitting(true)
      await academicYearService.delete(deleteTarget.id)
      showToast(`Academic year "${deleteTarget.name}" deleted successfully`, 'success')
      setDeleteTarget(null)
      await loadYears()
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete academic year', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredYears = years.filter((y) => {
    if (filter === 'All') return true
    return y.status === filter
  })

  return (
    <div id="academic-years-page" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeading
          title="Academic Years"
          description="Manage historical, active, and upcoming school academic sessions and term structures."
        />
        <button
          id="btn-create-academic-year"
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Academic Year</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-200 dark:border-surface-700 pb-3">
        {(['All', 'Active', 'Upcoming', 'Archived'] as const).map((tab) => (
          <button
            key={tab}
            id={`filter-tab-${tab.toLowerCase()}`}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              filter === tab
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-800'
                : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            {tab}
          </button>
        ))}
        <span className="ml-auto text-xs text-surface-400">
          Showing {filteredYears.length} session{filteredYears.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* UC-ACADEMIC-01: List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-surface-400">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-xs font-medium">Loading academic sessions...</p>
        </div>
      ) : filteredYears.length === 0 ? (
        <div className="py-16 text-center bg-surface-50 dark:bg-surface-900/40 rounded-2xl border border-dashed border-surface-200 dark:border-surface-800 p-8">
          <CalendarRange className="w-10 h-10 mx-auto text-surface-400 mb-3" />
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">No Academic Years Found</h3>
          <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
            No academic sessions match the selected filter. Create a new year to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredYears.map((year) => (
            <div
              key={year.id}
              id={`academic-year-card-${year.id}`}
              className={`relative bg-surface-0 dark:bg-surface-800 border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between ${
                year.isCurrent
                  ? 'border-brand-500 ring-1 ring-brand-500/30 dark:ring-brand-500/20'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
              }`}
            >
              <div>
                {/* Status & Current Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      year.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                        : year.status === 'Upcoming'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40'
                        : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400 border border-surface-200 dark:border-surface-600'
                    }`}
                  >
                    {year.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {year.status === 'Upcoming' && <Clock className="w-3.5 h-3.5" />}
                    {year.status === 'Archived' && <Archive className="w-3.5 h-3.5" />}
                    {year.status}
                  </span>

                  {year.isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                      <Sparkles className="w-3 h-3" />
                      Active Session
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 tracking-tight">
                  {year.name}
                </h3>

                {year.description && (
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">
                    {year.description}
                  </p>
                )}

                {/* Dates */}
                <div className="mt-4 p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl space-y-1.5 text-xs text-surface-600 dark:text-surface-400 border border-surface-100 dark:border-surface-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Calendar className="w-3.5 h-3.5" /> Start Date:
                    </span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">{year.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Calendar className="w-3.5 h-3.5" /> End Date:
                    </span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">{year.endDate}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-surface-100 dark:border-surface-700/60 text-center">
                  <div className="p-2 rounded-lg bg-surface-50/50 dark:bg-surface-800/40">
                    <div className="flex items-center justify-center gap-1 text-surface-400 text-[11px]">
                      <Layers className="w-3 h-3" /> Terms
                    </div>
                    <p className="text-sm font-bold text-surface-800 dark:text-surface-200 mt-0.5">{year.termsCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-50/50 dark:bg-surface-800/40">
                    <div className="flex items-center justify-center gap-1 text-surface-400 text-[11px]">
                      <GraduationCap className="w-3 h-3" /> Classes
                    </div>
                    <p className="text-sm font-bold text-surface-800 dark:text-surface-200 mt-0.5">{year.classesCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-50/50 dark:bg-surface-800/40">
                    <div className="flex items-center justify-center gap-1 text-surface-400 text-[11px]">
                      <Users className="w-3 h-3" /> Students
                    </div>
                    <p className="text-sm font-bold text-surface-800 dark:text-surface-200 mt-0.5">{year.studentsCount}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Split CRUD operations */}
              <div className="mt-5 pt-3 border-t border-surface-100 dark:border-surface-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* UC-ACADEMIC-02: View Details */}
                  <button
                    id={`btn-view-year-${year.id}`}
                    onClick={() => setViewModalData(year)}
                    title="View Details"
                    className="p-2 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* UC-ACADEMIC-04: Edit */}
                  <button
                    id={`btn-edit-year-${year.id}`}
                    onClick={() => openEditModal(year)}
                    title="Edit Academic Year"
                    className="p-2 rounded-lg text-surface-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* UC-ACADEMIC-05: Delete */}
                  <button
                    id={`btn-delete-year-${year.id}`}
                    onClick={() => setDeleteTarget(year)}
                    title="Delete Academic Year"
                    disabled={year.isCurrent}
                    className={`p-2 rounded-lg transition-colors ${
                      year.isCurrent
                        ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed'
                        : 'text-surface-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {!year.isCurrent && (
                  <button
                    id={`btn-set-active-${year.id}`}
                    onClick={() => handleSetActive(year.id, year.name)}
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

      {/* UC-ACADEMIC-02: View Details Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-academic-year-details"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <CalendarRange className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Academic Session Details</h3>
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
                  <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100">{viewModalData.name}</h4>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {viewModalData.description || 'Standard high school curriculum operating calendar.'}
                  </p>
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

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 text-xs">
                <div>
                  <span className="text-surface-400">Session Start:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.startDate}</p>
                </div>
                <div>
                  <span className="text-surface-400">Session End:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.endDate}</p>
                </div>
                <div>
                  <span className="text-surface-400">Curriculum Terms:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.termsCount} terms configured</p>
                </div>
                <div>
                  <span className="text-surface-400">Current Active:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">
                    {viewModalData.isCurrent ? 'Yes (Primary Default)' : 'No'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800">
                  <span className="text-surface-400">Enrolled Classes</span>
                  <p className="text-lg font-bold text-surface-900 dark:text-surface-100 mt-0.5">
                    {viewModalData.classesCount} Classes
                  </p>
                </div>
                <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800">
                  <span className="text-surface-400">Enrolled Students</span>
                  <p className="text-lg font-bold text-surface-900 dark:text-surface-100 mt-0.5">
                    {viewModalData.studentsCount} Students
                  </p>
                </div>
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

      {/* UC-ACADEMIC-03: Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-create-academic-year"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Create Academic Year</h3>
                  <p className="text-xs text-surface-500">Configure new operational academic calendar</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateYear} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Academic Year Name *
                </label>
                <input
                  id="input-create-year-name"
                  type="text"
                  placeholder="e.g. 2026 - 2027"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    id="input-create-year-start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    End Date *
                  </label>
                  <input
                    id="input-create-year-end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Number of Terms / Semesters
                </label>
                <select
                  id="select-create-year-terms-count"
                  value={formData.termsCount}
                  onChange={(e) => setFormData({ ...formData, termsCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value={2}>2 Semesters</option>
                  <option value={3}>3 Trimesters</option>
                  <option value={4}>4 Quarters</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Description
                </label>
                <textarea
                  id="input-create-year-description"
                  rows={2}
                  placeholder="Optional notes or calendar guidelines..."
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
                  id="btn-submit-create-year"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Session</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UC-ACADEMIC-04: Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-edit-academic-year"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Edit Academic Year</h3>
                  <p className="text-xs text-surface-500">Update calendar metadata and status</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalData(null)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateYear} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Academic Year Name *
                </label>
                <input
                  id="input-edit-year-name"
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
                    id="input-edit-year-start-date"
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
                    id="input-edit-year-end-date"
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
                    Terms Count
                  </label>
                  <select
                    id="select-edit-year-terms-count"
                    value={editForm.termsCount}
                    onChange={(e) => setEditForm({ ...editForm, termsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value={2}>2 Semesters</option>
                    <option value={3}>3 Trimesters</option>
                    <option value={4}>4 Quarters</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Status
                  </label>
                  <select
                    id="select-edit-year-status"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Description
                </label>
                <textarea
                  id="input-edit-year-description"
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
                  id="btn-submit-edit-year"
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

      {/* UC-ACADEMIC-05: Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-delete-academic-year"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
              Delete Academic Year?
            </h3>
            <p className="text-xs text-surface-500 mt-2">
              Are you sure you want to delete session <strong className="text-surface-800 dark:text-surface-200">"{deleteTarget.name}"</strong>?
              This operation cannot be undone. Active sessions or years with dependent classes cannot be deleted.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-year"
                onClick={handleDeleteYear}
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
