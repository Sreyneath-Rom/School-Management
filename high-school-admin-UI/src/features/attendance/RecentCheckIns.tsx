// src/features/attendance/RecentCheckIns.tsx
import { recentCheckIns } from '@/services/attendanceMockData'
import { LogIn, AlarmClock, DoorOpen, UserCheck } from 'lucide-react'
import Button from '@/components/common/Button'

const iconMap = {
  checkin: LogIn,
  late: AlarmClock,
  checkout: DoorOpen,
  verified: UserCheck,
}

const tintMap: Record<keyof typeof iconMap, string> = {
  checkin: 'bg-success/15 text-success',
  late: 'bg-warning/15 text-warning',
  checkout: 'bg-info/15 text-info',
  verified: 'bg-brand-500/15 text-brand-600 dark:text-brand-400',
}

export default function RecentCheckIns() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-fg">Recent Check-Ins</h2>
          <p className="text-sm text-fg-muted">Live gate and homeroom scans</p>
        </div>
        <Button variant="solid">View Logs</Button>
      </div>

      <div className="space-y-4">
        {recentCheckIns.map((item) => {
          const key = item.icon as keyof typeof iconMap
          const Icon = iconMap[key]
          return (
            <div
              key={item.id}
              className="group flex items-start gap-3 rounded-3xl glass-sm p-4 transition-all duration-300 ease-out hover:shadow-(--glass-strong-shadow)"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105 shadow-sunken ${tintMap[key]}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-fg">{item.title}</p>
                <p className="text-sm text-fg-muted">{item.subtitle}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-muted">{item.time}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}