// src/pages/Setup/AcademicYears.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  academicYearService,
  type AcademicYearRecord,
} from '@/services/academicYearService'

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
  name: '',
  startDate: '',
  endDate: '',
  status: 'Upcoming',
  description: '',
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

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const total = years.length
    const current = years.find((y) => y.isCurrent)?.name ?? 'None'
    const totalClasses = years.reduce((s, y) => s + (y.classesCount ?? 0), 0)
    const totalStudents = years.reduce((s, y) => s + (y.studentsCount ?? 0), 0)
    return { total, current, totalClasses, totalStudents }
  }, [years])

  const kpiCards: StatCard[] = [
    { id: 'sessions', label: 'Academic Sessions', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: 'configured', icon: 'CalendarRange', tint: 'blue' },
    { id: 'current', label: 'Current Session', value: stats.current, delta: '-', deltaDirection: 'neutral', deltaLabel: 'active cycle', icon: 'CheckCircle2', tint: 'green' },
    { id: 'classes', label: 'Classes Held', value: stats.totalClasses.toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'across sessions', icon: 'School', tint: 'amber' },
    { id: 'students', label: 'Enrolled Students', value: stats.totalStudents.toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'across sessions', icon: 'Users', tint: 'violet' },
  ]

  const resetForm = () => {
    setForm({ ...EMPTY_FORM })
    setEditingYear(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setModalOpen(true)
  }

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
      showToast('Name, start date, and end date are required', 'error')
      return
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      showToast('Start date must be earlier than end date', 'error')
      return
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
      setDeleteCandidate(null)
      return
    }
    if ((deleteCandidate.classesCount ?? 0) > 0 || (deleteCandidate.studentsCount ?? 0) > 0) {
      showToast(
        `Cannot delete "${deleteCandidate.name}" — it has ${deleteCandidate.classesCount} classes and ${deleteCandidate.studentsCount} students`,
        'error'
      )
      setDeleteCandidate(null)
      return
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition shrink-0"
        >
          <Plus size={16} />
          <span>New Academic Year</span>
        </button>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      {loading ? (
        <div className="py-16 text-center text-secondary text-sm rounded-2xl glass-sm border border-surface">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading academic years...
        </div>
      ) : years.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm border border-surface">
          <CalendarRange className="mx-auto mb-3 h-10 w-10 text-secondary" />
          <p className="text-sm font-semibold text-color">No academic years yet</p>
          <p className="text-xs text-secondary mt-1">
            Click "New Academic Year" to create the first session.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {years.map((year) => (
            <div
              key={year.id}
              className={`rounded-2xl p-5 glass-sm border transition flex flex-col justify-between hover:shadow-md ${
                year.isCurrent
                  ? 'border-brand-500/50 ring-2 ring-brand-500/10'
                  : 'border-surface'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        year.isCurrent
                          ? 'bg-brand-500 text-white'
                          : 'bg-surface text-secondary'
                      }`}
                    >
                      <CalendarRange size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-color flex items-center gap-2">
                        {year.name}
                        {year.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                            CURRENT
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-secondary flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} />
                        <span>
                          {fmtDate(year.startDate)} → {fmtDate(year.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      year.status === 'Active'
                        ? 'bg-success/15 text-success'
                        : year.status === 'Upcoming'
                          ? 'bg-info/15 text-info'
                          : 'bg-surface-strong text-secondary'
                    }`}
                  >
                    {year.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface text-center">
                  <div className="p-2 rounded-xl bg-surface">
                    <div className="text-[11px] text-secondary">Terms</div>
                    <div className="text-sm font-bold text-color">
                      {year.termsCount ?? 0}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-surface">
                    <div className="text-[11px] text-secondary">Classes</div>
                    <div className="text-sm font-bold text-color">
                      {year.classesCount ?? 0}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-surface">
                    <div className="text-[11px] text-secondary">Students</div>
                    <div className="text-sm font-bold text-color">
                      {year.studentsCount ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                {!year.isCurrent ? (
                  <button
                    onClick={() => handleSetActive(year.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface hover:bg-brand-500 hover:text-white text-color transition"
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
                    className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-surface transition"
                    title="Details"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(year)}
                    className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-surface transition"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </button>
                  {!year.isCurrent && (
                    <button
                      onClick={() => setDeleteCandidate(year)}
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
      {detailYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <CalendarRange size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-color">{detailYear.name}</h3>
                  <p className="text-xs text-secondary">
                    {fmtDate(detailYear.startDate)} – {fmtDate(detailYear.endDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailYear(null)}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">Status</span>
                <span className="font-bold text-color block">
                  {detailYear.status} {detailYear.isCurrent && '(CURRENT)'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">Terms</span>
                <span className="font-bold text-color block">
                  {detailYear.termsCount ?? 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">Classes</span>
                <span className="font-bold text-color block">
                  {detailYear.classesCount ?? 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface space-y-1">
                <span className="text-secondary">Students</span>
                <span className="font-bold text-color block">
                  {detailYear.studentsCount ?? 0}
                </span>
              </div>
            </div>

            {detailYear.description && (
              <div className="p-3 rounded-xl bg-surface border border-surface text-xs">
                <span className="font-semibold text-color block mb-1">
                  Description
                </span>
                <p className="text-secondary">{detailYear.description}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface">
              <button
                onClick={() => {
                  const y = detailYear
                  setDetailYear(null)
                  handleOpenEdit(y)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-strong text-color transition"
              >
                Edit
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

      {/* Create / edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface">
              <h3 className="text-base font-bold text-color">
                {editingYear ? 'Edit Academic Year' : 'New Academic Year'}
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
                  Session name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2027 - 2028"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface text-xs text-color font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Start date *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    End date *
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

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as FormState['status'] })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-xs text-color focus:outline-none"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional notes about this session..."
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
                  {editingYear ? 'Save' : 'Create'}
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
              <h3 className="text-base font-bold text-color">Delete Academic Year</h3>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Permanently delete{' '}
              <span className="font-bold text-color">"{deleteCandidate.name}"</span>?
            </p>

            {((deleteCandidate.classesCount ?? 0) > 0 || (deleteCandidate.studentsCount ?? 0) > 0) && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/30 text-xs text-warning">
                This session has {deleteCandidate.classesCount} classes and{' '}
                {deleteCandidate.studentsCount} students. Deletion will be rejected
                by the server.
              </div>
            )}

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