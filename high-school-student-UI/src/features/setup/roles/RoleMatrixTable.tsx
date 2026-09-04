// src/features/setup/roles/RoleMatrixTable.tsx
import React, { useState, useMemo } from 'react'
import {
  Square,
  Search,
  Save,
  RotateCcw,
  Check,
  Lock,
} from 'lucide-react'
import Button from '@/components/common/Button'
import type { RoleDef, PermissionDef, PermissionAction } from '@/types/roles'
import { PERMISSION_ACTIONS } from '@/types/roles'
import { MODULES } from '@/services/roleService'

interface RoleMatrixTableProps {
  roles: RoleDef[]
  selectedRole: RoleDef | null
  catalog: PermissionDef[]
  draftPermissionIds: string[]
  isSaving: boolean
  hasChanges: boolean
  onTogglePermission: (permissionId: string) => void
  onToggleModuleAll: (moduleId: string) => void
  onSave: () => void
  onReset: () => void
}

export const RoleMatrixTable: React.FC<RoleMatrixTableProps> = ({
  selectedRole,
  catalog,
  draftPermissionIds,
  isSaving,
  hasChanges,
  onTogglePermission,
  onToggleModuleAll,
  onSave,
  onReset,
}) => {
  const [search, setSearch] = useState('')
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all')

  const safeCatalog = Array.isArray(catalog) ? catalog : []
  const safeDraftPerms = Array.isArray(draftPermissionIds) ? draftPermissionIds : []

  const filteredModules = useMemo(() => {
    return (MODULES || []).filter((m) => {
      const matchesFilter =
        selectedModuleFilter === 'all' || m.id === selectedModuleFilter
      const matchesSearch =
        !search.trim() ||
        m.label.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [search, selectedModuleFilter])

  // Helper to find a permission in catalog
  const getPermission = (moduleId: string, action: PermissionAction) => {
    return safeCatalog.find((p) => p && p.moduleId === moduleId && p.action === action)
  }

  if (!selectedRole) {
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-text-main/50 border border-text-main/10">
        <p className="font-semibold text-text-main">Select a role above</p>
        <p className="text-xs">Click on any role card to view and manage its capability matrix.</p>
      </div>
    )
  }

  const isSuperAdmin = selectedRole.id === 'super-admin'

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[24px] glass-sm p-4 border border-text-main/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 sm:min-w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-main/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search module permissions..."
              className="w-full rounded-full border border-text-main/15 bg-text-main/5 py-2 pl-9 pr-3 text-xs sm:text-sm text-text-main outline-none transition focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-main/50">Module:</span>
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="rounded-full border border-text-main/15 bg-text-main/5 px-3 py-1.5 text-xs text-text-main outline-none transition focus:border-brand-500 capitalize"
            >
              <option value="all" className="bg-slate-800 text-white">All Modules</option>
              {MODULES.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-800 text-white">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs font-semibold text-amber-500 mr-1 animate-pulse">
              Unsaved Changes
            </span>
          )}

          <Button
            variant="glass"
            size="sm"
            onClick={onReset}
            disabled={isSaving || !hasChanges}
            className="inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <RotateCcw size={14} /> Reset
          </Button>

          <Button
            variant="solid"
            size="sm"
            onClick={onSave}
            disabled={isSaving || isSuperAdmin || !hasChanges}
            className="inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <Save size={14} /> {isSaving ? 'Saving...' : 'Save Matrix'}
          </Button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-hidden rounded-[26px] glass-sm border border-text-main/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-text-main/5 border-b border-text-main/10 text-xs font-bold uppercase tracking-wider text-text-main/60">
              <tr>
                <th className="px-6 py-4">Module Area</th>
                {PERMISSION_ACTIONS.map((act) => (
                  <th key={act} className="px-4 py-4 text-center capitalize w-28">
                    {act}
                  </th>
                ))}
                <th className="px-6 py-4 text-right w-36">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-main/5">
              {filteredModules.map((mod) => {
                const modulePerms = safeCatalog.filter((p) => p && p.moduleId === mod.id)
                const isAllGranted =
                  modulePerms.length > 0 &&
                  modulePerms.every((p) => safeDraftPerms.includes(p.id))

                return (
                  <tr key={mod.id} className="hover:bg-text-main/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/15 font-bold text-xs text-brand-600 dark:text-brand-300">
                          {mod.initial}
                        </span>
                        <div>
                          <p className="font-bold text-text-main text-sm">{mod.label}</p>
                          <p className="text-xs text-text-main/40 font-mono">module: {mod.id}</p>
                        </div>
                      </div>
                    </td>

                    {PERMISSION_ACTIONS.map((action) => {
                      const perm = getPermission(mod.id, action)
                      if (!perm) {
                        return (
                          <td key={action} className="px-4 py-4 text-center text-text-main/20 text-xs">
                            —
                          </td>
                        )
                      }

                      const isGranted = draftPermissionIds.includes(perm.id)

                      return (
                        <td key={action} className="px-4 py-4 text-center align-middle">
                          <button
                            type="button"
                            disabled={isSuperAdmin}
                            onClick={() => onTogglePermission(perm.id)}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-xl transition cursor-pointer ${
                              isGranted
                                ? 'bg-brand-600 text-white shadow-xs'
                                : 'bg-text-main/10 text-text-main/20 hover:bg-text-main/15 hover:text-text-main/40'
                            } ${isSuperAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                            title={
                              isSuperAdmin
                                ? 'Super Admin permissions are fixed'
                                : isGranted
                                ? `Revoke ${action} on ${mod.label}`
                                : `Grant ${action} on ${mod.label}`
                            }
                          >
                            {isGranted ? <Check size={16} /> : <Square size={16} />}
                          </button>
                        </td>
                      )
                    })}

                    <td className="px-6 py-4 text-right">
                      {!isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => onToggleModuleAll(mod.id)}
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-text-main/10 text-text-main/70 hover:bg-text-main/15 hover:text-text-main transition cursor-pointer"
                        >
                          {isAllGranted ? 'Revoke All' : 'Grant All'}
                        </button>
                      )}
                      {isSuperAdmin && (
                        <span className="flex items-center justify-end gap-1 text-xs text-text-main/40">
                          <Lock size={12} /> Locked
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
