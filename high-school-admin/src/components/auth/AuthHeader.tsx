import { useNavigate } from 'react-router-dom';
import { School2, ShieldCheck, GraduationCap, BookOpen, Users, LayoutGrid, CheckCircle2 } from 'lucide-react';
import type { UserRole } from '@/utils/rolePermissions';

interface Props {
  activeRole?: UserRole | 'all';
  onRoleSelect?: (role: UserRole | 'all') => void;
}

export default function AuthHeader({ activeRole = 'all', onRoleSelect }: Props) {
  const navigate = useNavigate();

  const handleRoleClick = (role: UserRole | 'all') => {
    if (onRoleSelect) {
      onRoleSelect(role);
      return;
    }
    if (role === 'all') {
      navigate('/login');
    } else if (role === 'admin') {
      navigate('/login/admin');
    } else if (role === 'teacher') {
      navigate('/login/teacher');
    } else if (role === 'student') {
      navigate('/login/student');
    } else if (role === 'parent') {
      navigate('/login/parent');
    }
  };

  const navItems = [
    { id: 'all', label: 'All Portals', icon: LayoutGrid, color: 'text-slate-600' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-blue-600' },
    { id: 'teacher', label: 'Teacher', icon: GraduationCap, color: 'text-emerald-600' },
    { id: 'student', label: 'Student', icon: BookOpen, color: 'text-purple-600' },
    { id: 'parent', label: 'Parent', icon: Users, color: 'text-amber-600' },
  ] as const;

  return (
    <header className="w-full relative z-20 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleRoleClick('all')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-tr from-teal-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <School2 size={22} className="sm:size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                Varin High School
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={10} />
                Live Portal
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Unified Academic Management System
            </p>
          </div>
        </div>

        {/* Role Navigation Switcher Pills */}
        <nav
          aria-label="Role Portals Navigation"
          className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm max-w-full overflow-x-auto scrollbar-none"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRole === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleRoleClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : item.color} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
