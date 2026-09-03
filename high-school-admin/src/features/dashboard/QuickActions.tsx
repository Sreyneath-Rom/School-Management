import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, ClipboardCheck, GraduationCap, UsersRound } from 'lucide-react'

type QuickAction = {
  label: string
  description: string
  href: string
  icon: typeof UsersRound
  tone: string
}

const quickActions: QuickAction[] = [
  {
    label: 'Enroll student',
    description: 'Add a learner to the roster',
    href: '/students',
    icon: GraduationCap,
    tone: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  },
  {
    label: 'Take attendance',
    description: 'Record today’s class status',
    href: '/students/attendance',
    icon: ClipboardCheck,
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  {
    label: 'Manage classes',
    description: 'Organize sections and subjects',
    href: '/academic/classes',
    icon: UsersRound,
    tone: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  {
    label: 'Enter grades',
    description: 'Update the gradebook',
    href: '/academic/grades',
    icon: BookOpenCheck,
    tone: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  },
]

export default function QuickActions() {
  return (
    <section className="glass rounded-[28px] p-5 sm:p-6" aria-labelledby="quick-actions-title">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-500">MVP workflow</p>
          <h2 id="quick-actions-title" className="mt-1 text-base font-semibold text-text-main">Keep the school day moving</h2>
          <p className="mt-1 text-sm text-text-main/65">Jump into the actions that power the core academic flow.</p>
        </div>
        <span className="hidden rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 sm:inline-flex dark:text-brand-300">4 essentials</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map(({ label, description, href, icon: Icon, tone }) => (
          <Link
            key={href}
            to={href}
            className="group flex items-center gap-3 rounded-2xl border border-white/60 bg-white/45 p-3.5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.09]"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={18} strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-text-main">{label}</span>
              <span className="mt-0.5 block truncate text-xs text-text-main/60">{description}</span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-text-main/35 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
          </Link>
        ))}
      </div>
    </section>
  )
}
