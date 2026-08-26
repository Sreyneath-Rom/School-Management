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
  enrolled: 'bg-success/20 text-success',
  grade: 'bg-info/20 text-info',
  homework: 'bg-brand-500/20 text-brand-300',
  leave: 'bg-warning/20 text-warning',
  announcement: 'bg-error/20 text-error',
}

export default function RecentActivities() {
  return (
    <section className="glass rounded-[28px] p-6 text-text-main">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-main">Recent Activities</h2>
          <p className="text-sm text-text-main/70">Live updates from the admin portal</p>
        </div>
        <Button variant="teal">View Logs</Button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((item) => {
          const key = item.icon as keyof typeof iconMap
          const Icon = iconMap[key]
          return (
            <div
              key={item.id}
              className="glass glass-interactive flex items-start gap-3 rounded-3xl p-4"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tintMap[key]}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-main">{item.title}</p>
                <p className="text-sm text-text-main/70">{item.subtitle}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-main/50">{item.time}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}