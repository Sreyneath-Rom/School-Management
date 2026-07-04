import { recentActivities } from '../../services/mockData'
import { CheckCircle2, ClipboardCheck, Flag, Megaphone, Sparkles } from 'lucide-react'

const iconMap = {
  enrolled: CheckCircle2,
  grade: ClipboardCheck,
  homework: Sparkles,
  leave: Flag,
  announcement: Megaphone,
}

export default function RecentActivities() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent Activities</h2>
          <p className="text-sm text-slate-500">Live updates from the admin portal</p>
        </div>
        <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          View All Logs
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          return (
            <div key={item.id} className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
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
