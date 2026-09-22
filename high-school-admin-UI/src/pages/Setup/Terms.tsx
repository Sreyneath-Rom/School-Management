// src/pages/Setup/Terms.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Clock, Plus, CheckCircle2, Calendar, Edit3, Trash2, AlertTriangle,
  Eye, X, RefreshCw,
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

/* Neumorphic hairline seams. */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'
const SEAM_Y = 'shadow-[0_-1px_0_var(--neu-shadow-dark),0_1px_0_var(--neu-shadow-dark)]'

const inputBase =
  'w-full px-3.5 py-2 rounded-xl text-xs text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
const labelBase = 'block text-xs font-semibold text-fg-muted mb-1'

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
  name: '', startDate: '', endDate: '', gradingDeadline: '',
  weightPercentage: 35, status: 'Upcoming', description: '',
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
    return () => { cancelled = true }
  }, [showToast])

  const loadTerms = useCallback(async () => {
    if (!selectedYearId) { setTerms([]); setLoading(false); return }
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

  useEffect(() => { loadTerms() }, [loadTerms])

  const selectedYear = academicYears.find((y) => y.id === selectedYearId)
  const selectedYearName = selectedYear?.name ?? ''

  const stats = {
    total: terms.length,
    active: terms.find((t) => t.status === 'Active')?.name ?? 'None',
    totalWeight: terms.reduce((s, t) => s + (t.weightPercentage ?? 0), 0),
  }

  const kpiCards: StatCard[] = [
    { id: 'terms',  label: 'Configured Terms', value: String(stats.total),         delta: '-', deltaDirection: 'neutral', deltaLabel: selectedYearName || 'selected year', icon: 'Layers',       tint: 'blue' },
    { id: 'active', label: 'Active Term',      value: stats.active,                delta: '-', deltaDirection: 'neutral', deltaLabel: 'current cycle',                   icon: 'CheckCircle2', tint: 'green' },
    { id: 'weight', label: 'Aggregate Weight', value: `${stats.totalWeight}%`,     delta: '-', deltaDirection: 'neutral', deltaLabel: 'toward final',                    icon: 'Award',        tint: 'amber' },
    { id: 'years',  label: 'Academic Years',   value: String(academicYears.length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'configured',                      icon: 'Calendar',     tint: 'violet' },
  ]

  const resetForm = () => { setForm({ ...EMPTY_FORM }); setEditingTerm(null) }

  const handleOpenCreate = () => {
    if (!selectedYearId) { showToast('Select an academic year first', 'error'); return }
    resetForm(); setModalOpen(true)
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
      showToast('Name, start date, and end date are required', 'error'); return
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      showToast('Start date must precede end date', 'error'); return
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
      setDeleteCandidate(null); return
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
            className="px-3 py-2 rounded-xl text-xs font-semibold text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {academicYears.length === 0 && <option value="">No academic years</option>}
            {academicYears.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}{y.isCurrent ? ' (Current)' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenCreate}
            disabled={!selectedYearId}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      {loading ? (
        <div className="py-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading terms...
        </div>
      ) : !selectedYearId ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-sm font-semibold text-fg">No academic year selected</p>
          <p className="text-xs text-fg-muted mt-1">
            Create an academic year first, then add terms to it.
          </p>
        </div>
      ) : terms.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <Clock className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-sm font-semibold text-fg">No terms in {selectedYearName}</p>
          <p className="text-xs text-fg-muted mt-1">
            Click "Add Term" to define the first evaluation period.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {terms.map((term) => (
            <div
              key={term.id}
              className={`rounded-2xl p-5 glass-sm transition-shadow duration-300 flex flex-col justify-between hover:shadow-(--glass-strong-shadow) ${
                term.status === 'Active' ? 'ring-1 ring-brand-500/40 bg-brand-500/5' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-fg">{term.name}</h3>
                    <div className="text-xs text-fg-muted flex items-center gap-1.5 mt-0.5">
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
                          ? 'text-fg-muted shadow-sunken'
                          : 'bg-info/15 text-info'
                    }`}
                  >
                    {term.status}
                  </span>
                </div>

                {/* Info strip — shadow seams around sunken wells */}
                <div className={`space-y-2 py-3 my-3 ${SEAM_Y} text-xs`}>
                  <div className="flex items-center justify-between">
                    <span className="text-fg-muted">Grading deadline:</span>
                    <span className="font-semibold text-error">{term.gradingDeadline.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-fg-muted">GPA weight:</span>
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
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-fg shadow-sunken hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300 transition cursor-pointer"
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
                    className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition cursor-pointer"
                    title="Details"
                    aria-label={`View details for ${term.name}`}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(term)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition cursor-pointer"
                    title="Edit"
                    aria-label={`Edit ${term.name}`}
                  >
                    <Edit3 size={15} />
                  </button>
                  {term.status !== 'Active' && (
                    <button
                      onClick={() => setDeleteCandidate(term)}
                      className="p-1.5 rounded-lg text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
                      title="Delete"
                      aria-label={`Delete ${term.name}`}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setDetailTerm(null) }}
        >
          <div className="w-full max-w-lg rounded-2xl glass-strong p-6 space-y-5 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
                  <Clock size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-fg">{detailTerm.name}</h3>
                  <p className="text-xs text-fg-muted">
                    {detailTerm.academicYear?.name ?? selectedYearName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailTerm(null)}
                aria-label="Close"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">Schedule</span>
                <span className="font-bold text-fg block">
                  {detailTerm.startDate.slice(0, 10)} – {detailTerm.endDate.slice(0, 10)}
                </span>
              </div>
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">Grading deadline</span>
                <span className="font-bold text-error block">{detailTerm.gradingDeadline.slice(0, 10)}</span>
              </div>
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">GPA weight</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 block">
                  {detailTerm.weightPercentage}%
                </span>
              </div>
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">Status</span>
                <span className="font-bold text-fg block">{detailTerm.status}</span>
              </div>
            </div>

            {detailTerm.description && (
              <div className="p-3 rounded-xl shadow-sunken text-xs">
                <span className="font-semibold text-fg block mb-1">Description</span>
                <p className="text-fg-muted">{detailTerm.description}</p>
              </div>
            )}

            <div className={`pt-2 flex items-center justify-end gap-2 ${SEAM_T}`}>
              <button
                onClick={() => { const t = detailTerm; setDetailTerm(null); handleOpenEdit(t) }}
                className="glass-sm glass-interactive px-4 py-2 rounded-xl text-xs font-semibold text-fg"
              >
                Edit
              </button>
              <button
                onClick={() => setDetailTerm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold theme-button-primary cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="w-full max-w-md rounded-2xl glass-strong p-6 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className={`flex items-center justify-between pb-3 ${SEAM_B}`}>
              <h3 className="text-base font-bold text-fg">
                {editingTerm ? 'Edit Term' : 'New Term'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-3">
              <div>
                <label className={labelBase}>Term name *</label>
                <input type="text" required placeholder="e.g. Term 4 (Summer Intensive)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputBase} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Start *</label>
                  <input type="date" required value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>End *</label>
                  <input type="date" required value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className={inputBase} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Grading deadline</label>
                  <input type="date" value={form.gradingDeadline}
                    onChange={(e) => setForm({ ...form, gradingDeadline: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>GPA weight (%)</label>
                  <input type="number" required min={1} max={100}
                    value={form.weightPercentage}
                    onChange={(e) => setForm({ ...form, weightPercentage: Number(e.target.value) })}
                    className={inputBase} />
                </div>
              </div>

              <div>
                <label className={labelBase}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as FormState['status'] })}
                  className={`${inputBase} cursor-pointer`}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className={labelBase}>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputBase} resize-none`} />
              </div>

              <div className={`flex items-center justify-end gap-3 pt-3 ${SEAM_T}`}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="glass-sm glass-interactive px-4 py-2 rounded-xl text-xs font-semibold text-fg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold theme-button-primary disabled:opacity-50 cursor-pointer"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setDeleteCandidate(null) }}
        >
          <div className="w-full max-w-md rounded-2xl glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-center gap-3 text-error">
              <div className="p-3 rounded-xl bg-error/15 shadow-sunken">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-fg">Delete Term</h3>
            </div>

            <p className="text-xs text-fg-muted">
              Delete <span className="font-bold text-fg">"{deleteCandidate.name}"</span>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="glass-sm glass-interactive px-4 py-2 rounded-xl text-xs font-semibold text-fg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error hover:opacity-90 text-white transition cursor-pointer"
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