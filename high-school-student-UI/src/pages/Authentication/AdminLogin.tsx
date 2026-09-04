import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks';
import { isValidEmail } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/i18n';
import { authService } from '@/services/authService';
import AuthBackground from '@/components/auth/AuthBackground';
import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import {
  Eye,
  EyeClosed,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Zap,
  Lock,
  Building2,
  Users2,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/common/Button';

interface AdminLoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useForm<AdminLoginForm>(
      { email: '', password: '', rememberMe: false },
      async (formValues: AdminLoginForm) => {
        setIsLoading(true);
        setError('');
        try {
          const result = await authService.login(formValues.email.trim(), formValues.password);
          if (result.user.role !== 'admin') {
            setError(t('auth.notAdminAccount') || 'This account does not have administrator privileges');
            return;
          }

          login(result);
          navigate('/dashboard', { replace: true });
        } catch {
          setError(t('auth.loginFailed') || 'Login failed. Please verify credentials or use demo login.');
        } finally {
          setIsLoading(false);
        }
      },
      (formValues) => {
        const validationErrors: Record<string, string> = {};
        if (!formValues.email.trim()) {
          validationErrors.email = t('auth.emailRequired') || 'Admin email is required';
        } else if (!isValidEmail(formValues.email)) {
          validationErrors.email = t('auth.invalidEmail') || 'Please enter a valid school email address';
        }
        if (!formValues.password) {
          validationErrors.password = t('auth.passwordRequired') || 'Password is required';
        }
        return validationErrors;
      }
    );

  const handleQuickFill = () => {
    setFieldValue('email', 'admin@example.com');
    setFieldValue('password', 'password');
  };

  const handleDirectDemoLogin = () => {
    const result = authService.loginAsRole('admin');
    login(result);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-50/60 dark:bg-slate-950 font-sans">
      <AuthBackground variant="admin" />
      <AuthHeader activeRole="admin" />

      {/* Main Responsive Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Showcase Panel (Visible on Desktop / Tablet landscape) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-slate-800 dark:text-slate-200">
            {/* Header Badge */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 mb-4 shadow-sm">
                <ShieldCheck size={15} className="text-blue-600 dark:text-blue-400" />
                <span>Executive Management Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Institutional Control & Analytics
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Centralized administration for faculty rosters, student admissions, financial auditing, and institution-wide performance metrics.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Dashboards</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Track attendance rates, revenue, and academic KPI charts live.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                  <Users2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Staff & Student Management</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Complete control over employee contracts, classes, and admissions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enterprise Governance</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Role-based access control with audited security logging.</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Info Box */}
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Zap size={14} className="text-blue-600" />
                  Admin Demo Credentials
                </span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 hover:underline"
                >
                  Auto-Fill
                </button>
              </div>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-0.5">
                <p>Email: <strong className="text-slate-900 dark:text-white">admin@example.com</strong></p>
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
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Admin Sign In
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Varin High School Administrative Console
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  <Lock size={12} className="text-blue-500" />
                  SSL Encrypted
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
                    {t('auth.emailAddress') || 'Email Address'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="admin@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {t('auth.password') || 'Password'}
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
                      className="w-full pl-11 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                      name="rememberMe"
                      checked={values.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-600 rounded border-slate-300"
                    />
                    <span>{t('auth.rememberMe') || 'Remember this device'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t('auth.forgotPassword') || 'Forgot Password?'}
                  </button>
                </div>

                {/* Submit Sign In Button */}
                <Button
                  variant="solid"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{t('auth.login') || 'Sign In to Administrator Portal'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>

                {/* 1-Click Instant Demo Login */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDirectDemoLogin}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Zap size={14} className="text-blue-600" />
                    <span>⚡ 1-Click Instant Admin Demo Login</span>
                  </button>
                </div>
              </form>

              {/* Bottom Switcher */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Looking for another portal?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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
        <p>© {new Date().getFullYear()} Varin High School. All rights reserved. • Enterprise Administrative System</p>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        roleName="Administrator"
        defaultIdentifier={values.email}
      />
    </div>
  );
}
