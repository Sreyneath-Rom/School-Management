// src/features/setup/school/SchoolIdentity.tsx
import { GraduationCap, Link2 } from 'lucide-react';
import Field from './Field';
import SectionHeader from './SectionHeader';
import { inputClass } from './constants';
import type { SchoolFormState } from '@/types/school'; 


interface Props {
  form: SchoolFormState; 
  updateField: (field: keyof SchoolFormState, value: string) => void;
  errors: Partial<Record<keyof SchoolFormState, string>>; // better than any
}

export default function SchoolIdentity({ form, updateField, errors }: Props) {
  return (
    <section className="rounded-[28px] glass-sm">
      <div className="border-b border-slate-200/60 px-6 py-5 dark:border-slate-800">
        <SectionHeader icon={<GraduationCap size={19} />} title="School Identity" description="..." />
      </div>
      <div className="space-y-5 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="School Name" required error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
              placeholder="Varin High School"
            />
          </Field>
          <Field label="School Code">
            <input
              value={form.schoolCode}
              onChange={(e) => updateField('schoolCode', e.target.value)}
              className={inputClass}
              placeholder="VHS-001"
            />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="School Motto">
            <input
              value={form.motto}
              onChange={(e) => updateField('motto', e.target.value)}
              className={inputClass}
              placeholder="Knowledge. Character. Community."
            />
          </Field>
          <Field label="Website" error={errors.website}>
            <div className="relative">
              <Link2 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.website}
                onChange={(e) => updateField('website', e.target.value)}
                className={`${inputClass} pl-11 ${errors.website ? 'border-red-400' : ''}`}
                placeholder="https://yourschool.edu"
              />
            </div>
          </Field>
        </div>
        <Field label="Description">
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Write a short description of your school's mission and community."
          />
        </Field>
      </div>
    </section>
  );
}