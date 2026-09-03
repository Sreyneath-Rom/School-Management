import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  Loader2,
  AlertCircle,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  gradeLevelService,
  type GradeLevelRecord,
  type CreateGradeLevelPayload,
  type UpdateGradeLevelPayload,
} from '@/services/gradeLevelService'

export default function GradeLevels() {
  const { showToast } = useToast()
  const [grades, setGrades] = useState<GradeLevelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [divisionFilter, setDivisionFilter] = useState('All')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalData, setViewModalData] = useState<GradeLevelRecord | null>(null)
  const [editModalData, setEditModalData] = useState<GradeLevelRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GradeLevelRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Forms
  const [formData, setFormData] = useState<CreateGradeLevelPayload>({
    name: '',
    numericLevel: 9,
    division: 'High School',
    minAge: 14,
    maxAge: 15,
    requiredCredits: 20,
    description: '',
  })

  const [editForm, setEditForm] = useState<UpdateGradeLevelPayload>({
    name: '',
    numericLevel: 9,
    division: 'High School',
    minAge: 14,
    maxAge: 15,
    requiredCredits: 20,
    status: 'Active',
    description: '',
  })

  const loadGrades = async () => {
    try {
      setLoading(true)
      const data = await gradeLevelService.list()
      setGrades(data)
    } catch (err: any) {
      showToast(err?.message || 'Failed to load grade levels', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGrades()
  }, [])

  // UC-GRADE-03: Create
  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      showToast('Please specify grade level name', 'error')
      return
    }

    try {
      setSubmitting(true)
      await gradeLevelService.create(formData)
      showToast(`Grade level "${formData.name}" created successfully`, 'success')
      setCreateModalOpen(false)
      setFormData({
        name: '',
        numericLevel: 9,
        division: 'High School',
        minAge: 14,
        maxAge: 15,
        requiredCredits: 20,
        description: '',
      })
      await loadGrades()
    } catch (err: any) {
      showToast(err?.message || 'Failed to create grade level', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-GRADE-04: Edit
  const openEditModal = (grade: GradeLevelRecord) => {
    setEditModalData(grade)
    setEditForm({
      name: grade.name,
      numericLevel: grade.numericLevel,
      division: grade.division,
      minAge: grade.minAge,
      maxAge: grade.maxAge,
      requiredCredits: grade.requiredCredits,
      status: grade.status,
      description: grade.description || '',
    })
  }

  const handleUpdateGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editModalData) return
    if (!editForm.name?.trim()) {
      showToast('Please provide grade name', 'error')
      return
    }

    try {
      setSubmitting(true)
      await gradeLevelService.update(editModalData.id, editForm)
      showToast(`Grade level "${editForm.name}" updated successfully`, 'success')
      setEditModalData(null)
      await loadGrades()
    } catch (err: any) {
      showToast(err?.message || 'Failed to update grade level', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-GRADE-05: Delete
  const handleDeleteGrade = async () => {
    if (!deleteTarget) return
    try {
      setSubmitting(true)
      await gradeLevelService.delete(deleteTarget.id)
      showToast(`Grade level "${deleteTarget.name}" deleted successfully`, 'success')
      setDeleteTarget(null)
      await loadGrades()
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete grade level', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredGrades = grades.filter((g) => {
    if (divisionFilter === 'All') return true
    return g.division === divisionFilter
  })

  return (
    <div id="grade-levels-page" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Grade Levels & Divisions"
          description="Manage educational stage boundaries, numeric standards, graduation credit thresholds, and age criteria."
        />
        <button
          id="btn-create-grade-level"
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Grade Level</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-200 dark:border-surface-700 pb-3">
        {(['All', 'High School', 'Middle School'] as const).map((tab) => (
          <button
            key={tab}
            id={`filter-division-${tab.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setDivisionFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              divisionFilter === tab
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-800'
                : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* UC-GRADE-01: List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-surface-400">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-xs font-medium">Loading grade levels...</p>
        </div>
      ) : filteredGrades.length === 0 ? (
        <div className="py-16 text-center bg-surface-50 dark:bg-surface-900/40 rounded-2xl border border-dashed border-surface-200 dark:border-surface-800 p-8">
          <Layers className="w-10 h-10 mx-auto text-surface-400 mb-3" />
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">No Grade Levels</h3>
          <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
            Configure grade stages to group cohorts and class sections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredGrades.map((grade) => (
            <div
              key={grade.id}
              id={`grade-level-card-${grade.id}`}
              className="relative bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 flex items-center justify-center font-bold text-sm border border-brand-200/60 dark:border-brand-800/60">
                    {grade.numericLevel}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                    {grade.division}
                  </span>
                </div>

                <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 tracking-tight">
                  {grade.name}
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Ages {grade.minAge} – {grade.maxAge} yrs
                </p>

                {grade.description && (
                  <p className="text-xs text-surface-500 mt-2 line-clamp-2">
                    {grade.description}
                  </p>
                )}

                {/* Metrics */}
                <div className="mt-4 p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl space-y-1.5 text-xs text-surface-600 dark:text-surface-400 border border-surface-100 dark:border-surface-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <GraduationCap className="w-3.5 h-3.5" /> Classes:
                    </span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">{grade.classesCount} Sections</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Users className="w-3.5 h-3.5" /> Cohort Size:
                    </span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">{grade.studentsCount} Students</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-surface-200/50 dark:border-surface-700/50">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Required Credits:
                    </span>
                    <span className="font-bold text-surface-800 dark:text-surface-200">{grade.requiredCredits} Cr</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-surface-100 dark:border-surface-700 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* UC-GRADE-02: View Details */}
                  <button
                    id={`btn-view-grade-${grade.id}`}
                    onClick={() => setViewModalData(grade)}
                    title="View Details"
                    className="p-2 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* UC-GRADE-04: Edit */}
                  <button
                    id={`btn-edit-grade-${grade.id}`}
                    onClick={() => openEditModal(grade)}
                    title="Edit Grade Level"
                    className="p-2 rounded-lg text-surface-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* UC-GRADE-05: Delete */}
                  <button
                    id={`btn-delete-grade-${grade.id}`}
                    onClick={() => setDeleteTarget(grade)}
                    title="Delete Grade Level"
                    className="p-2 rounded-lg text-surface-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {grade.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UC-GRADE-02: View Details Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-grade-level-details"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Grade Level Details</h3>
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
                  <p className="text-xs text-surface-500">Numeric Level: {viewModalData.numericLevel}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  {viewModalData.division}
                </span>
              </div>

              {viewModalData.description && (
                <p className="text-xs text-surface-600 dark:text-surface-300 p-3 bg-surface-50 dark:bg-surface-900/40 rounded-xl border border-surface-100 dark:border-surface-800">
                  {viewModalData.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 text-xs">
                <div>
                  <span className="text-surface-400">Age Band:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.minAge} - {viewModalData.maxAge} Years</p>
                </div>
                <div>
                  <span className="text-surface-400">Graduation Credits:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.requiredCredits} Credits</p>
                </div>
                <div>
                  <span className="text-surface-400">Active Classes:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.classesCount} Sections</p>
                </div>
                <div>
                  <span className="text-surface-400">Enrolled Students:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.studentsCount} Students</p>
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

      {/* UC-GRADE-03: Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-create-grade-level"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Create Grade Level</h3>
                  <p className="text-xs text-surface-500">Configure new educational cohort level</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGrade} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Grade Level Name *
                </label>
                <input
                  id="input-create-grade-name"
                  type="text"
                  placeholder="e.g. Grade 9 (Freshman)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Numeric Stage *
                  </label>
                  <input
                    id="input-create-grade-numeric"
                    type="number"
                    min={1}
                    max={13}
                    value={formData.numericLevel}
                    onChange={(e) => setFormData({ ...formData, numericLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    School Division
                  </label>
                  <select
                    id="select-create-grade-division"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="High School">High School</option>
                    <option value="Middle School">Middle School</option>
                    <option value="Junior High">Junior High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Minimum Age
                  </label>
                  <input
                    id="input-create-grade-min-age"
                    type="number"
                    min={10}
                    max={20}
                    value={formData.minAge}
                    onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Maximum Age
                  </label>
                  <input
                    id="input-create-grade-max-age"
                    type="number"
                    min={10}
                    max={21}
                    value={formData.maxAge}
                    onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Required Graduation Credits
                </label>
                <input
                  id="input-create-grade-credits"
                  type="number"
                  min={1}
                  max={50}
                  value={formData.requiredCredits}
                  onChange={(e) => setFormData({ ...formData, requiredCredits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Description
                </label>
                <textarea
                  id="input-create-grade-description"
                  rows={2}
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
                  id="btn-submit-create-grade"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Level</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UC-GRADE-04: Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-edit-grade-level"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Edit Grade Level</h3>
                  <p className="text-xs text-surface-500">Update cohort requirements and credits</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalData(null)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateGrade} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Grade Level Name *
                </label>
                <input
                  id="input-edit-grade-name"
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
                    Division
                  </label>
                  <select
                    id="select-edit-grade-division"
                    value={editForm.division}
                    onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="High School">High School</option>
                    <option value="Middle School">Middle School</option>
                    <option value="Junior High">Junior High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Required Credits
                  </label>
                  <input
                    id="input-edit-grade-credits"
                    type="number"
                    value={editForm.requiredCredits}
                    onChange={(e) => setEditForm({ ...editForm, requiredCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Status
                </label>
                <select
                  id="select-edit-grade-status"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
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
                  id="btn-submit-edit-grade"
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

      {/* UC-GRADE-05: Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-delete-grade-level"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
              Delete Grade Level?
            </h3>
            <p className="text-xs text-surface-500 mt-2">
              Are you sure you want to delete <strong className="text-surface-800 dark:text-surface-200">"{deleteTarget.name}"</strong>?
              {deleteTarget.classesCount > 0 ? (
                <span className="block mt-2 font-bold text-rose-600 dark:text-rose-400">
                  Notice: This grade level has {deleteTarget.classesCount} active class sections assigned. You must remove or reassign these classes first.
                </span>
              ) : (
                ' This action will permanently remove this stage definition.'
              )}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-grade"
                onClick={handleDeleteGrade}
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
