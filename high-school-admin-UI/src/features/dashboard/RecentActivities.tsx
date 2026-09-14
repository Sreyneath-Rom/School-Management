import { recentActivities } from '@/services/mockData'
import { CheckCircle2, ClipboardCheck, Flag, Megaphone, Sparkles, ArrowUpRight } from 'lucide-react'
import { ListCardSkeleton } from '@/components/common/Skeleton'
import { Link } from 'react-router-dom'

const iconMap = {
  enrolled: CheckCircle2,
  grade: ClipboardCheck,
  homework: Sparkles,
  leave: Flag,
  announcement: Megaphone,
}

const tintMap: Record<keyof typeof iconMap, string> = {
  enrolled: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  grade: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  homework: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  leave: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  announcement: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
}

interface RecentActivitiesProps {
  loading?: boolean
}

export default function RecentActivities({ loading }: RecentActivitiesProps = {}) {
  if (loading) {
    return <ListCardSkeleton rows={4} />
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            System Activities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time administrative feed
          </p>
        </div>

        <Link
          to="/system/logs"
          className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          <span>Logs</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {recentActivities.map((item) => {
          const key = item.icon as keyof typeof iconMap
          const Icon = iconMap[key] || Sparkles
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-teal-500/30 dark:border-slate-800/80 dark:bg-slate-800/40"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  tintMap[key] || tintMap.homework
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
              <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                {item.time}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
