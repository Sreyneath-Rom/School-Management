import StatsGrid from '@/components/cards/StatsGrid'
import AttendanceChart from '@/components/charts/AttendanceChart'
import EnrollmentDonut from '@/components/charts/EnrollmentDonut'
import UpcomingEvents from '@/features/dashboard/UpcomingEvents'
import RecentActivities from '@/features/dashboard/RecentActivities'
import RecentLeaveRequests from '@/features/dashboard/RecentLeaveRequests'
import Announcements from '@/features/dashboard/Announcements'
import { useAuth } from '@/hooks/useAuth'
import { getGreetingForUser } from '@/data/mockUsers'
import { useFetch } from '@/hooks/useFetch'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'
import { CalendarDays, ChevronRight, CircleCheck, Clock3, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const displayName = user ? getGreetingForUser(user) : null
  const { data: stats, loading, error } = useFetch<DashboardStats>(dashboardService.getStats)

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-950 px-5 py-6 text-white shadow-xl sm:px-8 sm:py-8">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-24 border-teal-400/20" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
                <CircleCheck size={13} /> System operational
              </span>
              <span className="text-white/45">Wednesday, July 1</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Good morning{displayName ? `, ${displayName}` : ''}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              A clear view of today&apos;s school operations, people, and priorities.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/calendar/events/create" className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-3.5 py-2.5 text-xs font-bold text-stone-950 transition hover:bg-teal-300">
              <Plus size={15} /> Add event
            </Link>
            <Link to="/reports/attendance" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-white/15">
              View reports <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <div className="space-y-5 sm:space-y-6">
        {error && (
          <div className="rounded-3xl glass-sm p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200">
            Unable to load dashboard metrics. Please refresh the page.
          </div>
        )}

        <StatsGrid stats={stats} loading={loading} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
          <div className="min-w-0">
            <AttendanceChart loading={loading} />
          </div>
          <div className="min-w-0">
            <EnrollmentDonut loading={loading} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <UpcomingEvents loading={loading} />
          <RecentActivities loading={loading} />
          <div className="min-w-0">
            <Announcements loading={loading} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <RecentLeaveRequests loading={loading} />
          </div>
          <aside className="hidden rounded-3xl bg-teal-950 p-5 text-white lg:block">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-400 text-stone-950">
              <Clock3 size={19} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">Today's focus</p>
            <h2 className="mt-2 text-lg font-bold leading-tight">Keep the school day moving.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">Review pending requests and attendance exceptions before the afternoon cycle.</p>
            <Link to="/students/attendance" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-white">
              Open attendance <CalendarDays size={14} />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
