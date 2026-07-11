import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Calendar, User, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Header({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : ''

  // Close the dropdown when clicking outside it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20  px-4 py-3 ">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            onClick={() => onOpenSidebar && onOpenSidebar()}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-slate-600 transition hover:text-slate-900 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <button
            type="button"
            aria-label="Open search"
            onClick={() => setMobileSearchOpen((open) => !open)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-slate-600 transition hover:text-slate-900 sm:hidden"
          >
            <Search size={18} />
          </button>

          <div className="hidden min-w-180 items-center gap-3 rounded-4xl glass-sm px-4 py-3 sm:flex">
            <Search size={17} className="text-slate-600 shrink-0" />
            <input
              type="text"
              aria-label="Search students, staff, or records"
              placeholder="Search students, staff, or records..."
              className="w-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            aria-label="Notifications, unread"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-600 transition hover:text-slate-900"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
          </button>

          <div className="hidden items-center gap-2 rounded-full  px-3 py-2 text-slate-600 md:inline-flex">
            <Calendar size={16} />
            <span className="text-sm">{today}</span>
          </div>

          <div className="hidden h-8 w-px bg-slate-600 md:block" />

          {/* Account menu */}
          <div className="relative" ref={menuRef}>
            <button
              aria-label={`Open account menu for ${user?.name ?? 'account'}, ${roleLabel}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex items-center gap-3 rounded-full px-2 py-2 transition hover:border-slate-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full glass-sm text-slate-600">
                <User size={18} />
              </div>

              <div className="hidden min-w-0 flex-col truncate text-left sm:flex">
                <div className="max-w-30 truncate text-sm font-semibold text-slate-900">
                  {user?.name ?? 'Account'}
                </div>
                <div className="truncate text-xs text-slate-600">{roleLabel}</div>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-slate-500 transition-transform sm:block ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-sm p-2 shadow-lg">
                <div className="border-b border-slate-200/60 px-3 py-2 sm:hidden">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {user?.name ?? 'Account'}
                  </div>
                  <div className="truncate text-xs text-slate-600">{roleLabel}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileSearchOpen ? (
        <div className="mt-3 sm:hidden">
          <div className="flex items-center gap-2 rounded-4xl glass-sm px-3 py-2 shadow-sm">
            <Search size={17} className="text-slate-600 shrink-0" />
            <input
              type="text"
              aria-label="Search students, staff, or records"
              placeholder="Search students, staff, or records..."
              className="w-full border-0 bg-transparent px-2 text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setMobileSearchOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:text-slate-900"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}