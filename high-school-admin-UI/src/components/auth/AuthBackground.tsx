// src/components/auth/AuthBackground.tsx
import type { UserRole } from '@/utils/rolePermissions'

export type AuthBackgroundVariant = UserRole | 'all'

interface Props {
  variant: AuthBackgroundVariant
}

/**
 * Ambient background for the login pages.
 *
 * Under the neumorphic theme the page is a single flat color and depth
 * comes entirely from paired shadows on FOREGROUND elements. Colored
 * blobs are therefore kept extremely faint — they act as a hint of the
 * active portal, not as a focal element. Anything heavier fights the
 * surface treatment.
 */
const BLOB_TINT: Record<
  AuthBackgroundVariant,
  { primary: string; secondary: string }
> = {
  all:     { primary: 'bg-brand-400/12 dark:bg-brand-600/12', secondary: 'bg-info/10' },
  admin:   { primary: 'bg-info/10',                            secondary: 'bg-brand-400/12 dark:bg-brand-600/12' },
  teacher: { primary: 'bg-success/10',                         secondary: 'bg-brand-400/12 dark:bg-brand-600/12' },
  student: { primary: 'bg-brand-400/12 dark:bg-brand-600/12',  secondary: 'bg-info/10' },
  parent:  { primary: 'bg-warning/10',                         secondary: 'bg-brand-400/12 dark:bg-brand-600/12' },
  mazer:   { primary: 'bg-amber-400/10',                       secondary: 'bg-brand-400/12 dark:bg-brand-600/12' },
}

export default function AuthBackground({ variant }: Props) {
  const tint = BLOB_TINT[variant] ?? BLOB_TINT.all

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-colors duration-700 ${tint.primary}`}
      />
      <div
        className={`absolute top-1/3 -right-32 w-md h-112 rounded-full blur-3xl transition-colors duration-700 ${tint.secondary}`}
      />
      <div className="absolute -bottom-32 left-1/3 w-lg h-128 rounded-full blur-3xl bg-info/8 transition-colors duration-700" />

      {/* Dot-grid overlay — inherits the theme's text color. */}
      <div
        className="absolute inset-0 text-fg opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}