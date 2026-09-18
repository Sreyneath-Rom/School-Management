import type { UserRole } from '@/utils/rolePermissions';

export type AuthBackgroundVariant = UserRole | 'all';

interface Props {
  variant: AuthBackgroundVariant;
}

export default function AuthBackground({ variant }: Props) {
  const isTeacher = variant === 'teacher';
  const isStudent = variant === 'student';
  const isParent = variant === 'parent';

  // Dynamic glow and accent gradient based on the active role
  const glow1 = isTeacher
    ? 'bg-emerald-500/15 dark:bg-emerald-600/15'
    : isStudent
    ? 'bg-purple-500/15 dark:bg-purple-600/15'
    : isParent
    ? 'bg-amber-500/15 dark:bg-amber-600/15'
    : 'bg-teal-500/15 dark:bg-teal-600/15';

  const glow2 = isTeacher
    ? 'bg-teal-500/15 dark:bg-teal-600/15'
    : isStudent
    ? 'bg-indigo-500/15 dark:bg-indigo-600/15'
    : isParent
    ? 'bg-orange-500/15 dark:bg-orange-600/15'
    : 'bg-blue-500/15 dark:bg-blue-600/15';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Dynamic ambient blobs */}
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-colors duration-700 ${glow1}`}
      />
      <div
        className={`absolute top-1/3 -right-32 w-md h-112 rounded-full blur-3xl transition-colors duration-700 ${glow2}`}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-lg h-128 rounded-full blur-3xl bg-sky-500/10 dark:bg-sky-600/10"
      />

      {/* Subtle mathematical grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
