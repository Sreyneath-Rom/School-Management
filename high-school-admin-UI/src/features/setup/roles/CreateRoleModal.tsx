import React, { useState } from 'react'
import { X, ShieldPlus, Sparkles, Check } from 'lucide-react'
import type { PermissionDef } from '@/types/roles'

interface CreateRoleModalProps {
  isOpen: boolean
  isCreating: boolean
  catalog: PermissionDef[]
  onClose: () => void
  onCreate: (roleData: { name: string; label: string; permissionIds: string[] }) => void
}

const PRESET_TEMPLATES = [
  {
    name: 'Department Head',
    desc: 'Full management of subjects, teacher allocations, and class grades with read-only dashboard access.',
    modules: ['dashboard', 'subjects', 'classes', 'grades', 'schedules'],
    actions: ['view', 'create', 'edit'],
  },
  {
    name: 'Academic Counselor',
    desc: 'Access to student files, attendance history, leave requests, and student reports.',
    modules: ['dashboard', 'users', 'attendance', 'reports'],
    actions: ['view', 'edit'],
  },
  {
    name: 'Lab Coordinator',
    desc: 'Schedule and subject access for STEM laboratories and resource timetables.',
    modules: ['subjects', 'schedules'],
    actions: ['view', 'edit'],
  },
  {
    name: 'Audit Officer',
    desc: 'Read-only audit access across all operational modules.',
    modules: ['dashboard', 'users', 'classes', 'subjects', 'schedules', 'attendance', 'grades', 'reports'],
    actions: ['view'],
  },
]

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  isCreating,
  catalog,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleApplyTemplate = (idx: number) => {
    setSelectedTemplate(idx)
    const t = PRESET_TEMPLATES[idx]
    if (!name) setName(t.name)
    if (!label) setLabel(t.name)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Role name is required')
      return
    }

    let permissionIds: string[] = []
    if (selectedTemplate !== null) {
      const t = PRESET_TEMPLATES[selectedTemplate]
      const safeCatalog = Array.isArray(catalog) ? catalog : []
      permissionIds = safeCatalog
        .filter((p) => p && t.modules.includes(p.moduleId) && t.actions.includes(p.action))
        .map((p) => p.id)
    }

    onCreate({
      name: name.trim(),
      label: label.trim() || name.trim(),
      permissionIds,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800/80 dark:bg-slate-900/95"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-400/25 via-blue-400/15 to-transparent blur-3xl opacity-70" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25">
              <ShieldPlus size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Create Custom Role
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Define administrative permission tiers for faculty & staff
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-4">
          {error && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Role Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="e.g. Examination Officer"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Short Description / Responsibilities
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Lead Officer for Midterm & Final Examinations"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Preset Permission Template (Optional)
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto pr-1">
              {PRESET_TEMPLATES.map((tmpl, idx) => {
                const isSelected = selectedTemplate === idx
                return (
                  <div
                    key={tmpl.name}
                    onClick={() => handleApplyTemplate(idx)}
                    className={`rounded-2xl p-3 text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold">{tmpl.name}</p>
                      {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                      {tmpl.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-blue-700 transition cursor-pointer disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
