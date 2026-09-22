// src/components/auth/AuthHeader.tsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  School2,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  LayoutGrid,
  CheckCircle2,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  X,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Building,
  LogOut,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react'
import type { UserRole } from '@/utils/rolePermissions'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { useTranslations } from '@/i18n/useTranslations'

interface Props {
  activeRole?: UserRole | 'all'
  onRoleSelect?: (role: UserRole | 'all') => void
}

/* Neumorphic hairline seams. Under this theme a 1px border in
   --glass-bg is invisible; a 1px hard-edged box-shadow using
   --neu-shadow-dark reads as a proper seam. */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'

const SUPPORTED_LANGS = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'fr', name: 'Français', native: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', native: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch', flag: '🇩🇪' },
]

const HOME_BY_ROLE: Record<string, string> = {
  admin: '/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
  parent: '/parent/dashboard',
}

const PORTAL_PATH: Record<UserRole | 'all', string> = {
  all: '/login',
  admin: '/login/admin',
  teacher: '/login/teacher',
  student: '/login/student',
  parent: '/login/parent',
  mazer: '/login',
}

export default function AuthHeader({
  activeRole = 'all',
  onRoleSelect,
}: Props) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useTranslations()
  const { isAuthenticated, user, logout } = useAuth()
  const isDark = theme === 'dark'

  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRoleClick = (role: UserRole | 'all') => {
    if (onRoleSelect) return onRoleSelect(role)
    navigate(PORTAL_PATH[role])
  }

  const navItems = [
    { id: 'all' as const, label: 'All Portals', icon: LayoutGrid, color: 'text-fg-muted' },
    { id: 'admin' as const, label: 'Admin', icon: ShieldCheck, color: 'text-info' },
    { id: 'teacher' as const, label: 'Faculty', icon: GraduationCap, color: 'text-success' },
    { id: 'student' as const, label: 'Student', icon: BookOpen, color: 'text-brand-600 dark:text-brand-400' },
    { id: 'parent' as const, label: 'Parent', icon: Users, color: 'text-warning' },
  ]

  const currentLang =
    SUPPORTED_LANGS.find((l) => l.code === language) ?? SUPPORTED_LANGS[0]

  const handleGoDashboard = () => {
    if (!user) return
    navigate(HOME_BY_ROLE[user.role] ?? '/dashboard')
  }

  return (
    <header className="w-full relative z-30 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* ---------- Brand ---------- */}
        <div
          id="auth-brand-logo"
          role="button"
          tabIndex={0}
          onClick={() => handleRoleClick('all')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleRoleClick('all')
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-tr from-brand-600 via-brand-500 to-info flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition">
            <School2 size={22} className="sm:size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-fg">
                Varin High School
              </span>
              {/* Soft brand chip — keeps its visible tinted border because
                  it conveys the school-year status, not a surface. */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                <CheckCircle2 size={10} className="text-brand-600 dark:text-brand-400" />
                AY 2025–2026
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-fg-muted font-medium">
              <span className="inline-flex items-center gap-1">
                <MapPin size={10} className="text-error" />
                Siem Reap, Cambodia
              </span>
              <span>•</span>
              <span>Unified Academic Portal</span>
            </div>
          </div>
        </div>


        {/* ---------- Right tools ---------- */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user && (
            // Semantic status chip — keeps its success-tinted surface so
            // "signed in" reads at a glance. Not a neumorphic surface.
            <div className="hidden lg:flex items-center gap-2 pl-2 pr-1 py-1 rounded-2xl bg-success/15 border border-success/30 text-xs text-fg">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="font-semibold">{user.firstName || user.name}</span>
              <button
                type="button"
                onClick={handleGoDashboard}
                className="px-2 py-1 rounded-xl bg-success hover:bg-success/90 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
              >
                Dashboard
                <ArrowRight size={12} />
              </button>
              <button
                type="button"
                onClick={() => logout()}
                title="Sign out"
                className="p-1 rounded-xl hover:bg-success/20 text-success transition cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              id="auth-lang-btn"
              type="button"
              onClick={() => setIsLangOpen((v) => !v)}
              aria-expanded={isLangOpen}
              className="glass-sm glass-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-fg text-xs font-semibold"
            >
              <span className="text-sm">{currentLang.flag}</span>
              <span className="hidden sm:inline font-medium">{currentLang.native}</span>
              <ChevronDown size={12} className="text-fg-muted" />
            </button>

            {isLangOpen && (
              <div className="dropdown-surface absolute right-0 top-full mt-1.5 w-48 rounded-2xl py-1.5 z-50">
                <div className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-fg-muted mb-1 flex items-center gap-1.5 ${SEAM_B}`}>
                  <Globe size={12} />
                  Choose Language / ភាសា
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {SUPPORTED_LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code)
                        setIsLangOpen(false)
                      }}
                      className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                        language === lang.code
                          ? 'font-bold text-brand-700 dark:text-brand-300 bg-brand-500/15'
                          : 'text-fg hover:text-fg'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <span>
                          <span className="block font-semibold text-xs leading-none">{lang.native}</span>
                          <span className="block text-[10px] text-fg-muted leading-none mt-0.5">{lang.name}</span>
                        </span>
                      </span>
                      {language === lang.code && (
                        <CheckCircle2 size={13} className="text-brand-600 dark:text-brand-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            id="auth-theme-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="glass-sm glass-interactive w-9 h-9 flex items-center justify-center text-fg-muted hover:text-fg"
          >
            {isDark ? <Sun size={16} className="text-warning" /> : <Moon size={16} />}
          </button>

          {/* Helpdesk — brand-tinted text on the same glass surface, so it
              reads as a distinct affordance without introducing a border. */}
          <button
            id="auth-support-btn"
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="glass-sm glass-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-brand-700 dark:text-brand-300 text-xs font-semibold"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">IT Helpdesk</span>
          </button>
        </div>
      </div>

      {/* ---------- Support modal ---------- */}
      {isHelpOpen && (
        // No backdrop-blur: the neumorphic surface treatment is already
        // depth-based, and a frosted scrim fights it. A plain dark wash
        // does the same job.
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsHelpOpen(false)
          }}
        >
          {/* .glass-strong supplies bg + radius + shadow. `border border-surface-strong`
              was invisible (surface-strong = --glass-bg) and `shadow-2xl`
              would have overridden the neumorphic shadow since it's
              unlayered. Both removed. */}
          <div className="relative w-full max-w-md rounded-3xl glass-strong p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-fg-muted hover:text-fg p-1.5 rounded-full transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/30">
                <Building size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-fg">
                  Campus IT & Student Support
                </h3>
                <p className="text-xs text-fg-muted">
                  Varin High School Systems Administration
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-fg">
              <SupportRow icon={<Clock size={16} className="text-brand-600" />} label="Helpdesk Office Hours">
                Mon – Fri: 07:00 AM – 05:30 PM (ICT)
                <br />
                Saturday: 07:30 AM – 11:30 AM
              </SupportRow>
              <SupportRow icon={<Phone size={16} className="text-info" />} label="Campus IT Hotline">
                +855 (0) 63 963 800 • Ext. 102 (Registrar) / Ext. 108 (IT)
              </SupportRow>
              <SupportRow icon={<Mail size={16} className="text-brand-600 dark:text-brand-400" />} label="Official Helpdesk Email">
                it-support@varinhigh.edu.kh • registrar@varinhigh.edu.kh
              </SupportRow>

              {/* Semantic warning callout — keeps its tinted border, since
                  yellow-on-yellow would be easy to miss inside the modal. */}
              <div className="p-3.5 rounded-2xl bg-warning/15 border border-warning/30">
                <p className="font-bold text-fg text-xs flex items-center gap-1.5">
                  <Sparkles size={13} className="text-warning" />
                  Forgot credentials or new student enrollment?
                </p>
                <p className="text-fg-muted text-[11px] mt-1 leading-relaxed">
                  Visit the Administrative Office (Building A, Room 102) with
                  your national student ID card, or contact your class homeroom
                  advisor for quick password resets.
                </p>
              </div>
            </div>

            <div className={`mt-5 pt-3 flex justify-end ${SEAM_T}`}>
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition cursor-pointer"
              >
                Close Support
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function SupportRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    // Sunken well inside a raised modal — the classic neumorphic
    // "inset field" pattern. `bg-surface border border-surface` was
    // a no-op (same color as the modal bg on both axes).
    <div className="p-3.5 rounded-2xl shadow-sunken flex items-start gap-3">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="font-bold text-fg">{label}</p>
        <p className="text-fg-muted text-[11px] mt-0.5">{children}</p>
      </div>
    </div>
  )
}