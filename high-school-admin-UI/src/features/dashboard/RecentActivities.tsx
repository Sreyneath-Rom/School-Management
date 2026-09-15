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
  enrolled: 'bg-success/10 text-success border-success/20',
  grade: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
  homework: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
  leave: 'bg-warning/10 text-warning border-warning/20',
  announcement: 'bg-error/10 text-error border-error/20',
}

interface RecentActivitiesProps {
  loading?: boolean
}

export default function RecentActivities({ loading }: RecentActivitiesProps = {}) {
  if (loading) {
    return <ListCardSkeleton rows={4} />
  }

  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-surface">
        <div>
          <h2 className="text-base font-bold text-color">
            System Activities
          </h2>
          <p className="text-xs text-secondary">
            Real-time administrative feed
          </p>
        </div>

        <Link
          to="/system/logs"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
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
              className="flex items-start gap-3 rounded-2xl border border-surface bg-surface p-3 transition hover:border-brand-500/30"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  tintMap[key] || tintMap.homework
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-color leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-secondary leading-snug mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
              <span className="text-[10.5px] font-medium text-secondary shrink-0">
                {item.time}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
