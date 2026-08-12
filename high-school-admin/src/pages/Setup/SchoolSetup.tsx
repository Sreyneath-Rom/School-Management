import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Info,
  Globe,
  Camera,
  CheckCircle2,
  Phone,
  CalendarDays,
  Mail,
  MapPin,
  Link2,
  GraduationCap,
  Upload,
  Trash2,
  RotateCcw,
  AlertCircle,
  X,
  Clock,
  Sparkles,
} from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { schoolService, type SchoolModel, type SchoolPayload } from '@/services/schoolService'
import { useSchool } from '@/context/SchoolContext'
import { resolveAssetUrl } from '@/utils/resolveAssetUrl'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LANGUAGE_OPTIONS = ['English', 'Khmer', 'French', 'Spanish', 'Mandarin']

const TIME_ZONE_OPTIONS = [
  '(GMT+00:00) London',
  '(GMT+01:00) Paris, Berlin',
  '(GMT+07:00) Bangkok, Phnom Penh, Jakarta',
  '(GMT+08:00) Singapore, Beijing, Manila',
  '(GMT+09:00) Tokyo, Seoul',
  '(GMT-05:00) New York, Toronto',
  '(GMT-08:00) Los Angeles, Vancouver',
]

const DATE_FORMAT_OPTIONS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']

const inputClasses =
  'w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-sm text-stone-800 dark:text-stone-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900'

const inputWithIconClasses = `${inputClasses} pl-11`

const errorInputClasses =
  'border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-900/40'

const labelClasses =
  'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400'

const defaultForm = {
  name: '',
  schoolCode: '',
  logoUrl: '',
  motto: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  academicYear: '',
  academicTerm: '',
  language: 'English',
  timeZone: '(GMT+00:00) London',
  dateFormat: 'DD/MM/YYYY',
}

type SchoolFormState = typeof defaultForm
type FieldErrors = Partial<Record<keyof SchoolFormState, string>>

// Fields that count toward the "profile completeness" meter.
const PROGRESS_FIELDS: (keyof SchoolFormState)[] = [
  'name',
  'schoolCode',
  'logoUrl',
  'motto',
  'description',
  'address',
  'phone',
  'email',
  'website',
  'academicYear',
  'academicTerm',
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function buildFormFromSchool(school: SchoolModel, prev: SchoolFormState): SchoolFormState {
  return {
    ...prev,
    name: school.name,
    schoolCode: typeof school.settings?.schoolCode === 'string' ? school.settings.schoolCode : prev.schoolCode,
    logoUrl: school.logoUrl ?? '',
    motto: typeof school.settings?.motto === 'string' ? school.settings.motto : prev.motto,
    description: typeof school.settings?.description === 'string' ? school.settings.description : prev.description,
    address: school.address ?? '',
    phone: school.phone ?? '',
    email: school.email ?? '',
    website: typeof school.settings?.website === 'string' ? school.settings.website : prev.website,
    academicYear: school.academicYear,
    academicTerm: typeof school.settings?.academicTerm === 'string' ? school.settings.academicTerm : prev.academicTerm,
    language: typeof school.settings?.language === 'string' ? school.settings.language : prev.language,
    timeZone: typeof school.settings?.timeZone === 'string' ? school.settings.timeZone : prev.timeZone,
    dateFormat: typeof school.settings?.dateFormat === 'string' ? school.settings.dateFormat : prev.dateFormat,
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SchoolSetup() {
  const [form, setForm] = useState<SchoolFormState>(() => ({ ...defaultForm }))
  const [savedSnapshot, setSavedSnapshot] = useState<SchoolFormState>(() => ({ ...defaultForm }))
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { school, loading, error, refetch } = useSchool()

  useEffect(() => {
    if (!school) return
    setForm((prev) => {
      const next = buildFormFromSchool(school, prev)
      setSavedSnapshot(next)
      return next
    })
  }, [school])

  // Auto-dismiss toasts after a few seconds.
  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(() => setSuccessMessage(null), 5000)
    return () => clearTimeout(timer)
  }, [successMessage])

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedSnapshot),
    [form, savedSnapshot]
  )

  const progress = useMemo(() => {
    const filled = PROGRESS_FIELDS.filter((field) => form[field]?.trim().length > 0).length
    return Math.round((filled / PROGRESS_FIELDS.length) * 100)
  }, [form])

  const progressLabel = progress === 100 ? 'Complete' : progress >= 60 ? 'On track' : 'Getting started'
  const progressTint =
    progress === 100
      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
      : progress >= 60
      ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'

  const updateField = (field: keyof SchoolFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}
    if (!form.name.trim()) errors.name = 'School name is required.'
    if (!form.academicYear.trim()) errors.academicYear = 'Academic year is required.'
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.'
    }
    if (form.website.trim() && !/^https?:\/\/.+\..+/.test(form.website.trim())) {
      errors.website = 'Include the full URL, e.g. https://yourschool.edu'
    }
    return errors
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Please choose an image file for the logo.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Logo image must be under 5MB.')
      return
    }

    setSuccessMessage(null)
    setFormError(null)
    setIsUploadingLogo(true)
    try {
      const updated = await schoolService.uploadLogo(file)
      const merged = buildFormFromSchool(updated, form)
      setForm(merged)
      setSavedSnapshot(merged)
      setSuccessMessage('Logo uploaded successfully.')
      refetch?.()
    } catch (err) {
      setFormError('Unable to upload logo. Please try again.')
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleDiscard = () => {
    setForm(savedSnapshot)
    setFieldErrors({})
    setFormError(null)
    setSuccessMessage(null)
  }

  const handleSave = async () => {
    setSuccessMessage(null)
    setFormError(null)

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setFormError('Please fix the highlighted fields before saving.')
      return
    }

    setIsSaving(true)
    try {
      const payload: Partial<SchoolPayload> = {
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() || undefined,
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        academicYear: form.academicYear.trim(),
        settings: {
          schoolCode: form.schoolCode.trim() || undefined,
          academicTerm: form.academicTerm.trim() || undefined,
          motto: form.motto.trim() || undefined,
          description: form.description.trim() || undefined,
          website: form.website.trim() || undefined,
          language: form.language,
          timeZone: form.timeZone,
          dateFormat: form.dateFormat,
        },
      }

      const updated = await schoolService.updateSchool(payload)
      const merged = buildFormFromSchool(updated, form)
      setForm(merged)
      setSavedSnapshot(merged)
      setSuccessMessage('School profile updated successfully.')
      refetch?.()
    } catch (err) {
      setFormError('Unable to save school settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const initials = form.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SC'

  const resolvedLogoUrl = resolveAssetUrl(form.logoUrl)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <PageHeading
          title="School Setup"
          subtitle="Configure the core identity and administrative parameters of your institution."
        />
        <div className="flex items-center gap-3">
          {isDirty && !isSaving && (
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
          {isDirty && (
            <Button
              variant="glass"
              onClick={handleDiscard}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <RotateCcw size={15} />
              Discard
            </Button>
          )}
          <Button
            variant="solid"
            onClick={handleSave}
            disabled={isSaving || loading || !isDirty}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Toasts */}
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-3xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-4 text-sm text-rose-700 dark:text-rose-400"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{formError}</span>
          <button
            aria-label="Dismiss error"
            onClick={() => setFormError(null)}
            className="shrink-0 rounded-full p-1 transition hover:bg-rose-100 dark:hover:bg-rose-900/40"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{successMessage}</span>
          <button
            aria-label="Dismiss message"
            onClick={() => setSuccessMessage(null)}
            className="shrink-0 rounded-full p-1 transition hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-[28px] glass-sm p-6 text-sm text-stone-600 dark:text-stone-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-brand-600 dark:border-stone-600" />
          Loading school configuration...
        </div>
      )}

      {error && (
        <div className="rounded-[28px] glass-sm p-6 text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
          Unable to load school configuration.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Main column */}
        <div className="space-y-6">
          {/* School Information */}
          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <Info size={20} className="text-brand-600 dark:text-brand-400" />
              School Information
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="school-name" className={labelClasses}>
                  School Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="school-name"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={`${inputClasses} ${fieldErrors.name ? errorInputClasses : ''}`}
                  placeholder="Varin High School"
                />
                {fieldErrors.name && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="school-code" className={labelClasses}>
                  School Code
                </label>
                <input
                  id="school-code"
                  value={form.schoolCode}
                  onChange={(event) => updateField('schoolCode', event.target.value)}
                  className={inputClasses}
                  placeholder="VHS-001"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="school-motto" className={labelClasses}>
                  Motto
                </label>
                <input
                  id="school-motto"
                  value={form.motto}
                  onChange={(event) => updateField('motto', event.target.value)}
                  className={inputClasses}
                  placeholder="Knowledge. Character. Community."
                />
              </div>
              <div>
                <label htmlFor="school-website" className={labelClasses}>
                  Website
                </label>
                <div className="relative">
                  <Link2 size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="school-website"
                    value={form.website}
                    onChange={(event) => updateField('website', event.target.value)}
                    aria-invalid={Boolean(fieldErrors.website)}
                    className={`${inputWithIconClasses} ${fieldErrors.website ? errorInputClasses : ''}`}
                    placeholder="https://yourschool.edu"
                  />
                </div>
                {fieldErrors.website && (
                  <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.website}</p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="school-description" className={labelClasses}>
                Description
              </label>
              <textarea
                id="school-description"
                rows={4}
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                className={`resize-none ${inputClasses}`}
                placeholder="A short overview of the school's mission and community, shown on the public profile."
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contact */}
            <div className="rounded-[28px] glass-sm p-6">
              <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                <Phone size={20} className="text-brand-600 dark:text-brand-400" />
                Contact Information
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="school-address" className={labelClasses}>
                    Address
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      id="school-address"
                      value={form.address}
                      onChange={(event) => updateField('address', event.target.value)}
                      className={inputWithIconClasses}
                      placeholder="Street, city, country"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="school-phone" className={labelClasses}>
                    Phone
                  </label>
                  <div className="relative">
                    <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      id="school-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      className={inputWithIconClasses}
                      placeholder="+1 555 000 1234"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="school-email" className={labelClasses}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      id="school-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField('email', event.target.value)}
                      aria-invalid={Boolean(fieldErrors.email)}
                      className={`${inputWithIconClasses} ${fieldErrors.email ? errorInputClasses : ''}`}
                      placeholder="admin@yourschool.edu"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic */}
            <div className="rounded-[28px] glass-sm p-6">
              <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                <CalendarDays size={20} className="text-brand-600 dark:text-brand-400" />
                Academic Information
              </div>
              <div className="mt-6 grid gap-4">
                <div>
                  <label htmlFor="academic-year" className={labelClasses}>
                    Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="academic-year"
                    value={form.academicYear}
                    onChange={(event) => updateField('academicYear', event.target.value)}
                    aria-invalid={Boolean(fieldErrors.academicYear)}
                    className={`${inputClasses} ${fieldErrors.academicYear ? errorInputClasses : ''}`}
                    placeholder="2025 – 2026"
                  />
                  {fieldErrors.academicYear && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.academicYear}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="academic-term" className={labelClasses}>
                    Academic Term
                  </label>
                  <input
                    id="academic-term"
                    value={form.academicTerm}
                    onChange={(event) => updateField('academicTerm', event.target.value)}
                    className={inputClasses}
                    placeholder="Term 1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Regional settings */}
          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <Globe size={20} className="text-brand-600 dark:text-brand-400" />
              Regional Settings
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="language" className={labelClasses}>
                  Language
                </label>
                <select
                  id="language"
                  value={form.language}
                  onChange={(event) => updateField('language', event.target.value)}
                  className={inputClasses}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="time-zone" className={labelClasses}>
                  Time Zone
                </label>
                <div className="relative">
                  <Clock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <select
                    id="time-zone"
                    value={form.timeZone}
                    onChange={(event) => updateField('timeZone', event.target.value)}
                    className={`${inputWithIconClasses} appearance-none`}
                  >
                    {TIME_ZONE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="date-format" className={labelClasses}>
                  Date Format
                </label>
                <select
                  id="date-format"
                  value={form.dateFormat}
                  onChange={(event) => updateField('dateFormat', event.target.value)}
                  className={inputClasses}
                >
                  {DATE_FORMAT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Live ID-card style preview */}
          <div className="overflow-hidden rounded-[28px] glass-sm">
            <div className="flex items-center gap-2 border-b border-stone-200/60 dark:border-stone-700/60 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
              <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
              Live Preview
            </div>
            <div className="p-6">
              <div className="rounded-3xl glass-teal p-5 text-white shadow-lg">
                <div className="flex items-center gap-4">
                  {resolvedLogoUrl ? (
                    <img
                      src={resolvedLogoUrl}
                      alt="School logo"
                      className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-white/40"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold ring-2 ring-white/30">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-base font-bold leading-tight">{form.name || 'Your School Name'}</div>
                    <div className="mt-0.5 truncate text-xs text-white/80">
                      {form.schoolCode || 'SCHOOL-CODE'} · {form.academicYear || 'Academic Year'}
                    </div>
                  </div>
                </div>
                {form.motto && <p className="mt-4 text-sm italic text-white/90">"{form.motto}"</p>}
                <div className="mt-4 flex items-center gap-2 border-t border-white/20 pt-3 text-xs text-white/80">
                  <GraduationCap size={14} />
                  {form.academicTerm || 'Term not set'}
                </div>
              </div>
            </div>
          </div>

          {/* Brand assets */}
          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <Camera size={20} className="text-brand-600 dark:text-brand-400" />
              Brand Assets
            </div>
            <div className="mt-5 rounded-3xl border border-dashed border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 p-6 text-center">
              {resolvedLogoUrl ? (
                <img
                  src={resolvedLogoUrl}
                  alt="School logo preview"
                  className="mx-auto h-20 w-20 rounded-3xl object-cover shadow-sm"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white dark:bg-stone-900 text-stone-400 dark:text-stone-500 shadow-sm">
                  <Camera size={24} />
                </div>
              )}
              <div className="mt-4 text-sm font-semibold text-stone-900 dark:text-stone-100">School Logo</div>
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                Upload a clear logo for the school profile and admin portal.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="solid"
                  className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                >
                  <Upload size={15} />
                  {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </Button>
                <Button
                  variant="glass"
                  className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm"
                  onClick={() => updateField('logoUrl', '')}
                  disabled={!form.logoUrl || isUploadingLogo}
                >
                  <Trash2 size={15} />
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Setup progress */}
          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <CheckCircle2 size={20} className="text-brand-600 dark:text-brand-400" />
              Setup Progress
            </div>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Keep the school profile complete for a smooth launch.
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-medium text-stone-700 dark:text-stone-300">
              <span>{progress}% complete</span>
              <span className={`rounded-full px-2 py-1 ${progressTint}`}>{progressLabel}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom save bar */}
      <div className="rounded-[28px] glass-sm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-100">Save Configuration</div>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              {isDirty ? 'You have unsaved changes.' : 'Persist the current school settings to the backend.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDirty && (
              <Button variant="glass" onClick={handleDiscard} disabled={isSaving} className="flex items-center gap-2">
                <RotateCcw size={15} />
                Discard
              </Button>
            )}
            <Button
              variant="solid"
              onClick={handleSave}
              disabled={isSaving || loading || !isDirty}
              className="w-full sm:w-auto"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}