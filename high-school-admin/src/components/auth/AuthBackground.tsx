import {
  GraduationCap,
  Tag,
  Calculator,
  BookOpen,
  FlaskConical,
  Compass,
  Sparkles,
  TrendingUp,
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
      {/* Gradient blobs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-teal-100 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-100 rounded-full opacity-20 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-teal-50 rounded-full opacity-25 blur-3xl" />

      {/* Floating notification cards (shared across all auth screens) */}
      <div className="absolute top-[27%] left-[13%] w-44 h-16 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm flex items-center gap-2 px-4">
        <Sparkles size={18} className="text-teal-500 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded-full bg-slate-300/70" />
          <div className="h-1.5 w-1/2 rounded-full bg-slate-300/70" />
        </div>
      </div>
      <div className="absolute top-[36%] left-[16%] w-52 h-14 rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm flex items-center gap-2 px-4">
        <TrendingUp size={18} className="text-amber-500 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-slate-300/70" />
        </div>
      </div>

      {/* Role-specific corner icons (skip entirely for admin, which has none) */}
      {variant === 'student' && (
        <>
          <GraduationCap className={`absolute top-8 left-10 w-14 h-14 ${iconColor} opacity-70`} strokeWidth={1.5} />
          <Tag className={`absolute top-56 right-16 w-12 h-12 ${iconColor} opacity-70`} strokeWidth={1.5} />
          <Calculator className={`absolute bottom-24 left-6 w-14 h-14 ${iconColor} opacity-70`} strokeWidth={1.5} />
          <BookOpen className={`absolute bottom-16 right-24 w-16 h-16 ${iconColor} opacity-70`} strokeWidth={1.5} />
        </>
      )}

      {variant === 'teacher' && (
        <>
          <BookOpen className={`absolute top-6 left-6 w-14 h-14 ${iconColor} opacity-70`} strokeWidth={1.5} />
          <FlaskConical className={`absolute top-32 right-24 w-12 h-12 ${iconColor} opacity-70`} strokeWidth={1.5} />
          <Compass className={`absolute bottom-16 left-8 w-12 h-12 ${iconColor} opacity-70`} strokeWidth={1.5} />
          <Tag className={`absolute bottom-24 right-10 w-14 h-14 ${iconColor} opacity-70`} strokeWidth={1.5} />
        </>
      )}
    </>
  )
}