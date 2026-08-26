// src/features/setup/school/RegionalPreferences.tsx

import { Clock3, Globe2 } from 'lucide-react';
import Field from './Field';
import { inputClass } from './constants';
import type { SchoolFormState } from '@/types/school';
import { useTranslations } from '@/i18n';

const TIME_ZONE_OPTIONS = [
  '(GMT+00:00) London',
  '(GMT+01:00) Paris, Berlin',
  '(GMT+07:00) Bangkok, Phnom Penh, Jakarta',
  '(GMT+08:00) Singapore, Beijing, Manila',
  '(GMT+09:00) Tokyo, Seoul',
  '(GMT-05:00) New York, Toronto',
  '(GMT-08:00) Los Angeles, Vancouver',
];

const DATE_FORMAT_OPTIONS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

interface Props {
  form: SchoolFormState;
  updateField: (field: keyof SchoolFormState, value: string) => void;
}

export default function RegionalPreferences({ form, updateField }: Props) {
  const { languages } = useTranslations();
  const languageOptions = languages.map((lang) => lang.name);

  return (
    <section className="glass-sm relative overflow-hidden rounded-[28px]">
      <div className="border-b border-(--glass-outline) px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300">
            <Globe2 size={18} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-text-main">
                Regional Preferences
              </h2>

              <span className="rounded-full bg-brand-500/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                System
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-text-main/65">
              Control language, timezone, and date formatting across the system.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Language">
            <div className="relative">
              <Globe2 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-main/45" />
              <select
                value={form.language}
                onChange={(e) => updateField('language', e.target.value)}
                className={`${inputClass} pl-11 appearance-none`}
              >
                {languageOptions.map((name) => (
                  <option key={name} value={name} className="glass-sm text-text-main rounded-3xl">
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Time Zone">
            <div className="relative">
              <Clock3 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-main/45" />
              <select
                value={form.timeZone}
                onChange={(e) => updateField('timeZone', e.target.value)}
                className={`${inputClass} pl-11 appearance-none`}
              >
                {TIME_ZONE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="glass-sm text-text-main rounded-3xl">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Date Format">
            <div className="relative">
              <select
                value={form.dateFormat}
                onChange={(e) => updateField('dateFormat', e.target.value)}
                className={`${inputClass} appearance-none pr-10`}
              >
                {DATE_FORMAT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="glass-sm text-text-main rounded-3xl">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </div>

        <div className="glass-sm mt-6 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
              <Globe2 size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-text-main">
                Current regional setup
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {[form.language || 'Language not set', form.timeZone || 'Timezone not set', form.dateFormat || 'Date format not set'].map((item, idx) => (
                  <span key={idx} className="glass-sm rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-brand-700 dark:text-brand-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}