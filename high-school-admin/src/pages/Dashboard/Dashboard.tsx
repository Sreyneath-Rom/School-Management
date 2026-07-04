import { Bell, ClipboardList, Users2, CalendarDays } from 'lucide-react'
import PageHeading from '../../components/common/PageHeading'
import StatsGrid from '../../components/cards/StatsGrid'
import AttendanceChart from '../../components/charts/AttendanceChart'
import EnrollmentDonut from '../../components/charts/EnrollmentDonut'
import UpcomingEvents from '../../features/dashboard/UpcomingEvents'
import RecentActivities from '../../features/dashboard/RecentActivities'
import RecentLeaveRequests from '../../features/dashboard/RecentLeaveRequests'
import Announcements from '../../features/dashboard/Announcements'
import { recentActivities } from '../../services/mockData'

const quickActions = [
  {
    label: 'Review attendance',
    icon: Bell,
    description: "Check today's attendance trends and alerts.",
  },
  {
    label: 'Pending leave requests',
    icon: ClipboardList,
    description: 'Approve or decline student leave submissions.',
  },
  {
    label: 'Active users',
    icon: Users2,
    description: 'Review the users who logged in today.',
  },
]

export default function Dashboard() {
  return (
    <>
      <PageHeading
        title="Dashboard Overview"
        subtitle="Welcome back, Principal Sarah. Here's what's happening today."
      />

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Today’s snapshot</p>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                94.2% attendance rate
              </div>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Student attendance is strong today, with just a few leave requests pending review.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[28px] bg-sky-50 p-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">New today</p>
                <div className="mt-3 text-3xl font-semibold text-slate-900">5</div>
                <p className="mt-1 text-sm text-slate-500">Events</p>
              </div>
              <div className="rounded-[28px] bg-emerald-50 p-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Leaves</p>
                <div className="mt-3 text-3xl font-semibold text-slate-900">12</div>
                <p className="mt-1 text-sm text-slate-500">Pending</p>
              </div>
              <div className="rounded-[28px] bg-violet-50 p-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Class periods</p>
                <div className="mt-3 text-3xl font-semibold text-slate-900">18</div>
                <p className="mt-1 text-sm text-slate-500">Scheduled</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <div key={action.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white text-slate-900 shadow-sm">
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 font-semibold text-slate-900">{action.label}</p>
                  <p className="mt-2 text-sm text-slate-500">{action.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Quick stats</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Your tasks today</h2>
              </div>
              <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Manage tasks
              </button>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[28px] bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Upcoming event</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Parent-Teacher Meeting</p>
                <p className="mt-1 text-sm text-slate-500">09:00 AM - 12:00 PM</p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Most active role</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Teacher</p>
                <p className="mt-1 text-sm text-slate-500">112 active staff today</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Live insights</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Latest activity</h2>
              </div>
              <CalendarDays size={24} className="text-slate-500" />
            </div>

            <div className="mt-6 space-y-4">
              {recentActivities.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-[28px] bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-400">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <AttendanceChart />
        <EnrollmentDonut />
        <UpcomingEvents />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr_0.9fr]">
        <RecentActivities />
        <RecentLeaveRequests />
        <Announcements />
      </div>
    </>
  )
}
