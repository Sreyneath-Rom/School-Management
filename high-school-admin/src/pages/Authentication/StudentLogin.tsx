import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks';
import { isValidEmail } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { mockLogin } from '@/data/mockUsers';
import AuthBackground from '@/components/auth/AuthBackground';

interface StudentLoginForm {
  studentId: string;
  password: string;
  rememberDevice: boolean;
}

export default function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit, setFieldError } =
    useForm<StudentLoginForm>(
      { studentId: '', password: '', rememberDevice: false },
      async (values: StudentLoginForm) => {
        setIsLoading(true);
        setError('');
        try {
          if (!values.studentId.trim()) {
            setFieldError('studentId', 'Student ID or Email is required');
            return;
          }
          if (values.studentId.includes('@') && !isValidEmail(values.studentId)) {
            setFieldError('studentId', 'Invalid email address');
            return;
          }
          if (!values.password) {
            setFieldError('password', 'Password is required');
            return;
          }

          const user = mockLogin(values.studentId, values.password);
          if (!user) {
            setError('Invalid credentials');
            return;
          }
          if (user.role !== 'student') {
            setError('This account is not a student account');
            return;
          }

          login(user);
          navigate('/student/dashboard', { replace: true });
        } catch (err) {
          setError('Login failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-100 via-white to-amber-100 flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground variant="student" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747C22 10.998 17.5 6.253 12 6.253z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Varin High School</h1>
          <p className="text-gray-600 text-sm mt-1">Student Portal</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back, Student</h2>
          <p className="text-gray-600 text-center text-sm mb-6">Access your classroom management dashboard</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student ID or Email</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="studentId"
                  placeholder="e.g. STU123456"
                  value={values.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
              {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
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
            Having trouble?{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
              Contact your parent/guardian
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}