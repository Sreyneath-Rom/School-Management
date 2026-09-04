// src/features/setup/roles/CreateRoleModal.tsx
import React, { useState } from 'react'
import { X, ShieldPlus, Sparkles, Check } from 'lucide-react'
import Button from '@/components/common/Button'
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
      label: (label.trim() || name.trim()),
      permissionIds,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[30px] glass-strong p-6 sm:p-7 shadow-2xl border border-text-main/15">
        <div className="flex items-center justify-between pb-4 border-b border-text-main/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <ShieldPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">Create Custom Role</h2>
              <p className="text-xs text-text-main/55">Define new permission levels for school staff</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {error && (
            <div className="rounded-2xl bg-error/10 border border-error/20 p-3 text-xs text-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-2">
              Role Display Name *
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
              className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-2">
              Short Description / Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Lead Officer for Midterm & Final Exams"
              className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-brand-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-text-main/60">
                Quick Preset Template (Optional)
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
                        ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-300'
                        : 'bg-text-main/5 border-text-main/10 hover:border-text-main/20 text-text-main'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold">{tmpl.name}</p>
                      {isSelected && <Check size={14} className="text-brand-500" />}
                    </div>
                    <p className="mt-1 text-[11px] text-text-main/60 line-clamp-2">{tmpl.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-text-main/10 flex items-center justify-end gap-3">
            <Button variant="glass" type="button" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button variant="solid" type="submit" disabled={isCreating || !name.trim()}>
              {isCreating ? 'Creating...' : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
