// src/features/setup/school/SetupProgress.tsx
import { Check } from 'lucide-react';

export default function SetupProgress({ progress }: { progress: number }) {
  const items = [
    ['School identity', progress >= 10],
    ['Contact details', progress >= 30],
    ['Academic period', progress >= 50],
    ['Grading system', progress >= 70],
    ['Regional setup', progress >= 90],
  ];

  return (
    <section className="rounded-[28px] glass-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Setup Progress</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Complete your school profile.</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          {progress}%
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 space-y-2">
        {items.map(([label, complete]) => (
          <div key={String(label)} className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">{label}</span>
            {complete ? <Check size={15} className="text-emerald-500" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />}
          </div>
        ))}
      </div>
    </section>
  );
}