// src/features/setup/school/SchoolProfileCard.tsx

import { GraduationCap, Sparkles } from 'lucide-react';
import { resolveAssetUrl } from '@/utils/resolveAssetUrl';
import type { SchoolFormState } from '@/types/school';

export default function SchoolProfileCard({ form }: { form: SchoolFormState }) {
  const initials =
    (form?.name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join('') || 'SC';

  const logoUrl = resolveAssetUrl(form?.logoUrl);

  return (
    <section className="glass-sm relative overflow-hidden rounded-[30px]">
      <div className="px-5 py-5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300 shadow-sunken">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-sm font-bold text-fg">School Profile</p>
              <p className="mt-0.5 text-[11px] text-fg-muted">
                Preview of your school identity
              </p>
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted shadow-sunken">
            <GraduationCap size={16} />
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Preview panel — sunken well inside the raised card */}
        <div className="relative overflow-hidden rounded-3xl p-5 text-fg shadow-sunken">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-warning/10 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300 shadow-emboss">
                School Preview
              </span>
              <span className="text-[10px] font-medium text-fg-muted">Live</span>
            </div>

            <div className="flex items-center gap-4">
              {logoUrl ? (
                <div className="shrink-0 rounded-2xl p-1 shadow-emboss">
                  <img src={logoUrl} alt="School logo" className="h-16 w-16 rounded-[14px] object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-fg shadow-emboss">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight text-fg">
                  {form.name || 'Your School Name'}
                </p>

                <div className="mt-2 inline-flex max-w-full items-center rounded-lg px-2.5 py-1 shadow-emboss">
                  <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
                    {form.schoolCode || 'SCHOOL-CODE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 pt-5 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
              <div className="rounded-xl p-3 shadow-emboss">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-fg-muted">
                  Academic Year
                </p>
                <p className="mt-1.5 text-sm font-bold text-fg">
                  {form.academicYear || 'Not configured'}
                </p>
              </div>

              <div className="rounded-xl p-3 shadow-emboss">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-fg-muted">
                  Status
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-sm font-bold text-success">Active</span>
                </div>
              </div>
            </div>

            {form.motto && (
              <div className="mt-4 rounded-xl px-4 py-3 shadow-emboss">
                <p className="text-xs leading-5 italic text-fg-muted">
                  "{form.motto}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}