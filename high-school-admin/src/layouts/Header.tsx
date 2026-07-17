import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Calendar, User, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import ThemeToggle from '@/components/common/ThemeToggle'

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
    <header className="sticky top-0 z-20 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            onClick={() => onOpenSidebar && onOpenSidebar()}
            className="inline-flex items-center justify-center h-10 w-12 rounded-full glass-sm text-stone-600 transition hover:text-stone-900 lg:hidden dark:text-stone-300 dark:hover:text-white"
          >
            <Menu size={18} />
          </button>

          <button
            type="button"
            aria-label="Open search"
            onClick={() => setMobileSearchOpen((open) => !open)}
            className="inline-flex items-center justify-center h-10 w-12 rounded-full glass-sm text-stone-600 transition hover:text-stone-900 sm:hidden dark:text-stone-300 dark:hover:text-white"
          >
            <Search size={18} />
          </button>

          <div className="hidden min-w-180 items-center gap-3 rounded-4xl glass-sm px-4 py-3 sm:flex">
            <Search size={17} className="text-stone-600 shrink-0 dark:text-stone-400" />
            <input
              type="text"
              aria-label="Search students, staff, or records"
              placeholder="Search students, staff, or records..."
              className="w-full border-0 bg-transparent px-3 text-sm text-stone-900 placeholder:text-stone-600 focus:outline-none dark:text-stone-100 dark:placeholder:text-stone-400"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />

          <button
            aria-label="Notifications, unread"
            className="relative glass-sm inline-flex h-10 w-12 items-center justify-center rounded-full text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-rose-600" />
          </button>

          <div className="hidden items-center gap-2 rounded-full px-3 py-2 text-stone-600 md:inline-flex dark:text-stone-400">
            <Calendar size={16} />
            <span className="text-sm">{today}</span>
          </div>

          <div className="hidden h-8 w-px bg-stone-200 md:block dark:bg-stone-700" />

          {/* Account menu */}
          <div className="relative" ref={menuRef}>
            <button
              aria-label={`Open account menu for ${user?.name ?? 'account'}, ${roleLabel}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex items-center gap-3 rounded-full px-2 py-2 transition hover:bg-stone-50 dark:hover:bg-white/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full glass-sm text-stone-600 dark:text-stone-300">
                <User size={18} />
              </div>

              <div className="hidden min-w-0 flex-col truncate text-left sm:flex">
                <div className="max-w-30 truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {user?.name ?? 'Account'}
                </div>
                <div className="truncate text-xs text-stone-600 dark:text-stone-400">{roleLabel}</div>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-stone-500 transition-transform sm:block dark:text-stone-400 ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-sm p-2 shadow-lg">
                <div className="border-b border-stone-200/60 px-3 py-2 sm:hidden dark:border-stone-700/60">
                  <div className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {user?.name ?? 'Account'}
                  </div>
                  <div className="truncate text-xs text-stone-600 dark:text-stone-400">{roleLabel}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
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
            <Search size={17} className="text-stone-600 shrink-0 dark:text-stone-400" />
            <input
              type="text"
              aria-label="Search students, staff, or records"
              placeholder="Search students, staff, or records..."
              className="w-full border-0 bg-transparent px-2 text-sm text-stone-900 placeholder:text-stone-600 focus:outline-none dark:text-stone-100 dark:placeholder:text-stone-400"
            />
            <Button onClick={() => setMobileSearchOpen(false)} className="h-8 w-8 p-0 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white">
              <X size={16} />
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}