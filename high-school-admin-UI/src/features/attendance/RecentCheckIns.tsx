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
  checkin: 'bg-emerald-700/15 text-emerald-700 ring-1 ring-emerald-700/15',
  late: 'bg-amber-700/15 text-amber-700 ring-1 ring-amber-700/15',
  checkout: 'bg-sky-700/15 text-sky-700 ring-1 ring-sky-700/15',
  verified: 'bg-violet-700/15 text-violet-700 ring-1 ring-violet-700/15',
}

export default function RecentCheckIns() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent Check-Ins</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Live gate and homeroom scans</p>
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