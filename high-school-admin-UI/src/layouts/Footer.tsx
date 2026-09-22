import { useSchool } from '@/hooks/useSchool'
import { useTranslations } from '@/i18n'

export default function Footer() {
  const year = new Date().getFullYear()
  const { school } = useSchool()
  const { t } = useTranslations()
  const schoolName = school?.name || ''

  return (
    // A shadow-based seam replaces the old `border-t border-surface`,
    // which went invisible once --glass-bg = --page-background.
    <footer className="px-4 py-4 text-xs text-secondary sm:px-6 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {schoolName} {t('footer.rights')}
        </span>
        <span>{t('footer.systemName')} v1.0</span>
      </div>
    </footer>
  )
}