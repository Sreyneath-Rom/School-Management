import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks';
import { isValidEmail } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { mockLogin, getUserGreeting } from '@/data/mockUsers';
import AuthBackground from '@/components/auth/AuthBackground';
import Button from '@/components/common/Button';
import { Eye, EyeClosed, Lock, School, User } from 'lucide-react';

interface StudentLoginForm {
  studentId: string;
  password: string;
  rememberDevice: boolean;
}

export default function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState<string | null>(null);
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

  // Look up the student's name live as they type their ID/email, so the
  // welcome heading can greet them by name before they've submitted.
  useEffect(() => {
    setDisplayName(getUserGreeting(values.studentId));
  }, [values.studentId]);

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground variant="student" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center">
              <School size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Varin High School</h1>
          <p className="text-gray-600 text-sm mt-1">Student Portal</p>
        </div>

        <div className="glass-sm rounded-[28px] p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Welcome Back{displayName ? `, ${displayName}` : ''}
          </h2>
          <p className="text-slate-700 text-center text-sm mb-6">Please enter your credentials to access the student portal.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Student ID or Email</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-700">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="studentId"
                  placeholder="e.g. STU123456"
                  value={values.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-2.5 glass-strong rounded-[28px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
              {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-700">
                  <Lock size={18} />
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
                  name="rememberDevice"
                  checked={values.rememberDevice}
                  onChange={handleChange}
                  className="w-4 h-4 glass-strong rounded-[28px] focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
                <span className="text-sm text-slate-700">Remember this device</span>
              </label>
              <a href="#" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                Forgot Password?
              </a>
            </div>
            <Button variant="solid" type="submit" disabled={isLoading} className="w-full py-3 rounded-2xl text-white font-semibold transition disabled:opacity-70">
              {isLoading ? 'Logging in...' : 'Login'}

            </Button>

          </form>

          <p className="text-center text-sm text-slate-700 mt-4">
            Issues accessing your account?{' '}
            <a href="#" className="text-sky-600 hover:text-sky-700 font-medium">
              Contact IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}