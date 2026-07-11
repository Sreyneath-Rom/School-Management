import { announcements } from '@/services/mockData'

export default function Announcements() {
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Announcements</h2>
          <p className="text-sm text-slate-500">Latest campus updates and alerts</p>
        </div>
        <button className="rounded-full glass-sm px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          Create New
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl glass-sm p-6 transition hover:bg-slate-100"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.time}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}