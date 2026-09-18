// src/components/auth/AuthBackground.tsx
import type { UserRole } from '@/utils/rolePermissions'

export type AuthBackgroundVariant = UserRole | 'all'

interface Props {
  variant: AuthBackgroundVariant
}

/**
 * Ambient background for the login pages. The two decorative blobs shift
 * tint based on the active portal so switching tabs feels responsive.
 *
 * Uses the theme's brand and status tokens, so a light/dark toggle changes
 * the gradients without any variant-specific classes here.
 */
const BLOB_TINT: Record<
  AuthBackgroundVariant,
  { primary: string; secondary: string }
> = {
  all:     { primary: 'bg-brand-400/20 dark:bg-brand-600/20',   secondary: 'bg-info/20 dark:bg-info/20' },
  admin:   { primary: 'bg-info/20 dark:bg-info/20',             secondary: 'bg-brand-400/20 dark:bg-brand-600/20' },
  teacher: { primary: 'bg-success/20 dark:bg-success/20',       secondary: 'bg-brand-400/20 dark:bg-brand-600/20' },
  student: { primary: 'bg-brand-400/20 dark:bg-brand-600/20',   secondary: 'bg-info/20 dark:bg-info/20' },
  parent:  { primary: 'bg-warning/20 dark:bg-warning/20',       secondary: 'bg-brand-400/20 dark:bg-brand-600/20' },
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
      <div className="absolute -bottom-32 left-1/3 w-lg h-128 rounded-full blur-3xl bg-info/10 transition-colors duration-700" />

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