import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  LayoutGrid,
  Check,
  X,
  Building2,
  Sparkles,
  TrendingUp,
  Clock,
  Calendar,
  LogOut,
  ChevronRight,
  CheckCheck,
  School2,
  Info,
  Award,
  BookMarked,
  Layers,
  Phone,
  Compass,
} from 'lucide-react';
import AuthBackground from '@/components/auth/AuthBackground';
import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { ApiError } from '@/lib/apiClient';
import { useTranslations } from '@/i18n/useTranslations';
import type { UserRole } from '@/utils/rolePermissions';

interface Props {
  initialRole?: UserRole;
}

interface RoleConfig {
  id: UserRole;
  title: string;
  roleSubtitle: string;
  badge: string;
  description: string;
  icon: typeof ShieldCheck;
  demoEmail: string;
  demoPassword: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  accentClass: string;
  badgeClass: string;
  bglinear: string;
  btnlinear: string;
  ringClass: string;
  features: string[];
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    id: 'admin',
    title: 'Administrator',
    roleSubtitle: 'Executive Governance & SIS Operations',
    badge: 'Admin Portal',
    description:
      'Oversee institutional operations, faculty governance, admissions, financial schedules, and real-time KPI metrics.',
    icon: ShieldCheck,
    demoEmail: 'admin@example.com',
    demoPassword: 'password',
    identifierLabel: 'Administrator Email or Staff ID',
    identifierPlaceholder: 'admin@example.com or ADM-2025',
    accentClass: 'text-blue-600 dark:text-blue-400',
    badgeClass:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    bglinear: 'from-blue-600 to-indigo-700',
    btnlinear:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25',
    ringClass: 'focus:ring-blue-500 focus:border-blue-500',
    features: [
      'Real-Time Institutional KPIs & Financial Reporting',
      'Staff Payroll, Contracts & Student Admissions',
      'Audited System Governance & Role-Based Permissions',
    ],
  },
  teacher: {
    id: 'teacher',
    title: 'Teacher',
    roleSubtitle: 'Classroom Roll Call, Grading & Curriculum',
    badge: 'Teacher Portal',
    description:
      'Conduct 1-click class roll calls, record weighted midterm marks, update curriculum lesson plans, and manage quizzes.',
    icon: GraduationCap,
    demoEmail: 'teacher@varinhigh.edu.kh',
    demoPassword: 'password',
    identifierLabel: 'Teacher ID or School Email',
    identifierPlaceholder: 'teacher@varinhigh.edu.kh or TCH-104',
    accentClass: 'text-emerald-600 dark:text-emerald-400',
    badgeClass:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    bglinear: 'from-emerald-600 to-teal-700',
    btnlinear:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25',
    ringClass: 'focus:ring-emerald-500 focus:border-emerald-500',
    features: [
      'Digital Attendance Roll Call with SMS Alert Integration',
      'Continuous Assessment & Semester Gradebook Entry',
      'Curriculum Lesson Plans, Homework & Quiz Delivery',
    ],
  },
  student: {
    id: 'student',
    title: 'Student',
    roleSubtitle: 'Academic Timetable & Learning Hub',
    badge: 'Student Portal',
    description:
      'Access your daily timetable, submit digital course assignments, review exam transcripts, and track attendance records.',
    icon: BookOpen,
    demoEmail: 'student@varinhigh.edu.kh',
    demoPassword: 'password',
    identifierLabel: 'Student ID or School Email',
    identifierPlaceholder: 'student@varinhigh.edu.kh or STU-2026-089',
    accentClass: 'text-purple-600 dark:text-purple-400',
    badgeClass:
      'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    bglinear: 'from-purple-600 to-indigo-700',
    btnlinear:
      'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25',
    ringClass: 'focus:ring-purple-500 focus:border-purple-500',
    features: [
      'Interactive Daily Schedule & Classroom Room Finder',
      'Homework Submissions & Teacher Feedback Review',
      'Official Report Cards, GPA Tracker & National Exam Prep',
    ],
  },
  parent: {
    id: 'parent',
    title: 'Parent & Guardian',
    roleSubtitle: 'Student Attendance & Progress Monitor',
    badge: 'Parent Portal',
    description:
      'Monitor your child’s live classroom attendance, review quarterly grade cards, and stay connected with homeroom teachers.',
    icon: Users,
    demoEmail: 'parent@varinhigh.edu.kh',
    demoPassword: 'password',
    identifierLabel: 'Parent Email or Registered Phone',
    identifierPlaceholder: 'parent@varinhigh.edu.kh or +855 12 345 678',
    accentClass: 'text-amber-600 dark:text-amber-400',
    badgeClass:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    bglinear: 'from-amber-600 to-orange-700',
    btnlinear:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/25',
    ringClass: 'focus:ring-amber-500 focus:border-amber-500',
    features: [
      'Instant Morning Attendance & Campus Arrival Alerts',
      'Direct Messaging Channel with Class Homeroom Teacher',
      'School Fee Payment Receipts, Events & Academic Calendar',
    ],
  },
};

/**
 * Distinguished High School Crest Component
 */
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
  );
}

export default function Login({ initialRole = 'admin' }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslations();

  // Active Role and View Mode
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [viewMode, setViewMode] = useState<'form' | 'bento'>('form');

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [roleNotice, setRoleNotice] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Sync state if initialRole prop changes
  useEffect(() => {
    setActiveRole(initialRole);
    setError('');
    setRoleNotice('');
  }, [initialRole, location.pathname]);

  // Quick fill demo credentials
  const handleAutoFill = (role: UserRole = activeRole) => {
    const config = ROLE_CONFIGS[role];
    setIdentifier(config.demoEmail);
    setPassword(config.demoPassword);
    setError('');
    setRoleNotice('');
  };

  // 1-Click Instant Demo Login
  const handleInstantLogin = async (role: UserRole = activeRole) => {
    setIsLoading(true);
    setError('');
    setRoleNotice('');
    try {
      const result = await authService.loginAs(role);
      login(result);
      const target =
        role === 'admin'
          ? '/admin/dashboard'
          : role === 'teacher'
          ? '/teacher/dashboard'
          : role === 'student'
          ? '/student/dashboard'
          : '/parent/dashboard';
      navigate(target, { replace: true });
    } catch {
      setError('Unable to perform demo sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Standard Form Submission adhering strictly to Functional Flow Specification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Section 7.1: Empty Identifier Validation
    if (!identifier.trim()) {
      setError('Please enter your email or school ID.');
      return;
    }

    // Section 7.2: Empty Password Validation
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError('');
    setRoleNotice('');

    try {
      // Step 5: Send POST /api/v1/auth/login
      const result = await authService.login(identifier.trim(), password);

      // Store the token before validating the profile so /auth/me can send it.
      login(result);

      // Step 8: Verify profile via GET /api/v1/auth/me
      let verifiedUser = result.user;
      try {
        const profile = await authService.me();
        if (profile) verifiedUser = profile;
      } catch (profileErr) {
        console.warn('Profile fetch note:', profileErr);
      }

      // Step 7: Store session in auth context & storage
      login({ ...result, user: verifiedUser });

      // Step 9 & Section 7.5: Verify Role Authorization & segregated redirection
      const actualRole = (verifiedUser.role?.toLowerCase() || 'admin') as UserRole;
      const target =
        actualRole === 'admin'
          ? '/admin/dashboard'
          : actualRole === 'teacher'
          ? '/teacher/dashboard'
          : actualRole === 'student'
          ? '/student/dashboard'
          : '/parent/dashboard';

      if (actualRole !== activeRole) {
        // Section 7.5 Incorrect Role Selection:
        // The backend verifies the user's actual role and redirects to the authorized dashboard
        setRoleNotice(
          `Account verified as ${actualRole.toUpperCase()}. Redirecting to your authorized ${
            ROLE_CONFIGS[actualRole]?.title || actualRole
          } dashboard...`
        );
        setTimeout(() => {
          navigate(target, { replace: true });
        }, 750);
      } else {
        navigate(target, { replace: true });
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          // Section 7.3: Invalid credentials
          setError('Invalid credentials. Please verify your email or school ID and password.');
        } else if (err.status === 403) {
          // Section 7.4: Inactive or suspended account
          setError('Your account is currently inactive or suspended. Please contact the school administrator.');
        } else if (err.status >= 500) {
          // Section 7.6: Backend unavailable
          setError('Unable to connect to the authentication server. Please check your network connection and try again.');
        } else {
          setError(err.message || 'Invalid credentials. Please verify your email or school ID and password.');
        }
      } else if (err?.message && (err.message.includes('fetch') || err.message.includes('Network'))) {
        setError('Unable to connect to the authentication server. Please check your network connection and try again.');
      } else {
        setError('Invalid credentials. Please verify your email or school ID and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isCaps = e.getModifierState && e.getModifierState('CapsLock');
    setCapsLockActive(isCaps);
  };

  const currentConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.admin;

  const handleRoleTabChange = (role: UserRole) => {
    setActiveRole(role);
    setError('');
    setRoleNotice('');
    setViewMode('form');
  };

  const handleGoDashboard = () => {
    if (!user) return;
    const target =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'teacher'
        ? '/teacher/dashboard'
        : user.role === 'student'
        ? '/student/dashboard'
        : '/parent/dashboard';
    navigate(target);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-50/80 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Background Atmosphere */}
      <AuthBackground variant={activeRole} />

      {/* Global Header Bar with Language, Theme, IT Support */}
      <AuthHeader
        activeRole={viewMode === 'bento' ? 'all' : activeRole}
        onRoleSelect={(r) => {
          if (r === 'all') {
            setViewMode('bento');
          } else {
            handleRoleTabChange(r);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto w-full">
        {/* Active Session Notice (if user is already logged in) */}
        {isAuthenticated && user && (
          <div className="max-w-4xl mx-auto w-full mb-6 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Currently Signed In as {user.name} ({user.role.toUpperCase()})
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  You have an active session. You can return to your dashboard or switch roles below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="active-session-enter-dashboard-btn"
                onClick={handleGoDashboard}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Enter Dashboard</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                id="active-session-logout-btn"
                onClick={() => logout()}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* View Mode 1: Redesigned Asymmetric Focus Sign-In */}
        {viewMode === 'form' && (
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Prestigious Institutional Showcase & Contextual Live Pulse */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              {/* Institutional Branding */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Official Secondary Academic Portal
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    • AY 2025–2026
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <SchoolCrest size={56} />
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                      Varin High School
                    </h1>
                    <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                      វិទ្យាល័យ វ៉ារិន • Siem Reap, Cambodia
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {currentConfig.description}
                </p>
              </div>

              {/* Dynamic Role Intelligence Spotlight */}
              <div
                id="role-spotlight-card"
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg transition-all"
              >
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${currentConfig.accentClass}`}>
                      <currentConfig.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {activeRole === 'admin'
                          ? 'Institutional Governance & SIS Summary'
                          : activeRole === 'teacher'
                          ? 'Today’s Classroom & Attendance Cockpit'
                          : activeRole === 'student'
                          ? 'Student Scholar Academic Status'
                          : 'Child Attendance & Progress Hub'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {currentConfig.roleSubtitle}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE
                  </span>
                </div>

                {/* Role Specific Live Metrics Preview */}
                {activeRole === 'admin' && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-[11px] text-slate-500 font-medium">Total Enrollment</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">1,420</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">↑ 4.2% YoY Increase</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-[11px] text-slate-500 font-medium">Daily Attendance</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">97.8%</p>
                      <span className="text-[10px] text-slate-400 font-semibold">86/86 Faculty Present</span>
                    </div>
                  </div>
                )}

                {activeRole === 'teacher' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Period 3: Grade 10-A Biology</p>
                        <p className="text-[11px] text-slate-500">Science Wing Room 204 • 10:15 AM</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                        31/32 Present
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>4 Midterm Lab Reports ready for final grading</span>
                      <span className="font-semibold text-emerald-600">Auto-Synced</span>
                    </div>
                  </div>
                )}

                {activeRole === 'student' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Sophea Chan (Grade 11-B)</p>
                        <p className="text-[11px] text-slate-500">Science & Technology Track</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-purple-600 dark:text-purple-400">3.92 GPA</p>
                        <span className="text-[10px] text-emerald-600 font-bold">Honor Roll</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Next: Advanced Calculus (Room 102)</span>
                      <span className="font-semibold text-purple-600">Starts in 25m</span>
                    </div>
                  </div>
                )}

                {activeRole === 'parent' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Dara Sok (Grade 9-A)</p>
                        <p className="text-[11px] text-slate-500">Homeroom: Mr. Vannak Keo</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Present (07:22 AM)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Recent Exam: Chemistry Midterm</span>
                      <span className="font-bold text-amber-600">94% (Grade A)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 1-Click Instant Demo Credentials Strip */}
              <div
                id="quick-demo-access-strip"
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500 fill-amber-500" />
                    Quick Testing Credentials ({currentConfig.title})
                  </span>
                  <button
                    type="button"
                    id="autofill-credentials-btn"
                    onClick={() => handleAutoFill(activeRole)}
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Auto-Fill Form
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="font-mono text-slate-600 dark:text-slate-300 text-[11px] space-y-0.5">
                    <p>
                      ID / Email: <strong className="text-slate-900 dark:text-white">{currentConfig.demoEmail}</strong>
                    </p>
                    <p>
                      Password: <strong className="text-slate-900 dark:text-white">{currentConfig.demoPassword}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    id="instant-demo-signin-btn"
                    onClick={() => handleInstantLogin(activeRole)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <Zap size={13} className="text-amber-400 fill-amber-400" />
                    <span>⚡ 1-Click Instant Sign In</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Pristine, Elevated Authentication Card */}
            <div className="lg:col-span-6">
              <div
                id="one-screen-login-card"
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xl border border-slate-200/90 dark:border-slate-800 transition-all"
              >
                {/* School Card Header & Security Badge */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Sign In to {currentConfig.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Enter your verified school credentials to continue
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
                    <Lock size={11} />
                    SSL 256-Bit
                  </span>
                </div>

                {/* Role Switcher Pill Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Select Role Portal
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      Step 1 of 2
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70">
                    {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => {
                      const cfg = ROLE_CONFIGS[r];
                      const Icon = cfg.icon;
                      const isSelected = activeRole === r;
                      return (
                        <button
                          key={r}
                          id={`card-role-tab-${r}`}
                          type="button"
                          onClick={() => handleRoleTabChange(r)}
                          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <Icon size={14} className={isSelected ? cfg.accentClass : 'currentColor'} />
                          <span className="text-[11px] sm:text-xs truncate">{cfg.title.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Role Verification / Mismatch Notice (Section 7.5) */}
                {roleNotice && (
                  <div
                    id="role-mismatch-notice"
                    className="mb-5 p-3.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 rounded-2xl text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in"
                  >
                    <Info size={16} className="text-blue-600 shrink-0" />
                    <span>{roleNotice}</span>
                  </div>
                )}

                {/* Error Banner (Section 4 & Section 7) */}
                {error && (
                  <div
                    id="login-error-banner"
                    className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-2xl text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in"
                  >
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Redesigned Authentication Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
                  {/* Identifier Input */}
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
                        type="text"
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
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full cursor-pointer"
                          aria-label="Clear field"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password Input */}
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
                          Caps Lock is On
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
                        id="login-toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                      <input
                        type="checkbox"
                        id="login-remember-checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      <span>Remember this device</span>
                    </label>

                    <button
                      type="button"
                      id="login-forgot-password-link"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Main Sign In Button */}
                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.99] ${currentConfig.btnlinear} ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In as {currentConfig.title}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Help Information Area */}
                <div
                  id="login-help-info"
                  className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                    <Building2 size={16} />
                  </div>
                  <div className="leading-relaxed">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Need help accessing your school portal?
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Contact the IT Support Office at{' '}
                      <a
                        href="mailto:it-support@varinhigh.edu.kh"
                        className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        it-support@varinhigh.edu.kh
                      </a>{' '}
                      • Ext. 102 (Room 102).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Bento Grid View (All 4 Portals Side-by-Side) */}
        {viewMode === 'bento' && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold mb-3">
                <School2 size={14} />
                <span>Varin High School Information System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Unified Portal Directory
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Select your institutional role below to sign in or explore with 1-click instant demo access.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => {
                const cfg = ROLE_CONFIGS[r];
                const Icon = cfg.icon;
                return (
                  <div
                    key={r}
                    id={`bento-card-${r}`}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition duration-300 group"
                  >
                    <div>
                      {/* Badge & Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-linear-to-tr ${cfg.bglinear} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                        >
                          <Icon size={28} />
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
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={13} className={`${cfg.accentClass} shrink-0`} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleRoleTabChange(r)}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${cfg.btnlinear}`}
                      >
                        <span>Open {cfg.title} Sign In</span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInstantLogin(r)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Zap size={12} className="text-amber-500 fill-amber-500" />
                        <span>⚡ 1-Click Instant Demo</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Security & Institutional Trust Strip */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <Lock size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">256-Bit SSL Protection</span>
            <span className="text-[10px] text-slate-500">End-to-End Encrypted</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Role Segregation</span>
            <span className="text-[10px] text-slate-500">Audited RBAC Data Access</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <Smartphone size={18} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Adaptive Responsive</span>
            <span className="text-[10px] text-slate-500">Phone, Tablet & Desktop</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
            <Globe2 size={18} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">MoEYS Verified</span>
            <span className="text-[10px] text-slate-500">Curriculum Compliance</span>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} Varin High School. Siem Reap, Cambodia. All rights reserved. • Unified Secondary School Management System
        </p>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        roleName={currentConfig.title}
        defaultIdentifier={identifier}
      />
    </div>
  );
}
