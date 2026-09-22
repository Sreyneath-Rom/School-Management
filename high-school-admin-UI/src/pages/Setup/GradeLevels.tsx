// src/pages/Setup/GradeLevels.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  GraduationCap, Plus, Search, Edit3, Trash2, X, AlertCircle, RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  gradeLevelService,
  type GradeLevelRecord,
  type GradeLevelPayload,
} from '@/services/gradeLevelService'

/* Neumorphic hairline seams. */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'

const inputBase =
  'w-full px-3.5 py-2 rounded-xl text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
const labelBase = 'block text-xs font-semibold text-fg-muted mb-1'

interface FormState {
  code: string
  name: string
  alias: string
  levelOrder: number
  minPassingScore: number
  headCoordinator: string
  maxCapacity: number
  description: string
  status: 'Active' | 'Archived'
}

const EMPTY_FORM: FormState = {
  code: '', name: '', alias: '', levelOrder: 9,
  minPassingScore: 60, headCoordinator: '', maxCapacity: 140,
  description: '', status: 'Active',
}

export default function GradeLevels() {
  const { showToast } = useToast()
  const [levels, setLevels] = useState<GradeLevelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('All')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<GradeLevelRecord | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<GradeLevelRecord | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const records = await gradeLevelService.list()
      setLevels(Array.isArray(records) ? records : [])
    } catch {
      showToast('Failed to load grade levels', 'error')
      setLevels([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setForm({ ...EMPTY_FORM })
    setEditingLevel(null)
  }

  const handleOpenCreate = () => { resetForm(); setModalOpen(true) }

  const handleOpenEdit = (level: GradeLevelRecord) => {
    setEditingLevel(level)
    setForm({
      code: level.code,
      name: level.name,
      alias: level.alias ?? '',
      levelOrder: level.levelOrder,
      minPassingScore: level.minPassingScore,
      headCoordinator: level.headCoordinator ?? '',
      maxCapacity: level.maxCapacity,
      description: level.description ?? '',
      status: level.status,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim() || !form.name.trim()) {
      showToast('Code and name are required', 'error'); return
    }
    setSaving(true)
    try {
      const payload: GradeLevelPayload = {
        code: form.code.trim(),
        name: form.name.trim(),
        alias: form.alias.trim() || undefined,
        levelOrder: form.levelOrder,
        minPassingScore: form.minPassingScore,
        headCoordinator: form.headCoordinator.trim() || undefined,
        maxCapacity: form.maxCapacity,
        description: form.description.trim() || undefined,
        status: form.status,
      }
      if (editingLevel) {
        await gradeLevelService.update(editingLevel.id, payload)
        showToast(`"${payload.name}" updated`, 'success')
      } else {
        await gradeLevelService.create(payload)
        showToast(`"${payload.name}" created`, 'success')
      }
      setModalOpen(false)
      resetForm()
      await load()
    } catch {
      showToast('Failed to save grade level', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteCandidate) return
    try {
      await gradeLevelService.delete(deleteCandidate.id)
      setLevels((prev) => prev.filter((l) => l.id !== deleteCandidate.id))
      showToast('Grade level deleted', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete'
      showToast(msg, 'error')
    } finally {
      setDeleteCandidate(null)
    }
  }

  const filtered = levels.filter((g) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      g.name.toLowerCase().includes(q) ||
      (g.alias ?? '').toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      (g.headCoordinator ?? '').toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const kpiCards: StatCard[] = [
    { id: 'levels',   label: 'Grade Levels',   value: String(levels.length),                                                delta: '-', deltaDirection: 'neutral', deltaLabel: 'configured',  icon: 'GraduationCap', tint: 'blue' },
    { id: 'active',   label: 'Active',         value: String(levels.filter((l) => l.status === 'Active').length),            delta: '-', deltaDirection: 'neutral', deltaLabel: 'in use',      icon: 'CheckCircle2',  tint: 'green' },
    { id: 'capacity', label: 'Total Capacity', value: levels.reduce((s, l) => s + (l.maxCapacity ?? 0), 0).toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'seats',       icon: 'Users',         tint: 'violet' },
    { id: 'archived', label: 'Archived',       value: String(levels.filter((l) => l.status === 'Archived').length),          delta: '-', deltaDirection: 'neutral', deltaLabel: 'inactive',    icon: 'AlertCircle',   tint: 'amber' },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Grade / Level Management"
          subtitle="Academic tiers, promotion order, and passing thresholds."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl theme-button-primary text-xs font-semibold shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Grade Level</span>
        </button>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-sm p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search grade level, coordinator, alias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl text-fg placeholder:text-fg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-fg-muted">Status:</span>
          {(['All', 'Active', 'Archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-sunken'
                  : 'text-fg-muted hover:text-fg shadow-sunken'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading grade levels...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <GraduationCap className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-sm font-semibold text-fg">
            {levels.length === 0 ? 'No grade levels yet' : 'No matches'}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            {levels.length === 0
              ? 'Add the first grade level to get started.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((level) => (
            <div
              key={level.id}
              className="p-5 rounded-2xl glass-sm hover:shadow-(--glass-strong-shadow) transition-shadow duration-300 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold text-fg-muted shadow-sunken">
                      {level.code}
                    </span>
                    <h3 className="text-lg font-bold text-fg">{level.name}</h3>
                    {level.alias && (
                      <span className="text-xs font-medium text-fg-muted">({level.alias})</span>
                    )}
                  </div>
                  {level.description && (
                    <p className="text-xs text-fg-muted mt-1 line-clamp-2">{level.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      level.status === 'Active'
                        ? 'bg-success/15 text-success'
                        : 'text-fg-muted shadow-sunken'
                    }`}
                  >
                    {level.status}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(level)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition cursor-pointer"
                    title="Edit"
                    aria-label={`Edit ${level.name}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(level)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
                    title="Delete"
                    aria-label={`Delete ${level.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl shadow-sunken text-center">
                <div>
                  <span className="text-[11px] text-fg-muted block">Level Order</span>
                  <span className="text-sm font-bold text-fg">{level.levelOrder}</span>
                </div>
                <div>
                  <span className="text-[11px] text-fg-muted block">Pass Threshold</span>
                  <span className="text-sm font-bold text-fg">{level.minPassingScore}%</span>
                </div>
                <div>
                  <span className="text-[11px] text-fg-muted block">Max Capacity</span>
                  <span className="text-sm font-bold text-fg">{level.maxCapacity}</span>
                </div>
              </div>

              <div className={`pt-2 ${SEAM_T} flex items-center justify-between text-xs text-fg-muted`}>
                <span>
                  Head Coordinator:{' '}
                  <strong className="text-fg">{level.headCoordinator || '—'}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) { setModalOpen(false); resetForm() } }}
        >
          <div className="rounded-3xl max-w-lg w-full glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className={`flex items-center justify-between pb-3 ${SEAM_B}`}>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-fg">
                  {editingLevel ? 'Edit Grade / Level' : 'Create Grade / Level'}
                </h3>
              </div>
              <button
                onClick={() => { setModalOpen(false); resetForm() }}
                aria-label="Close"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Code *</label>
                  <input type="text" required placeholder="G-10"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Level order *</label>
                  <input type="number" required min={1} max={12}
                    value={form.levelOrder}
                    onChange={(e) => setForm({ ...form, levelOrder: Number(e.target.value) })}
                    className={inputBase} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Name *</label>
                  <input type="text" required placeholder="Grade 10"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Alias</label>
                  <input type="text" placeholder="Sophomore"
                    value={form.alias}
                    onChange={(e) => setForm({ ...form, alias: e.target.value })}
                    className={inputBase} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Pass threshold (%)</label>
                  <input type="number" min={0} max={100}
                    value={form.minPassingScore}
                    onChange={(e) => setForm({ ...form, minPassingScore: Number(e.target.value) })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Max capacity</label>
                  <input type="number" min={1} max={2000}
                    value={form.maxCapacity}
                    onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })}
                    className={inputBase} />
                </div>
              </div>

              <div>
                <label className={labelBase}>Head coordinator</label>
                <input type="text"
                  value={form.headCoordinator}
                  onChange={(e) => setForm({ ...form, headCoordinator: e.target.value })}
                  placeholder="e.g. Dr. Jane Doe"
                  className={inputBase} />
              </div>

              <div>
                <label className={labelBase}>Description</label>
                <textarea rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Curriculum focus, required subjects, tracks..."
                  className={`${inputBase} resize-none`} />
              </div>

              <div>
                <label className={labelBase}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'Active' | 'Archived' })}
                  className={`${inputBase} cursor-pointer`}
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className={`pt-3 ${SEAM_T} flex justify-end gap-2.5`}>
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); resetForm() }}
                  className="glass-sm glass-interactive px-4 py-2 rounded-xl text-sm font-medium text-fg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-medium theme-button-primary disabled:opacity-50 cursor-pointer"
                >
                  {editingLevel ? 'Save' : 'Create'}
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
          <div className="rounded-3xl max-w-md w-full glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-full bg-error/15 text-error shadow-sunken">
                <AlertCircle className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-bold text-fg">Delete Grade Level?</h4>
                <p className="text-xs text-fg-muted mt-0.5">
                  Remove <strong>{deleteCandidate.name}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-fg-muted p-3 rounded-xl shadow-sunken">
              The backend will reject this if any classes or students reference
              this grade level.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="glass-sm glass-interactive px-4 py-2 text-sm font-medium text-fg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-error hover:opacity-90 rounded-xl transition cursor-pointer"
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