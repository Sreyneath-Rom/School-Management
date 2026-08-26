import {
  GraduationCap,
  ScrollText,
  Calculator,
  BookOpen,
  FlaskConical,
  Compass,
  Sparkles,
  TrendingUp,
  School,
  ShieldCheck,
  Users,
  Award,
} from 'lucide-react';

export type AuthBackgroundVariant = 'admin' | 'student' | 'teacher' | 'parent';

interface Props {
  variant: AuthBackgroundVariant;
}

export default function AuthBackground({ variant }: Props) {
  const themeConfig = {
    admin: {
      blob1: 'bg-blue-500/20 dark:bg-blue-600/15',
      blob2: 'bg-indigo-500/20 dark:bg-indigo-600/15',
      blob3: 'bg-cyan-500/15 dark:bg-cyan-600/10',
      iconColor: 'text-blue-500/40 dark:text-blue-400/30',
      glow: 'shadow-blue-500/10',
    },
    teacher: {
      blob1: 'bg-emerald-500/20 dark:bg-emerald-600/15',
      blob2: 'bg-teal-500/20 dark:bg-teal-600/15',
      blob3: 'bg-green-500/15 dark:bg-green-600/10',
      iconColor: 'text-emerald-500/40 dark:text-emerald-400/30',
      glow: 'shadow-emerald-500/10',
    },
    student: {
      blob1: 'bg-purple-500/20 dark:bg-purple-600/15',
      blob2: 'bg-violet-500/20 dark:bg-violet-600/15',
      blob3: 'bg-pink-500/15 dark:bg-pink-600/10',
      iconColor: 'text-purple-500/40 dark:text-purple-400/30',
      glow: 'shadow-purple-500/10',
    },
    parent: {
      blob1: 'bg-amber-500/20 dark:bg-amber-600/15',
      blob2: 'bg-orange-500/20 dark:bg-orange-600/15',
      blob3: 'bg-rose-500/15 dark:bg-rose-600/10',
      iconColor: 'text-amber-500/40 dark:text-amber-400/30',
      glow: 'shadow-amber-500/10',
    },
  }[variant];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Background Soft Mesh Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/90 via-slate-50/70 to-slate-200/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500" />

      {/* Dynamic Animated Blobs */}
      <div
        className={`absolute -top-24 -left-24 w-96 h-96 sm:w-[32rem] sm:h-[32rem] rounded-full blur-3xl ${themeConfig.blob1} animate-pulse`}
        style={{ animationDuration: '8s' }}
      />
      <div
        className={`absolute -bottom-24 -right-24 w-96 h-96 sm:w-[36rem] sm:h-[36rem] rounded-full blur-3xl ${themeConfig.blob2} animate-pulse`}
        style={{ animationDuration: '10s', animationDelay: '1s' }}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full blur-3xl ${themeConfig.blob3}`}
      />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Role-Specific Decorative Outline Icons */}
      {variant === 'admin' && (
        <>
          <ShieldCheck className={`absolute top-16 left-12 w-16 h-16 ${themeConfig.iconColor} hidden lg:block animate-bounce`} style={{ animationDuration: '6s' }} />
          <Award className={`absolute bottom-24 left-16 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
          <School className={`absolute top-28 right-20 w-16 h-16 ${themeConfig.iconColor} hidden lg:block`} />
          <TrendingUp className={`absolute bottom-20 right-28 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
        </>
      )}

      {variant === 'teacher' && (
        <>
          <BookOpen className={`absolute top-16 left-12 w-16 h-16 ${themeConfig.iconColor} hidden lg:block animate-bounce`} style={{ animationDuration: '6s' }} />
          <FlaskConical className={`absolute bottom-24 left-16 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
          <GraduationCap className={`absolute top-28 right-20 w-16 h-16 ${themeConfig.iconColor} hidden lg:block`} />
          <Compass className={`absolute bottom-20 right-28 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
        </>
      )}

      {variant === 'student' && (
        <>
          <GraduationCap className={`absolute top-16 left-12 w-16 h-16 ${themeConfig.iconColor} hidden lg:block animate-bounce`} style={{ animationDuration: '6s' }} />
          <Calculator className={`absolute bottom-24 left-16 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
          <ScrollText className={`absolute top-28 right-20 w-16 h-16 ${themeConfig.iconColor} hidden lg:block`} />
          <Sparkles className={`absolute bottom-20 right-28 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
        </>
      )}

      {variant === 'parent' && (
        <>
          <Users className={`absolute top-16 left-12 w-16 h-16 ${themeConfig.iconColor} hidden lg:block animate-bounce`} style={{ animationDuration: '6s' }} />
          <School className={`absolute bottom-24 left-16 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
          <Sparkles className={`absolute top-28 right-20 w-16 h-16 ${themeConfig.iconColor} hidden lg:block`} />
          <TrendingUp className={`absolute bottom-20 right-28 w-14 h-14 ${themeConfig.iconColor} hidden md:block`} />
        </>
      )}
    </div>
  );
}
