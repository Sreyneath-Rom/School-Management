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
      <div className="border-b border-(--glass-outline) px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-sm font-bold text-text-main">
                School Profile
              </p>
              <p className="mt-0.5 text-[11px] text-text-main/55">
                Preview of your school identity
              </p>
            </div>
          </div>

          <div className="glass-sm flex h-8 w-8 items-center justify-center rounded-lg text-text-main/65">
            <GraduationCap size={16} />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-5 text-text-main">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <span className="glass-sm rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                School Preview
              </span>

              <span className="text-[10px] font-medium text-text-main/45">
                Live
              </span>
            </div>

            <div className="flex items-center gap-4">
              {logoUrl ? (
                <div className="glass-sm shrink-0 rounded-2xl p-1 shadow-md">
                  <img src={logoUrl} alt="School logo" className="h-16 w-16 rounded-[14px] object-cover" />
                </div>
              ) : (
                <div className="glass-sm flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-text-main">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight text-text-main">
                  {form.name || 'Your School Name'}
                </p>

                <div className="glass-sm mt-2 inline-flex max-w-full items-center rounded-lg px-2.5 py-1">
                  <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-text-main/55">
                    {form.schoolCode || 'SCHOOL-CODE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-(--glass-outline) pt-5">
              <div className="glass-sm rounded-xl p-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-text-main/45">
                  Academic Year
                </p>
                <p className="mt-1.5 text-sm font-bold text-text-main">
                  {form.academicYear || 'Not configured'}
                </p>
              </div>

              <div className="glass-sm rounded-xl p-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-text-main/45">
                  Status
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-sm font-bold text-success">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {form.motto && (
              <div className="glass-sm mt-4 rounded-xl px-4 py-3">
                <p className="text-xs leading-5 italic text-text-main/65">
                  “{form.motto}”
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}