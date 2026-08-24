// src/features/setup/school/SchoolProfileCard.tsx

import { GraduationCap, Sparkles } from 'lucide-react';

import { resolveAssetUrl } from '@/utils/resolveAssetUrl';

import type { SchoolFormState } from '@/types/school';

export default function SchoolProfileCard({
  form,
}: {
  form: SchoolFormState;
}) {
  const initials =
    form.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join('') || 'SC';

  const logoUrl = resolveAssetUrl(form.logoUrl);

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
      {/* Header */}
      <div className="border-b border-slate-200/70 px-5 py-5 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">
                School Profile
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Preview of your school identity
              </p>
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <GraduationCap size={16} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.8)] dark:border-slate-800">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">
            {/* Preview label */}
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">
                School Preview
              </span>

              <span className="text-[10px] font-medium text-slate-500">
                Live
              </span>
            </div>

            {/* School identity */}
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <div className="shrink-0 rounded-2xl bg-white p-1 shadow-lg">
                  <img
                    src={logoUrl}
                    alt="School logo"
                    className="h-16 w-16 rounded-[14px] object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-xl font-black text-white shadow-lg">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight text-white">
                  {form.name || 'Your School Name'}
                </p>

                <div className="mt-2 inline-flex max-w-full items-center rounded-lg bg-white/[0.07] px-2.5 py-1">
                  <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {form.schoolCode || 'SCHOOL-CODE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic year */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Academic Year
                </p>

                <p className="mt-1.5 text-sm font-bold text-white">
                  {form.academicYear || 'Not configured'}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </p>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-sm font-bold text-emerald-300">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Motto */}
            {form.motto && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs leading-5 italic text-slate-300">
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