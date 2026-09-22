// src/pages/Setup/AcademicYears.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  CalendarRange, Plus, CheckCircle2, Clock, Edit3, Trash2, Eye, X,
  AlertTriangle, RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  academicYearService,
  type AcademicYearRecord,
} from '@/services/academicYearService'

/* Neumorphic hairline seams.
   - SEAM_B / SEAM_T: single-edge divider (bottom / top)
   - SEAM_Y:            top + bottom — an "info strip" band around a block */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'
const SEAM_Y = 'shadow-[0_-1px_0_var(--neu-shadow-dark),0_1px_0_var(--neu-shadow-dark)]'

const inputBase =
  'w-full px-3.5 py-2 rounded-xl text-xs text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
const labelBase = 'block text-xs font-semibold text-fg-muted mb-1'

function fmtDate(iso: string): string {
  return iso ? iso.slice(0, 10) : ''
}

interface FormState {
  name: string
  startDate: string
  endDate: string
  status: AcademicYearRecord['status']
  description: string
}

const EMPTY_FORM: FormState = {
  name: '', startDate: '', endDate: '', status: 'Upcoming', description: '',
}

export default function AcademicYears() {
  const { showToast } = useToast()
  const [years, setYears] = useState<AcademicYearRecord[]>([])
  const [loading, setLoading] = useState(true)

  const [detailYear, setDetailYear] = useState<AcademicYearRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYearRecord | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<AcademicYearRecord | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const records = await academicYearService.list()
      setYears(Array.isArray(records) ? records : [])
    } catch {
      showToast('Failed to load academic years', 'error')
      setYears([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const stats = useMemo(() => {
    const total = years.length
    const current = years.find((y) => y.isCurrent)?.name ?? 'None'
    const totalClasses = years.reduce((s, y) => s + (y.classesCount ?? 0), 0)
    const totalStudents = years.reduce((s, y) => s + (y.studentsCount ?? 0), 0)
    return { total, current, totalClasses, totalStudents }
  }, [years])

  const kpiCards: StatCard[] = [
    { id: 'sessions', label: 'Academic Sessions', value: String(stats.total),                  delta: '-', deltaDirection: 'neutral', deltaLabel: 'configured',      icon: 'CalendarRange', tint: 'blue' },
    { id: 'current',  label: 'Current Session',   value: stats.current,                        delta: '-', deltaDirection: 'neutral', deltaLabel: 'active cycle',    icon: 'CheckCircle2',  tint: 'green' },
    { id: 'classes',  label: 'Classes Held',      value: stats.totalClasses.toLocaleString(),  delta: '-', deltaDirection: 'neutral', deltaLabel: 'across sessions', icon: 'School',        tint: 'amber' },
    { id: 'students', label: 'Enrolled Students', value: stats.totalStudents.toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'across sessions', icon: 'Users',         tint: 'violet' },
  ]

  const resetForm = () => {
    setForm({ ...EMPTY_FORM })
    setEditingYear(null)
  }

  const handleOpenCreate = () => { resetForm(); setModalOpen(true) }

  const handleOpenEdit = (y: AcademicYearRecord) => {
    setEditingYear(y)
    setForm({
      name: y.name,
      startDate: fmtDate(y.startDate),
      endDate: fmtDate(y.endDate),
      status: y.status,
      description: y.description ?? '',
    })
    setModalOpen(true)
  }

  const handleSetActive = async (id: string) => {
    try {
      await academicYearService.setCurrent(id)
      await load()
      showToast('Set as current academic year', 'success')
    } catch {
      showToast('Failed to set academic year', 'error')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      showToast('Name, start date, and end date are required', 'error'); return
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      showToast('Start date must be earlier than end date', 'error'); return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        description: form.description.trim() || undefined,
      }
      if (editingYear) {
        await academicYearService.update(editingYear.id, payload)
        showToast(`"${payload.name}" updated`, 'success')
      } else {
        await academicYearService.create(payload)
        showToast(`"${payload.name}" created`, 'success')
      }
      setModalOpen(false)
      resetForm()
      await load()
    } catch {
      showToast('Failed to save academic year', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteCandidate) return
    if (deleteCandidate.isCurrent) {
      showToast('Cannot delete the current academic year', 'error')
      setDeleteCandidate(null); return
    }
    if ((deleteCandidate.classesCount ?? 0) > 0 || (deleteCandidate.studentsCount ?? 0) > 0) {
      showToast(
        `Cannot delete "${deleteCandidate.name}" — it has ${deleteCandidate.classesCount} classes and ${deleteCandidate.studentsCount} students`,
        'error'
      )
      setDeleteCandidate(null); return
    }
    try {
      await academicYearService.delete(deleteCandidate.id)
      setYears((prev) => prev.filter((y) => y.id !== deleteCandidate.id))
      if (detailYear?.id === deleteCandidate.id) setDetailYear(null)
      showToast('Academic year deleted', 'success')
    } catch {
      showToast('Failed to delete', 'error')
    } finally {
      setDeleteCandidate(null)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Academic Years"
          subtitle="Configure school sessions and active cycles."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl theme-button-primary text-xs font-semibold shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>New Academic Year</span>
        </button>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      {loading ? (
        <div className="py-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading academic years...
        </div>
      ) : years.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <CalendarRange className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-sm font-semibold text-fg">No academic years yet</p>
          <p className="text-xs text-fg-muted mt-1">
            Click "New Academic Year" to create the first session.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {years.map((year) => (
            <div
              key={year.id}
              /* Current-year highlight: brand ring on the raised surface,
                 plus a subtle brand tint behind it. */
              className={`rounded-2xl p-5 glass-sm transition-shadow duration-300 flex flex-col justify-between hover:shadow-(--glass-strong-shadow) ${
                year.isCurrent ? 'ring-1 ring-brand-500/40 bg-brand-500/5' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {/* Icon well — filled brand for current, tinted sunken otherwise */}
                    <div
                      className={`p-2.5 rounded-xl shadow-sunken ${
                        year.isCurrent
                          ? 'bg-brand-600 text-white'
                          : 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                      }`}
                    >
                      <CalendarRange size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-fg flex items-center gap-2">
                        {year.name}
                        {year.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300">
                            CURRENT
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-fg-muted flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} />
                        <span>{fmtDate(year.startDate)} → {fmtDate(year.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      year.status === 'Active'
                        ? 'bg-success/15 text-success'
                        : year.status === 'Upcoming'
                          ? 'bg-info/15 text-info'
                          : 'text-fg-muted shadow-sunken'
                    }`}
                  >
                    {year.status}
                  </span>
                </div>

                {/* Stats strip — top & bottom shadow seams around sunken wells */}
                <div className={`grid grid-cols-3 gap-2 py-3 ${SEAM_Y} text-center`}>
                  <div className="p-2 rounded-xl shadow-sunken">
                    <div className="text-[11px] text-fg-muted">Terms</div>
                    <div className="text-sm font-bold text-fg">{year.termsCount ?? 0}</div>
                  </div>
                  <div className="p-2 rounded-xl shadow-sunken">
                    <div className="text-[11px] text-fg-muted">Classes</div>
                    <div className="text-sm font-bold text-fg">{year.classesCount ?? 0}</div>
                  </div>
                  <div className="p-2 rounded-xl shadow-sunken">
                    <div className="text-[11px] text-fg-muted">Students</div>
                    <div className="text-sm font-bold text-fg">{year.studentsCount ?? 0}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                {!year.isCurrent ? (
                  <button
                    onClick={() => handleSetActive(year.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-fg shadow-sunken hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300 transition cursor-pointer"
                  >
                    Set as Current
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-success flex items-center gap-1">
                    <CheckCircle2 size={14} /> Active Session
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDetailYear(year)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition cursor-pointer"
                    title="Details"
                    aria-label={`View details for ${year.name}`}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(year)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition cursor-pointer"
                    title="Edit"
                    aria-label={`Edit ${year.name}`}
                  >
                    <Edit3 size={15} />
                  </button>
                  {!year.isCurrent && (
                    <button
                      onClick={() => setDeleteCandidate(year)}
                      className="p-1.5 rounded-lg text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
                      title="Delete"
                      aria-label={`Delete ${year.name}`}
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
      {detailYear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setDetailYear(null) }}
        >
          <div className="w-full max-w-lg rounded-2xl glass-strong p-6 space-y-5 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
                  <CalendarRange size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-fg">{detailYear.name}</h3>
                  <p className="text-xs text-fg-muted">
                    {fmtDate(detailYear.startDate)} – {fmtDate(detailYear.endDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailYear(null)}
                aria-label="Close"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">Status</span>
                <span className="font-bold text-fg block">
                  {detailYear.status} {detailYear.isCurrent && '(CURRENT)'}
                </span>
              </div>
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">Terms</span>
                <span className="font-bold text-fg block">{detailYear.termsCount ?? 0}</span>
              </div>
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">Classes</span>
                <span className="font-bold text-fg block">{detailYear.classesCount ?? 0}</span>
              </div>
              <div className="p-3 rounded-xl shadow-sunken space-y-1">
                <span className="text-fg-muted">Students</span>
                <span className="font-bold text-fg block">{detailYear.studentsCount ?? 0}</span>
              </div>
            </div>

            {detailYear.description && (
              <div className="p-3 rounded-xl shadow-sunken text-xs">
                <span className="font-semibold text-fg block mb-1">Description</span>
                <p className="text-fg-muted">{detailYear.description}</p>
              </div>
            )}

            <div className={`pt-2 flex items-center justify-end gap-2 ${SEAM_T}`}>
              <button
                onClick={() => { const y = detailYear; setDetailYear(null); handleOpenEdit(y) }}
                className="glass-sm glass-interactive px-4 py-2 rounded-xl text-xs font-semibold text-fg"
              >
                Edit
              </button>
              <button
                onClick={() => setDetailYear(null)}
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
                {editingYear ? 'Edit Academic Year' : 'New Academic Year'}
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
                <label className={labelBase}>Session name *</label>
                <input
                  type="text" required placeholder="e.g. 2027 - 2028"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`${inputBase} font-semibold`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Start date *</label>
                  <input type="date" required value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>End date *</label>
                  <input type="date" required value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
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
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className={labelBase}>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional notes about this session..."
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
                  {editingYear ? 'Save' : 'Create'}
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
              {/* Icon well — sunken, tinted; border dropped (shadow is the well) */}
              <div className="p-3 rounded-xl bg-error/15 shadow-sunken">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-fg">Delete Academic Year</h3>
            </div>

            <p className="text-xs text-fg-muted leading-relaxed">
              Permanently delete <span className="font-bold text-fg">"{deleteCandidate.name}"</span>?
            </p>

            {((deleteCandidate.classesCount ?? 0) > 0 || (deleteCandidate.studentsCount ?? 0) > 0) && (
              <div className="p-3 rounded-xl bg-warning/15 border border-warning/30 text-xs text-warning">
                This session has {deleteCandidate.classesCount} classes and{' '}
                {deleteCandidate.studentsCount} students. Deletion will be rejected by the server.
              </div>
            )}

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