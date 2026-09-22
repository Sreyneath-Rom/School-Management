// src/features/setup/roles/CreateRoleModal.tsx
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
  { name: 'Department Head',    desc: 'Full management of subjects, teacher allocations, and class grades with read-only dashboard access.', modules: ['dashboard', 'subjects', 'classes', 'grades', 'schedules'],                                                  actions: ['view', 'create', 'edit'] },
  { name: 'Academic Counselor', desc: 'Access to student files, attendance history, leave requests, and student reports.',                    modules: ['dashboard', 'users', 'attendance', 'reports'],                                                                                     actions: ['view', 'edit'] },
  { name: 'Lab Coordinator',    desc: 'Schedule and subject access for STEM laboratories and resource timetables.',                            modules: ['subjects', 'schedules'],                                                                                                            actions: ['view', 'edit'] },
  { name: 'Audit Officer',      desc: 'Read-only audit access across all operational modules.',                                               modules: ['dashboard', 'users', 'classes', 'subjects', 'schedules', 'attendance', 'grades', 'reports'],                                       actions: ['view'] },
]

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen, isCreating, catalog, onClose, onCreate,
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
    if (!name.trim()) { setError('Role name is required'); return }

    let permissionIds: string[] = []
    if (selectedTemplate !== null) {
      const t = PRESET_TEMPLATES[selectedTemplate]
      const safeCatalog = Array.isArray(catalog) ? catalog : []
      permissionIds = safeCatalog
        .filter((p) => p && t.modules.includes(p.moduleId) && t.actions.includes(p.action))
        .map((p) => p.id)
    }

    onCreate({ name: name.trim(), label: label.trim() || name.trim(), permissionIds })
  }

  return (
    <div
      // Flat scrim — no backdrop-blur, that was a glassmorphism-era artifact.
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* `.glass-strong` supplies the elevated neumorphic surface + its
          shadow. The old `border-white/80 bg-white/95 backdrop-blur-2xl
          shadow-2xl` was the full glassmorphism stack — every piece of it
          now fights the flat, opaque surface treatment. */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] glass-strong animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Ambient tint blob kept — a colored accent on the flat surface */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-indigo-400/25 via-blue-400/15 to-transparent blur-3xl opacity-50" />

        {/* Header — shadow seam replaces the invisible border. The bg
            color was already the surface's own color (a no-op). */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4.5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25">
              <ShieldPlus size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-fg">
                Create Custom Role
              </h2>
              <p className="text-xs text-fg-muted mt-0.5">
                Define administrative permission tiers for faculty & staff
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition hover:text-fg hover:shadow-sunken cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-4">
          {/* Semantic error — tinted bg + tinted border is a signal, keep both */}
          {error && (
            <div className="rounded-2xl border border-error/25 bg-error/10 p-3 text-xs font-semibold text-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-fg mb-1.5">
              Role Display Name <span className="text-error">*</span>
            </label>
            {/* The sunken-well styling comes from globals.css.
                We only layer on padding + focus ring + type. */}
            <input
              type="text"
              required
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null) }}
              placeholder="e.g. Examination Officer"
              className="w-full rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fg mb-1.5">
              Short Description / Responsibilities
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Lead Officer for Midterm & Final Examinations"
              className="w-full rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
              <label className="text-xs font-bold text-fg">
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
                    className={`rounded-2xl p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'text-brand-700 dark:text-brand-300 font-bold shadow-sunken'
                        : 'text-fg-muted shadow-emboss hover:shadow-sunken'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-fg">{tmpl.name}</p>
                      {isSelected && <Check size={14} className="text-brand-600 dark:text-brand-400" />}
                    </div>
                    <p className="mt-1 text-[11px] text-fg-muted line-clamp-2 leading-snug">
                      {tmpl.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="glass-sm glass-interactive rounded-2xl px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-blue-700 transition cursor-pointer disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}