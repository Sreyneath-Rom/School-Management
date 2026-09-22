// src/features/setup/school/ContactAcademic.tsx

import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";

import Field from "./Field";
import SectionHeader from "./SectionHeader";
import { inputClass } from "./constants";

import type { SchoolFormState } from "@/types/school";

interface Props {
  form: SchoolFormState;
  updateField: (field: keyof SchoolFormState, value: string) => void;
  errors: Partial<Record<keyof SchoolFormState, string>>;
}

export default function ContactAcademic({ form, updateField, errors }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* =====================================================
          CONTACT DETAILS
      ====================================================== */}
      <section className="glass-sm relative overflow-hidden rounded-[28px] p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-400/10 blur-3xl" />

        <div className="relative">
          <SectionHeader
            icon={
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
                <Phone size={18} />
              </div>
            }
            title="Contact Details"
            description="How families and staff can reach the school."
          />

          <div className="mt-6 space-y-5">
            <Field label="Address">
              <div className="relative">
                <MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
                <input
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className={`${inputClass} pl-11`}
                  placeholder="Street, city, country"
                />
              </div>
            </Field>

            <Field label="Phone">
              <div className="relative">
                <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={`${inputClass} pl-11`}
                  placeholder="+855 12 345 678"
                />
              </div>
            </Field>

            <Field label="Email" error={errors.email}>
              <div className="relative">
                <Mail
                  size={17}
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 ${
                    errors.email ? "text-error" : "text-fg-muted"
                  }`}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`${inputClass} pl-11 ${
                    errors.email ? "border-error/50 focus:ring-error/25" : ""
                  }`}
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
      <section className="glass-sm relative overflow-hidden rounded-[28px] p-6">
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-warning/10 blur-3xl" />

        <div className="relative">
          <SectionHeader
            icon={
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/15 text-warning">
                <CalendarDays size={18} />
              </div>
            }
            title="Academic Period"
            description="Set the current academic cycle for the school."
          />

          <div className="mt-6 space-y-5">
            <Field label="Academic Year" required error={errors.academicYear}>
              <input
                value={form.academicYear}
                onChange={(e) => updateField("academicYear", e.target.value)}
                className={`${inputClass} ${
                  errors.academicYear ? "border-error/50 focus:ring-error/25" : ""
                }`}
                placeholder="2026 – 2027"
              />
            </Field>

            <Field label="Academic Term">
              <input
                value={form.academicTerm}
                onChange={(e) => updateField("academicTerm", e.target.value)}
                className={inputClass}
                placeholder="Term 1"
              />
            </Field>

            {/* Current setup preview — sunken well, brand-tinted icon
                badge, bottom gradient accent kept as a brand flourish. */}
            <div className="relative overflow-hidden rounded-2xl p-4 shadow-sunken">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
                  <CalendarDays size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-fg">
                    Current academic setup
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-fg-muted">
                    {form.academicYear || "Academic year not set"}
                    {" · "}
                    {form.academicTerm || "Term not set"}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-brand-500 to-warning opacity-60" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}