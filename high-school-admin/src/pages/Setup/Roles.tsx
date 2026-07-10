import { useState } from 'react'
// Icons removed to avoid type/export mismatches; using simple placeholders instead
import PageHeading from '../../components/common/PageHeading'

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

export default function Roles() {
  const [activeRole, setActiveRole] = useState('super-admin')
  const [permissions, setPermissions] = useState<Record<string, boolean[]>>(() => {
    const initial: Record<string, boolean[]> = {}
    modules.forEach((m) => {
      initial[m.id] = [true, true, true, true]
    })
    return initial
  })
  const [dirtyCount, setDirtyCount] = useState(4)

  const togglePermission = (moduleId: string, colIndex: number) => {
    setPermissions((prev) => {
      const next = { ...prev, [moduleId]: [...prev[moduleId]] }
      next[moduleId][colIndex] = !next[moduleId][colIndex]
      return next
    })
    setDirtyCount((c) => c + 1)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeading
          title="Permissions & Access Control"
          subtitle="Manage granular permissions for system roles and access levels."
        />
        <button className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800">
          <span className="text-lg">💾</span>
          Save Changes
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="rounded-[28px] p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Global Roles</div>
          <div className="mt-4 space-y-2">
            {globalRoles.map((role) => {
              const initial = (role as any).initial
              const isActive = activeRole === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-700 text-white shadow' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs font-semibold">{initial}</span>
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
            <table className="min-w-[640px] w-full text-sm">
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
                {modules.map((module) => {
                  const initial = (module as any).initial
                  return (
                    <tr key={module.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                            <span className="text-xs font-semibold">{initial}</span>
                          </div>
                          <span className="font-semibold text-stone-800">{module.label}</span>
                        </div>
                      </td>
                      {columns.map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 text-center">
                          <button
                            onClick={() => togglePermission(module.id, colIndex)}
                            className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border transition ${
                              permissions[module.id][colIndex]
                                ? 'border-brand-600 bg-brand-600 text-white'
                                : 'border-stone-300 bg-white text-transparent'
                            }`}
                          >
                            {permissions[module.id][colIndex] ? (
                              <span className="text-xs font-bold">✓</span>
                            ) : (
                              <span className="text-xs text-transparent">✓</span>
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {dirtyCount > 0 && (
            <div className="flex flex-col gap-4 rounded-[28px] glass-sm p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-stone-600">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-700">i</span>
                Unsaved changes detected in {dirtyCount} permissions.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDirtyCount(0)}
                  className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  Reset to Default
                </button>
                <button
                  onClick={() => setDirtyCount(0)}
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