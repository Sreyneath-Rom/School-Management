import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks';
import { isValidEmail } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { mockLogin } from '@/data/mockUsers';
import AuthBackground from '@/components/auth/AuthBackground';

interface TeacherLoginForm {
  teacherId: string;
  password: string;
  rememberDevice: boolean;
}

export default function TeacherLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit, setFieldError } =
    useForm<TeacherLoginForm>(
      { teacherId: '', password: '', rememberDevice: false },
      async (values: TeacherLoginForm) => {
        setIsLoading(true);
        setError('');
        try {
          if (!values.teacherId.trim()) {
            setFieldError('teacherId', 'Teacher ID or Email is required');
            return;
          }
          if (values.teacherId.includes('@') && !isValidEmail(values.teacherId)) {
            setFieldError('teacherId', 'Invalid email address');
            return;
          }
          if (!values.password) {
            setFieldError('password', 'Password is required');
            return;
          }

          const user = mockLogin(values.teacherId, values.password);
          if (!user) {
            setError('Invalid credentials');
            return;
          }
          if (user.role !== 'teacher') {
            setError('This account is not a teacher account');
            return;
          }

          login(user);
          navigate('/teacher/dashboard', { replace: true });
        } catch (err) {
          setError('Login failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-100 via-white to-amber-100 flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground variant="teacher" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Varin High School</h1>
          <p className="text-gray-600 text-sm mt-1">Teacher Portal</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back, Educator</h2>
          <p className="text-gray-600 text-center text-sm mb-6">Access your classroom management dashboard</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher ID or Email</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m0 0h5a2 2 0 002-2V8a2 2 0 00-2-2h-5m0 0V5a2 2 0 10-4 0v1m4 0a1 1 0 10-4 0m0 0H3m0 0h18" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="teacherId"
                  placeholder="e.g. TCH-123456"
                  value={values.teacherId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
              {errors.teacherId && <p className="text-red-500 text-xs mt-1">{errors.teacherId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberDevice"
                  checked={values.rememberDevice}
                  onChange={handleChange}
                  className="w-4 h-4 accent-teal-500 rounded"
                />
                <span className="text-sm text-gray-600">Remember this device</span>
              </label>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Issues accessing your account?{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
              Contact IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}