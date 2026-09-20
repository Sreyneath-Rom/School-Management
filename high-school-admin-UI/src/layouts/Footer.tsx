import { useSchool } from '@/hooks/useSchool'
import { useTranslations } from '@/i18n'

export default function Footer() {
  const year = new Date().getFullYear()
  const { school } = useSchool()
  const { t } = useTranslations()
  const schoolName = school?.name || ''

  return (
    <footer className="px-4 py-4 text-xs text-secondary sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {schoolName} {t('footer.rights')}
        </span>
        <span>{t('footer.systemName')} v1.0</span>
      </div>
    </footer>
  )
}