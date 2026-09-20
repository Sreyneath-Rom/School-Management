// src/pages/Setup/GradeLevels.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  GraduationCap,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  gradeLevelService,
  type GradeLevelRecord,
  type GradeLevelPayload,
} from '@/services/gradeLevelService'

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
  code: '',
  name: '',
  alias: '',
  levelOrder: 9,
  minPassingScore: 60,
  headCoordinator: '',
  maxCapacity: 140,
  description: '',
  status: 'Active',
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

  useEffect(() => {
    load()
  }, [load])

  const resetForm = () => {
    setForm({ ...EMPTY_FORM })
    setEditingLevel(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setModalOpen(true)
  }

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
      showToast('Code and name are required', 'error')
      return
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
      // The backend refuses delete when classes reference the level.
      // Surface whatever message it returns.
      const msg =
        err instanceof Error ? err.message : 'Failed to delete'
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
    { id: 'levels', label: 'Grade Levels', value: String(levels.length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'configured', icon: 'GraduationCap', tint: 'blue' },
    { id: 'active', label: 'Active', value: String(levels.filter((l) => l.status === 'Active').length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'in use', icon: 'CheckCircle2', tint: 'green' },
    { id: 'capacity', label: 'Total Capacity', value: levels.reduce((s, l) => s + (l.maxCapacity ?? 0), 0).toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'seats', icon: 'Users', tint: 'violet' },
    { id: 'archived', label: 'Archived', value: String(levels.filter((l) => l.status === 'Archived').length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'inactive', icon: 'AlertCircle', tint: 'amber' },
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition shrink-0"
        >
          <Plus size={16} />
          <span>Add Grade Level</span>
        </button>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-4 rounded-2xl border border-surface">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search grade level, coordinator, alias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-secondary">Status:</span>
          {(['All', 'Active', 'Archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-strong text-secondary hover:bg-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-secondary text-sm rounded-2xl glass-sm border border-surface">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading grade levels...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm border border-surface">
          <GraduationCap className="mx-auto mb-3 h-10 w-10 text-secondary" />
          <p className="text-sm font-semibold text-color">
            {levels.length === 0 ? 'No grade levels yet' : 'No matches'}
          </p>
          <p className="text-xs text-secondary mt-1">
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
              className="p-5 rounded-2xl border border-surface bg-surface shadow-sm hover:border-brand-500/40 transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-surface-strong text-secondary">
                      {level.code}
                    </span>
                    <h3 className="text-lg font-bold text-color">
                      {level.name}
                    </h3>
                    {level.alias && (
                      <span className="text-xs font-medium text-secondary">
                        ({level.alias})
                      </span>
                    )}
                  </div>
                  {level.description && (
                    <p className="text-xs text-secondary mt-1 line-clamp-2">
                      {level.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      level.status === 'Active'
                        ? 'bg-success/15 text-success'
                        : 'bg-surface-strong text-secondary'
                    }`}
                  >
                    {level.status}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(level)}
                    className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-surface-strong transition"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(level)}
                    className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error/10 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-surface-strong border border-surface text-center">
                <div>
                  <span className="text-[11px] text-secondary block">Level Order</span>
                  <span className="text-sm font-bold text-color">
                    {level.levelOrder}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-secondary block">Pass Threshold</span>
                  <span className="text-sm font-bold text-color">
                    {level.minPassingScore}%
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-secondary block">Max Capacity</span>
                  <span className="text-sm font-bold text-color">
                    {level.maxCapacity}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface flex items-center justify-between text-xs text-secondary">
                <span>
                  Head Coordinator:{' '}
                  <strong className="text-color">
                    {level.headCoordinator || '—'}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-surface space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-color">
                  {editingLevel ? 'Edit Grade / Level' : 'Create Grade / Level'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false)
                  resetForm()
                }}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="G-10"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Level order *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={12}
                    value={form.levelOrder}
                    onChange={(e) =>
                      setForm({ ...form, levelOrder: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Grade 10"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Alias
                  </label>
                  <input
                    type="text"
                    placeholder="Sophomore"
                    value={form.alias}
                    onChange={(e) => setForm({ ...form, alias: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Pass threshold (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.minPassingScore}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        minPassingScore: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Max capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={2000}
                    value={form.maxCapacity}
                    onChange={(e) =>
                      setForm({ ...form, maxCapacity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Head coordinator
                </label>
                <input
                  type="text"
                  value={form.headCoordinator}
                  onChange={(e) =>
                    setForm({ ...form, headCoordinator: e.target.value })
                  }
                  placeholder="e.g. Dr. Jane Doe"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
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
                  placeholder="Curriculum focus, required subjects, tracks..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                />
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
                      status: e.target.value as 'Active' | 'Archived',
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-surface bg-surface text-color focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="pt-3 border-t border-surface flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-sm font-medium text-secondary hover:bg-surface-strong rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 shadow-2xl border border-surface space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-full bg-error/10 text-error">
                <AlertCircle className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-bold text-color">Delete Grade Level?</h4>
                <p className="text-xs text-secondary mt-0.5">
                  Remove <strong>{deleteCandidate.name}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-secondary bg-surface-strong p-3 rounded-xl border border-surface">
              The backend will reject this if any classes or students reference
              this grade level.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-sm font-medium text-secondary hover:bg-surface-strong rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-error hover:opacity-90 rounded-xl transition"
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