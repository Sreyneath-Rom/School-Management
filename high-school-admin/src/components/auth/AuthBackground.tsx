import {
  GraduationCap,
  ScrollText,
  Tag,
  Calculator,
  BookOpen,
  FlaskConical,
  Compass,
  Sparkles,
  TrendingUp,
  School,
} from 'lucide-react'

type AuthBackgroundVariant = 'admin' | 'student' | 'teacher'

const variantIconColor: Record<AuthBackgroundVariant, string> = {
  admin: 'text-teal-500',
  student: 'text-emerald-400',
  teacher: 'text-emerald-400',
}

/**
 * Shared decorative background for auth screens: gradient blobs,
 * two floating "notification card" shapes, and role-specific
 * outline icons scattered in the corners.
 */
export default function AuthBackground({ variant }: { variant: AuthBackgroundVariant }) {
  const iconColor = variantIconColor[variant]

  return (
    <>
      {/* Background Circles */}
      {/* Background Circles */}
      <div className="absolute -left-40 bottom-55 w-162 h-162 rounded-full glass-teal"></div>

      <div className="absolute -right-40 -bottom-40 w-155 h-155 rounded-full glass-org"></div>

      <div className="absolute right-80 top-55 w-65 h-65 rounded-full glass-teal"></div>

      <div className="absolute left-82 top-55 w-65 h-65 rounded-full  glass-org"></div>

      {/* Gradient blobs */}
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[rgba(255,159,0,0.5)] rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[rgba(5,136,151,0.5)] rounded-full blur-3xl" />

      {/* Floating notification cards (shared across all auth screens) */}
      <div className="absolute top-[27%] left-[13%] w-44 h-16 rounded-2xl glass-sm flex items-center gap-2 px-4">
        <Sparkles size={18} className="text-teal-500 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded-full glass-strong" />
          <div className="h-1.5 w-1/2 rounded-full glass-strong" />
        </div>
      </div>
      <div className="absolute top-[36%] left-[16%] w-52 h-14 rounded-2xl glass-sm flex items-center gap-2 px-4">
        <TrendingUp size={18} className="text-amber-500 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-full rounded-full glass-strong" />
        </div>
      </div>
    <div className="absolute bottom-[36%] right-[16%] w-44 h-16 rounded-2xl glass-sm flex items-center gap-2 px-4">
        <GraduationCap size={18} className="text-teal-500 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded-full glass-strong" />
          <div className="h-1.5 w-1/2 rounded-full glass-strong" />
        </div>
      </div>
      <div className="absolute bottom-[27%] right-[13%] w-52 h-14 rounded-2xl glass-sm flex items-center gap-2 px-4">
        <School size={18} className="text-amber-500 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-full rounded-full glass-strong" />
        </div>
      </div>
      {/* Role-specific corner icons (skip entirely for admin, which has none) */}
      {variant === 'student' && (
        <>
          <GraduationCap
            className={`absolute top-8 left-10 w-14 h-14 ${iconColor} opacity-70 animate-[float_5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
          />
          <ScrollText
            className={`absolute top-56 right-16 w-12 h-12 ${iconColor} opacity-70 animate-[float_4.5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
            style={{ animationDelay: '0.6s' }}
          />
          <Calculator
            className={`absolute bottom-24 left-6 w-14 h-14 ${iconColor} opacity-70 animate-[float_5.5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
            style={{ animationDelay: '1.2s' }}
          />
          <BookOpen
            className={`absolute bottom-16 right-24 w-16 h-16 ${iconColor} opacity-70 animate-[float_5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
            style={{ animationDelay: '1.8s' }}
          />
        </>
      )}

      {variant === 'teacher' && (
        <>
          <BookOpen
            className={`absolute top-6 left-6 w-14 h-14 ${iconColor} opacity-70 animate-[float_5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
          />
          <FlaskConical
            className={`absolute top-32 right-24 w-12 h-12 ${iconColor} opacity-70 animate-[float_4.5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
            style={{ animationDelay: '0.6s' }}
          />
          <Compass
            className={`absolute bottom-16 left-8 w-12 h-12 ${iconColor} opacity-70 animate-[float_5.5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
            style={{ animationDelay: '1.2s' }}
          />
          <Tag
            className={`absolute bottom-24 right-10 w-14 h-14 ${iconColor} opacity-70 animate-[float_5s_ease-in-out_infinite]`}
            strokeWidth={1.5}
            style={{ animationDelay: '1.8s' }}
          />
        </>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }
      `}</style>
    </>
  )
}