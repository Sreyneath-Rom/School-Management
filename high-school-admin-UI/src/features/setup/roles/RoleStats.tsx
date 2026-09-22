// src/features/setup/roles/RoleStats.tsx
import React from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import type { RoleDef, PermissionDef } from '@/types/roles'

interface RoleStatsProps {
  roles?: RoleDef[]
  catalog?: PermissionDef[]
  activeRole: RoleDef | null
}

export const RoleStats: React.FC<RoleStatsProps> = ({ roles = [], catalog = [], activeRole }) => {
  const safeRoles = Array.isArray(roles) ? roles : []
  const systemRolesCount = safeRoles.filter((r) => r && r.isSystem).length
  const customRolesCount = safeRoles.filter((r) => r && !r.isSystem).length
  const activePermsCount =
    activeRole && Array.isArray(activeRole.permissionIds) ? activeRole.permissionIds.length : 0

  const cards: StatCard[] = [
    { id: 'defined-roles',    label: 'Defined Roles',    value: safeRoles.length.toString(),       delta: '-',                       deltaDirection: 'neutral', deltaLabel: 'active',    icon: 'Shield',      tint: 'blue' },
    { id: 'system-roles',     label: 'System Roles',     value: systemRolesCount.toString(),       delta: '-',                       deltaDirection: 'neutral', deltaLabel: 'protected', icon: 'ShieldCheck', tint: 'green' },
    { id: 'custom-roles',     label: 'Custom Roles',     value: customRolesCount.toString(),       delta: '-',                       deltaDirection: 'neutral', deltaLabel: 'custom',    icon: 'UserCheck',   tint: 'violet' },
    { id: 'permission-nodes', label: 'Permission Nodes', value: catalog.length.toString(),         delta: activePermsCount.toString(), deltaDirection: 'neutral', deltaLabel: 'active',    icon: 'Key',         tint: 'amber' },
  ]

  return <StatsGrid cards={cards} columns={4} />
}