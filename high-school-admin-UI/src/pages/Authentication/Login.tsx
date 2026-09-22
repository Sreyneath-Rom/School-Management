import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe2,
  Mail,
  Eye,
  EyeClosed,
  AlertCircle,
  X,
  Building2,
  School2,
  Info,
  type LucideIcon,
} from 'lucide-react'

import AuthBackground from '@/components/auth/AuthBackground'
import AuthHeader from '@/components/auth/AuthHeader'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import { ApiError } from '@/lib/apiClient'
import { useTranslations } from '@/i18n'
import { homeForRole } from '@/utils/roleHome'
import type { UserRole } from '@/utils/rolePermissions'

/**
 * Demo accounts used by the "1-Click Instant Sign In" button and shown in
 * the credentials strip. These MUST match what `authService.loginAs` sends,
 * and what `prisma/seed.ts` creates. If the seed changes, change both.
 *
 * Hidden entirely in production — `authService.loginAs` throws in PROD.
 */
const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string }> = {
  admin: { email: 'admin@example.com', password: 'password' },
  teacher: { email: 'teacher@example.com', password: 'password' },
  student: { email: 'student@example.com', password: 'password' },
  parent: { email: 'parent@example.com', password: 'password' },
  mazer: { email: 'admin@example.com', password: 'password' },
}

const DEMO_MODE = !import.meta.env.PROD

interface RoleConfig {
  id: UserRole
  title: string
  roleSubtitle: string
  badge: string
  description: string
  icon: LucideIcon
  identifierLabel: string
  identifierPlaceholder: string
  accentClass: string
  badgeClass: string
  bglinear: string
  btnlinear: string
  ringClass: string
  features: string[]
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    id: 'admin',
    title: 'Administrator',
    roleSubtitle: 'Executive Governance & SIS Operations',
    badge: 'Admin Portal',
    description:
      'Oversee institutional operations, faculty governance, admissions, financial schedules, and KPI reporting.',
    icon: ShieldCheck,
    identifierLabel: 'Administrator Email',
    identifierPlaceholder: 'admin@example.com',
    accentClass: 'text-blue-600 dark:text-blue-400',
    badgeClass:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    bglinear: 'from-blue-600 to-indigo-700',
    btnlinear:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25',
    ringClass: 'focus:ring-blue-500 focus:border-blue-500',
    features: [
      'Institutional KPIs and financial reporting',
      'Staff, contracts, and student admissions',
      'Role-based permissions and audit trail',
    ],
  },
  teacher: {
    id: 'teacher',
    title: 'Teacher',
    roleSubtitle: 'Classroom Roll Call, Grading & Curriculum',
    badge: 'Teacher Portal',
    description:
      'Take class roll call, record period grades, publish lesson plans, and manage quizzes and assignments.',
    icon: GraduationCap,
    identifierLabel: 'Teacher Email',
    identifierPlaceholder: 'teacher@example.com',
    accentClass: 'text-emerald-600 dark:text-emerald-400',
    badgeClass:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    bglinear: 'from-emerald-600 to-teal-700',
    btnlinear:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25',
    ringClass: 'focus:ring-emerald-500 focus:border-emerald-500',
    features: [
      'Digital attendance roll call',
      'Continuous assessment and gradebook entry',
      'Lesson plans, homework, and quiz delivery',
    ],
  },
  student: {
    id: 'student',
    title: 'Student',
    roleSubtitle: 'Academic Timetable & Learning Hub',
    badge: 'Student Portal',
    description:
      'View your timetable, submit assignments, review grades and report cards, and track attendance.',
    icon: BookOpen,
    identifierLabel: 'Student Email',
    identifierPlaceholder: 'student@example.com',
    accentClass: 'text-purple-600 dark:text-purple-400',
    badgeClass:
      'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    bglinear: 'from-purple-600 to-indigo-700',
    btnlinear:
      'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25',
    ringClass: 'focus:ring-purple-500 focus:border-purple-500',
    features: [
      'Daily schedule and classroom finder',
      'Homework submission and teacher feedback',
      'Report cards, GPA, and attendance history',
    ],
  },
  parent: {
    id: 'parent',
    title: 'Parent & Guardian',
    roleSubtitle: 'Student Attendance & Progress Monitor',
    badge: 'Parent Portal',
    description:
      "Monitor your child's attendance, review grades, and stay in touch with homeroom teachers.",
    icon: Users,
    identifierLabel: 'Parent Email',
    identifierPlaceholder: 'parent@example.com',
    accentClass: 'text-amber-600 dark:text-amber-400',
    badgeClass:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    bglinear: 'from-amber-600 to-orange-700',
    btnlinear:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/25',
    ringClass: 'focus:ring-amber-500 focus:border-amber-500',
    features: [
      'Attendance and campus arrival notifications',
      'Direct messaging with homeroom teacher',
      'Grade cards, fee receipts, and school calendar',
    ],
  },
  mazer: {
    id: 'mazer',
    title: 'Mazer Administrator',
    roleSubtitle: 'System Administration & Global Management',
    badge: 'Mazer Portal',
    description:
      'Manage high-level administrative tasks, global SIS features, system configuration, and operations.',
    icon: ShieldCheck,
    identifierLabel: 'Administrator Email',
    identifierPlaceholder: 'admin@example.com',
    accentClass: 'text-amber-600 dark:text-amber-400',
    badgeClass:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    bglinear: 'from-amber-600 to-indigo-700',
    btnlinear:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/25',
    ringClass: 'focus:ring-amber-500 focus:border-amber-500',
    features: [
      'Institutional administration',
      'Advanced permissions and configuration',
      'Unified portal access',
    ],
  },
}

const ROLE_ORDER: UserRole[] = ['admin', 'teacher', 'student', 'parent']

function SchoolCrest({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-linear-to-tr from-slate-900 via-teal-900 to-slate-900 dark:from-slate-800 dark:via-teal-950 dark:to-slate-800 text-white p-2.5 shadow-xl border border-teal-500/30 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <School2 className="w-full h-full text-teal-300" />
      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-slate-950 ring-2 ring-white dark:ring-slate-900">
        ★
      </span>
    </div>
  )
}

interface Props {
  initialRole?: UserRole
}

export default function Login({ initialRole = 'admin' }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user, logout } = useAuth()
  const { t } = useTranslations()

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole)
  const [viewMode, setViewMode] = useState<'form' | 'bento'>('form')

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [roleNotice, setRoleNotice] = useState('')
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)

  useEffect(() => {
    setActiveRole(initialRole)
    setError('')
    setRoleNotice('')
    // Clear the identifier when the role changes — the previous email is
    // role-specific and would fail validation on a different portal.
    setIdentifier('')
    setPassword('')
  }, [initialRole, location.pathname])

  const handleAutoFill = (role: UserRole = activeRole) => {
    const account = DEMO_ACCOUNTS[role]
    setIdentifier(account.email)
    setPassword(account.password)
    setError('')
    setRoleNotice('')
  }

  const handleInstantLogin = async (role: UserRole = activeRole) => {
    setIsLoading(true)
    setError('')
    setRoleNotice('')
    try {
      const result = await authService.loginAs(role)
      login(result)
      navigate(homeForRole(role), { replace: true })
    } catch {
      setError('Demo sign-in is unavailable. Please use the form with a real account.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier.trim()) {
      setError('Please enter your email.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsLoading(true)
    setError('')
    setRoleNotice('')

    try {
      const result = await authService.login(identifier.trim(), password)
      login(result)

      const actualRole = (result.user.role?.toLowerCase() || 'admin') as UserRole
      const target = homeForRole(actualRole)

      if (actualRole !== activeRole) {
        // The backend verified the account's real role and it differs from
        // the portal the user picked. Tell them, then redirect to the
        // correct dashboard after a short pause so the notice is readable.
        setRoleNotice(
          `This account is a ${ROLE_CONFIGS[actualRole].title}. Redirecting to your dashboard...`
        )
        window.setTimeout(() => {
          navigate(target, { replace: true })
        }, 750)
      } else {
        navigate(target, { replace: true })
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Invalid credentials. Please check your email and password.')
        } else if (err.status === 403) {
          setError('Your account is inactive or suspended. Contact an administrator.')
        } else if (err.status >= 500) {
          setError('The authentication server is unavailable. Please try again shortly.')
        } else {
          setError(err.message || 'Sign in failed. Please try again.')
        }
      } else {
        setError('Unable to reach the authentication server. Check your connection.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'))
    }
  }

  const currentConfig = ROLE_CONFIGS[activeRole] ?? ROLE_CONFIGS.admin
  const currentDemo = DEMO_ACCOUNTS[activeRole]

  const handleRoleTabChange = (role: UserRole) => {
    setActiveRole(role)
    setError('')
    setRoleNotice('')
    setIdentifier('')
    setPassword('')
    setViewMode('form')
  }

  const handleGoDashboard = () => {
    if (!user) return
    navigate(homeForRole(user.role))
  }

  const Icon = currentConfig.icon

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-50/80 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <AuthBackground variant={activeRole} />

      <AuthHeader
        activeRole={viewMode === 'bento' ? 'all' : activeRole}
        onRoleSelect={(r) => {
          if (r === 'all') setViewMode('bento')
          else handleRoleTabChange(r)
        }}
      />

      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto w-full">
        {isAuthenticated && user && (
          <div className="max-w-4xl mx-auto w-full mb-6 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Signed in as {user.name} ({user.role.toUpperCase()})
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  You have an active session. Return to your dashboard or sign out below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleGoDashboard}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <span>Enter Dashboard</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {viewMode === 'form' && (
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left column: branding, role context, demo strip */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Secondary Academic Portal
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <SchoolCrest size={56} />
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                      Varin High School
                    </h1>
                    <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                      Siem Reap, Cambodia
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {currentConfig.description}
                </p>
              </div>

              {/* Role capabilities — no fabricated numbers, just what the
                  portal actually offers. */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div
                    className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${currentConfig.accentClass}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentConfig.title} capabilities
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {currentConfig.roleSubtitle}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {currentConfig.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2
                        size={14}
                        className={`${currentConfig.accentClass} shrink-0 mt-0.5`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {DEMO_MODE && (
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Zap size={14} className="text-amber-500 fill-amber-500" />
                      Demo credentials ({currentConfig.title})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAutoFill(activeRole)}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Auto-fill
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <div className="font-mono text-slate-600 dark:text-slate-300 text-[11px] space-y-0.5">
                      <p>
                        Email:{' '}
                        <strong className="text-slate-900 dark:text-white">
                          {currentDemo.email}
                        </strong>
                      </p>
                      <p>
                        Password:{' '}
                        <strong className="text-slate-900 dark:text-white">
                          {currentDemo.password}
                        </strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInstantLogin(activeRole)}
                      disabled={isLoading}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition shadow-sm whitespace-nowrap disabled:opacity-50"
                    >
                      <Zap size={13} className="text-amber-400 fill-amber-400" />
                      <span>Instant demo sign-in</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right column: form */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xl border border-slate-200/90 dark:border-slate-800">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Sign in to {currentConfig.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Enter your school credentials to continue
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
                    <Lock size={11} />
                    Encrypted
                  </span>
                </div>

                <div className="mb-5">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Role portal
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70">
                    {ROLE_ORDER.map((r) => {
                      const cfg = ROLE_CONFIGS[r]
                      const RoleIcon = cfg.icon
                      const isSelected = activeRole === r
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleTabChange(r)}
                          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <RoleIcon
                            size={14}
                            className={isSelected ? cfg.accentClass : 'currentColor'}
                          />
                          <span className="text-[11px] sm:text-xs truncate">
                            {cfg.title.split(' ')[0]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {roleNotice && (
                  <div className="mb-5 p-3.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 rounded-2xl text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-2.5">
                    <Info size={16} className="text-blue-600 shrink-0" />
                    <span>{roleNotice}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-2xl text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2.5">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-identifier-input"
                      className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                      {currentConfig.identifierLabel}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-slate-400">
                        <Mail size={18} />
                      </span>
                      <input
                        id="login-identifier-input"
                        type="email"
                        name="identifier"
                        placeholder={currentConfig.identifierPlaceholder}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        autoComplete="username"
                        className={`w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 ${currentConfig.ringClass} transition`}
                      />
                      {identifier && (
                        <button
                          type="button"
                          onClick={() => setIdentifier('')}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                          aria-label="Clear email"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password-input"
                        className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                      >
                        {t('auth.password') || 'Password'}
                      </label>
                      {capsLockActive && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle size={11} />
                          Caps Lock
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-slate-400">
                        <Lock size={18} />
                      </span>
                      <input
                        id="login-password-input"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="current-password"
                        className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 ${currentConfig.ringClass} transition`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Remember this device</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${currentConfig.btnlinear} ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in as {currentConfig.title}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                    <Building2 size={16} />
                  </div>
                  <div className="leading-relaxed">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Need help signing in?
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Contact the IT support office at{' '}
                      <a
                        href="mailto:it-support@varinhigh.edu.kh"
                        className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        it-support@varinhigh.edu.kh
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'bento' && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold mb-3">
                <School2 size={14} />
                <span>Varin High School Information System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Portal Directory
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Select your role to sign in{DEMO_MODE ? ' or use instant demo access.' : '.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ROLE_ORDER.map((r) => {
                const cfg = ROLE_CONFIGS[r]
                const RoleIcon = cfg.icon
                return (
                  <div
                    key={r}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition duration-300 group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-linear-to-tr ${cfg.bglinear} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                        >
                          <RoleIcon size={28} />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {cfg.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">
                        {cfg.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                        {cfg.roleSubtitle}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {cfg.description}
                      </p>

                      <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 mb-6">
                        {cfg.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                          >
                            <CheckCircle2
                              size={13}
                              className={`${cfg.accentClass} shrink-0 mt-0.5`}
                            />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleRoleTabChange(r)}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${cfg.btnlinear}`}
                      >
                        <span>Open {cfg.title} sign in</span>
                        <ArrowRight size={14} />
                      </button>

                      {DEMO_MODE && (
                        <button
                          type="button"
                          onClick={() => handleInstantLogin(r)}
                          disabled={isLoading}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                        >
                          <Zap size={12} className="text-amber-500 fill-amber-500" />
                          <span>Instant demo sign-in</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Trust strip — text only, no fabricated claims */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <Lock size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Encrypted transport
            </span>
            <span className="text-[10px] text-slate-500">HTTPS end-to-end</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Role-based access
            </span>
            <span className="text-[10px] text-slate-500">Server-enforced RBAC</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <Smartphone size={18} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Responsive design
            </span>
            <span className="text-[10px] text-slate-500">Phone, tablet, desktop</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <Globe2 size={18} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Multilingual
            </span>
            <span className="text-[10px] text-slate-500">English, Khmer, and more</span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} Varin High School. Siem Reap, Cambodia.
          All rights reserved.
        </p>
      </footer>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        roleName={currentConfig.title}
        defaultIdentifier={identifier}
      />
    </div>
  )
}