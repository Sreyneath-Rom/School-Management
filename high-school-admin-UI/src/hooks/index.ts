// src/hooks/index.ts
// Barrel — hooks only. Never providers. Providers live in @/context/*.

// Context consumers
export { useAuth } from './useAuth'
export { useTheme } from './useTheme'
export { useSchool } from './useSchool'

// Server-side data hooks
export { useNotifications } from './useNotifications'
export { useBadgeCounts } from './useBadgeCounts'
export { useFetch } from './useFetch'

// Form / table utilities
export { useForm } from './useForm'
export { useDataTable } from './useDataTable'
export { usePagination } from './usePagination'

// UI utilities
export { useDebounce } from './useDebounce'
export { useLocalStorage } from './useLocalStorage'
export { useResponsive, useBreakpoint, BREAKPOINTS } from './useResponsive'
export type { Breakpoint, ResponsiveState } from './useResponsive'

// Client-side toast queue (distinct from useNotifications above).
// Types are not re-exported here on purpose — Notification collides
// with the server-side Notification in @/types/notification. Import
// the toast types directly from '@/hooks/useNotification' if needed.
export { useNotification } from './useNotification'