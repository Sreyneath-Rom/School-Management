// src/features/setup/school/GradingSummary.tsx
import { Trophy } from 'lucide-react';
import type { GradeScale } from '@/types/school'; 

export default function GradingSummary({ gradingScale }: { gradingScale: GradeScale[] }) {
  return (
    <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-xl">
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-brand-400" />
        <p className="text-sm font-bold">Grading Summary</p>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {gradingScale.map((item) => (
          <div key={item.id} className={`rounded-xl p-2 text-center ${item.passing ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
            <p className={`text-lg font-black ${item.passing ? 'text-emerald-300' : 'text-red-300'}`}>{item.grade}</p>
            <p className="mt-0.5 text-[9px] text-slate-400">{item.minScore}-{item.maxScore}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-400">
        These grading rules will be used when converting student scores into letter grades and GPA points.
      </p>
    </section>
  );
}