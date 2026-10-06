import { useSchool } from '@/hooks/useSchool'
import { useTranslations } from '@/i18n'

export default function Footer() {
  const year = new Date().getFullYear()
  const { school } = useSchool()
  const { t } = useTranslations()
  const schoolName = school?.name || ''

  return (
    // The shadow seam creates a physical 1px edge without a border, 
    // which fits the Neumorphic aesthetic perfectly.
    <footer className="px-4 py-4 text-[11px] font-medium tracking-wide text-secondary sm:px-6 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {schoolName} {t('footer.rights')}
        </span>
        <span className="opacity-80">{t('footer.systemName')} v1.0</span>
      </div>
    </footer>
  )
}