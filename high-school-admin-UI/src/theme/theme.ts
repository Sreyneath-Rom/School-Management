/**
 * Central design tokens for the Varin High School dashboard.
 * These mirror the CSS custom properties defined in src/index.css so that
 * components needing values in JS (e.g. chart colors) stay in sync with
 * the visual language used across the app.
 */

export const colors = {
  background: '#f3f5f9',
  surface: '#ffffff',
  border: '#e7eaf1',
  textPrimary: '#16192b',
  textSecondary: '#6b7180',
  textMuted: '#9298a6',

  blue: '#2563eb',
  blueTint: '#e8f0fe',
  green: '#16a34a',
  greenTint: '#e7f8ee',
  amber: '#d97706',
  amberTint: '#fdf3e2',
  violet: '#7c3aed',
  violetTint: '#f0ebfe',
  sky: '#0284c7',
  skyTint: '#e5f4fd',
  red: '#dc2626',
  redTint: '#fdecec',
} as const

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
} as const

export const shadow = {
  card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
} as const

export const layout = {
  sidebarWidth: '272px',
  headerHeight: '72px',
} as const

export const chartPalette = [
  '#F472B6',
  '#34D399',
  '#FBBF24',
  '#A78BFA',
  '#60A5FA',
  '#FB7185',
] as const

export const theme = { colors, radius, shadow, layout, chartPalette }

export default theme
