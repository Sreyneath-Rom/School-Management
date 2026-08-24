// src/features/setup/school/RegionalPreferences.tsx

import { Clock3, Globe2 } from 'lucide-react';

import Field from './Field';
import SectionHeader from './SectionHeader';
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

const DATE_FORMAT_OPTIONS = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY-MM-DD',
];

interface Props {
  form: SchoolFormState;
  updateField: (
    field: keyof SchoolFormState,
    value: string
  ) => void;
}

export default function RegionalPreferences({
  form,
  updateField,
}: Props) {
  const { languages } = useTranslations();

  const languageOptions = languages.map((lang) => lang.name);

  return (
    <section
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/70
        bg-white/80
        shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)]
        backdrop-blur-xl
        dark:border-slate-800/80
        dark:bg-slate-950/70
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          border-b
          border-slate-200/70
          px-5
          py-5
          sm:px-6
          dark:border-slate-800
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-950
              text-white
              shadow-lg
              shadow-slate-950/10
              dark:bg-white
              dark:text-slate-950
            "
          >
            <Globe2 size={18} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="
                  text-sm
                  font-bold
                  tracking-tight
                  text-slate-950
                  dark:text-white
                "
              >
                Regional Preferences
              </h2>

              <span
                className="
                  rounded-full
                  bg-blue-50
                  px-2
                  py-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-blue-600
                  dark:bg-blue-950/40
                  dark:text-blue-300
                "
              >
                System
              </span>
            </div>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Control language, timezone, and date formatting
              across the system.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SETTINGS
      ====================================================== */}
      <div className="p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-3">
          {/* =================================================
              LANGUAGE
          ================================================== */}
          <Field label="Language">
            <div className="relative">
              <Globe2
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <select
                value={form.language}
                onChange={(e) =>
                  updateField('language', e.target.value)
                }
                className={`${inputClass} pl-11 appearance-none`}
              >
                {languageOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <div
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </Field>

          {/* =================================================
              TIME ZONE
          ================================================== */}
          <Field label="Time Zone">
            <div className="relative">
              <Clock3
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <select
                value={form.timeZone}
                onChange={(e) =>
                  updateField('timeZone', e.target.value)
                }
                className={`${inputClass} pl-11 appearance-none`}
              >
                {TIME_ZONE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <div
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </Field>

          {/* =================================================
              DATE FORMAT
          ================================================== */}
          <Field label="Date Format">
            <div className="relative">
              <select
                value={form.dateFormat}
                onChange={(e) =>
                  updateField('dateFormat', e.target.value)
                }
                className={`${inputClass} appearance-none pr-10`}
              >
                {DATE_FORMAT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <div
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </Field>
        </div>

        {/* =====================================================
            CURRENT SETTINGS PREVIEW
        ====================================================== */}
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-blue-100
            bg-blue-50/50
            p-4
            dark:border-blue-900/40
            dark:bg-blue-950/20
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-blue-600
                dark:bg-blue-900/40
                dark:text-blue-300
              "
            >
              <Globe2 size={16} />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-xs
                  font-bold
                  text-blue-900
                  dark:text-blue-100
                "
              >
                Current regional setup
              </p>

              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  gap-2
                "
              >
                <span
                  className="
                    rounded-lg
                    bg-white/80
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-blue-700
                    ring-1
                    ring-blue-100
                    dark:bg-blue-950/40
                    dark:text-blue-300
                    dark:ring-blue-900/50
                  "
                >
                  {form.language || 'Language not set'}
                </span>

                <span
                  className="
                    rounded-lg
                    bg-white/80
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-blue-700
                    ring-1
                    ring-blue-100
                    dark:bg-blue-950/40
                    dark:text-blue-300
                    dark:ring-blue-900/50
                  "
                >
                  {form.timeZone || 'Timezone not set'}
                </span>

                <span
                  className="
                    rounded-lg
                    bg-white/80
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-blue-700
                    ring-1
                    ring-blue-100
                    dark:bg-blue-950/40
                    dark:text-blue-300
                    dark:ring-blue-900/50
                  "
                >
                  {form.dateFormat || 'Date format not set'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}