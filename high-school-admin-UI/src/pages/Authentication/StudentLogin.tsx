import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks';
import { isValidEmail } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { getUserGreeting } from '@/data/mockUsers';
import AuthBackground from '@/components/auth/AuthBackground';
import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import Button from '@/components/common/Button';
import {
  Eye,
  EyeClosed,
  LockKeyhole,
  User,
  BookOpen,
  Zap,
  GraduationCap,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface StudentLoginForm {
  email: string;
  password: string;
  rememberDevice: boolean;
}

export default function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useForm<StudentLoginForm>(
      { email: '', password: '', rememberDevice: false },
      async (formValues: StudentLoginForm) => {
        setIsLoading(true);
        setError('');
        try {
          const result = await authService.login(formValues.email.trim(), formValues.password);
          if (result.user.role !== 'student') {
            setError('This account is not a student account');
            return;
          }

          login(result);
          navigate('/student/dashboard', { replace: true });
        } catch {
          setError('Login failed. Please verify your credentials or use quick demo login.');
        } finally {
          setIsLoading(false);
        }
      },
      (formValues) => {
        const validationErrors: Record<string, string> = {};
        if (!formValues.email.trim()) {
          validationErrors.email = 'Email is required';
        } else if (!isValidEmail(formValues.email)) {
          validationErrors.email = 'Please enter a valid email address';
        }
        if (!formValues.password) {
          validationErrors.password = 'Password is required';
        }
        return validationErrors;
      }
    );

  const displayName = getUserGreeting(values.email);

  const handleQuickFill = () => {
    setFieldValue('email', 'student@example.com');
    setFieldValue('password', 'password');
  };

  const handleDirectDemoLogin = () => {
    const result = authService.loginAsRole('student');
    login(result);
    navigate('/student/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-50/60 dark:bg-slate-950 font-sans">
      <AuthBackground variant="student" />
      <AuthHeader activeRole="student" />

      {/* Main Responsive Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Showcase Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-slate-800 dark:text-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800 mb-4 shadow-sm">
                <BookOpen size={15} className="text-purple-600 dark:text-purple-400" />
                <span>Student Academic & Learning Hub</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Your Studies, Grades & Campus Life
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Check class timetables, review homework assignments, view upcoming exam dates, and inspect your cumulative GPA records.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Class Timetable & Periods</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Daily room schedules, teacher contacts, and bell timetables.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Grade Reports & Transcripts</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant access to midterm scores, semester rankings, and teacher notes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Assignments & Exam Schedule</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Download assignment rubrics and monitor deadline count-downs.</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Info Box */}
            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Zap size={14} className="text-purple-600" />
                  Student Demo Credentials
                </span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 hover:underline"
                >
                  Auto-Fill
                </button>
              </div>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-0.5">
                <p>Email: <strong className="text-slate-900 dark:text-white">student@example.com</strong></p>
                <p>Password: <strong className="text-slate-900 dark:text-white">password</strong></p>
              </div>
            </div>
          </div>

          {/* Right / Login Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/60 dark:border-slate-800 transition-all">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                    <BookOpen size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Student Sign In
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {displayName ? (
                        <span className="text-purple-600 font-semibold flex items-center gap-1">
                          <Sparkles size={13} />
                          Welcome back, {displayName}!
                        </span>
                      ) : (
                        'Enter your school email address.'
                      )}
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  <GraduationCap size={13} className="text-purple-500" />
                  Student Portal
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    School Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      type="email"
                      name="email"
                      placeholder="student@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="username"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
                      <LockKeyhole size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="current-password"
                      className="w-full pl-11 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.password}</p>}
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                    <input
                      type="checkbox"
                      name="rememberDevice"
                      checked={values.rememberDevice}
                      onChange={handleChange}
                      className="w-4 h-4 accent-purple-600 rounded border-slate-300"
                    />
                    <span>Remember this device</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Sign In Button */}
                <Button
                  variant="solid"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-2xl transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In as Student</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>

                {/* 1-Click Instant Demo Login */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDirectDemoLogin}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Zap size={14} className="text-purple-600" />
                    <span>⚡ 1-Click Instant Student Demo Login</span>
                  </button>
                </div>
              </form>

              {/* Bottom Switcher */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Looking for teacher or parent portal?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    View All Portals
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Varin High School. All rights reserved. • Student Academic Information System</p>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        roleName="Student"
        defaultIdentifier={values.email}
      />
    </div>
  );
}
