// src/components/common/Avatar.tsx
const SIZES = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-base',
} as const

type AvatarSize = keyof typeof SIZES

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

interface AvatarProps {
  name: string
  src?: string | null
  size?: AvatarSize
  /** Optional ring color drawn around the avatar. */
  ring?: boolean
  className?: string
}

export default function Avatar({
  name,
  src,
  size = 'md',
  ring = false,
  className = '',
}: AvatarProps) {
  const ringClass = ring
    ? 'ring-2 ring-(--glass-outline)'
    : ''

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${SIZES[size]} ${ringClass} ${className}`}
      />
    )
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white ${SIZES[size]} ${ringClass} ${className}`}
      aria-label={name}
      title={name}
    >
      {initialsOf(name)}
    </span>
  )
}