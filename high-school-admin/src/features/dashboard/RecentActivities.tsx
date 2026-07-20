import { recentActivities } from '@/services/mockData'
import { CheckCircle2, ClipboardCheck, Flag, Megaphone, Sparkles } from 'lucide-react'
import Button from '@/components/common/Button'

const iconMap = {
  enrolled: CheckCircle2,
  grade: ClipboardCheck,
  homework: Sparkles,
  leave: Flag,
  announcement: Megaphone,
}

const tintMap: Record<keyof typeof iconMap, string> = {
  enrolled: 'bg-emerald-700/15 text-emerald-700 ring-1 ring-emerald-700/15',
  grade: 'bg-sky-700/15 text-sky-700 ring-1 ring-sky-700/15',
  homework: 'bg-violet-700/15 text-violet-700 ring-1 ring-violet-700/15',
  leave: 'bg-amber-700/15 text-amber-700 ring-1 ring-amber-700/15',
  announcement: 'bg-rose-700/15 text-rose-700 ring-1 ring-rose-700/15',
}

export default function RecentActivities() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent Activities</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Live updates from the admin portal</p>
        </div>
        <Button variant="solid" className="text-slate-300 hover:bg-slate-700">
          View Logs
        </Button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((item) => {
          const key = item.icon as keyof typeof iconMap
          const Icon = iconMap[key]
          return (
            <div
              key={item.id}
              className="group flex items-start gap-3 rounded-3xl glass-sm p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/50 hover:shadow-[0_16px_35px_-15px_rgba(15,23,42,0.2)]"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105 ${tintMap[key]}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.subtitle}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{item.time}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}