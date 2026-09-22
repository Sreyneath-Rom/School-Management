import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Mail, RefreshCw, Search, Users, Building2, GraduationCap, Info } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { teacherService, type TeacherRecord } from '@/services/teacherService'
import { useToast } from '@/components/common/ToastProvider'

function displayName(teacher: TeacherRecord) {
  return `${teacher.firstName ?? ''} ${teacher.lastName ?? ''}`.trim() || teacher.email || teacher.id
}

function initials(teacher: TeacherRecord) {
  return `${teacher.firstName?.charAt(0) ?? ''}${teacher.lastName?.charAt(0) ?? ''}`.toUpperCase() || 'TC'
}

export default function TeacherList() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState<TeacherRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadTeachers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await teacherService.list()
      setTeachers(Array.isArray(data) ? data : [])
    } catch {
      setTeachers([])
      showToast('Failed to load faculty', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadTeachers() }, [loadTeachers])

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return teachers
    return teachers.filter((teacher) =>
      `${teacher.firstName ?? ''} ${teacher.lastName ?? ''} ${teacher.email ?? ''}`.toLowerCase().includes(query),
    )
  }, [teachers, search])

  const cards: StatCard[] = [
    { id: 'total-faculty', label: 'Total Faculty', value: String(teachers.length), delta: 'Directory', deltaDirection: 'neutral', deltaLabel: 'all teachers', icon: 'Users', tint: 'blue', footerLabel: 'Faculty roster' },
    { id: 'active-contact', label: 'Contactable', value: String(teachers.filter((teacher) => Boolean(teacher.email)).length), delta: 'Email', deltaDirection: 'neutral', deltaLabel: 'available', icon: 'Mail', tint: 'green', footerLabel: 'Verified directory contacts' },
    { id: 'profile-complete', label: 'With Photo', value: String(teachers.filter((teacher) => Boolean(teacher.avatarUrl)).length), delta: 'Profiles', deltaDirection: 'neutral', deltaLabel: 'updated', icon: 'GraduationCap', tint: 'amber', footerLabel: 'Profile completeness' },
    { id: 'departments', label: 'Departments', value: '—', delta: 'API', deltaDirection: 'neutral', deltaLabel: 'not available', icon: 'Building2', tint: 'violet', footerLabel: 'Department data' },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading title="Teachers Directory" subtitle="View, search, and manage faculty profiles and contact records." />
        <button
          onClick={loadTeachers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl glass-sm glass-interactive px-3 py-2 text-xs font-semibold text-fg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={isLoading ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
          Refresh
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-info/30 bg-info/5 p-4 text-xs">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
        <p className="text-fg-muted">Faculty profiles are loaded from the live teacher API. Open a teacher to view the complete record.</p>
      </div>

      <StatsGrid cards={cards} loading={isLoading} columns={4} showHeader={false} />

      <div className="flex items-center gap-3 rounded-2xl glass-sm p-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted pointer-events-none" />
          <input
            aria-label="Search teachers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by teacher name or email..."
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-fg outline-none placeholder:text-fg-muted focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <span className="ml-auto whitespace-nowrap text-xs font-semibold text-fg-muted">{filteredTeachers.length} results</span>
      </div>

      {isLoading ? (
        <div className="overflow-hidden rounded-2xl glass-sm p-4" role="status" aria-label="Loading teachers">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl skeleton" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-4 w-48 rounded skeleton" />
                  <div className="h-3 w-64 rounded skeleton" />
                </div>
                <div className="h-6 w-20 rounded skeleton" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl glass p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sunken text-fg-muted">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-fg">No Teachers Found</h3>
          <p className="mt-1 text-xs text-fg-muted">Try adjusting your search or refresh the live directory.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl glass-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-fg-muted theme-divider">
                <tr>
                  <th className="px-4 py-3.5">Teacher</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Profile</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--neu-shadow-dark)">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="transition-shadow hover:shadow-sunken">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 font-bold text-brand-700 shadow-sunken">
                          {teacher.avatarUrl ? (
                            <img src={teacher.avatarUrl} alt="" className="h-full w-full rounded-xl object-cover" />
                          ) : (
                            initials(teacher)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-fg">{displayName(teacher)}</div>
                          <div className="text-[11px] text-fg-muted">Faculty ID: {teacher.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-fg-muted">{teacher.email || 'Not listed'}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Available
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/teachers/profiles?id=${teacher.id}`)}
                        className="rounded-lg p-1.5 text-fg-muted transition hover:bg-brand-500/10 hover:text-brand-600"
                        title={`View ${displayName(teacher)}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}