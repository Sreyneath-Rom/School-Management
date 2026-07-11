import { recentActivities } from '@/services/mockData'
import { CheckCircle2, ClipboardCheck, Flag, Megaphone, Sparkles } from 'lucide-react'

const iconMap = {
  enrolled: CheckCircle2,
  grade: ClipboardCheck,
  homework: Sparkles,
  leave: Flag,
  announcement: Megaphone,
}

const tintMap: Record<keyof typeof iconMap, string> = {
  enrolled: 'bg-emerald-400/20 backdrop-blur-md text-emerald-700',
  grade: 'bg-sky-400/20 backdrop-blur-md text-sky-700',
  homework: 'bg-violet-400/20 backdrop-blur-md text-violet-700',
  leave: 'bg-amber-400/20 backdrop-blur-md text-amber-700',
  announcement: 'bg-rose-400/20 backdrop-blur-md text-rose-700',
}

export default function RecentActivities() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent Activities</h2>
          <p className="text-sm text-slate-600">Live updates from the admin portal</p>
        </div>
        <button className="rounded-full glass-sm px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          View Logs
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((item) => {
          const key = item.icon as keyof typeof iconMap
          const Icon = iconMap[key]
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-3xl bg-white/25 p-4 transition hover:bg-white/40"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tintMap[key]}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.subtitle}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.time}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}