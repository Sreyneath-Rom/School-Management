# Translation System Implementation Guide

## Overview
The translation system has been significantly improved with:
- ✅ **Auth Persistence**: Session now persists across page refreshes
- ✅ **Multiple Languages**: Built-in support for 10 languages (EN, ES, FR, DE, PT, IT, JA, ZH, AR, HI)
- ✅ **Comprehensive Keys**: 100+ translation strings covering the entire system
- ✅ **Zero Configuration**: Languages are built-in and ready to use

## Supported Languages
1. **English (en)** - 🇬🇧
2. **Spanish (es)** - 🇪🇸
3. **French (fr)** - 🇫🇷
4. **German (de)** - 🇩🇪
5. **Portuguese (pt)** - 🇵🇹
6. **Italian (it)** - 🇮🇹
7. **Japanese (ja)** - 🇯🇵
8. **Chinese (zh)** - 🇨🇳
9. **Arabic (ar)** - 🇸🇦
10. **Hindi (hi)** - 🇮🇳

## How to Use Translations in Components

### Basic Usage
```tsx
import { useTranslations } from '@/i18n/useTranslations'

export function MyComponent() {
  const { t, language, setLanguage, languages } = useTranslations()

  return (
    <div>
      {/* Use t() function to get translated text */}
      <h1>{t('header.searchPlaceholder')}</h1>
      <button>{t('common.save')}</button>
      
      {/* Get current language and available languages */}
      <p>Current: {language}</p>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### Available Translation Keys by Category

#### Authentication
- `auth.login` - Login button text
- `auth.logout` - Logout button text
- `auth.email` - Email label
- `auth.password` - Password label
- `auth.rememberMe` - Remember me checkbox
- `auth.forgotPassword` - Forgot password link
- `auth.invalidCredentials` - Invalid credentials error
- `auth.sessionExpired` - Session expired message

#### Header
- `header.searchPlaceholder` - Search input placeholder
- `header.searching` - Searching status
- `header.noResults` - No search results
- `header.notifications` - Notifications title
- `header.markAllRead` - Mark all notifications as read
- `header.myProfile` - My profile menu
- `header.settings` - Settings menu
- `header.logOut` - Logout menu
- `header.account` - Account menu
- `header.changeLanguage` - Change language menu

#### Sidebar Navigation
- `sidebar.dashboard` - Dashboard
- `sidebar.setup` - Setup menu
- `sidebar.schoolSetup` - School configuration
- `sidebar.rolesPermissions` - Roles & permissions
- `sidebar.subjects` - Subjects management
- `sidebar.schedules` - Class schedules
- `sidebar.users` - User management
- `sidebar.academic` - Academic module
- `sidebar.classes` - Classes list
- `sidebar.lessons` - Lessons
- `sidebar.homework` - Homework
- `sidebar.quizTests` - Quiz & Tests
- `sidebar.grades` - Grades management
- `sidebar.students` - Students module
- `sidebar.attendance` - Attendance tracking
- `sidebar.leaveRequests` - Leave requests
- `sidebar.teachers` - Teachers module
- `sidebar.communication` - Communication module
- `sidebar.announcements` - Announcements
- `sidebar.reports` - Reports module

#### Common Actions
- `common.save` - Save button
- `common.cancel` - Cancel button
- `common.delete` - Delete action
- `common.edit` - Edit action
- `common.discard` - Discard changes
- `common.saving` - Saving in progress
- `common.loading` - Loading indicator
- `common.yes` / `common.no` - Yes/No confirmation
- `common.close` - Close button
- `common.confirm` - Confirm action
- `common.add` - Add new item
- `common.update` - Update item
- `common.remove` - Remove item
- `common.search` - Search action
- `common.filter` - Filter data
- `common.sort` - Sort data
- `common.export` - Export data
- `common.import` - Import data
- `common.next` / `common.previous` - Pagination
- `common.view` - View action

#### Messages & Errors
- `error.required` - Required field error
- `error.invalidEmail` - Invalid email format
- `error.success` - Operation successful
- `error.failed` - Operation failed
- `error.unauthorized` - Unauthorized access
- `error.notFound` - Resource not found
- `error.serverError` - Server error message
- `error.networkError` - Network error message

#### Student Features
- `student.myClasses` - My classes
- `student.myGrades` - My grades
- `student.myAttendance` - My attendance
- `student.assignments` - Assignments

#### Teacher Features
- `teacher.myClasses` - My classes
- `teacher.attendance` - Mark attendance
- `teacher.grades` - Enter grades
- `teacher.createAssignment` - Create assignment

## Examples: Applying to Existing Components

### Example 1: Header Component
**Before:**
```tsx
<input placeholder="Search students, staff, or records..." />
<button>Notifications</button>
<a href="#settings">Settings</a>
<button onClick={logout}>Log out</button>
```

**After:**
```tsx
import { useTranslations } from '@/i18n/useTranslations'

export function Header() {
  const { t, setLanguage, languages, language } = useTranslations()

  return (
    <>
      <input placeholder={t('header.searchPlaceholder')} />
      <button>{t('header.notifications')}</button>
      <a href="#settings">{t('header.settings')}</a>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <button onClick={logout}>{t('header.logOut')}</button>
    </>
  )
}
```

### Example 2: Login Form
**Before:**
```tsx
<label>Email</label>
<input type="email" />
<label>Password</label>
<input type="password" />
<button type="submit">Login</button>
<a href="#forgot">Forgot password?</a>
```

**After:**
```tsx
import { useTranslations } from '@/i18n/useTranslations'

export function LoginForm() {
  const { t } = useTranslations()

  return (
    <>
      <label>{t('auth.email')}</label>
      <input type="email" />
      <label>{t('auth.password')}</label>
      <input type="password" />
      <button type="submit">{t('auth.login')}</button>
      <a href="#forgot">{t('auth.forgotPassword')}</a>
    </>
  )
}
```

### Example 3: Sidebar Navigation
**Before:**
```tsx
<nav>
  <a href="/dashboard">Dashboard</a>
  <a href="/students">Students</a>
  <a href="/teachers">Teachers</a>
  <a href="/attendance">Attendance</a>
  <a href="/grades">Grades</a>
</nav>
```

**After:**
```tsx
import { useTranslations } from '@/i18n/useTranslations'

export function Sidebar() {
  const { t } = useTranslations()

  return (
    <nav>
      <a href="/dashboard">{t('sidebar.dashboard')}</a>
      <a href="/students">{t('sidebar.students')}</a>
      <a href="/teachers">{t('sidebar.teachers')}</a>
      <a href="/attendance">{t('sidebar.attendance')}</a>
      <a href="/grades">{t('sidebar.grades')}</a>
    </nav>
  )
}
```

### Example 4: Dialog/Modal with Translations
**Before:**
```tsx
<Dialog>
  <h2>Confirm Delete</h2>
  <p>Are you sure?</p>
  <button>Yes</button>
  <button>No</button>
  <button>Cancel</button>
</Dialog>
```

**After:**
```tsx
import { useTranslations } from '@/i18n/useTranslations'

export function DeleteDialog({ isOpen, onConfirm, onCancel }) {
  const { t } = useTranslations()

  if (!isOpen) return null

  return (
    <Dialog>
      <h2>{t('common.confirm')}</h2>
      <p>{t('error.required')}</p>
      <button onClick={onConfirm}>{t('common.yes')}</button>
      <button onClick={onCancel}>{t('common.no')}</button>
    </Dialog>
  )
}
```

## Adding New Translation Keys

### Step 1: Add to STRINGS array in `src/i18n/strings.ts`
```ts
export const STRINGS: StringEntry[] = [
  // Add your new entry with all language translations
  { 
    key: 'myFeature.description', 
    category: 'MyFeature', 
    en: 'My description',
    es: 'Mi descripción',
    fr: 'Ma description',
    de: 'Meine Beschreibung',
    pt: 'Minha descrição',
    it: 'La mia descrizione',
    ja: '私の説明',
    zh: '我的描述',
    ar: 'وصفي',
    hi: 'मेरा विवरण'
  },
]
```

### Step 2: Use in your component
```tsx
const { t } = useTranslations()
const text = t('myFeature.description')
```

## Naming Convention
- Use **dot notation** for key names: `category.action`
- Example: `student.myGrades`, `teacher.attendance`, `common.save`
- Group related keys by category (auth, header, sidebar, common, etc.)

## Language Persistence
- The selected language is automatically saved to localStorage
- It persists across page refreshes and browser sessions
- Users' language preference is restored on app startup

## Authentication Persistence (Fixed!)
- ✅ User session now persists across page refreshes
- ✅ Loading screen shown while session is restored
- ✅ No redirect to login when refreshing authenticated pages
- ✅ Token and user data automatically restored from localStorage

## Performance Considerations
- All 10 languages' translations are loaded in memory (optimal for small-to-medium apps)
- Translations are cached in React state and memoized
- Language switching is instant with no API calls
- Consider pagination/lazy loading if supporting 100+ languages

## Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support (standard feature)
- Fallback to English if language not found

## Troubleshooting

### Missing Translation
If a translation key is not found, the system will:
1. Try the selected language
2. Fall back to English
3. Return the key itself as last resort

### Language Not Appearing
1. Check if language code is in `BUILT_IN_LANGUAGES` array
2. Verify localStorage is not disabled
3. Check browser console for errors

### Changes Not Appearing After Refresh
1. Clear browser cache
2. Check if `useTranslations()` hook is properly imported
3. Verify STRINGS array has the updated translation key

## Next Steps
1. Apply translations to all existing components
2. Test language switching across all pages
3. Add more languages by extending `BUILT_IN_LANGUAGES` array
4. Consider adding translations management UI
