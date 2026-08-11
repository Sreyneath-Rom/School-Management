import { useEffect, useState } from 'react'
import { Info, Globe, Camera, CheckCircle2, Phone, CalendarDays } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { schoolService, type SchoolModel, type SchoolPayload } from '@/services/schoolService'
import { useFetch } from '@/hooks/useFetch'

const inputClasses =
  'w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-sm text-stone-800 dark:text-stone-100 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900'

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

export default function SchoolSetup() {
  const [form, setForm] = useState<SchoolFormState>(() => ({ ...defaultForm }))
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [progress] = useState(85)
  const { data: school, loading, error, refetch } = useFetch<SchoolModel>(schoolService.getSchool)

  useEffect(() => {
    if (!school) return

    setForm((prev) => ({
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
    }))
  }, [school])

  const updateField = (field: keyof SchoolFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSuccessMessage(null)
    setFormError(null)
    setIsSaving(true)

    if (!form.name.trim()) {
      setFormError('School name is required.')
      setIsSaving(false)
      return
    }

    if (!form.academicYear.trim()) {
      setFormError('Academic year is required.')
      setIsSaving(false)
      return
    }

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
      setSuccessMessage('School profile updated successfully.')
      setForm((prev) => ({
        ...prev,
        name: updated.name,
        logoUrl: updated.logoUrl ?? '',
        address: updated.address ?? '',
        phone: updated.phone ?? '',
        email: updated.email ?? '',
        academicYear: updated.academicYear,
      }))
      refetch?.()
    } catch (err) {
      setFormError('Unable to save school settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <PageHeading
          title="School Setup"
          subtitle="Configure the core identity and administrative parameters of your institution."
        />
        <Button variant="solid" onClick={handleSave} disabled={isSaving || loading} className="w-full sm:w-auto">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {loading && (
        <div className="rounded-[28px] glass-sm p-6 text-sm text-stone-600 dark:text-stone-400">Loading school configuration...</div>
      )}

      {error && (
        <div className="rounded-[28px] glass-sm p-6 text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
          Unable to load school configuration.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[28px] glass-sm p-6">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
                <Info size={18} className="text-brand-600 dark:text-brand-400" />
                School Identity
              </div>
              <div className="mt-4 space-y-4 text-sm text-stone-600 dark:text-stone-400">
                <div className="rounded-3xl bg-stone-50 dark:bg-stone-800/60 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">Name</div>
                  <div className="mt-2 text-base font-semibold text-stone-900 dark:text-stone-100">{form.name || 'Not set yet'}</div>
                </div>
                <div className="rounded-3xl bg-stone-50 dark:bg-stone-800/60 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">Academic Year</div>
                  <div className="mt-2 text-base font-semibold text-stone-900 dark:text-stone-100">{form.academicYear || 'Not set yet'}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] glass-sm p-6">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
                <CalendarDays size={18} className="text-brand-600 dark:text-brand-400" />
                Academic Status
              </div>
              <div className="mt-4 space-y-4 text-sm text-stone-600 dark:text-stone-400">
                <div className="rounded-3xl bg-stone-50 dark:bg-stone-800/60 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">Term</div>
                  <div className="mt-2 text-base font-semibold text-stone-900 dark:text-stone-100">{form.academicTerm || 'Not set yet'}</div>
                </div>
                <div className="rounded-3xl bg-stone-50 dark:bg-stone-800/60 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">Language</div>
                  <div className="mt-2 text-base font-semibold text-stone-900 dark:text-stone-100">{form.language}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <Info size={20} className="text-brand-600 dark:text-brand-400" />
              School Information
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  School Name
                </label>
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  School Code
                </label>
                <input
                  value={form.schoolCode}
                  onChange={(event) => updateField('schoolCode', event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  Motto
                </label>
                <input
                  value={form.motto}
                  onChange={(event) => updateField('motto', event.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  Website
                </label>
                <input
                  value={form.website}
                  onChange={(event) => updateField('website', event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                className={`resize-none ${inputClasses}`}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] glass-sm p-6">
              <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                <Phone size={20} className="text-brand-600 dark:text-brand-400" />
                Contact Information
              </div>
              <div className="mt-6 space-y-4 text-sm text-stone-600 dark:text-stone-400">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    Address
                  </label>
                  <input
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] glass-sm p-6">
              <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                <CalendarDays size={20} className="text-brand-600 dark:text-brand-400" />
                Academic Information
              </div>
              <div className="mt-6 grid gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    Academic Year
                  </label>
                  <input
                    value={form.academicYear}
                    onChange={(event) => updateField('academicYear', event.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                    Academic Term
                  </label>
                  <input
                    value={form.academicTerm}
                    onChange={(event) => updateField('academicTerm', event.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <Camera size={20} className="text-brand-600 dark:text-brand-400" />
              Brand Assets
            </div>
            <div className="mt-5 rounded-3xl border border-dashed border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white dark:bg-stone-900 text-stone-400 dark:text-stone-500 shadow-sm">
                <Camera size={24} />
              </div>
              <div className="mt-4 text-sm font-semibold text-stone-900 dark:text-stone-100">School Logo</div>
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Upload a clear logo for the school profile and admin portal.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="solid" className="rounded-2xl px-4 py-2.5 text-sm" onClick={() => {}}>
                  Upload Logo
                </Button>
                <Button variant="glass" className="rounded-2xl px-4 py-2.5 text-sm" onClick={() => {}}>
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <CheckCircle2 size={20} className="text-brand-600 dark:text-brand-400" />
              Setup Progress
            </div>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              Keep the school profile complete for a smooth launch.
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-medium text-stone-700 dark:text-stone-300">
              <span>{progress}% complete</span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 text-emerald-700 dark:text-emerald-300">On track</span>
            </div>
          </div>

          <div className="rounded-[28px] glass-sm p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900 dark:text-stone-100">
              <Globe size={20} className="text-brand-600 dark:text-brand-400" />
              Regional Settings
            </div>
            <div className="mt-5 space-y-3 text-sm text-stone-600 dark:text-stone-400">
              <div className="rounded-3xl bg-stone-50 dark:bg-stone-800/60 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Time Zone</div>
                <div className="mt-2 font-semibold text-stone-900 dark:text-stone-100">{form.timeZone}</div>
              </div>
              <div className="rounded-3xl bg-stone-50 dark:bg-stone-800/60 p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Date Format</div>
                <div className="mt-2 font-semibold text-stone-900 dark:text-stone-100">{form.dateFormat}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="rounded-[28px] glass-sm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-100">Save Configuration</div>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Persist the current school settings to the backend.</p>
          </div>
          <Button variant="solid" onClick={handleSave} disabled={isSaving || loading} className="w-full sm:w-auto">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {formError && (
          <div className="mt-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 p-4 text-sm text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-800">{formError}</div>
        )}
        {successMessage && (
          <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">{successMessage}</div>
        )}
      </div>
    </div>
  )
}