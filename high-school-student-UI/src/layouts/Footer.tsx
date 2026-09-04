import { useSchool } from '@/context/SchoolContext'
import { useTranslations } from '@/i18n'

export default function Footer() {
  const year = new Date().getFullYear()
  const { school } = useSchool()
  const { t } = useTranslations()
  const schoolName = school?.name || 'Your School'

  return (
    <footer className="px-4 py-4 text-xs text-stone-500 sm:px-6 dark:text-stone-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>© {year} {schoolName}. {t('footer.rights')}</span>
        <span>{t('footer.systemName')} v1.0</span>
      </div>
    </footer>
  )
}