// src/features/setup/school/RegionalPreferences.tsx
import { Globe2, Clock3 } from 'lucide-react';
import Field from './Field';
import SectionHeader from './SectionHeader';
import { inputClass } from './constants';
import type { SchoolFormState } from '@/types/school';

const LANGUAGE_OPTIONS = ['English', 'Khmer', 'French', 'Spanish', 'Mandarin'];
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
  return (
    <section className="rounded-[28px] glass-sm p-6">
      <SectionHeader
        icon={<Globe2 size={19} />}
        title="Regional Preferences"
        description="Control language, timezone, and date formatting across the system."
      />
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Field label="Language">
          <select
            value={form.language}
            onChange={(e) => updateField('language', e.target.value)}
            className={inputClass}
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </Field>
        <Field label="Time Zone">
          <div className="relative">
            <Clock3 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={form.timeZone}
              onChange={(e) => updateField('timeZone', e.target.value)}
              className={`${inputClass} pl-11`}
            >
              {TIME_ZONE_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </Field>
        <Field label="Date Format">
          <select
            value={form.dateFormat}
            onChange={(e) => updateField('dateFormat', e.target.value)}
            className={inputClass}
          >
            {DATE_FORMAT_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </Field>
      </div>
    </section>
  );
}