import { useState } from 'react'
import PageHeading from '@/components/common/PageHeading'

const globalRoles = [
  { id: 'super-admin', label: 'Super Admin', initial: 'SA' },
  { id: 'teacher', label: 'Teacher', initial: 'T' },
  { id: 'student', label: 'Student', initial: 'S' },
  { id: 'mazer', label: 'Mazer', initial: 'M' },
]

const modules = [
  { id: 'dashboard', label: 'Dashboard', initial: 'DB' },
  { id: 'users', label: 'Users', initial: 'U' },
  { id: 'classes', label: 'Classes', initial: 'C' },
  { id: 'subjects', label: 'Subjects', initial: 'SB' },
  { id: 'schedules', label: 'Schedules', initial: 'SC' },
  { id: 'attendance', label: 'Attendance', initial: 'A' },
  { id: 'grades', label: 'Grades', initial: 'G' },
  { id: 'reports', label: 'Reports', initial: 'R' },
]

const columns = ['View', 'Create', 'Edit', 'Delete']

// Default permission matrix, per role, per module: [View, Create, Edit, Delete]
function buildDefaultPermissions(): Record<string, Record<string, boolean[]>> {
  const defaults: Record<string, Record<string, boolean[]>> = {}
  globalRoles.forEach((role) => {
    defaults[role.id] = {}
    modules.forEach((m) => {
      // Super Admin defaults to full access; other roles default to view-only.
      defaults[role.id][m.id] = role.id === 'super-admin'
        ? [true, true, true, true]
        : [true, false, false, false]
    })
  })
  return defaults
}

export default function Roles() {
  const [activeRole, setActiveRole] = useState('super-admin')
  const [defaultPermissions] = useState(buildDefaultPermissions)
  const [permissions, setPermissions] = useState(() => buildDefaultPermissions())
  const [dirtyCount, setDirtyCount] = useState(0)
  const [savedMessage, setSavedMessage] = useState('')

  const togglePermission = (moduleId: string, colIndex: number) => {
    setPermissions((prev) => {
      const rolePerms = { ...prev[activeRole] }
      rolePerms[moduleId] = [...rolePerms[moduleId]]
      rolePerms[moduleId][colIndex] = !rolePerms[moduleId][colIndex]
      return { ...prev, [activeRole]: rolePerms }
    })
    setDirtyCount((c) => c + 1)
  }

  const handleReset = () => {
    setPermissions((prev) => ({
      ...prev,
      [activeRole]: JSON.parse(JSON.stringify(defaultPermissions[activeRole])),
    }))
    setDirtyCount(0)
  }

  const handleSave = () => {
    // TODO: persist `permissions[activeRole]` to the backend here
    console.log(`Saving permissions for ${activeRole}:`, permissions[activeRole])
    setDirtyCount(0)
    setSavedMessage('Changes saved successfully')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const activeRolePermissions = permissions[activeRole]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeading
          title="Permissions & Access Control"
          subtitle="Manage granular permissions for system roles and access levels."
        />
        <button
          onClick={handleSave}
          disabled={dirtyCount === 0}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">💾</span>
          Save Changes
        </button>
      </div>

      {savedMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-medium text-emerald-700">
          {savedMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="rounded-[28px] p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Global Roles</div>
          <div className="mt-4 space-y-2">
            {globalRoles.map((role) => {
              const isActive = activeRole === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-700 text-white shadow' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs font-semibold">{role.initial}</span>
                  {role.label}
                </button>
              )
            })}
            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-sm font-semibold text-stone-500 transition hover:border-brand-400 hover:text-brand-600">
              <span className="text-lg">+</span>
              Create New Role
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-x-auto rounded-[28px] glass-sm">
            <table className="min-w-160 w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Module / Category
                  </th>
                  {columns.map((col) => (
                    <th key={col} className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {modules.map((module) => (
                  <tr key={module.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                          <span className="text-xs font-semibold">{module.initial}</span>
                        </div>
                        <span className="font-semibold text-stone-800">{module.label}</span>
                      </div>
                    </td>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(module.id, colIndex)}
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border transition ${
                            activeRolePermissions[module.id][colIndex]
                              ? 'border-brand-600 bg-brand-600 text-white'
                              : 'border-stone-300 bg-white text-transparent'
                          }`}
                        >
                          {activeRolePermissions[module.id][colIndex] ? (
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
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-700">i</span>
                Unsaved changes detected in {dirtyCount} permission{dirtyCount === 1 ? '' : 's'}.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  Apply Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}