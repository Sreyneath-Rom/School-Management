import { useState } from 'react';
import AdminLogin from './AdminLogin';
import StudentLogin from './StudentLogin';
import TeacherLogin from './TeacherLogin';
import ParentLogin from './ParentLogin';
import {
  School2,
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
  Sparkles,
} from 'lucide-react';
import AuthBackground from '@/components/auth/AuthBackground';
import AuthHeader from '@/components/auth/AuthHeader';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '@/utils/rolePermissions';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInstantLogin = (role: UserRole) => {
    const result = authService.loginAsRole(role);
    login(result);
    const target =
      role === 'admin'
        ? '/dashboard'
        : role === 'teacher'
        ? '/teacher/dashboard'
        : role === 'student'
        ? '/student/dashboard'
        : '/parent/dashboard';
    navigate(target, { replace: true });
  };

  if (selectedRole === 'admin') {
    return <AdminLogin />;
  }

  if (selectedRole === 'teacher') {
    return <TeacherLogin />;
  }

  if (selectedRole === 'student') {
    return <StudentLogin />;
  }

  if (selectedRole === 'parent') {
    return <ParentLogin />;
  }

  const rolePortals = [
    {
      id: 'admin' as UserRole,
      title: 'Administrator',
      roleSubtitle: 'Management & Analytics',
      description: 'Oversee school-wide operations, staff rosters, student enrollment, and financial metrics.',
      icon: ShieldCheck,
      iconBg: 'bg-blue-600 text-white',
      cardHover: 'hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-blue-500/10',
      badge: 'Admin Portal',
      badgeStyle: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      btnStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
      demoEmail: 'admin@example.com',
      features: [
        'Institutional KPI Dashboards',
        'Staff & Student Admissions',
        'Audit & System Governance',
      ],
    },
    {
      id: 'teacher' as UserRole,
      title: 'Faculty & Teacher',
      roleSubtitle: 'Classroom & Grading',
      description: 'Record class attendance, manage course gradebooks, submit terms, and track assignments.',
      icon: GraduationCap,
      iconBg: 'bg-emerald-600 text-white',
      cardHover: 'hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-500/10',
      badge: 'Faculty Portal',
      badgeStyle: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      demoEmail: 'teacher@example.com',
      features: [
        '1-Click Attendance Roster',
        'Automated Weighted Grading',
        'Course Schedules & Exams',
      ],
    },
    {
      id: 'student' as UserRole,
      title: 'Student',
      roleSubtitle: 'Learning & Dashboard',
      description: 'View daily timetables, monitor homework assignments, view exam results, and check GPA.',
      icon: BookOpen,
      iconBg: 'bg-purple-600 text-white',
      cardHover: 'hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-purple-500/10',
      badge: 'Student Portal',
      badgeStyle: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20',
      demoEmail: 'student@example.com',
      features: [
        'Interactive Class Timetable',
        'Grade Reports & Transcripts',
        'Assignment Deadlines & Tasks',
      ],
    },
    {
      id: 'parent' as UserRole,
      title: 'Parent & Guardian',
      roleSubtitle: 'Family & Progress',
      description: 'Track your child’s academic scores, verify real-time attendance, and message teachers.',
      icon: Users,
      iconBg: 'bg-amber-500 text-white',
      cardHover: 'hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-amber-500/10',
      badge: 'Parent Portal',
      badgeStyle: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      demoEmail: 'parent@example.com',
      features: [
        'Live Attendance Alerts',
        'Quarterly Progress Cards',
        'Teacher Direct Messaging',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-50/60 dark:bg-slate-950 font-sans">
      <AuthBackground variant="admin" />
      <AuthHeader activeRole="all" onRoleSelect={(r) => (r === 'all' ? setSelectedRole(null) : setSelectedRole(r))} />

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-teal-600 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/20 ring-4 ring-white/80 dark:ring-slate-800/80">
              <School2 size={36} className="sm:size-10" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3 shadow-xs">
            <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
            <span>Varin High School Unified Academic System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Choose Your Dedicated Portal
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Select your institution role below to securely sign in to your dashboard, manage courses, track student growth, and access school services.
          </p>

          {/* 1-Click Quick Demo Access Bar */}
          <div className="mt-6 p-2 sm:p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm inline-flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 px-2">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              1-Click Demo Login:
            </span>
            <button
              type="button"
              onClick={() => handleInstantLogin('admin')}
              className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 transition shadow-xs flex items-center gap-1"
            >
              <ShieldCheck size={13} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('teacher')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition shadow-xs flex items-center gap-1"
            >
              <GraduationCap size={13} />
              Teacher
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('student')}
              className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 transition shadow-xs flex items-center gap-1"
            >
              <BookOpen size={13} />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('parent')}
              className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 transition shadow-xs flex items-center gap-1"
            >
              <Users size={13} />
              Parent
            </button>
          </div>
        </div>

        {/* Responsive Role Portals Bento Grid (1 col on mobile, 2 col on tablet, 4 col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rolePortals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                id={`portal-card-${portal.id}`}
                onClick={() => setSelectedRole(portal.id)}
                className={`group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/70 dark:border-slate-800 shadow-xl ${portal.cardHover} hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 ${portal.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <Icon size={28} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${portal.badgeStyle}`}>
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {portal.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    {portal.roleSubtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {portal.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 mb-6">
                    {portal.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom CTA */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRole(portal.id);
                    }}
                    className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition ${portal.btnStyle}`}
                  >
                    <span>Sign In as {portal.title}</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Demo: <code className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{portal.demoEmail}</code>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Feature Badges Ribbon */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40">
            <Lock size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">256-Bit SSL Protection</span>
            <span className="text-[10px] text-slate-500">End-to-End Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Role-Based Access</span>
            <span className="text-[10px] text-slate-500">4 Segregated Portals</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40">
            <Smartphone size={18} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Responsive on All Devices</span>
            <span className="text-[10px] text-slate-500">Mobile, Tablet, Desktop</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40">
            <Globe2 size={18} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">FERPA & GDPR Compliant</span>
            <span className="text-[10px] text-slate-500">Privacy & Data Protected</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Varin High School. All rights reserved. • High School Information & Management Portal</p>
      </footer>
    </div>
  );
}
