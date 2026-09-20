// src/pages/Setup/Terms.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Edit3,
  Trash2,
  AlertTriangle,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  academicYearService,
  type AcademicYearRecord,
} from '@/services/academicYearService'
import {
  termService,
  type TermRecord,
  type TermPayload,
} from '@/services/termService'

interface FormState {
  name: string
  startDate: string
  endDate: string
  gradingDeadline: string
  weightPercentage: number
  status: TermRecord['status']
  description: string
}

const EMPTY_FORM: FormState = {
  name: '',
  startDate: '',
  endDate: '',
  gradingDeadline: '',
  weightPercentage: 35,
  status: 'Upcoming',
  description: '',
}

export default function Terms() {
  const { showToast } = useToast()
  const [academicYears, setAcademicYears] = useState<AcademicYearRecord[]>([])
  const [selectedYearId, setSelectedYearId] = useState('')
  const [terms, setTerms] = useState<TermRecord[]>([])
  const [loading, setLoading] = useState(true)

  const [detailTerm, setDetailTerm] = useState<TermRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<TermRecord | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<TermRecord | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  // Load years once, pick current
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const years = await academicYearService.list()
        if (cancelled) return
        setAcademicYears(Array.isArray(years) ? years : [])
        const current = years.find((y) => y.isCurrent) ?? years[0]
        if (current) setSelectedYearId(current.id)
      } catch {
        if (!cancelled) {
          showToast('Failed to load academic years', 'error')
          setAcademicYears([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [showToast])

  const loadTerms = useCallback(async () => {
    if (!selectedYearId) {
      setTerms([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const records = await termService.list({ academicYearId: selectedYearId })
      setTerms(Array.isArray(records) ? records : [])
    } catch {
      showToast('Failed to load terms', 'error')
      setTerms([])
    } finally {
      setLoading(false)
    }
  }, [selectedYearId, showToast])

  useEffect(() => {
    loadTerms()
  }, [loadTerms])

  const selectedYear = academicYears.find((y) => y.id === selectedYearId)
  const selectedYearName = selectedYear?.name ?? ''

  const stats = {
    total: terms.length,
    active: terms.find((t) => t.status === 'Active')?.name ?? 'None',
    totalWeight: terms.reduce((s, t) => s + (t.weightPercentage ?? 0), 0),
  }

  const kpiCards: StatCard[] = [
    { id: 'terms', label: 'Configured Terms', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: selectedYearName || 'selected year', icon: 'Layers', tint: 'blue' },
    { id: 'active', label: 'Active Term', value: stats.active, delta: '-', deltaDirection: 'neutral', deltaLabel: 'current cycle', icon: 'CheckCircle2', tint: 'green' },
    { id: 'weight', label: 'Aggregate Weight', value: `${stats.totalWeight}%`, delta: '-', deltaDirection: 'neutral', deltaLabel: 'toward final', icon: 'Award', tint: 'amber' },
    { id: 'years', label: 'Academic Years', value: String(academicYears.length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'configured', icon: 'Calendar', tint: 'violet' },
  ]

  const resetForm = () => {
    setForm({ ...EMPTY_FORM })
    setEditingTerm(null)
  }

  const handleOpenCreate = () => {
    if (!selectedYearId) {
      showToast('Select an academic year first', 'error')
      return
    }
    resetForm()
    setModalOpen(true)
  }

  const handleOpenEdit = (t: TermRecord) => {
    setEditingTerm(t)
    setForm({
      name: t.name,
      startDate: t.startDate.slice(0, 10),
      endDate: t.endDate.slice(0, 10),
      gradingDeadline: t.gradingDeadline.slice(0, 10),
      weightPercentage: t.weightPercentage,
      status: t.status,
      description: t.description ?? '',
    })
    setModalOpen(true)
  }

  const handleSetActive = async (id: string) => {
    try {
      await termService.setActive(id)
      await loadTerms()
      showToast('Active term updated', 'success')
    } catch {
      showToast('Failed to activate term', 'error')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      showToast('Name, start date, and end date are required', 'error')
      return
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      showToast('Start date must precede end date', 'error')
      return
    }

    setSaving(true)
    try {
      const payload: TermPayload = {
        name: form.name.trim(),
        academicYearId: selectedYearId,
        startDate: form.startDate,
        endDate: form.endDate,
        gradingDeadline: form.gradingDeadline || form.endDate,
        status: form.status,
        weightPercentage: form.weightPercentage,
        description: form.description.trim() || undefined,
      }
      if (editingTerm) {
        await termService.update(editingTerm.id, payload)
        showToast(`"${payload.name}" updated`, 'success')
      } else {
        await termService.create(payload)
        showToast(`"${payload.name}" created`, 'success')
      }
      setModalOpen(false)
      resetForm()
      await loadTerms()
    } catch {
      showToast('Failed to save term', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteCandidate) return
    if (deleteCandidate.status === 'Active') {
      showToast('Cannot delete the active term', 'error')
      setDeleteCandidate(null)
      return
    }
    try {
      await termService.delete(deleteCandidate.id)
      setTerms((prev) => prev.filter((t) => t.id !== deleteCandidate.id))
      if (detailTerm?.id === deleteCandidate.id) setDetailTerm(null)
      showToast('Term deleted', 'success')
    } catch {
      showToast('Failed to delete term', 'error')
    } finally {
      setDeleteCandidate(null)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Terms & Grading Cycles"
          subtitle="Evaluation periods, grading deadlines, and GPA weights."
        />
        <div className="flex items-center gap-3">
          <select
            value={selectedYearId}
            onChange={(e) => setSelectedYearId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface border border-surface text-xs font-semibold text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {academicYears.length === 0 && (
              <option value="">No academic years</option>
            )}
            {academicYears.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
                {y.isCurrent ? ' (Current)' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenCreate}
            disabled={!selectedYearId}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition disabled:opacity-50"
          >
            <Plus size={16} />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      {loading ? (
        <div className="py-16 text-center text-secondary text-sm rounded-2xl glass-sm border border-surface">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading terms...
        </div>
      ) : !selectedYearId ? (
        <div className="py-16 text-center rounded-2xl glass-sm border border-surface">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-secondary" />
          <p className="text-sm font-semibold text-color">
            No academic year selected
          </p>
          <p className="text-xs text-secondary mt-1">
            Create an academic year first, then add terms to it.
          </p>
        </div>
      ) : terms.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm border border-surface">
          <Clock className="mx-auto mb-3 h-10 w-10 text-secondary" />
          <p className="text-sm font-semibold text-color">
            No terms in {selectedYearName}
          </p>
          <p className="text-xs text-secondary mt-1">
            Click "Add Term" to define the first evaluation period.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {terms.map((term) => (
            <div
              key={term.id}
              className={`rounded-2xl p-5 glass-sm border transition flex flex-col justify-between hover:shadow-md ${
                term.status === 'Active'
                  ? 'border-brand-500/50 ring-2 ring-brand-500/10'
                  : 'border-surface'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-color">
                      {term.name}
                    </h3>
                    <div className="text-xs text-secondary flex items-center gap-1.5 mt-0.5">
                      <Calendar size={12} />
                      <span>
                        {term.startDate.slice(0, 10)} → {term.endDate.slice(0, 10)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      term.status === 'Active'
                        ? 'bg-success/15 text-success'
                        : term.status === 'Completed'
                          ? 'bg-surface-strong text-secondary'
                          : 'bg-info/15 text-info'
                    }`}
                  >
                    {term.status}
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-surface my-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Grading deadline:</span>
                    <span className="font-semibold text-error">
                      {term.gradingDeadline.slice(0, 10)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">GPA weight:</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {term.weightPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                {term.status !== 'Active' ? (
                  <button
                    onClick={() => handleSetActive(term.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface hover:bg-brand-500 hover:text-white text-color transition"
                  >
                    Set as Active
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-success flex items-center gap-1">
                    <CheckCircle2 size={14} /> Current Term
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDetailTerm(term)}
                    className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-surface transition"
                    title="Details"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(term)}
                    className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-surface transition"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </button>
                  {term.status !== 'Active' && (
                    <button
                      onClick={() => setDeleteCandidate(term)}
                      className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {detailTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Clock size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-color">
                    {detailTerm.name}
                  </h3>
                  <p className="text-xs text-secondary">
                    {detailTerm.academicYear?.name ?? selectedYearName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailTerm(null)}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">Schedule</span>
                <span className="font-bold text-color block">
                  {detailTerm.startDate.slice(0, 10)} – {detailTerm.endDate.slice(0, 10)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">Grading deadline</span>
                <span className="font-bold text-error block">
                  {detailTerm.gradingDeadline.slice(0, 10)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">GPA weight</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 block">
                  {detailTerm.weightPercentage}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">Status</span>
                <span className="font-bold text-color block">
                  {detailTerm.status}
                </span>
              </div>
            </div>

            {detailTerm.description && (
              <div className="p-3 rounded-xl bg-surface border border-surface text-xs">
                <span className="font-semibold text-color block mb-1">
                  Description
                </span>
                <p className="text-secondary">{detailTerm.description}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface">
              <button
                onClick={() => {
                  const t = detailTerm
                  setDetailTerm(null)
                  handleOpenEdit(t)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-strong text-color transition"
              >
                Edit
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

      {/* Create / edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface">
              <h3 className="text-base font-bold text-color">
                {editingTerm ? 'Edit Term' : 'New Term'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Term name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Term 4 (Summer Intensive)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Start *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    End *
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Grading deadline
                  </label>
                  <input
                    type="date"
                    value={form.gradingDeadline}
                    onChange={(e) =>
                      setForm({ ...form, gradingDeadline: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    GPA weight (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.weightPercentage}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        weightPercentage: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as FormState['status'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:bg-surface transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition disabled:opacity-50"
                >
                  {editingTerm ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-error">
              <div className="p-3 rounded-xl bg-error/10 border border-error/30">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-color">Delete Term</h3>
            </div>

            <p className="text-xs text-secondary">
              Delete <span className="font-bold text-color">"{deleteCandidate.name}"</span>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-strong text-color transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error hover:opacity-90 text-white transition"
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