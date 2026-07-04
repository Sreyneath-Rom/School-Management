import { Menu, Search, Bell, Calendar, ChevronDown } from '../shims/lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl shadow-sm shadow-slate-200/50">
      <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
        <Menu size={20} />
      </button>

      <div className="flex-1 max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm sm:flex">
        <Search size={17} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search students, staff, classes, subjects..."
          className="w-full border-0 bg-transparent px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
          <Bell size={19} />
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1.5 text-[10px] font-semibold text-white">3</span>
        </button>

        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Calendar size={16} className="text-slate-500" />
          <span className="text-sm text-slate-600">Monday, 24 May 2026</span>
        </div>

          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <img
            src="https://i.pravatar.cc/64?img=47"
            alt="Admin Sarah avatar"
              className="h-10 w-10 rounded-2xl object-cover"
          />
          <div className="min-w-30 text-left">
            <div className="text-sm font-semibold text-slate-900">Admin Sarah</div>
            <div className="text-xs text-slate-500">Super Admin</div>
          </div>
          <ChevronDown size={16} className="text-slate-500" />
        </div>
      </div>
    </header>
  )
}
