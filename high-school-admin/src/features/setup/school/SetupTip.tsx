// src/features/setup/school/SetupTip.tsx

import { ArrowRight, Lightbulb } from 'lucide-react';

export default function SetupTip() {
  return (
    <section className="glass-sm relative overflow-hidden rounded-[28px] p-5 text-slate-900 dark:text-slate-100">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-400/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300">
            <Lightbulb size={17} />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">
              Setup Tip
            </p>

            <ArrowRight
              size={14}
              className="text-brand-500"
            />
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Configure the grading scale before teachers begin
          entering student results. The same scale can then be
          used for grades, report cards, and student performance
          reports.
        </p>
      </div>
    </section>
  );
}