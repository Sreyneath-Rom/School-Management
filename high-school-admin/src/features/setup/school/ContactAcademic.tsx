// src/features/setup/school/ContactAcademic.tsx
import { Phone, Mail, MapPin, CalendarDays } from 'lucide-react';
import Field from './Field';
import SectionHeader from './SectionHeader';
import { inputClass } from './constants';
import type { SchoolFormState } from '@/types/school'; 

interface Props {
  form: SchoolFormState;
  updateField: (field: keyof SchoolFormState, value: string) => void;
  errors: Partial<Record<keyof SchoolFormState, string>>;
}

export default function ContactAcademic({ form, updateField, errors }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Contact Details */}
      <section className="rounded-[28px] glass-sm p-6">
        <SectionHeader
          icon={<Phone size={19} />}
          title="Contact Details"
          description="How families and staff can reach the school."
        />
        <div className="mt-6 space-y-5">
          <Field label="Address">
            <div className="relative">
              <MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={`${inputClass} pl-11`}
                placeholder="Street, city, country"
              />
            </div>
          </Field>
          <Field label="Phone">
            <div className="relative">
              <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={`${inputClass} pl-11`}
                placeholder="+855 12 345 678"
              />
            </div>
          </Field>
          <Field label="Email" error={errors.email}>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`${inputClass} pl-11 ${errors.email ? 'border-red-400' : ''}`}
                placeholder="admin@yourschool.edu"
              />
            </div>
          </Field>
        </div>
      </section>

      {/* Academic Period */}
      <section className="rounded-[28px] glass-sm p-6">
        <SectionHeader
          icon={<CalendarDays size={19} />}
          title="Academic Period"
          description="Set the current academic cycle for the school."
        />
        <div className="mt-6 space-y-5">
          <Field label="Academic Year" required error={errors.academicYear}>
            <input
              value={form.academicYear}
              onChange={(e) => updateField('academicYear', e.target.value)}
              className={`${inputClass} ${errors.academicYear ? 'border-red-400' : ''}`}
              placeholder="2026 – 2027"
            />
          </Field>
          <Field label="Academic Term">
            <input
              value={form.academicTerm}
              onChange={(e) => updateField('academicTerm', e.target.value)}
              className={inputClass}
              placeholder="Term 1"
            />
          </Field>
          <div className="rounded-2xl bg-brand-50/70 p-4 dark:bg-brand-950/30">
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" size={18} />
              <div>
                <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">Current academic setup</p>
                <p className="mt-1 text-xs leading-5 text-brand-800/80 dark:text-brand-200/80">
                  {form.academicYear || 'Academic year not set'} · {form.academicTerm || 'Term not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}