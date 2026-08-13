// ============================================================================
// EXAMPLE: How to Apply Translations to Components
// Copy this pattern to other components in your application
// ============================================================================

/**
 * EXAMPLE 1: Header Component with Language Switcher
 * 
 * Apply translations to:
 * - Search input placeholder
 * - Notification button
 * - Profile menu items
 * - Language selector
 */

import { useTranslations } from '@/i18n/useTranslations'

export function HeaderExample() {
  const { t, language, setLanguage, languages } = useTranslations()

  const handleLogout = async () => {
    // logout logic
  }

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between p-4">
        {/* Search */}
        <input
          type="text"
          placeholder={t('header.searchPlaceholder')}
          className="px-4 py-2 border rounded"
        />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button title={t('header.notifications')}>
            🔔 {t('header.notifications')}
          </button>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          {/* User Menu */}
          <div className="relative group">
            <button>{t('header.account')}</button>
            <div className="absolute right-0 w-48 bg-white border rounded shadow-lg hidden group-hover:block">
              <a href="#profile" className="block px-4 py-2">
                {t('header.myProfile')}
              </a>
              <a href="#settings" className="block px-4 py-2">
                {t('header.settings')}
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600"
              >
                {t('header.logOut')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * EXAMPLE 2: Login Form Component
 * 
 * Apply translations to:
 * - Form labels
 * - Input placeholders
 * - Buttons
 * - Links
 * - Error messages
 */

export function LoginFormExample() {
  const { t } = useTranslations()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Login logic
      setError('')
    } catch (err) {
      setError(t('error.invalidCredentials'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">{t('auth.login')}</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('auth.password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          {t('auth.rememberMe')}
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {t('auth.login')}
      </button>

      <a href="#forgot" className="block mt-4 text-center text-blue-600 hover:underline">
        {t('auth.forgotPassword')}
      </a>
    </form>
  )
}

/**
 * EXAMPLE 3: Sidebar Navigation Component
 * 
 * Apply translations to:
 * - All navigation items
 * - Section headers
 * - All link labels
 */

export function SidebarExample() {
  const { t } = useTranslations()

  const menuItems = [
    { label: t('sidebar.dashboard'), href: '/dashboard', icon: '📊' },
    { label: t('sidebar.students'), href: '/students', icon: '👨‍🎓' },
    { label: t('sidebar.teachers'), href: '/teachers', icon: '👨‍🏫' },
    { label: t('sidebar.attendance'), href: '/attendance', icon: '✓' },
    { label: t('sidebar.grades'), href: '/grades', icon: '📝' },
  ]

  const adminSection = [
    { label: t('sidebar.setup'), href: '/setup', icon: '⚙️' },
    { label: t('sidebar.rolesPermissions'), href: '/roles', icon: '🔐' },
    { label: t('sidebar.users'), href: '/users', icon: '👥' },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <nav className="p-4">
        <h2 className="text-lg font-bold mb-6">{t('sidebar.academic')}</h2>
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block py-2 px-4 hover:bg-gray-800 rounded"
          >
            {item.icon} {item.label}
          </a>
        ))}

        <h2 className="text-lg font-bold mt-8 mb-4">{t('sidebar.setup')}</h2>
        {adminSection.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block py-2 px-4 hover:bg-gray-800 rounded"
          >
            {item.icon} {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

/**
 * EXAMPLE 4: Data Table with Actions
 * 
 * Apply translations to:
 * - Column headers
 * - Action buttons
 * - Status messages
 * - Empty states
 */

export function StudentTableExample() {
  const { t } = useTranslations()
  const [students, setStudents] = React.useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ])

  const handleDelete = (id: number) => {
    setStudents(students.filter((s) => s.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('sidebar.studentList')}</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {t('common.add')}
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('header.noResults')}</div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">{t('auth.email')}</th>
              <th className="border p-2 text-left">{t('header.account')}</th>
              <th className="border p-2 text-center">{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

/**
 * EXAMPLE 5: Modal/Dialog with Translations
 * 
 * Apply translations to:
 * - Dialog title
 * - Buttons
 * - Status messages
 * - Confirmation text
 */

export function ConfirmDialogExample({
  isOpen,
  title,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean
  title: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const { t } = useTranslations()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm">
        <h2 className="text-xl font-bold mb-4">{t('common.confirm')}</h2>
        <p className="text-gray-600 mb-6">{title}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t('common.yes')}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * EXAMPLE 6: Form with Validation and Status Messages
 */

export function StudentFormExample() {
  const { t } = useTranslations()
  const [formData, setFormData] = React.useState({ email: '', name: '' })
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!formData.email) {
        throw new Error('email_required')
      }
      if (!formData.name) {
        throw new Error('name_required')
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setError('')
      alert(t('error.success'))
    } catch (err: any) {
      setError(t('error.failed'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{t('student.myClasses')}</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">{t('header.account')}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSaving ? t('common.saving') : t('common.save')}
        </button>
        <button
          type="reset"
          className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
        >
          {t('common.cancel')}
        </button>
      </div>
    </form>
  )
}

export default {
  HeaderExample,
  LoginFormExample,
  SidebarExample,
  StudentTableExample,
  ConfirmDialogExample,
  StudentFormExample,
}
