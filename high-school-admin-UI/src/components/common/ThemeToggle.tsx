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
      className="inline-flex h-9.5 w-9.5 items-center justify-center rounded-2xl glass-sm text-secondary transition hover:text-color cursor-pointer"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}