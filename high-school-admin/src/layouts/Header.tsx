import { Search, Bell, Calendar, User, Menu } from 'lucide-react'

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3">

      <button
        aria-label="Open menu"
        onClick={() => onOpenSidebar && onOpenSidebar()}
        className="inline-flex items-center justify-center h-10 w-10 rounded-md text-slate-600 lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="hidden max-w-2xl flex-1 items-center gap-3 rounded-4xl glass px-4 py-3 sm:flex">
        <Search size={17} className="text-slate-600 shrink-0" />
        <input
          type="text"
          aria-label="Search students, staff, or records"
          placeholder="Search students, staff, or records..."
          className="w-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          aria-label="Notifications, unread"
          className="relative inline-flex h-11 w-11 items-center justify-center text-slate-600 transition hover:text-slate-900"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
        </button>

        <div className="hidden items-center gap-2 px-3 py-2 md:inline-flex">
          <span className="text-sm text-slate-600">{today}</span>
          <Calendar size={16} className="text-slate-600" />
        </div>

        <div className="hidden h-8 w-px bg-slate-300 md:block" />

        <button
          aria-label="Open account menu for Admin Sarah, Super User"
          className="inline-flex items-center gap-3 px-3 py-2 transition hover:border-slate-300"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
            <User size={18} />
          </div>

          <div className="min-w-30 text-left">
            <div className="text-sm font-semibold text-slate-900">Admin Sarah</div>
            <div className="text-xs text-slate-600">Super User</div>
          </div>
        </button>
      </div>
    </header>
  )
}