// src/features/setup/school/SetupTip.tsx
import { ArrowRight } from 'lucide-react';

export default function SetupTip() {
  return (
    <section className="rounded-3xl bg-brand-950 p-5 text-white shadow-xl">
      <div className="flex items-center gap-2">
        <ArrowRight size={16} className="text-brand-300" />
        <p className="text-sm font-bold">Setup Tip</p>
      </div>
      <p className="mt-3 text-xs leading-5 text-brand-100/70">
        Configure the grading scale before teachers begin entering student results. The same scale can then be used for grades, report cards, and student performance reports.
      </p>
    </section>
  );
}