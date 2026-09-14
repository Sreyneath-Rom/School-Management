import { Link } from 'react-router-dom'
import {
  UserPlus,
  ClipboardCheck,
  Award,
  CalendarPlus,
  Send,
  ArrowRight,
  BookOpen,
  DollarSign,
  GraduationCap,
} from 'lucide-react'

interface QuickActionItem {
  id: string
  title: string
  subtitle: string
  icon: typeof UserPlus
  to: string
  color: string
}

const actions: QuickActionItem[] = [
  {
    id: 'act-student',
    title: 'Admit Student',
    subtitle: 'Register new enrollment',
    icon: UserPlus,
    to: '/students',
    color: 'from-blue-600 to-indigo-600 text-white',
  },
  {
    id: 'act-attendance',
    title: 'Attendance Roll Call',
    subtitle: 'Record daily presence',
    icon: ClipboardCheck,
    to: '/students/attendance',
    color: 'from-emerald-600 to-teal-600 text-white',
  },
  {
    id: 'act-exam',
    title: 'Publish Exam Marks',
    subtitle: 'Semester grade entry',
    icon: Award,
    to: '/academic/exams',
    color: 'from-purple-600 to-pink-600 text-white',
  },
  {
    id: 'act-event',
    title: 'Schedule Event',
    subtitle: 'Campus calendar booking',
    icon: CalendarPlus,
    to: '/calendar',
    color: 'from-amber-600 to-orange-600 text-white',
  },
  {
    id: 'act-announcement',
    title: 'Broadcast Notice',
    subtitle: 'Send SMS & Parent notice',
    icon: Send,
    to: '/communication/announcements',
    color: 'from-rose-600 to-red-600 text-white',
  },
  {
    id: 'act-classes',
    title: 'Class Rosters',
    subtitle: 'Assign rooms & tutors',
    icon: GraduationCap,
    to: '/academic/classes',
    color: 'from-teal-600 to-cyan-600 text-white',
  },
]

export default function DashboardQuickActions() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Administrative Fast-Actions
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            One-click workflows for high-frequency daily management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <Link
              key={act.id}
              to={act.to}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${act.color} shadow-xs`}
                >
                  <Icon size={17} />
                </div>
                <ArrowRight
                  size={14}
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-600 dark:text-slate-600 dark:group-hover:text-teal-400"
                />
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {act.title}
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                  {act.subtitle}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
