import { useSchool } from '@/context/SchoolContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { school } = useSchool()
  const schoolName = school?.name || 'Your School'

  return (
    <footer className="px-4 py-4 text-xs text-stone-500 sm:px-6 dark:text-stone-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>© {year} {schoolName}. All rights reserved.</span>
        <span>School Management System v1.0</span>
      </div>
    </footer>
  )
}