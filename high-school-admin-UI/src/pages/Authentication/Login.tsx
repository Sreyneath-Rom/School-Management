// src/pages/Authentication/Login.tsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle2,
  Lock,
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
import { ApiError, resetSessionExpiry } from '@/lib/apiClient'
import { useTranslations } from '@/i18n'
import { homeForRole } from '@/utils/roleHome'
import type { UserRole } from '@/utils/rolePermissions'

/* ------------------------------------------------------------------ *
 * Role configuration
 * ------------------------------------------------------------------ */

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

const ROLE_ORDER: UserRole[] = [
  'admin',
  'teacher',
  'student',
  'parent',
]

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    id: 'admin',
    title: 'Admin Portal',
    roleSubtitle: 'Administration',
    badge: 'Admin',
    description:
      'Manage school configuration, users, and institutional settings.',
    icon: ShieldCheck,
    identifierLabel: 'Admin Email',
    identifierPlaceholder: 'admin@yourschool.edu',
    accentClass: 'text-brand-600 dark:text-brand-400',
    badgeClass: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
    bglinear:
      'from-brand-500/15 via-brand-500/5 to-transparent',
    btnlinear:
      'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/25',
    ringClass: 'focus:ring-brand-500',
    features: [
      'User management',
      'School setup',
      'Full reports',
    ],
  },

  teacher: {
    id: 'teacher',
    title: 'Teacher Portal',
    roleSubtitle: 'Faculty',
    badge: 'Faculty',
    description:
      'Manage classes, lessons, homework, and student grades.',
    icon: GraduationCap,
    identifierLabel: 'Faculty Email',
    identifierPlaceholder: 'teacher@yourschool.edu',
    accentClass: 'text-success',
    badgeClass: 'bg-success/15 text-success',
    bglinear:
      'from-success/15 via-success/5 to-transparent',
    btnlinear:
      'bg-success hover:opacity-90 text-white shadow-sm shadow-success/25',
    ringClass: 'focus:ring-success',
    features: [
      'Class roster',
      'Grade book',
      'Lesson plans',
    ],
  },

  student: {
    id: 'student',
    title: 'Student Portal',
    roleSubtitle: 'Enrolled',
    badge: 'Scholar',
    description:
      'View lessons, submit homework, and check your grades.',
    icon: BookOpen,
    identifierLabel: 'Student Email',
    identifierPlaceholder: 'student@yourschool.edu',
    accentClass: 'text-info',
    badgeClass: 'bg-info/15 text-info',
    bglinear:
      'from-info/15 via-info/5 to-transparent',
    btnlinear:
      'bg-info hover:opacity-90 text-white shadow-sm shadow-info/25',
    ringClass: 'focus:ring-info',
    features: [
      'Assignments',
      'Timetable',
      'Academic record',
    ],
  },

  parent: {
    id: 'parent',
    title: 'Parent Portal',
    roleSubtitle: 'Guardian',
    badge: 'Guardian',
    description:
      'Track your children’s progress and communicate with the school.',
    icon: Users,
    identifierLabel: 'Guardian Email',
    identifierPlaceholder: 'parent@example.com',
    accentClass: 'text-warning',
    badgeClass: 'bg-warning/15 text-warning',
    bglinear:
      'from-warning/15 via-warning/5 to-transparent',
    btnlinear:
      'bg-warning hover:opacity-90 text-white shadow-sm shadow-warning/25',
    ringClass: 'focus:ring-warning',
    features: [
      'Child progress',
      'Messages',
      'Attendance',
    ],
  },

  mazer: {
    id: 'mazer',
    title: 'Mazer Portal',
    roleSubtitle: 'Class Representative',
    badge: 'Mazer',
    description:
      'Class representative tools for attendance and announcements.',
    icon: Users,
    identifierLabel: 'Mazer Email',
    identifierPlaceholder: 'mazer@yourschool.edu',
    accentClass: 'text-warning',
    badgeClass: 'bg-warning/15 text-warning',
    bglinear:
      'from-warning/15 via-warning/5 to-transparent',
    btnlinear:
      'bg-warning hover:opacity-90 text-white shadow-sm shadow-warning/25',
    ringClass: 'focus:ring-warning',
    features: [
      'Attendance',
      'Announcements',
    ],
  },
}

/* ------------------------------------------------------------------ *
 * School crest
 * ------------------------------------------------------------------ */

function SchoolCrest({
  size = 48,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-linear-to-tr from-brand-700 via-brand-600 to-brand-500 text-white p-2.5 shadow-md shadow-brand-600/25 ring-1 ring-white/15 shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <School2 className="w-full h-full text-white" />

      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-warning text-[8px] font-black text-slate-950 ring-2 ring-surface">
        ★
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Props
 * ------------------------------------------------------------------ */

interface Props {
  initialRole?: UserRole
}

/* ------------------------------------------------------------------ *
 * Login
 * ------------------------------------------------------------------ */

export default function Login({
  initialRole = 'admin',
}: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    login,
    isAuthenticated,
    user,
    logout,
  } = useAuth()

  const { t } = useTranslations()

  const [activeRole, setActiveRole] =
    useState<UserRole>(initialRole)

  const [viewMode, setViewMode] =
    useState<'form' | 'bento'>('form')

  const [identifier, setIdentifier] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [rememberMe, setRememberMe] =
    useState(true)

  const [showPassword, setShowPassword] =
    useState(false)

  const [capsLockActive, setCapsLockActive] =
    useState(false)

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [roleNotice, setRoleNotice] =
    useState('')

  const [isForgotModalOpen, setIsForgotModalOpen] =
    useState(false)

  const redirectTimerRef =
    useRef<ReturnType<typeof window.setTimeout> | null>(null)

  const currentConfig =
    ROLE_CONFIGS[activeRole]

  /* ---------------------------------------------------------------- *
   * Cleanup redirect timer
   * ---------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(
          redirectTimerRef.current,
        )
      }
    }
  }, [])

  /* ---------------------------------------------------------------- *
   * Reset form when role/path changes
   * ---------------------------------------------------------------- */

  useEffect(() => {
    setActiveRole(initialRole)
    setError('')
    setRoleNotice('')
    setIdentifier('')
    setPassword('')
  }, [initialRole, location.pathname])

  /* ---------------------------------------------------------------- *
   * Submit login
   * ---------------------------------------------------------------- */

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
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
      const result = await authService.login(
        identifier.trim(),
        password,
      )

      login(result)

      /*
       * Re-arm session expiry after successful login.
       */
      resetSessionExpiry()

      const actualRole =
        (result.user.role?.toLowerCase() ||
          'admin') as UserRole

      const target =
        homeForRole(actualRole)

      /*
       * If the user selected a different portal from
       * their actual account role, show a message and
       * redirect to the correct portal.
       */
      if (actualRole !== activeRole) {
        setRoleNotice(
          `Your account is registered as ${
            ROLE_CONFIGS[actualRole]?.title ??
            actualRole
          }. Redirecting to your portal…`,
        )

        if (redirectTimerRef.current) {
          window.clearTimeout(
            redirectTimerRef.current,
          )
        }

        redirectTimerRef.current =
          window.setTimeout(() => {
            navigate(target, {
              replace: true,
            })
          }, 1200)
      } else {
        navigate(target, {
          replace: true,
        })
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError(
            'Invalid credentials. Please check your email and password.',
          )
        } else if (err.status === 403) {
          setError(
            'Your account is inactive or suspended. Contact an administrator.',
          )
        } else if (err.status >= 500) {
          setError(
            'The authentication server is unavailable. Please try again shortly.',
          )
        } else {
          setError(
            err.message ||
              'Sign in failed. Please try again.',
          )
        }
      } else {
        setError(
          'Unable to reach the authentication server. Check your connection.',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------------------------------------------------------- *
   * Keyboard handling
   * ---------------------------------------------------------------- */

  const handleKeyDown = (
    e: React.KeyboardEvent,
  ) => {
    if (e.getModifierState) {
      setCapsLockActive(
        e.getModifierState('CapsLock'),
      )
    }
  }

  /* ---------------------------------------------------------------- *
   * Role change
   * ---------------------------------------------------------------- */

  const handleRoleTabChange = (
    role: UserRole,
  ) => {
    setActiveRole(role)
    setError('')
    setRoleNotice('')
    setIdentifier('')
    setPassword('')
    setViewMode('form')
  }

  /* ---------------------------------------------------------------- *
   * Dashboard
   * ---------------------------------------------------------------- */

  const handleGoDashboard = () => {
    if (!user) return

    navigate(
      homeForRole(user.role),
    )
  }

  /* ---------------------------------------------------------------- *
   * Render
   * ---------------------------------------------------------------- */

  return (
    <div className="page-theme min-h-screen flex flex-col justify-between relative overflow-hidden font-sans">
      <AuthBackground
        variant={activeRole}
      />

      <AuthHeader
        activeRole={
          viewMode === 'bento'
            ? 'all'
            : activeRole
        }
        onRoleSelect={(role) => {
          if (role === 'all') {
            setViewMode('bento')
          } else {
            handleRoleTabChange(role)
          }
        }}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* ==========================================================
            SESSION BANNER
        =========================================================== */}

        {isAuthenticated && user && (
          <div className="max-w-4xl mx-auto w-full mb-6 p-4 rounded-2xl bg-success/15 border border-success/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-xs font-bold text-fg">
                  Signed in as {user.name}{' '}
                  ({user.role.toUpperCase()})
                </p>

                <p className="text-[11px] text-fg-muted">
                  You have an active session. Return to
                  your dashboard or sign out below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleGoDashboard}
                className="px-4 py-2 rounded-xl bg-success hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Enter Dashboard</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => logout()}
                className="glass-sm glass-interactive px-3 py-2 rounded-xl text-fg-muted hover:text-fg text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================
            BENTO PORTAL SELECTOR
        =========================================================== */}

        {viewMode === 'bento' && (
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-fg">
                Choose your portal
              </h2>

              <p className="text-sm text-fg-muted mt-1">
                Select the portal that matches your
                role to sign in.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ROLE_ORDER.map((role) => {
                const config =
                  ROLE_CONFIGS[role]

                const RoleIcon =
                  config.icon

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      handleRoleTabChange(role)
                    }
                    className="glass-strong rounded-3xl p-6 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${config.badgeClass}`}
                    >
                      <RoleIcon
                        size={22}
                        className={
                          config.accentClass
                        }
                      />
                    </div>

                    <h3 className="text-base font-bold text-fg">
                      {config.title}
                    </h3>

                    <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                      {config.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400">
                      <span>Sign in</span>
                      <ArrowRight size={14} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================
            LOGIN FORM
        =========================================================== */}

        {viewMode === 'form' && (
          <div className="flex w-full justify-center">
            <div className="w-full max-w-xl">

              <div className="glass-strong rounded-3xl p-6 sm:p-8 lg:p-9">

                {/* --------------------------------------------------
                    FORM HEADER
                --------------------------------------------------- */}

                <div className="flex items-center justify-between mb-5 pb-4 shadow-[0_1px_0_var(--neu-shadow-dark)]">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-fg">
                      Sign in to{' '}
                      {currentConfig.title}
                    </h2>

                    <p className="text-xs text-fg-muted mt-0.5">
                      Enter your school credentials
                      to continue
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/15 px-2.5 py-1 rounded-full shrink-0">
                    <Lock size={11} />
                    Encrypted
                  </span>
                </div>

                {/* --------------------------------------------------
                    ROLE PORTAL
                --------------------------------------------------- */}

                <div className="mb-5">
                  <label className="block text-[11px] font-bold text-fg-muted uppercase tracking-wider mb-2">
                    Role portal
                  </label>

                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl shadow-sunken">
                    {ROLE_ORDER.map((role) => {
                      const config =
                        ROLE_CONFIGS[role]

                      const RoleIcon =
                        config.icon

                      const isSelected =
                        activeRole === role

                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() =>
                            handleRoleTabChange(
                              role,
                            )
                          }
                          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                              : 'text-fg-muted hover:text-fg hover:shadow-sunken'
                          }`}
                        >
                          <RoleIcon
                            size={14}
                            className={
                              isSelected
                                ? 'text-white'
                                : 'currentColor'
                            }
                          />

                          <span className="text-[11px] sm:text-xs truncate">
                            {
                              config.title.split(
                                ' ',
                              )[0]
                            }
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* --------------------------------------------------
                    ROLE NOTICE
                --------------------------------------------------- */}

                {roleNotice && (
                  <div className="mb-5 p-3.5 bg-info/15 border border-info/30 rounded-2xl text-info text-xs font-medium flex items-center gap-2.5">
                    <Info
                      size={16}
                      className="text-info shrink-0"
                    />

                    <span>
                      {roleNotice}
                    </span>
                  </div>
                )}

                {/* --------------------------------------------------
                    ERROR
                --------------------------------------------------- */}

                {error && (
                  <div className="mb-5 p-3.5 bg-error/15 border border-error/30 rounded-2xl text-error text-xs font-medium flex items-center gap-2.5">
                    <AlertCircle
                      size={16}
                      className="text-error shrink-0"
                    />

                    <span>{error}</span>
                  </div>
                )}

                {/* --------------------------------------------------
                    LOGIN FORM
                --------------------------------------------------- */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="login-identifier-input"
                      className="block text-xs font-bold text-fg uppercase tracking-wider mb-1.5"
                    >
                      {currentConfig.identifierLabel}
                    </label>

                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-fg-muted z-10">
                        <Mail size={18} />
                      </span>

                      <input
                        id="login-identifier-input"
                        type="email"
                        name="identifier"
                        placeholder={
                          currentConfig.identifierPlaceholder
                        }
                        value={identifier}
                        onChange={(e) =>
                          setIdentifier(
                            e.target.value,
                          )
                        }
                        onKeyDown={handleKeyDown}
                        autoComplete="username"
                        className={`w-full pl-11 pr-10 py-3 rounded-2xl text-fg text-sm focus:outline-none focus:ring-2 ${currentConfig.ringClass} transition`}
                      />

                      {identifier && (
                        <button
                          type="button"
                          onClick={() =>
                            setIdentifier('')
                          }
                          className="absolute right-3.5 top-3.5 text-fg-muted hover:text-fg p-0.5 rounded-full transition cursor-pointer"
                          aria-label="Clear email"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password */}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password-input"
                        className="block text-xs font-bold text-fg uppercase tracking-wider"
                      >
                        {t('auth.password') ||
                          'Password'}
                      </label>

                      {capsLockActive && (
                        <span className="text-[10px] font-bold text-warning flex items-center gap-1">
                          <AlertCircle size={11} />
                          Caps Lock
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-fg-muted z-10">
                        <Lock size={18} />
                      </span>

                      <input
                        id="login-password-input"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        name="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value,
                          )
                        }
                        onKeyDown={handleKeyDown}
                        autoComplete="current-password"
                        className={`w-full pl-11 pr-11 py-3 rounded-2xl text-fg text-sm focus:outline-none focus:ring-2 ${currentConfig.ringClass} transition`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword,
                          )
                        }
                        className="absolute right-3.5 top-3.5 text-fg-muted hover:text-fg p-0.5 transition cursor-pointer"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeClosed size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-fg-muted select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                          setRememberMe(
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 rounded accent-brand-500 cursor-pointer"
                      />

                      <span>
                        Remember this device
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setIsForgotModalOpen(
                          true,
                        )
                      }
                      className="text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer ${currentConfig.btnlinear} ${
                      isLoading
                        ? 'opacity-70 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                        <span>
                          Verifying...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Sign In
                        </span>

                        <ArrowRight
                          size={16}
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* --------------------------------------------------
                    SUPPORT FOOTER
                --------------------------------------------------- */}

                <div className="mt-6 pt-5 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-start gap-3 text-xs text-fg-muted">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sunken">
                    <Building2 size={16} />
                  </div>

                  <div className="leading-relaxed">
                    <p className="font-bold text-fg">
                      Need help signing in?
                    </p>

                    <p className="text-[11px] text-fg-muted mt-0.5">
                      Contact the IT support office
                      at{' '}

                      <a
                        href="mailto:it-support@varinhigh.edu.kh"
                        className="font-medium text-brand-600 dark:text-brand-400 hover:underline"
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
      </main>

      {/* ============================================================
          FORGOT PASSWORD MODAL
      ============================================================= */}

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() =>
          setIsForgotModalOpen(false)
        }
        roleName={currentConfig.title}
        defaultIdentifier={identifier}
      />
    </div>
  )
}