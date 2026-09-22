// src/layouts/LanguageSelector.tsx
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useTranslations } from '@/i18n'

export default function LanguageSelector() {
  const { language, setLanguage, languages, activeLanguage, t } = useTranslations()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('touchstart', onClick)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('touchstart', onClick)
    }
  }, [])

  const safeLanguages = Array.isArray(languages) ? languages : []
  const active = activeLanguage ?? { code: 'en', name: 'English', flag: '🇬🇧' }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={`${t('header.changeLanguage')}: ${active.name}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        // glass-interactive supplies the hover-lift / press-in gesture;
        // no `hover:bg-surface` (that would be the same color as the
        // button itself under neumorphism and read as a no-op).
        className={`flex h-9.5 items-center gap-1.5 rounded-2xl px-2.5 text-xs font-semibold transition glass-sm glass-interactive cursor-pointer ${
          open
            ? 'ring-1 ring-brand-500/40 text-color'
            : 'text-secondary'
        }`}
      >
        <span className="text-sm">{active.flag}</span>
        <span className="hidden sm:inline font-bold uppercase text-[10.5px] text-color">
          {active.code}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 text-secondary ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="dropdown-surface absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
            {t('header.changeLanguage')}
          </div>
          <div className="space-y-0.5">
            {safeLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => {
                  setLanguage(lang.code)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition cursor-pointer ${
                  lang.code === language
                    ? 'bg-brand-600 text-white font-semibold'
                    : 'text-secondary hover:text-color'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </span>
                {lang.code === language && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}