// src/components/common/ThemeToggle.tsx
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-2xl glass-sm glass-interactive text-fg-muted hover:text-fg"
    >
      {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} />}
    </button>
  )
}