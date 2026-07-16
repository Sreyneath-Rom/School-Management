import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks';
import { isValidEmail } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { mockLogin } from '@/data/mockUsers';
import AuthBackground from '@/components/auth/AuthBackground';
import { Eye, LockKeyhole, Mail, Sliders, EyeClosed } from 'lucide-react';
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
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit, setFieldError } =
    useForm<AdminLoginForm>(
      { email: '', password: '', rememberMe: false },
      async (values: AdminLoginForm) => {
        setIsLoading(true);
        setError('');
        try {
          if (!values.email.trim()) {
            setFieldError('email', 'Email is required');
            return;
          }
          if (!isValidEmail(values.email)) {
            setFieldError('email', 'Invalid email address');
            return;
          }
          if (!values.password) {
            setFieldError('password', 'Password is required');
            return;
          }

          const user = mockLogin(values.email, values.password);
          if (!user) {
            setError('Invalid email or password');
            return;
          }
          if (user.role !== 'admin') {
            setError('This account is not an admin account');
            return;
          }

          login(user);
          navigate('/dashboard', { replace: true });
        } catch (err) {
          setError('Login failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    );

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground variant="admin" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center">
              <Sliders size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Varin High School</h1>
          <p className="text-slate-700 text-sm mt-1">SCHOOL MANAGEMENT SYSTEM</p>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Login to your account</h2>
          <p className="text-slate-700 text-center text-sm mb-6">Welcome back! Please enter your details.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-700">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@school.edu"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-2.5 glass-strong rounded-[28px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-700">
                  <LockKeyhole size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-12 py-2.5 glass-strong rounded-[28px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
                 <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-700 hover:text-slate-900">
                  {showPassword ? (
                    <EyeClosed size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-teal-500 rounded"
                />
                <span className="text-sm text-gray-600">Remember Me</span>
              </label>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">AUTHORIZED ACCESS ONLY</p>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
              Contact your administrator.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}