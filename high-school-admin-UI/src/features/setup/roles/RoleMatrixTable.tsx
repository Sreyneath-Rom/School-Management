// src/features/setup/roles/RoleMatrixTable.tsx
import React, { useState, useMemo } from 'react'
import { Square, Search, Save, RotateCcw, Check, Lock } from 'lucide-react'
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
  selectedRole, catalog, draftPermissionIds,
  isSaving, hasChanges,
  onTogglePermission, onToggleModuleAll, onSave, onReset,
}) => {
  const [search, setSearch] = useState('')
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all')

  const safeCatalog = Array.isArray(catalog) ? catalog : []
  const safeDraftPerms = Array.isArray(draftPermissionIds) ? draftPermissionIds : []

  const filteredModules = useMemo(() => {
    return (MODULES || []).filter((m) => {
      const matchesFilter = selectedModuleFilter === 'all' || m.id === selectedModuleFilter
      const matchesSearch =
        !search.trim() ||
        m.label.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [search, selectedModuleFilter])

  const getPermission = (moduleId: string, action: PermissionAction) => {
    return safeCatalog.find((p) => p && p.moduleId === moduleId && p.action === action)
  }

  if (!selectedRole) {
    // Empty-state card: `.glass-sm` raised surface, no border.
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-fg-muted">
        <p className="font-semibold text-fg">Select a role above</p>
        <p className="text-xs">Click on any role card to view and manage its capability matrix.</p>
      </div>
    )
  }

  const isSuperAdmin = selectedRole.id === 'super-admin'

  return (
    <div className="space-y-4">
      {/* Toolbar — raised neumorphic surface, no border */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl glass-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 sm:min-w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
            {/* Input inherits the sunken-well look from globals.css */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search module permissions..."
              className="w-full rounded-full py-2 pl-9 pr-3 text-xs sm:text-sm text-fg outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-fg-muted">Module:</span>
            {/* The `<select>` also inherits the sunken-well look.
                Its `<option>`s are natively painted by the OS. */}
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="rounded-full px-3 py-1.5 text-xs text-fg outline-none focus:ring-2 focus:ring-brand-500 capitalize"
            >
              <option value="all">All Modules</option>
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs font-semibold text-warning mr-1 animate-pulse">
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

      {/* Matrix table — raised surface, shadow seams for header and rows */}
      <div className="overflow-hidden rounded-[26px] glass-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-bold uppercase tracking-wider text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <tr>
                <th className="px-6 py-4">Module Area</th>
                {PERMISSION_ACTIONS.map((act) => (
                  <th key={act} className="px-4 py-4 text-center capitalize w-28">{act}</th>
                ))}
                <th className="px-6 py-4 text-right w-36">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--neu-shadow-dark)">
              {filteredModules.map((mod) => {
                const modulePerms = safeCatalog.filter((p) => p && p.moduleId === mod.id)
                const isAllGranted =
                  modulePerms.length > 0 &&
                  modulePerms.every((p) => safeDraftPerms.includes(p.id))

                return (
                  <tr key={mod.id} className="hover:shadow-sunken transition-shadow">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/15 font-bold text-xs text-brand-600 dark:text-brand-300 shadow-sunken">
                          {mod.initial}
                        </span>
                        <div>
                          <p className="font-bold text-fg text-sm">{mod.label}</p>
                          <p className="text-xs text-fg-muted font-mono">module: {mod.id}</p>
                        </div>
                      </div>
                    </td>

                    {PERMISSION_ACTIONS.map((action) => {
                      const perm = getPermission(mod.id, action)
                      if (!perm) {
                        return (
                          <td key={action} className="px-4 py-4 text-center text-fg-muted/40 text-xs">
                            —
                          </td>
                        )
                      }

                      const isGranted = draftPermissionIds.includes(perm.id)

                      return (
                        <td key={action} className="px-4 py-4 text-center align-middle">
                          {/* Grant/revoke toggle: sunken well when
                              unpressed, brand-filled when granted. Both
                              read as physical states under neumorphism. */}
                          <button
                            type="button"
                            disabled={isSuperAdmin}
                            onClick={() => onTogglePermission(perm.id)}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-xl transition ${
                              isGranted
                                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                                : 'text-fg-muted/50 shadow-sunken hover:text-fg-muted'
                            } ${isSuperAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-fg-muted hover:text-fg shadow-sunken transition cursor-pointer"
                        >
                          {isAllGranted ? 'Revoke All' : 'Grant All'}
                        </button>
                      )}
                      {isSuperAdmin && (
                        <span className="flex items-center justify-end gap-1 text-xs text-fg-muted">
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