// Suggested path: @/components/common/ThemeToggle.tsx

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="inline-flex h-10 w-12 items-center justify-center rounded-full glass-sm text-text-main/65 transition hover:text-text-main"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}