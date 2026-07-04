import { announcements } from '../../services/mockData'

export default function Announcements() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Announcements</h2>
          <p className="text-sm text-slate-500">Latest campus updates and alerts</p>
        </div>
        <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          Create New
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.time}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
