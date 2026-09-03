// src/features/setup/roles/index.tsx
import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { RoleStats } from './RoleStats'
import { RoleCardList } from './RoleCardList'
import { RoleMatrixTable } from './RoleMatrixTable'
import { CreateRoleModal } from './CreateRoleModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { roleService } from '@/services/roleService'
import type { RoleDef, PermissionDef } from '@/types/roles'
import { useNotification } from '@/hooks/useNotification'
import { ApiError } from '@/lib/apiClient'

export default function RolesFeature() {
  const [roles, setRoles] = useState<RoleDef[]>([])
  const [catalog, setCatalog] = useState<PermissionDef[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [draftPermissionIds, setDraftPermissionIds] = useState<string[]>([])
  const [savedPermissionIds, setSavedPermissionIds] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreatingRole, setIsCreatingRole] = useState(false)

  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeletingRole, setIsDeletingRole] = useState(false)

  const { success, error: notifyError } = useNotification()

  const loadData = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const [fetchedRoles, fetchedCatalog] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissionCatalog(),
      ])
      const safeRoles = Array.isArray(fetchedRoles) ? fetchedRoles : []
      const safeCatalog = Array.isArray(fetchedCatalog) ? fetchedCatalog : []
      setRoles(safeRoles)
      setCatalog(safeCatalog)

      if (safeRoles.length > 0) {
        const initialRole =
          safeRoles.find((r) => r.id === selectedRoleId) || safeRoles[0]
        setSelectedRoleId(initialRole.id)
        setDraftPermissionIds(initialRole.permissionIds || [])
        setSavedPermissionIds(initialRole.permissionIds || [])
      }
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to fetch roles & permissions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || null

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId)
    const r = roles.find((item) => item.id === roleId)
    if (r) {
      setDraftPermissionIds(r.permissionIds || [])
      setSavedPermissionIds(r.permissionIds || [])
    }
  }

  const handleTogglePermission = (permissionId: string) => {
    setDraftPermissionIds((prev: string[]) => {
      const list = Array.isArray(prev) ? prev : []
      return list.includes(permissionId)
        ? list.filter((id: string) => id !== permissionId)
        : [...list, permissionId]
    })
  }

  const handleToggleModuleAll = (moduleId: string) => {
    const safeCatalog = Array.isArray(catalog) ? catalog : []
    const modulePermIds = safeCatalog
      .filter((p) => p && p.moduleId === moduleId)
      .map((p) => p.id)

    const safeDraft = Array.isArray(draftPermissionIds) ? draftPermissionIds : []
    const isAllSelected = modulePermIds.length > 0 && modulePermIds.every((id) => safeDraft.includes(id))

    if (isAllSelected) {
      setDraftPermissionIds((prev: string[]) =>
        (Array.isArray(prev) ? prev : []).filter((id: string) => !modulePermIds.includes(id))
      )
    } else {
      setDraftPermissionIds((prev: string[]) =>
        Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...modulePermIds]))
      )
    }
  }

  const handleReset = () => {
    setDraftPermissionIds(savedPermissionIds)
  }

  const handleSaveMatrix = async () => {
    if (!selectedRole) return
    setIsSaving(true)
    try {
      const updatedRole = await roleService.updateRolePermissions(selectedRole.id, {
        permissionIds: draftPermissionIds,
      })
      setRoles((prev: RoleDef[]) =>
        prev.map((r: RoleDef) => (r.id === updatedRole.id ? updatedRole : r))
      )
      setSavedPermissionIds(updatedRole.permissionIds || [])
      success(`Updated permissions for ${updatedRole.name}`)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to save role permissions')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateRole = async (data: {
    name: string
    label: string
    permissionIds: string[]
  }) => {
    setIsCreatingRole(true)
    try {
      const created = await roleService.createRole({
        name: data.name,
        label: data.label,
      })
      if (data.permissionIds.length > 0) {
        await roleService.updateRolePermissions(created.id, {
          permissionIds: data.permissionIds,
        })
        created.permissionIds = data.permissionIds
      }
      setRoles((prev: RoleDef[]) => [...prev, created])
      setSelectedRoleId(created.id)
      setDraftPermissionIds(created.permissionIds || [])
      setSavedPermissionIds(created.permissionIds || [])
      setIsCreateModalOpen(false)
      success(`Created custom role "${created.name}"`)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to create role')
    } finally {
      setIsCreatingRole(false)
    }
  }

  const handleConfirmDeleteRole = async () => {
    if (!roleToDelete) return
    setIsDeletingRole(true)
    try {
      await roleService.deleteRole(roleToDelete.id)
      setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id))
      if (selectedRoleId === roleToDelete.id) {
        const remaining = roles.filter((r) => r.id !== roleToDelete.id)
        if (remaining.length > 0) {
          handleSelectRole(remaining[0].id)
        }
      }
      success(`Role "${roleToDelete.name}" deleted successfully`)
      setRoleToDelete(null)
    } catch (err) {
      notifyError(err instanceof ApiError ? err.message : 'Failed to delete role')
    } finally {
      setIsDeletingRole(false)
    }
  }

  const hasChanges =
    JSON.stringify([...draftPermissionIds].sort()) !==
    JSON.stringify([...savedPermissionIds].sort())

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading
          title="Roles & Capability Permissions"
          subtitle="Configure system user access tiers, role security policies, and granular operational permissions."
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="rounded-xl p-2 text-text-main/60 hover:bg-text-main/10 hover:text-text-main transition"
            title="Refresh roles"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <Button
            variant="solid"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Plus size={16} /> Create Role
          </Button>
        </div>
      </div>

      {/* Stats */}
      <RoleStats roles={roles} catalog={catalog} activeRole={selectedRole} />

      {/* Roles Cards */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-main">System Roles</h2>
          <span className="text-xs text-text-main/50">Select a role to inspect its permissions</span>
        </div>
        <RoleCardList
          roles={roles}
          selectedRoleId={selectedRoleId}
          onSelectRole={handleSelectRole}
          onDeleteRole={(id, name) => setRoleToDelete({ id, name })}
        />
      </div>

      {/* Permissions Matrix */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
          <p className="text-sm font-medium text-text-main/60">Loading permission catalog...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-[24px] bg-error/10 border border-error/20 p-6 text-center text-error">
          <p className="font-bold mb-1">Failed to load permissions</p>
          <p className="text-xs">{loadError}</p>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-main">
              Capability Matrix: {selectedRole?.name || 'Role'}
            </h2>
            <span className="text-xs text-text-main/50 font-mono">
              {draftPermissionIds.length} of {catalog.length} nodes granted
            </span>
          </div>
          <RoleMatrixTable
            roles={roles}
            selectedRole={selectedRole}
            catalog={catalog}
            draftPermissionIds={draftPermissionIds}
            isSaving={isSaving}
            hasChanges={hasChanges}
            onTogglePermission={handleTogglePermission}
            onToggleModuleAll={handleToggleModuleAll}
            onSave={handleSaveMatrix}
            onReset={handleReset}
          />
        </div>
      )}

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        isCreating={isCreatingRole}
        catalog={catalog}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRole}
      />

      {/* Delete Role Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(roleToDelete)}
        title="Delete Custom Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name}"? Users assigned to this role must be reassigned.`}
        onConfirm={handleConfirmDeleteRole}
        onCancel={() => setRoleToDelete(null)}
        isDeleting={isDeletingRole}
      />
    </div>
  )
}
