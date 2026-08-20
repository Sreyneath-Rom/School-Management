// src/features/setup/school/SchoolProfileCard.tsx
import { GraduationCap, Sparkles } from 'lucide-react';
import { resolveAssetUrl } from '@/utils/resolveAssetUrl';
import type { SchoolFormState } from '@/types/school';

export default function SchoolProfileCard({ form }: { form: SchoolFormState }) {
  const initials = form.name.split(' ').filter(Boolean).slice(0, 2).map((part: string) => part[0]?.toUpperCase()).join('') || 'SC';
  const logoUrl = resolveAssetUrl(form.logoUrl);

  return (
    <section className="overflow-hidden rounded-3xl glass-sm">
      <div className="border-b border-slate-200/60 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sparkles size={16} className="text-brand-600 dark:text-brand-400" />
          School Profile
        </div>
      </div>
      <div className="p-5">
        <div className="relative overflow-hidden rounded-3xl glass-sm dark:glass-sm text-slate-900  dark:text-white p-6">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="mb-7 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900  dark:text-white ">School Profile</span>
              <GraduationCap size={19} className="text-slate-900  dark:text-white " />
            </div>
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img src={logoUrl} alt="School logo" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/30" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-2 ring-white/20">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-bold">{form.name || 'Your School Name'}</p>
                <p className="mt-1 text-xs text-slate-900  dark:text-white ">{form.schoolCode || 'SCHOOL-CODE'}</p>
              </div>
            </div>
            <div className="mt-7 border-t border-white/15 pt-4">
              <p className="text-xs text-slate-900  dark:text-white ">Academic Year</p>
              <p className="mt-1 font-semibold">{form.academicYear || 'Not configured'}</p>
            </div>
            {form.motto && <p className="mt-4 text-sm italic text-slate-900  dark:text-white ">“{form.motto}”</p>}
          </div>
        </div>
      </div>
    </section>
  );
}