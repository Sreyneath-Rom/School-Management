// src/features/setup/school/ContactAcademic.tsx

import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

import Field from './Field';
import SectionHeader from './SectionHeader';
import { inputClass } from './constants';

import type { SchoolFormState } from '@/types/school';

interface Props {
  form: SchoolFormState;
  updateField: (
    field: keyof SchoolFormState,
    value: string,
  ) => void;
  errors: Partial<Record<keyof SchoolFormState, string>>;
}

export default function ContactAcademic({
  form,
  updateField,
  errors,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* =====================================================
          CONTACT DETAILS
      ====================================================== */}
      <section
        className="
          glass-sm
          relative
          overflow-hidden
          rounded-[28px]
          p-6
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-brand-400/10
            blur-3xl
          "
        />

        <div className="relative">
          <SectionHeader
            icon={
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-brand-500/15
                  text-brand-600
                  shadow-sm
                  dark:bg-brand-400/10
                  dark:text-brand-300
                "
              >
                <Phone size={18} />
              </div>
            }
            title="Contact Details"
            description="How families and staff can reach the school."
          />

          <div className="mt-6 space-y-5">
            {/* Address */}
            <Field label="Address">
              <div className="relative">
                <MapPin
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <input
                  value={form.address}
                  onChange={(e) =>
                    updateField('address', e.target.value)
                  }
                  className={`${inputClass} pl-11`}
                  placeholder="Street, city, country"
                />
              </div>
            </Field>

            {/* Phone */}
            <Field label="Phone">
              <div className="relative">
                <Phone
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField('phone', e.target.value)
                  }
                  className={`${inputClass} pl-11`}
                  placeholder="+855 12 345 678"
                />
              </div>
            </Field>

            {/* Email */}
            <Field
              label="Email"
              error={errors.email}
            >
              <div className="relative">
                <Mail
                  size={17}
                  className={`
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    ${
                      errors.email
                        ? 'text-red-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }
                  `}
                />

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField('email', e.target.value)
                  }
                  className={`
                    ${inputClass}
                    pl-11
                    ${
                      errors.email
                        ? `
                          border-red-400/70
                          focus:border-red-500
                          focus:ring-red-500/10
                          dark:border-red-500/50
                        `
                        : ''
                    }
                  `}
                  placeholder="admin@yourschool.edu"
                />
              </div>
            </Field>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACADEMIC PERIOD
      ====================================================== */}
      <section
        className="
          glass-sm
          relative
          overflow-hidden
          rounded-[28px]
          p-6
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-16
            h-44
            w-44
            rounded-full
            bg-orange-400/10
            blur-3xl
          "
        />

        <div className="relative">
          <SectionHeader
            icon={
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-orange-500/15
                  text-orange-600
                  shadow-sm
                  dark:bg-orange-400/10
                  dark:text-orange-300
                "
              >
                <CalendarDays size={18} />
              </div>
            }
            title="Academic Period"
            description="Set the current academic cycle for the school."
          />

          <div className="mt-6 space-y-5">
            {/* Academic Year */}
            <Field
              label="Academic Year"
              required
              error={errors.academicYear}
            >
              <input
                value={form.academicYear}
                onChange={(e) =>
                  updateField(
                    'academicYear',
                    e.target.value,
                  )
                }
                className={`
                  ${inputClass}
                  ${
                    errors.academicYear
                      ? `
                        border-red-400/70
                        focus:border-red-500
                        focus:ring-red-500/10
                        dark:border-red-500/50
                      `
                      : ''
                  }
                `}
                placeholder="2026 – 2027"
              />
            </Field>

            {/* Academic Term */}
            <Field label="Academic Term">
              <input
                value={form.academicTerm}
                onChange={(e) =>
                  updateField(
                    'academicTerm',
                    e.target.value,
                  )
                }
                className={inputClass}
                placeholder="Term 1"
              />
            </Field>

            {/* Current setup preview */}
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-brand-200/50
                bg-brand-50/60
                p-4
                backdrop-blur-md
                dark:border-brand-800/40
                dark:bg-brand-950/30
              "
            >
              <div className="flex gap-3">
                <div
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-brand-500/15
                    text-brand-600
                    dark:bg-brand-400/10
                    dark:text-brand-300
                  "
                >
                  <CalendarDays size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-900 dark:text-brand-100">
                    Current academic setup
                  </p>

                  <p className="mt-1 truncate text-xs leading-5 text-brand-800/70 dark:text-brand-200/70">
                    {form.academicYear || 'Academic year not set'}
                    {' · '}
                    {form.academicTerm || 'Term not set'}
                  </p>
                </div>
              </div>

              {/* Accent */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-0.5
                  w-full
                  bg-linear-to-r
                  from-brand-500
                  to-orange-400
                  opacity-60
                "
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}