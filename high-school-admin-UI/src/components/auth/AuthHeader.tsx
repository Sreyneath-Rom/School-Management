import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School2,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  LayoutGrid,
  CheckCircle2,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  X,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Building,
  LogOut,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react';
import type { UserRole } from '@/utils/rolePermissions';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/i18n/useTranslations';

interface Props {
  activeRole?: UserRole | 'all';
  onRoleSelect?: (role: UserRole | 'all') => void;
}

const SUPPORTED_LANGS = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'fr', name: 'Français', native: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', native: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch', flag: '🇩🇪' },
];

export default function AuthHeader({ activeRole = 'all', onRoleSelect }: Props) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useTranslations();
  const { isAuthenticated, user, logout } = useAuth();
  const isDark = theme === 'dark';

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    { id: 'all', label: 'All Portals', icon: LayoutGrid, color: 'text-slate-500' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-blue-500' },
    { id: 'teacher', label: 'Faculty', icon: GraduationCap, color: 'text-emerald-500' },
    { id: 'student', label: 'Student', icon: BookOpen, color: 'text-purple-500' },
    { id: 'parent', label: 'Parent', icon: Users, color: 'text-amber-500' },
  ] as const;

  const currentLangObj =
    SUPPORTED_LANGS.find((l) => l.code === language) || SUPPORTED_LANGS[0];

  const handleGoDashboard = () => {
    if (!user) return;
    const target =
      user.role === 'admin'
        ? '/dashboard'
        : user.role === 'teacher'
        ? '/teacher/dashboard'
        : user.role === 'student'
        ? '/student/dashboard'
        : '/parent/dashboard';
    navigate(target);
  };

  return (
    <header className="w-full relative z-30 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand Identity & Campus Location */}
        <div
          id="auth-brand-logo"
          onClick={() => handleRoleClick('all')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleRoleClick('all');
          }}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-all">
            <School2 size={22} className="sm:size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Varin High School
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 dark:bg-teal-400/15 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                <CheckCircle2 size={10} className="text-teal-600 dark:text-teal-400" />
                <span>AY 2025–2026</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1">
                <MapPin size={10} className="text-rose-500" />
                Siem Reap, Cambodia
              </span>
              <span>•</span>
              <span>Unified Academic Portal</span>
            </div>
          </div>
        </div>

        {/* Center / Portal Tabs Navigation */}
        <nav
          aria-label="Role Portals Navigation"
          className="flex items-center gap-1 p-1 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs max-w-full overflow-x-auto scrollbar-none"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRole === item.id;
            return (
              <button
                key={item.id}
                id={`nav-role-${item.id}`}
                type="button"
                onClick={() => handleRoleClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                <Icon size={14} className={isActive ? 'currentColor' : item.color} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Active User Info, Language, Theme, Helpdesk */}
        <div className="flex items-center gap-2">
          {/* Active Session Chip (if logged in) */}
          {isAuthenticated && user && (
            <div className="hidden lg:flex items-center gap-2 pl-2 pr-1 py-1 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">{user.firstName || user.name}</span>
              <button
                type="button"
                onClick={handleGoDashboard}
                className="px-2 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition"
              >
                <span>Dashboard</span>
                <ArrowRight size={12} />
              </button>
              <button
                type="button"
                onClick={() => logout()}
                title="Sign out of current account"
                className="p-1 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-300 transition"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              id="auth-lang-btn"
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition cursor-pointer"
              aria-expanded={isLangOpen}
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-medium">{currentLangObj.native}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center gap-1.5">
                  <Globe size={12} />
                  <span>Choose Language / ភាសា</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {SUPPORTED_LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                        language === lang.code
                          ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/40'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <div>
                          <p className="font-semibold text-xs leading-none">{lang.native}</p>
                          <p className="text-[10px] text-slate-400 leading-none mt-0.5">{lang.name}</p>
                        </div>
                      </span>
                      {language === lang.code && <CheckCircle2 size={13} className="text-teal-600 dark:text-teal-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="auth-theme-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="w-9 h-9 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs transition cursor-pointer"
          >
            {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
          </button>

          {/* Campus Support Helpdesk Button */}
          <button
            id="auth-support-btn"
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/10 dark:bg-teal-400/10 hover:bg-teal-600/20 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <HelpCircle size={14} className="text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">IT Helpdesk</span>
          </button>
        </div>
      </div>

      {/* Campus IT Support Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
                <Building size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Campus IT & Student Support
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Varin High School Systems Administration
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                <Clock size={16} className="text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Helpdesk Office Hours</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Mon – Fri: 07:00 AM – 05:30 PM (ICT)<br />
                    Saturday: 07:30 AM – 11:30 AM
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                <Phone size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Campus IT Hotline</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    +855 (0) 63 963 800 • Ext. 102 (Registrar) / Ext. 108 (IT Support)
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                <Mail size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Official Helpdesk Email</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    it-support@varinhigh.edu.kh • registrar@varinhigh.edu.kh
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/70">
                <p className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-600" />
                  Forgot credentials or new student enrollment?
                </p>
                <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-1 leading-relaxed">
                  Visit the Administrative Office (Building A, Room 102) with your national student ID card or contact your class homeroom advisor for quick password resets.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Close Support
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
