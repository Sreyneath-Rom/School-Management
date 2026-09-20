// src/pages/Teachers/TeacherList.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Search,
  Mail,
  Eye,
  LayoutGrid,
  List,
  Building2,
  ExternalLink,
  RefreshCw,
  GraduationCap,
  Info,
} from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { teacherService, type TeacherRecord } from '@/services/teacherService'

// STRIPPED: TeacherProfileView does not expose name, employeeId, department,
// position, status, qualifications, specialization, weeklyTeachingHours,
// assignedClasses, subjectsTaught, performanceRating, joiningDate, phone,
// title. Only id, firstName, lastName, email, avatarUrl are used.
//
// The create/edit form is also removed — CreateTeacherPayload is a
// discriminated union whose non-`userId` branch is not visible in the
// current type file. Restore the form when src/types/teacherProfile.ts
// is available.

function displayName(t: TeacherRecord): string {
  const composed = `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim()
  return composed || t.email || t.id
}

function initials(first?: string, last?: string): string {
  const a = (first ?? '').charAt(0)
  const b = (last ?? '').charAt(0)
  return (a + b).toUpperCase() || 'FC'
}

export default function TeacherList() {
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [teachers, setTeachers] = useState<TeacherRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const loadTeachers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await teacherService.list()
      setTeachers(Array.isArray(data) ? data : [])
    } catch {
      showToast('Failed to load faculty', 'error')
      setTeachers([])
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadTeachers()
  }, [loadTeachers])

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        (t.firstName ?? '').toLowerCase().includes(q) ||
        (t.lastName ?? '').toLowerCase().includes(q) ||
        (t.email ?? '').toLowerCase().includes(q)
      )
    })
  }, [teachers, search])

  const kpiCards: StatCard[] = [
    { id: 'total-faculty', label: 'Total Faculty', value: String(teachers.length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'directory', icon: 'Users', tint: 'blue' },
    { id: 'with-email', label: 'With Email', value: String(teachers.filter((t) => t.email).length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'contactable', icon: 'Mail', tint: 'green' },
    { id: 'with-avatar', label: 'With Photo', value: String(teachers.filter((t) => t.avatarUrl).length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'profiles', icon: 'Users', tint: 'amber' },
    { id: 'departments', label: 'Departments', value: '—', delta: '-', deltaDirection: 'neutral', deltaLabel: 'not yet available', icon: 'Building2', tint: 'violet' },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeading
          title="Teachers & Faculty Directory"
          subtitle="Faculty roster."
        />
        <button
          onClick={loadTeachers}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-surface bg-surface hover:bg-surface-strong text-xs font-semibold text-color transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          Faculty creation and per-field editing require the full{' '}
          <code className="font-mono">CreateTeacherPayload</code> shape. Paste{' '}
          <code className="font-mono">src/types/teacherProfile.ts</code> to
          restore them.
        </p>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-surface bg-surface/40">
        <div className="relative flex-1 w-full min-w-60">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-xl bg-surface border border-surface focus:outline-none focus:ring-1 focus:ring-brand-500 text-color"
          />
        </div>

        <div className="flex items-center gap-1 self-end md:self-auto bg-surface p-1 rounded-xl border border-surface">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'grid'
                ? 'bg-surface-strong text-color shadow-xs'
                : 'text-secondary hover:text-color'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'table'
                ? 'bg-surface-strong text-color shadow-xs'
                : 'text-secondary hover:text-color'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl border border-surface bg-surface/40 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-surface-strong" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded bg-surface-strong" />
                  <div className="h-3 w-20 rounded bg-surface-strong" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-surface bg-surface/30 text-center">
          <Building2 className="mx-auto h-10 w-10 text-secondary mb-2" />
          <h3 className="font-bold text-color">No Faculty Members Found</h3>
          <p className="text-xs text-secondary mt-1">
            {teachers.length === 0
              ? 'The roster is empty.'
              : 'Try adjusting your search.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => {
            const name = displayName(t)
            const inits = initials(t.firstName, t.lastName)

            return (
              <div
                key={t.id}
                className="flex flex-col justify-between p-5 rounded-2xl border border-surface bg-surface/60 hover:border-brand-500/40 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {t.avatarUrl ? (
                        <img
                          src={t.avatarUrl}
                          alt={name}
                          className="h-12 w-12 rounded-2xl object-cover ring-2 ring-brand-500/20"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/20 to-brand-600/10 font-bold text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20">
                          {inits}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-color text-sm truncate">
                          {name}
                        </h3>
                        <p className="text-xs text-secondary truncate mt-0.5">
                          {t.email || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 flex items-center justify-between gap-2 border-t border-surface">
                  <button
                    onClick={() => navigate(`/teachers/profiles?id=${t.id}`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Profile</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-surface bg-surface/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-strong border-b border-surface text-secondary uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {filtered.map((t) => {
                  const name = displayName(t)
                  const inits = initials(t.firstName, t.lastName)

                  return (
                    <tr key={t.id} className="hover:bg-surface/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {t.avatarUrl ? (
                            <img
                              src={t.avatarUrl}
                              alt=""
                              className="h-9 w-9 rounded-xl object-cover ring-1 ring-brand-500/20"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500/20 to-brand-600/10 font-bold text-brand-700 dark:text-brand-300">
                              {inits}
                            </div>
                          )}
                          <div className="font-bold text-color">{name}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-secondary text-[11px]">
                        {t.email || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/teachers/profiles?id=${t.id}`)}
                            className="p-1.5 rounded-lg text-secondary hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition"
                            title="Open profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}