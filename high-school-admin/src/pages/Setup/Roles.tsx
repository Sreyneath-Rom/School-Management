import { useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import { MODULES, roleService } from '@/services/roleService'
import { PERMISSION_ACTIONS } from '@/types/roles'
import type { PermissionAction, PermissionDef, RoleDef } from '@/types/roles'
import { ApiError } from '@/lib/apiClient'

const columns: { label: string; action: PermissionAction }[] = [
  { label: 'View', action: 'view' },
  { label: 'Create', action: 'create' },
  { label: 'Edit', action: 'edit' },
  { label: 'Delete', action: 'delete' },
]

// permissionKey("users", "edit") => "users.edit" — must match how the
// backend derives Permission.key when seeding the permission catalog.
function permissionKey(moduleId: string, action: PermissionAction) {
  return `${moduleId}.${action}`
}

// Builds a lookup: "users.edit" -> permissionId, from the catalog fetched from the API.
function buildPermissionIdLookup(catalog: PermissionDef[]): Record<string, string> {
  const lookup: Record<string, string> = {}
  catalog.forEach((p) => {
    lookup[permissionKey(p.moduleId, p.action)] = p.id
  })
  return lookup
}

// Converts a role's flat permissionIds[] into the boolean matrix the table renders,
// using the catalog to know which permissionId corresponds to which cell.
function permissionIdsToMatrix(
  permissionIds: string[],
  catalog: PermissionDef[]
): Record<string, boolean[]> {
  const granted = new Set(permissionIds)
  const matrix: Record<string, boolean[]> = {}
  MODULES.forEach((m) => {
    matrix[m.id] = columns.map((col) => {
      const permission = catalog.find((p) => p.moduleId === m.id && p.action === col.action)
      return permission ? granted.has(permission.id) : false
    })
  })
  return matrix
}

// Converts the boolean matrix back into a permissionIds[] for saving.
function matrixToPermissionIds(
  matrix: Record<string, boolean[]>,
  catalog: PermissionDef[]
): string[] {
  const idLookup = buildPermissionIdLookup(catalog)
  const ids: string[] = []
  MODULES.forEach((m) => {
    columns.forEach((col, colIndex) => {
      if (matrix[m.id]?.[colIndex]) {
        const id = idLookup[permissionKey(m.id, col.action)]
        if (id) ids.push(id)
      }
    })
  })
  return ids
}

export default function Roles() {
  const [roles, setRoles] = useState<RoleDef[]>([])
  const [catalog, setCatalog] = useState<PermissionDef[]>([])
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null)
  const [matrix, setMatrix] = useState<Record<string, boolean[]>>({})

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [dirtyCount, setDirtyCount] = useState(0)

  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')

  const activeRole = useMemo(
    () => roles.find((r) => r.id === activeRoleId) ?? null,
    [roles, activeRoleId]
  )

  // Initial load: permission catalog + roles.
  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const [fetchedCatalog, fetchedRoles] = await Promise.all([
          roleService.getPermissionCatalog(),
          roleService.getRoles(),
        ])
        if (cancelled) return

        setCatalog(fetchedCatalog)
        setRoles(fetchedRoles)

        const firstRoleId = fetchedRoles[0]?.id ?? null
        setActiveRoleId(firstRoleId)
        if (firstRoleId) {
          const role = fetchedRoles.find((r) => r.id === firstRoleId)
          if (role) setMatrix(permissionIdsToMatrix(role.permissionIds, fetchedCatalog))
        }
      } catch (err) {
        if (cancelled) return
        setLoadError(
          err instanceof ApiError ? err.message : 'Failed to load roles and permissions.'
        )
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Rebuild the matrix whenever the selected role changes.
  const handleSelectRole = (roleId: string) => {
    setActiveRoleId(roleId)
    setDirtyCount(0)
    setSaveError(null)
    const role = roles.find((r) => r.id === roleId)
    if (role) setMatrix(permissionIdsToMatrix(role.permissionIds, catalog))
  }

  const togglePermission = (moduleId: string, colIndex: number) => {
    setMatrix((prev) => {
      const rowPerms = [...(prev[moduleId] ?? columns.map(() => false))]
      rowPerms[colIndex] = !rowPerms[colIndex]
      return { ...prev, [moduleId]: rowPerms }
    })
    setDirtyCount((c) => c + 1)
    setSaveError(null)
  }

  const handleReset = () => {
    if (!activeRole) return
    setMatrix(permissionIdsToMatrix(activeRole.permissionIds, catalog))
    setDirtyCount(0)
    setSaveError(null)
  }

  const handleSave = async () => {
    if (!activeRole) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const permissionIds = matrixToPermissionIds(matrix, catalog)
      const updated = await roleService.updateRolePermissions(activeRole.id, { permissionIds })
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setDirtyCount(0)
      setSavedMessage('Changes saved successfully')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Failed to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateRole = async () => {
    const name = newRoleName.trim()
    if (!name) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-')
      const created = await roleService.createRole({ name: slug, label: name })
      setRoles((prev) => [...prev, created])
      setIsCreatingRole(false)
      setNewRoleName('')
      handleSelectRole(created.id)
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Failed to create role.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-stone-500 dark:text-stone-400">
        Loading roles and permissions…
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-5 py-4 text-sm font-medium text-rose-700 dark:text-rose-400">
        {loadError}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeading
          title="Permissions & Access Control"
          subtitle="Manage granular permissions for system roles and access levels."
        />
        <button
          onClick={handleSave}
          disabled={dirtyCount === 0 || isSaving || !activeRole}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">💾</span>
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {savedMessage && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-5 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {savedMessage}
        </div>
      )}

      {saveError && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 px-5 py-3 text-sm font-medium text-rose-700 dark:text-rose-400">
          {saveError}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="rounded-[28px] p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            Global Roles
          </div>
          <div className="mt-4 space-y-2">
            {roles.map((role) => {
              const isActive = activeRoleId === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-700 text-white shadow'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="text-xs font-semibold">{role.initial}</span>
                  {role.label}
                </button>
              )
            })}

            {isCreatingRole ? (
              <div className="mt-2 space-y-2 rounded-2xl border border-stone-200 dark:border-stone-700 p-3">
                <input
                  autoFocus
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateRole()}
                  placeholder="Role name"
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateRole}
                    disabled={!newRoleName.trim() || isSaving}
                    className="flex-1 rounded-xl bg-brand-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-800 disabled:opacity-50"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingRole(false)
                      setNewRoleName('')
                    }}
                    className="flex-1 rounded-xl border border-stone-200 dark:border-stone-700 px-3 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 transition hover:bg-stone-50 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingRole(true)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 px-4 py-3 text-sm font-semibold text-stone-500 dark:text-stone-400 transition hover:border-brand-400 hover:text-brand-600 dark:hover:border-brand-500 dark:hover:text-brand-400"
              >
                <span className="text-lg">+</span>
                Create New Role
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-x-auto rounded-[28px] glass-sm">
            <table className="min-w-160 w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    Module / Category
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.action}
                      className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {MODULES.map((module) => (
                  <tr key={module.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                          <span className="text-xs font-semibold">{module.initial}</span>
                        </div>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {module.label}
                        </span>
                      </div>
                    </td>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(module.id, colIndex)}
                          disabled={!activeRole}
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border transition disabled:opacity-40 ${
                            matrix[module.id]?.[colIndex]
                              ? 'border-brand-600 bg-brand-600 text-white'
                              : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-transparent'
                          }`}
                        >
                          {matrix[module.id]?.[colIndex] ? (
                            <span className="text-xs font-bold">✓</span>
                          ) : (
                            <span className="text-xs text-transparent">✓</span>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dirtyCount > 0 && (
            <div className="flex flex-col gap-4 rounded-[28px] glass-sm p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  i
                </span>
                Unsaved changes detected in {dirtyCount} permission{dirtyCount === 1 ? '' : 's'}.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  disabled={isSaving}
                  className="rounded-xl border border-rose-200 dark:border-rose-800 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-50"
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-50"
                >
                  {isSaving ? 'Applying…' : 'Apply Configuration'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}